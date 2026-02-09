/**
 * useRoleFormScreen Hook
 * Shared logic for RoleFormScreen (create/edit).
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useRole } from '@hooks';

const useRoleFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useRole();

  const isEdit = Boolean(id);
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const role = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (role) {
      setTenantId(role.tenant_id ?? '');
      setFacilityId(role.facility_id ?? '');
      setName(role.name ?? '');
      setDescription(role.description ?? '');
    }
  }, [role]);

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        facility_id: facilityId.trim() || undefined,
        name: name.trim(),
        description: description.trim() || undefined,
      };
      if (!isEdit && tenantId?.trim()) {
        payload.tenant_id = tenantId.trim();
      }
      if (isEdit && id) {
        await update(id, payload);
      } else {
        await create(payload);
      }
      router.replace('/settings/roles');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, tenantId, facilityId, name, description, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/roles');
  }, [router]);

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
    isLoading,
    hasError: Boolean(errorCode),
    role,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'role-form-screen',
  };
};

export default useRoleFormScreen;
