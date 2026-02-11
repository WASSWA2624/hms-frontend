/**
 * useUserSessionListScreen Hook
 * Shared logic for UserSessionListScreen across platforms.
 * File: useUserSessionListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useI18n, useNetwork, useUserSession } from '@hooks';
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
    revoked: 'userSession.list.noticeRevoked',
    queued: 'userSession.list.noticeQueued',
    revokeFailed: 'userSession.list.noticeRevokeFailed',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useUserSessionListScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const {
    list,
    revoke,
    data,
    isLoading,
    errorCode,
    reset,
  } = useUserSession();
  const [noticeMessage, setNoticeMessage] = useState(null);

  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'userSession.list.loadError'),
    [t, errorCode]
  );

  const fetchList = useCallback(() => {
    reset();
    list({ page: 1, limit: 20 });
  }, [list, reset]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

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

  const handleSessionPress = useCallback(
    (id) => {
      router.push(`/settings/user-sessions/${id}`);
    },
    [router]
  );

  const handleRevoke = useCallback(
    async (id, e) => {
      if (e?.stopPropagation) e.stopPropagation();
      if (!confirmAction(t('common.confirmDelete'))) return;
      let result;
      try {
        result = await revoke(id);
      } catch {
        result = undefined;
      }
      if (!result) {
        const failedMessage = resolveNoticeMessage(t, 'revokeFailed');
        if (failedMessage) setNoticeMessage(failedMessage);
        return;
      }
      fetchList();
      const noticeKey = isOffline ? 'queued' : 'revoked';
      const message = resolveNoticeMessage(t, noticeKey);
      if (message) setNoticeMessage(message);
    },
    [revoke, fetchList, isOffline, t]
  );

  return {
    items,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onSessionPress: handleSessionPress,
    onRevoke: handleRevoke,
  };
};

export default useUserSessionListScreen;
