/**
 * useRoomListScreen Hook
 * Shared logic for RoomListScreen across platforms.
 * File: useRoomListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useRoom } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode, loadErrorKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(loadErrorKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(loadErrorKey) : resolved;
};

const resolveNoticeMessage = (t, notice) => {
  const map = {
    created: 'room.list.noticeCreated',
    updated: 'room.list.noticeUpdated',
    deleted: 'room.list.noticeDeleted',
    queued: 'room.list.noticeQueued',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useRoomListScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { notice } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const {
    list,
    remove,
    data,
    isLoading,
    errorCode,
    reset,
  } = useRoom();

  const [search, setSearch] = useState('');
  const [noticeMessage, setNoticeMessage] = useState(null);
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'room.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback((params = {}) => {
    reset();
    list({ page: 1, limit: 20, ...params });
  }, [list, reset]);

  useEffect(() => {
    const trimmed = search.trim();
    fetchList(trimmed ? { search: trimmed } : {});
  }, [fetchList, search]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/rooms');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  const handleRetry = useCallback(() => {
    const trimmed = search.trim();
    fetchList(trimmed ? { search: trimmed } : {});
  }, [fetchList, search]);

  const handleSearch = useCallback((value) => {
    setSearch(value ?? '');
  }, []);

  const handleRoomPress = useCallback(
    (id) => {
      router.push(`/settings/rooms/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (e?.stopPropagation) e.stopPropagation();
      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(id);
        if (!result) return;
        const trimmed = search.trim();
        fetchList(trimmed ? { search: trimmed } : {});
        const noticeKey = isOffline ? 'queued' : 'deleted';
        const message = resolveNoticeMessage(t, noticeKey);
        if (message) {
          setNoticeMessage(message);
        }
      } catch {
        /* error handled by hook */
      }
    },
    [remove, fetchList, isOffline, t, search]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/rooms/create');
  }, [router]);

  return {
    items,
    search,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onSearch: handleSearch,
    onRoomPress: handleRoomPress,
    onDelete: handleDelete,
    onAdd: handleAdd,
  };
};

export default useRoomListScreen;
