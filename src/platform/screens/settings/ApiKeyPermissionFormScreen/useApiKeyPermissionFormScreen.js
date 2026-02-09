/**
 * useApiKeyPermissionFormScreen Hook
 * Shared logic for ApiKeyPermissionFormScreen (create/edit).
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApiKeyPermission } from '@hooks';

const useApiKeyPermissionFormScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useApiKeyPermission();

  const isEdit = Boolean(id);
  const [apiKeyId, setApiKeyId] = useState('');
  const [permissionId, setPermissionId] = useState('');

  const apiKeyPermission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (apiKeyPermission) {
      setApiKeyId(apiKeyPermission.api_key_id ?? '');
      setPermissionId(apiKeyPermission.permission_id ?? '');
    }
  }, [apiKeyPermission]);

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        api_key_id: apiKeyId.trim() || undefined,
        permission_id: permissionId.trim() || undefined,
      };
      if (isEdit && id) {
        await update(id, payload);
      } else {
        await create(payload);
      }
      router.replace('/settings/api-key-permissions');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, apiKeyId, permissionId, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/api-key-permissions');
  }, [router]);

  return {
    isEdit,
    apiKeyId,
    setApiKeyId,
    permissionId,
    setPermissionId,
    isLoading,
    hasError: Boolean(errorCode),
    apiKeyPermission,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'api-key-permission-form-screen',
  };
};

export default useApiKeyPermissionFormScreen;
