/**
 * useBranchListScreen Hook
 * Shared logic for BranchListScreen across platforms.
 * File: useBranchListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useBranch, useTenantAccess } from '@hooks';
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
    created: 'branch.list.noticeCreated',
    updated: 'branch.list.noticeUpdated',
    deleted: 'branch.list.noticeDeleted',
    queued: 'branch.list.noticeQueued',
    accessDenied: 'branch.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useBranchListScreen = () => {
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
  } = useBranch();

  const [search, setSearch] = useState('');
  const [noticeMessage, setNoticeMessage] = useState(null);
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const canManageBranches = canAccessTenantSettings;
  const canCreateBranch = canManageBranches;
  const canDeleteBranch = canManageBranches;
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'branch.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback((params = {}) => {
    if (!isResolved || !canManageBranches) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const nextParams = { page: 1, limit: 20, ...params };
    if (!canManageAllTenants) {
      nextParams.tenant_id = normalizedTenantId;
    }
    reset();
    list(nextParams);
  }, [isResolved, canManageBranches, canManageAllTenants, normalizedTenantId, list, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageBranches) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageBranches, canManageAllTenants, normalizedTenantId, router]);

  useEffect(() => {
    if (!isResolved || !canManageBranches) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const trimmed = search.trim();
    fetchList(trimmed ? { search: trimmed } : {});
  }, [isResolved, canManageBranches, canManageAllTenants, normalizedTenantId, fetchList, search]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/branches');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageBranches) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageBranches, errorCode, t]);

  const handleRetry = useCallback(() => {
    const trimmed = search.trim();
    fetchList(trimmed ? { search: trimmed } : {});
  }, [fetchList, search]);

  const handleSearch = useCallback((value) => {
    setSearch(value ?? '');
  }, []);

  const handleBranchPress = useCallback(
    (id) => {
      if (!canManageBranches) return;
      router.push(`/settings/branches/${id}`);
    },
    [canManageBranches, router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteBranch) return;
      if (e?.stopPropagation) e.stopPropagation();
      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(id);
        if (!result) return;
        const trimmed = search.trim();
        fetchList(trimmed ? { search: trimmed } : {});
        const noticeKey = isOffline ? 'queued' : 'deleted';
        const message = resolveNoticeMessage(t, noticeKey);
        if (message) {
          setNoticeMessage(message);
        }
      } catch {
        /* error handled by hook */
      }
    },
    [canDeleteBranch, remove, fetchList, t, search, isOffline]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateBranch) return;
    router.push('/settings/branches/create');
  }, [canCreateBranch, router]);

  return {
    items,
    search,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onSearch: handleSearch,
    onBranchPress: handleBranchPress,
    onDelete: canDeleteBranch ? handleDelete : undefined,
    onAdd: canCreateBranch ? handleAdd : undefined,
  };
};

export default useBranchListScreen;
