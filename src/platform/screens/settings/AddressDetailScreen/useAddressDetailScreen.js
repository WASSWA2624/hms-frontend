/**
 * useAddressDetailScreen Hook
 * Shared logic for AddressDetailScreen across platforms.
 * File: useAddressDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useAddress } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useAddressDetailScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const { get, remove, data, isLoading, errorCode, reset } = useAddress();

  const address = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!id) return;
    reset();
    get(id);
  }, [id, get, reset]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/addresses');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (id) router.push(`/settings/addresses/${id}/edit`);
  }, [id, router]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(id);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/addresses?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [id, remove, isOffline, router, t]);

  return {
    id,
    address,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: handleEdit,
    onDelete: handleDelete,
  };
};

export default useAddressDetailScreen;
