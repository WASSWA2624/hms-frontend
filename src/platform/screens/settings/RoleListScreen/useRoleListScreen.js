/**
 * useRoleListScreen Hook
 * Shared logic for RoleListScreen across platforms.
 * File: useRoleListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useRole, useTenantAccess } from '@hooks';
import { confirmAction, humanizeIdentifier } from '@utils';

const SEARCH_SCOPES = Object.freeze(['all', 'name', 'description']);

const normalizeValue = (value) => String(value ?? '').trim();

const normalizeLower = (value) => normalizeValue(value).toLowerCase();

const resolveRoleName = (role) => normalizeValue(humanizeIdentifier(role?.name));

const resolveRoleDescription = (role) => normalizeValue(humanizeIdentifier(role?.description));

const sanitizeSearchScope = (value) => (
  SEARCH_SCOPES.includes(value) ? value : 'all'
);

const matchesRoleSearch = (role, query, scope) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;

  const normalizedScope = sanitizeSearchScope(scope);
  const roleName = normalizeLower(resolveRoleName(role));
  const roleDescription = normalizeLower(resolveRoleDescription(role));

  if (normalizedScope === 'name') return roleName.includes(normalizedQuery);
  if (normalizedScope === 'description') return roleDescription.includes(normalizedQuery);
  return roleName.includes(normalizedQuery) || roleDescription.includes(normalizedQuery);
};

const compareText = (left, right) => String(left || '').localeCompare(
  String(right || ''),
  undefined,
  { sensitivity: 'base', numeric: true }
);

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
    created: 'role.list.noticeCreated',
    updated: 'role.list.noticeUpdated',
    deleted: 'role.list.noticeDeleted',
    queued: 'role.list.noticeQueued',
    accessDenied: 'role.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useRoleListScreen = () => {
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
  } = useRole();

  const [noticeMessage, setNoticeMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const canManageRoles = canAccessTenantSettings;
  const canCreateRole = canManageRoles;
  const canDeleteRole = canManageRoles;
  const rawItems = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const normalizedSearchScope = useMemo(
    () => sanitizeSearchScope(searchScope),
    [searchScope]
  );
  const filteredItems = useMemo(
    () => rawItems.filter((roleItem) => matchesRoleSearch(roleItem, search, normalizedSearchScope)),
    [rawItems, search, normalizedSearchScope]
  );
  const items = useMemo(() => {
    const safeSortField = sortField === 'description' ? 'description' : 'name';
    const leftSelector = safeSortField === 'description' ? resolveRoleDescription : resolveRoleName;
    const directionMultiplier = sortDirection === 'desc' ? -1 : 1;

    return [...filteredItems].sort((leftRole, rightRole) => {
      const leftValue = leftSelector(leftRole);
      const rightValue = leftSelector(rightRole);
      return compareText(leftValue, rightValue) * directionMultiplier;
    });
  }, [filteredItems, sortField, sortDirection]);
  const hasNoResults = useMemo(
    () => normalizeValue(search).length > 0 && items.length === 0 && rawItems.length > 0,
    [search, items.length, rawItems.length]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'role.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageRoles) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const params = { page: 1, limit: 20 };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    reset();
    list(params);
  }, [isResolved, canManageRoles, canManageAllTenants, normalizedTenantId, list, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageRoles) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageRoles, canManageAllTenants, normalizedTenantId, router]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/roles');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageRoles) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageRoles, errorCode, t]);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleSearch = useCallback((value) => {
    setSearch(value ?? '');
  }, []);

  const handleSearchScopeChange = useCallback((value) => {
    setSearchScope(sanitizeSearchScope(value));
  }, []);

  const handleClearSearchAndFilters = useCallback(() => {
    setSearch('');
    setSearchScope('all');
  }, []);

  const handleSort = useCallback((field) => {
    const nextField = field === 'description' ? 'description' : 'name';
    setSortField((currentField) => {
      if (currentField === nextField) {
        setSortDirection((currentDirection) => (
          currentDirection === 'asc' ? 'desc' : 'asc'
        ));
        return currentField;
      }

      setSortDirection('asc');
      return nextField;
    });
  }, []);

  const handleItemPress = useCallback(
    (id) => {
      if (!canManageRoles) return;
      const roleId = normalizeValue(id);
      if (!roleId) return;
      router.push(`/settings/roles/${roleId}`);
    },
    [canManageRoles, router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteRole) return;
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
    [canDeleteRole, remove, fetchList, isOffline, t]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateRole) return;
    router.push('/settings/roles/create');
  }, [canCreateRole, router]);

  return {
    items,
    search,
    searchScope: normalizedSearchScope,
    searchScopeOptions: [
      { value: 'all', label: t('role.list.searchScopeAll') },
      { value: 'name', label: t('role.list.searchScopeName') },
      { value: 'description', label: t('role.list.searchScopeDescription') },
    ],
    sortField,
    sortDirection,
    hasNoResults,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && !!errorCode,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onSearch: handleSearch,
    onSearchScopeChange: handleSearchScopeChange,
    onClearSearchAndFilters: handleClearSearchAndFilters,
    onSort: handleSort,
    onItemPress: handleItemPress,
    onDelete: canDeleteRole ? handleDelete : undefined,
    onAdd: canCreateRole ? handleAdd : undefined,
  };
};

export default useRoleListScreen;
