/**
 * useUserSessionDetailScreen Hook
 * Shared logic for UserSessionDetailScreen across platforms.
 * File: useUserSessionDetailScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useTenantAccess, useUserSession } from '@hooks';
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
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useTenantAccess();
  const { get, revoke, data, isLoading, errorCode, reset } = useUserSession();
  const [noticeMessage, setNoticeMessage] = useState(null);
  const sessionId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageUserSessions = canAccessTenantSettings;
  const canRevokeSession = canManageUserSessions;
  const isTenantScopedAdmin = canManageUserSessions && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const session = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageUserSessions || !sessionId) return;
    reset();
    get(sessionId);
  }, [isResolved, canManageUserSessions, sessionId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserSessions) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageUserSessions,
    isTenantScopedAdmin,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageUserSessions || !isTenantScopedAdmin || !session) return;
    const recordTenantId = String(session?.tenant_id ?? '').trim();
    if (recordTenantId && recordTenantId !== normalizedTenantId) {
      router.replace('/settings/user-sessions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUserSessions,
    isTenantScopedAdmin,
    session,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserSessions) return;
    if (session) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/user-sessions?notice=accessDenied');
    }
  }, [isResolved, canManageUserSessions, session, errorCode, router]);

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
    if (!canRevokeSession || !sessionId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    let result;
    try {
      result = await revoke(sessionId);
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
  }, [canRevokeSession, sessionId, revoke, handleBack, isOffline, t]);

  return {
    id: sessionId,
    session,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onBack: handleBack,
    onRevoke: canRevokeSession ? handleRevoke : undefined,
  };
};

export default useUserSessionDetailScreen;
