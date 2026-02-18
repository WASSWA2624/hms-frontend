/**
 * useTenantListScreen Hook
 * Shared logic for TenantListScreen across platforms.
 * File: useTenantListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth, useI18n, useNetwork, useTenant, useTenantAccess } from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction } from '@utils';

const TABLE_MODE_BREAKPOINT = 768;
const PREFS_STORAGE_PREFIX = 'hms.settings.tenants.list.preferences';
const TENANT_CACHE_STORAGE_PREFIX = 'hms.settings.tenants.list.cache';
const TABLE_COLUMNS = Object.freeze(['name', 'slug', 'humanId', 'status']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'name', 'slug', 'humanId', 'status']);
const FILTER_FIELDS = Object.freeze(['name', 'slug', 'humanId', 'status']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  name: ['contains', 'equals', 'startsWith'],
  slug: ['contains', 'equals', 'startsWith'],
  humanId: ['contains', 'equals', 'startsWith'],
  status: ['is'],
});

const DEFAULT_FILTER = (id = 'tenant-filter-1') => ({
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
    created: 'tenant.list.noticeCreated',
    updated: 'tenant.list.noticeUpdated',
    deleted: 'tenant.list.noticeDeleted',
    queued: 'tenant.list.noticeQueued',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const resolveTenantName = (tenant) => normalizeValue(tenant?.name);
const resolveTenantSlug = (tenant) => normalizeValue(tenant?.slug);
const resolveTenantHumanId = (tenant) => normalizeValue(
  tenant?.human_friendly_id ?? tenant?.humanFriendlyId
);
const resolveTenantStatus = (tenant) => (tenant?.is_active ? 'active' : 'inactive');

const resolveTenantFieldValue = (tenant, field) => {
  if (field === 'name') return resolveTenantName(tenant);
  if (field === 'slug') return resolveTenantSlug(tenant);
  if (field === 'humanId') return resolveTenantHumanId(tenant);
  if (field === 'status') return resolveTenantStatus(tenant);
  return '';
};

const matchesTextOperator = (fieldValue, operator, normalizedNeedle) => {
  const normalizedValue = normalizeLower(fieldValue);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesStatusOperator = (fieldValue, operator, normalizedNeedle) => {
  if (!normalizedNeedle) return true;
  if (operator !== 'is') return true;
  if (normalizedNeedle === 'active' || normalizedNeedle === 'true' || normalizedNeedle === '1') {
    return fieldValue === 'active';
  }
  if (
    normalizedNeedle === 'inactive'
    || normalizedNeedle === 'false'
    || normalizedNeedle === '0'
  ) {
    return fieldValue === 'inactive';
  }
  return fieldValue === normalizedNeedle;
};

const matchesTenantSearch = (tenant, query, scope) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(resolveTenantFieldValue(tenant, field))
      .includes(normalizedQuery));
  }
  const field = sanitizeFilterField(scope);
  return normalizeLower(resolveTenantFieldValue(tenant, field)).includes(normalizedQuery);
};

const matchesTenantFilter = (tenant, filter) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolveTenantFieldValue(tenant, field);
  const normalizedNeedle = normalizeLower(value);

  if (field === 'status') {
    return matchesStatusOperator(fieldValue, operator, normalizedNeedle);
  }

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

const compareByField = (leftTenant, rightTenant, field, direction) => {
  const normalizedField = sanitizeSortField(field);
  const leftValue = resolveTenantFieldValue(leftTenant, normalizedField);
  const rightValue = resolveTenantFieldValue(rightTenant, normalizedField);

  let result = 0;
  if (normalizedField === 'status') {
    const leftRank = leftValue === 'active' ? 1 : 0;
    const rightRank = rightValue === 'active' ? 1 : 0;
    result = leftRank - rightRank;
  } else {
    result = compareText(leftValue, rightValue);
  }

  return direction === 'desc' ? result * -1 : result;
};

const useTenantListScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { user } = useAuth();
  const { notice } = useLocalSearchParams();
  const { width } = useWindowDimensions();
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

  const filterCounterRef = useRef(1);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([DEFAULT_FILTER('tenant-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [selectedTenantIds, setSelectedTenantIds] = useState([]);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const [cachedTenantItems, setCachedTenantItems] = useState([]);
  const preferenceSubject = useMemo(() => (
    normalizeValue(user?.id)
    || normalizeValue(user?.user_id)
    || normalizeValue(user?.email)
    || normalizeValue(tenantId)
    || 'anonymous'
  ), [user, tenantId]);
  const preferenceKey = useMemo(
    () => `${PREFS_STORAGE_PREFIX}.${preferenceSubject}`,
    [preferenceSubject]
  );
  const tenantDataCacheKey = useMemo(() => {
    const scope = canManageAllTenants
      ? 'all'
      : (normalizeValue(tenantId) || 'self');
    return `${TENANT_CACHE_STORAGE_PREFIX}.${preferenceSubject}.${scope}`;
  }, [canManageAllTenants, tenantId, preferenceSubject]);
  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;

  const getNextFilterId = useCallback(() => {
    filterCounterRef.current += 1;
    return `tenant-filter-${filterCounterRef.current}`;
  }, []);

  const liveItems = useMemo(() => {
    if (canManageAllTenants) {
      return Array.isArray(data) ? data : (data?.items ?? []);
    }
    const ownTenant = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
    return ownTenant ? [ownTenant] : [];
  }, [canManageAllTenants, data]);

  const hasLiveTenantPayload = useMemo(() => {
    if (canManageAllTenants) {
      return Array.isArray(data) || Array.isArray(data?.items);
    }
    return Boolean(data && typeof data === 'object' && !Array.isArray(data));
  }, [canManageAllTenants, data]);

  const baseItems = useMemo(() => {
    if (liveItems.length > 0) return liveItems;
    if (isOffline && cachedTenantItems.length > 0) return cachedTenantItems;
    return liveItems;
  }, [liveItems, isOffline, cachedTenantItems]);

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
    return baseItems.filter((tenant) => {
      if (hasSearch && !matchesTenantSearch(tenant, normalizedSearch, normalizedSearchScope)) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesTenantFilter(tenant, filter));
      if (filterLogic === 'OR') {
        return matches.some(Boolean);
      }
      return matches.every(Boolean);
    });
  }, [baseItems, search, normalizedSearchScope, activeFilters, filterLogic]);

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

  const currentPageTenantIds = useMemo(
    () => pagedItems.map((tenant) => tenant?.id).filter(Boolean),
    [pagedItems]
  );

  const selectedOnPageCount = useMemo(
    () => currentPageTenantIds.filter((id) => selectedTenantIds.includes(id)).length,
    [currentPageTenantIds, selectedTenantIds]
  );

  const allPageSelected = currentPageTenantIds.length > 0
    && selectedOnPageCount === currentPageTenantIds.length;

  const hasActiveSearchOrFilter = normalizeValue(search).length > 0 || activeFilters.length > 0;
  const hasNoResults = hasActiveSearchOrFilter && items.length === 0 && baseItems.length > 0;

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
    if (isOffline) return;
    fetchOwnTenant();
  }, [
    isResolved,
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId,
    isOffline,
    fetchOwnTenant,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canAccessTenantSettings || !canManageAllTenants || isOffline) return;
    fetchList();
  }, [isResolved, canAccessTenantSettings, canManageAllTenants, isOffline, fetchList]);

  useEffect(() => {
    let cancelled = false;

    const loadCachedTenantItems = async () => {
      const stored = await asyncStorage.getItem(tenantDataCacheKey);
      if (cancelled) return;

      if (Array.isArray(stored)) {
        setCachedTenantItems(stored);
        return;
      }

      if (Array.isArray(stored?.items)) {
        setCachedTenantItems(stored.items);
        return;
      }

      setCachedTenantItems([]);
    };

    loadCachedTenantItems();

    return () => {
      cancelled = true;
    };
  }, [tenantDataCacheKey]);

  useEffect(() => {
    if (!isResolved || !canAccessTenantSettings || !hasLiveTenantPayload) return;
    setCachedTenantItems(liveItems);
    asyncStorage.setItem(tenantDataCacheKey, liveItems);
  }, [
    isResolved,
    canAccessTenantSettings,
    hasLiveTenantPayload,
    tenantDataCacheKey,
    liveItems,
  ]);

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
      const nextOperator = getDefaultOperator(nextField);
      return {
        ...filter,
        field: nextField,
        operator: nextOperator,
        value: nextField === 'status' ? sanitizeFilterValue(filter.value || 'active') : filter.value,
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

  const handleToggleTenantSelection = useCallback((tenantIdValue) => {
    const normalizedId = normalizeValue(tenantIdValue);
    if (!normalizedId) return;
    setSelectedTenantIds((previous) => {
      if (previous.includes(normalizedId)) {
        return previous.filter((value) => value !== normalizedId);
      }
      return [...previous, normalizedId];
    });
  }, []);

  const handleTogglePageSelection = useCallback((checked) => {
    setSelectedTenantIds((previous) => {
      if (!checked) {
        const pageIdSet = new Set(currentPageTenantIds);
        return previous.filter((value) => !pageIdSet.has(value));
      }
      const merged = new Set([...previous, ...currentPageTenantIds]);
      return [...merged];
    });
  }, [currentPageTenantIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedTenantIds([]);
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
    setSelectedTenantIds([]);
  }, [getNextFilterId]);

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
        setSelectedTenantIds((previous) => previous.filter((value) => value !== id));
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

  const handleBulkDelete = useCallback(async () => {
    if (!canDeleteTenant || selectedTenantIds.length === 0) return;
    if (!confirmAction(t('tenant.list.bulkDeleteConfirm', { count: selectedTenantIds.length }))) {
      return;
    }

    let removedCount = 0;
    for (const tenantIdValue of selectedTenantIds) {
      try {
        const result = await remove(tenantIdValue);
        if (result) removedCount += 1;
      } catch {
        /* per-row errors are already normalized in hook */
      }
    }

    if (removedCount > 0) {
      fetchList();
      const noticeKey = isOffline ? 'queued' : 'deleted';
      const message = resolveNoticeMessage(t, noticeKey);
      if (message) setNoticeMessage(message);
    }

    setSelectedTenantIds([]);
  }, [canDeleteTenant, selectedTenantIds, t, remove, fetchList, isOffline]);

  useEffect(() => {
    setPage(1);
  }, [search, normalizedSearchScope, activeFilters, filterLogic, sortField, sortDirection, pageSize]);

  useEffect(() => {
    setPage((previous) => Math.min(Math.max(previous, 1), totalPages));
  }, [totalPages]);

  useEffect(() => {
    const availableIds = new Set(items.map((tenant) => tenant?.id).filter(Boolean));
    setSelectedTenantIds((previous) => previous.filter((value) => availableIds.has(value)));
  }, [items]);

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

  const searchScopeOptions = useMemo(() => ([
    { value: 'all', label: t('tenant.list.searchScopeAll') },
    { value: 'name', label: t('tenant.list.searchScopeName') },
    { value: 'slug', label: t('tenant.list.searchScopeSlug') },
    { value: 'humanId', label: t('tenant.list.searchScopeHumanId') },
    { value: 'status', label: t('tenant.list.searchScopeStatus') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'name', label: t('tenant.list.filterFieldName') },
    { value: 'slug', label: t('tenant.list.filterFieldSlug') },
    { value: 'humanId', label: t('tenant.list.filterFieldHumanId') },
    { value: 'status', label: t('tenant.list.filterFieldStatus') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('tenant.list.filterLogicAnd') },
    { value: 'OR', label: t('tenant.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('tenant.list.densityCompact') },
    { value: 'comfortable', label: t('tenant.list.densityComfortable') },
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
      label: t(`tenant.list.filterOperator${operator}`),
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
    allColumns: TABLE_COLUMNS,
    selectedTenantIds,
    selectedOnPageCount,
    allPageSelected,
    isTableMode,
    isTableSettingsOpen,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: handleDismissNotice,
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
    onToggleTenantSelection: handleToggleTenantSelection,
    onTogglePageSelection: handleTogglePageSelection,
    onClearSelection: handleClearSelection,
    onBulkDelete: canDeleteTenant ? handleBulkDelete : undefined,
    resolveFilterOperatorOptions,
    onTenantPress: handleTenantPress,
    onAdd: canCreateTenant ? handleAdd : undefined,
    onEdit: canEditTenant ? handleEdit : undefined,
    onDelete: canDeleteTenant ? handleDelete : undefined,
  };
};

export default useTenantListScreen;
