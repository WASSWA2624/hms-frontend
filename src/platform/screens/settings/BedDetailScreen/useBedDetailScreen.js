/**
 * useBedDetailScreen Hook
 * Shared logic for BedDetailScreen across platforms.
 * File: useBedDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useI18n,
  useNetwork,
  useBed,
  useTenant,
  useFacility,
  useWard,
  useRoom,
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

const normalizeStatus = (value) => {
  const normalized = normalizeValue(value).toUpperCase().replace(/\s+/g, '_');
  if (normalized === 'AVAILABLE') return 'AVAILABLE';
  if (normalized === 'OCCUPIED') return 'OCCUPIED';
  if (normalized === 'RESERVED') return 'RESERVED';
  if (normalized === 'OUT_OF_SERVICE') return 'OUT_OF_SERVICE';
  return '';
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
  const {
    list: listWards,
    data: wardData,
    reset: resetWards,
  } = useWard();
  const {
    list: listRooms,
    data: roomData,
    reset: resetRooms,
  } = useRoom();

  const bedId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageBeds = canAccessTenantSettings;
  const canEditBed = canManageBeds;
  const canDeleteBed = canManageBeds;
  const isTenantScopedAdmin = canManageBeds && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);
  const bed = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const isBedInScope = useMemo(() => {
    if (!bed) return true;
    if (canManageAllTenants) return true;
    const bedTenantId = normalizeValue(bed.tenant_id);
    if (!bedTenantId || !normalizedTenantId) return false;
    return bedTenantId === normalizedTenantId;
  }, [bed, canManageAllTenants, normalizedTenantId]);
  const visibleBed = isBedInScope ? bed : null;
  const tenantItems = useMemo(() => resolveListItems(tenantData), [tenantData]);
  const facilityItems = useMemo(() => resolveListItems(facilityData), [facilityData]);
  const wardItems = useMemo(() => resolveListItems(wardData), [wardData]);
  const roomItems = useMemo(() => resolveListItems(roomData), [roomData]);
  const tenantMap = useMemo(() => createLabelMap(
    tenantItems,
    (tenant) => tenant?.name ?? tenant?.slug
  ), [tenantItems]);
  const facilityMap = useMemo(() => createLabelMap(
    facilityItems,
    (facility) => facility?.name ?? facility?.slug
  ), [facilityItems]);
  const wardMap = useMemo(() => createLabelMap(
    wardItems,
    (ward) => ward?.name ?? ward?.slug
  ), [wardItems]);
  const roomMap = useMemo(() => createLabelMap(
    roomItems,
    (room) => room?.name ?? room?.slug
  ), [roomItems]);
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
    if (!isResolved || !canManageBeds || !bed || isBedInScope) return;
    router.replace('/settings/beds?notice=accessDenied');
  }, [isResolved, canManageBeds, bed, isBedInScope, router]);

  useEffect(() => {
    if (!isResolved || !canManageBeds) return;
    if (visibleBed) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/beds?notice=accessDenied');
    }
  }, [isResolved, canManageBeds, visibleBed, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || !visibleBed || isOffline) return;

    const bedTenantId = normalizeValue(visibleBed?.tenant_id);
    const bedFacilityId = normalizeValue(visibleBed?.facility_id);
    const bedWardId = normalizeValue(visibleBed?.ward_id);

    if (canManageAllTenants) {
      resetTenants();
      listTenants({
        page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
        limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
      });
    }

    if (bedTenantId) {
      resetFacilities();
      listFacilities({
        page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
        limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
        tenant_id: bedTenantId,
      });
    }

    if (bedFacilityId) {
      resetWards();
      listWards({
        page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
        limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
        facility_id: bedFacilityId,
      });
    }

    if (bedTenantId && bedFacilityId) {
      resetRooms();
      const params = {
        page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
        limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
        tenant_id: bedTenantId,
        facility_id: bedFacilityId,
      };
      if (bedWardId) {
        params.ward_id = bedWardId;
      }
      listRooms(params);
    }
  }, [
    isResolved,
    canManageBeds,
    canManageAllTenants,
    visibleBed,
    isOffline,
    listTenants,
    resetTenants,
    listFacilities,
    resetFacilities,
    listWards,
    resetWards,
    listRooms,
    resetRooms,
  ]);

  const bedLabel = useMemo(() => normalizeValue(humanizeIdentifier(
    visibleBed?.label
    ?? visibleBed?.name
  )), [visibleBed]);

  const tenantLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      visibleBed?.tenant_name
      ?? visibleBed?.tenant?.name
      ?? visibleBed?.tenant_label
    ))
    || normalizeValue(tenantMap[normalizeValue(visibleBed?.tenant_id)])
    || (!canManageAllTenants && normalizedTenantId ? t('bed.form.currentTenantLabel') : '')
  ), [visibleBed, tenantMap, canManageAllTenants, normalizedTenantId, t]);

  const facilityLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      visibleBed?.facility_name
      ?? visibleBed?.facility?.name
      ?? visibleBed?.facility_label
    ))
    || normalizeValue(facilityMap[normalizeValue(visibleBed?.facility_id)])
  ), [visibleBed, facilityMap]);

  const wardLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      visibleBed?.ward_name
      ?? visibleBed?.ward?.name
      ?? visibleBed?.ward_label
    ))
    || normalizeValue(wardMap[normalizeValue(visibleBed?.ward_id)])
  ), [visibleBed, wardMap]);

  const roomLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      visibleBed?.room_name
      ?? visibleBed?.room?.name
      ?? visibleBed?.room_label
    ))
    || normalizeValue(roomMap[normalizeValue(visibleBed?.room_id)])
  ), [visibleBed, roomMap]);

  const statusValue = useMemo(() => normalizeStatus(
    visibleBed?.status
    ?? visibleBed?.bed_status
  ), [visibleBed]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/beds');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditBed || !bedId || !isBedInScope) return;
    router.push(`/settings/beds/${bedId}/edit`);
  }, [canEditBed, bedId, isBedInScope, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteBed || !bedId || !isBedInScope) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(bedId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/beds?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteBed, bedId, isBedInScope, remove, isOffline, router, t]);

  return {
    id: bedId,
    bed: visibleBed,
    bedLabel,
    tenantLabel,
    facilityLabel,
    wardLabel,
    roomLabel,
    statusValue,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode) && isBedInScope,
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditBed && isBedInScope ? handleEdit : undefined,
    onDelete: canDeleteBed && isBedInScope ? handleDelete : undefined,
  };
};

export default useBedDetailScreen;
