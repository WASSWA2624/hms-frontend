/**
 * usePermissionDetailScreen Hook
 * Shared logic for PermissionDetailScreen across platforms.
 * File: usePermissionDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, usePermission, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const normalizeValue = (value) => String(value ?? '').trim();

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const usePermissionDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = usePermission();
  const permissionId = useMemo(() => {
    const rawId = Array.isArray(id) ? id[0] : id;
    const normalizedId = normalizeValue(rawId);
    return normalizedId || null;
  }, [id]);
  const canManagePermissions = canAccessTenantSettings;
  const canEditPermission = canManagePermissions;
  const canDeletePermission = canManagePermissions;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManagePermissions && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);

  const permission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManagePermissions || !permissionId) return;
    if (isTenantScopedAdmin && !normalizedTenantId) return;
    reset();
    get(permissionId);
  }, [
    isResolved,
    canManagePermissions,
    permissionId,
    isTenantScopedAdmin,
    normalizedTenantId,
    get,
    reset,
  ]);

  const isPermissionInScope = useCallback((permissionRecord) => {
    if (!permissionRecord) return false;
    if (!isTenantScopedAdmin) return true;
    const permissionTenantId = normalizeValue(permissionRecord.tenant_id);
    if (!permissionTenantId || !normalizedTenantId) return false;
    return permissionTenantId === normalizedTenantId;
  }, [isTenantScopedAdmin, normalizedTenantId]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManagePermissions) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManagePermissions, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManagePermissions || !isTenantScopedAdmin || !permission) return;
    if (!isPermissionInScope(permission)) {
      router.replace('/settings/permissions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManagePermissions,
    isTenantScopedAdmin,
    permission,
    normalizedTenantId,
    isPermissionInScope,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManagePermissions) return;
    if (permission) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/permissions?notice=accessDenied');
    }
  }, [isResolved, canManagePermissions, permission, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/permissions');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditPermission || !permissionId) return;
    if (isTenantScopedAdmin && !isPermissionInScope(permission)) {
      router.replace('/settings/permissions?notice=accessDenied');
      return;
    }
    router.push(`/settings/permissions/${permissionId}/edit`);
  }, [canEditPermission, permissionId, isTenantScopedAdmin, isPermissionInScope, permission, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeletePermission || !permissionId) return;
    if (isTenantScopedAdmin && !isPermissionInScope(permission)) {
      router.replace('/settings/permissions?notice=accessDenied');
      return;
    }
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(permissionId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/permissions?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [
    canDeletePermission,
    permissionId,
    isTenantScopedAdmin,
    isPermissionInScope,
    permission,
    remove,
    isOffline,
    router,
    t,
  ]);

  return {
    id: permissionId,
    permission,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditPermission ? handleEdit : undefined,
    onDelete: canDeletePermission ? handleDelete : undefined,
  };
};

export default usePermissionDetailScreen;
