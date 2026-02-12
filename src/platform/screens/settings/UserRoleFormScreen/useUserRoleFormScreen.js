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
  useUser,
  useUserRole,
} from '@hooks';

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

  const isEdit = Boolean(id);
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
  const userOptions = useMemo(
    () =>
      userItems.map((user) => ({
        value: user.id,
        label: user.email ?? user.phone ?? user.id ?? '',
      })),
    [userItems]
  );
  const roleOptions = useMemo(
    () =>
      roleItems.map((role) => ({
        value: role.id,
        label: role.name ?? role.id ?? '',
      })),
    [roleItems]
  );

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [listTenants, resetTenants]);

  useEffect(() => {
    if (userRole) {
      setTenantId(userRole.tenant_id ?? '');
      setFacilityId(userRole.facility_id ?? '');
      setUserId(userRole.user_id ?? '');
      setRoleId(userRole.role_id ?? '');
    }
  }, [userRole]);

  const trimmedTenantId = String(tenantId ?? '').trim();

  useEffect(() => {
    if (!trimmedTenantId) {
      resetFacilities();
      resetUsers();
      resetRoles();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenantId });
    resetUsers();
    listUsers({ page: 1, limit: 200, tenant_id: trimmedTenantId });
    resetRoles();
    listRoles({ page: 1, limit: 200, tenant_id: trimmedTenantId });
  }, [trimmedTenantId, listFacilities, resetFacilities, listUsers, resetUsers, listRoles, resetRoles]);

  useEffect(() => {
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
  }, [trimmedTenantId]);

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

  const hasTenants = tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const hasUsers = userOptions.length > 0;
  const hasRoles = roleOptions.length > 0;
  const isCreateBlocked = !isEdit && (!hasTenants || !hasUsers || !hasRoles);
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    !trimmedTenantId ||
    !trimmedUserId ||
    !trimmedRoleId;

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
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
      if (isEdit && id) {
        const result = await update(id, payload);
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
    isOffline,
    isEdit,
    id,
    trimmedTenantId,
    trimmedUserId,
    trimmedRoleId,
    trimmedFacilityId,
    create,
    update,
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
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [listTenants, resetTenants]);

  const handleRetryFacilities = useCallback(() => {
    resetFacilities();
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenantId || undefined });
  }, [listFacilities, resetFacilities, trimmedTenantId]);

  const handleRetryUsers = useCallback(() => {
    resetUsers();
    listUsers({ page: 1, limit: 200, tenant_id: trimmedTenantId || undefined });
  }, [listUsers, resetUsers, trimmedTenantId]);

  const handleRetryRoles = useCallback(() => {
    resetRoles();
    listRoles({ page: 1, limit: 200, tenant_id: trimmedTenantId || undefined });
  }, [listRoles, resetRoles, trimmedTenantId]);

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
    tenantListLoading,
    tenantListError: Boolean(tenantErrorCode),
    tenantErrorMessage,
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
    isLoading,
    hasError: Boolean(errorCode),
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
