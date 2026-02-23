import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  useFacility,
  useI18n,
  useNetwork,
  usePatient,
  usePatientAccess,
  useTenant,
} from '@hooks';
import { normalizeIsoDateTime, toDateInputValue } from '@utils';
import { isEntitlementDeniedError, resolveErrorMessage } from '../patientScreenUtils';

const sanitizeString = (value) => String(value || '').trim();
const MAX_REFERENCE_FETCH_LIMIT = 100;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const NOTICE_AUTO_DISMISS_MS = 4500;
const EMPTY_NOTICE_STATE = Object.freeze({ message: '', variant: 'info' });

const resolveItems = (value) => {
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value)) return value;
  return [];
};

const extractInputValue = (valueOrEvent) => {
  if (typeof valueOrEvent === 'boolean') return valueOrEvent;
  if (valueOrEvent && typeof valueOrEvent === 'object') {
    if (typeof valueOrEvent.target?.value !== 'undefined') {
      return valueOrEvent.target.value;
    }
    if (typeof valueOrEvent.nativeEvent?.text !== 'undefined') {
      return valueOrEvent.nativeEvent.text;
    }
  }
  return valueOrEvent;
};

const isValidDateOnly = (value) => {
  const normalized = sanitizeString(value);
  if (!DATE_ONLY_REGEX.test(normalized)) return false;

  const [yearText, monthText, dayText] = normalized.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(parsed.getTime())) return false;

  return (
    parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day
  );
};

const isFutureDateOnly = (value) => {
  const normalized = sanitizeString(value);
  if (!isValidDateOnly(normalized)) return false;

  const today = new Date();
  const todayDateOnly = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return normalized > todayDateOnly;
};

const resolveTenantLabel = (tenant, fallbackLabel) =>
  sanitizeString(tenant?.name)
  || sanitizeString(tenant?.human_friendly_id)
  || sanitizeString(fallbackLabel);

const resolveFacilityLabel = (facility, fallbackLabel) =>
  sanitizeString(facility?.name)
  || sanitizeString(facility?.human_friendly_id)
  || sanitizeString(fallbackLabel);

const hasOptionValue = (options, value) => {
  const normalizedValue = sanitizeString(value);
  if (!normalizedValue) return false;
  return (options || []).some((option) => sanitizeString(option?.value) === normalizedValue);
};

const validate = (values, t, context = {}) => {
  const {
    requiresTenantSelection = false,
    tenantOptions = [],
    facilityOptions = [],
  } = context;
  const errors = {};

  const normalizedTenantId = sanitizeString(values.tenant_id);
  const normalizedFacilityId = sanitizeString(values.facility_id);
  const normalizedFirstName = sanitizeString(values.first_name);
  const normalizedLastName = sanitizeString(values.last_name);
  const normalizedDateOfBirth = toDateInputValue(values.date_of_birth);

  if (requiresTenantSelection && !sanitizeString(values.tenant_id)) {
    errors.tenant_id = t('patients.common.form.tenantRequired');
  } else if (
    requiresTenantSelection
    && normalizedTenantId
    && tenantOptions.length > 0
    && !hasOptionValue(tenantOptions, normalizedTenantId)
  ) {
    errors.tenant_id = t('patients.common.form.invalidTenantSelection');
  }

  if (!normalizedFirstName) {
    errors.first_name = t('patients.common.form.requiredField');
  } else if (normalizedFirstName.length > 120) {
    errors.first_name = t('patients.common.form.maxLength', { max: 120 });
  }

  if (!normalizedLastName) {
    errors.last_name = t('patients.common.form.requiredField');
  } else if (normalizedLastName.length > 120) {
    errors.last_name = t('patients.common.form.maxLength', { max: 120 });
  }

  if (normalizedDateOfBirth && !isValidDateOnly(normalizedDateOfBirth)) {
    errors.date_of_birth = t('patients.common.form.dateFormat');
  } else if (normalizedDateOfBirth && isFutureDateOnly(normalizedDateOfBirth)) {
    errors.date_of_birth = t('patients.common.form.dateNotInFuture');
  }

  if (
    normalizedFacilityId
    && facilityOptions.length > 0
    && !hasOptionValue(facilityOptions, normalizedFacilityId)
  ) {
    errors.facility_id = t('patients.common.form.invalidFacilitySelection');
  }

  return errors;
};

const usePatientQuickCreateScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { create, isLoading, errorCode, reset } = usePatient();
  const {
    canAccessPatients,
    canCreatePatientRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = usePatientAccess();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: isTenantLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();
  const {
    list: listFacilities,
    data: facilityData,
    isLoading: isFacilityLoading,
    errorCode: facilityErrorCode,
    reset: resetFacilities,
  } = useFacility();

  const [values, setValues] = useState({
    tenant_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    facility_id: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [noticeState, setNoticeState] = useState(EMPTY_NOTICE_STATE);

  const normalizedTenantId = sanitizeString(tenantId);
  const normalizedFacilityId = sanitizeString(facilityId);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const requiresTenantSelection = canManageAllTenants;
  const resolvedTenantId = requiresTenantSelection
    ? sanitizeString(values.tenant_id)
    : normalizedTenantId;
  const isInitialLoading = !isResolved;
  const isSubmitting = isResolved && isLoading;

  const fetchTenants = useCallback(() => {
    if (!requiresTenantSelection || !canAccessPatients || isOffline || !canCreatePatientRecords) return;
    resetTenants();
    listTenants({
      page: 1,
      limit: MAX_REFERENCE_FETCH_LIMIT,
      sort_by: 'name',
      order: 'asc',
    });
  }, [
    requiresTenantSelection,
    canAccessPatients,
    isOffline,
    canCreatePatientRecords,
    listTenants,
    resetTenants,
  ]);

  const fetchFacilities = useCallback((tenantIdForQuery = resolvedTenantId) => {
    const normalizedTenant = sanitizeString(tenantIdForQuery);
    if (!normalizedTenant || isOffline || !canAccessPatients || !canCreatePatientRecords) {
      resetFacilities();
      return;
    }

    resetFacilities();
    listFacilities({
      page: 1,
      limit: MAX_REFERENCE_FETCH_LIMIT,
      sort_by: 'name',
      order: 'asc',
      tenant_id: normalizedTenant,
    });
  }, [
    resolvedTenantId,
    isOffline,
    canAccessPatients,
    canCreatePatientRecords,
    resetFacilities,
    listFacilities,
  ]);

  useEffect(() => {
    setValues((current) => ({
      ...current,
      tenant_id: requiresTenantSelection ? current.tenant_id : normalizedTenantId,
      facility_id: current.facility_id || (
        requiresTenantSelection ? '' : normalizedFacilityId
      ),
    }));
  }, [requiresTenantSelection, normalizedTenantId, normalizedFacilityId]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessPatients || !hasScope) {
      router.replace('/dashboard');
    }
    if (!canCreatePatientRecords) {
      router.replace('/patients/patients?notice=accessDenied');
    }
  }, [
    isResolved,
    canAccessPatients,
    hasScope,
    canCreatePatientRecords,
    router,
  ]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  useEffect(() => {
    fetchFacilities(resolvedTenantId);
  }, [fetchFacilities, resolvedTenantId]);

  const tenantOptions = useMemo(
    () =>
      resolveItems(tenantData).map((tenant, index) => ({
        value: sanitizeString(tenant?.id),
        label: resolveTenantLabel(
          tenant,
          t('patients.common.form.unnamedTenant', { position: index + 1 })
        ),
      })),
    [tenantData, t]
  );

  const facilityOptions = useMemo(
    () => {
      const options = resolveItems(facilityData).map((facility, index) => ({
        value: sanitizeString(facility?.id),
        label: resolveFacilityLabel(
          facility,
          t('patients.common.form.unnamedFacility', { position: index + 1 })
        ),
      }));

      const selectedFacilityId = sanitizeString(values.facility_id);
      if (selectedFacilityId && !hasOptionValue(options, selectedFacilityId)) {
        options.unshift({
          value: selectedFacilityId,
          label: selectedFacilityId,
        });
      }

      return [
        {
          value: '',
          label: t('patients.resources.patients.form.facilityPlaceholder'),
        },
        ...options,
      ];
    },
    [facilityData, values.facility_id, t]
  );

  const genderOptions = useMemo(
    () => [
      { value: 'MALE', label: t('patients.resources.patients.options.gender.male') },
      { value: 'FEMALE', label: t('patients.resources.patients.options.gender.female') },
      { value: 'OTHER', label: t('patients.resources.patients.options.gender.other') },
      { value: 'UNKNOWN', label: t('patients.resources.patients.options.gender.unknown') },
    ],
    [t]
  );

  const activeEntitlementErrorCode = errorCode || tenantErrorCode || facilityErrorCode;
  const isEntitlementBlocked = isEntitlementDeniedError(activeEntitlementErrorCode);
  const hasError = isResolved && Boolean(errorCode) && !isEntitlementBlocked;

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'patients.resources.patients.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'patients.common.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'patients.common.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );

  const setActionNotice = useCallback((message, variant = 'info') => {
    const normalizedMessage = sanitizeString(message);
    if (!normalizedMessage) return;

    setNoticeState({
      message: normalizedMessage,
      variant: sanitizeString(variant) || 'info',
    });
  }, []);

  const onDismissNotice = useCallback(() => {
    setNoticeState(EMPTY_NOTICE_STATE);
  }, []);

  useEffect(() => {
    if (!noticeState.message) return undefined;
    const timerId = setTimeout(() => {
      setNoticeState(EMPTY_NOTICE_STATE);
    }, NOTICE_AUTO_DISMISS_MS);
    return () => clearTimeout(timerId);
  }, [noticeState.message]);

  const onChange = useCallback((name, valueOrEvent) => {
    const extractedValue = extractInputValue(valueOrEvent);
    const normalizedValue = (
      name === 'date_of_birth'
        ? toDateInputValue(extractedValue)
        : extractedValue
    );

    setValues((current) => {
      if (name === 'tenant_id') {
        return {
          ...current,
          tenant_id: sanitizeString(normalizedValue),
          facility_id: '',
        };
      }

      if (name === 'is_active') {
        return { ...current, [name]: Boolean(normalizedValue) };
      }

      return { ...current, [name]: normalizedValue };
    });

    setErrors((current) => ({
      ...current,
      [name]: undefined,
      ...(name === 'tenant_id' ? { facility_id: undefined } : {}),
    }));
  }, []);

  const onCancel = useCallback(() => {
    router.replace('/patients/patients');
  }, [router]);

  const onRetryTenants = useCallback(() => {
    fetchTenants();
  }, [fetchTenants]);

  const onRetryFacilities = useCallback(() => {
    fetchFacilities(resolvedTenantId);
  }, [fetchFacilities, resolvedTenantId]);

  const onRetry = useCallback(() => {
    reset();
    fetchTenants();
    fetchFacilities(resolvedTenantId);
  }, [reset, fetchTenants, fetchFacilities, resolvedTenantId]);

  const onGoToSubscriptions = useCallback(() => {
    router.push('/subscriptions/subscriptions');
  }, [router]);

  const onSubmit = useCallback(async () => {
    if (!canCreatePatientRecords || isSubmitting || isInitialLoading) return;

    const nextErrors = validate(values, t, {
      requiresTenantSelection,
      tenantOptions,
      facilityOptions,
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setActionNotice(t('patients.common.form.validationErrors'), 'error');
      return;
    }

    const payload = {
      tenant_id: sanitizeString(values.tenant_id) || normalizedTenantId,
      first_name: sanitizeString(values.first_name),
      last_name: sanitizeString(values.last_name),
      date_of_birth: normalizeIsoDateTime(values.date_of_birth),
      gender: sanitizeString(values.gender) || undefined,
      facility_id: sanitizeString(values.facility_id) || undefined,
      is_active: values.is_active !== false,
    };

    const created = await create(payload);
    if (!created) {
      setActionNotice(
        resolveErrorMessage(t, errorCode, 'patients.resources.patients.form.submitErrorMessage')
          || t('patients.resources.patients.form.submitErrorMessage'),
        'error'
      );
      return;
    }

    const createdRoutePatientId = sanitizeString(created?.human_friendly_id);
    const noticeKey = isOffline ? 'queued' : 'created';
    if (createdRoutePatientId) {
      router.replace(`/patients/patients/${encodeURIComponent(createdRoutePatientId)}?tab=details`);
      return;
    }

    router.replace(`/patients/patients?notice=${noticeKey}`);
  }, [
    canCreatePatientRecords,
    isSubmitting,
    isInitialLoading,
    values,
    t,
    requiresTenantSelection,
    tenantOptions,
    facilityOptions,
    normalizedTenantId,
    create,
    router,
    isOffline,
    setActionNotice,
    errorCode,
  ]);

  const isSubmitDisabled = (
    !canCreatePatientRecords
    || isInitialLoading
    || isSubmitting
    || isEntitlementBlocked
  );

  return {
    values,
    errors,
    genderOptions,
    tenantOptions,
    facilityOptions,
    isLoading: !isResolved || isLoading,
    isSubmitting,
    isOffline,
    hasError,
    errorMessage,
    isEntitlementBlocked,
    tenantErrorCode,
    tenantErrorMessage,
    facilityErrorCode,
    facilityErrorMessage,
    isTenantLoading,
    isFacilityLoading,
    requiresTenantSelection,
    canCreatePatientRecords,
    isSubmitDisabled,
    noticeMessage: noticeState.message,
    noticeVariant: noticeState.variant,
    onChange,
    onCancel,
    onRetry,
    onRetryTenants,
    onRetryFacilities,
    onSubmit,
    onDismissNotice,
    onGoToSubscriptions,
  };
};

export default usePatientQuickCreateScreen;
