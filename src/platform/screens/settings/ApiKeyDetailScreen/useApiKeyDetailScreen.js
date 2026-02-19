/**
 * useApiKeyDetailScreen Hook
 * Shared logic for ApiKeyDetailScreen across platforms.
 * File: useApiKeyDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useApiKey, useTenantAccess } from '@hooks';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useApiKeyDetailScreen = () => {
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
  const { get, data, isLoading, errorCode, reset } = useApiKey();

  const apiKeyId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);

  const canManageApiKeys = canAccessTenantSettings;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageApiKeys && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const apiKey = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageApiKeys || !apiKeyId) return;
    if (isTenantScopedAdmin && !normalizedTenantId) return;
    reset();
    get(apiKeyId);
  }, [
    isResolved,
    canManageApiKeys,
    isTenantScopedAdmin,
    normalizedTenantId,
    apiKeyId,
    get,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageApiKeys) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageApiKeys, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeys || !isTenantScopedAdmin || !apiKey) return;
    const recordTenantId = String(apiKey?.tenant_id ?? '').trim();
    if (recordTenantId && recordTenantId !== normalizedTenantId) {
      router.replace('/settings/api-keys?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageApiKeys,
    isTenantScopedAdmin,
    apiKey,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeys) return;
    if (apiKey) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/api-keys?notice=accessDenied');
    }
  }, [isResolved, canManageApiKeys, apiKey, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/api-keys');
  }, [router]);

  return {
    id: apiKeyId,
    apiKey,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: undefined,
    onDelete: undefined,
  };
};

export default useApiKeyDetailScreen;
