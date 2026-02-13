/**
 * useApiKeyPermissionListScreen Hook
 * Shared logic for ApiKeyPermissionListScreen across platforms.
 * File: useApiKeyPermissionListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useApiKeyPermission, useTenantAccess } from '@hooks';
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
    created: 'apiKeyPermission.list.noticeCreated',
    updated: 'apiKeyPermission.list.noticeUpdated',
    deleted: 'apiKeyPermission.list.noticeDeleted',
    queued: 'apiKeyPermission.list.noticeQueued',
    accessDenied: 'apiKeyPermission.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useApiKeyPermissionListScreen = () => {
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
  } = useApiKeyPermission();

  const [noticeMessage, setNoticeMessage] = useState(null);
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const canManageApiKeyPermissions = canAccessTenantSettings;
  const canCreateApiKeyPermission = canManageApiKeyPermissions;
  const canDeleteApiKeyPermission = canManageApiKeyPermissions;
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'apiKeyPermission.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageApiKeyPermissions) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const params = { page: 1, limit: 20 };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    reset();
    list(params);
  }, [
    isResolved,
    canManageApiKeyPermissions,
    canManageAllTenants,
    normalizedTenantId,
    list,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageApiKeyPermissions) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageApiKeyPermissions,
    canManageAllTenants,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeyPermissions) return;
    fetchList();
  }, [isResolved, canManageApiKeyPermissions, fetchList]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/api-key-permissions');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!isResolved || !canManageApiKeyPermissions) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageApiKeyPermissions, errorCode, t]);

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
      if (!canManageApiKeyPermissions) return;
      router.push(`/settings/api-key-permissions/${id}`);
    },
    [canManageApiKeyPermissions, router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteApiKeyPermission) return;
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
    [canDeleteApiKeyPermission, remove, fetchList, isOffline, t]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateApiKeyPermission) return;
    router.push('/settings/api-key-permissions/create');
  }, [canCreateApiKeyPermission, router]);

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
    onDelete: canDeleteApiKeyPermission ? handleDelete : undefined,
    onAdd: canCreateApiKeyPermission ? handleAdd : undefined,
  };
};

export default useApiKeyPermissionListScreen;
