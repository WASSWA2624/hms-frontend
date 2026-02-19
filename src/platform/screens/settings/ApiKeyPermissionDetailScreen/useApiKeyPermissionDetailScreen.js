/**
 * useApiKeyPermissionDetailScreen Hook
 * Shared logic for ApiKeyPermissionDetailScreen across platforms.
 * File: useApiKeyPermissionDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useI18n,
  useNetwork,
  useApiKey,
  usePermission,
  useApiKeyPermission,
  useTenantAccess,
} from '@hooks';
import { confirmAction, humanizeIdentifier } from '@utils';

const MAX_REFERENCE_FETCH_LIMIT = 100;

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const normalizeValue = (value) => String(value ?? '').trim();
const uniqueArray = (values = []) => [...new Set(values)];

const resolveReadableValue = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = humanizeIdentifier(candidate);
    if (normalized) return normalizeValue(normalized);
  }
  return '';
};

const resolveContextValue = (readableValue, technicalId, canViewTechnicalIds, fallbackLabel) => {
  if (readableValue) return readableValue;

  const normalizedTechnicalId = normalizeValue(technicalId);
  if (!normalizedTechnicalId) return '';
  if (canViewTechnicalIds) return normalizedTechnicalId;
  return fallbackLabel;
};

const normalizeFetchLimit = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return MAX_REFERENCE_FETCH_LIMIT;
  return Math.min(MAX_REFERENCE_FETCH_LIMIT, Math.max(1, Math.trunc(numeric)));
};

const useApiKeyPermissionDetailScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useTenantAccess();
  const { get, remove, data, isLoading, errorCode, reset } = useApiKeyPermission();
  const {
    list: listApiKeys,
    data: apiKeyData,
    isLoading: apiKeyListLoading,
    reset: resetApiKeys,
  } = useApiKey();
  const {
    list: listPermissions,
    data: permissionData,
    isLoading: permissionListLoading,
    reset: resetPermissions,
  } = usePermission();
  const apiKeyPermissionId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageApiKeyPermissions = canAccessTenantSettings;
  const canEditApiKeyPermission = canManageApiKeyPermissions;
  const canDeleteApiKeyPermission = canManageApiKeyPermissions;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageApiKeyPermissions && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);

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
    apiKeyItems.forEach((apiKey, index) => {
      const apiKeyId = normalizeValue(apiKey?.id);
      if (!apiKeyId) return;
      const apiKeyLabel = resolveReadableValue(
        apiKey?.name,
        apiKey?.label,
        apiKey?.display_name,
        apiKey?.slug
      ) || (canViewTechnicalIds ? apiKeyId : t('apiKeyPermission.form.apiKeyOptionFallback', { index: index + 1 }));
      map.set(apiKeyId, {
        label: apiKeyLabel,
        tenantId: normalizeValue(apiKey?.tenant_id || apiKey?.tenant?.id),
        tenantLabel: resolveReadableValue(
          apiKey?.tenant_name,
          apiKey?.tenant?.name,
          apiKey?.tenant?.slug,
          apiKey?.tenant_label
        ),
      });
    });
    return map;
  }, [apiKeyItems, canViewTechnicalIds, t]);

  const permissionLookup = useMemo(() => {
    const map = new Map();
    permissionItems.forEach((permission, index) => {
      const permissionId = normalizeValue(permission?.id);
      if (!permissionId) return;
      const permissionLabel = resolveReadableValue(
        permission?.name,
        permission?.code
      ) || (canViewTechnicalIds
        ? permissionId
        : t('apiKeyPermission.form.permissionOptionFallback', { index: index + 1 }));
      map.set(permissionId, {
        label: permissionLabel,
        tenantId: normalizeValue(permission?.tenant_id || permission?.tenant?.id),
        tenantLabel: resolveReadableValue(
          permission?.tenant_name,
          permission?.tenant?.name,
          permission?.tenant?.slug,
          permission?.tenant_label
        ),
      });
    });
    return map;
  }, [permissionItems, canViewTechnicalIds, t]);

  const resolveApiKeyPermissionTenantContext = useCallback((record) => {
    const explicitTenantId = normalizeValue(record?.tenant_id);
    const explicitTenantLabel = resolveReadableValue(
      record?.tenant_name,
      record?.tenant?.name,
      record?.tenant?.slug,
      record?.tenant_label
    );
    const apiKeyId = normalizeValue(record?.api_key_id);
    const permissionId = normalizeValue(record?.permission_id);
    const apiKeyContext = apiKeyLookup.get(apiKeyId);
    const permissionContext = permissionLookup.get(permissionId);

    const tenantIds = uniqueArray(
      [
        explicitTenantId,
        normalizeValue(apiKeyContext?.tenantId),
        normalizeValue(permissionContext?.tenantId),
      ].filter(Boolean)
    );
    const tenantLabel = explicitTenantLabel || resolveReadableValue(
      apiKeyContext?.tenantLabel,
      permissionContext?.tenantLabel
    );

    return {
      tenantIds,
      tenantId: tenantIds[0] || '',
      tenantLabel,
    };
  }, [apiKeyLookup, permissionLookup]);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );
  const apiKeyLabel = useMemo(() => {
    if (!apiKeyPermission) return '';
    const apiKeyId = normalizeValue(apiKeyPermission?.api_key_id);
    const apiKeyContext = apiKeyLookup.get(apiKeyId);

    return resolveContextValue(
      resolveReadableValue(
        apiKeyPermission?.api_key_name,
        apiKeyPermission?.api_key?.name,
        apiKeyPermission?.api_key?.slug,
        apiKeyPermission?.api_key_label,
        apiKeyPermission?.apiKey_name,
        apiKeyPermission?.apiKey?.name,
        apiKeyPermission?.apiKey_label,
        apiKeyContext?.label
      ),
      apiKeyId,
      canViewTechnicalIds,
      t('apiKeyPermission.detail.currentApiKey')
    );
  }, [apiKeyPermission, apiKeyLookup, canViewTechnicalIds, t]);

  const permissionLabel = useMemo(() => {
    if (!apiKeyPermission) return '';
    const permissionId = normalizeValue(apiKeyPermission?.permission_id);
    const permissionContext = permissionLookup.get(permissionId);

    return resolveContextValue(
      resolveReadableValue(
        apiKeyPermission?.permission_name,
        apiKeyPermission?.permission?.name,
        apiKeyPermission?.permission?.code,
        apiKeyPermission?.permission_label,
        permissionContext?.label
      ),
      permissionId,
      canViewTechnicalIds,
      t('apiKeyPermission.detail.currentPermission')
    );
  }, [apiKeyPermission, permissionLookup, canViewTechnicalIds, t]);

  const tenantLabel = useMemo(() => {
    if (!apiKeyPermission) return '';
    const { tenantLabel: resolvedTenantLabel, tenantId: resolvedTenantId } = (
      resolveApiKeyPermissionTenantContext(apiKeyPermission)
    );

    return resolveContextValue(
      resolvedTenantLabel,
      resolvedTenantId,
      canViewTechnicalIds,
      t('apiKeyPermission.detail.currentTenant')
    );
  }, [apiKeyPermission, resolveApiKeyPermissionTenantContext, canViewTechnicalIds, t]);

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageApiKeyPermissions || !apiKeyPermissionId) return;
    reset();
    get(apiKeyPermissionId);
  }, [isResolved, canManageApiKeyPermissions, apiKeyPermissionId, get, reset]);

  const fetchReferenceData = useCallback(() => {
    if (!isResolved || !canManageApiKeyPermissions) return;
    if (isTenantScopedAdmin && !normalizedTenantId) return;

    const params = {
      page: 1,
      limit: normalizeFetchLimit(MAX_REFERENCE_FETCH_LIMIT),
    };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedTenantId;
    }

    resetApiKeys();
    resetPermissions();
    listApiKeys(params);
    listPermissions(params);
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isTenantScopedAdmin,
    normalizedTenantId,
    resetApiKeys,
    resetPermissions,
    listApiKeys,
    listPermissions,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageApiKeyPermissions) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isTenantScopedAdmin,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    fetchReferenceData();
  }, [fetchReferenceData]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeyPermissions || !isTenantScopedAdmin || !apiKeyPermission) return;
    if (apiKeyListLoading || permissionListLoading) return;

    const { tenantIds } = resolveApiKeyPermissionTenantContext(apiKeyPermission);
    if (tenantIds.length === 0 || tenantIds.some((tenantIdValue) => tenantIdValue !== normalizedTenantId)) {
      router.replace('/settings/api-key-permissions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isTenantScopedAdmin,
    apiKeyPermission,
    apiKeyListLoading,
    permissionListLoading,
    normalizedTenantId,
    resolveApiKeyPermissionTenantContext,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeyPermissions) return;
    if (apiKeyPermission) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/api-key-permissions?notice=accessDenied');
    }
  }, [isResolved, canManageApiKeyPermissions, apiKeyPermission, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
    fetchReferenceData();
  }, [fetchDetail, fetchReferenceData]);

  const handleBack = useCallback(() => {
    router.push('/settings/api-key-permissions');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditApiKeyPermission || !apiKeyPermissionId) return;
    router.push(`/settings/api-key-permissions/${apiKeyPermissionId}/edit`);
  }, [canEditApiKeyPermission, apiKeyPermissionId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteApiKeyPermission || !apiKeyPermissionId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(apiKeyPermissionId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/api-key-permissions?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteApiKeyPermission, apiKeyPermissionId, remove, isOffline, router, t]);

  return {
    id: apiKeyPermissionId,
    apiKeyPermission,
    apiKeyLabel,
    permissionLabel,
    tenantLabel,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditApiKeyPermission ? handleEdit : undefined,
    onDelete: canDeleteApiKeyPermission ? handleDelete : undefined,
  };
};

export default useApiKeyPermissionDetailScreen;
