/**
 * useBedListScreen Hook
 * Shared logic for BedListScreen across platforms.
 * File: useBedListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth, useI18n, useNetwork, useBed, useTenant, useFacility, useWard, useRoom, useTenantAccess } from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeIdentifier } from '@utils';

const TABLE_MODE_BREAKPOINT = 768;
const PREFS_STORAGE_PREFIX = 'hms.settings.beds.list.preferences';
const BED_CACHE_STORAGE_PREFIX = 'hms.settings.beds.list.cache';
const TABLE_COLUMNS = Object.freeze(['label', 'tenant', 'facility', 'ward', 'room', 'status']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const MAX_FETCH_LIMIT = 100;
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'label', 'tenant', 'facility', 'ward', 'room', 'status']);
const FILTER_FIELDS = Object.freeze(['label', 'tenant', 'facility', 'ward', 'room', 'status']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  label: ['contains', 'equals', 'startsWith'],
  tenant: ['contains', 'equals', 'startsWith'],
  facility: ['contains', 'equals', 'startsWith'],
  ward: ['contains', 'equals', 'startsWith'],
  room: ['contains', 'equals', 'startsWith'],
  status: ['is'],
});
const BED_STATUS_ORDER = Object.freeze({
  AVAILABLE: 0,
  OCCUPIED: 1,
  RESERVED: 2,
  OUT_OF_SERVICE: 3,
});

const DEFAULT_FILTER = (id = 'bed-filter-1') => ({
  id,
  field: 'label',
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

const sanitizeSortField = (value) => (TABLE_COLUMNS.includes(value) ? value : 'label');

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
  FILTER_FIELDS.includes(value) ? value : 'label'
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
    created: 'bed.list.noticeCreated',
    updated: 'bed.list.noticeUpdated',
    deleted: 'bed.list.noticeDeleted',
    queued: 'bed.list.noticeQueued',
    accessDenied: 'bed.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const normalizeBedStatus = (value) => {
  const normalized = normalizeValue(value).toUpperCase().replace(/\s+/g, '_');
  if (normalized === 'AVAILABLE') return 'AVAILABLE';
  if (normalized === 'OCCUPIED') return 'OCCUPIED';
  if (normalized === 'RESERVED') return 'RESERVED';
  if (normalized === 'OUT_OF_SERVICE') return 'OUT_OF_SERVICE';
  return '';
};

const normalizeStatusSearchNeedle = (value) => {
  const normalized = normalizeLower(value).replace(/[\s-]+/g, '_');
  if (!normalized) return '';
  if (normalized === 'available' || normalized === 'free') return 'AVAILABLE';
  if (normalized === 'occupied' || normalized === 'busy') return 'OCCUPIED';
  if (normalized === 'reserved' || normalized === 'hold') return 'RESERVED';
  if (
    normalized === 'out_of_service'
    || normalized === 'outofservice'
    || normalized === 'maintenance'
    || normalized === 'inactive'
  ) {
    return 'OUT_OF_SERVICE';
  }
  return normalizeBedStatus(normalized);
};

const resolveLookupLabel = (directValue, idValue, map) => {
  const direct = normalizeValue(humanizeIdentifier(directValue));
  if (direct) return direct;
  const normalizedId = normalizeValue(idValue);
  if (!normalizedId) return '';
  return normalizeValue(map?.[normalizedId]);
};

const resolveBedLabel = (bed) => normalizeValue(
  humanizeIdentifier(
    bed?.label
    ?? bed?.name
  )
);

const resolveBedTenant = (bed, lookupMaps) => resolveLookupLabel(
  bed?.tenant_name ?? bed?.tenant?.name ?? bed?.tenant_label,
  bed?.tenant_id,
  lookupMaps?.tenantMap
);

const resolveBedFacility = (bed, lookupMaps) => resolveLookupLabel(
  bed?.facility_name ?? bed?.facility?.name ?? bed?.facility_label,
  bed?.facility_id,
  lookupMaps?.facilityMap
);

const resolveBedWard = (bed, lookupMaps) => resolveLookupLabel(
  bed?.ward_name ?? bed?.ward?.name ?? bed?.ward_label,
  bed?.ward_id,
  lookupMaps?.wardMap
);

const resolveBedRoom = (bed, lookupMaps) => resolveLookupLabel(
  bed?.room_name ?? bed?.room?.name ?? bed?.room_label,
  bed?.room_id,
  lookupMaps?.roomMap
);

const resolveBedStatus = (bed) => normalizeBedStatus(
  bed?.status
  ?? bed?.bed_status
);

const resolveBedFieldValue = (bed, field, lookupMaps) => {
  if (field === 'label') return resolveBedLabel(bed);
  if (field === 'tenant') return resolveBedTenant(bed, lookupMaps);
  if (field === 'facility') return resolveBedFacility(bed, lookupMaps);
  if (field === 'ward') return resolveBedWard(bed, lookupMaps);
  if (field === 'room') return resolveBedRoom(bed, lookupMaps);
  if (field === 'status') return resolveBedStatus(bed);
  return '';
};

const matchesTextOperator = (fieldValue, operator, normalizedNeedle) => {
  const normalizedValue = normalizeLower(fieldValue);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesStatusOperator = (fieldValue, operator, rawNeedle) => {
  const normalizedNeedle = normalizeStatusSearchNeedle(rawNeedle);
  if (!normalizedNeedle) return true;
  if (operator !== 'is') return true;
  return fieldValue === normalizedNeedle;
};

const matchesBedSearch = (bed, query, scope, lookupMaps) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(resolveBedFieldValue(bed, field, lookupMaps))
      .includes(normalizedQuery));
  }
  const field = sanitizeFilterField(scope);
  return normalizeLower(resolveBedFieldValue(bed, field, lookupMaps)).includes(normalizedQuery);
};

const matchesBedFilter = (bed, filter, lookupMaps) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolveBedFieldValue(bed, field, lookupMaps);
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

const compareByField = (leftBed, rightBed, field, direction, lookupMaps) => {
  const normalizedField = sanitizeSortField(field);
  const leftValue = resolveBedFieldValue(leftBed, normalizedField, lookupMaps);
  const rightValue = resolveBedFieldValue(rightBed, normalizedField, lookupMaps);

  let result = 0;
  if (normalizedField === 'status') {
    const leftRank = BED_STATUS_ORDER[leftValue] ?? Number.MAX_SAFE_INTEGER;
    const rightRank = BED_STATUS_ORDER[rightValue] ?? Number.MAX_SAFE_INTEGER;
    result = leftRank - rightRank;
  } else {
    result = compareText(leftValue, rightValue);
  }

  return direction === 'desc' ? result * -1 : result;
};

const useBedListScreen = () => {
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
  } = useBed();
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
  const {
    list: listWards,
    data: wardData,
    reset: resetWards,
  } = useWard();
  const {
    list: listRooms,
    data: roomData,
    reset: resetRooms,
  } = useRoom();

  const filterCounterRef = useRef(1);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([DEFAULT_FILTER('bed-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('label');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [selectedBedIds, setSelectedBedIds] = useState([]);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const [cachedBedItems, setCachedBedItems] = useState([]);
  const canManageBeds = canAccessTenantSettings;
  const canCreateBed = canManageBeds;
  const canEditBed = canManageBeds;
  const canDeleteBed = canManageBeds;
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
  const bedDataCacheKey = useMemo(() => {
    const scope = canManageAllTenants
      ? 'all'
      : (normalizedTenantId || 'self');
    return `${BED_CACHE_STORAGE_PREFIX}.${preferenceSubject}.${scope}`;
  }, [canManageAllTenants, normalizedTenantId, preferenceSubject]);
  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;

  const getNextFilterId = useCallback(() => {
    filterCounterRef.current += 1;
    return `bed-filter-${filterCounterRef.current}`;
  }, []);

  const liveItems = useMemo(() => resolveListItems(data), [data]);
  const tenantItems = useMemo(() => resolveListItems(tenantData), [tenantData]);
  const facilityItems = useMemo(() => resolveListItems(facilityData), [facilityData]);
  const wardItems = useMemo(() => resolveListItems(wardData), [wardData]);
  const roomItems = useMemo(() => resolveListItems(roomData), [roomData]);

  const hasLiveBedPayload = useMemo(
    () => Array.isArray(data) || Array.isArray(data?.items),
    [data]
  );

  const baseItems = useMemo(() => {
    if (liveItems.length > 0) return liveItems;
    if (isOffline && cachedBedItems.length > 0) return cachedBedItems;
    return liveItems;
  }, [liveItems, isOffline, cachedBedItems]);

  const tenantMap = useMemo(() => {
    const map = createEntityLabelMap(
      tenantItems,
      (tenant) => tenant?.name ?? tenant?.slug
    );
    if (!canManageAllTenants && normalizedTenantId && !map[normalizedTenantId]) {
      map[normalizedTenantId] = t('bed.form.currentTenantLabel');
    }
    return map;
  }, [tenantItems, canManageAllTenants, normalizedTenantId, t]);

  const facilityMap = useMemo(() => createEntityLabelMap(
    facilityItems,
    (facility) => facility?.name ?? facility?.slug
  ), [facilityItems]);

  const wardMap = useMemo(() => createEntityLabelMap(
    wardItems,
    (ward) => ward?.name ?? ward?.slug
  ), [wardItems]);

  const roomMap = useMemo(() => createEntityLabelMap(
    roomItems,
    (room) => room?.name ?? room?.slug
  ), [roomItems]);

  const lookupMaps = useMemo(() => ({
    tenantMap,
    facilityMap,
    wardMap,
    roomMap,
  }), [tenantMap, facilityMap, wardMap, roomMap]);

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
    return baseItems.filter((bed) => {
      if (hasSearch && !matchesBedSearch(bed, normalizedSearch, normalizedSearchScope, lookupMaps)) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesBedFilter(bed, filter, lookupMaps));
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

  const currentPageBedIds = useMemo(
    () => pagedItems.map((bed) => bed?.id).filter(Boolean),
    [pagedItems]
  );

  const selectedBedsOnPageCount = useMemo(
    () => currentPageBedIds.filter((id) => selectedBedIds.includes(id)).length,
    [currentPageBedIds, selectedBedIds]
  );

  const allPageSelected = currentPageBedIds.length > 0
    && selectedBedsOnPageCount === currentPageBedIds.length;

  const hasActiveSearchOrFilter = normalizeValue(search).length > 0 || activeFilters.length > 0;
  const hasNoResults = hasActiveSearchOrFilter && items.length === 0 && baseItems.length > 0;

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'bed.list.loadError'),
    [t, errorCode]
  );

  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageBeds || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = { page: 1, limit: MAX_FETCH_LIMIT };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    reset();
    list(params);
  }, [
    isResolved,
    canManageBeds,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageBeds) {
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
    canManageBeds,
    canManageAllTenants,
    normalizedTenantId,
    fetchList,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    if (canManageAllTenants) {
      resetTenants();
      listTenants({ page: 1, limit: MAX_FETCH_LIMIT });

      resetFacilities();
      listFacilities({ page: 1, limit: MAX_FETCH_LIMIT });

      resetWards();
      listWards({ page: 1, limit: MAX_FETCH_LIMIT });

      resetRooms();
      listRooms({ page: 1, limit: MAX_FETCH_LIMIT });
      return;
    }

    resetFacilities();
    listFacilities({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: normalizedTenantId });

    resetWards();
    listWards({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: normalizedTenantId });

    resetRooms();
    listRooms({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: normalizedTenantId });
  }, [
    isResolved,
    canManageBeds,
    canManageAllTenants,
    normalizedTenantId,
    isOffline,
    listTenants,
    resetTenants,
    listFacilities,
    resetFacilities,
    listWards,
    resetWards,
    listRooms,
    resetRooms,
  ]);

  useEffect(() => {
    let cancelled = false;

    const loadCachedBedItems = async () => {
      const stored = await asyncStorage.getItem(bedDataCacheKey);
      if (cancelled) return;

      if (Array.isArray(stored)) {
        setCachedBedItems(stored);
        return;
      }

      if (Array.isArray(stored?.items)) {
        setCachedBedItems(stored.items);
        return;
      }

      setCachedBedItems([]);
    };

    loadCachedBedItems();

    return () => {
      cancelled = true;
    };
  }, [bedDataCacheKey]);

  useEffect(() => {
    if (!isResolved || !canManageBeds || !hasLiveBedPayload) return;
    setCachedBedItems(liveItems);
    asyncStorage.setItem(bedDataCacheKey, liveItems);
  }, [
    isResolved,
    canManageBeds,
    hasLiveBedPayload,
    bedDataCacheKey,
    liveItems,
  ]);

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
        value: nextField === 'status' ? sanitizeFilterValue(filter.value || 'AVAILABLE') : filter.value,
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

  const handleToggleBedSelection = useCallback((bedIdValue) => {
    const normalizedId = normalizeValue(bedIdValue);
    if (!normalizedId) return;
    setSelectedBedIds((previous) => {
      if (previous.includes(normalizedId)) {
        return previous.filter((value) => value !== normalizedId);
      }
      return [...previous, normalizedId];
    });
  }, []);

  const handleTogglePageSelection = useCallback((checked) => {
    setSelectedBedIds((previous) => {
      if (!checked) {
        const pageIdSet = new Set(currentPageBedIds);
        return previous.filter((value) => !pageIdSet.has(value));
      }
      const merged = new Set([...previous, ...currentPageBedIds]);
      return [...merged];
    });
  }, [currentPageBedIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedBedIds([]);
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
    setSortField('label');
    setSortDirection('asc');
    setPageSize(DEFAULT_PAGE_SIZE);
    setDensity(DEFAULT_DENSITY);
    setSearchScope('all');
    setFilterLogic('AND');
    setFilters([DEFAULT_FILTER(getNextFilterId())]);
    setPage(1);
    setSelectedBedIds([]);
  }, [getNextFilterId]);

  const resolveBedById = useCallback((bedIdValue) => (
    items.find((bed) => bed?.id === bedIdValue) ?? null
  ), [items]);

  const canAccessBedRecord = useCallback((bed) => {
    if (!bed) return false;
    if (canManageAllTenants) return true;

    const bedTenantId = normalizeValue(bed?.tenant_id);
    if (!bedTenantId || !normalizedTenantId) return true;
    return bedTenantId === normalizedTenantId;
  }, [canManageAllTenants, normalizedTenantId]);

  const handleBedPress = useCallback(
    (bedIdValue) => {
      const normalizedId = normalizeValue(bedIdValue);
      if (!normalizedId) return;

      const targetBed = resolveBedById(normalizedId);
      if (targetBed && !canAccessBedRecord(targetBed)) {
        router.push('/settings/beds?notice=accessDenied');
        return;
      }

      router.push(`/settings/beds/${normalizedId}`);
    },
    [resolveBedById, canAccessBedRecord, router]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/beds/create');
  }, [router]);

  const handleEdit = useCallback(
    (bedIdValue, e) => {
      if (!canEditBed) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(bedIdValue);
      if (!normalizedId) return;

      const targetBed = resolveBedById(normalizedId);
      if (targetBed && !canAccessBedRecord(targetBed)) {
        router.push('/settings/beds?notice=accessDenied');
        return;
      }

      router.push(`/settings/beds/${normalizedId}/edit`);
    },
    [canEditBed, resolveBedById, canAccessBedRecord, router]
  );

  const handleDelete = useCallback(
    async (bedIdValue, e) => {
      if (!canDeleteBed) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(bedIdValue);
      if (!normalizedId) return;

      const targetBed = resolveBedById(normalizedId);
      if (targetBed && !canAccessBedRecord(targetBed)) {
        router.push('/settings/beds?notice=accessDenied');
        return;
      }

      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(normalizedId);
        if (!result) return;
        fetchList();
        setSelectedBedIds((previous) => previous.filter((value) => value !== normalizedId));
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
      canDeleteBed,
      resolveBedById,
      canAccessBedRecord,
      router,
      t,
      remove,
      fetchList,
      isOffline,
    ]
  );

  const handleBulkDelete = useCallback(async () => {
    if (!canDeleteBed || selectedBedIds.length === 0) return;
    if (!confirmAction(t('bed.list.bulkDeleteConfirm', { count: selectedBedIds.length }))) {
      return;
    }

    let removedCount = 0;
    for (const bedIdValue of selectedBedIds) {
      const targetBed = resolveBedById(bedIdValue);
      if (targetBed && !canAccessBedRecord(targetBed)) {
        continue;
      }

      try {
        const result = await remove(bedIdValue);
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

    setSelectedBedIds([]);
  }, [
    canDeleteBed,
    selectedBedIds,
    t,
    resolveBedById,
    canAccessBedRecord,
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
    const availableIds = new Set(items.map((bed) => bed?.id).filter(Boolean));
    setSelectedBedIds((previous) => previous.filter((value) => availableIds.has(value)));
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
    { value: 'all', label: t('bed.list.searchScopeAll') },
    { value: 'label', label: t('bed.list.searchScopeLabelField') },
    { value: 'tenant', label: t('bed.list.searchScopeTenant') },
    { value: 'facility', label: t('bed.list.searchScopeFacility') },
    { value: 'ward', label: t('bed.list.searchScopeWard') },
    { value: 'room', label: t('bed.list.searchScopeRoom') },
    { value: 'status', label: t('bed.list.searchScopeStatus') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'label', label: t('bed.list.filterFieldLabelValue') },
    { value: 'tenant', label: t('bed.list.filterFieldTenant') },
    { value: 'facility', label: t('bed.list.filterFieldFacility') },
    { value: 'ward', label: t('bed.list.filterFieldWard') },
    { value: 'room', label: t('bed.list.filterFieldRoom') },
    { value: 'status', label: t('bed.list.filterFieldStatus') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('bed.list.filterLogicAnd') },
    { value: 'OR', label: t('bed.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('bed.list.densityCompact') },
    { value: 'comfortable', label: t('bed.list.densityComfortable') },
  ]), [t]);

  const visibleColumnSet = useMemo(() => new Set(visibleColumns), [visibleColumns]);

  const orderedColumns = useMemo(() => {
    const normalized = sanitizeColumns(columnOrder, DEFAULT_COLUMN_ORDER);
    const missing = TABLE_COLUMNS.filter((column) => !normalized.includes(column));
    return [...normalized, ...missing];
  }, [columnOrder]);

  const visibleOrderedColumns = useMemo(() => {
    const filtered = orderedColumns.filter((column) => visibleColumnSet.has(column));
    if (filtered.length === 0) return ['label'];
    return filtered;
  }, [orderedColumns, visibleColumnSet]);

  const canAddFilter = filters.length < 4;

  const resolveFilterOperatorOptions = useCallback((field) => {
    const normalizedField = sanitizeFilterField(field);
    const operators = FILTER_OPERATORS[normalizedField] || FILTER_OPERATORS.label;
    return operators.map((operator) => ({
      value: operator,
      label: t(`bed.list.filterOperator${operator}`),
    }));
  }, [t]);

  const resolveBedLabelText = useCallback((bed) => (
    resolveBedLabel(bed) || t('bed.list.unnamed')
  ), [t]);

  const resolveBedTenantText = useCallback((bed) => (
    resolveBedTenant(bed, lookupMaps) || t('common.notAvailable')
  ), [lookupMaps, t]);

  const resolveBedFacilityText = useCallback((bed) => (
    resolveBedFacility(bed, lookupMaps) || t('common.notAvailable')
  ), [lookupMaps, t]);

  const resolveBedWardText = useCallback((bed) => (
    resolveBedWard(bed, lookupMaps) || t('common.notAvailable')
  ), [lookupMaps, t]);

  const resolveBedRoomText = useCallback((bed) => (
    resolveBedRoom(bed, lookupMaps) || t('common.notAvailable')
  ), [lookupMaps, t]);

  const resolveBedStatusText = useCallback((bed) => (
    resolveBedStatus(bed)
  ), []);

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
    selectedBedIds,
    selectedBedsOnPageCount,
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
    onToggleBedSelection: handleToggleBedSelection,
    onTogglePageSelection: handleTogglePageSelection,
    onClearSelection: handleClearSelection,
    onBulkDelete: canDeleteBed ? handleBulkDelete : undefined,
    resolveFilterOperatorOptions,
    resolveBedLabelText,
    resolveBedTenantText,
    resolveBedFacilityText,
    resolveBedWardText,
    resolveBedRoomText,
    resolveBedStatusText,
    onBedPress: handleBedPress,
    onAdd: canCreateBed ? handleAdd : undefined,
    onEdit: canEditBed ? handleEdit : undefined,
    onDelete: canDeleteBed ? handleDelete : undefined,
  };
};

export default useBedListScreen;




