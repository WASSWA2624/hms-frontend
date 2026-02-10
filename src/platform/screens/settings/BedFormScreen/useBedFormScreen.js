/**
 * useBedFormScreen Hook
 * Shared logic for BedFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useBed, useTenant, useFacility, useWard } from '@hooks';

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
  const router = useRouter();
  const { id, tenantId: tenantIdParam, facilityId: facilityIdParam, wardId: wardIdParam } = useLocalSearchParams();
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

  const isEdit = Boolean(id);
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [wardId, setWardId] = useState('');
  const tenantPrefillRef = useRef(false);
  const facilityPrefillRef = useRef(false);
  const wardPrefillRef = useRef(false);
  const previousTenantRef = useRef('');
  const previousFacilityRef = useRef('');

  const bed = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? [])),
    [tenantData]
  );
  const facilityItems = useMemo(
    () => (Array.isArray(facilityData) ? facilityData : (facilityData?.items ?? [])),
    [facilityData]
  );
  const wardItems = useMemo(
    () => (Array.isArray(wardData) ? wardData : (wardData?.items ?? [])),
    [wardData]
  );
  const tenantOptions = useMemo(
    () =>
      tenantItems.map((tenant) => ({
        value: tenant.id,
        label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
      })),
    [tenantItems]
  );
  const facilityOptions = useMemo(
    () =>
      facilityItems.map((facility) => ({
        value: facility.id,
        label: facility.name ?? facility.id ?? '',
      })),
    [facilityItems]
  );
  const wardOptions = useMemo(
    () =>
      wardItems.map((ward) => ({
        value: ward.id,
        label: ward.name ?? ward.id ?? '',
      })),
    [wardItems]
  );

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (!isEdit) {
      resetTenants();
      listTenants({ page: 1, limit: 200 });
    }
  }, [isEdit, listTenants, resetTenants]);

  useEffect(() => {
    if (bed) {
      setLabel(bed.label ?? bed.name ?? '');
      setStatus(bed.status ?? '');
      setTenantId(bed.tenant_id ?? '');
      setFacilityId(bed.facility_id ?? '');
      setWardId(bed.ward_id ?? '');
    }
  }, [bed]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (!trimmedTenant) {
      resetFacilities();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenant });
  }, [tenantId, isEdit, listFacilities, resetFacilities]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedFacility = String(facilityId ?? '').trim();
    if (!trimmedFacility) {
      resetWards();
      return;
    }
    resetWards();
    listWards({ page: 1, limit: 200, facility_id: trimmedFacility });
  }, [facilityId, isEdit, listWards, resetWards]);

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
  }, [isEdit, tenantIdParam, tenantOptions, tenantId]);

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

  const trimmedLabel = label.trim();
  const trimmedStatus = status.trim();
  const trimmedTenantId = String(tenantId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();
  const trimmedWardId = String(wardId ?? '').trim();
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
  const tenantListError = Boolean(tenantErrorCode);
  const facilityListError = Boolean(facilityErrorCode);
  const wardListError = Boolean(wardErrorCode);
  const hasTenants = tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const hasWards = wardOptions.length > 0;
  const requiresTenant = !isEdit;
  const requiresFacility = !isEdit;
  const requiresWard = !isEdit;
  const isCreateBlocked = requiresTenant && !hasTenants;
  const isFacilityBlocked =
    requiresFacility && Boolean(trimmedTenantId) && !facilityListLoading && !facilityListError && !hasFacilities;
  const isWardBlocked =
    requiresWard && Boolean(trimmedFacilityId) && !wardListLoading && !wardListError && !hasWards;
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    isFacilityBlocked ||
    isWardBlocked ||
    !trimmedLabel ||
    (requiresTenant && !trimmedTenantId) ||
    (requiresFacility && !trimmedFacilityId) ||
    (requiresWard && !trimmedWardId);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        label: trimmedLabel,
        status: trimmedStatus || undefined,
      };
      if (!isEdit) {
        if (trimmedTenantId) payload.tenant_id = trimmedTenantId;
        if (trimmedFacilityId) payload.facility_id = trimmedFacilityId;
        if (trimmedWardId) payload.ward_id = trimmedWardId;
      }
      if (isEdit && !trimmedStatus) {
        payload.status = null;
      }
      if (isEdit && id) {
        const result = await update(id, payload);
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
    id,
    trimmedLabel,
    trimmedStatus,
    trimmedTenantId,
    trimmedFacilityId,
    trimmedWardId,
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

  const handleRetryTenants = useCallback(() => {
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [listTenants, resetTenants]);

  const handleRetryFacilities = useCallback(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    resetFacilities();
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenant || undefined });
  }, [listFacilities, resetFacilities, tenantId]);

  const handleRetryWards = useCallback(() => {
    const trimmedFacility = String(facilityId ?? '').trim();
    resetWards();
    listWards({ page: 1, limit: 200, facility_id: trimmedFacility || undefined });
  }, [listWards, resetWards, facilityId]);

  return {
    isEdit,
    label,
    setLabel,
    status,
    setStatus,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    wardId,
    setWardId,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    wardOptions,
    wardListLoading,
    wardListError,
    wardErrorMessage,
    hasTenants,
    hasFacilities,
    hasWards,
    isCreateBlocked,
    isFacilityBlocked,
    isWardBlocked,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    bed,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToFacilities: handleGoToFacilities,
    onGoToWards: handleGoToWards,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    onRetryWards: handleRetryWards,
    isSubmitDisabled,
    testID: 'bed-form-screen',
  };
};

export default useBedFormScreen;
