/**
 * Shared logic for scheduling resource create/edit screens.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useSchedulingAccess } from '@hooks';
import {
  getSchedulingResourceConfig,
  sanitizeString,
  SCHEDULING_ROUTE_ROOT,
  withSchedulingContext,
} from '../schedulingResourceConfigs';
import useSchedulingResourceCrud from '../useSchedulingResourceCrud';
import {
  isAccessDeniedError,
  normalizeRecordId,
  normalizeSchedulingContext,
  resolveErrorMessage,
} from '../schedulingScreenUtils';

const getSearchParamValue = (value) => (Array.isArray(value) ? value[0] : value);

const useSchedulingResourceFormScreen = (resourceId) => {
  const config = getSchedulingResourceConfig(resourceId);
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const patientParam = getSearchParamValue(searchParams?.patientId);
  const providerUserParam = getSearchParamValue(searchParams?.providerUserId);
  const scheduleParam = getSearchParamValue(searchParams?.scheduleId);
  const appointmentParam = getSearchParamValue(searchParams?.appointmentId);
  const statusParam = getSearchParamValue(searchParams?.status);
  const dayOfWeekParam = getSearchParamValue(searchParams?.dayOfWeek);
  const isAvailableParam = getSearchParamValue(searchParams?.isAvailable);
  const recordIdParam = getSearchParamValue(searchParams?.id);
  const routeRecordId = useMemo(() => normalizeRecordId(recordIdParam), [recordIdParam]);
  const isEdit = Boolean(routeRecordId);
  const context = useMemo(
    () => normalizeSchedulingContext({
      patientId: patientParam,
      providerUserId: providerUserParam,
      scheduleId: scheduleParam,
      appointmentId: appointmentParam,
      status: statusParam,
      dayOfWeek: dayOfWeekParam,
      isAvailable: isAvailableParam,
    }),
    [
      patientParam,
      providerUserParam,
      scheduleParam,
      appointmentParam,
      statusParam,
      dayOfWeekParam,
      isAvailableParam,
    ]
  );
  const {
    canAccessScheduling,
    canCreateSchedulingRecords,
    canEditSchedulingRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useSchedulingAccess();

  const { get, create, update, data, isLoading, errorCode, reset } = useSchedulingResourceCrud(resourceId);

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  const listPath = useMemo(
    () => withSchedulingContext(config?.routePath || SCHEDULING_ROUTE_ROOT, context),
    [config?.routePath, context]
  );

  const record = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const createInitializedRef = useRef(false);
  const [values, setValues] = useState({});

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
        ...context,
      });

      const nextValues = {
        ...baseValues,
      };

      if (config.requiresTenant) {
        nextValues.tenant_id = sanitizeString(
          sourceRecord?.tenant_id || (!canManageAllTenants ? normalizedTenantId : '')
        );
      }

      if (config.supportsFacility && !sanitizeString(nextValues.facility_id) && normalizedFacilityId) {
        nextValues.facility_id = normalizedFacilityId;
      }

      setValues(nextValues);
    },
    [config, normalizedTenantId, normalizedFacilityId, context, canManageAllTenants]
  );

  useEffect(() => {
    if (!isResolved || !config) return;
    if (!canAccessScheduling || !hasScope) {
      router.replace('/dashboard');
      return;
    }

    if (!isEdit && !canCreateSchedulingRecords) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
      return;
    }

    if (isEdit && !canEditSchedulingRecords) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
      return;
    }

    if (isEdit && !routeRecordId) {
      router.replace(listPath);
    }
  }, [
    isResolved,
    config,
    canAccessScheduling,
    hasScope,
    isEdit,
    canCreateSchedulingRecords,
    canEditSchedulingRecords,
    routeRecordId,
    router,
    listPath,
  ]);

  useEffect(() => {
    if (!config || !isEdit || !routeRecordId || !isResolved || !canEditSchedulingRecords) return;
    reset();
    get(routeRecordId);
  }, [config, isEdit, routeRecordId, isResolved, canEditSchedulingRecords, reset, get]);

  useEffect(() => {
    if (!config || isEdit || !isResolved || !canCreateSchedulingRecords) return;
    if (createInitializedRef.current) return;
    initializeValues(null);
    createInitializedRef.current = true;
  }, [config, isEdit, isResolved, canCreateSchedulingRecords, initializeValues]);

  useEffect(() => {
    if (!record || !config) return;
    initializeValues(record);
  }, [record, config, initializeValues]);

  useEffect(() => {
    if (!record || !config || canManageAllTenants || !config.requiresTenant) return;
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

  const submitErrorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.form.submitErrorMessage`);
  }, [config, t, errorCode]);

  const errors = useMemo(() => {
    if (!config) return {};

    const nextErrors = {};
    const tenantValue = sanitizeString(values.tenant_id);

    if (config.requiresTenant && !tenantValue) {
      nextErrors.tenant_id = t('scheduling.common.form.tenantRequired');
    }

    config.fields.forEach((field) => {
      const rawValue = values[field.name];
      const stringValue = field.type === 'switch' ? rawValue : sanitizeString(rawValue);

      if (field.required && !stringValue) {
        nextErrors[field.name] = t('scheduling.common.form.requiredField');
        return;
      }

      if (field.maxLength && stringValue && String(stringValue).length > field.maxLength) {
        nextErrors[field.name] = t('scheduling.common.form.maxLength', { max: field.maxLength });
      }
    });

    if (typeof config.validate === 'function') {
      const configErrors = config.validate(values, t) || {};
      Object.entries(configErrors).forEach(([key, value]) => {
        if (value) {
          nextErrors[key] = value;
        }
      });
    }

    return nextErrors;
  }, [config, values, t]);

  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    Object.keys(errors).length > 0 ||
    (isEdit ? !canEditSchedulingRecords : !canCreateSchedulingRecords);

  const handleSubmit = useCallback(async () => {
    if (!config || isSubmitDisabled) return;

    const payload = {
      ...config.toPayload(values),
    };

    if (config.requiresTenant) {
      payload.tenant_id = sanitizeString(values.tenant_id);
      if (!canManageAllTenants) {
        payload.tenant_id = normalizedTenantId;
      }
    }

    if (config.supportsFacility) {
      payload.facility_id = sanitizeString(values.facility_id) || undefined;
      if (!canManageAllTenants && normalizedFacilityId && !payload.facility_id) {
        payload.facility_id = normalizedFacilityId;
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
    normalizedFacilityId,
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

  const tenantLocked = Boolean(config?.requiresTenant && (!canManageAllTenants || isEdit));

  return {
    config,
    context,
    isEdit,
    values,
    setFieldValue,
    errors,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    submitErrorMessage,
    isOffline,
    record,
    tenantLocked,
    tenantHint: tenantLocked
      ? t('scheduling.common.form.tenantLockedHint')
      : t('scheduling.common.form.tenantHint'),
    canCreateSchedulingRecords,
    canEditSchedulingRecords,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    isSubmitDisabled,
  };
};

export default useSchedulingResourceFormScreen;
