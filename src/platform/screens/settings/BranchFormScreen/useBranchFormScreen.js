/**
 * useBranchFormScreen Hook
 * Shared logic for BranchFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useBranch, useFacility, useNetwork, useTenant, useTenantAccess } from '@hooks';

const MAX_NAME_LENGTH = 255;

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useBranchFormScreen = () => {
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
  const { get, create, update, data, isLoading, errorCode, reset } = useBranch();
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

  const routeBranchId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeBranchId);
  const canManageBranches = canAccessTenantSettings;
  const canCreateBranch = canManageBranches;
  const canEditBranch = canManageBranches;
  const isTenantScopedAdmin = canManageBranches && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const previousTenantRef = useRef('');

  const branch = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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
        return [{ value: normalizedScopedTenantId, label: normalizedScopedTenantId }];
      }
      return tenantItems.map((tenant) => ({
        value: tenant.id,
        label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
      }));
    },
    [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId]
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
    if (!isResolved) return;
    if (!canManageBranches) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateBranch) {
      router.replace('/settings/branches?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditBranch) {
      router.replace('/settings/branches?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageBranches,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateBranch,
    canEditBranch,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageBranches || !isEdit || !routeBranchId) return;
    if (!canEditBranch) return;
    reset();
    get(routeBranchId);
  }, [isResolved, canManageBranches, isEdit, routeBranchId, canEditBranch, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageBranches || isEdit) return;
    if (!canCreateBranch) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [
    isResolved,
    canManageBranches,
    isEdit,
    canCreateBranch,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (branch) {
      setName(branch.name ?? '');
      setIsActive(branch.is_active ?? true);
      setTenantId(String(branch.tenant_id ?? normalizedScopedTenantId ?? ''));
      setFacilityId(branch.facility_id ?? '');
    }
  }, [branch, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageBranches || !isTenantScopedAdmin || !isEdit || !branch) return;
    const branchTenantId = String(branch.tenant_id ?? '').trim();
    if (!normalizedScopedTenantId || !branchTenantId || branchTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/branches?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageBranches,
    isTenantScopedAdmin,
    isEdit,
    branch,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageBranches || !isEdit) return;
    if (branch) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/branches?notice=accessDenied');
    }
  }, [isResolved, canManageBranches, isEdit, branch, errorCode, router]);

  useEffect(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    if (!trimmedTenant) {
      resetFacilities();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenant });
  }, [tenantId, listFacilities, resetFacilities]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (previousTenantRef.current && previousTenantRef.current !== trimmedTenant) {
      setFacilityId('');
    }
    previousTenantRef.current = trimmedTenant;
  }, [tenantId, isEdit]);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'branch.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'branch.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'branch.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );

  const trimmedName = name.trim();
  const trimmedTenantId = String(tenantId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();
  const facilityListError = Boolean(facilityErrorCode);
  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const requiresTenant = !isEdit;
  const isCreateBlocked = requiresTenant && !hasTenants;
  // Backend allows facility_id to be optional for branches.
  const isFacilityBlocked = false;
  const nameError = useMemo(() => {
    if (!trimmedName) return t('branch.form.nameRequired');
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return t('branch.form.nameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedName, t]);
  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('branch.form.tenantRequired');
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
    Boolean(tenantError) ||
    (isEdit ? !canEditBranch : !canCreateBranch);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateBranch) {
        router.replace('/settings/branches?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditBranch) {
        router.replace('/settings/branches?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const branchTenantId = String(branch?.tenant_id ?? '').trim();
        if (!branchTenantId || branchTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/branches?notice=accessDenied');
          return;
        }
      }
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        name: trimmedName,
        is_active: isActive,
      };
      if (!isEdit && trimmedTenantId) {
        payload.tenant_id = trimmedTenantId;
      }
      if (trimmedFacilityId) {
        payload.facility_id = trimmedFacilityId;
      } else if (isEdit) {
        payload.facility_id = null;
      }
      if (isEdit && routeBranchId) {
        const result = await update(routeBranchId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/branches?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    routeBranchId,
    canCreateBranch,
    canEditBranch,
    isTenantScopedAdmin,
    branch,
    normalizedScopedTenantId,
    trimmedName,
    trimmedTenantId,
    trimmedFacilityId,
    isActive,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/branches');
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
    listTenants({ page: 1, limit: 200 });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  const handleRetryFacilities = useCallback(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    resetFacilities();
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenant || undefined });
  }, [listFacilities, resetFacilities, tenantId]);

  return {
    isEdit,
    name,
    setName,
    isActive,
    setIsActive,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    tenantOptions,
    tenantListLoading: isTenantScopedAdmin ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin ? false : Boolean(tenantErrorCode),
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
    branch,
    nameError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToFacilities: handleGoToFacilities,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    isSubmitDisabled,
    testID: 'branch-form-screen',
  };
};

export default useBranchFormScreen;
