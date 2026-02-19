/**
 * useApiKeyPermissionFormScreen Hook
 * Shared logic for ApiKeyPermissionFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useI18n,
  useNetwork,
  usePermission,
  useApiKey,
  useApiKeyPermission,
  useTenantAccess,
} from '@hooks';
import { humanizeIdentifier } from '@utils';

const MAX_REFERENCE_FETCH_LIMIT = 100;

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const normalizeValue = (value) => String(value ?? '').trim();
const uniqueArray = (values = []) => [...new Set(values)];

const normalizeFetchLimit = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return MAX_REFERENCE_FETCH_LIMIT;
  return Math.min(MAX_REFERENCE_FETCH_LIMIT, Math.max(1, Math.trunc(numeric)));
};

const useApiKeyPermissionFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, apiKeyId: apiKeyIdParam, permissionId: permissionIdParam } = useLocalSearchParams();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const { get, create, update, data, isLoading, errorCode, reset } = useApiKeyPermission();
  const {
    list: listApiKeys,
    data: apiKeyData,
    isLoading: apiKeyListLoading,
    errorCode: apiKeyErrorCode,
    reset: resetApiKeys,
  } = useApiKey();
  const {
    list: listPermissions,
    data: permissionData,
    isLoading: permissionListLoading,
    errorCode: permissionErrorCode,
    reset: resetPermissions,
  } = usePermission();

  const routeApiKeyPermissionId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeApiKeyPermissionId);
  const canManageApiKeyPermissions = canAccessTenantSettings;
  const canCreateApiKeyPermission = canManageApiKeyPermissions;
  const canEditApiKeyPermission = canManageApiKeyPermissions;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageApiKeyPermissions && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [apiKeyId, setApiKeyId] = useState('');
  const [permissionId, setPermissionId] = useState('');
  const apiKeyPrefillRef = useRef(false);
  const permissionPrefillRef = useRef(false);

  const apiKeyPermission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const apiKeyItems = useMemo(
    () => (Array.isArray(apiKeyData) ? apiKeyData : (apiKeyData?.items ?? [])),
    [apiKeyData]
  );
  const permissionItems = useMemo(
    () => (Array.isArray(permissionData) ? permissionData : (permissionData?.items ?? [])),
    [permissionData]
  );
  const apiKeyLookup = useMemo(() => {
    const map = new Map();
    apiKeyItems.forEach((apiKey) => {
      const keyId = normalizeValue(apiKey?.id);
      if (!keyId) return;
      map.set(keyId, {
        tenantId: normalizeValue(apiKey?.tenant_id || apiKey?.tenant?.id),
      });
    });
    return map;
  }, [apiKeyItems]);
  const permissionLookup = useMemo(() => {
    const map = new Map();
    permissionItems.forEach((permission) => {
      const permissionIdValue = normalizeValue(permission?.id);
      if (!permissionIdValue) return;
      map.set(permissionIdValue, {
        tenantId: normalizeValue(permission?.tenant_id || permission?.tenant?.id),
      });
    });
    return map;
  }, [permissionItems]);
  const apiKeyOptions = useMemo(
    () =>
      apiKeyItems.map((apiKey, index) => ({
        value: normalizeValue(apiKey?.id),
        label: humanizeIdentifier(apiKey.name)
          || humanizeIdentifier(apiKey.label)
          || humanizeIdentifier(apiKey.display_name)
          || humanizeIdentifier(apiKey.slug)
          || (canViewTechnicalIds ? normalizeValue(apiKey.id) : '')
          || t('apiKeyPermission.form.apiKeyOptionFallback', { index: index + 1 }),
      })),
    [apiKeyItems, canViewTechnicalIds, t]
  );
  const permissionOptions = useMemo(
    () =>
      permissionItems.map((permission, index) => ({
        value: normalizeValue(permission?.id),
        label: humanizeIdentifier(permission.name)
          || humanizeIdentifier(permission.code)
          || (canViewTechnicalIds ? normalizeValue(permission.id) : '')
          || t('apiKeyPermission.form.permissionOptionFallback', { index: index + 1 }),
      })),
    [permissionItems, canViewTechnicalIds, t]
  );

  const resolveTenantIdsForSelection = useCallback((nextApiKeyId, nextPermissionId, record) => {
    const selectedApiKeyId = normalizeValue(nextApiKeyId);
    const selectedPermissionId = normalizeValue(nextPermissionId);
    const apiKeyContext = apiKeyLookup.get(selectedApiKeyId);
    const permissionContext = permissionLookup.get(selectedPermissionId);

    return uniqueArray(
      [
        normalizeValue(record?.tenant_id),
        normalizeValue(apiKeyContext?.tenantId),
        normalizeValue(permissionContext?.tenantId),
      ].filter(Boolean)
    );
  }, [apiKeyLookup, permissionLookup]);

  const canAccessTenantScopedSelection = useCallback((nextApiKeyId, nextPermissionId, record) => {
    if (!isTenantScopedAdmin) return true;
    if (!normalizedScopedTenantId) return false;

    const tenantIds = resolveTenantIdsForSelection(nextApiKeyId, nextPermissionId, record);
    if (tenantIds.length === 0) return false;
    return tenantIds.every((tenantIdValue) => tenantIdValue === normalizedScopedTenantId);
  }, [
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    resolveTenantIdsForSelection,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageApiKeyPermissions) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateApiKeyPermission) {
      router.replace('/settings/api-key-permissions?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditApiKeyPermission) {
      router.replace('/settings/api-key-permissions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateApiKeyPermission,
    canEditApiKeyPermission,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeyPermissions || !isEdit || !routeApiKeyPermissionId) return;
    if (!canEditApiKeyPermission) return;
    if (isEdit && routeApiKeyPermissionId) {
      reset();
      get(routeApiKeyPermissionId);
    }
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isEdit,
    routeApiKeyPermissionId,
    canEditApiKeyPermission,
    get,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeyPermissions) return;
    resetApiKeys();
    const params = {
      page: 1,
      limit: normalizeFetchLimit(MAX_REFERENCE_FETCH_LIMIT),
    };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listApiKeys(params);
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listApiKeys,
    resetApiKeys,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeyPermissions) return;
    resetPermissions();
    const params = {
      page: 1,
      limit: normalizeFetchLimit(MAX_REFERENCE_FETCH_LIMIT),
    };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listPermissions(params);
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listPermissions,
    resetPermissions,
  ]);

  useEffect(() => {
    if (apiKeyPermission) {
      setApiKeyId(normalizeValue(apiKeyPermission.api_key_id));
      setPermissionId(normalizeValue(apiKeyPermission.permission_id));
    }
  }, [apiKeyPermission]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeyPermissions || !isTenantScopedAdmin || !isEdit || !apiKeyPermission) return;
    if (apiKeyListLoading || permissionListLoading) return;
    if (!canAccessTenantScopedSelection(
      apiKeyPermission?.api_key_id,
      apiKeyPermission?.permission_id,
      apiKeyPermission
    )) {
      router.replace('/settings/api-key-permissions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isTenantScopedAdmin,
    isEdit,
    apiKeyPermission,
    apiKeyListLoading,
    permissionListLoading,
    canAccessTenantScopedSelection,
    router,
  ]);

  useEffect(() => {
    if (isEdit) return;
    if (apiKeyPrefillRef.current) return;
    const paramValue = Array.isArray(apiKeyIdParam) ? apiKeyIdParam[0] : apiKeyIdParam;
    if (paramValue) {
      setApiKeyId(normalizeValue(paramValue));
      apiKeyPrefillRef.current = true;
      return;
    }
    if (apiKeyOptions.length === 1 && !apiKeyId) {
      setApiKeyId(normalizeValue(apiKeyOptions[0].value));
      apiKeyPrefillRef.current = true;
    }
  }, [isEdit, apiKeyIdParam, apiKeyOptions, apiKeyId]);

  useEffect(() => {
    if (isEdit) return;
    if (permissionPrefillRef.current) return;
    const paramValue = Array.isArray(permissionIdParam) ? permissionIdParam[0] : permissionIdParam;
    if (paramValue) {
      setPermissionId(normalizeValue(paramValue));
      permissionPrefillRef.current = true;
      return;
    }
    if (permissionOptions.length === 1 && !permissionId) {
      setPermissionId(normalizeValue(permissionOptions[0].value));
      permissionPrefillRef.current = true;
    }
  }, [isEdit, permissionIdParam, permissionOptions, permissionId]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeyPermissions) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    router.replace('/settings/api-key-permissions?notice=accessDenied');
  }, [isResolved, canManageApiKeyPermissions, errorCode, router]);

  const trimmedApiKeyId = normalizeValue(apiKeyId);
  const trimmedPermissionId = normalizeValue(permissionId);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'apiKeyPermission.form.submitErrorMessage'),
    [t, errorCode]
  );
  const apiKeyErrorMessage = useMemo(
    () => resolveErrorMessage(t, apiKeyErrorCode, 'apiKeyPermission.form.apiKeyLoadErrorMessage'),
    [t, apiKeyErrorCode]
  );
  const permissionErrorMessage = useMemo(
    () => resolveErrorMessage(t, permissionErrorCode, 'apiKeyPermission.form.permissionLoadErrorMessage'),
    [t, permissionErrorCode]
  );

  const apiKeyListError = Boolean(apiKeyErrorCode);
  const permissionListError = Boolean(permissionErrorCode);
  const hasApiKeys = apiKeyOptions.length > 0;
  const hasPermissions = permissionOptions.length > 0;
  const isCreateBlocked = !isEdit && (!hasApiKeys || !hasPermissions);
  const isTenantScopedSelectionAllowed = canAccessTenantScopedSelection(
    trimmedApiKeyId,
    trimmedPermissionId,
    isEdit ? apiKeyPermission : null
  );
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    !trimmedApiKeyId ||
    !trimmedPermissionId ||
    !isTenantScopedSelectionAllowed;

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateApiKeyPermission) {
        router.replace('/settings/api-key-permissions?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditApiKeyPermission) {
        router.replace('/settings/api-key-permissions?notice=accessDenied');
        return;
      }
      if (!canAccessTenantScopedSelection(
        trimmedApiKeyId,
        trimmedPermissionId,
        isEdit ? apiKeyPermission : null
      )) {
        router.replace('/settings/api-key-permissions?notice=accessDenied');
        return;
      }
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        api_key_id: trimmedApiKeyId,
        permission_id: trimmedPermissionId,
      };
      if (isEdit && routeApiKeyPermissionId) {
        const result = await update(routeApiKeyPermissionId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/api-key-permissions?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    trimmedApiKeyId,
    trimmedPermissionId,
    canCreateApiKeyPermission,
    canEditApiKeyPermission,
    canAccessTenantScopedSelection,
    routeApiKeyPermissionId,
    apiKeyPermission,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/api-key-permissions');
  }, [router]);

  const handleGoToApiKeys = useCallback(() => {
    router.push('/settings/api-keys');
  }, [router]);

  const handleGoToPermissions = useCallback(() => {
    router.push('/settings/permissions');
  }, [router]);

  const handleRetryApiKeys = useCallback(() => {
    if (!isResolved || !canManageApiKeyPermissions) return;
    resetApiKeys();
    const params = {
      page: 1,
      limit: normalizeFetchLimit(MAX_REFERENCE_FETCH_LIMIT),
    };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listApiKeys(params);
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listApiKeys,
    resetApiKeys,
  ]);

  const handleRetryPermissions = useCallback(() => {
    if (!isResolved || !canManageApiKeyPermissions) return;
    resetPermissions();
    const params = {
      page: 1,
      limit: normalizeFetchLimit(MAX_REFERENCE_FETCH_LIMIT),
    };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listPermissions(params);
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listPermissions,
    resetPermissions,
  ]);

  return {
    isEdit,
    apiKeyId,
    setApiKeyId,
    permissionId,
    setPermissionId,
    apiKeyOptions,
    permissionOptions,
    apiKeyListLoading,
    apiKeyListError,
    apiKeyErrorMessage,
    permissionListLoading,
    permissionListError,
    permissionErrorMessage,
    hasApiKeys,
    hasPermissions,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    apiKeyPermission,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToApiKeys: handleGoToApiKeys,
    onGoToPermissions: handleGoToPermissions,
    onRetryApiKeys: handleRetryApiKeys,
    onRetryPermissions: handleRetryPermissions,
    isSubmitDisabled,
    testID: 'api-key-permission-form-screen',
  };
};

export default useApiKeyPermissionFormScreen;
