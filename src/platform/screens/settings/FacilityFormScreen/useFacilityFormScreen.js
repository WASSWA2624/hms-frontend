/**
 * useFacilityFormScreen Hook
 * Shared logic for FacilityFormScreen (create/edit).
 * File: useFacilityFormScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useFacility, useNetwork, useTenant } from '@hooks';
import { FACILITY_TYPES } from './types';

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useFacilityFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useFacility();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();

  const isEdit = Boolean(id);
  const [name, setName] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [tenantId, setTenantId] = useState('');

  const facility = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

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
    if (facility) {
      setName(facility.name ?? '');
      setFacilityType(facility.facility_type ?? '');
      setIsActive(facility.is_active ?? true);
    }
  }, [facility]);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'facility.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'facility.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );

  const trimmedName = name.trim();
  const trimmedTenantId = String(tenantId ?? '').trim();
  const requiresTenant = !isEdit;
  const isSubmitDisabled =
    isLoading || !trimmedName || !facilityType || (requiresTenant && !trimmedTenantId);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      if (isEdit && id) {
        const result = await update(id, {
          name: trimmedName,
          facility_type: facilityType || undefined,
          is_active: isActive,
        });
        if (!result) return;
      } else {
        const result = await create({
          tenant_id: trimmedTenantId,
          name: trimmedName,
          facility_type: facilityType,
          is_active: isActive,
        });
        if (!result) return;
      }
      router.replace(`/settings/facilities?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    id,
    trimmedName,
    trimmedTenantId,
    facilityType,
    isActive,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/facilities');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const typeOptions = FACILITY_TYPES.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

  const handleRetryTenants = useCallback(() => {
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [listTenants, resetTenants]);

  return {
    isEdit,
    name,
    setName,
    facilityType,
    setFacilityType,
    isActive,
    setIsActive,
    tenantId,
    setTenantId,
    tenantOptions,
    tenantListLoading,
    tenantListError: Boolean(tenantErrorCode),
    tenantErrorMessage,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    facility,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onRetryTenants: handleRetryTenants,
    typeOptions,
    isSubmitDisabled,
    testID: 'facility-form-screen',
  };
};

export default useFacilityFormScreen;
