/**
 * useOauthAccountListScreen Hook
 * Shared logic for OauthAccountListScreen across platforms.
 * File: useOauthAccountListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useOauthAccount } from '@hooks';
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

const useOauthAccountListScreen = () => {
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
  } = useOauthAccount();

  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const [noticeMessage, setNoticeMessage] = useState(null);
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'oauthAccount.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    reset();
    list({ page: 1, limit: 20 });
  }, [list, reset]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (!noticeValue) return;
    const map = {
      created: 'oauthAccount.list.noticeCreated',
      updated: 'oauthAccount.list.noticeUpdated',
      deleted: 'oauthAccount.list.noticeDeleted',
      queued: 'oauthAccount.list.noticeQueued',
    };
    const key = map[noticeValue];
    if (!key) return;
    const message = t(key);
    setNoticeMessage(message);
    router.replace('/settings/oauth-accounts');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleItemPress = useCallback(
    (id) => {
      router.push(`/settings/oauth-accounts/${id}`);
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
        fetchList();
        const noticeKey = isOffline ? 'queued' : 'deleted';
        const noticeMap = {
          deleted: 'oauthAccount.list.noticeDeleted',
          queued: 'oauthAccount.list.noticeQueued',
        };
        const key = noticeMap[noticeKey];
        if (key) {
          setNoticeMessage(t(key));
        }
      } catch {
        /* error handled by hook */
      }
    },
    [remove, fetchList, isOffline, t]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/oauth-accounts/create');
  }, [router]);

  return {
    items,
    isLoading,
    hasError: !!errorCode,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onItemPress: handleItemPress,
    onDelete: handleDelete,
    onAdd: handleAdd,
  };
};

export default useOauthAccountListScreen;
