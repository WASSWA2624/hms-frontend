/**
 * Shared logic for patient resource create/edit screens.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useFacility,
  useI18n,
  useNetwork,
  usePatient,
  usePatientAccess,
  useTenant,
} from '@hooks';
import { humanizeDisplayText } from '@utils';
import {
  getPatientResourceConfig,
  normalizeRouteId,
  PATIENT_ROUTE_ROOT,
  sanitizeString,
  withPatientContext,
} from '../patientResourceConfigs';
import usePatientResourceCrud from '../usePatientResourceCrud';
import {
  isAccessDeniedError,
  normalizePatientContextId,
  resolvePatientDisplayLabel,
  resolveErrorMessage,
} from '../patientScreenUtils';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_ONLY_FIELDS = new Set(['date_of_birth', 'diagnosis_date', 'granted_at', 'revoked_at']);
const MAX_PATIENT_LOOKUP_LIMIT = 100;
const MAX_LOOKUP_LIMIT = 100;
const DEFAULT_LOOKUP_PAGE = 1;

const resolveTenantOptionLabel = (tenant, fallbackLabel) => {
  const candidates = [tenant?.name, tenant?.display_name, tenant?.slug, tenant?.code];
  const readable = candidates.map((value) => sanitizeString(value)).find(Boolean);
  return readable || fallbackLabel;
};

const resolveFacilityOptionLabel = (facility, fallbackLabel) => {
  const candidates = [facility?.name, facility?.display_name, facility?.code, facility?.slug];
  const readable = candidates.map((value) => sanitizeString(value)).find(Boolean);
  return readable || fallbackLabel;
};

const resolveItems = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const usePatientResourceFormScreen = (resourceId) => {
  const config = getPatientResourceConfig(resourceId);
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, patientId: patientIdParam } = useLocalSearchParams();
  const {
    canAccessPatients,
    canCreatePatientRecords,
    canEditPatientRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = usePatientAccess();

  const { get, create, update, data, isLoading, errorCode, reset } = usePatientResourceCrud(resourceId);

  const {
    list: listPatients,
    data: patientData,
    isLoading: patientListLoading,
    errorCode: patientListErrorCode,
    reset: resetPatientList,
  } = usePatient();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantListErrorCode,
    reset: resetTenantList,
  } = useTenant();
  const {
    list: listFacilities,
    data: facilityData,
    isLoading: facilityListLoading,
    errorCode: facilityListErrorCode,
    reset: resetFacilityList,
  } = useFacility();

  const routeRecordId = useMemo(() => normalizeRouteId(id), [id]);
  const isEdit = Boolean(routeRecordId);
  const patientContextId = useMemo(
    () => normalizePatientContextId(patientIdParam),
    [patientIdParam]
  );

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  const listPath = useMemo(
    () => withPatientContext(config?.routePath || PATIENT_ROUTE_ROOT, patientContextId),
    [config?.routePath, patientContextId]
  );

  const record = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const createInitializedRef = useRef(false);
  const previousFacilityTenantRef = useRef('');
  const resourceLabel = useMemo(() => {
    if (!config) return '';
    const pluralLabel = t(`${config.i18nKey}.pluralLabel`);
    if (pluralLabel !== `${config.i18nKey}.pluralLabel`) return pluralLabel;
    const label = t(`${config.i18nKey}.label`);
    if (label !== `${config.i18nKey}.label`) return label;
    return humanizeDisplayText(config.id || '') || '';
  }, [config, t]);
  const formModeLabel = useMemo(
    () => t(isEdit ? 'patients.common.form.modeEdit' : 'patients.common.form.modeCreate'),
    [t, isEdit]
  );
  const formDescription = useMemo(
    () => t('patients.common.form.description', { resource: resourceLabel, mode: formModeLabel }),
    [t, resourceLabel, formModeLabel]
  );
  const helpContent = useMemo(() => ({
    label: t('patients.common.form.helpLabel', { resource: resourceLabel }),
    tooltip: t('patients.common.form.helpTooltip', { resource: resourceLabel }),
    title: t('patients.common.form.helpTitle', { resource: resourceLabel }),
    body: t('patients.common.form.helpBody', { resource: resourceLabel, mode: formModeLabel }),
    items: [
      t('patients.common.form.helpItems.context'),
      t('patients.common.form.helpItems.required'),
      t('patients.common.form.helpItems.actions'),
      t('patients.common.form.helpItems.recovery'),
    ],
  }), [t, resourceLabel, formModeLabel]);

  const [values, setValues] = useState({});
  const showTenantField = !isEdit && canManageAllTenants && !normalizedTenantId;
  const hidePatientFieldForEdit = Boolean(isEdit && config?.hidePatientSelectorOnEdit);
  const hidePatientFieldForRouteContext = Boolean(
    patientContextId && config?.hidePatientSelectorWhenContextProvided
  );
  const showPatientField = Boolean(
    config?.requiresPatientSelection
      && !hidePatientFieldForEdit
      && !hidePatientFieldForRouteContext
  );
  const shouldHideFacilityField = Boolean(config?.supportsFacility && normalizedFacilityId);
  const selectedTenantForFacility = sanitizeString(values.tenant_id || normalizedTenantId);
  const facilityRequiresTenantSelection = Boolean(
    config?.supportsFacility && !shouldHideFacilityField && !selectedTenantForFacility
  );

  const patientItems = useMemo(() => {
    if (!showPatientField) return [];
    return resolveItems(patientData);
  }, [showPatientField, patientData]);
  const tenantItems = useMemo(() => {
    if (!showTenantField) return [];
    return resolveItems(tenantData);
  }, [showTenantField, tenantData]);
  const facilityItems = useMemo(
    () => resolveItems(facilityData),
    [facilityData]
  );

  const patientOptions = useMemo(
    () =>
      patientItems
        .map((patient, index) => {
          const patientId = sanitizeString(patient?.id);
          if (!patientId) return null;
          return {
            value: patientId,
            label: resolvePatientDisplayLabel(
              patient,
              t('patients.common.form.unnamedPatient', { position: index + 1 })
            ),
          };
        })
        .filter(Boolean),
    [patientItems, t]
  );
  const tenantOptions = useMemo(
    () =>
      tenantItems
        .map((tenant, index) => {
          const tenantId = sanitizeString(tenant?.id);
          if (!tenantId) return null;
          return {
            value: tenantId,
            label: resolveTenantOptionLabel(
              tenant,
              t('patients.common.form.unnamedTenant', { position: index + 1 })
            ),
          };
        })
        .filter(Boolean),
    [tenantItems, t]
  );
  const facilityOptions = useMemo(
    () =>
      facilityItems
        .map((facility, index) => {
          const facilityIdValue = sanitizeString(facility?.id);
          if (!facilityIdValue) return null;
          return {
            value: facilityIdValue,
            label: resolveFacilityOptionLabel(
              facility,
              t('patients.common.form.unnamedFacility', { position: index + 1 })
            ),
          };
        })
        .filter(Boolean),
    [facilityItems, t]
  );

  const setFieldValue = useCallback((fieldName, nextValue) => {
    setValues((previous) => ({
      ...previous,
      [fieldName]: nextValue,
    }));
  }, []);

  const initializeValues = useCallback(
    (sourceRecord) => {
      if (!config) return;
      const baseValues = config.getInitialValues(sourceRecord, {
        tenantId: normalizedTenantId,
        facilityId: normalizedFacilityId,
      });

      const nextValues = {
        ...baseValues,
        tenant_id: sanitizeString(sourceRecord?.tenant_id || normalizedTenantId),
      };

      if (config.requiresPatientSelection) {
        nextValues.patient_id = sanitizeString(sourceRecord?.patient_id || patientContextId);
      }

      if (config.supportsFacility && !sanitizeString(nextValues.facility_id) && normalizedFacilityId) {
        nextValues.facility_id = normalizedFacilityId;
      }

      setValues(nextValues);
    },
    [
      config,
      normalizedTenantId,
      normalizedFacilityId,
      patientContextId,
    ]
  );

  useEffect(() => {
    if (!isResolved || !config) return;
    if (!canAccessPatients || !hasScope) {
      router.replace('/dashboard');
      return;
    }

    if (isEdit && config.supportsEdit === false) {
      router.replace(withPatientContext(`${config.routePath}/${routeRecordId}`, patientContextId));
      return;
    }

    if (!isEdit && !canCreatePatientRecords) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
      return;
    }

    if (isEdit && !canEditPatientRecords) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
      return;
    }

    if (isEdit && !routeRecordId) {
      router.replace(listPath);
    }
  }, [
    isResolved,
    config,
    canAccessPatients,
    hasScope,
    isEdit,
    routeRecordId,
    patientContextId,
    canCreatePatientRecords,
    canEditPatientRecords,
    router,
    listPath,
  ]);

  useEffect(() => {
    if (!config || !isEdit || !routeRecordId || !isResolved || !canEditPatientRecords) return;
    reset();
    get(routeRecordId);
  }, [config, isEdit, routeRecordId, isResolved, canEditPatientRecords, reset, get]);

  useEffect(() => {
    if (!config || isEdit || !isResolved || !canCreatePatientRecords) return;
    if (createInitializedRef.current) return;
    initializeValues(null);
    createInitializedRef.current = true;
  }, [config, isEdit, isResolved, canCreatePatientRecords, initializeValues]);

  useEffect(() => {
    if (!record || !config) return;
    initializeValues(record);
  }, [record, config, initializeValues]);

  useEffect(() => {
    if (!showPatientField || !isResolved || !canAccessPatients) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    resetPatientList();
    const params = { page: DEFAULT_LOOKUP_PAGE, limit: MAX_PATIENT_LOOKUP_LIMIT };
    if (!canManageAllTenants && normalizedTenantId) {
      params.tenant_id = normalizedTenantId;
    } else if (canManageAllTenants && selectedTenantForFacility) {
      params.tenant_id = selectedTenantForFacility;
    }
    listPatients(params);
  }, [
    showPatientField,
    isResolved,
    canAccessPatients,
    canManageAllTenants,
    normalizedTenantId,
    selectedTenantForFacility,
    resetPatientList,
    listPatients,
  ]);

  useEffect(() => {
    if (!showTenantField || !isResolved || !canAccessPatients) return;
    resetTenantList();
    listTenants({
      page: DEFAULT_LOOKUP_PAGE,
      limit: MAX_LOOKUP_LIMIT,
    });
  }, [
    showTenantField,
    isResolved,
    canAccessPatients,
    resetTenantList,
    listTenants,
  ]);

  useEffect(() => {
    if (!config?.supportsFacility || shouldHideFacilityField || !isResolved || !canAccessPatients) return;
    if (!selectedTenantForFacility) {
      resetFacilityList();
      return;
    }
    resetFacilityList();
    listFacilities({
      page: DEFAULT_LOOKUP_PAGE,
      limit: MAX_LOOKUP_LIMIT,
      tenant_id: selectedTenantForFacility,
    });
  }, [
    config?.supportsFacility,
    shouldHideFacilityField,
    isResolved,
    canAccessPatients,
    selectedTenantForFacility,
    resetFacilityList,
    listFacilities,
  ]);

  useEffect(() => {
    if (!config?.supportsFacility || shouldHideFacilityField || isEdit) return;
    const previousTenantId = previousFacilityTenantRef.current;
    if (previousTenantId && previousTenantId !== selectedTenantForFacility) {
      setValues((previousValues) => ({
        ...previousValues,
        facility_id: '',
      }));
    }
    previousFacilityTenantRef.current = selectedTenantForFacility;
  }, [config?.supportsFacility, shouldHideFacilityField, isEdit, selectedTenantForFacility]);

  useEffect(() => {
    if (!record || !config || canManageAllTenants) return;
    const recordTenantId = sanitizeString(record.tenant_id);
    if (!recordTenantId || recordTenantId !== normalizedTenantId) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
    }
  }, [record, config, canManageAllTenants, normalizedTenantId, router, listPath]);

  useEffect(() => {
    if (!isEdit || !config || !isResolved) return;
    if (record) return;
    if (isAccessDeniedError(errorCode)) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
    }
  }, [isEdit, config, isResolved, record, errorCode, router, listPath]);

  const patientListErrorMessage = useMemo(() => {
    if (!showPatientField) return null;
    return resolveErrorMessage(
      t,
      patientListErrorCode,
      `${config.i18nKey}.form.patientLoadErrorMessage`
    );
  }, [showPatientField, config, t, patientListErrorCode]);

  const submitErrorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.form.submitErrorMessage`);
  }, [config, t, errorCode]);
  const tenantListErrorMessage = useMemo(() => {
    if (!showTenantField) return null;
    return resolveErrorMessage(t, tenantListErrorCode, 'patients.common.form.tenantLoadErrorMessage');
  }, [showTenantField, t, tenantListErrorCode]);
  const facilityListErrorMessage = useMemo(() => {
    if (!config?.supportsFacility || shouldHideFacilityField) return null;
    return resolveErrorMessage(t, facilityListErrorCode, 'patients.common.form.facilityLoadErrorMessage');
  }, [config?.supportsFacility, shouldHideFacilityField, t, facilityListErrorCode]);

  const errors = useMemo(() => {
    if (!config) return {};

    const nextErrors = {};
    const tenantValue = sanitizeString(values.tenant_id);
    const patientValue = sanitizeString(values.patient_id);

    if (!isEdit && !tenantValue) {
      nextErrors.tenant_id = t('patients.common.form.tenantRequired');
    }

    if (config.requiresPatientSelection && !patientValue) {
      nextErrors.patient_id = t('patients.common.form.patientRequired');
    }

    config.fields.forEach((field) => {
      const rawValue = values[field.name];
      const stringValue = field.type === 'switch' ? rawValue : sanitizeString(rawValue);

      if (field.required && !stringValue) {
        nextErrors[field.name] = t('patients.common.form.requiredField');
        return;
      }

      if (field.maxLength && stringValue && String(stringValue).length > field.maxLength) {
        nextErrors[field.name] = t('patients.common.form.maxLength', { max: field.maxLength });
        return;
      }

      if (DATE_ONLY_FIELDS.has(field.name) && stringValue && !DATE_REGEX.test(String(stringValue))) {
        nextErrors[field.name] = t('patients.common.form.dateFormat');
      }
    });

    return nextErrors;
  }, [config, values, t]);

  const hasPatients = useMemo(() => {
    if (!config?.requiresPatientSelection) return true;
    if (!showPatientField) return Boolean(sanitizeString(values.patient_id));
    if (sanitizeString(values.patient_id)) return true;
    return patientOptions.length > 0;
  }, [config?.requiresPatientSelection, showPatientField, values.patient_id, patientOptions.length]);
  const hasTenants = useMemo(() => {
    if (!showTenantField) return true;
    if (sanitizeString(values.tenant_id)) return true;
    return tenantOptions.length > 0;
  }, [showTenantField, values.tenant_id, tenantOptions.length]);
  const hasFacilities = useMemo(() => {
    if (!config?.supportsFacility || shouldHideFacilityField) return true;
    if (sanitizeString(values.facility_id)) return true;
    return facilityOptions.length > 0;
  }, [config?.supportsFacility, shouldHideFacilityField, values.facility_id, facilityOptions.length]);

  const isCreateBlocked = !isEdit && !hasPatients;
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    Object.keys(errors).length > 0 ||
    (isEdit ? !canEditPatientRecords : !canCreatePatientRecords);

  const handleSubmit = useCallback(async () => {
    if (!config || isSubmitDisabled) return;

    const payload = {
      ...config.toPayload(values),
    };

    if (config.requiresPatientSelection && !isEdit) {
      payload.patient_id = sanitizeString(values.patient_id);
    }

    if (config.supportsFacility) {
      const facilityValue = sanitizeString(values.facility_id);
      if (facilityValue) {
        payload.facility_id = facilityValue;
      } else if (isEdit && !shouldHideFacilityField) {
        payload.facility_id = null;
      } else {
        payload.facility_id = undefined;
      }
    }

    if (!isEdit) {
      payload.tenant_id = sanitizeString(values.tenant_id);
      if (!canManageAllTenants) {
        payload.tenant_id = normalizedTenantId;
      }
    }

    try {
      const result = isEdit && routeRecordId
        ? await update(routeRecordId, payload)
        : await create(payload);

      if (!result) return;

      const noticeType = isOffline ? 'queued' : isEdit ? 'updated' : 'created';
      const separator = listPath.includes('?') ? '&' : '?';
      router.replace(`${listPath}${separator}notice=${noticeType}`);
    } catch {
      // Hook-level error handling already updates state.
    }
  }, [
    config,
    isSubmitDisabled,
    values,
    canManageAllTenants,
    normalizedTenantId,
    isEdit,
    shouldHideFacilityField,
    routeRecordId,
    update,
    create,
    isOffline,
    listPath,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push(listPath);
  }, [router, listPath]);

  const handleRetryPatients = useCallback(() => {
    if (!showPatientField) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    resetPatientList();
    const params = { page: DEFAULT_LOOKUP_PAGE, limit: MAX_PATIENT_LOOKUP_LIMIT };
    if (!canManageAllTenants && normalizedTenantId) {
      params.tenant_id = normalizedTenantId;
    } else if (canManageAllTenants && selectedTenantForFacility) {
      params.tenant_id = selectedTenantForFacility;
    }
    listPatients(params);
  }, [
    showPatientField,
    canManageAllTenants,
    normalizedTenantId,
    selectedTenantForFacility,
    resetPatientList,
    listPatients,
  ]);
  const handleRetryTenants = useCallback(() => {
    if (!showTenantField) return;
    resetTenantList();
    listTenants({
      page: DEFAULT_LOOKUP_PAGE,
      limit: MAX_LOOKUP_LIMIT,
    });
  }, [showTenantField, resetTenantList, listTenants]);
  const handleRetryFacilities = useCallback(() => {
    if (!config?.supportsFacility || shouldHideFacilityField || !selectedTenantForFacility) return;
    resetFacilityList();
    listFacilities({
      page: DEFAULT_LOOKUP_PAGE,
      limit: MAX_LOOKUP_LIMIT,
      tenant_id: selectedTenantForFacility,
    });
  }, [
    config?.supportsFacility,
    shouldHideFacilityField,
    selectedTenantForFacility,
    resetFacilityList,
    listFacilities,
  ]);

  const handleGoToPatients = useCallback(() => {
    router.push('/patients/patients');
  }, [router]);

  const tenantLocked = !canManageAllTenants || isEdit;
  const visibleFields = useMemo(
    () =>
      (config?.fields || [])
        .filter((field) => {
          if (!field) return false;
          if (field.name === 'facility_id' && shouldHideFacilityField) {
            return false;
          }
          return true;
        })
        .map((field) => {
          if (field.name === 'facility_id') {
            return {
              ...field,
              options: facilityOptions,
            };
          }
          return field;
        }),
    [config?.fields, shouldHideFacilityField, facilityOptions]
  );

  return {
    config,
    resourceLabel,
    formDescription,
    helpContent,
    visibleFields,
    showTenantField,
    showPatientField,
    isEdit,
    values,
    setFieldValue,
    errors,
    tenantOptions,
    tenantListLoading: showTenantField ? tenantListLoading : false,
    tenantListError: showTenantField ? Boolean(tenantListErrorCode) : false,
    tenantListErrorMessage,
    hasTenants,
    facilityListLoading: Boolean(config?.supportsFacility) && !shouldHideFacilityField ? facilityListLoading : false,
    facilityListError: Boolean(config?.supportsFacility) && !shouldHideFacilityField ? Boolean(facilityListErrorCode) : false,
    facilityListErrorMessage,
    hasFacilities,
    facilityRequiresTenantSelection,
    patientOptions,
    patientListLoading: showPatientField ? patientListLoading : false,
    patientListError: showPatientField ? Boolean(patientListErrorCode) : false,
    patientListErrorMessage,
    hasPatients,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    submitErrorMessage,
    isOffline,
    record,
    tenantLocked,
    tenantHint: tenantLocked
      ? t('patients.common.form.tenantLockedHint')
      : t('patients.common.form.tenantHint'),
    canCreatePatientRecords,
    canEditPatientRecords,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    onRetryPatients: handleRetryPatients,
    onGoToPatients: handleGoToPatients,
    isSubmitDisabled,
  };
};

export default usePatientResourceFormScreen;
