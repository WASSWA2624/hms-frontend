/**
 * useOauthAccountDetailScreen Hook
 * Shared logic for OauthAccountDetailScreen across platforms.
 * File: useOauthAccountDetailScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useOauthAccount } = '@hooks';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useOauthAccountDetailScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const [isEditing, setIsEditing] = useState(false);
  const {
    get,
    update,
    data,
    isLoading,
    errorCode,
    reset,
  } = useOauthAccount();

  const item = useMemo(() => data?.item, [data?.item]);
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchItem = useCallback(() => {
    if (id) {
      reset();
      get(id);
    }
  }, [id, get, reset]);

  useEffect(() => {
    if (id) fetchItem();
  }, [id, fetchItem]);

  const handleRetry = useCallback(() => {
    fetchItem();
  }, [fetchItem]);

  const handleSave = useCallback(
    async (formData) => {
      if (id) {
        await update(id, formData);
        setIsEditing(false);
      }
    },
    [id, update]
  );

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  return {
    item,
    isLoading,
    hasError: !!errorCode,
    errorMessage,
    isOffline,
    isEditing,
    onRetry: handleRetry,
    onSave: handleSave,
    onCancel: handleCancel,
    onEdit: handleEdit,
  };
};

export default useOauthAccountDetailScreen;
