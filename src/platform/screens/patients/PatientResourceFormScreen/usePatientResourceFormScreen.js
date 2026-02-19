/**
 * Shared logic for patient resource create/edit screens.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, usePatient, usePatientAccess } from '@hooks';
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
  resolveErrorMessage,
} from '../patientScreenUtils';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_ONLY_FIELDS = new Set(['date_of_birth', 'diagnosis_date', 'granted_at', 'revoked_at']);
const MAX_PATIENT_LOOKUP_LIMIT = 100;

const resolvePatientOptionLabel = (patient, fallbackLabel) => {
  const firstName = sanitizeString(patient?.first_name);
  const lastName = sanitizeString(patient?.last_name);
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName) return fullName;

  const readableIdentity = [
    patient?.patient_code,
    patient?.patient_number,
    patient?.medical_record_number,
    patient?.mrn,
    patient?.identifier_value,
    patient?.name,
  ]
    .map((value) => sanitizeString(value))
    .find(Boolean);

  return readableIdentity || fallbackLabel;
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

  const [values, setValues] = useState({});

  const patientItems = useMemo(() => {
    if (!config?.requiresPatientSelection) return [];
    if (Array.isArray(patientData)) return patientData;
    if (Array.isArray(patientData?.items)) return patientData.items;
    return [];
  }, [config?.requiresPatientSelection, patientData]);

  const patientOptions = useMemo(
    () =>
      patientItems
        .map((patient, index) => {
          const patientId = sanitizeString(patient?.id);
          if (!patientId) return null;
          return {
            value: patientId,
            label: resolvePatientOptionLabel(
              patient,
              t('patients.common.form.unnamedPatient', { position: index + 1 })
            ),
          };
        })
        .filter(Boolean),
    [patientItems, t]
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
        tenant_id: sanitizeString(sourceRecord?.tenant_id || (!canManageAllTenants ? normalizedTenantId : '')),
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
      canManageAllTenants,
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
    if (!config?.requiresPatientSelection || !isResolved || !canAccessPatients) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    resetPatientList();
    const params = { page: 1, limit: MAX_PATIENT_LOOKUP_LIMIT };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    listPatients(params);
  }, [
    config?.requiresPatientSelection,
    isResolved,
    canAccessPatients,
    canManageAllTenants,
    normalizedTenantId,
    resetPatientList,
    listPatients,
  ]);

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
    if (!config?.requiresPatientSelection) return null;
    return resolveErrorMessage(
      t,
      patientListErrorCode,
      `${config.i18nKey}.form.patientLoadErrorMessage`
    );
  }, [config, t, patientListErrorCode]);

  const submitErrorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.form.submitErrorMessage`);
  }, [config, t, errorCode]);

  const errors = useMemo(() => {
    if (!config) return {};

    const nextErrors = {};
    const tenantValue = sanitizeString(values.tenant_id);
    const patientValue = sanitizeString(values.patient_id);

    if (!tenantValue) {
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
    if (sanitizeString(values.patient_id)) return true;
    return patientOptions.length > 0;
  }, [config?.requiresPatientSelection, values.patient_id, patientOptions.length]);

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
      tenant_id: sanitizeString(values.tenant_id),
      ...config.toPayload(values),
    };

    if (config.requiresPatientSelection) {
      payload.patient_id = sanitizeString(values.patient_id);
    }

    if (config.supportsFacility) {
      payload.facility_id = sanitizeString(values.facility_id) || undefined;
    }

    if (!canManageAllTenants) {
      payload.tenant_id = normalizedTenantId;
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
    if (!config?.requiresPatientSelection) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    resetPatientList();
    const params = { page: 1, limit: MAX_PATIENT_LOOKUP_LIMIT };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    listPatients(params);
  }, [
    config?.requiresPatientSelection,
    canManageAllTenants,
    normalizedTenantId,
    resetPatientList,
    listPatients,
  ]);

  const handleGoToPatients = useCallback(() => {
    router.push('/patients/patients');
  }, [router]);

  const tenantLocked = !canManageAllTenants || isEdit;
  const showTenantField = canManageAllTenants;
  const visibleFields = useMemo(
    () => (config?.fields || []).filter((field) => {
      if (!field) return false;
      if (field.name === 'facility_id' && !canManageAllTenants && normalizedFacilityId) {
        return false;
      }
      return true;
    }),
    [config?.fields, canManageAllTenants, normalizedFacilityId]
  );

  return {
    config,
    visibleFields,
    showTenantField,
    isEdit,
    values,
    setFieldValue,
    errors,
    patientOptions,
    patientListLoading,
    patientListError: Boolean(patientListErrorCode),
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
    onRetryPatients: handleRetryPatients,
    onGoToPatients: handleGoToPatients,
    isSubmitDisabled,
  };
};

export default usePatientResourceFormScreen;
