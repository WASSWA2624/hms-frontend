/**
 * useRoomListScreen Hook
 * Shared logic for RoomListScreen across platforms.
 * File: useRoomListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useAuth,
  useI18n,
  useNetwork,
  useRoom,
  useTenant,
  useFacility,
  useWard,
  useTenantAccess,
} from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeIdentifier } from '@utils';

const TABLE_MODE_BREAKPOINT = 768;
const PREFS_STORAGE_PREFIX = 'hms.settings.rooms.list.preferences';
const ROOM_CACHE_STORAGE_PREFIX = 'hms.settings.rooms.list.cache';
const TABLE_COLUMNS = Object.freeze(['name', 'tenant', 'facility', 'ward', 'floor']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const MAX_FETCH_LIMIT = 100;
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'name', 'tenant', 'facility', 'ward', 'floor']);
const FILTER_FIELDS = Object.freeze(['name', 'tenant', 'facility', 'ward', 'floor']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  name: ['contains', 'equals', 'startsWith'],
  tenant: ['contains', 'equals', 'startsWith'],
  facility: ['contains', 'equals', 'startsWith'],
  ward: ['contains', 'equals', 'startsWith'],
  floor: ['contains', 'equals', 'startsWith'],
});

const DEFAULT_FILTER = (id = 'room-filter-1') => ({
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
    created: 'room.list.noticeCreated',
    updated: 'room.list.noticeUpdated',
    deleted: 'room.list.noticeDeleted',
    queued: 'room.list.noticeQueued',
    accessDenied: 'room.list.noticeAccessDenied',
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

const resolveRoomName = (room) => normalizeValue(
  humanizeIdentifier(
    room?.name
  )
);

const resolveRoomTenant = (room, lookupMaps) => resolveLookupLabel(
  room?.tenant_name ?? room?.tenant?.name ?? room?.tenant_label,
  room?.tenant_id,
  lookupMaps?.tenantMap
);

const resolveRoomFacility = (room, lookupMaps) => resolveLookupLabel(
  room?.facility_name ?? room?.facility?.name ?? room?.facility_label,
  room?.facility_id,
  lookupMaps?.facilityMap
);

const resolveRoomWard = (room, lookupMaps) => resolveLookupLabel(
  room?.ward_name ?? room?.ward?.name ?? room?.ward_label,
  room?.ward_id,
  lookupMaps?.wardMap
);

const resolveRoomFloor = (room) => normalizeValue(humanizeIdentifier(room?.floor));

const resolveRoomFieldValue = (room, field, lookupMaps) => {
  if (field === 'name') return resolveRoomName(room);
  if (field === 'tenant') return resolveRoomTenant(room, lookupMaps);
  if (field === 'facility') return resolveRoomFacility(room, lookupMaps);
  if (field === 'ward') return resolveRoomWard(room, lookupMaps);
  if (field === 'floor') return resolveRoomFloor(room);
  return '';
};

const matchesTextOperator = (fieldValue, operator, normalizedNeedle) => {
  const normalizedValue = normalizeLower(fieldValue);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesRoomSearch = (room, query, scope, lookupMaps) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(resolveRoomFieldValue(room, field, lookupMaps))
      .includes(normalizedQuery));
  }
  const field = sanitizeFilterField(scope);
  return normalizeLower(resolveRoomFieldValue(room, field, lookupMaps)).includes(normalizedQuery);
};

const matchesRoomFilter = (room, filter, lookupMaps) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolveRoomFieldValue(room, field, lookupMaps);
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

const compareByField = (leftRoom, rightRoom, field, direction, lookupMaps) => {
  const normalizedField = sanitizeSortField(field);
  const leftValue = resolveRoomFieldValue(leftRoom, normalizedField, lookupMaps);
  const rightValue = resolveRoomFieldValue(rightRoom, normalizedField, lookupMaps);

  const result = compareText(leftValue, rightValue);

  return direction === 'desc' ? result * -1 : result;
};

const useRoomListScreen = () => {
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
  } = useRoom();
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
  const filterCounterRef = useRef(1);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([DEFAULT_FILTER('room-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const [cachedRoomItems, setCachedRoomItems] = useState([]);
  const canManageRooms = canAccessTenantSettings;
  const canCreateRoom = canManageRooms;
  const canEditRoom = canManageRooms;
  const canDeleteRoom = canManageRooms;
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
  const roomDataCacheKey = useMemo(() => {
    const scope = canManageAllTenants
      ? 'all'
      : (normalizedTenantId || 'self');
    return `${ROOM_CACHE_STORAGE_PREFIX}.${preferenceSubject}.${scope}`;
  }, [canManageAllTenants, normalizedTenantId, preferenceSubject]);
  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;

  const getNextFilterId = useCallback(() => {
    filterCounterRef.current += 1;
    return `room-filter-${filterCounterRef.current}`;
  }, []);

  const liveItems = useMemo(() => resolveListItems(data), [data]);
  const tenantItems = useMemo(() => resolveListItems(tenantData), [tenantData]);
  const facilityItems = useMemo(() => resolveListItems(facilityData), [facilityData]);
  const wardItems = useMemo(() => resolveListItems(wardData), [wardData]);
  const hasLiveRoomPayload = useMemo(
    () => Array.isArray(data) || Array.isArray(data?.items),
    [data]
  );

  const baseItems = useMemo(() => {
    if (liveItems.length > 0) return liveItems;
    if (isOffline && cachedRoomItems.length > 0) return cachedRoomItems;
    return liveItems;
  }, [liveItems, isOffline, cachedRoomItems]);

  const tenantMap = useMemo(() => {
    const map = createEntityLabelMap(
      tenantItems,
      (tenant) => tenant?.name ?? tenant?.slug
    );
    if (!canManageAllTenants && normalizedTenantId && !map[normalizedTenantId]) {
      map[normalizedTenantId] = t('room.form.currentTenantLabel');
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

  const lookupMaps = useMemo(() => ({
    tenantMap,
    facilityMap,
    wardMap,
  }), [tenantMap, facilityMap, wardMap]);

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
    return baseItems.filter((Room) => {
      if (hasSearch && !matchesRoomSearch(Room, normalizedSearch, normalizedSearchScope, lookupMaps)) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesRoomFilter(Room, filter, lookupMaps));
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

  const currentPageRoomIds = useMemo(
    () => pagedItems.map((Room) => Room?.id).filter(Boolean),
    [pagedItems]
  );

  const selectedOnPageCount = useMemo(
    () => currentPageRoomIds.filter((id) => selectedRoomIds.includes(id)).length,
    [currentPageRoomIds, selectedRoomIds]
  );

  const allPageSelected = currentPageRoomIds.length > 0
    && selectedOnPageCount === currentPageRoomIds.length;

  const hasActiveSearchOrFilter = normalizeValue(search).length > 0 || activeFilters.length > 0;
  const hasNoResults = hasActiveSearchOrFilter && items.length === 0 && baseItems.length > 0;

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'room.list.loadError'),
    [t, errorCode]
  );

  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageRooms || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = { page: 1, limit: MAX_FETCH_LIMIT };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    reset();
    list(params);
  }, [
    isResolved,
    canManageRooms,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageRooms) {
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
    canManageRooms,
    canManageAllTenants,
    normalizedTenantId,
    fetchList,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageRooms || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    if (canManageAllTenants) {
      resetTenants();
      listTenants({ page: 1, limit: MAX_FETCH_LIMIT });

      resetFacilities();
      listFacilities({ page: 1, limit: MAX_FETCH_LIMIT });

      resetWards();
      listWards({ page: 1, limit: MAX_FETCH_LIMIT });
      return;
    }

    resetFacilities();
    listFacilities({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: normalizedTenantId });

    resetWards();
    listWards({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: normalizedTenantId });
  }, [
    isResolved,
    canManageRooms,
    canManageAllTenants,
    normalizedTenantId,
    isOffline,
    listTenants,
    resetTenants,
    listFacilities,
    resetFacilities,
    listWards,
    resetWards,
  ]);

  useEffect(() => {
    let cancelled = false;

    const loadCachedRoomItems = async () => {
      const stored = await asyncStorage.getItem(roomDataCacheKey);
      if (cancelled) return;

      if (Array.isArray(stored)) {
        setCachedRoomItems(stored);
        return;
      }

      if (Array.isArray(stored?.items)) {
        setCachedRoomItems(stored.items);
        return;
      }

      setCachedRoomItems([]);
    };

    loadCachedRoomItems();

    return () => {
      cancelled = true;
    };
  }, [roomDataCacheKey]);

  useEffect(() => {
    if (!isResolved || !canManageRooms || !hasLiveRoomPayload) return;
    setCachedRoomItems(liveItems);
    asyncStorage.setItem(roomDataCacheKey, liveItems);
  }, [
    isResolved,
    canManageRooms,
    hasLiveRoomPayload,
    roomDataCacheKey,
    liveItems,
  ]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/rooms');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageRooms) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageRooms, errorCode, t]);

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

  const handleToggleRoomSelection = useCallback((roomIdValue) => {
    const normalizedId = normalizeValue(roomIdValue);
    if (!normalizedId) return;
    setSelectedRoomIds((previous) => {
      if (previous.includes(normalizedId)) {
        return previous.filter((value) => value !== normalizedId);
      }
      return [...previous, normalizedId];
    });
  }, []);

  const handleTogglePageSelection = useCallback((checked) => {
    setSelectedRoomIds((previous) => {
      if (!checked) {
        const pageIdSet = new Set(currentPageRoomIds);
        return previous.filter((value) => !pageIdSet.has(value));
      }
      const merged = new Set([...previous, ...currentPageRoomIds]);
      return [...merged];
    });
  }, [currentPageRoomIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedRoomIds([]);
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
    setSelectedRoomIds([]);
  }, [getNextFilterId]);

  const resolveRoomById = useCallback((roomIdValue) => (
    items.find((Room) => Room?.id === roomIdValue) ?? null
  ), [items]);

  const canAccessRoomRecord = useCallback((Room) => {
    if (!Room) return false;
    if (canManageAllTenants) return true;

    const roomTenantId = normalizeValue(Room?.tenant_id);
    if (!roomTenantId || !normalizedTenantId) return true;
    return roomTenantId === normalizedTenantId;
  }, [canManageAllTenants, normalizedTenantId]);

  const handleRoomPress = useCallback(
    (roomIdValue) => {
      const normalizedId = normalizeValue(roomIdValue);
      if (!normalizedId) return;

      const targetRoom = resolveRoomById(normalizedId);
      if (targetRoom && !canAccessRoomRecord(targetRoom)) {
        router.push('/settings/rooms?notice=accessDenied');
        return;
      }

      router.push(`/settings/rooms/${normalizedId}`);
    },
    [resolveRoomById, canAccessRoomRecord, router]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/rooms/create');
  }, [router]);

  const handleEdit = useCallback(
    (roomIdValue, e) => {
      if (!canEditRoom) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(roomIdValue);
      if (!normalizedId) return;

      const targetRoom = resolveRoomById(normalizedId);
      if (targetRoom && !canAccessRoomRecord(targetRoom)) {
        router.push('/settings/rooms?notice=accessDenied');
        return;
      }

      router.push(`/settings/rooms/${normalizedId}/edit`);
    },
    [canEditRoom, resolveRoomById, canAccessRoomRecord, router]
  );

  const handleDelete = useCallback(
    async (roomIdValue, e) => {
      if (!canDeleteRoom) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(roomIdValue);
      if (!normalizedId) return;

      const targetRoom = resolveRoomById(normalizedId);
      if (targetRoom && !canAccessRoomRecord(targetRoom)) {
        router.push('/settings/rooms?notice=accessDenied');
        return;
      }

      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(normalizedId);
        if (!result) return;
        fetchList();
        setSelectedRoomIds((previous) => previous.filter((value) => value !== normalizedId));
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
      canDeleteRoom,
      resolveRoomById,
      canAccessRoomRecord,
      router,
      t,
      remove,
      fetchList,
      isOffline,
    ]
  );

  const handleBulkDelete = useCallback(async () => {
    if (!canDeleteRoom || selectedRoomIds.length === 0) return;
    if (!confirmAction(t('room.list.bulkDeleteConfirm', { count: selectedRoomIds.length }))) {
      return;
    }

    let removedCount = 0;
    for (const roomIdValue of selectedRoomIds) {
      const targetRoom = resolveRoomById(roomIdValue);
      if (targetRoom && !canAccessRoomRecord(targetRoom)) {
        continue;
      }

      try {
        const result = await remove(roomIdValue);
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

    setSelectedRoomIds([]);
  }, [
    canDeleteRoom,
    selectedRoomIds,
    t,
    resolveRoomById,
    canAccessRoomRecord,
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
    const availableIds = new Set(items.map((Room) => Room?.id).filter(Boolean));
    setSelectedRoomIds((previous) => previous.filter((value) => availableIds.has(value)));
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
    { value: 'all', label: t('room.list.searchScopeAll') },
    { value: 'name', label: t('room.list.searchScopeName') },
    { value: 'tenant', label: t('room.list.searchScopeTenant') },
    { value: 'facility', label: t('room.list.searchScopeFacility') },
    { value: 'ward', label: t('room.list.searchScopeWard') },
    { value: 'floor', label: t('room.list.searchScopeFloor') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'name', label: t('room.list.filterFieldName') },
    { value: 'tenant', label: t('room.list.filterFieldTenant') },
    { value: 'facility', label: t('room.list.filterFieldFacility') },
    { value: 'ward', label: t('room.list.filterFieldWard') },
    { value: 'floor', label: t('room.list.filterFieldFloor') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('room.list.filterLogicAnd') },
    { value: 'OR', label: t('room.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('room.list.densityCompact') },
    { value: 'comfortable', label: t('room.list.densityComfortable') },
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
      label: t(`room.list.filterOperator${operator}`),
    }));
  }, [t]);

  const resolveRoomNameText = useCallback((room) => (
    resolveRoomName(room) || t('room.list.unnamed')
  ), [t]);

  const resolveRoomTenantText = useCallback((room) => (
    resolveRoomTenant(room, lookupMaps) || t('common.notAvailable')
  ), [lookupMaps, t]);

  const resolveRoomFacilityText = useCallback((room) => (
    resolveRoomFacility(room, lookupMaps) || t('common.notAvailable')
  ), [lookupMaps, t]);

  const resolveRoomWardText = useCallback((room) => (
    resolveRoomWard(room, lookupMaps) || t('common.notAvailable')
  ), [lookupMaps, t]);

  const resolveRoomFloorText = useCallback((room) => (
    resolveRoomFloor(room) || t('common.notAvailable')
  ), [t]);

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
    selectedRoomIds,
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
    onToggleRoomSelection: handleToggleRoomSelection,
    onTogglePageSelection: handleTogglePageSelection,
    onClearSelection: handleClearSelection,
    onBulkDelete: canDeleteRoom ? handleBulkDelete : undefined,
    resolveFilterOperatorOptions,
    resolveRoomNameText,
    resolveRoomTenantText,
    resolveRoomFacilityText,
    resolveRoomWardText,
    resolveRoomFloorText,
    onRoomPress: handleRoomPress,
    onAdd: canCreateRoom ? handleAdd : undefined,
    onEdit: canEditRoom ? handleEdit : undefined,
    onDelete: canDeleteRoom ? handleDelete : undefined,
  };
};

export default useRoomListScreen;







