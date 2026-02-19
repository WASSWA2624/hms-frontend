/**
 * useDepartmentDetailScreen Hook
 * Shared logic for DepartmentDetailScreen across platforms.
 * File: useDepartmentDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useDepartment, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useDepartmentDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useDepartment();
  const departmentId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageDepartments = canAccessTenantSettings;
  const canEditDepartment = canManageDepartments;
  const canDeleteDepartment = canManageDepartments;
  const isTenantScopedAdmin = canManageDepartments && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const department = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const isDepartmentInScope = useMemo(() => {
    if (!department) return true;
    if (canManageAllTenants) return true;
    const departmentTenantId = String(department.tenant_id ?? '').trim();
    if (!departmentTenantId || !normalizedTenantId) return false;
    return departmentTenantId === normalizedTenantId;
  }, [department, canManageAllTenants, normalizedTenantId]);
  const visibleDepartment = isDepartmentInScope ? department : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageDepartments || !departmentId) return;
    reset();
    get(departmentId);
  }, [isResolved, canManageDepartments, departmentId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageDepartments) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageDepartments, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageDepartments || !department || isDepartmentInScope) return;
    router.replace('/settings/departments?notice=accessDenied');
  }, [
    isResolved,
    canManageDepartments,
    department,
    isDepartmentInScope,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageDepartments) return;
    if (visibleDepartment) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/departments?notice=accessDenied');
    }
  }, [isResolved, canManageDepartments, visibleDepartment, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/departments');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditDepartment || !departmentId || !isDepartmentInScope) return;
    router.push(`/settings/departments/${departmentId}/edit`);
  }, [canEditDepartment, departmentId, isDepartmentInScope, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteDepartment || !departmentId || !isDepartmentInScope) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(departmentId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/departments?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteDepartment, departmentId, isDepartmentInScope, remove, isOffline, router, t]);

  return {
    id: departmentId,
    department: visibleDepartment,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode) && isDepartmentInScope,
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditDepartment && isDepartmentInScope ? handleEdit : undefined,
    onDelete: canDeleteDepartment && isDepartmentInScope ? handleDelete : undefined,
  };
};

export default useDepartmentDetailScreen;
