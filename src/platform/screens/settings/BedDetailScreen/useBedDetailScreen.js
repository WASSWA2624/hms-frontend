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
    if (!isResolved || !canManageBeds || !isTenantScopedAdmin || !bed) return;
    const bedTenantId = normalizeValue(bed.tenant_id);
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

  useEffect(() => {
    if (!isResolved || !canManageBeds || !bed) return;
    if (isOffline) return;

    const bedTenantId = normalizeValue(bed?.tenant_id);
    const bedFacilityId = normalizeValue(bed?.facility_id);
    const bedWardId = normalizeValue(bed?.ward_id);

    if (canManageAllTenants) {
      resetTenants();
      listTenants({ page: 1, limit: MAX_FETCH_LIMIT });
    }

    if (bedTenantId) {
      resetFacilities();
      listFacilities({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: bedTenantId });
    }

    if (bedFacilityId) {
      resetWards();
      listWards({ page: 1, limit: MAX_FETCH_LIMIT, facility_id: bedFacilityId });
    }

    if (bedTenantId && bedFacilityId) {
      resetRooms();
      const params = {
        page: 1,
        limit: MAX_FETCH_LIMIT,
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
    bed,
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
    bed?.label
    ?? bed?.name
  )), [bed]);

  const tenantLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      bed?.tenant_name
      ?? bed?.tenant?.name
      ?? bed?.tenant_label
    ))
    || normalizeValue(tenantMap[normalizeValue(bed?.tenant_id)])
    || (!canManageAllTenants && normalizedTenantId ? t('bed.form.currentTenantLabel') : '')
  ), [bed, tenantMap, canManageAllTenants, normalizedTenantId, t]);

  const facilityLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      bed?.facility_name
      ?? bed?.facility?.name
      ?? bed?.facility_label
    ))
    || normalizeValue(facilityMap[normalizeValue(bed?.facility_id)])
  ), [bed, facilityMap]);

  const wardLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      bed?.ward_name
      ?? bed?.ward?.name
      ?? bed?.ward_label
    ))
    || normalizeValue(wardMap[normalizeValue(bed?.ward_id)])
  ), [bed, wardMap]);

  const roomLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      bed?.room_name
      ?? bed?.room?.name
      ?? bed?.room_label
    ))
    || normalizeValue(roomMap[normalizeValue(bed?.room_id)])
  ), [bed, roomMap]);

  const statusValue = useMemo(() => normalizeStatus(
    bed?.status
    ?? bed?.bed_status
  ), [bed]);

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
    bedLabel,
    tenantLabel,
    facilityLabel,
    wardLabel,
    roomLabel,
    statusValue,
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
