/**
 * useRoleListScreen Hook
 * Shared logic for RoleListScreen across platforms.
 * File: useRoleListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth, useI18n, useNetwork, useRole, useTenantAccess } from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeIdentifier } from '@utils';

const TABLE_MODE_BREAKPOINT = 768;
const PREFS_STORAGE_PREFIX = 'hms.settings.roles.list.preferences';
const TABLE_COLUMNS = Object.freeze(['name', 'description', 'tenant', 'facility']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const MAX_FETCH_LIMIT = 100;
const DEFAULT_FETCH_PAGE = 1;
const DEFAULT_FETCH_LIMIT = 100;
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'name', 'description', 'tenant', 'facility']);
const FILTER_FIELDS = Object.freeze(['name', 'description', 'tenant', 'facility']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  name: ['contains', 'equals', 'startsWith'],
  description: ['contains', 'equals', 'startsWith'],
  tenant: ['contains', 'equals', 'startsWith'],
  facility: ['contains', 'equals', 'startsWith'],
});

const DEFAULT_FILTER = (id = 'role-filter-1') => ({
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

const normalizeFetchPage = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_FETCH_PAGE;
  return Math.max(DEFAULT_FETCH_PAGE, Math.trunc(numeric));
};

const normalizeFetchLimit = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_FETCH_LIMIT;
  return Math.min(MAX_FETCH_LIMIT, Math.max(1, Math.trunc(numeric)));
};

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

const resolveReadableValue = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = humanizeIdentifier(candidate);
    if (normalized) return normalizeValue(normalized);
  }
  return '';
};

const resolveRoleName = (roleItem, t) => (
  resolveReadableValue(roleItem?.name) || t('role.list.unnamedRole')
);

const resolveRoleDescription = (roleItem, t) => (
  resolveReadableValue(roleItem?.description) || t('common.notAvailable')
);

const resolveRoleTenant = (roleItem, t, canViewTechnicalIds = false) => {
  const readable = resolveReadableValue(
    roleItem?.tenant_name,
    roleItem?.tenant?.name,
    roleItem?.tenant_label
  );
  if (readable) return readable;

  const tenantId = normalizeValue(roleItem?.tenant_id);
  if (!tenantId) return t('common.notAvailable');
  if (canViewTechnicalIds) return tenantId;
  return t('role.list.currentTenantLabel');
};

const resolveRoleFacility = (roleItem, t, canViewTechnicalIds = false) => {
  const readable = resolveReadableValue(
    roleItem?.facility_name,
    roleItem?.facility?.name,
    roleItem?.facility_label
  );
  if (readable) return readable;

  const facilityId = normalizeValue(roleItem?.facility_id);
  if (!facilityId) return t('common.notAvailable');
  if (canViewTechnicalIds) return facilityId;
  return t('role.list.currentFacilityLabel');
};

const resolveRoleFieldValue = (roleItem, field, t, canViewTechnicalIds) => {
  if (field === 'name') return resolveRoleName(roleItem, t);
  if (field === 'description') return resolveRoleDescription(roleItem, t);
  if (field === 'tenant') return resolveRoleTenant(roleItem, t, canViewTechnicalIds);
  if (field === 'facility') return resolveRoleFacility(roleItem, t, canViewTechnicalIds);
  return '';
};

const matchesTextOperator = (fieldValue, operator, normalizedNeedle) => {
  const normalizedValue = normalizeLower(fieldValue);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesRoleSearch = (roleItem, query, scope, t, canViewTechnicalIds) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(
      resolveRoleFieldValue(roleItem, field, t, canViewTechnicalIds)
    ).includes(normalizedQuery));
  }

  const field = sanitizeFilterField(scope);
  return normalizeLower(
    resolveRoleFieldValue(roleItem, field, t, canViewTechnicalIds)
  ).includes(normalizedQuery);
};

const matchesRoleFilter = (roleItem, filter, t, canViewTechnicalIds) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolveRoleFieldValue(roleItem, field, t, canViewTechnicalIds);
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

const compareByField = (leftRole, rightRole, field, direction, t, canViewTechnicalIds) => {
  const normalizedField = sanitizeSortField(field);
  const leftValue = resolveRoleFieldValue(leftRole, normalizedField, t, canViewTechnicalIds);
  const rightValue = resolveRoleFieldValue(rightRole, normalizedField, t, canViewTechnicalIds);
  const result = compareText(leftValue, rightValue);
  return direction === 'desc' ? result * -1 : result;
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
  const { user } = useAuth();
  const router = useRouter();
  const { notice } = useLocalSearchParams();
  const { width } = useWindowDimensions();
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

  const filterCounterRef = useRef(1);
  const isPreferencesLoadedRef = useRef(false);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([DEFAULT_FILTER('role-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const canManageRoles = canAccessTenantSettings;
  const canCreateRole = canManageRoles;
  const canEditRole = canManageRoles;
  const canDeleteRole = canManageRoles;
  const canViewTechnicalIds = canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);
  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;

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
    return `role-filter-${filterCounterRef.current}`;
  }, []);

  const rawItems = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );

  const scopedItems = useMemo(() => {
    if (canManageAllTenants) return rawItems;
    if (!normalizedTenantId) return [];
    return rawItems.filter((roleItem) => normalizeValue(roleItem?.tenant_id) === normalizedTenantId);
  }, [canManageAllTenants, normalizedTenantId, rawItems]);

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
    return scopedItems.filter((roleItem) => {
      if (hasSearch && !matchesRoleSearch(
        roleItem,
        normalizedSearch,
        normalizedSearchScope,
        t,
        canViewTechnicalIds
      )) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesRoleFilter(
        roleItem,
        filter,
        t,
        canViewTechnicalIds
      ));
      if (filterLogic === 'OR') {
        return matches.some(Boolean);
      }
      return matches.every(Boolean);
    });
  }, [
    scopedItems,
    search,
    normalizedSearchScope,
    activeFilters,
    filterLogic,
    t,
    canViewTechnicalIds,
  ]);

  const sortedItems = useMemo(() => stableSort(
    filteredItems,
    (left, right) => compareByField(left, right, sortField, sortDirection, t, canViewTechnicalIds)
  ), [filteredItems, sortField, sortDirection, t, canViewTechnicalIds]);

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
  const hasNoResults = hasActiveSearchOrFilter && items.length === 0 && scopedItems.length > 0;

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'role.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageRoles || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = {
      page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
      limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
    };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    reset();
    list(params);
  }, [
    isResolved,
    canManageRoles,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageRoles) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
      return;
    }
    fetchList();
  }, [
    isResolved,
    canManageRoles,
    canManageAllTenants,
    normalizedTenantId,
    fetchList,
    router,
  ]);

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

  useEffect(() => {
    setPage(1);
  }, [search, normalizedSearchScope, activeFilters, filterLogic, sortField, sortDirection, pageSize]);

  useEffect(() => {
    setPage((previous) => Math.min(Math.max(previous, 1), totalPages));
  }, [totalPages]);

  useEffect(() => {
    let cancelled = false;
    isPreferencesLoadedRef.current = false;

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
      isPreferencesLoadedRef.current = true;
    };

    loadPreferences();

    return () => {
      cancelled = true;
      isPreferencesLoadedRef.current = false;
    };
  }, [preferenceKey, getNextFilterId]);

  useEffect(() => {
    if (!isPreferencesLoadedRef.current) return;
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

  const handleDismissNotice = useCallback(() => {
    setNoticeMessage(null);
  }, []);

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

  const resolveRoleById = useCallback((roleIdValue) => (
    items.find((roleItem) => normalizeValue(roleItem?.id) === roleIdValue) ?? null
  ), [items]);

  const canAccessRoleRecord = useCallback((roleItem) => {
    if (!roleItem) return false;
    if (canManageAllTenants) return true;

    const roleTenantId = normalizeValue(roleItem?.tenant_id);
    if (!roleTenantId || !normalizedTenantId) return false;
    return roleTenantId === normalizedTenantId;
  }, [canManageAllTenants, normalizedTenantId]);

  const handleItemPress = useCallback((id) => {
    if (!canManageRoles) return;
    const roleId = normalizeValue(id);
    if (!roleId) return;

    const targetRole = resolveRoleById(roleId);
    if (!canManageAllTenants && (!targetRole || !canAccessRoleRecord(targetRole))) {
      router.push('/settings/roles?notice=accessDenied');
      return;
    }

    router.push(`/settings/roles/${roleId}`);
  }, [
    canManageRoles,
    canManageAllTenants,
    resolveRoleById,
    canAccessRoleRecord,
    router,
  ]);

  const handleEdit = useCallback((id, e) => {
    if (!canEditRole) return;
    if (e?.stopPropagation) e.stopPropagation();

    const roleId = normalizeValue(id);
    if (!roleId) return;

    const targetRole = resolveRoleById(roleId);
    if (!canManageAllTenants && (!targetRole || !canAccessRoleRecord(targetRole))) {
      router.push('/settings/roles?notice=accessDenied');
      return;
    }

    router.push(`/settings/roles/${roleId}/edit`);
  }, [
    canEditRole,
    canManageAllTenants,
    resolveRoleById,
    canAccessRoleRecord,
    router,
  ]);

  const handleDelete = useCallback(async (id, e) => {
    if (!canDeleteRole) return;
    if (e?.stopPropagation) e.stopPropagation();

    const roleId = normalizeValue(id);
    if (!roleId) return;

    const targetRole = resolveRoleById(roleId);
    if (!canManageAllTenants && (!targetRole || !canAccessRoleRecord(targetRole))) {
      router.push('/settings/roles?notice=accessDenied');
      return;
    }

    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(roleId);
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
  }, [
    canDeleteRole,
    canManageAllTenants,
    resolveRoleById,
    canAccessRoleRecord,
    router,
    t,
    remove,
    fetchList,
    isOffline,
  ]);

  const handleAdd = useCallback(() => {
    if (!canCreateRole) return;
    router.push('/settings/roles/create');
  }, [canCreateRole, router]);

  const searchScopeOptions = useMemo(() => ([
    { value: 'all', label: t('role.list.searchScopeAll') },
    { value: 'name', label: t('role.list.searchScopeName') },
    { value: 'description', label: t('role.list.searchScopeDescription') },
    { value: 'tenant', label: t('role.list.searchScopeTenant') },
    { value: 'facility', label: t('role.list.searchScopeFacility') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'name', label: t('role.list.filterFieldName') },
    { value: 'description', label: t('role.list.filterFieldDescription') },
    { value: 'tenant', label: t('role.list.filterFieldTenant') },
    { value: 'facility', label: t('role.list.filterFieldFacility') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('role.list.filterLogicAnd') },
    { value: 'OR', label: t('role.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('role.list.densityCompact') },
    { value: 'comfortable', label: t('role.list.densityComfortable') },
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
      label: t(`role.list.filterOperator${operator}`),
    }));
  }, [t]);

  const resolveRoleNameDisplay = useCallback(
    (roleItem) => resolveRoleName(roleItem, t),
    [t]
  );
  const resolveRoleDescriptionDisplay = useCallback(
    (roleItem) => resolveRoleDescription(roleItem, t),
    [t]
  );
  const resolveRoleTenantDisplay = useCallback(
    (roleItem) => resolveRoleTenant(roleItem, t, canViewTechnicalIds),
    [t, canViewTechnicalIds]
  );
  const resolveRoleFacilityDisplay = useCallback(
    (roleItem) => resolveRoleFacility(roleItem, t, canViewTechnicalIds),
    [t, canViewTechnicalIds]
  );

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
    isTableMode,
    isTableSettingsOpen,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    noticeMessage,
    resolveRoleName: resolveRoleNameDisplay,
    resolveRoleDescription: resolveRoleDescriptionDisplay,
    resolveRoleTenant: resolveRoleTenantDisplay,
    resolveRoleFacility: resolveRoleFacilityDisplay,
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
    resolveFilterOperatorOptions,
    onItemPress: handleItemPress,
    onAdd: canCreateRole ? handleAdd : undefined,
    onEdit: canEditRole ? handleEdit : undefined,
    onDelete: canDeleteRole ? handleDelete : undefined,
  };
};

export default useRoleListScreen;
