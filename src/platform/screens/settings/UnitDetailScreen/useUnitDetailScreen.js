/**
 * useUnitDetailScreen Hook
 * Shared logic for UnitDetailScreen across platforms.
 * File: useUnitDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useUnit, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useUnitDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useUnit();
  const unitId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageUnits = canAccessTenantSettings;
  const canEditUnit = canManageUnits;
  const canDeleteUnit = canManageUnits;
  const isTenantScopedAdmin = canManageUnits && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const unit = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageUnits || !unitId) return;
    reset();
    get(unitId);
  }, [isResolved, canManageUnits, unitId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUnits) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageUnits, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageUnits || !isTenantScopedAdmin || !unit) return;
    const unitTenantId = String(unit.tenant_id ?? '').trim();
    if (!unitTenantId || unitTenantId !== normalizedTenantId) {
      router.replace('/settings/units?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUnits,
    isTenantScopedAdmin,
    unit,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUnits) return;
    if (unit) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/units?notice=accessDenied');
    }
  }, [isResolved, canManageUnits, unit, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/units');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditUnit || !unitId) return;
    router.push(`/settings/units/${unitId}/edit`);
  }, [canEditUnit, unitId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteUnit || !unitId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(unitId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/units?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteUnit, unitId, remove, isOffline, router, t]);

  return {
    id: unitId,
    unit,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditUnit ? handleEdit : undefined,
    onDelete: canDeleteUnit ? handleDelete : undefined,
  };
};

export default useUnitDetailScreen;
