/**
 * useUserSessionListScreen Hook
 * Shared logic for UserSessionListScreen across platforms.
 * File: useUserSessionListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useTenantAccess, useUserSession } from '@hooks';
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
    accessDenied: 'userSession.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useUserSessionListScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { notice } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useTenantAccess();
  const {
    list,
    revoke,
    data,
    isLoading,
    errorCode,
    reset,
  } = useUserSession();
  const [noticeMessage, setNoticeMessage] = useState(null);
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const canManageUserSessions = canAccessTenantSettings;
  const canRevokeSession = canManageUserSessions;

  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'userSession.list.loadError'),
    [t, errorCode]
  );

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageUserSessions) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const params = { page: 1, limit: 20 };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    reset();
    list(params);
  }, [
    isResolved,
    canManageUserSessions,
    canManageAllTenants,
    normalizedTenantId,
    list,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserSessions) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageUserSessions,
    canManageAllTenants,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserSessions) return;
    fetchList();
  }, [isResolved, canManageUserSessions, fetchList]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/user-sessions');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!isResolved || !canManageUserSessions) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageUserSessions, errorCode, t]);

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
      if (!canManageUserSessions) return;
      router.push(`/settings/user-sessions/${id}`);
    },
    [canManageUserSessions, router]
  );

  const handleRevoke = useCallback(
    async (id, e) => {
      if (!canRevokeSession) return;
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
    [canRevokeSession, revoke, fetchList, isOffline, t]
  );

  return {
    items,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onSessionPress: handleSessionPress,
    onRevoke: canRevokeSession ? handleRevoke : undefined,
  };
};

export default useUserSessionListScreen;
