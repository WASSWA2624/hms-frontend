/**
 * useFacilityDetailScreen Hook
 * Shared logic for FacilityDetailScreen across platforms.
 * File: useFacilityDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useFacility, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useFacilityDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useFacility();
  const facilityId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageFacilities = canAccessTenantSettings;
  const canEditFacility = canManageFacilities;
  const canDeleteFacility = canManageFacilities;
  const isTenantScopedAdmin = canManageFacilities && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const facility = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageFacilities || !facilityId) return;
    reset();
    get(facilityId);
  }, [isResolved, canManageFacilities, facilityId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageFacilities) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageFacilities, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageFacilities || !isTenantScopedAdmin || !facility) return;
    const facilityTenantId = String(facility.tenant_id ?? '').trim();
    if (!facilityTenantId || facilityTenantId !== normalizedTenantId) {
      router.replace('/settings/facilities?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageFacilities,
    isTenantScopedAdmin,
    facility,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !isTenantScopedAdmin) return;
    if (facility) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/facilities?notice=accessDenied');
    }
  }, [isResolved, isTenantScopedAdmin, facility, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/facilities');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditFacility || !facilityId) return;
    router.push(`/settings/facilities/${facilityId}/edit`);
  }, [canEditFacility, facilityId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteFacility || !facilityId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(facilityId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/facilities?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteFacility, facilityId, remove, isOffline, router, t]);

  return {
    id: facilityId,
    facility,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditFacility ? handleEdit : undefined,
    onDelete: canDeleteFacility ? handleDelete : undefined,
  };
};

export default useFacilityDetailScreen;
