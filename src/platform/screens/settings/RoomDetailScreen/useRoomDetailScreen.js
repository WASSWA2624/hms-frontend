/**
 * useRoomDetailScreen Hook
 * Shared logic for RoomDetailScreen across platforms.
 * File: useRoomDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useI18n,
  useNetwork,
  useRoom,
  useTenant,
  useFacility,
  useWard,
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

const useRoomDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useRoom();
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

  const roomId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageRooms = canAccessTenantSettings;
  const canEditRoom = canManageRooms;
  const canDeleteRoom = canManageRooms;
  const isTenantScopedAdmin = canManageRooms && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);
  const room = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const isRoomInScope = useMemo(() => {
    if (!room) return true;
    if (canManageAllTenants) return true;
    const roomTenantId = normalizeValue(room.tenant_id);
    if (!roomTenantId || !normalizedTenantId) return false;
    return roomTenantId === normalizedTenantId;
  }, [room, canManageAllTenants, normalizedTenantId]);
  const visibleRoom = isRoomInScope ? room : null;
  const tenantItems = useMemo(() => resolveListItems(tenantData), [tenantData]);
  const facilityItems = useMemo(() => resolveListItems(facilityData), [facilityData]);
  const wardItems = useMemo(() => resolveListItems(wardData), [wardData]);
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
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageRooms || !roomId) return;
    reset();
    get(roomId);
  }, [isResolved, canManageRooms, roomId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageRooms) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageRooms, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageRooms || !room || isRoomInScope) return;
    router.replace('/settings/rooms?notice=accessDenied');
  }, [isResolved, canManageRooms, room, isRoomInScope, router]);

  useEffect(() => {
    if (!isResolved || !canManageRooms) return;
    if (visibleRoom) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/rooms?notice=accessDenied');
    }
  }, [isResolved, canManageRooms, visibleRoom, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageRooms || !visibleRoom || isOffline) return;

    const roomTenantId = normalizeValue(visibleRoom?.tenant_id);
    const roomFacilityId = normalizeValue(visibleRoom?.facility_id);

    if (canManageAllTenants) {
      resetTenants();
      listTenants({
        page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
        limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
      });
    }

    if (roomTenantId) {
      resetFacilities();
      listFacilities({
        page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
        limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
        tenant_id: roomTenantId,
      });
    }

    if (roomFacilityId) {
      resetWards();
      listWards({
        page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
        limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
        facility_id: roomFacilityId,
      });
    }
  }, [
    isResolved,
    canManageRooms,
    canManageAllTenants,
    visibleRoom,
    isOffline,
    listTenants,
    resetTenants,
    listFacilities,
    resetFacilities,
    listWards,
    resetWards,
  ]);

  const roomName = useMemo(
    () => normalizeValue(humanizeIdentifier(visibleRoom?.name)),
    [visibleRoom]
  );

  const tenantLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      visibleRoom?.tenant_name
      ?? visibleRoom?.tenant?.name
      ?? visibleRoom?.tenant_label
    ))
    || normalizeValue(tenantMap[normalizeValue(visibleRoom?.tenant_id)])
    || (!canManageAllTenants && normalizedTenantId ? t('room.form.currentTenantLabel') : '')
  ), [visibleRoom, tenantMap, canManageAllTenants, normalizedTenantId, t]);

  const facilityLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      visibleRoom?.facility_name
      ?? visibleRoom?.facility?.name
      ?? visibleRoom?.facility_label
    ))
    || normalizeValue(facilityMap[normalizeValue(visibleRoom?.facility_id)])
  ), [visibleRoom, facilityMap]);

  const wardLabel = useMemo(() => (
    normalizeValue(humanizeIdentifier(
      visibleRoom?.ward_name
      ?? visibleRoom?.ward?.name
      ?? visibleRoom?.ward_label
    ))
    || normalizeValue(wardMap[normalizeValue(visibleRoom?.ward_id)])
  ), [visibleRoom, wardMap]);

  const floorLabel = useMemo(
    () => normalizeValue(humanizeIdentifier(visibleRoom?.floor)),
    [visibleRoom]
  );

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/rooms');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditRoom || !roomId || !isRoomInScope) return;
    router.push(`/settings/rooms/${roomId}/edit`);
  }, [canEditRoom, roomId, isRoomInScope, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteRoom || !roomId || !isRoomInScope) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(roomId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/rooms?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteRoom, roomId, isRoomInScope, remove, isOffline, router, t]);

  return {
    id: roomId,
    room: visibleRoom,
    roomName,
    tenantLabel,
    facilityLabel,
    wardLabel,
    floorLabel,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode) && isRoomInScope,
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditRoom && isRoomInScope ? handleEdit : undefined,
    onDelete: canDeleteRoom && isRoomInScope ? handleDelete : undefined,
  };
};

export default useRoomDetailScreen;
