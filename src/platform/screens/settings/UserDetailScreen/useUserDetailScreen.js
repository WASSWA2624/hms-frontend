/**
 * useUserDetailScreen Hook
 * Shared logic for UserDetailScreen across platforms.
 * File: useUserDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useUser, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useUserDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useUser();
  const userId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageUsers = canAccessTenantSettings;
  const canEditUser = canManageUsers;
  const canDeleteUser = canManageUsers;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageUsers && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const user = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageUsers || !userId) return;
    reset();
    get(userId);
  }, [isResolved, canManageUsers, userId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUsers) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageUsers, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageUsers || !isTenantScopedAdmin || !user) return;
    const userTenantId = String(user.tenant_id ?? '').trim();
    if (!userTenantId || userTenantId !== normalizedTenantId) {
      router.replace('/settings/users?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUsers,
    isTenantScopedAdmin,
    user,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUsers) return;
    if (user) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/users?notice=accessDenied');
    }
  }, [isResolved, canManageUsers, user, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/users');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditUser || !userId) return;
    router.push(`/settings/users/${userId}/edit`);
  }, [canEditUser, userId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteUser || !userId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(userId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/users?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteUser, userId, remove, isOffline, router, t]);

  return {
    id: userId,
    user,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditUser ? handleEdit : undefined,
    onDelete: canDeleteUser ? handleDelete : undefined,
  };
};

export default useUserDetailScreen;
