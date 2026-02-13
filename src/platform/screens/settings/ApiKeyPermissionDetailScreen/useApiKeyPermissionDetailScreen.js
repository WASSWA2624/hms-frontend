/**
 * useApiKeyPermissionDetailScreen Hook
 * Shared logic for ApiKeyPermissionDetailScreen across platforms.
 * File: useApiKeyPermissionDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useApiKeyPermission, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
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
  const apiKeyPermissionId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageApiKeyPermissions = canAccessTenantSettings;
  const canEditApiKeyPermission = canManageApiKeyPermissions;
  const canDeleteApiKeyPermission = canManageApiKeyPermissions;
  const isTenantScopedAdmin = canManageApiKeyPermissions && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const apiKeyPermission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageApiKeyPermissions || !apiKeyPermissionId) return;
    reset();
    get(apiKeyPermissionId);
  }, [isResolved, canManageApiKeyPermissions, apiKeyPermissionId, get, reset]);

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
    if (!isResolved || !canManageApiKeyPermissions || !isTenantScopedAdmin || !apiKeyPermission) return;
    const recordTenantId = String(apiKeyPermission?.tenant_id ?? '').trim();
    if (recordTenantId && recordTenantId !== normalizedTenantId) {
      router.replace('/settings/api-key-permissions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageApiKeyPermissions,
    isTenantScopedAdmin,
    apiKeyPermission,
    normalizedTenantId,
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
  }, [fetchDetail]);

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
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditApiKeyPermission ? handleEdit : undefined,
    onDelete: canDeleteApiKeyPermission ? handleDelete : undefined,
  };
};

export default useApiKeyPermissionDetailScreen;
