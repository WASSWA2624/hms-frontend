/**
 * useRoleFormScreen Hook
 * Shared logic for RoleFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useRole, useTenant, useFacility } from '@hooks';

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useRoleFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, tenantId: tenantIdParam, facilityId: facilityIdParam } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useRole();
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

  const isEdit = Boolean(id);
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const tenantPrefillRef = useRef(false);
  const facilityPrefillRef = useRef(false);
  const previousTenantRef = useRef('');

  const role = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? [])),
    [tenantData]
  );
  const facilityItems = useMemo(
    () => (Array.isArray(facilityData) ? facilityData : (facilityData?.items ?? [])),
    [facilityData]
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

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [isEdit, listTenants, resetTenants]);

  useEffect(() => {
    if (role) {
      setTenantId(role.tenant_id ?? '');
      setFacilityId(role.facility_id ?? '');
      setName(role.name ?? '');
      setDescription(role.description ?? '');
    }
  }, [role]);

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
    const trimmedTenant = String(tenantId ?? '').trim();
    if (previousTenantRef.current && previousTenantRef.current !== trimmedTenant) {
      setFacilityId('');
      facilityPrefillRef.current = false;
    }
    previousTenantRef.current = trimmedTenant;
  }, [tenantId, isEdit]);

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

  const trimmedTenantId = String(tenantId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();
  const trimmedName = name.trim();
  const trimmedDescription = description.trim();

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'role.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'role.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'role.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );

  const tenantListError = Boolean(tenantErrorCode);
  const facilityListError = Boolean(facilityErrorCode);
  const hasTenants = tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const requiresTenant = !isEdit;
  const requiresFacility = !isEdit;
  const isCreateBlocked = requiresTenant && !hasTenants;
  const isFacilityBlocked =
    requiresFacility && Boolean(trimmedTenantId) && !facilityListLoading && !facilityListError && !hasFacilities;
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    isFacilityBlocked ||
    !trimmedName ||
    (requiresTenant && !trimmedTenantId) ||
    (requiresFacility && !trimmedFacilityId);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        name: trimmedName,
      };

      if (trimmedDescription) {
        payload.description = trimmedDescription;
      } else if (isEdit) {
        payload.description = null;
      }

      if (!isEdit) {
        if (trimmedTenantId) payload.tenant_id = trimmedTenantId;
        if (trimmedFacilityId) payload.facility_id = trimmedFacilityId;
      }

      if (isEdit && id) {
        const result = await update(id, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/roles?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    id,
    trimmedName,
    trimmedDescription,
    trimmedTenantId,
    trimmedFacilityId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/roles');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleGoToFacilities = useCallback(() => {
    router.push('/settings/facilities');
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

  return {
    isEdit,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    name,
    setName,
    description,
    setDescription,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    hasTenants,
    hasFacilities,
    isCreateBlocked,
    isFacilityBlocked,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    role,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToFacilities: handleGoToFacilities,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    isSubmitDisabled,
    testID: 'role-form-screen',
  };
};

export default useRoleFormScreen;
