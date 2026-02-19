/**
 * useRolePermissionDetailScreen Hook
 * Shared logic for RolePermissionDetailScreen across platforms.
 * File: useRolePermissionDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useRolePermission, useTenantAccess } from '@hooks';
import { confirmAction, humanizeIdentifier } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const normalizeValue = (value) => String(value ?? '').trim();

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
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageRolePermissions && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);

  const rolePermission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );
  const roleLabel = useMemo(() => {
    if (!rolePermission) return '';

    return resolveContextValue(
      resolveReadableValue(
        rolePermission?.role_name,
        rolePermission?.role?.name,
        rolePermission?.role_label
      ),
      rolePermission?.role_id,
      canViewTechnicalIds,
      t('rolePermission.detail.currentRole')
    );
  }, [rolePermission, canViewTechnicalIds, t]);

  const permissionLabel = useMemo(() => {
    if (!rolePermission) return '';

    return resolveContextValue(
      resolveReadableValue(
        rolePermission?.permission_name,
        rolePermission?.permission?.name,
        rolePermission?.permission_label
      ),
      rolePermission?.permission_id,
      canViewTechnicalIds,
      t('rolePermission.detail.currentPermission')
    );
  }, [rolePermission, canViewTechnicalIds, t]);

  const tenantLabel = useMemo(() => {
    if (!rolePermission) return '';

    return resolveContextValue(
      resolveReadableValue(
        rolePermission?.tenant_name,
        rolePermission?.tenant?.name,
        rolePermission?.tenant_label
      ),
      rolePermission?.tenant_id,
      canViewTechnicalIds,
      t('rolePermission.detail.currentTenant')
    );
  }, [rolePermission, canViewTechnicalIds, t]);

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
    roleLabel,
    permissionLabel,
    tenantLabel,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditRolePermission ? handleEdit : undefined,
    onDelete: canDeleteRolePermission ? handleDelete : undefined,
  };
};

export default useRolePermissionDetailScreen;
