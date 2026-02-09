/**
 * useRolePermissionFormScreen Hook
 * Shared logic for RolePermissionFormScreen (create/edit).
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useRolePermission } from '@hooks';

const useRolePermissionFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useRolePermission();

  const isEdit = Boolean(id);
  const [roleId, setRoleId] = useState('');
  const [permissionId, setPermissionId] = useState('');

  const rolePermission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (rolePermission) {
      setRoleId(rolePermission.role_id ?? '');
      setPermissionId(rolePermission.permission_id ?? '');
    }
  }, [rolePermission]);

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        role_id: roleId.trim() || undefined,
        permission_id: permissionId.trim() || undefined,
      };
      if (isEdit && id) {
        await update(id, payload);
      } else {
        await create(payload);
      }
      router.replace('/settings/role-permissions');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, roleId, permissionId, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/role-permissions');
  }, [router]);

  return {
    isEdit,
    roleId,
    setRoleId,
    permissionId,
    setPermissionId,
    isLoading,
    hasError: Boolean(errorCode),
    rolePermission,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'role-permission-form-screen',
  };
};

export default useRolePermissionFormScreen;
