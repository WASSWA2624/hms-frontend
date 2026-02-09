/**
 * useUserRoleFormScreen Hook
 * Shared logic for UserRoleFormScreen (create/edit).
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUserRole } from '@hooks';

const useUserRoleFormScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useUserRole();

  const isEdit = Boolean(id);
  const [userId, setUserId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');

  const userRole = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (userRole) {
      setUserId(userRole.user_id ?? '');
      setRoleId(userRole.role_id ?? '');
      setTenantId(userRole.tenant_id ?? '');
      setFacilityId(userRole.facility_id ?? '');
    }
  }, [userRole]);

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        user_id: userId.trim() || undefined,
        role_id: roleId.trim() || undefined,
        tenant_id: tenantId.trim() || undefined,
        facility_id: facilityId.trim() || undefined,
      };
      if (isEdit && id) {
        await update(id, payload);
      } else {
        await create(payload);
      }
      router.replace('/settings/user-roles');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, userId, roleId, tenantId, facilityId, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/user-roles');
  }, [router]);

  return {
    isEdit,
    userId,
    setUserId,
    roleId,
    setRoleId,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    isLoading,
    hasError: Boolean(errorCode),
    userRole,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'user-role-form-screen',
  };
};

export default useUserRoleFormScreen;
