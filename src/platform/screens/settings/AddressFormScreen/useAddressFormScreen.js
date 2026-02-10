/**
 * useAddressFormScreen Hook
 * Shared logic for AddressFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useAddress, useTenant } from '@hooks';

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
  const { get, create, update, data, isLoading, errorCode, reset } = useAddress();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();

  const isEdit = Boolean(id);
  const [addressType, setAddressType] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [tenantId, setTenantId] = useState('');
  const tenantPrefillRef = useRef(false);

  const address = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? [])),
    [tenantData]
  );
  const tenantOptions = useMemo(
    () =>
      tenantItems.map((tenant) => ({
        value: tenant.id,
        label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
      })),
    [tenantItems]
  );
  const addressTypeOptions = useMemo(() => ([
    { label: t('address.types.HOME'), value: 'HOME' },
    { label: t('address.types.WORK'), value: 'WORK' },
    { label: t('address.types.BILLING'), value: 'BILLING' },
    { label: t('address.types.SHIPPING'), value: 'SHIPPING' },
    { label: t('address.types.OTHER'), value: 'OTHER' },
  ]), [t]);

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
    if (address) {
      setAddressType(address.address_type ?? '');
      setLine1(address.line1 ?? address.line_1 ?? '');
      setLine2(address.line2 ?? '');
      setCity(address.city ?? '');
      setStateValue(address.state ?? '');
      setPostalCode(address.postal_code ?? '');
      setCountry(address.country ?? '');
      setTenantId(address.tenant_id ?? '');
    }
  }, [address]);

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

  const trimmedTenantId = String(tenantId ?? '').trim();
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
  const tenantListError = Boolean(tenantErrorCode);
  const hasTenants = tenantOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasTenants;
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    !trimmedLine1 ||
    !trimmedAddressType ||
    (!isEdit && !trimmedTenantId);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
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
      if (isEdit) {
        if (!trimmedLine2) payload.line2 = null;
        if (!trimmedCity) payload.city = null;
        if (!trimmedState) payload.state = null;
        if (!trimmedPostalCode) payload.postal_code = null;
        if (!trimmedCountry) payload.country = null;
      }
      if (isEdit && id) {
        const result = await update(id, payload);
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
    isOffline,
    isEdit,
    id,
    trimmedAddressType,
    trimmedLine1,
    trimmedLine2,
    trimmedCity,
    trimmedState,
    trimmedPostalCode,
    trimmedCountry,
    trimmedTenantId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/addresses');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleRetryTenants = useCallback(() => {
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [listTenants, resetTenants]);

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
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    hasTenants,
    isCreateBlocked,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    address,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onRetryTenants: handleRetryTenants,
    isSubmitDisabled,
    testID: 'address-form-screen',
  };
};

export default useAddressFormScreen;
