/**
 * useDepartmentListScreen Hook
 * Shared logic for DepartmentListScreen across platforms.
 * File: useDepartmentListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth, useI18n, useNetwork, useDepartment, useTenantAccess } from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeIdentifier } from '@utils';

const TABLE_MODE_BREAKPOINT = 768;
const PREFS_STORAGE_PREFIX = 'hms.settings.departments.list.preferences';
const DEPARTMENT_CACHE_STORAGE_PREFIX = 'hms.settings.departments.list.cache';
const TABLE_COLUMNS = Object.freeze(['name', 'shortName', 'type', 'status']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const MAX_FETCH_LIMIT = 100;
const DEFAULT_FETCH_PAGE = 1;
const DEFAULT_FETCH_LIMIT = 100;
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'name', 'shortName', 'type', 'status']);
const FILTER_FIELDS = Object.freeze(['name', 'shortName', 'type', 'status']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  name: ['contains', 'equals', 'startsWith'],
  shortName: ['contains', 'equals', 'startsWith'],
  type: ['contains', 'equals', 'startsWith'],
  status: ['is'],
});

const DEFAULT_FILTER = (id = 'department-filter-1') => ({
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
    created: 'department.list.noticeCreated',
    updated: 'department.list.noticeUpdated',
    deleted: 'department.list.noticeDeleted',
    queued: 'department.list.noticeQueued',
    accessDenied: 'department.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const resolveDepartmentName = (department) => normalizeValue(humanizeIdentifier(department?.name));
const resolveDepartmentShortName = (department) => normalizeValue(department?.short_name);
const resolveDepartmentType = (department) => normalizeValue(department?.department_type);
const resolveDepartmentStatus = (department) => (department?.is_active ? 'active' : 'inactive');

const resolveDepartmentFieldValue = (department, field) => {
  if (field === 'name') return resolveDepartmentName(department);
  if (field === 'shortName') return resolveDepartmentShortName(department);
  if (field === 'type') return resolveDepartmentType(department);
  if (field === 'status') return resolveDepartmentStatus(department);
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

const matchesDepartmentSearch = (department, query, scope) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(resolveDepartmentFieldValue(department, field))
      .includes(normalizedQuery));
  }
  const field = sanitizeFilterField(scope);
  return normalizeLower(resolveDepartmentFieldValue(department, field)).includes(normalizedQuery);
};

const matchesDepartmentFilter = (department, filter) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolveDepartmentFieldValue(department, field);
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

const compareByField = (leftDepartment, rightDepartment, field, direction) => {
  const normalizedField = sanitizeSortField(field);
  const leftValue = resolveDepartmentFieldValue(leftDepartment, normalizedField);
  const rightValue = resolveDepartmentFieldValue(rightDepartment, normalizedField);

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

const useDepartmentListScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { user } = useAuth();
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
  } = useDepartment();

  const filterCounterRef = useRef(1);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([DEFAULT_FILTER('department-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState([]);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const [cachedDepartmentItems, setCachedDepartmentItems] = useState([]);
  const canManageDepartments = canAccessTenantSettings;
  const canCreateDepartment = canManageDepartments;
  const canEditDepartment = canManageDepartments;
  const canDeleteDepartment = canManageDepartments;
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
  const departmentDataCacheKey = useMemo(() => {
    const scope = canManageAllTenants
      ? 'all'
      : (normalizedTenantId || 'self');
    return `${DEPARTMENT_CACHE_STORAGE_PREFIX}.${preferenceSubject}.${scope}`;
  }, [canManageAllTenants, normalizedTenantId, preferenceSubject]);
  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;

  const getNextFilterId = useCallback(() => {
    filterCounterRef.current += 1;
    return `department-filter-${filterCounterRef.current}`;
  }, []);

  const liveItems = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );

  const hasLiveDepartmentPayload = useMemo(
    () => Array.isArray(data) || Array.isArray(data?.items),
    [data]
  );

  const baseItems = useMemo(() => {
    if (liveItems.length > 0) return liveItems;
    if (isOffline && cachedDepartmentItems.length > 0) return cachedDepartmentItems;
    return liveItems;
  }, [liveItems, isOffline, cachedDepartmentItems]);

  const scopedItems = useMemo(() => {
    if (canManageAllTenants) return baseItems;
    if (!normalizedTenantId) return [];
    return baseItems.filter((department) => normalizeValue(department?.tenant_id) === normalizedTenantId);
  }, [canManageAllTenants, normalizedTenantId, baseItems]);

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
    return scopedItems.filter((department) => {
      if (hasSearch && !matchesDepartmentSearch(department, normalizedSearch, normalizedSearchScope)) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesDepartmentFilter(department, filter));
      if (filterLogic === 'OR') {
        return matches.some(Boolean);
      }
      return matches.every(Boolean);
    });
  }, [scopedItems, search, normalizedSearchScope, activeFilters, filterLogic]);

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

  const currentPageDepartmentIds = useMemo(
    () => pagedItems.map((department) => department?.id).filter(Boolean),
    [pagedItems]
  );

  const selectedOnPageCount = useMemo(
    () => currentPageDepartmentIds.filter((id) => selectedDepartmentIds.includes(id)).length,
    [currentPageDepartmentIds, selectedDepartmentIds]
  );

  const allPageSelected = currentPageDepartmentIds.length > 0
    && selectedOnPageCount === currentPageDepartmentIds.length;

  const hasActiveSearchOrFilter = normalizeValue(search).length > 0 || activeFilters.length > 0;
  const hasNoResults = hasActiveSearchOrFilter && items.length === 0 && scopedItems.length > 0;

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'department.list.loadError'),
    [t, errorCode]
  );

  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageDepartments || isOffline) return;
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
    canManageDepartments,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageDepartments) {
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
    canManageDepartments,
    canManageAllTenants,
    normalizedTenantId,
    fetchList,
    router,
  ]);

  useEffect(() => {
    let cancelled = false;

    const loadCachedDepartmentItems = async () => {
      const stored = await asyncStorage.getItem(departmentDataCacheKey);
      if (cancelled) return;

      if (Array.isArray(stored)) {
        setCachedDepartmentItems(stored);
        return;
      }

      if (Array.isArray(stored?.items)) {
        setCachedDepartmentItems(stored.items);
        return;
      }

      setCachedDepartmentItems([]);
    };

    loadCachedDepartmentItems();

    return () => {
      cancelled = true;
    };
  }, [departmentDataCacheKey]);

  useEffect(() => {
    if (!isResolved || !canManageDepartments || !hasLiveDepartmentPayload) return;
    setCachedDepartmentItems(liveItems);
    asyncStorage.setItem(departmentDataCacheKey, liveItems);
  }, [
    isResolved,
    canManageDepartments,
    hasLiveDepartmentPayload,
    departmentDataCacheKey,
    liveItems,
  ]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/departments');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageDepartments) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageDepartments, errorCode, t]);

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

  const handleToggleDepartmentSelection = useCallback((departmentIdValue) => {
    const normalizedId = normalizeValue(departmentIdValue);
    if (!normalizedId) return;
    setSelectedDepartmentIds((previous) => {
      if (previous.includes(normalizedId)) {
        return previous.filter((value) => value !== normalizedId);
      }
      return [...previous, normalizedId];
    });
  }, []);

  const handleTogglePageSelection = useCallback((checked) => {
    setSelectedDepartmentIds((previous) => {
      if (!checked) {
        const pageIdSet = new Set(currentPageDepartmentIds);
        return previous.filter((value) => !pageIdSet.has(value));
      }
      const merged = new Set([...previous, ...currentPageDepartmentIds]);
      return [...merged];
    });
  }, [currentPageDepartmentIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedDepartmentIds([]);
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
    setSelectedDepartmentIds([]);
  }, [getNextFilterId]);

  const resolveDepartmentById = useCallback((departmentIdValue) => (
    items.find((department) => department?.id === departmentIdValue) ?? null
  ), [items]);

  const canAccessDepartmentRecord = useCallback((department) => {
    if (!department) return false;
    if (canManageAllTenants) return true;

    const departmentTenantId = normalizeValue(department?.tenant_id);
    if (!departmentTenantId || !normalizedTenantId) return false;
    return departmentTenantId === normalizedTenantId;
  }, [canManageAllTenants, normalizedTenantId]);

  const handleDepartmentPress = useCallback(
    (departmentIdValue) => {
      const normalizedId = normalizeValue(departmentIdValue);
      if (!normalizedId) return;

      const targetDepartment = resolveDepartmentById(normalizedId);
      if (!canManageAllTenants && (!targetDepartment || !canAccessDepartmentRecord(targetDepartment))) {
        router.push('/settings/departments?notice=accessDenied');
        return;
      }

      router.push(`/settings/departments/${normalizedId}`);
    },
    [canManageAllTenants, resolveDepartmentById, canAccessDepartmentRecord, router]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/departments/create');
  }, [router]);

  const handleEdit = useCallback(
    (departmentIdValue, e) => {
      if (!canEditDepartment) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(departmentIdValue);
      if (!normalizedId) return;

      const targetDepartment = resolveDepartmentById(normalizedId);
      if (!canManageAllTenants && (!targetDepartment || !canAccessDepartmentRecord(targetDepartment))) {
        router.push('/settings/departments?notice=accessDenied');
        return;
      }

      router.push(`/settings/departments/${normalizedId}/edit`);
    },
    [canEditDepartment, canManageAllTenants, resolveDepartmentById, canAccessDepartmentRecord, router]
  );

  const handleDelete = useCallback(
    async (departmentIdValue, e) => {
      if (!canDeleteDepartment) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(departmentIdValue);
      if (!normalizedId) return;

      const targetDepartment = resolveDepartmentById(normalizedId);
      if (!canManageAllTenants && (!targetDepartment || !canAccessDepartmentRecord(targetDepartment))) {
        router.push('/settings/departments?notice=accessDenied');
        return;
      }

      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(normalizedId);
        if (!result) return;
        fetchList();
        setSelectedDepartmentIds((previous) => previous.filter((value) => value !== normalizedId));
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
      canDeleteDepartment,
      canManageAllTenants,
      resolveDepartmentById,
      canAccessDepartmentRecord,
      router,
      t,
      remove,
      fetchList,
      isOffline,
    ]
  );

  const handleBulkDelete = useCallback(async () => {
    if (!canDeleteDepartment || selectedDepartmentIds.length === 0) return;
    if (!confirmAction(t('department.list.bulkDeleteConfirm', { count: selectedDepartmentIds.length }))) {
      return;
    }

    let removedCount = 0;
    for (const departmentIdValue of selectedDepartmentIds) {
      const targetDepartment = resolveDepartmentById(departmentIdValue);
      if (!canManageAllTenants && (!targetDepartment || !canAccessDepartmentRecord(targetDepartment))) {
        continue;
      }

      try {
        const result = await remove(departmentIdValue);
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

    setSelectedDepartmentIds([]);
  }, [
    canDeleteDepartment,
    canManageAllTenants,
    selectedDepartmentIds,
    t,
    resolveDepartmentById,
    canAccessDepartmentRecord,
    remove,
    fetchList,
    isOffline,
  ]);

  useEffect(() => {
    setPage(1);
  }, [search, normalizedSearchScope, activeFilters, filterLogic, sortField, sortDirection, pageSize]);

  useEffect(() => {
    setPage((previous) => Math.min(Math.max(previous, 1), totalPages));
  }, [totalPages]);

  useEffect(() => {
    const availableIds = new Set(items.map((department) => department?.id).filter(Boolean));
    setSelectedDepartmentIds((previous) => previous.filter((value) => availableIds.has(value)));
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
    { value: 'all', label: t('department.list.searchScopeAll') },
    { value: 'name', label: t('department.list.searchScopeName') },
    { value: 'shortName', label: t('department.list.searchScopeShortName') },
    { value: 'type', label: t('department.list.searchScopeType') },
    { value: 'status', label: t('department.list.searchScopeStatus') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'name', label: t('department.list.filterFieldName') },
    { value: 'shortName', label: t('department.list.filterFieldShortName') },
    { value: 'type', label: t('department.list.filterFieldType') },
    { value: 'status', label: t('department.list.filterFieldStatus') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('department.list.filterLogicAnd') },
    { value: 'OR', label: t('department.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('department.list.densityCompact') },
    { value: 'comfortable', label: t('department.list.densityComfortable') },
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
      label: t(`department.list.filterOperator${operator}`),
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
    selectedDepartmentIds,
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
    onToggleDepartmentSelection: handleToggleDepartmentSelection,
    onTogglePageSelection: handleTogglePageSelection,
    onClearSelection: handleClearSelection,
    onBulkDelete: canDeleteDepartment ? handleBulkDelete : undefined,
    resolveFilterOperatorOptions,
    onDepartmentPress: handleDepartmentPress,
    onAdd: canCreateDepartment ? handleAdd : undefined,
    onEdit: canEditDepartment ? handleEdit : undefined,
    onDelete: canDeleteDepartment ? handleDelete : undefined,
  };
};

export default useDepartmentListScreen;

