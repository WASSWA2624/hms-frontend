/**
 * useUserRoleDetailScreen Hook
 * Shared logic for UserRoleDetailScreen across platforms.
 * File: useUserRoleDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useTenantAccess, useUserRole } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useUserRoleDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useUserRole();
  const userRoleId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageUserRoles = canAccessTenantSettings;
  const canEditUserRole = canManageUserRoles;
  const canDeleteUserRole = canManageUserRoles;
  const isTenantScopedAdmin = canManageUserRoles && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const userRole = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageUserRoles || !userRoleId) return;
    reset();
    get(userRoleId);
  }, [isResolved, canManageUserRoles, userRoleId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserRoles) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageUserRoles,
    isTenantScopedAdmin,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageUserRoles || !isTenantScopedAdmin || !userRole) return;
    const recordTenantId = String(userRole?.tenant_id ?? '').trim();
    if (!recordTenantId || recordTenantId !== normalizedTenantId) {
      router.replace('/settings/user-roles?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUserRoles,
    isTenantScopedAdmin,
    userRole,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserRoles) return;
    if (userRole) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/user-roles?notice=accessDenied');
    }
  }, [isResolved, canManageUserRoles, userRole, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/user-roles');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditUserRole || !userRoleId) return;
    router.push(`/settings/user-roles/${userRoleId}/edit`);
  }, [canEditUserRole, userRoleId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteUserRole || !userRoleId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(userRoleId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/user-roles?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteUserRole, userRoleId, remove, isOffline, router, t]);

  return {
    id: userRoleId,
    userRole,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditUserRole ? handleEdit : undefined,
    onDelete: canDeleteUserRole ? handleDelete : undefined,
  };
};

export default useUserRoleDetailScreen;
