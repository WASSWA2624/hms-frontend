/**
 * useBedListScreen Hook
 * Shared logic for BedListScreen across platforms.
 * File: useBedListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useBed, useTenantAccess } from '@hooks';
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
    created: 'bed.list.noticeCreated',
    updated: 'bed.list.noticeUpdated',
    deleted: 'bed.list.noticeDeleted',
    queued: 'bed.list.noticeQueued',
    accessDenied: 'bed.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useBedListScreen = () => {
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
  } = useBed();

  const [search, setSearch] = useState('');
  const [noticeMessage, setNoticeMessage] = useState(null);
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const canManageBeds = canAccessTenantSettings;
  const canCreateBed = canManageBeds;
  const canDeleteBed = canManageBeds;
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'bed.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback((params = {}) => {
    if (!isResolved || !canManageBeds) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const nextParams = { page: 1, limit: 20, ...params };
    if (!canManageAllTenants) {
      nextParams.tenant_id = normalizedTenantId;
    }
    reset();
    list(nextParams);
  }, [
    isResolved,
    canManageBeds,
    canManageAllTenants,
    normalizedTenantId,
    list,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageBeds) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageBeds, canManageAllTenants, normalizedTenantId, router]);

  useEffect(() => {
    if (!isResolved || !canManageBeds) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const trimmed = search.trim();
    fetchList(trimmed ? { search: trimmed } : {});
  }, [isResolved, canManageBeds, canManageAllTenants, normalizedTenantId, fetchList, search]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/beds');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageBeds) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageBeds, errorCode, t]);

  const handleRetry = useCallback(() => {
    const trimmed = search.trim();
    fetchList(trimmed ? { search: trimmed } : {});
  }, [fetchList, search]);

  const handleSearch = useCallback((value) => {
    setSearch(value ?? '');
  }, []);

  const handleBedPress = useCallback(
    (id) => {
      if (!canManageBeds) return;
      router.push(`/settings/beds/${id}`);
    },
    [canManageBeds, router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteBed) return;
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
    [canDeleteBed, remove, fetchList, isOffline, t, search]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateBed) return;
    router.push('/settings/beds/create');
  }, [canCreateBed, router]);

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
    onBedPress: handleBedPress,
    onDelete: canDeleteBed ? handleDelete : undefined,
    onAdd: canCreateBed ? handleAdd : undefined,
  };
};

export default useBedListScreen;
