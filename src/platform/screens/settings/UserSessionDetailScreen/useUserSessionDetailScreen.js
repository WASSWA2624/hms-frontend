/**
 * useUserSessionDetailScreen Hook
 * Shared logic for UserSessionDetailScreen across platforms.
 * File: useUserSessionDetailScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useUserSession } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
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

const useUserSessionDetailScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const { get, revoke, data, isLoading, errorCode, reset } = useUserSession();
  const [noticeMessage, setNoticeMessage] = useState(null);

  const session = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/user-sessions');
  }, [router]);

  const handleRevoke = useCallback(async () => {
    if (!id) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    let result;
    try {
      result = await revoke(id);
    } catch {
      result = undefined;
    }
    if (!result) {
      const message = resolveNoticeMessage(t, 'revokeFailed');
      if (message) setNoticeMessage(message);
      return;
    }
    const message = resolveNoticeMessage(t, isOffline ? 'queued' : 'revoked');
    if (message) setNoticeMessage(message);
    handleBack();
  }, [id, revoke, handleBack, isOffline, t]);

  return {
    id,
    session,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onBack: handleBack,
    onRevoke: handleRevoke,
  };
};

export default useUserSessionDetailScreen;
