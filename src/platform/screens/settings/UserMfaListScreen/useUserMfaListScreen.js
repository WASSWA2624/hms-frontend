/**
 * useUserMfaListScreen Hook
 * Shared logic for UserMfaListScreen across platforms.
 * File: useUserMfaListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useTenantAccess, useUserMfa } from '@hooks';
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
    created: 'userMfa.list.noticeCreated',
    updated: 'userMfa.list.noticeUpdated',
    deleted: 'userMfa.list.noticeDeleted',
    queued: 'userMfa.list.noticeQueued',
    accessDenied: 'userMfa.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useUserMfaListScreen = () => {
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
    remove,
    data,
    isLoading,
    errorCode,
    reset,
  } = useUserMfa();

  const [noticeMessage, setNoticeMessage] = useState(null);
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const canManageUserMfas = canAccessTenantSettings;
  const canCreateUserMfa = canManageUserMfas;
  const canDeleteUserMfa = canManageUserMfas;
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'userMfa.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageUserMfas) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const params = { page: 1, limit: 20 };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    reset();
    list(params);
  }, [
    isResolved,
    canManageUserMfas,
    canManageAllTenants,
    normalizedTenantId,
    list,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserMfas) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageUserMfas,
    canManageAllTenants,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserMfas) return;
    fetchList();
  }, [isResolved, canManageUserMfas, fetchList]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/user-mfas');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!isResolved || !canManageUserMfas) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageUserMfas, errorCode, t]);

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
      if (!canManageUserMfas) return;
      router.push(`/settings/user-mfas/${id}`);
    },
    [canManageUserMfas, router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteUserMfa) return;
      if (e?.stopPropagation) e.stopPropagation();
      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(id);
        if (!result) return;
        fetchList();
        const noticeKey = isOffline ? 'queued' : 'deleted';
        const message = resolveNoticeMessage(t, noticeKey);
        if (message) {
          setNoticeMessage(message);
        }
      } catch {
        /* error handled by hook */
      }
    },
    [canDeleteUserMfa, remove, fetchList, isOffline, t]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateUserMfa) return;
    router.push('/settings/user-mfas/create');
  }, [canCreateUserMfa, router]);

  return {
    items,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && !!errorCode,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onItemPress: handleItemPress,
    onDelete: canDeleteUserMfa ? handleDelete : undefined,
    onAdd: canCreateUserMfa ? handleAdd : undefined,
  };
};

export default useUserMfaListScreen;
