/**
 * useApiKeyListScreen Hook
 * Shared logic for ApiKeyListScreen across platforms.
 * File: useApiKeyListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useApiKey, useTenantAccess } from '@hooks';
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
    created: 'apiKey.list.noticeCreated',
    updated: 'apiKey.list.noticeUpdated',
    deleted: 'apiKey.list.noticeDeleted',
    queued: 'apiKey.list.noticeQueued',
    accessDenied: 'apiKey.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useApiKeyListScreen = () => {
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
  } = useApiKey();

  const [noticeMessage, setNoticeMessage] = useState(null);
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const canManageApiKeys = canAccessTenantSettings;
  const canDeleteApiKey = canManageApiKeys;
  const canCreateApiKey = false;
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'apiKey.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageApiKeys) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const params = { page: 1, limit: 20 };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    reset();
    list(params);
  }, [
    isResolved,
    canManageApiKeys,
    canManageAllTenants,
    normalizedTenantId,
    list,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageApiKeys) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageApiKeys,
    canManageAllTenants,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeys) return;
    fetchList();
  }, [isResolved, canManageApiKeys, fetchList]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/api-keys');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeys) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageApiKeys, errorCode, t]);

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
      if (!canManageApiKeys) return;
      router.push(`/settings/api-keys/${id}`);
    },
    [canManageApiKeys, router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteApiKey) return;
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
    [canDeleteApiKey, remove, fetchList, isOffline, t]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateApiKey) return;
    router.push('/settings/api-keys/create');
  }, [canCreateApiKey, router]);

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
    onDelete: canDeleteApiKey ? handleDelete : undefined,
    onAdd: canCreateApiKey ? handleAdd : undefined,
  };
};

export default useApiKeyListScreen;
