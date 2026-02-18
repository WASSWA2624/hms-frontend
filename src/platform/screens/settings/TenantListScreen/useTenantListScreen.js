/**
 * useTenantListScreen Hook
 * Shared logic for TenantListScreen across platforms.
 * File: useTenantListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useTenant, useTenantAccess } from '@hooks';
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
    created: 'tenant.list.noticeCreated',
    updated: 'tenant.list.noticeUpdated',
    deleted: 'tenant.list.noticeDeleted',
    queued: 'tenant.list.noticeQueued',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const matchesTenantSearch = (tenant, query) => {
  const normalizedQuery = String(query || '').trim().toLowerCase();
  if (!normalizedQuery) return true;
  const fields = [
    tenant?.name,
    tenant?.slug,
    tenant?.human_friendly_id,
    tenant?.humanFriendlyId,
  ];
  return fields.some((field) =>
    String(field || '').toLowerCase().includes(normalizedQuery)
  );
};

const useTenantListScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { notice } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    canCreateTenant,
    canEditTenant,
    canDeleteTenant,
    tenantId,
    isResolved,
  } = useTenantAccess();
  const {
    list,
    get,
    remove,
    data,
    isLoading,
    errorCode,
  } = useTenant();

  const [search, setSearch] = useState('');
  const [noticeMessage, setNoticeMessage] = useState(null);
  const baseItems = useMemo(() => {
    if (canManageAllTenants) {
      return Array.isArray(data) ? data : (data?.items ?? []);
    }
    const ownTenant = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
    return ownTenant ? [ownTenant] : [];
  }, [canManageAllTenants, data]);
  const items = useMemo(() => {
    return baseItems.filter((tenant) => matchesTenantSearch(tenant, search));
  }, [baseItems, search]);
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'tenant.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback((params = {}) => {
    list({ page: 1, limit: 20, ...params });
  }, [list]);
  const fetchOwnTenant = useCallback(() => {
    if (!tenantId) return;
    get(tenantId);
  }, [tenantId, get]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessTenantSettings) {
      router.replace('/settings');
      return;
    }
    if (canManageAllTenants) return;
    if (!tenantId) {
      router.replace('/settings');
      return;
    }
    fetchOwnTenant();
  }, [
    isResolved,
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId,
    fetchOwnTenant,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canAccessTenantSettings || !canManageAllTenants) return;
    fetchList();
  }, [isResolved, canAccessTenantSettings, canManageAllTenants, fetchList]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/tenants');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  const handleDismissNotice = useCallback(() => {
    setNoticeMessage(null);
  }, []);

  const handleRetry = useCallback(() => {
    if (!isResolved || !canAccessTenantSettings) return;
    if (canManageAllTenants) {
      fetchList();
      return;
    }
    fetchOwnTenant();
  }, [
    isResolved,
    canAccessTenantSettings,
    canManageAllTenants,
    fetchList,
    fetchOwnTenant,
  ]);

  const handleSearch = useCallback((value) => {
    setSearch(value ?? '');
  }, []);

  const handleTenantPress = useCallback(
    (id) => {
      if (!id) return;
      if (!canManageAllTenants && tenantId && id !== tenantId) {
        router.push(`/settings/tenants/${tenantId}`);
        return;
      }
      router.push(`/settings/tenants/${id}`);
    },
    [canManageAllTenants, tenantId, router]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/tenants/create');
  }, [router]);

  const handleEdit = useCallback(
    (id, e) => {
      if (!canEditTenant) return;
      if (e?.stopPropagation) e.stopPropagation();
      const targetId = canManageAllTenants ? id : tenantId;
      if (!targetId) return;
      router.push(`/settings/tenants/${targetId}/edit`);
    },
    [canEditTenant, canManageAllTenants, tenantId, router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteTenant) return;
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
    [canDeleteTenant, remove, fetchList, t, isOffline]
  );

  return {
    items,
    search,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: handleDismissNotice,
    onRetry: handleRetry,
    onSearch: handleSearch,
    onTenantPress: handleTenantPress,
    onAdd: canCreateTenant ? handleAdd : undefined,
    onEdit: canEditTenant ? handleEdit : undefined,
    onDelete: canDeleteTenant ? handleDelete : undefined,
  };
};

export default useTenantListScreen;
