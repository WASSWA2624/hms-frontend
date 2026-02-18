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
import { humanizeIdentifier } from '@utils';

const MAX_LABEL_LENGTH = 50;
const MAX_FETCH_LIMIT = 100;
const BED_STATUSES = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'OUT_OF_SERVICE'];

const normalizeValue = (value) => String(value ?? '').trim();
const resolveListItems = (value) => (Array.isArray(value) ? value : (value?.items ?? []));

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const resolveReadableLabel = (value) => normalizeValue(humanizeIdentifier(value));

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
    () => normalizeValue(scopedTenantId),
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
    () => (
      isTenantScopedAdmin || isEdit
        ? []
        : resolveListItems(tenantData)
    ),
    [tenantData, isTenantScopedAdmin, isEdit]
  );
  const facilityItems = useMemo(
    () => resolveListItems(facilityData),
    [facilityData]
  );
  const wardItems = useMemo(
    () => resolveListItems(wardData),
    [wardData]
  );
  const roomItems = useMemo(
    () => resolveListItems(roomData),
    [roomData]
  );

  const tenantOptions = useMemo(() => {
    if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
      return [{ value: normalizedScopedTenantId, label: t('bed.form.currentTenantLabel') }];
    }
    return tenantItems.map((tenant, index) => ({
      value: tenant.id,
      label: resolveReadableLabel(tenant.name ?? tenant.slug)
        || t('bed.form.tenantOptionFallback', { index: index + 1 }),
    }));
  }, [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId, t]);

  const facilityOptions = useMemo(() => {
    const options = facilityItems.map((facility, index) => ({
      value: facility.id,
      label: resolveReadableLabel(facility.name ?? facility.slug)
        || t('bed.form.facilityOptionFallback', { index: index + 1 }),
    }));
    if (facilityId && !options.some((option) => option.value === facilityId)) {
      const fallbackLabel = resolveReadableLabel(
        bed?.facility_name
          ?? bed?.facility?.name
          ?? bed?.facility_label
      ) || t('bed.form.currentFacilityLabel');
      return [{ value: facilityId, label: fallbackLabel }, ...options];
    }
    return options;
  }, [facilityItems, facilityId, bed, t]);

  const wardOptions = useMemo(() => {
    const options = wardItems.map((ward, index) => ({
      value: ward.id,
      label: resolveReadableLabel(ward.name ?? ward.slug)
        || t('bed.form.wardOptionFallback', { index: index + 1 }),
    }));
    if (wardId && !options.some((option) => option.value === wardId)) {
      const fallbackLabel = resolveReadableLabel(
        bed?.ward_name
          ?? bed?.ward?.name
          ?? bed?.ward_label
      ) || t('bed.form.currentWardLabel');
      return [{ value: wardId, label: fallbackLabel }, ...options];
    }
    return options;
  }, [wardItems, wardId, bed, t]);

  const roomOptions = useMemo(() => {
    const options = roomItems.map((room, index) => ({
      value: room.id,
      label: resolveReadableLabel(room.name ?? room.slug)
        || t('bed.form.roomOptionFallback', { index: index + 1 }),
    }));
    if (roomId && !options.some((option) => option.value === roomId)) {
      const fallbackLabel = resolveReadableLabel(
        bed?.room_name
          ?? bed?.room?.name
          ?? bed?.room_label
      ) || t('bed.form.currentRoomLabel');
      return [{ value: roomId, label: fallbackLabel }, ...options];
    }
    return options;
  }, [roomItems, roomId, bed, t]);

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
    listTenants({ page: 1, limit: MAX_FETCH_LIMIT });
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
      setStatus(normalizeValue(bed.status).toUpperCase());
      setTenantId(normalizeValue(bed.tenant_id ?? normalizedScopedTenantId));
      setFacilityId(normalizeValue(bed.facility_id));
      setWardId(normalizeValue(bed.ward_id));
      setRoomId(normalizeValue(bed.room_id));
    }
  }, [bed, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || !isTenantScopedAdmin || !isEdit || !bed) return;
    const bedTenantId = normalizeValue(bed.tenant_id);
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
    if (!isResolved || !canManageBeds) return;
    const trimmedTenant = normalizeValue(tenantId);
    if (!trimmedTenant) {
      resetFacilities();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: trimmedTenant });
  }, [isResolved, canManageBeds, tenantId, listFacilities, resetFacilities]);

  useEffect(() => {
    if (!isResolved || !canManageBeds) return;
    const trimmedFacility = normalizeValue(facilityId);
    if (!trimmedFacility) {
      resetWards();
      return;
    }
    resetWards();
    listWards({ page: 1, limit: MAX_FETCH_LIMIT, facility_id: trimmedFacility });
  }, [isResolved, canManageBeds, facilityId, listWards, resetWards]);

  useEffect(() => {
    if (!isResolved || !canManageBeds) return;
    const trimmedTenant = normalizeValue(tenantId);
    const trimmedFacility = normalizeValue(facilityId);
    const trimmedWard = normalizeValue(wardId);
    if (!trimmedTenant || !trimmedFacility) {
      resetRooms();
      return;
    }
    resetRooms();
    listRooms({
      page: 1,
      limit: MAX_FETCH_LIMIT,
      tenant_id: trimmedTenant,
      facility_id: trimmedFacility,
      ward_id: trimmedWard || undefined,
    });
  }, [isResolved, canManageBeds, tenantId, facilityId, wardId, listRooms, resetRooms]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedTenant = normalizeValue(tenantId);
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
    const trimmedFacility = normalizeValue(facilityId);
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
    const trimmedWard = normalizeValue(wardId);
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
  const trimmedStatus = normalizeValue(status).toUpperCase();
  const trimmedTenantId = normalizeValue(tenantId);
  const trimmedFacilityId = normalizeValue(facilityId);
  const trimmedWardId = normalizeValue(wardId);
  const trimmedRoomId = normalizeValue(roomId);

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
    requiresFacility
    && Boolean(trimmedTenantId)
    && !facilityListLoading
    && !facilityListError
    && !hasFacilities;
  const isWardBlocked =
    requiresWard
    && Boolean(trimmedFacilityId)
    && !wardListLoading
    && !wardListError
    && !hasWards;

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
  const selectedTenantLabel = useMemo(() => {
    if (!trimmedTenantId) return '';
    return tenantOptions.find((option) => option.value === trimmedTenantId)?.label || '';
  }, [tenantOptions, trimmedTenantId]);
  const bedTenantLabel = useMemo(
    () => resolveReadableLabel(
      bed?.tenant_name
        ?? bed?.tenant?.name
        ?? bed?.tenant_label
    ),
    [bed]
  );
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return selectedTenantLabel || t('bed.form.currentTenantLabel');
  }, [isTenantLocked, selectedTenantLabel, t]);
  const tenantDisplayLabel = useMemo(() => {
    if (isEdit) return selectedTenantLabel || bedTenantLabel || t('bed.form.currentTenantLabel');
    if (isTenantLocked) return lockedTenantDisplay;
    return selectedTenantLabel;
  }, [isEdit, selectedTenantLabel, bedTenantLabel, isTenantLocked, lockedTenantDisplay, t]);

  const selectedFacilityLabel = useMemo(() => {
    if (!trimmedFacilityId) return '';
    return facilityOptions.find((option) => option.value === trimmedFacilityId)?.label || '';
  }, [facilityOptions, trimmedFacilityId]);
  const bedFacilityLabel = useMemo(
    () => resolveReadableLabel(
      bed?.facility_name
        ?? bed?.facility?.name
        ?? bed?.facility_label
    ),
    [bed]
  );
  const facilityDisplayLabel = useMemo(() => {
    if (!isEdit) return selectedFacilityLabel;
    return selectedFacilityLabel || bedFacilityLabel || t('bed.form.currentFacilityLabel');
  }, [isEdit, selectedFacilityLabel, bedFacilityLabel, t]);

  const selectedWardLabel = useMemo(() => {
    if (!trimmedWardId) return '';
    return wardOptions.find((option) => option.value === trimmedWardId)?.label || '';
  }, [wardOptions, trimmedWardId]);
  const bedWardLabel = useMemo(
    () => resolveReadableLabel(
      bed?.ward_name
        ?? bed?.ward?.name
        ?? bed?.ward_label
    ),
    [bed]
  );
  const wardDisplayLabel = useMemo(() => {
    if (!isEdit) return selectedWardLabel;
    return selectedWardLabel || bedWardLabel || t('bed.form.currentWardLabel');
  }, [isEdit, selectedWardLabel, bedWardLabel, t]);

  const selectedRoomLabel = useMemo(() => {
    if (!trimmedRoomId) return '';
    return roomOptions.find((option) => option.value === trimmedRoomId)?.label || '';
  }, [roomOptions, trimmedRoomId]);
  const bedRoomLabel = useMemo(
    () => resolveReadableLabel(
      bed?.room_name
        ?? bed?.room?.name
        ?? bed?.room_label
    ),
    [bed]
  );
  const roomDisplayLabel = useMemo(() => {
    if (!trimmedRoomId) return '';
    return selectedRoomLabel || bedRoomLabel || t('bed.form.currentRoomLabel');
  }, [trimmedRoomId, selectedRoomLabel, bedRoomLabel, t]);

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
        const bedTenantId = normalizeValue(bed?.tenant_id);
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
    listTenants({ page: 1, limit: MAX_FETCH_LIMIT });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  const handleRetryFacilities = useCallback(() => {
    const trimmedTenant = normalizeValue(tenantId);
    resetFacilities();
    if (!trimmedTenant) return;
    listFacilities({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: trimmedTenant });
  }, [listFacilities, resetFacilities, tenantId]);

  const handleRetryWards = useCallback(() => {
    const trimmedFacility = normalizeValue(facilityId);
    resetWards();
    if (!trimmedFacility) return;
    listWards({ page: 1, limit: MAX_FETCH_LIMIT, facility_id: trimmedFacility });
  }, [listWards, resetWards, facilityId]);

  const handleRetryRooms = useCallback(() => {
    const trimmedTenant = normalizeValue(tenantId);
    const trimmedFacility = normalizeValue(facilityId);
    const trimmedWard = normalizeValue(wardId);
    resetRooms();
    if (!trimmedTenant || !trimmedFacility) return;
    listRooms({
      page: 1,
      limit: MAX_FETCH_LIMIT,
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
    tenantDisplayLabel,
    facilityDisplayLabel,
    wardDisplayLabel,
    roomDisplayLabel,
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
