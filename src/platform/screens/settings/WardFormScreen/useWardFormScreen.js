/**
 * useWardFormScreen Hook
 * Shared logic for WardFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useI18n,
  useNetwork,
  useWard,
  useTenant,
  useFacility,
  useTenantAccess,
} from '@hooks';
import { humanizeIdentifier } from '@utils';

const MAX_NAME_LENGTH = 255;
const MAX_TYPE_LENGTH = 100;
const MAX_FETCH_LIMIT = 100;

const normalizeValue = (value) => String(value ?? '').trim();
const resolveListItems = (value) => (Array.isArray(value) ? value : (value?.items ?? []));
const resolveReadableLabel = (value) => normalizeValue(humanizeIdentifier(value));

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const parseBoolean = (value, fallback = true) => {
  if (typeof value === 'boolean') return value;
  const normalized = normalizeValue(value).toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true;
  }
  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
    return false;
  }
  return fallback;
};

const useWardFormScreen = () => {
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
  } = useLocalSearchParams();

  const routeWardId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);

  const { get, create, update, data, isLoading, errorCode, reset } = useWard();
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

  const isEdit = Boolean(routeWardId);
  const canManageWards = canAccessTenantSettings;
  const canCreateWard = canManageWards;
  const canEditWard = canManageWards;
  const isTenantScopedAdmin = canManageWards && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => normalizeValue(scopedTenantId),
    [scopedTenantId]
  );

  const [name, setName] = useState('');
  const [wardType, setWardType] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');

  const tenantPrefillRef = useRef(false);
  const facilityPrefillRef = useRef(false);
  const previousTenantRef = useRef('');

  const ward = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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

  const tenantOptions = useMemo(() => {
    if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
      return [{ value: normalizedScopedTenantId, label: t('ward.form.currentTenantLabel') }];
    }
    return tenantItems.map((tenant, index) => ({
      value: tenant.id,
      label: resolveReadableLabel(tenant.name ?? tenant.slug)
        || t('ward.form.tenantOptionFallback', { index: index + 1 }),
    }));
  }, [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId, t]);

  const facilityOptions = useMemo(() => {
    const options = facilityItems.map((facility, index) => ({
      value: facility.id,
      label: resolveReadableLabel(facility.name ?? facility.slug)
        || t('ward.form.facilityOptionFallback', { index: index + 1 }),
    }));
    if (facilityId && !options.some((option) => option.value === facilityId)) {
      const fallbackLabel = resolveReadableLabel(
        ward?.facility_name
        ?? ward?.facility?.name
        ?? ward?.facility_label
      ) || t('ward.form.currentFacilityLabel');
      return [{ value: facilityId, label: fallbackLabel }, ...options];
    }
    return options;
  }, [facilityItems, facilityId, ward, t]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageWards) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateWard) {
      router.replace('/settings/wards?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditWard) {
      router.replace('/settings/wards?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageWards,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateWard,
    canEditWard,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageWards || !isEdit || !routeWardId) return;
    if (!canEditWard) return;
    reset();
    get(routeWardId);
  }, [isResolved, canManageWards, isEdit, routeWardId, canEditWard, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageWards || isEdit) return;
    if (!canCreateWard) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: MAX_FETCH_LIMIT });
  }, [
    isResolved,
    canManageWards,
    isEdit,
    canCreateWard,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (!ward) return;
    setName(ward.name ?? '');
    setWardType(ward.ward_type ?? ward.type ?? '');
    setIsActive(parseBoolean(ward.is_active, true));
    setTenantId(normalizeValue(ward.tenant_id ?? normalizedScopedTenantId));
    setFacilityId(normalizeValue(ward.facility_id));
  }, [ward, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageWards || !isTenantScopedAdmin || !isEdit || !ward) return;
    const wardTenantId = normalizeValue(ward.tenant_id);
    if (!wardTenantId || wardTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/wards?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageWards,
    isTenantScopedAdmin,
    isEdit,
    ward,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageWards || !isEdit) return;
    if (ward) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/wards?notice=accessDenied');
    }
  }, [isResolved, canManageWards, isEdit, ward, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageWards) return;
    const trimmedTenant = normalizeValue(tenantId);
    if (!trimmedTenant) {
      resetFacilities();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: trimmedTenant });
  }, [isResolved, canManageWards, tenantId, listFacilities, resetFacilities]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedTenant = normalizeValue(tenantId);
    if (previousTenantRef.current && previousTenantRef.current !== trimmedTenant) {
      setFacilityId('');
      facilityPrefillRef.current = false;
    }
    previousTenantRef.current = trimmedTenant;
  }, [tenantId, isEdit]);

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

  const trimmedName = name.trim();
  const trimmedType = wardType.trim();
  const trimmedTenantId = normalizeValue(tenantId);
  const trimmedFacilityId = normalizeValue(facilityId);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'ward.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'ward.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'ward.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );

  const tenantListError = Boolean(tenantErrorCode);
  const facilityListError = Boolean(facilityErrorCode);
  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const requiresTenant = !isEdit;
  const requiresFacility = !isEdit;
  const isCreateBlocked = requiresTenant && !hasTenants;
  const isFacilityBlocked =
    requiresFacility
    && Boolean(trimmedTenantId)
    && !facilityListLoading
    && !facilityListError
    && !hasFacilities;

  const nameError = useMemo(() => {
    if (!trimmedName) return t('ward.form.nameRequired');
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return t('ward.form.nameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedName, t]);

  const typeError = useMemo(() => {
    if (!trimmedType) return null;
    if (trimmedType.length > MAX_TYPE_LENGTH) {
      return t('ward.form.typeTooLong', { max: MAX_TYPE_LENGTH });
    }
    return null;
  }, [trimmedType, t]);

  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('ward.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);

  const facilityError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedFacilityId) return t('ward.form.facilityRequired');
    return null;
  }, [isEdit, trimmedFacilityId, t]);

  const isTenantLocked = !isEdit && isTenantScopedAdmin;
  const selectedTenantLabel = useMemo(() => {
    if (!trimmedTenantId) return '';
    return tenantOptions.find((option) => option.value === trimmedTenantId)?.label || '';
  }, [tenantOptions, trimmedTenantId]);
  const wardTenantLabel = useMemo(
    () => resolveReadableLabel(
      ward?.tenant_name
      ?? ward?.tenant?.name
      ?? ward?.tenant_label
    ),
    [ward]
  );
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return selectedTenantLabel || t('ward.form.currentTenantLabel');
  }, [isTenantLocked, selectedTenantLabel, t]);
  const tenantDisplayLabel = useMemo(() => {
    if (isEdit) return selectedTenantLabel || wardTenantLabel || t('ward.form.currentTenantLabel');
    if (isTenantLocked) return lockedTenantDisplay;
    return selectedTenantLabel;
  }, [isEdit, selectedTenantLabel, wardTenantLabel, isTenantLocked, lockedTenantDisplay, t]);

  const selectedFacilityLabel = useMemo(() => {
    if (!trimmedFacilityId) return '';
    return facilityOptions.find((option) => option.value === trimmedFacilityId)?.label || '';
  }, [facilityOptions, trimmedFacilityId]);
  const wardFacilityLabel = useMemo(
    () => resolveReadableLabel(
      ward?.facility_name
      ?? ward?.facility?.name
      ?? ward?.facility_label
    ),
    [ward]
  );
  const facilityDisplayLabel = useMemo(() => {
    if (!isEdit) return selectedFacilityLabel;
    return selectedFacilityLabel || wardFacilityLabel || t('ward.form.currentFacilityLabel');
  }, [isEdit, selectedFacilityLabel, wardFacilityLabel, t]);

  const isSubmitDisabled =
    !isResolved
    || isLoading
    || isCreateBlocked
    || isFacilityBlocked
    || Boolean(nameError)
    || Boolean(typeError)
    || Boolean(tenantError)
    || Boolean(facilityError)
    || (isEdit ? !canEditWard : !canCreateWard);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateWard) {
        router.replace('/settings/wards?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditWard) {
        router.replace('/settings/wards?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const wardTenantId = normalizeValue(ward?.tenant_id);
        if (!wardTenantId || wardTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/wards?notice=accessDenied');
          return;
        }
      }

      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        name: trimmedName,
        ward_type: trimmedType || undefined,
        is_active: Boolean(isActive),
      };

      if (!isEdit) {
        payload.tenant_id = trimmedTenantId;
        payload.facility_id = trimmedFacilityId;
      }
      if (isEdit && !trimmedType) {
        payload.ward_type = null;
      }

      if (isEdit && routeWardId) {
        const result = await update(routeWardId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }

      router.replace(`/settings/wards?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isEdit,
    canCreateWard,
    canEditWard,
    isTenantScopedAdmin,
    ward,
    normalizedScopedTenantId,
    isOffline,
    routeWardId,
    trimmedName,
    trimmedType,
    trimmedTenantId,
    trimmedFacilityId,
    isActive,
    update,
    create,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/wards');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleGoToFacilities = useCallback(() => {
    router.push('/settings/facilities');
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

  return {
    isEdit,
    name,
    setName,
    wardType,
    setWardType,
    isActive,
    setIsActive,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    tenantOptions,
    tenantListLoading: isTenantScopedAdmin ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin ? false : tenantListError,
    tenantErrorMessage: isTenantScopedAdmin ? null : tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    hasTenants,
    hasFacilities,
    isCreateBlocked,
    isFacilityBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    ward,
    nameError,
    typeError,
    tenantError,
    facilityError,
    isTenantLocked,
    lockedTenantDisplay,
    tenantDisplayLabel,
    facilityDisplayLabel,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToFacilities: handleGoToFacilities,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    isSubmitDisabled,
    testID: 'ward-form-screen',
  };
};

export default useWardFormScreen;
