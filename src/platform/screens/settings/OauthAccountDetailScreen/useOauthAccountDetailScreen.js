/**
 * useOauthAccountDetailScreen Hook
 * Shared logic for OauthAccountDetailScreen across platforms.
 * File: useOauthAccountDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useOauthAccount, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useOauthAccountDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useOauthAccount();
  const oauthAccountId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageOauthAccounts = canAccessTenantSettings;
  const canEditOauthAccount = canManageOauthAccounts;
  const canDeleteOauthAccount = canManageOauthAccounts;
  const isTenantScopedAdmin = canManageOauthAccounts && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const oauthAccount = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageOauthAccounts || !oauthAccountId) return;
    reset();
    get(oauthAccountId);
  }, [isResolved, canManageOauthAccounts, oauthAccountId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageOauthAccounts) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageOauthAccounts,
    isTenantScopedAdmin,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageOauthAccounts || !isTenantScopedAdmin || !oauthAccount) return;
    const recordTenantId = String(oauthAccount?.tenant_id ?? '').trim();
    if (recordTenantId && recordTenantId !== normalizedTenantId) {
      router.replace('/settings/oauth-accounts?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageOauthAccounts,
    isTenantScopedAdmin,
    oauthAccount,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageOauthAccounts) return;
    if (oauthAccount) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/oauth-accounts?notice=accessDenied');
    }
  }, [isResolved, canManageOauthAccounts, oauthAccount, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/oauth-accounts');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditOauthAccount || !oauthAccountId) return;
    router.push(`/settings/oauth-accounts/${oauthAccountId}/edit`);
  }, [canEditOauthAccount, oauthAccountId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteOauthAccount || !oauthAccountId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(oauthAccountId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/oauth-accounts?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteOauthAccount, oauthAccountId, remove, isOffline, router, t]);

  return {
    id: oauthAccountId,
    oauthAccount,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && !!errorCode,
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditOauthAccount ? handleEdit : undefined,
    onDelete: canDeleteOauthAccount ? handleDelete : undefined,
  };
};

export default useOauthAccountDetailScreen;
