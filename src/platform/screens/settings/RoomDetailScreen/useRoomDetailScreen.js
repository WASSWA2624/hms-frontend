/**
 * useRoomDetailScreen Hook
 * Shared logic for RoomDetailScreen across platforms.
 * File: useRoomDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useRoom } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useRoomDetailScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const { get, remove, data, isLoading, errorCode, reset } = useRoom();

  const room = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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
    router.push('/settings/rooms');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (id) router.push(`/settings/rooms/${id}/edit`);
  }, [id, router]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(id);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/rooms?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [id, remove, isOffline, router, t]);

  return {
    id,
    room,
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

export default useRoomDetailScreen;
