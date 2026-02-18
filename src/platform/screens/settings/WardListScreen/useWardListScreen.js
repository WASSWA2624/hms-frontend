/**
 * useWardListScreen Hook
 * Shared logic for WardListScreen across platforms.
 * File: useWardListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useAuth,
  useI18n,
  useNetwork,
  useWard,
  useTenant,
  useFacility,
  useTenantAccess,
} from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeIdentifier } from '@utils';

const TABLE_MODE_BREAKPOINT = 768;
const PREFS_STORAGE_PREFIX = 'hms.settings.wards.list.preferences';
const WARD_CACHE_STORAGE_PREFIX = 'hms.settings.wards.list.cache';
const TABLE_COLUMNS = Object.freeze(['name', 'tenant', 'facility', 'type', 'active']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const MAX_FETCH_LIMIT = 100;
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'name', 'tenant', 'facility', 'type', 'active']);
const FILTER_FIELDS = Object.freeze(['name', 'tenant', 'facility', 'type', 'active']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  name: ['contains', 'equals', 'startsWith'],
  tenant: ['contains', 'equals', 'startsWith'],
  facility: ['contains', 'equals', 'startsWith'],
  type: ['contains', 'equals', 'startsWith'],
  active: ['is'],
});

const DEFAULT_FILTER = (id = 'ward-filter-1') => ({
  id,
  field: 'name',
  operator: 'contains',
  value: '',
});

const normalizeValue = (value) => String(value ?? '').trim();
const normalizeLower = (value) => normalizeValue(value).toLowerCase();

const uniqueArray = (values = []) => [...new Set(values)];
const resolveListItems = (value) => (Array.isArray(value) ? value : (value?.items ?? []));

const createEntityLabelMap = (items, labelResolver) => items.reduce((acc, item) => {
  const id = normalizeValue(item?.id);
  if (!id) return acc;
  const label = normalizeValue(humanizeIdentifier(labelResolver(item)));
  if (!label) return acc;
  acc[id] = label;
  return acc;
}, {});

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
    created: 'ward.list.noticeCreated',
    updated: 'ward.list.noticeUpdated',
    deleted: 'ward.list.noticeDeleted',
    queued: 'ward.list.noticeQueued',
    accessDenied: 'ward.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const resolveLookupLabel = (directValue, idValue, map) => {
  const direct = normalizeValue(humanizeIdentifier(directValue));
  if (direct) return direct;
  const normalizedId = normalizeValue(idValue);
  if (!normalizedId) return '';
  return normalizeValue(map?.[normalizedId]);
};

const normalizeActiveValue = (value) => {
  if (typeof value === 'boolean') return value;
  const normalized = normalizeLower(value);
  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true;
  }
  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
    return false;
  }
  return null;
};

const resolveWardName = (ward) => normalizeValue(
  humanizeIdentifier(
    ward?.name
  )
);

const resolveWardTenant = (ward, lookupMaps) => resolveLookupLabel(
  ward?.tenant_name ?? ward?.tenant?.name ?? ward?.tenant_label,
  ward?.tenant_id,
  lookupMaps?.tenantMap
);

const resolveWardFacility = (ward, lookupMaps) => resolveLookupLabel(
  ward?.facility_name ?? ward?.facility?.name ?? ward?.facility_label,
  ward?.facility_id,
  lookupMaps?.facilityMap
);

const resolveWardType = (ward) => normalizeValue(humanizeIdentifier(
  ward?.ward_type ?? ward?.type
));

const resolveWardActive = (ward) => normalizeActiveValue(ward?.is_active);

const resolveWardFieldValue = (ward, field, lookupMaps) => {
  if (field === 'name') return resolveWardName(ward);
  if (field === 'tenant') return resolveWardTenant(ward, lookupMaps);
  if (field === 'facility') return resolveWardFacility(ward, lookupMaps);
  if (field === 'type') return resolveWardType(ward);
  if (field === 'active') return resolveWardActive(ward) ? 'active' : 'inactive';
  return '';
};

const matchesTextOperator = (fieldValue, operator, normalizedNeedle) => {
  const normalizedValue = normalizeLower(fieldValue);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesActiveOperator = (fieldValue, operator, rawNeedle) => {
  if (operator !== 'is') return true;
  const normalizedNeedle = normalizeLower(rawNeedle);
  if (!normalizedNeedle) return true;
  const isTrueValue = ['active', 'true', 'yes', 'on', 'enabled', '1'].includes(normalizedNeedle);
  const isFalseValue = ['inactive', 'false', 'no', 'off', 'disabled', '0'].includes(normalizedNeedle);
  if (!isTrueValue && !isFalseValue) return false;
  return isTrueValue ? fieldValue === 'active' : fieldValue === 'inactive';
};

const matchesWardSearch = (ward, query, scope, lookupMaps) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(resolveWardFieldValue(ward, field, lookupMaps))
      .includes(normalizedQuery));
  }
  const field = sanitizeFilterField(scope);
  return normalizeLower(resolveWardFieldValue(ward, field, lookupMaps)).includes(normalizedQuery);
};

const matchesWardFilter = (ward, filter, lookupMaps) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolveWardFieldValue(ward, field, lookupMaps);
  const normalizedNeedle = normalizeLower(value);
  if (field === 'active') {
    return matchesActiveOperator(fieldValue, operator, normalizedNeedle);
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

const compareByField = (leftWard, rightWard, field, direction, lookupMaps) => {
  const normalizedField = sanitizeSortField(field);
  let leftValue = resolveWardFieldValue(leftWard, normalizedField, lookupMaps);
  let rightValue = resolveWardFieldValue(rightWard, normalizedField, lookupMaps);

  if (normalizedField === 'active') {
    leftValue = leftValue === 'active' ? 0 : 1;
    rightValue = rightValue === 'active' ? 0 : 1;
  }

  const result = compareText(leftValue, rightValue);

  return direction === 'desc' ? result * -1 : result;
};

const useWardListScreen = () => {
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
  } = useWard();
  const {
    list: listTenants,
    data: tenantData,
    reset: resetTenants,
  } = useTenant();
  const {
    list: listFacilities,
    data: facilityData,
    reset: resetFacilities,
  } = useFacility();
  const filterCounterRef = useRef(1);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([DEFAULT_FILTER('ward-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [selectedWardIds, setSelectedWardIds] = useState([]);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const [cachedWardItems, setCachedWardItems] = useState([]);
  const canManageWards = canAccessTenantSettings;
  const canCreateWard = canManageWards;
  const canEditWard = canManageWards;
  const canDeleteWard = canManageWards;
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
  const wardDataCacheKey = useMemo(() => {
    const scope = canManageAllTenants
      ? 'all'
      : (normalizedTenantId || 'self');
    return `${WARD_CACHE_STORAGE_PREFIX}.${preferenceSubject}.${scope}`;
  }, [canManageAllTenants, normalizedTenantId, preferenceSubject]);
  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;

  const getNextFilterId = useCallback(() => {
    filterCounterRef.current += 1;
    return `ward-filter-${filterCounterRef.current}`;
  }, []);

  const liveItems = useMemo(() => resolveListItems(data), [data]);
  const tenantItems = useMemo(() => resolveListItems(tenantData), [tenantData]);
  const facilityItems = useMemo(() => resolveListItems(facilityData), [facilityData]);
  const hasLiveWardPayload = useMemo(
    () => Array.isArray(data) || Array.isArray(data?.items),
    [data]
  );

  const baseItems = useMemo(() => {
    if (liveItems.length > 0) return liveItems;
    if (isOffline && cachedWardItems.length > 0) return cachedWardItems;
    return liveItems;
  }, [liveItems, isOffline, cachedWardItems]);

  const tenantMap = useMemo(() => {
    const map = createEntityLabelMap(
      tenantItems,
      (tenant) => tenant?.name ?? tenant?.slug
    );
    return map;
  }, [tenantItems]);

  const facilityMap = useMemo(() => createEntityLabelMap(
    facilityItems,
    (facility) => facility?.name ?? facility?.slug
  ), [facilityItems]);

  const lookupMaps = useMemo(() => ({
    tenantMap,
    facilityMap,
  }), [tenantMap, facilityMap]);

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
    return baseItems.filter((Ward) => {
      if (hasSearch && !matchesWardSearch(Ward, normalizedSearch, normalizedSearchScope, lookupMaps)) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesWardFilter(Ward, filter, lookupMaps));
      if (filterLogic === 'OR') {
        return matches.some(Boolean);
      }
      return matches.every(Boolean);
    });
  }, [baseItems, search, normalizedSearchScope, activeFilters, filterLogic, lookupMaps]);

  const sortedItems = useMemo(() => stableSort(
    filteredItems,
    (left, right) => compareByField(left, right, sortField, sortDirection, lookupMaps)
  ), [filteredItems, sortField, sortDirection, lookupMaps]);

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

  const currentPageWardIds = useMemo(
    () => pagedItems.map((Ward) => Ward?.id).filter(Boolean),
    [pagedItems]
  );

  const selectedOnPageCount = useMemo(
    () => currentPageWardIds.filter((id) => selectedWardIds.includes(id)).length,
    [currentPageWardIds, selectedWardIds]
  );

  const allPageSelected = currentPageWardIds.length > 0
    && selectedOnPageCount === currentPageWardIds.length;

  const hasActiveSearchOrFilter = normalizeValue(search).length > 0 || activeFilters.length > 0;
  const hasNoResults = hasActiveSearchOrFilter && items.length === 0 && baseItems.length > 0;

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'ward.list.loadError'),
    [t, errorCode]
  );

  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageWards || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = { page: 1, limit: MAX_FETCH_LIMIT };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    reset();
    list(params);
  }, [
    isResolved,
    canManageWards,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageWards) {
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
    canManageWards,
    canManageAllTenants,
    normalizedTenantId,
    fetchList,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageWards || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    if (canManageAllTenants) {
      resetTenants();
      listTenants({ page: 1, limit: MAX_FETCH_LIMIT });

      resetFacilities();
      listFacilities({ page: 1, limit: MAX_FETCH_LIMIT });
      return;
    }

    resetFacilities();
    listFacilities({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: normalizedTenantId });
  }, [
    isResolved,
    canManageWards,
    canManageAllTenants,
    normalizedTenantId,
    isOffline,
    listTenants,
    resetTenants,
    listFacilities,
    resetFacilities,
  ]);

  useEffect(() => {
    let cancelled = false;

    const loadCachedWardItems = async () => {
      const stored = await asyncStorage.getItem(wardDataCacheKey);
      if (cancelled) return;

      if (Array.isArray(stored)) {
        setCachedWardItems(stored);
        return;
      }

      if (Array.isArray(stored?.items)) {
        setCachedWardItems(stored.items);
        return;
      }

      setCachedWardItems([]);
    };

    loadCachedWardItems();

    return () => {
      cancelled = true;
    };
  }, [wardDataCacheKey]);

  useEffect(() => {
    if (!isResolved || !canManageWards || !hasLiveWardPayload) return;
    setCachedWardItems(liveItems);
    asyncStorage.setItem(wardDataCacheKey, liveItems);
  }, [
    isResolved,
    canManageWards,
    hasLiveWardPayload,
    wardDataCacheKey,
    liveItems,
  ]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/wards');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageWards) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageWards, errorCode, t]);

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

  const handleToggleWardSelection = useCallback((wardIdValue) => {
    const normalizedId = normalizeValue(wardIdValue);
    if (!normalizedId) return;
    setSelectedWardIds((previous) => {
      if (previous.includes(normalizedId)) {
        return previous.filter((value) => value !== normalizedId);
      }
      return [...previous, normalizedId];
    });
  }, []);

  const handleTogglePageSelection = useCallback((checked) => {
    setSelectedWardIds((previous) => {
      if (!checked) {
        const pageIdSet = new Set(currentPageWardIds);
        return previous.filter((value) => !pageIdSet.has(value));
      }
      const merged = new Set([...previous, ...currentPageWardIds]);
      return [...merged];
    });
  }, [currentPageWardIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedWardIds([]);
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
    setSelectedWardIds([]);
  }, [getNextFilterId]);

  const resolveWardById = useCallback((wardIdValue) => (
    items.find((Ward) => Ward?.id === wardIdValue) ?? null
  ), [items]);

  const canAccessWardRecord = useCallback((Ward) => {
    if (!Ward) return false;
    if (canManageAllTenants) return true;

    const wardTenantId = normalizeValue(Ward?.tenant_id);
    if (!wardTenantId || !normalizedTenantId) return true;
    return wardTenantId === normalizedTenantId;
  }, [canManageAllTenants, normalizedTenantId]);

  const handleWardPress = useCallback(
    (wardIdValue) => {
      const normalizedId = normalizeValue(wardIdValue);
      if (!normalizedId) return;

      const targetWard = resolveWardById(normalizedId);
      if (targetWard && !canAccessWardRecord(targetWard)) {
        router.push('/settings/wards?notice=accessDenied');
        return;
      }

      router.push(`/settings/wards/${normalizedId}`);
    },
    [resolveWardById, canAccessWardRecord, router]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/wards/create');
  }, [router]);

  const handleEdit = useCallback(
    (wardIdValue, e) => {
      if (!canEditWard) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(wardIdValue);
      if (!normalizedId) return;

      const targetWard = resolveWardById(normalizedId);
      if (targetWard && !canAccessWardRecord(targetWard)) {
        router.push('/settings/wards?notice=accessDenied');
        return;
      }

      router.push(`/settings/wards/${normalizedId}/edit`);
    },
    [canEditWard, resolveWardById, canAccessWardRecord, router]
  );

  const handleDelete = useCallback(
    async (wardIdValue, e) => {
      if (!canDeleteWard) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(wardIdValue);
      if (!normalizedId) return;

      const targetWard = resolveWardById(normalizedId);
      if (targetWard && !canAccessWardRecord(targetWard)) {
        router.push('/settings/wards?notice=accessDenied');
        return;
      }

      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(normalizedId);
        if (!result) return;
        fetchList();
        setSelectedWardIds((previous) => previous.filter((value) => value !== normalizedId));
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
      canDeleteWard,
      resolveWardById,
      canAccessWardRecord,
      router,
      t,
      remove,
      fetchList,
      isOffline,
    ]
  );

  const handleBulkDelete = useCallback(async () => {
    if (!canDeleteWard || selectedWardIds.length === 0) return;
    if (!confirmAction(t('ward.list.bulkDeleteConfirm', { count: selectedWardIds.length }))) {
      return;
    }

    let removedCount = 0;
    for (const wardIdValue of selectedWardIds) {
      const targetWard = resolveWardById(wardIdValue);
      if (targetWard && !canAccessWardRecord(targetWard)) {
        continue;
      }

      try {
        const result = await remove(wardIdValue);
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

    setSelectedWardIds([]);
  }, [
    canDeleteWard,
    selectedWardIds,
    t,
    resolveWardById,
    canAccessWardRecord,
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
    const availableIds = new Set(items.map((Ward) => Ward?.id).filter(Boolean));
    setSelectedWardIds((previous) => previous.filter((value) => availableIds.has(value)));
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
    { value: 'all', label: t('ward.list.searchScopeAll') },
    { value: 'name', label: t('ward.list.searchScopeName') },
    { value: 'tenant', label: t('ward.list.searchScopeTenant') },
    { value: 'facility', label: t('ward.list.searchScopeFacility') },
    { value: 'type', label: t('ward.list.searchScopeType') },
    { value: 'active', label: t('ward.list.searchScopeActive') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'name', label: t('ward.list.filterFieldName') },
    { value: 'tenant', label: t('ward.list.filterFieldTenant') },
    { value: 'facility', label: t('ward.list.filterFieldFacility') },
    { value: 'type', label: t('ward.list.filterFieldType') },
    { value: 'active', label: t('ward.list.filterFieldActive') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('ward.list.filterLogicAnd') },
    { value: 'OR', label: t('ward.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('ward.list.densityCompact') },
    { value: 'comfortable', label: t('ward.list.densityComfortable') },
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
      label: t(`ward.list.filterOperator${operator}`),
    }));
  }, [t]);

  const resolveWardNameText = useCallback((ward) => (
    resolveWardName(ward) || t('ward.list.unnamed')
  ), [t]);

  const resolveWardTenantText = useCallback((ward) => (
    resolveWardTenant(ward, lookupMaps) || t('common.notAvailable')
  ), [lookupMaps, t]);

  const resolveWardFacilityText = useCallback((ward) => (
    resolveWardFacility(ward, lookupMaps) || t('common.notAvailable')
  ), [lookupMaps, t]);

  const resolveWardTypeText = useCallback((ward) => (
    resolveWardType(ward) || t('common.notAvailable')
  ), [lookupMaps, t]);

  const resolveWardActiveText = useCallback((ward) => (resolveWardActive(ward) ? 'active' : 'inactive'), []);

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
    selectedWardIds,
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
    onToggleWardSelection: handleToggleWardSelection,
    onTogglePageSelection: handleTogglePageSelection,
    onClearSelection: handleClearSelection,
    onBulkDelete: canDeleteWard ? handleBulkDelete : undefined,
    resolveFilterOperatorOptions,
    resolveWardNameText,
    resolveWardTenantText,
    resolveWardFacilityText,
    resolveWardTypeText,
    resolveWardActiveText,
    onWardPress: handleWardPress,
    onAdd: canCreateWard ? handleAdd : undefined,
    onEdit: canEditWard ? handleEdit : undefined,
    onDelete: canDeleteWard ? handleDelete : undefined,
  };
};

export default useWardListScreen;








