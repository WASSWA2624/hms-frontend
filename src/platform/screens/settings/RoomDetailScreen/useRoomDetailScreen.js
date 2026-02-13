/**
 * useRoomDetailScreen Hook
 * Shared logic for RoomDetailScreen across platforms.
 * File: useRoomDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useRoom, useTenantAccess } from '@hooks';
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
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useTenantAccess();
  const { get, remove, data, isLoading, errorCode, reset } = useRoom();

  const roomId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageRooms = canAccessTenantSettings;
  const canEditRoom = canManageRooms;
  const canDeleteRoom = canManageRooms;
  const isTenantScopedAdmin = canManageRooms && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const room = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageRooms || !roomId) return;
    reset();
    get(roomId);
  }, [isResolved, canManageRooms, roomId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageRooms) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageRooms, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageRooms || !isTenantScopedAdmin || !room) return;
    const roomTenantId = String(room.tenant_id ?? '').trim();
    if (!roomTenantId || roomTenantId !== normalizedTenantId) {
      router.replace('/settings/rooms?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageRooms,
    isTenantScopedAdmin,
    room,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRooms) return;
    if (room) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/rooms?notice=accessDenied');
    }
  }, [isResolved, canManageRooms, room, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/rooms');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditRoom || !roomId) return;
    router.push(`/settings/rooms/${roomId}/edit`);
  }, [canEditRoom, roomId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteRoom || !roomId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(roomId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/rooms?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteRoom, roomId, remove, isOffline, router, t]);

  return {
    id: roomId,
    room,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditRoom ? handleEdit : undefined,
    onDelete: canDeleteRoom ? handleDelete : undefined,
  };
};

export default useRoomDetailScreen;
