/**
 * useRolePermissionFormScreen Hook
 * Shared logic for RolePermissionFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useI18n,
  useNetwork,
  usePermission,
  useRole,
  useRolePermission,
  useTenantAccess,
} from '@hooks';
import { humanizeIdentifier } from '@utils';

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

const useRolePermissionFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, roleId: roleIdParam, permissionId: permissionIdParam } = useLocalSearchParams();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const { get, create, update, data, isLoading, errorCode, reset } = useRolePermission();
  const {
    list: listRoles,
    data: roleData,
    isLoading: roleListLoading,
    errorCode: roleErrorCode,
    reset: resetRoles,
  } = useRole();
  const {
    list: listPermissions,
    data: permissionData,
    isLoading: permissionListLoading,
    errorCode: permissionErrorCode,
    reset: resetPermissions,
  } = usePermission();

  const routeRolePermissionId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeRolePermissionId);
  const canManageRolePermissions = canAccessTenantSettings;
  const canCreateRolePermission = canManageRolePermissions;
  const canEditRolePermission = canManageRolePermissions;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageRolePermissions && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [roleId, setRoleId] = useState('');
  const [permissionId, setPermissionId] = useState('');
  const rolePrefillRef = useRef(false);
  const permissionPrefillRef = useRef(false);

  const rolePermission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const roleItems = useMemo(
    () => (Array.isArray(roleData) ? roleData : (roleData?.items ?? [])),
    [roleData]
  );
  const permissionItems = useMemo(
    () => (Array.isArray(permissionData) ? permissionData : (permissionData?.items ?? [])),
    [permissionData]
  );
  const roleOptions = useMemo(
    () =>
      roleItems.map((role, index) => ({
        value: role.id,
        label: humanizeIdentifier(role.name)
          || humanizeIdentifier(role.slug)
          || (canViewTechnicalIds ? String(role.id ?? '').trim() : '')
          || t('rolePermission.form.roleOptionFallback', { index: index + 1 }),
      })),
    [roleItems, canViewTechnicalIds, t]
  );
  const permissionOptions = useMemo(
    () =>
      permissionItems.map((permission, index) => ({
        value: permission.id,
        label: humanizeIdentifier(permission.name)
          || humanizeIdentifier(permission.code)
          || (canViewTechnicalIds ? String(permission.id ?? '').trim() : '')
          || t('rolePermission.form.permissionOptionFallback', { index: index + 1 }),
      })),
    [permissionItems, canViewTechnicalIds, t]
  );

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageRolePermissions) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateRolePermission) {
      router.replace('/settings/role-permissions?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditRolePermission) {
      router.replace('/settings/role-permissions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageRolePermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateRolePermission,
    canEditRolePermission,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRolePermissions || !isEdit || !routeRolePermissionId) return;
    if (!canEditRolePermission) return;
    if (isEdit && routeRolePermissionId) {
      reset();
      get(routeRolePermissionId);
    }
  }, [
    isResolved,
    canManageRolePermissions,
    isEdit,
    routeRolePermissionId,
    canEditRolePermission,
    get,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRolePermissions) return;
    resetRoles();
    const params = { page: 1, limit: MAX_REFERENCE_FETCH_LIMIT };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listRoles(params);
  }, [
    isResolved,
    canManageRolePermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listRoles,
    resetRoles,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRolePermissions) return;
    resetPermissions();
    const params = { page: 1, limit: MAX_REFERENCE_FETCH_LIMIT };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listPermissions(params);
  }, [
    isResolved,
    canManageRolePermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listPermissions,
    resetPermissions,
  ]);

  useEffect(() => {
    if (rolePermission) {
      setRoleId(rolePermission.role_id ?? '');
      setPermissionId(rolePermission.permission_id ?? '');
    }
  }, [rolePermission]);

  useEffect(() => {
    if (!isResolved || !canManageRolePermissions || !isTenantScopedAdmin || !isEdit || !rolePermission) return;
    const recordTenantId = String(rolePermission?.tenant_id ?? '').trim();
    if (recordTenantId && recordTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/role-permissions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageRolePermissions,
    isTenantScopedAdmin,
    isEdit,
    rolePermission,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (isEdit) return;
    if (rolePrefillRef.current) return;
    const paramValue = Array.isArray(roleIdParam) ? roleIdParam[0] : roleIdParam;
    if (paramValue) {
      setRoleId(String(paramValue));
      rolePrefillRef.current = true;
      return;
    }
    if (roleOptions.length === 1 && !roleId) {
      setRoleId(roleOptions[0].value);
      rolePrefillRef.current = true;
    }
  }, [isEdit, roleIdParam, roleOptions, roleId]);

  useEffect(() => {
    if (isEdit) return;
    if (permissionPrefillRef.current) return;
    const paramValue = Array.isArray(permissionIdParam) ? permissionIdParam[0] : permissionIdParam;
    if (paramValue) {
      setPermissionId(String(paramValue));
      permissionPrefillRef.current = true;
      return;
    }
    if (permissionOptions.length === 1 && !permissionId) {
      setPermissionId(permissionOptions[0].value);
      permissionPrefillRef.current = true;
    }
  }, [isEdit, permissionIdParam, permissionOptions, permissionId]);

  useEffect(() => {
    if (!isResolved || !canManageRolePermissions) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    router.replace('/settings/role-permissions?notice=accessDenied');
  }, [isResolved, canManageRolePermissions, errorCode, router]);

  const trimmedRoleId = String(roleId ?? '').trim();
  const trimmedPermissionId = String(permissionId ?? '').trim();

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'rolePermission.form.submitErrorMessage'),
    [t, errorCode]
  );
  const roleErrorMessage = useMemo(
    () => resolveErrorMessage(t, roleErrorCode, 'rolePermission.form.roleLoadErrorMessage'),
    [t, roleErrorCode]
  );
  const permissionErrorMessage = useMemo(
    () => resolveErrorMessage(t, permissionErrorCode, 'rolePermission.form.permissionLoadErrorMessage'),
    [t, permissionErrorCode]
  );

  const roleListError = Boolean(roleErrorCode);
  const permissionListError = Boolean(permissionErrorCode);
  const hasRoles = roleOptions.length > 0;
  const hasPermissions = permissionOptions.length > 0;
  const isCreateBlocked = !isEdit && (!hasRoles || !hasPermissions);
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    !trimmedRoleId ||
    !trimmedPermissionId;

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateRolePermission) {
        router.replace('/settings/role-permissions?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditRolePermission) {
        router.replace('/settings/role-permissions?notice=accessDenied');
        return;
      }
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        role_id: trimmedRoleId,
        permission_id: trimmedPermissionId,
      };
      if (isEdit && routeRolePermissionId) {
        const result = await update(routeRolePermissionId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/role-permissions?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    trimmedRoleId,
    trimmedPermissionId,
    canCreateRolePermission,
    canEditRolePermission,
    routeRolePermissionId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/role-permissions');
  }, [router]);

  const handleGoToRoles = useCallback(() => {
    router.push('/settings/roles');
  }, [router]);

  const handleGoToPermissions = useCallback(() => {
    router.push('/settings/permissions');
  }, [router]);

  const handleRetryRoles = useCallback(() => {
    if (!isResolved || !canManageRolePermissions) return;
    resetRoles();
    const params = { page: 1, limit: MAX_REFERENCE_FETCH_LIMIT };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listRoles(params);
  }, [
    isResolved,
    canManageRolePermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listRoles,
    resetRoles,
  ]);

  const handleRetryPermissions = useCallback(() => {
    if (!isResolved || !canManageRolePermissions) return;
    resetPermissions();
    const params = { page: 1, limit: MAX_REFERENCE_FETCH_LIMIT };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listPermissions(params);
  }, [
    isResolved,
    canManageRolePermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listPermissions,
    resetPermissions,
  ]);

  return {
    isEdit,
    roleId,
    setRoleId,
    permissionId,
    setPermissionId,
    roleOptions,
    permissionOptions,
    roleListLoading,
    roleListError,
    roleErrorMessage,
    permissionListLoading,
    permissionListError,
    permissionErrorMessage,
    hasRoles,
    hasPermissions,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    rolePermission,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToRoles: handleGoToRoles,
    onGoToPermissions: handleGoToPermissions,
    onRetryRoles: handleRetryRoles,
    onRetryPermissions: handleRetryPermissions,
    isSubmitDisabled,
    testID: 'role-permission-form-screen',
  };
};

export default useRolePermissionFormScreen;
