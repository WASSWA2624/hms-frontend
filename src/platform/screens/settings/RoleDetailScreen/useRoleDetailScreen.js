/**
 * useRoleDetailScreen Hook
 * Shared logic for RoleDetailScreen across platforms.
 * File: useRoleDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useRole, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useRoleDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useRole();
  const roleId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageRoles = canAccessTenantSettings;
  const canEditRole = canManageRoles;
  const canDeleteRole = canManageRoles;
  const isTenantScopedAdmin = canManageRoles && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const role = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageRoles || !roleId) return;
    reset();
    get(roleId);
  }, [isResolved, canManageRoles, roleId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageRoles) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageRoles, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageRoles || !isTenantScopedAdmin || !role) return;
    const roleTenantId = String(role.tenant_id ?? '').trim();
    if (!roleTenantId || roleTenantId !== normalizedTenantId) {
      router.replace('/settings/roles?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageRoles,
    isTenantScopedAdmin,
    role,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRoles) return;
    if (role) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/roles?notice=accessDenied');
    }
  }, [isResolved, canManageRoles, role, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/roles');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditRole || !roleId) return;
    router.push(`/settings/roles/${roleId}/edit`);
  }, [canEditRole, roleId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteRole || !roleId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(roleId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/roles?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteRole, roleId, remove, isOffline, router, t]);

  return {
    id: roleId,
    role,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditRole ? handleEdit : undefined,
    onDelete: canDeleteRole ? handleDelete : undefined,
  };
};

export default useRoleDetailScreen;
