/**
 * useRolePermissionFormScreen Hook
 * Shared logic for RolePermissionFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, usePermission, useRole, useRolePermission } from '@hooks';

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

  const isEdit = Boolean(id);
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
      roleItems.map((role) => ({
        value: role.id,
        label: role.name ?? role.slug ?? role.id ?? '',
      })),
    [roleItems]
  );
  const permissionOptions = useMemo(
    () =>
      permissionItems.map((permission) => ({
        value: permission.id,
        label: permission.name ?? permission.code ?? permission.id ?? '',
      })),
    [permissionItems]
  );

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    resetRoles();
    listRoles({ page: 1, limit: 200 });
  }, [listRoles, resetRoles]);

  useEffect(() => {
    resetPermissions();
    listPermissions({ page: 1, limit: 200 });
  }, [listPermissions, resetPermissions]);

  useEffect(() => {
    if (rolePermission) {
      setRoleId(rolePermission.role_id ?? '');
      setPermissionId(rolePermission.permission_id ?? '');
    }
  }, [rolePermission]);

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
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        role_id: trimmedRoleId,
        permission_id: trimmedPermissionId,
      };
      if (isEdit && id) {
        const result = await update(id, payload);
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
    id,
    trimmedRoleId,
    trimmedPermissionId,
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
    resetRoles();
    listRoles({ page: 1, limit: 200 });
  }, [listRoles, resetRoles]);

  const handleRetryPermissions = useCallback(() => {
    resetPermissions();
    listPermissions({ page: 1, limit: 200 });
  }, [listPermissions, resetPermissions]);

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
    isLoading,
    hasError: Boolean(errorCode),
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
