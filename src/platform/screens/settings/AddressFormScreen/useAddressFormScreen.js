/**
 * useAddressFormScreen Hook
 * Shared logic for AddressFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useI18n,
  useNetwork,
  useAddress,
  useTenant,
  useFacility,
  useBranch,
  useTenantAccess,
} from '@hooks';
import { humanizeIdentifier } from '@utils';

const MAX_LINE1_LENGTH = 255;
const MAX_LINE2_LENGTH = 255;
const MAX_CITY_LENGTH = 120;
const MAX_STATE_LENGTH = 120;
const MAX_POSTAL_CODE_LENGTH = 40;
const MAX_COUNTRY_LENGTH = 120;
const MAX_REFERENCE_FETCH_LIMIT = 100;

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useAddressFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, tenantId: tenantIdParam } = useLocalSearchParams();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const { get, create, update, data, isLoading, errorCode, reset } = useAddress();
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
    list: listBranches,
    data: branchData,
    isLoading: branchListLoading,
    errorCode: branchErrorCode,
    reset: resetBranches,
  } = useBranch();

  const routeAddressId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeAddressId);
  const canManageAddresses = canAccessTenantSettings;
  const canCreateAddress = canManageAddresses;
  const canEditAddress = canManageAddresses;
  const isTenantScopedAdmin = canManageAddresses && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );

  const [addressType, setAddressType] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [branchId, setBranchId] = useState('');

  const tenantPrefillRef = useRef(false);
  const previousTenantRef = useRef('');
  const previousFacilityRef = useRef('');

  const address = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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
  const branchItems = useMemo(
    () => (Array.isArray(branchData) ? branchData : (branchData?.items ?? [])),
    [branchData]
  );

  const tenantOptions = useMemo(
    () => {
      if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
        return [{
          value: normalizedScopedTenantId,
          label: t('address.form.currentTenantLabel'),
        }];
      }
      return tenantItems.map((tenant, index) => ({
        value: tenant.id,
        label: humanizeIdentifier(tenant.name)
          || humanizeIdentifier(tenant.slug)
          || t('address.form.tenantOptionFallback', { index: index + 1 }),
      }));
    },
    [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId, t]
  );
  const facilityOptions = useMemo(
    () =>
      facilityItems.map((facility, index) => ({
        value: facility.id,
        label: humanizeIdentifier(facility.name)
          || humanizeIdentifier(facility.slug)
          || t('address.form.facilityOptionFallback', { index: index + 1 }),
      })),
    [facilityItems, t]
  );
  const branchOptions = useMemo(
    () =>
      branchItems.map((branch, index) => ({
        value: branch.id,
        label: humanizeIdentifier(branch.name)
          || humanizeIdentifier(branch.slug)
          || t('address.form.branchOptionFallback', { index: index + 1 }),
      })),
    [branchItems, t]
  );
  const addressTypeOptions = useMemo(() => ([
    { label: t('address.types.HOME'), value: 'HOME' },
    { label: t('address.types.WORK'), value: 'WORK' },
    { label: t('address.types.BILLING'), value: 'BILLING' },
    { label: t('address.types.SHIPPING'), value: 'SHIPPING' },
    { label: t('address.types.OTHER'), value: 'OTHER' },
  ]), [t]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageAddresses) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateAddress) {
      router.replace('/settings/addresses?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditAddress) {
      router.replace('/settings/addresses?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageAddresses,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateAddress,
    canEditAddress,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageAddresses || !isEdit || !routeAddressId) return;
    if (!canEditAddress) return;
    reset();
    get(routeAddressId);
  }, [isResolved, canManageAddresses, isEdit, routeAddressId, canEditAddress, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageAddresses || isEdit) return;
    if (!canCreateAddress) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      tenantPrefillRef.current = true;
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: MAX_REFERENCE_FETCH_LIMIT });
  }, [
    isResolved,
    canManageAddresses,
    isEdit,
    canCreateAddress,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageAddresses || !isEdit) return;
    if (address) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/addresses?notice=accessDenied');
    }
  }, [isResolved, canManageAddresses, isEdit, address, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageAddresses || !isTenantScopedAdmin || !isEdit || !address) return;
    const addressTenantId = String(address.tenant_id ?? '').trim();
    if (!addressTenantId || addressTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/addresses?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageAddresses,
    isTenantScopedAdmin,
    isEdit,
    address,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (isEdit || isTenantScopedAdmin) return;
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
  }, [isEdit, isTenantScopedAdmin, tenantIdParam, tenantOptions, tenantId]);

  useEffect(() => {
    if (address) {
      setAddressType(address.address_type ?? '');
      setLine1(address.line1 ?? address.line_1 ?? '');
      setLine2(address.line2 ?? '');
      setCity(address.city ?? '');
      setStateValue(address.state ?? '');
      setPostalCode(address.postal_code ?? '');
      setCountry(address.country ?? '');
      setTenantId(String(address.tenant_id ?? normalizedScopedTenantId ?? ''));
      setFacilityId(String(address.facility_id ?? ''));
      setBranchId(String(address.branch_id ?? ''));
    }
  }, [address, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageAddresses) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (!trimmedTenant) {
      resetFacilities();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: MAX_REFERENCE_FETCH_LIMIT, tenant_id: trimmedTenant });
  }, [isResolved, canManageAddresses, tenantId, listFacilities, resetFacilities]);

  useEffect(() => {
    if (!isResolved || !canManageAddresses) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    const trimmedFacility = String(facilityId ?? '').trim();
    if (!trimmedTenant) {
      resetBranches();
      return;
    }
    const params = { page: 1, limit: MAX_REFERENCE_FETCH_LIMIT, tenant_id: trimmedTenant };
    if (trimmedFacility) {
      params.facility_id = trimmedFacility;
    }
    resetBranches();
    listBranches(params);
  }, [isResolved, canManageAddresses, tenantId, facilityId, listBranches, resetBranches]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (previousTenantRef.current && previousTenantRef.current !== trimmedTenant) {
      setFacilityId('');
      setBranchId('');
    }
    previousTenantRef.current = trimmedTenant;
  }, [tenantId, isEdit]);

  useEffect(() => {
    const trimmedFacility = String(facilityId ?? '').trim();
    if (previousFacilityRef.current && previousFacilityRef.current !== trimmedFacility) {
      setBranchId('');
    }
    previousFacilityRef.current = trimmedFacility;
  }, [facilityId]);

  const trimmedTenantId = String(tenantId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();
  const trimmedBranchId = String(branchId ?? '').trim();
  const trimmedAddressType = addressType.trim();
  const trimmedLine1 = line1.trim();
  const trimmedLine2 = line2.trim();
  const trimmedCity = city.trim();
  const trimmedState = stateValue.trim();
  const trimmedPostalCode = postalCode.trim();
  const trimmedCountry = country.trim();

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'address.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'address.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'address.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );
  const branchErrorMessage = useMemo(
    () => resolveErrorMessage(t, branchErrorCode, 'address.form.branchLoadErrorMessage'),
    [t, branchErrorCode]
  );

  const addressTypeError = useMemo(() => {
    if (!trimmedAddressType) return t('address.form.typeRequired');
    return null;
  }, [trimmedAddressType, t]);
  const line1Error = useMemo(() => {
    if (!trimmedLine1) return t('address.form.line1Required');
    if (trimmedLine1.length > MAX_LINE1_LENGTH) {
      return t('address.form.line1TooLong', { max: MAX_LINE1_LENGTH });
    }
    return null;
  }, [trimmedLine1, t]);
  const line2Error = useMemo(() => {
    if (!trimmedLine2) return null;
    if (trimmedLine2.length > MAX_LINE2_LENGTH) {
      return t('address.form.line2TooLong', { max: MAX_LINE2_LENGTH });
    }
    return null;
  }, [trimmedLine2, t]);
  const cityError = useMemo(() => {
    if (!trimmedCity) return null;
    if (trimmedCity.length > MAX_CITY_LENGTH) {
      return t('address.form.cityTooLong', { max: MAX_CITY_LENGTH });
    }
    return null;
  }, [trimmedCity, t]);
  const stateError = useMemo(() => {
    if (!trimmedState) return null;
    if (trimmedState.length > MAX_STATE_LENGTH) {
      return t('address.form.stateTooLong', { max: MAX_STATE_LENGTH });
    }
    return null;
  }, [trimmedState, t]);
  const postalCodeError = useMemo(() => {
    if (!trimmedPostalCode) return null;
    if (trimmedPostalCode.length > MAX_POSTAL_CODE_LENGTH) {
      return t('address.form.postalCodeTooLong', { max: MAX_POSTAL_CODE_LENGTH });
    }
    return null;
  }, [trimmedPostalCode, t]);
  const countryError = useMemo(() => {
    if (!trimmedCountry) return null;
    if (trimmedCountry.length > MAX_COUNTRY_LENGTH) {
      return t('address.form.countryTooLong', { max: MAX_COUNTRY_LENGTH });
    }
    return null;
  }, [trimmedCountry, t]);
  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('address.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);

  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const hasBranches = branchOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasTenants;
  const isTenantLocked = !isEdit && isTenantScopedAdmin;
  const selectedTenantLabel = useMemo(() => {
    if (!trimmedTenantId) return '';
    const selected = tenantOptions.find((option) => option.value === trimmedTenantId)?.label;
    if (selected) return selected;
    return humanizeIdentifier(
      address?.tenant_name
      ?? address?.tenant?.name
      ?? address?.tenant_label
    ) || '';
  }, [tenantOptions, trimmedTenantId, address]);
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return selectedTenantLabel || t('address.form.currentTenantLabel');
  }, [isTenantLocked, selectedTenantLabel, t]);
  const tenantDisplayLabel = useMemo(() => {
    if (isEdit) return selectedTenantLabel || t('address.form.currentTenantLabel');
    if (isTenantLocked) return lockedTenantDisplay;
    return selectedTenantLabel;
  }, [isEdit, isTenantLocked, selectedTenantLabel, lockedTenantDisplay, t]);
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    Boolean(addressTypeError) ||
    Boolean(line1Error) ||
    Boolean(line2Error) ||
    Boolean(cityError) ||
    Boolean(stateError) ||
    Boolean(postalCodeError) ||
    Boolean(countryError) ||
    Boolean(tenantError) ||
    (isEdit ? !canEditAddress : !canCreateAddress);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateAddress) {
        router.replace('/settings/addresses?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditAddress) {
        router.replace('/settings/addresses?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const addressTenantId = String(address?.tenant_id ?? '').trim();
        if (!addressTenantId || addressTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/addresses?notice=accessDenied');
          return;
        }
      }

      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        address_type: trimmedAddressType,
        line1: trimmedLine1,
        line2: trimmedLine2 || undefined,
        city: trimmedCity || undefined,
        state: trimmedState || undefined,
        postal_code: trimmedPostalCode || undefined,
        country: trimmedCountry || undefined,
      };
      if (!isEdit && trimmedTenantId) {
        payload.tenant_id = trimmedTenantId;
      }
      if (trimmedFacilityId) {
        payload.facility_id = trimmedFacilityId;
      } else if (isEdit) {
        payload.facility_id = null;
      }
      if (trimmedBranchId) {
        payload.branch_id = trimmedBranchId;
      } else if (isEdit) {
        payload.branch_id = null;
      }
      if (isEdit) {
        if (!trimmedLine2) payload.line2 = null;
        if (!trimmedCity) payload.city = null;
        if (!trimmedState) payload.state = null;
        if (!trimmedPostalCode) payload.postal_code = null;
        if (!trimmedCountry) payload.country = null;
      }
      if (isEdit && routeAddressId) {
        const result = await update(routeAddressId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/addresses?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isEdit,
    canCreateAddress,
    canEditAddress,
    isTenantScopedAdmin,
    address,
    normalizedScopedTenantId,
    isOffline,
    trimmedAddressType,
    trimmedLine1,
    trimmedLine2,
    trimmedCity,
    trimmedState,
    trimmedPostalCode,
    trimmedCountry,
    trimmedTenantId,
    trimmedFacilityId,
    trimmedBranchId,
    routeAddressId,
    update,
    create,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/addresses');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleGoToFacilities = useCallback(() => {
    router.push('/settings/facilities');
  }, [router]);

  const handleGoToBranches = useCallback(() => {
    router.push('/settings/branches');
  }, [router]);

  const handleRetryTenants = useCallback(() => {
    if (isTenantScopedAdmin || isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: MAX_REFERENCE_FETCH_LIMIT });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  const handleRetryFacilities = useCallback(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    resetFacilities();
    if (!trimmedTenant) return;
    listFacilities({ page: 1, limit: MAX_REFERENCE_FETCH_LIMIT, tenant_id: trimmedTenant });
  }, [tenantId, listFacilities, resetFacilities]);

  const handleRetryBranches = useCallback(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    const trimmedFacility = String(facilityId ?? '').trim();
    resetBranches();
    if (!trimmedTenant) return;
    const params = { page: 1, limit: MAX_REFERENCE_FETCH_LIMIT, tenant_id: trimmedTenant };
    if (trimmedFacility) params.facility_id = trimmedFacility;
    listBranches(params);
  }, [tenantId, facilityId, listBranches, resetBranches]);

  return {
    isEdit,
    addressType,
    setAddressType,
    addressTypeOptions,
    line1,
    setLine1,
    line2,
    setLine2,
    city,
    setCity,
    stateValue,
    setStateValue,
    postalCode,
    setPostalCode,
    country,
    setCountry,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    branchId,
    setBranchId,
    tenantOptions,
    facilityOptions,
    branchOptions,
    tenantListLoading: isTenantScopedAdmin || isEdit ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin || isEdit ? false : Boolean(tenantErrorCode),
    tenantErrorMessage: isTenantScopedAdmin || isEdit ? null : tenantErrorMessage,
    facilityListLoading,
    facilityListError: Boolean(facilityErrorCode),
    facilityErrorMessage,
    branchListLoading,
    branchListError: Boolean(branchErrorCode),
    branchErrorMessage,
    hasTenants,
    hasFacilities,
    hasBranches,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    address,
    addressTypeError,
    line1Error,
    line2Error,
    cityError,
    stateError,
    postalCodeError,
    countryError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    tenantDisplayLabel,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToFacilities: handleGoToFacilities,
    onGoToBranches: handleGoToBranches,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    onRetryBranches: handleRetryBranches,
    isSubmitDisabled,
    testID: 'address-form-screen',
  };
};

export default useAddressFormScreen;
