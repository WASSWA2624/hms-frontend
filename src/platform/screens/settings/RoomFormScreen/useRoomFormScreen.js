/**
 * useRoomFormScreen Hook
 * Shared logic for RoomFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const MAX_NAME_LENGTH = 255;
const MAX_FLOOR_LENGTH = 50;

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useRoomFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const router = useRouter();
  const {
    id,
    tenantId: tenantIdParam,
    facilityId: facilityIdParam,
    wardId: wardIdParam,
  } = useLocalSearchParams();
  const routeRoomId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const { get, create, update, data, isLoading, errorCode, reset } = useRoom();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();
  const {
    list: listFacilities,
    data: facilityData,
    isLoading: facilityListLoading,
    errorCode: facilityErrorCode,
    reset: resetFacilities,
  } = useFacility();
  const {
    list: listWards,
    data: wardData,
    isLoading: wardListLoading,
    errorCode: wardErrorCode,
    reset: resetWards,
  } = useWard();

  const isEdit = Boolean(routeRoomId);
  const canManageRooms = canAccessTenantSettings;
  const canCreateRoom = canManageRooms;
  const canEditRoom = canManageRooms;
  const isTenantScopedAdmin = canManageRooms && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [name, setName] = useState('');
  const [floor, setFloor] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [wardId, setWardId] = useState('');
  const tenantPrefillRef = useRef(false);
  const facilityPrefillRef = useRef(false);
  const wardPrefillRef = useRef(false);
  const previousTenantRef = useRef('');
  const previousFacilityRef = useRef('');

  const room = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (isTenantScopedAdmin || isEdit
      ? []
      : (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? []))),
    [tenantData, isTenantScopedAdmin, isEdit]
  );
  const facilityItems = useMemo(
    () => (Array.isArray(facilityData) ? facilityData : (facilityData?.items ?? [])),
    [facilityData]
  );
  const wardItems = useMemo(
    () => (Array.isArray(wardData) ? wardData : (wardData?.items ?? [])),
    [wardData]
  );
  const tenantOptions = useMemo(() => {
    if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
      return [{ value: normalizedScopedTenantId, label: normalizedScopedTenantId }];
    }
    return tenantItems.map((tenant) => ({
      value: tenant.id,
      label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
    }));
  }, [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId]);
  const facilityOptions = useMemo(() => {
    const options = facilityItems.map((facility) => ({
      value: facility.id,
      label: facility.name ?? facility.id ?? '',
    }));
    if (facilityId && !options.some((option) => option.value === facilityId)) {
      return [{ value: facilityId, label: facilityId }, ...options];
    }
    return options;
  }, [facilityItems, facilityId]);
  const wardOptions = useMemo(() => {
    const options = wardItems.map((ward) => ({
      value: ward.id,
      label: ward.name ?? ward.id ?? '',
    }));
    if (wardId && !options.some((option) => option.value === wardId)) {
      return [{ value: wardId, label: wardId }, ...options];
    }
    return options;
  }, [wardItems, wardId]);
  const wardSelectOptions = useMemo(
    () => [{ value: '', label: t('room.form.wardNoneOption') }, ...wardOptions],
    [t, wardOptions]
  );

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageRooms) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateRoom) {
      router.replace('/settings/rooms?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditRoom) {
      router.replace('/settings/rooms?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageRooms,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateRoom,
    canEditRoom,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRooms || !isEdit || !routeRoomId) return;
    if (!canEditRoom) return;
    reset();
    get(routeRoomId);
  }, [isResolved, canManageRooms, isEdit, routeRoomId, canEditRoom, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageRooms || isEdit) return;
    if (!canCreateRoom) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [
    isResolved,
    canManageRooms,
    isEdit,
    canCreateRoom,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (room) {
      setName(room.name ?? '');
      setFloor(room.floor ?? '');
      setTenantId(String(room.tenant_id ?? normalizedScopedTenantId ?? ''));
      setFacilityId(room.facility_id ?? '');
      setWardId(room.ward_id ?? '');
    }
  }, [room, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageRooms || !isTenantScopedAdmin || !isEdit || !room) return;
    const roomTenantId = String(room.tenant_id ?? '').trim();
    if (!roomTenantId || roomTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/rooms?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageRooms,
    isTenantScopedAdmin,
    isEdit,
    room,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRooms || !isEdit) return;
    if (room) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/rooms?notice=accessDenied');
    }
  }, [isResolved, canManageRooms, isEdit, room, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageRooms) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (!trimmedTenant) {
      resetFacilities();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenant });
  }, [isResolved, canManageRooms, tenantId, listFacilities, resetFacilities]);

  useEffect(() => {
    if (!isResolved || !canManageRooms) return;
    const trimmedFacility = String(facilityId ?? '').trim();
    if (!trimmedFacility) {
      resetWards();
      return;
    }
    const params = { page: 1, limit: 200, facility_id: trimmedFacility };
    const trimmedTenant = String(tenantId ?? '').trim();
    if (trimmedTenant) {
      params.tenant_id = trimmedTenant;
    }
    resetWards();
    listWards(params);
  }, [isResolved, canManageRooms, facilityId, tenantId, listWards, resetWards]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (previousTenantRef.current && previousTenantRef.current !== trimmedTenant) {
      setFacilityId('');
      setWardId('');
      facilityPrefillRef.current = false;
      wardPrefillRef.current = false;
    }
    previousTenantRef.current = trimmedTenant;
  }, [tenantId, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedFacility = String(facilityId ?? '').trim();
    if (previousFacilityRef.current && previousFacilityRef.current !== trimmedFacility) {
      setWardId('');
      wardPrefillRef.current = false;
    }
    previousFacilityRef.current = trimmedFacility;
  }, [facilityId, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    if (tenantPrefillRef.current) return;
    if (isTenantScopedAdmin && normalizedScopedTenantId) {
      setTenantId(normalizedScopedTenantId);
      tenantPrefillRef.current = true;
      return;
    }
    const paramValue = Array.isArray(tenantIdParam) ? tenantIdParam[0] : tenantIdParam;
    if (paramValue) {
      setTenantId(String(paramValue));
      tenantPrefillRef.current = true;
      return;
    }
    if (tenantOptions.length === 1 && !tenantId) {
      setTenantId(tenantOptions[0].value);
      tenantPrefillRef.current = true;
    }
  }, [
    isEdit,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    tenantIdParam,
    tenantOptions,
    tenantId,
  ]);

  useEffect(() => {
    if (isEdit) return;
    if (facilityPrefillRef.current) return;
    const paramValue = Array.isArray(facilityIdParam) ? facilityIdParam[0] : facilityIdParam;
    if (paramValue) {
      setFacilityId(String(paramValue));
      facilityPrefillRef.current = true;
      return;
    }
    if (facilityOptions.length === 1 && !facilityId) {
      setFacilityId(facilityOptions[0].value);
      facilityPrefillRef.current = true;
    }
  }, [isEdit, facilityIdParam, facilityOptions, facilityId]);

  useEffect(() => {
    if (isEdit) return;
    if (wardPrefillRef.current) return;
    const paramValue = Array.isArray(wardIdParam) ? wardIdParam[0] : wardIdParam;
    if (paramValue) {
      setWardId(String(paramValue));
      wardPrefillRef.current = true;
      return;
    }
    if (wardOptions.length === 1 && !wardId) {
      setWardId(wardOptions[0].value);
      wardPrefillRef.current = true;
    }
  }, [isEdit, wardIdParam, wardOptions, wardId]);

  const trimmedName = name.trim();
  const trimmedFloor = floor.trim();
  const trimmedTenantId = String(tenantId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();
  const trimmedWardId = String(wardId ?? '').trim();
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'room.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'room.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'room.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );
  const wardErrorMessage = useMemo(
    () => resolveErrorMessage(t, wardErrorCode, 'room.form.wardLoadErrorMessage'),
    [t, wardErrorCode]
  );
  const tenantListError = Boolean(tenantErrorCode);
  const facilityListError = Boolean(facilityErrorCode);
  const wardListError = Boolean(wardErrorCode);
  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const hasWards = wardOptions.length > 0;
  const requiresTenant = !isEdit;
  const requiresFacility = !isEdit;
  const isCreateBlocked = requiresTenant && !hasTenants;
  const isFacilityBlocked =
    requiresFacility && Boolean(trimmedTenantId) && !facilityListLoading && !facilityListError && !hasFacilities;

  const nameError = useMemo(() => {
    if (!trimmedName) return t('room.form.nameRequired');
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return t('room.form.nameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedName, t]);

  const floorError = useMemo(() => {
    if (!trimmedFloor) return null;
    if (trimmedFloor.length > MAX_FLOOR_LENGTH) {
      return t('room.form.floorTooLong', { max: MAX_FLOOR_LENGTH });
    }
    return null;
  }, [trimmedFloor, t]);

  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('room.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);

  const facilityError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedFacilityId) return t('room.form.facilityRequired');
    return null;
  }, [isEdit, trimmedFacilityId, t]);

  const isTenantLocked = !isEdit && isTenantScopedAdmin;
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return trimmedTenantId || normalizedScopedTenantId;
  }, [isTenantLocked, trimmedTenantId, normalizedScopedTenantId]);

  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    isFacilityBlocked ||
    Boolean(nameError) ||
    Boolean(floorError) ||
    Boolean(tenantError) ||
    Boolean(facilityError) ||
    (isEdit ? !canEditRoom : !canCreateRoom);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateRoom) {
        router.replace('/settings/rooms?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditRoom) {
        router.replace('/settings/rooms?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const roomTenantId = String(room?.tenant_id ?? '').trim();
        if (!roomTenantId || roomTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/rooms?notice=accessDenied');
          return;
        }
      }
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        name: trimmedName,
        floor: trimmedFloor || undefined,
      };
      if (!isEdit) {
        payload.tenant_id = trimmedTenantId;
        payload.facility_id = trimmedFacilityId;
        if (trimmedWardId) {
          payload.ward_id = trimmedWardId;
        }
      }
      if (isEdit && !trimmedFloor) {
        payload.floor = null;
      }
      if (isEdit) {
        payload.ward_id = trimmedWardId || null;
      }
      if (isEdit && routeRoomId) {
        const result = await update(routeRoomId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/rooms?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    routeRoomId,
    canCreateRoom,
    canEditRoom,
    isTenantScopedAdmin,
    room,
    normalizedScopedTenantId,
    trimmedName,
    trimmedFloor,
    trimmedTenantId,
    trimmedFacilityId,
    trimmedWardId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/rooms');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleGoToFacilities = useCallback(() => {
    router.push('/settings/facilities');
  }, [router]);

  const handleGoToWards = useCallback(() => {
    router.push('/settings/wards');
  }, [router]);

  const handleRetryTenants = useCallback(() => {
    if (isTenantScopedAdmin || isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  const handleRetryFacilities = useCallback(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    resetFacilities();
    if (!trimmedTenant) return;
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenant });
  }, [listFacilities, resetFacilities, tenantId]);

  const handleRetryWards = useCallback(() => {
    const trimmedFacility = String(facilityId ?? '').trim();
    resetWards();
    if (!trimmedFacility) return;
    const params = { page: 1, limit: 200, facility_id: trimmedFacility };
    const trimmedTenant = String(tenantId ?? '').trim();
    if (trimmedTenant) {
      params.tenant_id = trimmedTenant;
    }
    listWards(params);
  }, [facilityId, tenantId, listWards, resetWards]);

  return {
    isEdit,
    name,
    setName,
    floor,
    setFloor,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    wardId,
    setWardId,
    tenantOptions,
    tenantListLoading: isTenantScopedAdmin ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin ? false : tenantListError,
    tenantErrorMessage: isTenantScopedAdmin ? null : tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    wardOptions: wardSelectOptions,
    wardListLoading,
    wardListError,
    wardErrorMessage,
    hasTenants,
    hasFacilities,
    hasWards,
    isCreateBlocked,
    isFacilityBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    room,
    nameError,
    floorError,
    tenantError,
    facilityError,
    isTenantLocked,
    lockedTenantDisplay,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToFacilities: handleGoToFacilities,
    onGoToWards: handleGoToWards,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    onRetryWards: handleRetryWards,
    isSubmitDisabled,
    testID: 'room-form-screen',
  };
};

export default useRoomFormScreen;
