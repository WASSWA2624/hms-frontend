/**
 * useWardDetailScreen Hook
 * Shared logic for WardDetailScreen across platforms.
 * File: useWardDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useI18n,
  useNetwork,
  useWard,
  useTenant,
  useFacility,
  useTenantAccess,
} from '@hooks';
import { confirmAction, humanizeIdentifier } from '@utils';

const MAX_FETCH_LIMIT = 100;
const normalizeValue = (value) => String(value ?? '').trim();
const resolveListItems = (value) => (Array.isArray(value) ? value : (value?.items ?? []));
const createLabelMap = (items, resolver) => items.reduce((acc, item) => {
  const id = normalizeValue(item?.id);
  if (!id) return acc;
  const label = normalizeValue(humanizeIdentifier(resolver(item)));
  if (!label) return acc;
  acc[id] = label;
  return acc;
}, {});

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useWardDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useWard();
  const {
    list: listTenants,
    data: tenantData,
    reset: resetTenants,
  } = useTenant();
  const {
    list: listFacilities,
    data: facilityData,
    reset: resetFacilities,
  } = useFacility();

  const wardId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageWards = canAccessTenantSettings;
  const canEditWard = canManageWards;
  const canDeleteWard = canManageWards;
  const isTenantScopedAdmin = canManageWards && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);
  const ward = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(() => resolveListItems(tenantData), [tenantData]);
  const facilityItems = useMemo(() => resolveListItems(facilityData), [facilityData]);
  const tenantMap = useMemo(() => createLabelMap(
    tenantItems,
    (tenant) => tenant?.name ?? tenant?.slug
  ), [tenantItems]);
  const facilityMap = useMemo(() => createLabelMap(
    facilityItems,
    (facility) => facility?.name ?? facility?.slug
  ), [facilityItems]);
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageWards || !wardId) return;
    reset();
    get(wardId);
  }, [isResolved, canManageWards, wardId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageWards) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageWards, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageWards || !isTenantScopedAdmin || !ward) return;
    const wardTenantId = normalizeValue(ward.tenant_id);
    if (!wardTenantId || wardTenantId !== normalizedTenantId) {
      router.replace('/settings/wards?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageWards,
    isTenantScopedAdmin,
    ward,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageWards) return;
    if (ward) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/wards?notice=accessDenied');
    }
  }, [isResolved, canManageWards, ward, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageWards || !ward || isOffline) return;

    const wardTenantId = normalizeValue(ward?.tenant_id);
    if (canManageAllTenants) {
      resetTenants();
      listTenants({ page: 1, limit: MAX_FETCH_LIMIT });
    }

    if (wardTenantId) {
      resetFacilities();
      listFacilities({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: wardTenantId });
    }
  }, [
    isResolved,
    canManageWards,
    canManageAllTenants,
    ward,
    isOffline,
    listTenants,
    resetTenants,
    listFacilities,
    resetFacilities,
  ]);

  const wardName = useMemo(() => normalizeValue(humanizeIdentifier(ward?.name)), [ward]);

  const tenantLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      ward?.tenant_name
      ?? ward?.tenant?.name
      ?? ward?.tenant_label
    ))
    || normalizeValue(tenantMap[normalizeValue(ward?.tenant_id)])
    || (!canManageAllTenants && normalizedTenantId ? t('ward.form.currentTenantLabel') : '')
  ), [ward, tenantMap, canManageAllTenants, normalizedTenantId, t]);

  const facilityLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      ward?.facility_name
      ?? ward?.facility?.name
      ?? ward?.facility_label
    ))
    || normalizeValue(facilityMap[normalizeValue(ward?.facility_id)])
  ), [ward, facilityMap]);

  const wardTypeLabel = useMemo(
    () => normalizeValue(humanizeIdentifier(ward?.ward_type ?? ward?.type)),
    [ward]
  );
  const isActive = useMemo(() => {
    if (typeof ward?.is_active === 'boolean') return ward.is_active;
    if (ward?.is_active === 'true') return true;
    if (ward?.is_active === 'false') return false;
    return null;
  }, [ward]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/wards');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditWard || !wardId) return;
    router.push(`/settings/wards/${wardId}/edit`);
  }, [canEditWard, wardId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteWard || !wardId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(wardId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/wards?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteWard, wardId, remove, isOffline, router, t]);

  return {
    id: wardId,
    ward,
    wardName,
    tenantLabel,
    facilityLabel,
    wardTypeLabel,
    isActive,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditWard ? handleEdit : undefined,
    onDelete: canDeleteWard ? handleDelete : undefined,
  };
};

export default useWardDetailScreen;

