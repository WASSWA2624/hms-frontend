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
import { isEntitlementDeniedError, resolveErrorMessage } from '../patientScreenUtils';

const sanitizeString = (value) => String(value || '').trim();
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const resolveItems = (value) => {
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value)) return value;
  return [];
};

const resolveTenantLabel = (tenant, fallbackLabel) =>
  sanitizeString(tenant?.name)
  || sanitizeString(tenant?.human_friendly_id)
  || sanitizeString(fallbackLabel);

const resolveFacilityLabel = (facility, fallbackLabel) =>
  sanitizeString(facility?.name)
  || sanitizeString(facility?.human_friendly_id)
  || sanitizeString(fallbackLabel);

const validate = (values, t, requiresTenantSelection) => {
  const errors = {};
  if (requiresTenantSelection && !sanitizeString(values.tenant_id)) {
    errors.tenant_id = t('patients.common.form.tenantRequired');
  }
  if (!sanitizeString(values.first_name)) {
    errors.first_name = t('patients.common.form.requiredField');
  } else if (sanitizeString(values.first_name).length > 120) {
    errors.first_name = t('patients.common.form.maxLength', { max: 120 });
  }
  if (!sanitizeString(values.last_name)) {
    errors.last_name = t('patients.common.form.requiredField');
  } else if (sanitizeString(values.last_name).length > 120) {
    errors.last_name = t('patients.common.form.maxLength', { max: 120 });
  }
  if (sanitizeString(values.date_of_birth) && !DATE_ONLY_REGEX.test(sanitizeString(values.date_of_birth))) {
    errors.date_of_birth = t('patients.common.form.dateFormat');
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
  } = useTenant();
  const {
    list: listFacilities,
    data: facilityData,
    isLoading: isFacilityLoading,
    errorCode: facilityErrorCode,
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

  const normalizedTenantId = sanitizeString(tenantId);
  const normalizedFacilityId = sanitizeString(facilityId);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const requiresTenantSelection = canManageAllTenants;
  const resolvedTenantId = requiresTenantSelection
    ? sanitizeString(values.tenant_id)
    : normalizedTenantId;

  useEffect(() => {
    setValues((current) => ({
      ...current,
      tenant_id: requiresTenantSelection ? current.tenant_id : normalizedTenantId,
      facility_id: current.facility_id || normalizedFacilityId,
    }));
  }, [requiresTenantSelection, normalizedTenantId, normalizedFacilityId]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessPatients || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessPatients, hasScope, router]);

  useEffect(() => {
    if (!requiresTenantSelection || !canAccessPatients || isOffline) return;
    listTenants({ page: 1, limit: 100, sort_by: 'name', order: 'asc' });
  }, [requiresTenantSelection, canAccessPatients, isOffline, listTenants]);

  useEffect(() => {
    if (!resolvedTenantId || isOffline || !canAccessPatients) return;
    listFacilities({
      page: 1,
      limit: 100,
      sort_by: 'name',
      order: 'asc',
      tenant_id: resolvedTenantId,
    });
  }, [resolvedTenantId, isOffline, canAccessPatients, listFacilities]);

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
    () =>
      resolveItems(facilityData).map((facility, index) => ({
        value: sanitizeString(facility?.id),
        label: resolveFacilityLabel(
          facility,
          t('patients.common.form.unnamedFacility', { position: index + 1 })
        ),
      })),
    [facilityData, t]
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

  const hasError = isResolved && Boolean(errorCode);
  const isEntitlementBlocked = isEntitlementDeniedError(errorCode);
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

  const onChange = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }, []);

  const onCancel = useCallback(() => {
    router.replace('/patients/patients');
  }, [router]);

  const onRetry = useCallback(() => {
    reset();
  }, [reset]);

  const onGoToSubscriptions = useCallback(() => {
    router.push('/subscriptions/subscriptions');
  }, [router]);

  const onSubmit = useCallback(async () => {
    if (!canCreatePatientRecords || isLoading) return;

    const nextErrors = validate(values, t, requiresTenantSelection);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      tenant_id: sanitizeString(values.tenant_id) || normalizedTenantId,
      first_name: sanitizeString(values.first_name),
      last_name: sanitizeString(values.last_name),
      date_of_birth: sanitizeString(values.date_of_birth)
        ? `${sanitizeString(values.date_of_birth)}T00:00:00.000Z`
        : undefined,
      gender: sanitizeString(values.gender) || undefined,
      facility_id: sanitizeString(values.facility_id) || undefined,
      is_active: values.is_active !== false,
    };

    const created = await create(payload);
    const createdRoutePatientId = sanitizeString(created?.human_friendly_id);
    if (createdRoutePatientId) {
      router.replace(`/patients/patients/${encodeURIComponent(createdRoutePatientId)}?tab=summary`);
      return;
    }

    router.replace('/patients/patients?notice=queued');
  }, [
    canCreatePatientRecords,
    isLoading,
    values,
    t,
    requiresTenantSelection,
    normalizedTenantId,
    create,
    router,
  ]);

  return {
    values,
    errors,
    genderOptions,
    tenantOptions,
    facilityOptions,
    isLoading: !isResolved || isLoading,
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
    onChange,
    onCancel,
    onRetry,
    onSubmit,
    onGoToSubscriptions,
  };
};

export default usePatientQuickCreateScreen;
