/**
 * useBedFormScreen Hook
 * Shared logic for BedFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const MAX_LABEL_LENGTH = 50;
const BED_STATUSES = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'OUT_OF_SERVICE'];

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useBedFormScreen = () => {
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
    roomId: roomIdParam,
  } = useLocalSearchParams();
  const routeBedId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const { get, create, update, data, isLoading, errorCode, reset } = useBed();
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
  const {
    list: listRooms,
    data: roomData,
    isLoading: roomListLoading,
    errorCode: roomErrorCode,
    reset: resetRooms,
  } = useRoom();

  const isEdit = Boolean(routeBedId);
  const canManageBeds = canAccessTenantSettings;
  const canCreateBed = canManageBeds;
  const canEditBed = canManageBeds;
  const isTenantScopedAdmin = canManageBeds && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [wardId, setWardId] = useState('');
  const [roomId, setRoomId] = useState('');
  const tenantPrefillRef = useRef(false);
  const facilityPrefillRef = useRef(false);
  const wardPrefillRef = useRef(false);
  const roomPrefillRef = useRef(false);
  const previousTenantRef = useRef('');
  const previousFacilityRef = useRef('');
  const previousWardRef = useRef('');

  const bed = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () =>
      (isTenantScopedAdmin || isEdit
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
  const roomItems = useMemo(
    () => (Array.isArray(roomData) ? roomData : (roomData?.items ?? [])),
    [roomData]
  );
  const tenantOptions = useMemo(
    () => {
      if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
        return [{ value: normalizedScopedTenantId, label: normalizedScopedTenantId }];
      }
      return tenantItems.map((tenant) => ({
        value: tenant.id,
        label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
      }));
    },
    [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId]
  );
  const facilityOptions = useMemo(
    () => {
      const options = facilityItems.map((facility) => ({
        value: facility.id,
        label: facility.name ?? facility.id ?? '',
      }));
      if (facilityId && !options.some((option) => option.value === facilityId)) {
        return [{ value: facilityId, label: facilityId }, ...options];
      }
      return options;
    },
    [facilityItems, facilityId]
  );
  const wardOptions = useMemo(
    () => {
      const options = wardItems.map((ward) => ({
        value: ward.id,
        label: ward.name ?? ward.id ?? '',
      }));
      if (wardId && !options.some((option) => option.value === wardId)) {
        return [{ value: wardId, label: wardId }, ...options];
      }
      return options;
    },
    [wardItems, wardId]
  );
  const roomOptions = useMemo(
    () => {
      const options = roomItems.map((room) => ({
        value: room.id,
        label: room.name ?? room.id ?? '',
      }));
      if (roomId && !options.some((option) => option.value === roomId)) {
        return [{ value: roomId, label: roomId }, ...options];
      }
      return options;
    },
    [roomItems, roomId]
  );

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageBeds) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateBed) {
      router.replace('/settings/beds?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditBed) {
      router.replace('/settings/beds?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageBeds,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateBed,
    canEditBed,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || !isEdit || !routeBedId) return;
    if (!canEditBed) return;
    reset();
    get(routeBedId);
  }, [isResolved, canManageBeds, isEdit, routeBedId, canEditBed, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || isEdit) return;
    if (!canCreateBed) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [
    isResolved,
    canManageBeds,
    isEdit,
    canCreateBed,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (bed) {
      setLabel(bed.label ?? '');
      setStatus(bed.status ?? '');
      setTenantId(String(bed.tenant_id ?? normalizedScopedTenantId ?? ''));
      setFacilityId(bed.facility_id ?? '');
      setWardId(bed.ward_id ?? '');
      setRoomId(bed.room_id ?? '');
    }
  }, [bed, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || !isTenantScopedAdmin || !isEdit || !bed) return;
    const bedTenantId = String(bed.tenant_id ?? '').trim();
    if (!bedTenantId || bedTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/beds?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageBeds,
    isTenantScopedAdmin,
    isEdit,
    bed,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || !isEdit) return;
    if (bed) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/beds?notice=accessDenied');
    }
  }, [isResolved, canManageBeds, isEdit, bed, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || isEdit) return;
    if (isEdit) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (!trimmedTenant) {
      resetFacilities();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenant });
  }, [isResolved, canManageBeds, tenantId, isEdit, listFacilities, resetFacilities]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || isEdit) return;
    if (isEdit) return;
    const trimmedFacility = String(facilityId ?? '').trim();
    if (!trimmedFacility) {
      resetWards();
      return;
    }
    resetWards();
    listWards({ page: 1, limit: 200, facility_id: trimmedFacility });
  }, [isResolved, canManageBeds, facilityId, isEdit, listWards, resetWards]);

  useEffect(() => {
    if (!isResolved || !canManageBeds) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    const trimmedFacility = String(facilityId ?? '').trim();
    const trimmedWard = String(wardId ?? '').trim();
    if (!trimmedTenant || !trimmedFacility) {
      resetRooms();
      return;
    }
    resetRooms();
    listRooms({
      page: 1,
      limit: 200,
      tenant_id: trimmedTenant,
      facility_id: trimmedFacility,
      ward_id: trimmedWard || undefined,
    });
  }, [isResolved, canManageBeds, tenantId, facilityId, wardId, listRooms, resetRooms]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (previousTenantRef.current && previousTenantRef.current !== trimmedTenant) {
      setFacilityId('');
      setWardId('');
      setRoomId('');
      facilityPrefillRef.current = false;
      wardPrefillRef.current = false;
      roomPrefillRef.current = false;
    }
    previousTenantRef.current = trimmedTenant;
  }, [tenantId, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedFacility = String(facilityId ?? '').trim();
    if (previousFacilityRef.current && previousFacilityRef.current !== trimmedFacility) {
      setWardId('');
      setRoomId('');
      wardPrefillRef.current = false;
      roomPrefillRef.current = false;
    }
    previousFacilityRef.current = trimmedFacility;
  }, [facilityId, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedWard = String(wardId ?? '').trim();
    if (previousWardRef.current && previousWardRef.current !== trimmedWard) {
      setRoomId('');
      roomPrefillRef.current = false;
    }
    previousWardRef.current = trimmedWard;
  }, [wardId, isEdit]);

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

  useEffect(() => {
    if (isEdit) return;
    if (roomPrefillRef.current) return;
    const paramValue = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;
    if (paramValue) {
      setRoomId(String(paramValue));
      roomPrefillRef.current = true;
      return;
    }
    if (roomOptions.length === 1 && !roomId) {
      setRoomId(roomOptions[0].value);
      roomPrefillRef.current = true;
    }
  }, [isEdit, roomIdParam, roomOptions, roomId]);

  const trimmedLabel = label.trim();
  const trimmedStatus = String(status ?? '').trim().toUpperCase();
  const trimmedTenantId = String(tenantId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();
  const trimmedWardId = String(wardId ?? '').trim();
  const trimmedRoomId = String(roomId ?? '').trim();
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'bed.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'bed.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'bed.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );
  const wardErrorMessage = useMemo(
    () => resolveErrorMessage(t, wardErrorCode, 'bed.form.wardLoadErrorMessage'),
    [t, wardErrorCode]
  );
  const roomErrorMessage = useMemo(
    () => resolveErrorMessage(t, roomErrorCode, 'bed.form.roomLoadErrorMessage'),
    [t, roomErrorCode]
  );
  const tenantListError = Boolean(tenantErrorCode);
  const facilityListError = Boolean(facilityErrorCode);
  const wardListError = Boolean(wardErrorCode);
  const roomListError = Boolean(roomErrorCode);
  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const hasWards = wardOptions.length > 0;
  const hasRooms = roomOptions.length > 0;
  const requiresTenant = !isEdit;
  const requiresFacility = !isEdit;
  const requiresWard = !isEdit;
  const requiresStatus = !isEdit;
  const isCreateBlocked = requiresTenant && !hasTenants;
  const isFacilityBlocked =
    requiresFacility && Boolean(trimmedTenantId) && !facilityListLoading && !facilityListError && !hasFacilities;
  const isWardBlocked =
    requiresWard && Boolean(trimmedFacilityId) && !wardListLoading && !wardListError && !hasWards;
  const labelError = useMemo(() => {
    if (!trimmedLabel) return t('bed.form.labelRequired');
    if (trimmedLabel.length > MAX_LABEL_LENGTH) {
      return t('bed.form.labelTooLong', { max: MAX_LABEL_LENGTH });
    }
    return null;
  }, [trimmedLabel, t]);
  const statusError = useMemo(() => {
    if (requiresStatus && !trimmedStatus) {
      return t('bed.form.statusRequired');
    }
    if (trimmedStatus && !BED_STATUSES.includes(trimmedStatus)) {
      return t('bed.form.statusInvalid');
    }
    return null;
  }, [requiresStatus, trimmedStatus, t]);
  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('bed.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);
  const facilityError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedFacilityId) return t('bed.form.facilityRequired');
    return null;
  }, [isEdit, trimmedFacilityId, t]);
  const wardError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedWardId) return t('bed.form.wardRequired');
    return null;
  }, [isEdit, trimmedWardId, t]);
  const statusOptions = useMemo(
    () => BED_STATUSES.map((value) => ({ value, label: t(`bed.form.statusOptions.${value}`) })),
    [t]
  );
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
    isWardBlocked ||
    Boolean(labelError) ||
    Boolean(statusError) ||
    Boolean(tenantError) ||
    Boolean(facilityError) ||
    Boolean(wardError) ||
    (isEdit ? !canEditBed : !canCreateBed);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateBed) {
        router.replace('/settings/beds?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditBed) {
        router.replace('/settings/beds?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const bedTenantId = String(bed?.tenant_id ?? '').trim();
        if (!bedTenantId || bedTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/beds?notice=accessDenied');
          return;
        }
      }
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        label: trimmedLabel,
      };
      if (trimmedStatus) {
        payload.status = trimmedStatus;
      }
      if (!isEdit) {
        payload.tenant_id = trimmedTenantId;
        payload.facility_id = trimmedFacilityId;
        payload.ward_id = trimmedWardId;
        if (trimmedRoomId) payload.room_id = trimmedRoomId;
      } else if (trimmedRoomId) {
        payload.room_id = trimmedRoomId;
      } else {
        payload.room_id = null;
      }
      if (isEdit && routeBedId) {
        const result = await update(routeBedId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/beds?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    routeBedId,
    canCreateBed,
    canEditBed,
    isTenantScopedAdmin,
    bed,
    normalizedScopedTenantId,
    trimmedLabel,
    trimmedStatus,
    trimmedTenantId,
    trimmedFacilityId,
    trimmedWardId,
    trimmedRoomId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/beds');
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

  const handleGoToRooms = useCallback(() => {
    router.push('/settings/rooms');
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
    listWards({ page: 1, limit: 200, facility_id: trimmedFacility });
  }, [listWards, resetWards, facilityId]);

  const handleRetryRooms = useCallback(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    const trimmedFacility = String(facilityId ?? '').trim();
    const trimmedWard = String(wardId ?? '').trim();
    resetRooms();
    if (!trimmedTenant || !trimmedFacility) return;
    listRooms({
      page: 1,
      limit: 200,
      tenant_id: trimmedTenant,
      facility_id: trimmedFacility,
      ward_id: trimmedWard || undefined,
    });
  }, [listRooms, resetRooms, tenantId, facilityId, wardId]);

  return {
    isEdit,
    label,
    setLabel,
    status,
    setStatus,
    statusOptions,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    wardId,
    setWardId,
    roomId,
    setRoomId,
    tenantOptions,
    tenantListLoading: isTenantScopedAdmin ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin ? false : tenantListError,
    tenantErrorMessage: isTenantScopedAdmin ? null : tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    wardOptions,
    wardListLoading,
    wardListError,
    wardErrorMessage,
    roomOptions,
    roomListLoading,
    roomListError,
    roomErrorMessage,
    hasTenants,
    hasFacilities,
    hasWards,
    hasRooms,
    isCreateBlocked,
    isFacilityBlocked,
    isWardBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    bed,
    labelError,
    statusError,
    tenantError,
    facilityError,
    wardError,
    isTenantLocked,
    lockedTenantDisplay,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToFacilities: handleGoToFacilities,
    onGoToWards: handleGoToWards,
    onGoToRooms: handleGoToRooms,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    onRetryWards: handleRetryWards,
    onRetryRooms: handleRetryRooms,
    isSubmitDisabled,
    testID: 'bed-form-screen',
  };
};

export default useBedFormScreen;
