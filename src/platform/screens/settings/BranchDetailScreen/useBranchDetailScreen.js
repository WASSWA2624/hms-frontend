/**
 * useBranchDetailScreen Hook
 * Shared logic for BranchDetailScreen across platforms.
 * File: useBranchDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useBranch, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useBranchDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useBranch();
  const branchId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageBranches = canAccessTenantSettings;
  const canEditBranch = canManageBranches;
  const canDeleteBranch = canManageBranches;
  const isTenantScopedAdmin = canManageBranches && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const branch = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const isBranchInScope = useMemo(() => {
    if (!branch) return true;
    if (canManageAllTenants) return true;
    const branchTenantId = String(branch.tenant_id ?? '').trim();
    if (!branchTenantId || !normalizedTenantId) return false;
    return branchTenantId === normalizedTenantId;
  }, [branch, canManageAllTenants, normalizedTenantId]);
  const visibleBranch = isBranchInScope ? branch : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageBranches || !branchId) return;
    reset();
    get(branchId);
  }, [isResolved, canManageBranches, branchId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageBranches) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageBranches, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageBranches || !branch || isBranchInScope) return;
    router.replace('/settings/branches?notice=accessDenied');
  }, [
    isResolved,
    canManageBranches,
    branch,
    isBranchInScope,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageBranches) return;
    if (visibleBranch) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/branches?notice=accessDenied');
    }
  }, [isResolved, canManageBranches, visibleBranch, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/branches');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditBranch || !branchId || !isBranchInScope) return;
    router.push(`/settings/branches/${branchId}/edit`);
  }, [canEditBranch, branchId, isBranchInScope, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteBranch || !branchId || !isBranchInScope) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(branchId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/branches?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteBranch, branchId, isBranchInScope, remove, isOffline, router, t]);

  return {
    id: branchId,
    branch: visibleBranch,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode) && isBranchInScope,
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditBranch && isBranchInScope ? handleEdit : undefined,
    onDelete: canDeleteBranch && isBranchInScope ? handleDelete : undefined,
  };
};

export default useBranchDetailScreen;
