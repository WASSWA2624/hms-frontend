/**
 * usePermissionFormScreen Hook
 * Shared logic for PermissionFormScreen (create/edit).
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, usePermission } from '@hooks';

const usePermissionFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = usePermission();

  const isEdit = Boolean(id);
  const [tenantId, setTenantId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const permission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (permission) {
      setTenantId(permission.tenant_id ?? '');
      setName(permission.name ?? '');
      setDescription(permission.description ?? '');
    }
  }, [permission]);

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
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
      router.replace('/settings/permissions');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, tenantId, name, description, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/permissions');
  }, [router]);

  return {
    isEdit,
    tenantId,
    setTenantId,
    name,
    setName,
    description,
    setDescription,
    isLoading,
    hasError: Boolean(errorCode),
    permission,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'permission-form-screen',
  };
};

export default usePermissionFormScreen;
