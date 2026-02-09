/**
 * useAddressFormScreen Hook
 * Shared logic for AddressFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useAddress } from '@hooks';

const useAddressFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useAddress();

  const isEdit = Boolean(id);
  const [addressType, setAddressType] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [tenantId, setTenantId] = useState('');

  const address = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        address_type: addressType || undefined,
        line1: line1.trim(),
        line2: line2.trim() || undefined,
        city: city.trim() || undefined,
        state: stateValue.trim() || undefined,
        postal_code: postalCode.trim() || undefined,
        country: country.trim() || undefined,
      };
      if (!isEdit && tenantId?.trim()) {
        payload.tenant_id = tenantId.trim();
      }
      if (isEdit && id) {
        await update(id, payload);
      } else {
        await create(payload);
      }
      router.replace('/settings/addresses');
    } catch {
      /* error from hook */
    }
  }, [
    isEdit,
    id,
    addressType,
    line1,
    line2,
    city,
    stateValue,
    postalCode,
    country,
    tenantId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/addresses');
  }, [router]);

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
    isLoading,
    hasError: Boolean(errorCode),
    address,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'address-form-screen',
  };
};

export default useAddressFormScreen;
