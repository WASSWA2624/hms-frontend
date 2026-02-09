/**
 * useApiKeyFormScreen Hook
 * Shared logic for ApiKeyFormScreen (create/edit).
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApiKey } from '@hooks';
import { normalizeIsoDateTime, toDateInputValue } from '@utils';

const useApiKeyFormScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useApiKey();

  const isEdit = Boolean(id);
  const [tenantId, setTenantId] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');

  const apiKey = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (apiKey) {
      setTenantId(apiKey.tenant_id ?? '');
      setUserId(apiKey.user_id ?? '');
      setName(apiKey.name ?? '');
      setIsActive(apiKey.is_active ?? true);
      setExpiresAt(toDateInputValue(apiKey.expires_at ?? ''));
    }
  }, [apiKey]);

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        name: name.trim(),
      };
      const normalizedExpiresAt = normalizeIsoDateTime(expiresAt);
      if (normalizedExpiresAt) {
        payload.expires_at = normalizedExpiresAt;
      }
      if (isEdit && id) {
        payload.is_active = isActive;
        await update(id, payload);
      } else {
        if (tenantId.trim()) payload.tenant_id = tenantId.trim();
        if (userId.trim()) payload.user_id = userId.trim();
        await create(payload);
      }
      router.replace('/settings/api-keys');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, name, expiresAt, isActive, tenantId, userId, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/api-keys');
  }, [router]);

  return {
    isEdit,
    tenantId,
    setTenantId,
    userId,
    setUserId,
    name,
    setName,
    isActive,
    setIsActive,
    expiresAt,
    setExpiresAt,
    isLoading,
    hasError: Boolean(errorCode),
    apiKey,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'api-key-form-screen',
  };
};

export default useApiKeyFormScreen;
