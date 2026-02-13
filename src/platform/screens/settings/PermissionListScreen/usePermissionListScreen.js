/**
 * usePermissionListScreen Hook
 * Shared logic for PermissionListScreen across platforms.
 * File: usePermissionListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, usePermission, useTenantAccess } from '@hooks';
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
    created: 'permission.list.noticeCreated',
    updated: 'permission.list.noticeUpdated',
    deleted: 'permission.list.noticeDeleted',
    queued: 'permission.list.noticeQueued',
    accessDenied: 'permission.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const usePermissionListScreen = () => {
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
  } = usePermission();

  const [noticeMessage, setNoticeMessage] = useState(null);
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const canManagePermissions = canAccessTenantSettings;
  const canCreatePermission = canManagePermissions;
  const canDeletePermission = canManagePermissions;
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'permission.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback((params = {}) => {
    if (!isResolved || !canManagePermissions) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const nextParams = { page: 1, limit: 20, ...params };
    if (!canManageAllTenants) {
      nextParams.tenant_id = normalizedTenantId;
    }
    reset();
    list(nextParams);
  }, [
    isResolved,
    canManagePermissions,
    canManageAllTenants,
    normalizedTenantId,
    list,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManagePermissions) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManagePermissions, canManageAllTenants, normalizedTenantId, router]);

  useEffect(() => {
    if (!isResolved || !canManagePermissions) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    fetchList();
  }, [isResolved, canManagePermissions, canManageAllTenants, normalizedTenantId, fetchList]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/permissions');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManagePermissions) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManagePermissions, errorCode, t]);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleItemPress = useCallback(
    (id) => {
      if (!canManagePermissions) return;
      router.push(`/settings/permissions/${id}`);
    },
    [canManagePermissions, router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeletePermission) return;
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
    [canDeletePermission, remove, fetchList, isOffline, t]
  );

  const handleAdd = useCallback(() => {
    if (!canCreatePermission) return;
    router.push('/settings/permissions/create');
  }, [canCreatePermission, router]);

  return {
    items,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onItemPress: handleItemPress,
    onDelete: canDeletePermission ? handleDelete : undefined,
    onAdd: canCreatePermission ? handleAdd : undefined,
  };
};

export default usePermissionListScreen;
