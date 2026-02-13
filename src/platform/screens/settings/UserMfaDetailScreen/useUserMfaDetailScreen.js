/**
 * useUserMfaDetailScreen Hook
 * Shared logic for UserMfaDetailScreen across platforms.
 * File: useUserMfaDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useTenantAccess, useUserMfa } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useUserMfaDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useUserMfa();
  const userMfaId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageUserMfas = canAccessTenantSettings;
  const canEditUserMfa = canManageUserMfas;
  const canDeleteUserMfa = canManageUserMfas;
  const isTenantScopedAdmin = canManageUserMfas && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const userMfa = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageUserMfas || !userMfaId) return;
    reset();
    get(userMfaId);
  }, [isResolved, canManageUserMfas, userMfaId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserMfas) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageUserMfas,
    isTenantScopedAdmin,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageUserMfas || !isTenantScopedAdmin || !userMfa) return;
    const recordTenantId = String(userMfa?.tenant_id ?? '').trim();
    if (recordTenantId && recordTenantId !== normalizedTenantId) {
      router.replace('/settings/user-mfas?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUserMfas,
    isTenantScopedAdmin,
    userMfa,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserMfas) return;
    if (userMfa) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/user-mfas?notice=accessDenied');
    }
  }, [isResolved, canManageUserMfas, userMfa, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/user-mfas');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditUserMfa || !userMfaId) return;
    router.push(`/settings/user-mfas/${userMfaId}/edit`);
  }, [canEditUserMfa, userMfaId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteUserMfa || !userMfaId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(userMfaId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/user-mfas?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteUserMfa, userMfaId, remove, isOffline, router, t]);

  return {
    id: userMfaId,
    userMfa,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditUserMfa ? handleEdit : undefined,
    onDelete: canDeleteUserMfa ? handleDelete : undefined,
  };
};

export default useUserMfaDetailScreen;
