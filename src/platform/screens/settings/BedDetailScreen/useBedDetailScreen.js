/**
 * useBedDetailScreen Hook
 * Shared logic for BedDetailScreen across platforms.
 * File: useBedDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useBed, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useBedDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useBed();

  const bedId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageBeds = canAccessTenantSettings;
  const canEditBed = canManageBeds;
  const canDeleteBed = canManageBeds;
  const isTenantScopedAdmin = canManageBeds && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const bed = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageBeds || !bedId) return;
    reset();
    get(bedId);
  }, [isResolved, canManageBeds, bedId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageBeds) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageBeds, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || !isTenantScopedAdmin || !bed) return;
    const bedTenantId = String(bed.tenant_id ?? '').trim();
    if (!bedTenantId || bedTenantId !== normalizedTenantId) {
      router.replace('/settings/beds?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageBeds,
    isTenantScopedAdmin,
    bed,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageBeds) return;
    if (bed) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/beds?notice=accessDenied');
    }
  }, [isResolved, canManageBeds, bed, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/beds');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditBed || !bedId) return;
    router.push(`/settings/beds/${bedId}/edit`);
  }, [canEditBed, bedId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteBed || !bedId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(bedId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/beds?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteBed, bedId, remove, isOffline, router, t]);

  return {
    id: bedId,
    bed,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditBed ? handleEdit : undefined,
    onDelete: canDeleteBed ? handleDelete : undefined,
  };
};

export default useBedDetailScreen;
