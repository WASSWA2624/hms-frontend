/**
 * useTenantListScreen Hook
 * Shared logic for TenantListScreen across platforms.
 * File: useTenantListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useI18n, useNetwork, useTenant } from '@hooks';
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

const useTenantListScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const {
    list,
    remove,
    data,
    isLoading,
    errorCode,
    reset,
  } = useTenant();

  const [search, setSearch] = useState('');
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'tenant.list.loadError'),
    [t, errorCode]
  );

  const fetchList = useCallback((params = {}) => {
    reset();
    list({ page: 1, limit: 20, ...params });
  }, [list, reset]);

  useEffect(() => {
    const trimmed = search.trim();
    fetchList(trimmed ? { search: trimmed } : {});
  }, [fetchList, search]);

  const handleRetry = useCallback(() => {
    const trimmed = search.trim();
    fetchList(trimmed ? { search: trimmed } : {});
  }, [fetchList, search]);

  const handleSearch = useCallback((value) => {
    setSearch(value ?? '');
  }, []);

  const handleTenantPress = useCallback(
    (id) => {
      router.push(`/settings/tenants/${id}`);
    },
    [router]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/tenants/create');
  }, [router]);

  const handleDelete = useCallback(
    async (id, e) => {
      if (e?.stopPropagation) e.stopPropagation();
      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(id);
        if (!result) return;
        const trimmed = search.trim();
        fetchList(trimmed ? { search: trimmed } : {});
      } catch {
        /* error handled by hook */
      }
    },
    [remove, fetchList, t, search]
  );

  return {
    items,
    search,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onSearch: handleSearch,
    onTenantPress: handleTenantPress,
    onAdd: handleAdd,
    onDelete: handleDelete,
  };
};

export default useTenantListScreen;
