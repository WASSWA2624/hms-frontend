/**
 * usePermissionListScreen Hook
 * Shared logic for PermissionListScreen across platforms.
 * File: usePermissionListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth, useI18n, useNetwork, usePermission, useTenantAccess } from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeIdentifier } from '@utils';

const PREFS_STORAGE_PREFIX = 'hms.settings.permissions.list.preferences';
const TABLE_COLUMNS = Object.freeze(['name', 'description', 'tenant']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const MAX_FETCH_LIMIT = 100;
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'name', 'description', 'tenant']);
const FILTER_FIELDS = Object.freeze(['name', 'description', 'tenant']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  name: ['contains', 'equals', 'startsWith'],
  description: ['contains', 'equals', 'startsWith'],
  tenant: ['contains', 'equals', 'startsWith'],
});

const DEFAULT_FILTER = (id = 'permission-filter-1') => ({
  id,
  field: 'name',
  operator: 'contains',
  value: '',
});

const normalizeValue = (value) => String(value ?? '').trim();

const normalizeLower = (value) => normalizeValue(value).toLowerCase();

const uniqueArray = (values = []) => [...new Set(values)];

const sanitizeColumns = (values, fallback) => {
  if (!Array.isArray(values)) return [...fallback];
  const sanitized = values.filter((value) => TABLE_COLUMNS.includes(value));
  return sanitized.length > 0 ? uniqueArray(sanitized) : [...fallback];
};

const sanitizeSortField = (value) => (TABLE_COLUMNS.includes(value) ? value : 'name');

const sanitizeSortDirection = (value) => (value === 'desc' ? 'desc' : 'asc');

const sanitizeDensity = (value) => (
  DENSITY_OPTIONS.includes(value) ? value : DEFAULT_DENSITY
);

const sanitizePageSize = (value) => (
  PAGE_SIZE_OPTIONS.includes(Number(value)) ? Number(value) : DEFAULT_PAGE_SIZE
);

const sanitizeSearchScope = (value) => (
  SEARCH_SCOPES.includes(value) ? value : 'all'
);

const sanitizeFilterLogic = (value) => (
  FILTER_LOGICS.includes(value) ? value : 'AND'
);

const sanitizeFilterField = (value) => (
  FILTER_FIELDS.includes(value) ? value : 'name'
);

const getDefaultOperator = (field) => {
  const normalizedField = sanitizeFilterField(field);
  return FILTER_OPERATORS[normalizedField]?.[0] ?? 'contains';
};

const sanitizeFilterOperator = (field, operator) => {
  const normalizedField = sanitizeFilterField(field);
  const allowed = FILTER_OPERATORS[normalizedField] || [];
  if (allowed.includes(operator)) return operator;
  return allowed[0] ?? getDefaultOperator(normalizedField);
};

const sanitizeFilterValue = (value) => normalizeValue(value);

const sanitizeFilters = (values, getNextFilterId) => {
  if (!Array.isArray(values)) {
    return [DEFAULT_FILTER(getNextFilterId())];
  }

  const sanitized = values
    .map((filter) => {
      const field = sanitizeFilterField(filter?.field);
      return {
        id: normalizeValue(filter?.id) || getNextFilterId(),
        field,
        operator: sanitizeFilterOperator(field, filter?.operator),
        value: sanitizeFilterValue(filter?.value),
      };
    })
    .filter((filter) => FILTER_FIELDS.includes(filter.field));

  if (sanitized.length === 0) {
    return [DEFAULT_FILTER(getNextFilterId())];
  }

  return sanitized.slice(0, 4);
};

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

const resolvePermissionName = (permission) => normalizeValue(humanizeIdentifier(permission?.name));

const resolvePermissionDescription = (permission) => normalizeValue(
  humanizeIdentifier(permission?.description)
);

const resolvePermissionTenant = (permission) => normalizeValue(
  humanizeIdentifier(
    permission?.tenant_name
    ?? permission?.tenant?.name
    ?? permission?.tenant_label
    ?? permission?.tenant_id
  )
);

const resolvePermissionFieldValue = (permission, field) => {
  if (field === 'name') return resolvePermissionName(permission);
  if (field === 'description') return resolvePermissionDescription(permission);
  if (field === 'tenant') return resolvePermissionTenant(permission);
  return '';
};

const matchesTextOperator = (fieldValue, operator, normalizedNeedle) => {
  const normalizedValue = normalizeLower(fieldValue);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesPermissionSearch = (permission, query, scope) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(resolvePermissionFieldValue(permission, field))
      .includes(normalizedQuery));
  }

  const field = sanitizeFilterField(scope);
  return normalizeLower(resolvePermissionFieldValue(permission, field)).includes(normalizedQuery);
};

const matchesPermissionFilter = (permission, filter) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolvePermissionFieldValue(permission, field);
  const normalizedNeedle = normalizeLower(value);
  return matchesTextOperator(fieldValue, operator, normalizedNeedle);
};

const stableSort = (items, compareFn) => items
  .map((item, index) => ({ item, index }))
  .sort((left, right) => {
    const result = compareFn(left.item, right.item);
    if (result !== 0) return result;
    return left.index - right.index;
  })
  .map((entry) => entry.item);

const compareText = (left, right) => String(left || '').localeCompare(
  String(right || ''),
  undefined,
  { sensitivity: 'base', numeric: true }
);

const compareByField = (leftPermission, rightPermission, field, direction) => {
  const normalizedField = sanitizeSortField(field);
  const leftValue = resolvePermissionFieldValue(leftPermission, normalizedField);
  const rightValue = resolvePermissionFieldValue(rightPermission, normalizedField);
  const result = compareText(leftValue, rightValue);
  return direction === 'desc' ? result * -1 : result;
};

const usePermissionListScreen = () => {
  const { t } = useI18n();
  const { user } = useAuth();
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

  const filterCounterRef = useRef(1);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([DEFAULT_FILTER('permission-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const canManagePermissions = canAccessTenantSettings;
  const canViewTechnicalIds = canManageAllTenants;
  const canCreatePermission = canManagePermissions;
  const canDeletePermission = canManagePermissions;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);

  const preferenceSubject = useMemo(() => (
    normalizeValue(user?.id)
    || normalizeValue(user?.user_id)
    || normalizeValue(user?.email)
    || normalizedTenantId
    || 'anonymous'
  ), [user, normalizedTenantId]);

  const preferenceKey = useMemo(
    () => `${PREFS_STORAGE_PREFIX}.${preferenceSubject}`,
    [preferenceSubject]
  );

  const getNextFilterId = useCallback(() => {
    filterCounterRef.current += 1;
    return `permission-filter-${filterCounterRef.current}`;
  }, []);

  const rawItems = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );

  const normalizedFilters = useMemo(
    () => sanitizeFilters(filters, getNextFilterId),
    [filters, getNextFilterId]
  );

  const normalizedSearchScope = useMemo(
    () => sanitizeSearchScope(searchScope),
    [searchScope]
  );

  const activeFilters = useMemo(
    () => normalizedFilters.filter((filter) => normalizeValue(filter.value).length > 0),
    [normalizedFilters]
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch = normalizeValue(search);
    const hasSearch = normalizedSearch.length > 0;
    const hasFilters = activeFilters.length > 0;

    return rawItems.filter((permission) => {
      if (hasSearch && !matchesPermissionSearch(permission, normalizedSearch, normalizedSearchScope)) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesPermissionFilter(permission, filter));
      if (filterLogic === 'OR') {
        return matches.some(Boolean);
      }
      return matches.every(Boolean);
    });
  }, [rawItems, search, normalizedSearchScope, activeFilters, filterLogic]);

  const sortedItems = useMemo(() => stableSort(
    filteredItems,
    (left, right) => compareByField(left, right, sortField, sortDirection)
  ), [filteredItems, sortField, sortDirection]);

  const items = useMemo(() => sortedItems, [sortedItems]);
  const totalItems = items.length;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, page, pageSize]);

  const hasActiveSearchOrFilter = normalizeValue(search).length > 0 || activeFilters.length > 0;
  const hasNoResults = hasActiveSearchOrFilter && items.length === 0 && rawItems.length > 0;

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'permission.list.loadError'),
    [t, errorCode]
  );

  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManagePermissions) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = { page: 1, limit: MAX_FETCH_LIMIT };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    reset();
    list(params);
  }, [
    isResolved,
    canManagePermissions,
    canManageAllTenants,
    normalizedTenantId,
    reset,
    list,
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

  useEffect(() => {
    setPage(1);
  }, [search, normalizedSearchScope, activeFilters, filterLogic, sortField, sortDirection, pageSize]);

  useEffect(() => {
    setPage((previous) => Math.min(Math.max(previous, 1), totalPages));
  }, [totalPages]);

  useEffect(() => {
    let cancelled = false;
    setIsPreferencesLoaded(false);

    const loadPreferences = async () => {
      const stored = await asyncStorage.getItem(preferenceKey);
      if (cancelled) return;
      if (stored && typeof stored === 'object') {
        const nextOrder = sanitizeColumns(stored.columnOrder, DEFAULT_COLUMN_ORDER);
        const nextVisible = sanitizeColumns(stored.visibleColumns, DEFAULT_VISIBLE_COLUMNS);
        const nextSearchScope = sanitizeSearchScope(stored.searchScope);
        const nextFilterLogic = sanitizeFilterLogic(stored.filterLogic);
        const nextSortField = sanitizeSortField(stored.sortField);
        const nextSortDirection = sanitizeSortDirection(stored.sortDirection);
        const nextPageSize = sanitizePageSize(stored.pageSize);
        const nextDensity = sanitizeDensity(stored.density);
        const nextFilters = sanitizeFilters(stored.filters, getNextFilterId);

        setColumnOrder(nextOrder);
        setVisibleColumns(nextVisible);
        setSearchScope(nextSearchScope);
        setFilterLogic(nextFilterLogic);
        setSortField(nextSortField);
        setSortDirection(nextSortDirection);
        setPageSize(nextPageSize);
        setDensity(nextDensity);
        setFilters(nextFilters);
      }

      setIsPreferencesLoaded(true);
    };

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, [preferenceKey, getNextFilterId]);

  useEffect(() => {
    if (!isPreferencesLoaded) return;
    asyncStorage.setItem(preferenceKey, {
      columnOrder,
      visibleColumns,
      searchScope,
      filterLogic,
      filters,
      sortField,
      sortDirection,
      pageSize,
      density,
    });
  }, [
    isPreferencesLoaded,
    preferenceKey,
    columnOrder,
    visibleColumns,
    searchScope,
    filterLogic,
    filters,
    sortField,
    sortDirection,
    pageSize,
    density,
  ]);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleSearch = useCallback((value) => {
    setSearch(value ?? '');
    setPage(1);
  }, []);

  const handleSearchScopeChange = useCallback((value) => {
    setSearchScope(sanitizeSearchScope(value));
    setPage(1);
  }, []);

  const handleFilterLogicChange = useCallback((value) => {
    setFilterLogic(sanitizeFilterLogic(value));
    setPage(1);
  }, []);

  const handleFilterFieldChange = useCallback((filterId, value) => {
    const nextField = sanitizeFilterField(value);
    setFilters((previous) => previous.map((filter) => {
      if (filter.id !== filterId) return filter;
      return {
        ...filter,
        field: nextField,
        operator: getDefaultOperator(nextField),
      };
    }));
    setPage(1);
  }, []);

  const handleFilterOperatorChange = useCallback((filterId, value) => {
    setFilters((previous) => previous.map((filter) => {
      if (filter.id !== filterId) return filter;
      return {
        ...filter,
        operator: sanitizeFilterOperator(filter.field, value),
      };
    }));
    setPage(1);
  }, []);

  const handleFilterValueChange = useCallback((filterId, value) => {
    setFilters((previous) => previous.map((filter) => {
      if (filter.id !== filterId) return filter;
      return {
        ...filter,
        value: sanitizeFilterValue(value),
      };
    }));
    setPage(1);
  }, []);

  const handleAddFilter = useCallback(() => {
    setFilters((previous) => {
      if (previous.length >= 4) return previous;
      return [...previous, DEFAULT_FILTER(getNextFilterId())];
    });
    setPage(1);
  }, [getNextFilterId]);

  const handleRemoveFilter = useCallback((filterId) => {
    setFilters((previous) => {
      const next = previous.filter((filter) => filter.id !== filterId);
      if (next.length === 0) return [DEFAULT_FILTER(getNextFilterId())];
      return next;
    });
    setPage(1);
  }, [getNextFilterId]);

  const handleClearSearchAndFilters = useCallback(() => {
    setSearch('');
    setSearchScope('all');
    setFilterLogic('AND');
    setFilters([DEFAULT_FILTER(getNextFilterId())]);
    setPage(1);
  }, [getNextFilterId]);

  const handleSort = useCallback((field) => {
    const nextField = sanitizeSortField(field);
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
    setPage(1);
  }, []);

  const handleSetPageSize = useCallback((value) => {
    const nextPageSize = sanitizePageSize(value);
    setPageSize(nextPageSize);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage) => {
    const numericPage = Number(nextPage);
    if (!Number.isFinite(numericPage)) return;
    const clamped = Math.min(Math.max(Math.trunc(numericPage), 1), totalPages);
    setPage(clamped);
  }, [totalPages]);

  const handleDensityChange = useCallback((value) => {
    setDensity(sanitizeDensity(value));
  }, []);

  const handleToggleColumnVisibility = useCallback((column) => {
    if (!TABLE_COLUMNS.includes(column)) return;
    setVisibleColumns((previous) => {
      const nextSet = new Set(previous);
      if (nextSet.has(column)) {
        if (nextSet.size === 1) return [...previous];
        nextSet.delete(column);
      } else {
        nextSet.add(column);
      }
      return sanitizeColumns([...nextSet], DEFAULT_VISIBLE_COLUMNS);
    });
  }, []);

  const handleMoveColumn = useCallback((column, direction) => {
    if (!TABLE_COLUMNS.includes(column)) return;
    setColumnOrder((previous) => {
      const ordered = sanitizeColumns(previous, DEFAULT_COLUMN_ORDER);
      const currentIndex = ordered.indexOf(column);
      if (currentIndex === -1) return ordered;
      const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= ordered.length) return ordered;
      const next = [...ordered];
      const [value] = next.splice(currentIndex, 1);
      next.splice(targetIndex, 0, value);
      return next;
    });
  }, []);

  const handleOpenTableSettings = useCallback(() => {
    setIsTableSettingsOpen(true);
  }, []);

  const handleCloseTableSettings = useCallback(() => {
    setIsTableSettingsOpen(false);
  }, []);

  const handleResetTablePreferences = useCallback(() => {
    setColumnOrder([...DEFAULT_COLUMN_ORDER]);
    setVisibleColumns([...DEFAULT_VISIBLE_COLUMNS]);
    setSortField('name');
    setSortDirection('asc');
    setPageSize(DEFAULT_PAGE_SIZE);
    setDensity(DEFAULT_DENSITY);
    setSearchScope('all');
    setFilterLogic('AND');
    setFilters([DEFAULT_FILTER(getNextFilterId())]);
    setPage(1);
  }, [getNextFilterId]);

  const resolvePermissionById = useCallback((permissionIdValue) => (
    items.find((permission) => permission?.id === permissionIdValue) ?? null
  ), [items]);

  const canAccessPermissionRecord = useCallback((permission) => {
    if (!permission) return false;
    if (canManageAllTenants) return true;

    const permissionTenantId = normalizeValue(permission?.tenant_id);
    if (!permissionTenantId || !normalizedTenantId) return true;
    return permissionTenantId === normalizedTenantId;
  }, [canManageAllTenants, normalizedTenantId]);

  const handleItemPress = useCallback((id) => {
    if (!canManagePermissions) return;
    const permissionId = normalizeValue(id);
    if (!permissionId) return;

    const targetPermission = resolvePermissionById(permissionId);
    if (targetPermission && !canAccessPermissionRecord(targetPermission)) {
      router.push('/settings/permissions?notice=accessDenied');
      return;
    }

    router.push(`/settings/permissions/${permissionId}`);
  }, [canManagePermissions, resolvePermissionById, canAccessPermissionRecord, router]);

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeletePermission) return;
      if (e?.stopPropagation) e.stopPropagation();

      const permissionId = normalizeValue(id);
      if (!permissionId) return;

      const targetPermission = resolvePermissionById(permissionId);
      if (targetPermission && !canAccessPermissionRecord(targetPermission)) {
        router.push('/settings/permissions?notice=accessDenied');
        return;
      }

      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(permissionId);
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
    [
      canDeletePermission,
      resolvePermissionById,
      canAccessPermissionRecord,
      router,
      t,
      remove,
      fetchList,
      isOffline,
    ]
  );

  const handleAdd = useCallback(() => {
    if (!canCreatePermission) return;
    router.push('/settings/permissions/create');
  }, [canCreatePermission, router]);

  const searchScopeOptions = useMemo(() => ([
    { value: 'all', label: t('permission.list.searchScopeAll') },
    { value: 'name', label: t('permission.list.searchScopeName') },
    { value: 'description', label: t('permission.list.searchScopeDescription') },
    { value: 'tenant', label: t('permission.list.searchScopeTenant') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'name', label: t('permission.list.filterFieldName') },
    { value: 'description', label: t('permission.list.filterFieldDescription') },
    { value: 'tenant', label: t('permission.list.filterFieldTenant') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('permission.list.filterLogicAnd') },
    { value: 'OR', label: t('permission.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('permission.list.densityCompact') },
    { value: 'comfortable', label: t('permission.list.densityComfortable') },
  ]), [t]);

  const visibleColumnSet = useMemo(() => new Set(visibleColumns), [visibleColumns]);

  const orderedColumns = useMemo(() => {
    const normalized = sanitizeColumns(columnOrder, DEFAULT_COLUMN_ORDER);
    const missing = TABLE_COLUMNS.filter((column) => !normalized.includes(column));
    return [...normalized, ...missing];
  }, [columnOrder]);

  const visibleOrderedColumns = useMemo(() => {
    const filtered = orderedColumns.filter((column) => visibleColumnSet.has(column));
    if (filtered.length === 0) return ['name'];
    return filtered;
  }, [orderedColumns, visibleColumnSet]);

  const canAddFilter = filters.length < 4;

  const resolveFilterOperatorOptions = useCallback((field) => {
    const normalizedField = sanitizeFilterField(field);
    const operators = FILTER_OPERATORS[normalizedField] || FILTER_OPERATORS.name;
    return operators.map((operator) => ({
      value: operator,
      label: t(`permission.list.filterOperator${operator}`),
    }));
  }, [t]);

  return {
    items,
    pagedItems,
    totalItems,
    totalPages,
    page,
    pageSize,
    pageSizeOptions,
    density,
    densityOptions,
    search,
    searchScope: normalizedSearchScope,
    searchScopeOptions,
    filters: normalizedFilters,
    filterFieldOptions,
    filterLogic,
    filterLogicOptions,
    canAddFilter,
    hasNoResults,
    hasActiveSearchOrFilter,
    sortField,
    sortDirection,
    columnOrder: orderedColumns,
    visibleColumns: visibleOrderedColumns,
    isTableSettingsOpen,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onSearch: handleSearch,
    onSearchScopeChange: handleSearchScopeChange,
    onFilterLogicChange: handleFilterLogicChange,
    onFilterFieldChange: handleFilterFieldChange,
    onFilterOperatorChange: handleFilterOperatorChange,
    onFilterValueChange: handleFilterValueChange,
    onAddFilter: handleAddFilter,
    onRemoveFilter: handleRemoveFilter,
    onClearSearchAndFilters: handleClearSearchAndFilters,
    onSort: handleSort,
    onPageChange: handlePageChange,
    onPageSizeChange: handleSetPageSize,
    onDensityChange: handleDensityChange,
    onToggleColumnVisibility: handleToggleColumnVisibility,
    onMoveColumnLeft: (column) => handleMoveColumn(column, 'left'),
    onMoveColumnRight: (column) => handleMoveColumn(column, 'right'),
    onOpenTableSettings: handleOpenTableSettings,
    onCloseTableSettings: handleCloseTableSettings,
    onResetTablePreferences: handleResetTablePreferences,
    resolveFilterOperatorOptions,
    onItemPress: handleItemPress,
    onDelete: canDeletePermission ? handleDelete : undefined,
    onAdd: canCreatePermission ? handleAdd : undefined,
  };
};

export default usePermissionListScreen;
