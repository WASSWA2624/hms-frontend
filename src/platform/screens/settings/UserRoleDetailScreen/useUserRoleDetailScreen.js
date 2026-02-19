/**
 * useUserRoleDetailScreen Hook
 * Shared logic for UserRoleDetailScreen across platforms.
 * File: useUserRoleDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useUserRole, useTenantAccess } from '@hooks';
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
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageUserRoles && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);

  const userRole = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );
  const userLabel = useMemo(() => {
    if (!userRole) return '';

    return resolveContextValue(
      resolveReadableValue(
        userRole?.user_name,
        userRole?.user?.name,
        userRole?.user?.full_name,
        userRole?.user?.email,
        userRole?.user_label
      ),
      userRole?.user_id,
      canViewTechnicalIds,
      t('userRole.detail.currentUser')
    );
  }, [userRole, canViewTechnicalIds, t]);

  const roleLabel = useMemo(() => {
    if (!userRole) return '';

    return resolveContextValue(
      resolveReadableValue(
        userRole?.role_name,
        userRole?.role?.name,
        userRole?.role_label
      ),
      userRole?.role_id,
      canViewTechnicalIds,
      t('userRole.detail.currentRole')
    );
  }, [userRole, canViewTechnicalIds, t]);

  const tenantLabel = useMemo(() => {
    if (!userRole) return '';

    return resolveContextValue(
      resolveReadableValue(
        userRole?.tenant_name,
        userRole?.tenant?.name,
        userRole?.tenant?.slug,
        userRole?.tenant_label
      ),
      userRole?.tenant_id,
      canViewTechnicalIds,
      t('userRole.detail.currentTenant')
    );
  }, [userRole, canViewTechnicalIds, t]);

  const facilityLabel = useMemo(() => {
    if (!userRole) return '';

    return resolveContextValue(
      resolveReadableValue(
        userRole?.facility_name,
        userRole?.facility?.name,
        userRole?.facility?.code,
        userRole?.facility_label
      ),
      userRole?.facility_id,
      canViewTechnicalIds,
      t('userRole.detail.currentFacility')
    );
  }, [userRole, canViewTechnicalIds, t]);

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
    if (recordTenantId && recordTenantId !== normalizedTenantId) {
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
    userLabel,
    roleLabel,
    tenantLabel,
    facilityLabel,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditUserRole ? handleEdit : undefined,
    onDelete: canDeleteUserRole ? handleDelete : undefined,
  };
};

export default useUserRoleDetailScreen;
