/**
 * useTenantDetailScreen Hook
 * Shared logic for TenantDetailScreen across platforms.
 * File: useTenantDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useTenant, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useTenantDetailScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    canEditTenant,
    canDeleteTenant,
    canAssignTenantAdmins,
    tenantId,
    isResolved,
  } = useTenantAccess();
  const { get, remove, data, isLoading, errorCode, reset } = useTenant();

  const requestedTenantId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const targetTenantId = useMemo(() => {
    if (!canManageAllTenants) return tenantId || null;
    return requestedTenantId;
  }, [canManageAllTenants, requestedTenantId, tenantId]);
  const tenant = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!targetTenantId) return;
    reset();
    get(targetTenantId);
  }, [targetTenantId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessTenantSettings) {
      router.replace('/settings');
      return;
    }
    if (canManageAllTenants) return;
    if (!tenantId) {
      router.replace('/settings');
      return;
    }
    if (requestedTenantId && requestedTenantId !== tenantId) {
      router.replace(`/settings/tenants/${tenantId}`);
    }
  }, [
    isResolved,
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId,
    requestedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canAccessTenantSettings) return;
    fetchDetail();
  }, [isResolved, canAccessTenantSettings, fetchDetail]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditTenant || !targetTenantId) return;
    router.push(`/settings/tenants/${targetTenantId}/edit`);
  }, [canEditTenant, targetTenantId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteTenant || !targetTenantId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(targetTenantId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/tenants?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteTenant, targetTenantId, remove, isOffline, router, t]);

  const handleAssignTenantAdmin = useCallback(() => {
    if (!canAssignTenantAdmins || !targetTenantId) return;
    const tenantQuery = encodeURIComponent(String(targetTenantId));
    router.push(
      `/settings/user-roles/create?tenantId=${tenantQuery}&roleName=TENANT_ADMIN`
    );
  }, [canAssignTenantAdmins, targetTenantId, router]);

  return {
    id: targetTenantId || requestedTenantId,
    tenant,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditTenant ? handleEdit : undefined,
    onDelete: canDeleteTenant ? handleDelete : undefined,
    onAssignTenantAdmin: canAssignTenantAdmins ? handleAssignTenantAdmin : undefined,
  };
};

export default useTenantDetailScreen;
