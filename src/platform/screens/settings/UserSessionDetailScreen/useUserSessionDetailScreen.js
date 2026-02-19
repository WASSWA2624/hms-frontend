/**
 * useUserSessionDetailScreen Hook
 * Shared logic for UserSessionDetailScreen across platforms.
 * File: useUserSessionDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useUserSession, useTenantAccess } from '@hooks';
import { humanizeIdentifier } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const normalizeValue = (value) => String(value ?? '').trim();

const resolveReadableValue = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = humanizeIdentifier(candidate);
    if (normalized) return normalizeValue(normalized);
  }
  return '';
};

const resolveContextValue = (readableValue, technicalId, canViewTechnicalIds, fallbackLabel) => {
  if (readableValue) return readableValue;
  const normalizedTechnicalId = normalizeValue(technicalId);
  if (!normalizedTechnicalId) return '';
  if (canViewTechnicalIds) return normalizedTechnicalId;
  return fallbackLabel;
};

const resolveSessionStatusLabel = (session, t) => {
  if (!session) return '';
  if (session?.revoked_at) return t('userSession.list.statusRevoked');
  const expiresAt = new Date(session?.expires_at);
  if (!Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= Date.now()) {
    return t('userSession.list.statusExpired');
  }
  return t('userSession.list.statusActive');
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
  const { get, data, isLoading, errorCode, reset } = useUserSession();

  const sessionId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);

  const canManageUserSessions = canAccessTenantSettings;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageUserSessions && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);

  const session = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const sessionLabel = useMemo(() => (
    resolveContextValue(
      resolveReadableValue(
        session?.session_name,
        session?.label,
        session?.display_name
      ),
      session?.id,
      canViewTechnicalIds,
      t('userSession.detail.currentSessionLabel')
    )
  ), [session, canViewTechnicalIds, t]);

  const userLabel = useMemo(() => (
    resolveContextValue(
      resolveReadableValue(
        session?.user?.name,
        session?.user?.full_name,
        session?.user?.display_name,
        session?.user?.email,
        session?.user_name
      ),
      session?.user_id,
      canViewTechnicalIds,
      t('userSession.detail.currentUserLabel')
    )
  ), [session, canViewTechnicalIds, t]);

  const statusLabel = useMemo(
    () => resolveSessionStatusLabel(session, t),
    [session, t]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageUserSessions || !sessionId) return;
    if (isTenantScopedAdmin && !normalizedTenantId) return;
    reset();
    get(sessionId);
  }, [
    isResolved,
    canManageUserSessions,
    isTenantScopedAdmin,
    normalizedTenantId,
    sessionId,
    get,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserSessions) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageUserSessions, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageUserSessions || !isTenantScopedAdmin || !session) return;
    const recordTenantId = normalizeValue(session?.tenant_id);
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

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/user-sessions');
  }, [router]);

  return {
    id: sessionId,
    session,
    sessionLabel,
    userLabel,
    statusLabel,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: undefined,
    onDelete: undefined,
  };
};

export default useUserSessionDetailScreen;

