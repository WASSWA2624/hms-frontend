/**
 * useFacilityFormScreen Hook
 * Shared logic for FacilityFormScreen (create/edit).
 * File: useFacilityFormScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useFacility, useNetwork, useTenant, useTenantAccess } from '@hooks';
import { FACILITY_TYPES } from './types';

const MAX_NAME_LENGTH = 255;
const FACILITY_TYPE_VALUES = new Set(FACILITY_TYPES.map(({ value }) => value));

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
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const { get, create, update, data, isLoading, errorCode, reset } = useFacility();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();

  const routeFacilityId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeFacilityId);
  const canManageFacilities = canAccessTenantSettings;
  const canCreateFacility = canManageFacilities;
  const canEditFacility = canManageFacilities;
  const isTenantScopedAdmin = canManageFacilities && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [name, setName] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [tenantIdValue, setTenantIdValue] = useState('');

  const facility = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  const tenantItems = useMemo(
    () => (isTenantScopedAdmin || isEdit
      ? []
      : (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? []))),
    [tenantData, isTenantScopedAdmin, isEdit]
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
    if (!isResolved) return;
    if (!canManageFacilities) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateFacility) {
      router.replace('/settings/facilities?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditFacility) {
      router.replace('/settings/facilities?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageFacilities,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateFacility,
    canEditFacility,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageFacilities || !isEdit || !routeFacilityId) return;
    if (!canEditFacility) return;
      reset();
    get(routeFacilityId);
  }, [isResolved, canManageFacilities, isEdit, routeFacilityId, canEditFacility, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageFacilities || isEdit) return;
    if (!canCreateFacility) return;
    if (isTenantScopedAdmin) {
      setTenantIdValue(normalizedScopedTenantId);
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [
    isResolved,
    canManageFacilities,
    isEdit,
    canCreateFacility,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (facility) {
      setName(facility.name ?? '');
      setFacilityType(facility.facility_type ?? '');
      setIsActive(facility.is_active ?? true);
      setTenantIdValue(String(facility.tenant_id ?? normalizedScopedTenantId ?? ''));
    }
  }, [facility, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageFacilities || !isTenantScopedAdmin || !isEdit || !facility) return;
    const facilityTenantId = String(facility.tenant_id ?? '').trim();
    if (!normalizedScopedTenantId || !facilityTenantId || facilityTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/facilities?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageFacilities,
    isTenantScopedAdmin,
    isEdit,
    facility,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !isTenantScopedAdmin || !isEdit) return;
    if (facility) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/facilities?notice=accessDenied');
    }
  }, [isResolved, isTenantScopedAdmin, isEdit, facility, errorCode, router]);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'facility.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'facility.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );

  const trimmedName = name.trim();
  const trimmedFacilityType = String(facilityType ?? '').trim();
  const trimmedTenantId = String(tenantIdValue ?? '').trim();
  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const isCreateBlocked = !isEdit && !isTenantScopedAdmin && !hasTenants;
  const nameError = useMemo(() => {
    if (!trimmedName) return t('facility.form.nameRequired');
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return t('facility.form.nameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedName, t]);
  const typeError = useMemo(() => {
    if (!trimmedFacilityType) return t('facility.form.typeRequired');
    if (!FACILITY_TYPE_VALUES.has(trimmedFacilityType)) return t('facility.form.typeInvalid');
    return null;
  }, [trimmedFacilityType, t]);
  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('facility.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);
  const isTenantLocked = !isEdit && isTenantScopedAdmin;
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return trimmedTenantId || normalizedScopedTenantId;
  }, [isTenantLocked, trimmedTenantId, normalizedScopedTenantId]);
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    Boolean(nameError) ||
    Boolean(typeError) ||
    Boolean(tenantError) ||
    (isEdit ? !canEditFacility : !canCreateFacility);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateFacility) {
        router.replace('/settings/facilities?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditFacility) {
        router.replace('/settings/facilities?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const facilityTenantId = String(facility?.tenant_id ?? '').trim();
        if (!facilityTenantId || facilityTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/facilities?notice=accessDenied');
          return;
        }
      }
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      if (isEdit && routeFacilityId) {
        const result = await update(routeFacilityId, {
          name: trimmedName,
          facility_type: trimmedFacilityType || undefined,
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
    routeFacilityId,
    canCreateFacility,
    canEditFacility,
    isTenantScopedAdmin,
    facility,
    normalizedScopedTenantId,
    trimmedName,
    trimmedTenantId,
    trimmedFacilityType,
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
    if (isTenantScopedAdmin || isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  return {
    isEdit,
    name,
    setName,
    facilityType,
    setFacilityType,
    isActive,
    setIsActive,
    tenantId: tenantIdValue,
    setTenantId: setTenantIdValue,
    tenantOptions,
    tenantListLoading: isTenantScopedAdmin ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin ? false : Boolean(tenantErrorCode),
    tenantErrorMessage: isTenantScopedAdmin ? null : tenantErrorMessage,
    hasTenants,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    facility,
    nameError,
    typeError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
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
