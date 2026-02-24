/**
 * Shared logic for Clinical resource create/edit screens.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useScopeAccess } from '@hooks';
import {
  getClinicalResourceConfig,
  resolveClinicalResourceScope,
  sanitizeString,
  CLINICAL_ROUTE_ROOT,
  withClinicalContext,
} from '../ClinicalResourceConfigs';
import useClinicalResourceCrud from '../useClinicalResourceCrud';
import {
  isAccessDeniedError,
  normalizeRecordId,
  normalizeClinicalContext,
  resolveErrorMessage,
} from '../ClinicalScreenUtils';

const getSearchParamValue = (value) => (Array.isArray(value) ? value[0] : value);

const buildSearchParamsSignature = (params = {}) => {
  if (!params || typeof params !== 'object') return '';

  return Object.keys(params)
    .sort()
    .map((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        return `${key}:${value.map((entry) => sanitizeString(entry)).join(',')}`;
      }
      return `${key}:${sanitizeString(value)}`;
    })
    .join('|');
};

const useClinicalResourceFormScreen = (resourceId) => {
  const config = getClinicalResourceConfig(resourceId);
  const resolvedScope = useMemo(
    () => resolveClinicalResourceScope(resourceId),
    [resourceId]
  );
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const searchParamsSignature = useMemo(
    () => buildSearchParamsSignature(searchParams),
    [searchParams]
  );
  const recordIdParam = getSearchParamValue(searchParams?.id);
  const routeRecordId = useMemo(() => normalizeRecordId(recordIdParam), [recordIdParam]);
  const isEdit = Boolean(routeRecordId);
  const context = useMemo(
    () => normalizeClinicalContext(searchParams),
    [searchParamsSignature]
  );
  const {
    canRead: canAccessClinical,
    canWrite: canManageClinicalRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useScopeAccess(resolvedScope);
  const canCreateClinicalRecords = canManageClinicalRecords;
  const canEditClinicalRecords = canManageClinicalRecords;

  const { get, create, update, data, isLoading, errorCode, reset } = useClinicalResourceCrud(resourceId);

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const canCreateResource = Boolean(canCreateClinicalRecords && config?.allowCreate !== false);
  const canEditResource = Boolean(canEditClinicalRecords && config?.allowEdit !== false);

  const listPath = useMemo(
    () => withClinicalContext(config?.routePath || CLINICAL_ROUTE_ROOT, context),
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
    if (!canAccessClinical || !hasScope) {
      router.replace('/dashboard');
      return;
    }

    if (!isEdit && !canCreateResource) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
      return;
    }

    if (isEdit && !canEditResource) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
      return;
    }

    if (isEdit && !routeRecordId) {
      router.replace(listPath);
    }
  }, [
    isResolved,
    config,
    canAccessClinical,
    hasScope,
    isEdit,
    canCreateResource,
    canEditResource,
    routeRecordId,
    router,
    listPath,
  ]);

  useEffect(() => {
    if (!config || !isEdit || !routeRecordId || !isResolved || !canEditResource) return;
    reset();
    get(routeRecordId);
  }, [config, isEdit, routeRecordId, isResolved, canEditResource, reset, get]);

  useEffect(() => {
    if (!config || isEdit || !isResolved || !canCreateResource) return;
    if (createInitializedRef.current) return;
    initializeValues(null);
    createInitializedRef.current = true;
  }, [config, isEdit, isResolved, canCreateResource, initializeValues]);

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

  const resolvedFields = useMemo(() => {
    if (!config) return [];
    return (config.fields || []).map((field) => {
      const options = typeof field.options === 'function'
        ? field.options({ isEdit, values, context, record })
        : field.options;
      const disabledByRule = typeof field.isDisabled === 'function'
        ? field.isDisabled({ isEdit, values, context, record })
        : Boolean(field.isDisabled);

      return {
        ...field,
        options: options || [],
        disabled: Boolean(disabledByRule || (isEdit && field.disableOnEdit)),
      };
    });
  }, [config, isEdit, values, context, record]);

  const errors = useMemo(() => {
    if (!config) return {};

    const nextErrors = {};
    const tenantValue = sanitizeString(values.tenant_id);

    if (config.requiresTenant && !isEdit && !tenantValue) {
      nextErrors.tenant_id = t('clinical.common.form.tenantRequired');
    }

    resolvedFields.forEach((field) => {
      const rawValue = values[field.name];
      const stringValue = field.type === 'switch' ? rawValue : sanitizeString(rawValue);
      if (field.disabled) return;

      if (field.required && !stringValue) {
        nextErrors[field.name] = t('clinical.common.form.requiredField');
        return;
      }

      if (field.maxLength && stringValue && String(stringValue).length > field.maxLength) {
        nextErrors[field.name] = t('clinical.common.form.maxLength', { max: field.maxLength });
      }
    });

    if (typeof config.validate === 'function') {
      const configErrors = config.validate(values, t, { isEdit }) || {};
      Object.entries(configErrors).forEach(([key, value]) => {
        if (value) {
          nextErrors[key] = value;
        }
      });
    }

    return nextErrors;
  }, [config, values, t, resolvedFields, isEdit]);

  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    Object.keys(errors).length > 0 ||
    (isEdit ? !canEditResource : !canCreateResource);

  const handleSubmit = useCallback(async () => {
    if (!config || isSubmitDisabled) return;

    const payload = { ...config.toPayload(values, { isEdit }) };

    if (config.requiresTenant && !isEdit) {
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
    resolvedFields,
    record,
    tenantLocked,
    tenantHint: tenantLocked
      ? t('clinical.common.form.tenantLockedHint')
      : t('clinical.common.form.tenantHint'),
    canCreateClinicalRecords: canCreateResource,
    canEditClinicalRecords: canEditResource,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    isSubmitDisabled,
  };
};

export default useClinicalResourceFormScreen;
