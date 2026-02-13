/**
 * useRolePermissionDetailScreen Hook
 * Shared logic for RolePermissionDetailScreen across platforms.
 * File: useRolePermissionDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useRolePermission, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useRolePermissionDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useRolePermission();
  const rolePermissionId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageRolePermissions = canAccessTenantSettings;
  const canEditRolePermission = canManageRolePermissions;
  const canDeleteRolePermission = canManageRolePermissions;
  const isTenantScopedAdmin = canManageRolePermissions && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const rolePermission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageRolePermissions || !rolePermissionId) return;
    reset();
    get(rolePermissionId);
  }, [isResolved, canManageRolePermissions, rolePermissionId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageRolePermissions) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageRolePermissions,
    isTenantScopedAdmin,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageRolePermissions || !isTenantScopedAdmin || !rolePermission) return;
    const recordTenantId = String(rolePermission?.tenant_id ?? '').trim();
    if (recordTenantId && recordTenantId !== normalizedTenantId) {
      router.replace('/settings/role-permissions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageRolePermissions,
    isTenantScopedAdmin,
    rolePermission,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRolePermissions) return;
    if (rolePermission) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/role-permissions?notice=accessDenied');
    }
  }, [isResolved, canManageRolePermissions, rolePermission, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/role-permissions');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditRolePermission || !rolePermissionId) return;
    router.push(`/settings/role-permissions/${rolePermissionId}/edit`);
  }, [canEditRolePermission, rolePermissionId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteRolePermission || !rolePermissionId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(rolePermissionId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/role-permissions?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteRolePermission, rolePermissionId, remove, isOffline, router, t]);

  return {
    id: rolePermissionId,
    rolePermission,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditRolePermission ? handleEdit : undefined,
    onDelete: canDeleteRolePermission ? handleDelete : undefined,
  };
};

export default useRolePermissionDetailScreen;
