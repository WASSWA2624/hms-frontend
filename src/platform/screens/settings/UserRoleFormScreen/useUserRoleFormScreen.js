/**
 * useUserRoleFormScreen Hook
 * Shared logic for UserRoleFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useFacility,
  useI18n,
  useNetwork,
  useRole,
  useTenant,
  useTenantAccess,
  useUser,
  useUserRole,
} from '@hooks';
import { humanizeIdentifier } from '@utils';

const MAX_REFERENCE_FETCH_LIMIT = 100;
const DEFAULT_FETCH_PAGE = 1;
const DEFAULT_FETCH_LIMIT = 100;

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const normalizeRoleName = (value) => String(value ?? '').trim().toUpperCase();

const normalizeFetchPage = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_FETCH_PAGE;
  return Math.max(DEFAULT_FETCH_PAGE, Math.trunc(numeric));
};

const normalizeFetchLimit = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_FETCH_LIMIT;
  return Math.min(MAX_REFERENCE_FETCH_LIMIT, Math.max(1, Math.trunc(numeric)));
};

const buildReferenceParams = (tenantId) => {
  const params = {
    page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
    limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
  };
  const normalizedTenantId = String(tenantId ?? '').trim();
  if (normalizedTenantId) {
    params.tenant_id = normalizedTenantId;
  }
  return params;
};

const useUserRoleFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const {
    id,
    tenantId: tenantIdParam,
    facilityId: facilityIdParam,
    userId: userIdParam,
    roleId: roleIdParam,
    roleName: roleNameParam,
  } = useLocalSearchParams();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const { get, create, update, data, isLoading, errorCode, reset } = useUserRole();
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
    list: listUsers,
    data: userData,
    isLoading: userListLoading,
    errorCode: userErrorCode,
    reset: resetUsers,
  } = useUser();
  const {
    list: listRoles,
    data: roleData,
    isLoading: roleListLoading,
    errorCode: roleErrorCode,
    reset: resetRoles,
  } = useRole();

  const routeUserRoleId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeUserRoleId);
  const canManageUserRoles = canAccessTenantSettings;
  const canCreateUserRole = canManageUserRoles;
  const canEditUserRole = canManageUserRoles;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageUserRoles && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [userId, setUserId] = useState('');
  const [roleId, setRoleId] = useState('');
  const tenantPrefillRef = useRef(false);
  const facilityPrefillRef = useRef(false);
  const userPrefillRef = useRef(false);
  const rolePrefillRef = useRef(false);
  const previousTenantRef = useRef('');

  const userRole = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? [])),
    [tenantData]
  );
  const facilityItems = useMemo(
    () => (Array.isArray(facilityData) ? facilityData : (facilityData?.items ?? [])),
    [facilityData]
  );
  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );
  const roleItems = useMemo(
    () => (Array.isArray(roleData) ? roleData : (roleData?.items ?? [])),
    [roleData]
  );
  const tenantOptions = useMemo(() => {
    if (isTenantScopedAdmin) {
      if (!normalizedScopedTenantId) return [];
      const scopedTenant = tenantItems.find(
        (tenant) => String(tenant?.id ?? '').trim() === normalizedScopedTenantId
      );
      const scopedTenantLabel = humanizeIdentifier(scopedTenant?.name)
        || humanizeIdentifier(scopedTenant?.slug)
        || (canViewTechnicalIds ? normalizedScopedTenantId : '')
        || t('userRole.form.tenantOptionFallback', { index: 1 });
      return [{
        value: normalizedScopedTenantId,
        label: scopedTenantLabel,
      }];
    }
    return tenantItems.map((tenant, index) => ({
      value: tenant.id,
      label: humanizeIdentifier(tenant?.name)
        || humanizeIdentifier(tenant?.slug)
        || (canViewTechnicalIds ? String(tenant?.id ?? '').trim() : '')
        || t('userRole.form.tenantOptionFallback', { index: index + 1 }),
    }));
  }, [tenantItems, isTenantScopedAdmin, normalizedScopedTenantId, canViewTechnicalIds, t]);
  const facilityOptions = useMemo(
    () =>
      facilityItems.map((facility, index) => ({
        value: facility.id,
        label: humanizeIdentifier(facility?.name)
          || humanizeIdentifier(facility?.code)
          || (canViewTechnicalIds ? String(facility?.id ?? '').trim() : '')
          || t('userRole.form.facilityOptionFallback', { index: index + 1 }),
      })),
    [facilityItems, canViewTechnicalIds, t]
  );
  const userOptions = useMemo(
    () =>
      userItems.map((user, index) => ({
        value: user.id,
        label: humanizeIdentifier(user?.name)
          || humanizeIdentifier(user?.full_name)
          || humanizeIdentifier(user?.email)
          || humanizeIdentifier(user?.phone)
          || (canViewTechnicalIds ? String(user?.id ?? '').trim() : '')
          || t('userRole.form.userOptionFallback', { index: index + 1 }),
      })),
    [userItems, canViewTechnicalIds, t]
  );
  const roleOptions = useMemo(
    () =>
      roleItems.map((role, index) => ({
        value: role.id,
        label: humanizeIdentifier(role?.name)
          || humanizeIdentifier(role?.slug)
          || (canViewTechnicalIds ? String(role?.id ?? '').trim() : '')
          || t('userRole.form.roleOptionFallback', { index: index + 1 }),
      })),
    [roleItems, canViewTechnicalIds, t]
  );

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserRoles) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateUserRole) {
      router.replace('/settings/user-roles?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditUserRole) {
      router.replace('/settings/user-roles?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUserRoles,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateUserRole,
    canEditUserRole,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserRoles || !isEdit || !routeUserRoleId) return;
    if (!canEditUserRole) return;
    reset();
    get(routeUserRoleId);
  }, [
    isResolved,
    canManageUserRoles,
    isEdit,
    routeUserRoleId,
    canEditUserRole,
    get,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserRoles || isEdit) return;
    if (!canCreateUserRole) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      return;
    }
    resetTenants();
    listTenants(buildReferenceParams());
  }, [
    isResolved,
    canManageUserRoles,
    isEdit,
    canCreateUserRole,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (userRole) {
      setTenantId(userRole.tenant_id ?? normalizedScopedTenantId);
      setFacilityId(userRole.facility_id ?? '');
      setUserId(userRole.user_id ?? '');
      setRoleId(userRole.role_id ?? '');
    }
  }, [userRole, normalizedScopedTenantId]);

  const trimmedTenantId = String(tenantId ?? '').trim();

  useEffect(() => {
    if (!isResolved || !canManageUserRoles || !isTenantScopedAdmin || !isEdit || !userRole) return;
    const recordTenantId = String(userRole?.tenant_id ?? '').trim();
    if (!recordTenantId || recordTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/user-roles?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUserRoles,
    isTenantScopedAdmin,
    isEdit,
    userRole,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserRoles) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    router.replace('/settings/user-roles?notice=accessDenied');
  }, [isResolved, canManageUserRoles, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageUserRoles) return;
    if (!trimmedTenantId) {
      resetFacilities();
      resetUsers();
      resetRoles();
      return;
    }
    resetFacilities();
    listFacilities(buildReferenceParams(trimmedTenantId));
    resetUsers();
    listUsers(buildReferenceParams(trimmedTenantId));
    resetRoles();
    listRoles(buildReferenceParams(trimmedTenantId));
  }, [
    isResolved,
    canManageUserRoles,
    trimmedTenantId,
    listFacilities,
    resetFacilities,
    listUsers,
    resetUsers,
    listRoles,
    resetRoles,
  ]);

  useEffect(() => {
    if (isEdit) return;
    if (!previousTenantRef.current) {
      previousTenantRef.current = trimmedTenantId;
      return;
    }
    if (previousTenantRef.current !== trimmedTenantId) {
      setFacilityId('');
      setUserId('');
      setRoleId('');
      facilityPrefillRef.current = false;
      userPrefillRef.current = false;
      rolePrefillRef.current = false;
    }
    previousTenantRef.current = trimmedTenantId;
  }, [trimmedTenantId, isEdit]);

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
    if (isEdit) return;
    if (userPrefillRef.current) return;
    const paramValue = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
    if (paramValue) {
      setUserId(String(paramValue));
      userPrefillRef.current = true;
      return;
    }
    if (userOptions.length === 1 && !userId) {
      setUserId(userOptions[0].value);
      userPrefillRef.current = true;
    }
  }, [isEdit, userIdParam, userOptions, userId]);

  useEffect(() => {
    if (isEdit) return;
    if (rolePrefillRef.current) return;
    const paramValue = Array.isArray(roleIdParam) ? roleIdParam[0] : roleIdParam;
    const roleNameValue = Array.isArray(roleNameParam) ? roleNameParam[0] : roleNameParam;
    if (paramValue) {
      setRoleId(String(paramValue));
      rolePrefillRef.current = true;
      return;
    }
    const normalizedRoleName = normalizeRoleName(roleNameValue);
    if (normalizedRoleName) {
      const matchedRole = roleItems.find(
        (role) => normalizeRoleName(role?.name ?? role?.role?.name) === normalizedRoleName
      );
      if (matchedRole?.id) {
        setRoleId(String(matchedRole.id));
        rolePrefillRef.current = true;
        return;
      }
    }
    if (roleOptions.length === 1 && !roleId) {
      setRoleId(roleOptions[0].value);
      rolePrefillRef.current = true;
    }
  }, [isEdit, roleIdParam, roleNameParam, roleItems, roleOptions, roleId]);

  const trimmedUserId = String(userId ?? '').trim();
  const trimmedRoleId = String(roleId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'userRole.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'userRole.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'userRole.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );
  const userErrorMessage = useMemo(
    () => resolveErrorMessage(t, userErrorCode, 'userRole.form.userLoadErrorMessage'),
    [t, userErrorCode]
  );
  const roleErrorMessage = useMemo(
    () => resolveErrorMessage(t, roleErrorCode, 'userRole.form.roleLoadErrorMessage'),
    [t, roleErrorCode]
  );

  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const hasUsers = userOptions.length > 0;
  const hasRoles = roleOptions.length > 0;
  const isCreateBlocked = !isEdit && (!hasTenants || !hasUsers || !hasRoles);
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    !trimmedTenantId ||
    !trimmedUserId ||
    !trimmedRoleId ||
    (isEdit ? !canEditUserRole : !canCreateUserRole);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateUserRole) {
        router.replace('/settings/user-roles?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditUserRole) {
        router.replace('/settings/user-roles?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const recordTenantId = String(userRole?.tenant_id ?? '').trim();
        if (!recordTenantId || recordTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/user-roles?notice=accessDenied');
          return;
        }
      }

      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        tenant_id: trimmedTenantId,
        user_id: trimmedUserId,
        role_id: trimmedRoleId,
      };
      if (trimmedFacilityId) {
        payload.facility_id = trimmedFacilityId;
      } else if (isEdit) {
        payload.facility_id = null;
      }

      if (isEdit && routeUserRoleId) {
        const result = await update(routeUserRoleId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/user-roles?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isEdit,
    canCreateUserRole,
    canEditUserRole,
    isTenantScopedAdmin,
    userRole,
    normalizedScopedTenantId,
    isOffline,
    trimmedTenantId,
    trimmedUserId,
    trimmedRoleId,
    trimmedFacilityId,
    routeUserRoleId,
    update,
    create,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/user-roles');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleGoToFacilities = useCallback(() => {
    router.push('/settings/facilities');
  }, [router]);

  const handleGoToUsers = useCallback(() => {
    router.push('/settings/users');
  }, [router]);

  const handleGoToRoles = useCallback(() => {
    router.push('/settings/roles');
  }, [router]);

  const handleRetryTenants = useCallback(() => {
    if (!isResolved || !canManageUserRoles || isTenantScopedAdmin || isEdit) return;
    resetTenants();
    listTenants(buildReferenceParams());
  }, [
    isResolved,
    canManageUserRoles,
    isTenantScopedAdmin,
    isEdit,
    listTenants,
    resetTenants,
  ]);

  const handleRetryFacilities = useCallback(() => {
    if (!isResolved || !canManageUserRoles) return;
    resetFacilities();
    listFacilities(buildReferenceParams(trimmedTenantId));
  }, [isResolved, canManageUserRoles, listFacilities, resetFacilities, trimmedTenantId]);

  const handleRetryUsers = useCallback(() => {
    if (!isResolved || !canManageUserRoles) return;
    resetUsers();
    listUsers(buildReferenceParams(trimmedTenantId));
  }, [isResolved, canManageUserRoles, listUsers, resetUsers, trimmedTenantId]);

  const handleRetryRoles = useCallback(() => {
    if (!isResolved || !canManageUserRoles) return;
    resetRoles();
    listRoles(buildReferenceParams(trimmedTenantId));
  }, [isResolved, canManageUserRoles, listRoles, resetRoles, trimmedTenantId]);

  return {
    isEdit,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    userId,
    setUserId,
    roleId,
    setRoleId,
    tenantOptions,
    tenantListLoading: isTenantScopedAdmin ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin ? false : Boolean(tenantErrorCode),
    tenantErrorMessage: isTenantScopedAdmin ? null : tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError: Boolean(facilityErrorCode),
    facilityErrorMessage,
    userOptions,
    userListLoading,
    userListError: Boolean(userErrorCode),
    userErrorMessage,
    roleOptions,
    roleListLoading,
    roleListError: Boolean(roleErrorCode),
    roleErrorMessage,
    hasTenants,
    hasFacilities,
    hasUsers,
    hasRoles,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    userRole,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToFacilities: handleGoToFacilities,
    onGoToUsers: handleGoToUsers,
    onGoToRoles: handleGoToRoles,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    onRetryUsers: handleRetryUsers,
    onRetryRoles: handleRetryRoles,
    isSubmitDisabled,
    testID: 'user-role-form-screen',
  };
};

export default useUserRoleFormScreen;
