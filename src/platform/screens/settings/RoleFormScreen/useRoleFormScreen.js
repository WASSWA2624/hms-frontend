/**
 * useRoleFormScreen Hook
 * Shared logic for RoleFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useI18n,
  useNetwork,
  useRole,
  useTenant,
  useFacility,
  useTenantAccess,
} from '@hooks';
import { humanizeIdentifier } from '@utils';

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 255;
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

const useRoleFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, tenantId: tenantIdParam, facilityId: facilityIdParam } = useLocalSearchParams();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
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

  const routeRoleId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeRoleId);
  const canManageRoles = canAccessTenantSettings;
  const canCreateRole = canManageRoles;
  const canEditRole = canManageRoles;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageRoles && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const tenantPrefillRef = useRef(false);
  const facilityPrefillRef = useRef(false);
  const previousTenantRef = useRef('');

  const role = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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
  const tenantOptions = useMemo(
    () => {
      if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
        return [{ value: normalizedScopedTenantId, label: t('role.form.currentTenantLabel') }];
      }
      return tenantItems.map((tenant, index) => ({
        value: tenant.id,
        label: humanizeIdentifier(tenant.name)
          || humanizeIdentifier(tenant.slug)
          || (canViewTechnicalIds ? String(tenant.id ?? '').trim() : '')
          || t('role.form.tenantOptionFallback', { index: index + 1 }),
      }));
    },
    [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId, canViewTechnicalIds, t]
  );
  const facilityOptions = useMemo(
    () => {
      const options = facilityItems.map((facility, index) => ({
        value: facility.id,
        label: humanizeIdentifier(facility.name)
          || humanizeIdentifier(facility.code)
          || humanizeIdentifier(facility.slug)
          || (canViewTechnicalIds ? String(facility.id ?? '').trim() : '')
          || t('role.form.facilityOptionFallback', { index: index + 1 }),
      }));

      if (facilityId && !options.some((option) => option.value === facilityId)) {
        const fallbackLabel = humanizeIdentifier(
          role?.facility_name
          ?? role?.facility?.name
          ?? role?.facility_label
        ) || (canViewTechnicalIds ? facilityId : t('role.form.currentFacilityLabel'));
        return [{ value: facilityId, label: fallbackLabel }, ...options];
      }

      return options;
    },
    [facilityItems, canViewTechnicalIds, t, facilityId, role]
  );

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageRoles) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateRole) {
      router.replace('/settings/roles?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditRole) {
      router.replace('/settings/roles?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageRoles,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateRole,
    canEditRole,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRoles || !isEdit || !routeRoleId) return;
    if (!canEditRole) return;
    reset();
    get(routeRoleId);
  }, [isResolved, canManageRoles, isEdit, routeRoleId, canEditRole, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageRoles || isEdit) return;
    if (!canCreateRole) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: MAX_REFERENCE_FETCH_LIMIT });
  }, [
    isResolved,
    canManageRoles,
    isEdit,
    canCreateRole,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (role) {
      setTenantId(String(role.tenant_id ?? normalizedScopedTenantId ?? ''));
      setFacilityId(role.facility_id ?? '');
      setName(role.name ?? '');
      setDescription(role.description ?? '');
    }
  }, [role, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageRoles || !isTenantScopedAdmin || !isEdit || !role) return;
    const roleTenantId = String(role.tenant_id ?? '').trim();
    if (!normalizedScopedTenantId || !roleTenantId || roleTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/roles?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageRoles,
    isTenantScopedAdmin,
    isEdit,
    role,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRoles || !isEdit) return;
    if (role) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/roles?notice=accessDenied');
    }
  }, [isResolved, canManageRoles, isEdit, role, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageRoles) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (!trimmedTenant) {
      resetFacilities();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: MAX_REFERENCE_FETCH_LIMIT, tenant_id: trimmedTenant });
  }, [isResolved, canManageRoles, tenantId, listFacilities, resetFacilities]);

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
    if (!isResolved || !canManageRoles) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    router.replace('/settings/roles?notice=accessDenied');
  }, [isResolved, canManageRoles, errorCode, router]);

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
  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const requiresTenant = !isEdit;
  const isCreateBlocked = requiresTenant && !hasTenants;
  // Backend allows facility_id to be optional for roles.
  const isFacilityBlocked = false;
  const nameError = useMemo(() => {
    if (!trimmedName) return t('role.form.nameRequired');
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return t('role.form.nameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedName, t]);
  const descriptionError = useMemo(() => {
    if (!trimmedDescription) return null;
    if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      return t('role.form.descriptionTooLong', { max: MAX_DESCRIPTION_LENGTH });
    }
    return null;
  }, [trimmedDescription, t]);
  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('role.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);
  const selectedTenantLabel = useMemo(() => {
    if (!trimmedTenantId) return '';
    const selectedOption = tenantOptions.find((option) => option.value === trimmedTenantId)?.label;
    if (selectedOption) return selectedOption;

    const readableTenant = humanizeIdentifier(
      role?.tenant_name
      ?? role?.tenant?.name
      ?? role?.tenant_label
    );
    if (readableTenant) return readableTenant;
    if (canViewTechnicalIds) return trimmedTenantId;
    return t('role.form.currentTenantLabel');
  }, [tenantOptions, trimmedTenantId, role, canViewTechnicalIds, t]);
  const isTenantLocked = !isEdit && isTenantScopedAdmin;
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return selectedTenantLabel || t('role.form.currentTenantLabel');
  }, [isTenantLocked, selectedTenantLabel, t]);
  const tenantDisplayLabel = useMemo(() => {
    if (isEdit) return selectedTenantLabel || t('role.form.currentTenantLabel');
    if (isTenantLocked) return lockedTenantDisplay;
    return selectedTenantLabel;
  }, [isEdit, isTenantLocked, selectedTenantLabel, lockedTenantDisplay, t]);
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    Boolean(nameError) ||
    Boolean(descriptionError) ||
    Boolean(tenantError) ||
    (isEdit ? !canEditRole : !canCreateRole);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateRole) {
        router.replace('/settings/roles?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditRole) {
        router.replace('/settings/roles?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const roleTenantId = String(role?.tenant_id ?? '').trim();
        if (!roleTenantId || roleTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/roles?notice=accessDenied');
          return;
        }
      }

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
      } else if (trimmedFacilityId) {
        payload.facility_id = trimmedFacilityId;
      } else {
        payload.facility_id = null;
      }

      if (isEdit && routeRoleId) {
        const result = await update(routeRoleId, payload);
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
    isEdit,
    canCreateRole,
    canEditRole,
    isTenantScopedAdmin,
    role,
    normalizedScopedTenantId,
    isOffline,
    trimmedName,
    trimmedDescription,
    trimmedTenantId,
    trimmedFacilityId,
    routeRoleId,
    update,
    create,
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
    if (isTenantScopedAdmin || isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: MAX_REFERENCE_FETCH_LIMIT });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  const handleRetryFacilities = useCallback(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    resetFacilities();
    if (!trimmedTenant) return;
    listFacilities({ page: 1, limit: MAX_REFERENCE_FETCH_LIMIT, tenant_id: trimmedTenant });
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
    role,
    nameError,
    descriptionError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    tenantDisplayLabel,
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
