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
const DEFAULT_FETCH_PAGE = 1;
const DEFAULT_FETCH_LIMIT = 100;
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

const normalizeFetchPage = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_FETCH_PAGE;
  return Math.max(DEFAULT_FETCH_PAGE, Math.trunc(numeric));
};

const normalizeFetchLimit = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_FETCH_LIMIT;
  return Math.min(MAX_FETCH_LIMIT, Math.max(1, Math.trunc(numeric)));
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
  const isWardInScope = useMemo(() => {
    if (!ward) return true;
    if (canManageAllTenants) return true;
    const wardTenantId = normalizeValue(ward.tenant_id);
    if (!wardTenantId || !normalizedTenantId) return false;
    return wardTenantId === normalizedTenantId;
  }, [ward, canManageAllTenants, normalizedTenantId]);
  const visibleWard = isWardInScope ? ward : null;
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
    if (!isResolved || !canManageWards || !ward || isWardInScope) return;
    router.replace('/settings/wards?notice=accessDenied');
  }, [isResolved, canManageWards, ward, isWardInScope, router]);

  useEffect(() => {
    if (!isResolved || !canManageWards) return;
    if (visibleWard) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/wards?notice=accessDenied');
    }
  }, [isResolved, canManageWards, visibleWard, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageWards || !visibleWard || isOffline) return;

    const wardTenantId = normalizeValue(visibleWard?.tenant_id);
    if (canManageAllTenants) {
      resetTenants();
      listTenants({
        page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
        limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
      });
    }

    if (wardTenantId) {
      resetFacilities();
      listFacilities({
        page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
        limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
        tenant_id: wardTenantId,
      });
    }
  }, [
    isResolved,
    canManageWards,
    canManageAllTenants,
    visibleWard,
    isOffline,
    listTenants,
    resetTenants,
    listFacilities,
    resetFacilities,
  ]);

  const wardName = useMemo(
    () => normalizeValue(humanizeIdentifier(visibleWard?.name)),
    [visibleWard]
  );

  const tenantLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      visibleWard?.tenant_name
      ?? visibleWard?.tenant?.name
      ?? visibleWard?.tenant_label
    ))
    || normalizeValue(tenantMap[normalizeValue(visibleWard?.tenant_id)])
    || (!canManageAllTenants && normalizedTenantId ? t('ward.form.currentTenantLabel') : '')
  ), [visibleWard, tenantMap, canManageAllTenants, normalizedTenantId, t]);

  const facilityLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      visibleWard?.facility_name
      ?? visibleWard?.facility?.name
      ?? visibleWard?.facility_label
    ))
    || normalizeValue(facilityMap[normalizeValue(visibleWard?.facility_id)])
  ), [visibleWard, facilityMap]);

  const wardTypeLabel = useMemo(
    () => normalizeValue(humanizeIdentifier(visibleWard?.ward_type ?? visibleWard?.type)),
    [visibleWard]
  );
  const isActive = useMemo(() => {
    if (typeof visibleWard?.is_active === 'boolean') return visibleWard.is_active;
    if (visibleWard?.is_active === 'true') return true;
    if (visibleWard?.is_active === 'false') return false;
    return null;
  }, [visibleWard]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/wards');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditWard || !wardId || !isWardInScope) return;
    router.push(`/settings/wards/${wardId}/edit`);
  }, [canEditWard, wardId, isWardInScope, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteWard || !wardId || !isWardInScope) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(wardId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/wards?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteWard, wardId, isWardInScope, remove, isOffline, router, t]);

  return {
    id: wardId,
    ward: visibleWard,
    wardName,
    tenantLabel,
    facilityLabel,
    wardTypeLabel,
    isActive,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode) && isWardInScope,
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditWard && isWardInScope ? handleEdit : undefined,
    onDelete: canDeleteWard && isWardInScope ? handleDelete : undefined,
  };
};

export default useWardDetailScreen;

