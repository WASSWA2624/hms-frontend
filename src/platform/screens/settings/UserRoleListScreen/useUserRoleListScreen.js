/**
 * useUserRoleListScreen Hook
 * Shared logic for UserRoleListScreen across platforms.
 * File: useUserRoleListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useTenantAccess, useUserRole } from '@hooks';
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
    created: 'userRole.list.noticeCreated',
    updated: 'userRole.list.noticeUpdated',
    deleted: 'userRole.list.noticeDeleted',
    queued: 'userRole.list.noticeQueued',
    accessDenied: 'userRole.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useUserRoleListScreen = () => {
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
  } = useUserRole();

  const [noticeMessage, setNoticeMessage] = useState(null);
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const canManageUserRoles = canAccessTenantSettings;
  const canCreateUserRole = canManageUserRoles;
  const canDeleteUserRole = canManageUserRoles;
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'userRole.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageUserRoles) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const params = { page: 1, limit: 20 };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    reset();
    list(params);
  }, [
    isResolved,
    canManageUserRoles,
    canManageAllTenants,
    normalizedTenantId,
    list,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserRoles) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageUserRoles,
    canManageAllTenants,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserRoles) return;
    fetchList();
  }, [isResolved, canManageUserRoles, fetchList]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/user-roles');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!isResolved || !canManageUserRoles) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageUserRoles, errorCode, t]);

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
      if (!canManageUserRoles) return;
      router.push(`/settings/user-roles/${id}`);
    },
    [canManageUserRoles, router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteUserRole) return;
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
    [canDeleteUserRole, remove, fetchList, isOffline, t]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateUserRole) return;
    router.push('/settings/user-roles/create');
  }, [canCreateUserRole, router]);

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
    onDelete: canDeleteUserRole ? handleDelete : undefined,
    onAdd: canCreateUserRole ? handleAdd : undefined,
  };
};

export default useUserRoleListScreen;
