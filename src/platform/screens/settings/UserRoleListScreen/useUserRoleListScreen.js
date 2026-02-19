/**
 * useUserRoleListScreen Hook
 * Shared logic for UserRoleListScreen across platforms.
 * File: useUserRoleListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useAuth,
  useFacility,
  useI18n,
  useNetwork,
  useTenant,
  useTenantAccess,
  useUser,
  useRole,
  useUserRole,
} from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeIdentifier } from '@utils';

const PREFS_STORAGE_PREFIX = 'hms.settings.userRoles.list.preferences';
const TABLE_COLUMNS = Object.freeze(['user', 'role', 'tenant', 'facility']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const MAX_FETCH_LIMIT = 100;
const DEFAULT_FETCH_PAGE = 1;
const DEFAULT_FETCH_LIMIT = 100;
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'user', 'role', 'tenant', 'facility']);
const FILTER_FIELDS = Object.freeze(['user', 'role', 'tenant', 'facility']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  user: ['contains', 'equals', 'startsWith'],
  role: ['contains', 'equals', 'startsWith'],
  tenant: ['contains', 'equals', 'startsWith'],
  facility: ['contains', 'equals', 'startsWith'],
});

const DEFAULT_FILTER = (id = 'user-role-filter-1') => ({
  id,
  field: 'user',
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

const sanitizeSortField = (value) => (TABLE_COLUMNS.includes(value) ? value : 'user');

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
  FILTER_FIELDS.includes(value) ? value : 'user'
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
    created: 'userRole.list.noticeCreated',
    updated: 'userRole.list.noticeUpdated',
    deleted: 'userRole.list.noticeDeleted',
    queued: 'userRole.list.noticeQueued',
    accessDenied: 'userRole.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const resolveReadableValue = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = humanizeIdentifier(candidate);
    if (normalized) return normalizeValue(normalized);
  }
  return '';
};

const matchesTextOperator = (fieldValue, operator, normalizedNeedle) => {
  const normalizedValue = normalizeLower(fieldValue);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesUserRoleSearch = (userRole, query, scope, resolveUserRoleFieldValue) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(
      resolveUserRoleFieldValue(userRole, field)
    ).includes(normalizedQuery));
  }

  const field = sanitizeFilterField(scope);
  return normalizeLower(resolveUserRoleFieldValue(userRole, field)).includes(normalizedQuery);
};

const matchesUserRoleFilter = (userRole, filter, resolveUserRoleFieldValue) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolveUserRoleFieldValue(userRole, field);
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

const compareByField = (
  leftUserRole,
  rightUserRole,
  field,
  direction,
  resolveUserRoleFieldValue
) => {
  const normalizedField = sanitizeSortField(field);
  const leftValue = resolveUserRoleFieldValue(leftUserRole, normalizedField);
  const rightValue = resolveUserRoleFieldValue(rightUserRole, normalizedField);
  const result = compareText(leftValue, rightValue);
  return direction === 'desc' ? result * -1 : result;
};

const useUserRoleListScreen = () => {
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
  } = useUserRole();
  const {
    list: listRoles,
    data: roleData,
    reset: resetRoles,
  } = useRole();
  const {
    list: listUsers,
    data: userData,
    reset: resetUsers,
  } = useUser();
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
  const [filters, setFilters] = useState([DEFAULT_FILTER('user-role-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('user');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const canManageUserRoles = canAccessTenantSettings;
  const canViewTechnicalIds = canManageAllTenants;
  const canCreateUserRole = canManageUserRoles;
  const canDeleteUserRole = canManageUserRoles;
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
    return `user-role-filter-${filterCounterRef.current}`;
  }, []);

  const rawItems = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const scopedItems = useMemo(() => {
    if (canManageAllTenants) return rawItems;
    if (!normalizedTenantId) return [];
    return rawItems.filter(
      (userRole) => normalizeValue(userRole?.tenant_id) === normalizedTenantId
    );
  }, [canManageAllTenants, normalizedTenantId, rawItems]);
  const roleItems = useMemo(
    () => (Array.isArray(roleData) ? roleData : (roleData?.items ?? [])),
    [roleData]
  );
  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );
  const tenantItems = useMemo(
    () => (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? [])),
    [tenantData]
  );
  const facilityItems = useMemo(
    () => (Array.isArray(facilityData) ? facilityData : (facilityData?.items ?? [])),
    [facilityData]
  );

  const roleLookup = useMemo(() => {
    const map = new Map();
    roleItems.forEach((role, index) => {
      const roleId = normalizeValue(role?.id);
      if (!roleId) return;
      const roleLabel = resolveReadableValue(role?.name, role?.slug)
        || (canViewTechnicalIds ? roleId : t('userRole.form.roleOptionFallback', { index: index + 1 }));
      if (roleLabel) {
        map.set(roleId, roleLabel);
      }
    });
    return map;
  }, [roleItems, canViewTechnicalIds, t]);

  const userLookup = useMemo(() => {
    const map = new Map();
    userItems.forEach((user, index) => {
      const userId = normalizeValue(user?.id);
      if (!userId) return;
      const userLabel = resolveReadableValue(
        user?.name,
        user?.full_name,
        user?.display_name,
        user?.email,
        user?.phone
      )
        || (canViewTechnicalIds
          ? userId
          : t('userRole.form.userOptionFallback', { index: index + 1 }));
      if (userLabel) {
        map.set(userId, userLabel);
      }
    });
    return map;
  }, [userItems, canViewTechnicalIds, t]);

  const tenantLookup = useMemo(() => {
    const map = new Map();
    tenantItems.forEach((tenant, index) => {
      const tenantId = normalizeValue(tenant?.id);
      if (!tenantId) return;
      const tenantLabel = resolveReadableValue(tenant?.name, tenant?.slug)
        || (canViewTechnicalIds
          ? tenantId
          : t('userRole.form.tenantOptionFallback', { index: index + 1 }));
      if (tenantLabel) {
        map.set(tenantId, tenantLabel);
      }
    });
    return map;
  }, [tenantItems, canViewTechnicalIds, t]);

  const facilityLookup = useMemo(() => {
    const map = new Map();
    facilityItems.forEach((facility, index) => {
      const facilityId = normalizeValue(facility?.id);
      if (!facilityId) return;
      const facilityLabel = resolveReadableValue(
        facility?.name,
        facility?.code,
        facility?.business_id
      ) || (canViewTechnicalIds
        ? facilityId
        : t('userRole.form.facilityOptionFallback', { index: index + 1 }));
      if (facilityLabel) {
        map.set(facilityId, facilityLabel);
      }
    });
    return map;
  }, [facilityItems, canViewTechnicalIds, t]);

  const resolveRoleLabel = useCallback((userRole) => {
    const roleId = normalizeValue(userRole?.role_id);
    const readableRole = resolveReadableValue(
      userRole?.role_name,
      userRole?.role?.name,
      userRole?.role_label,
      roleLookup.get(roleId)
    );
    if (readableRole) return readableRole;
    if (roleId && canViewTechnicalIds) return roleId;
    if (roleId) return t('userRole.list.currentRoleLabel');
    return t('common.notAvailable');
  }, [roleLookup, canViewTechnicalIds, t]);

  const resolveUserLabel = useCallback((userRole) => {
    const userId = normalizeValue(userRole?.user_id);
    const readableUser = resolveReadableValue(
      userRole?.user_name,
      userRole?.user?.name,
      userRole?.user?.full_name,
      userRole?.user?.email,
      userRole?.user_label,
      userLookup.get(userId)
    );
    if (readableUser) return readableUser;
    if (userId && canViewTechnicalIds) return userId;
    if (userId) return t('userRole.list.currentUserLabel');
    return t('common.notAvailable');
  }, [userLookup, canViewTechnicalIds, t]);

  const resolveTenantLabel = useCallback((userRole) => {
    const userRoleTenantId = normalizeValue(userRole?.tenant_id);
    const tenantLabel = resolveReadableValue(
      userRole?.tenant_name,
      userRole?.tenant?.name,
      userRole?.tenant?.slug,
      userRole?.tenant_label,
      tenantLookup.get(userRoleTenantId)
    );
    if (tenantLabel) return tenantLabel;
    if (userRoleTenantId && canViewTechnicalIds) return userRoleTenantId;
    if (userRoleTenantId) return t('userRole.list.currentTenantLabel');
    return t('common.notAvailable');
  }, [tenantLookup, canViewTechnicalIds, t]);

  const resolveFacilityLabel = useCallback((userRole) => {
    const userRoleFacilityId = normalizeValue(userRole?.facility_id);
    const facilityLabel = resolveReadableValue(
      userRole?.facility_name,
      userRole?.facility?.name,
      userRole?.facility?.code,
      userRole?.facility_label,
      facilityLookup.get(userRoleFacilityId)
    );
    if (facilityLabel) return facilityLabel;
    if (userRoleFacilityId && canViewTechnicalIds) return userRoleFacilityId;
    if (userRoleFacilityId) return t('userRole.list.currentFacilityLabel');
    return t('common.notAvailable');
  }, [facilityLookup, canViewTechnicalIds, t]);

  const resolveUserRoleFieldValue = useCallback((userRole, field) => {
    if (field === 'user') return resolveUserLabel(userRole);
    if (field === 'role') return resolveRoleLabel(userRole);
    if (field === 'tenant') return resolveTenantLabel(userRole);
    if (field === 'facility') return resolveFacilityLabel(userRole);
    return '';
  }, [resolveRoleLabel, resolveUserLabel, resolveTenantLabel, resolveFacilityLabel]);

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

    return scopedItems.filter((userRole) => {
      if (hasSearch && !matchesUserRoleSearch(
        userRole,
        normalizedSearch,
        normalizedSearchScope,
        resolveUserRoleFieldValue
      )) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesUserRoleFilter(
        userRole,
        filter,
        resolveUserRoleFieldValue
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
    resolveUserRoleFieldValue,
  ]);

  const sortedItems = useMemo(() => stableSort(
    filteredItems,
    (left, right) => compareByField(
      left,
      right,
      sortField,
      sortDirection,
      resolveUserRoleFieldValue
    )
  ), [filteredItems, sortField, sortDirection, resolveUserRoleFieldValue]);

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
    () => resolveErrorMessage(t, errorCode, 'userRole.list.loadError'),
    [t, errorCode]
  );

  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageUserRoles || isOffline) return;
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
    canManageUserRoles,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    reset,
    list,
  ]);

  const fetchReferenceData = useCallback(() => {
    if (!isResolved || !canManageUserRoles || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = {
      page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
      limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
    };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    resetRoles();
    resetUsers();
    resetTenants();
    resetFacilities();
    listRoles(params);
    listUsers(params);
    listTenants(params);
    listFacilities(params);
  }, [
    isResolved,
    canManageUserRoles,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    resetRoles,
    resetUsers,
    resetTenants,
    resetFacilities,
    listRoles,
    listUsers,
    listTenants,
    listFacilities,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserRoles) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
      return;
    }
    fetchList();
    fetchReferenceData();
  }, [
    isResolved,
    canManageUserRoles,
    canManageAllTenants,
    normalizedTenantId,
    fetchList,
    fetchReferenceData,
    router,
  ]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/user-roles');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageUserRoles) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageUserRoles, errorCode, t]);

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
    fetchReferenceData();
  }, [fetchList, fetchReferenceData]);

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
    setSortField('user');
    setSortDirection('asc');
    setPageSize(DEFAULT_PAGE_SIZE);
    setDensity(DEFAULT_DENSITY);
    setSearchScope('all');
    setFilterLogic('AND');
    setFilters([DEFAULT_FILTER(getNextFilterId())]);
    setPage(1);
  }, [getNextFilterId]);

  const resolveUserRoleById = useCallback((userRoleIdValue) => (
    items.find((userRole) => userRole?.id === userRoleIdValue) ?? null
  ), [items]);

  const canAccessUserRoleRecord = useCallback((userRole) => {
    if (!userRole) return false;
    if (canManageAllTenants) return true;

    const userRoleTenantId = normalizeValue(userRole?.tenant_id);
    if (!userRoleTenantId || !normalizedTenantId) return false;
    return userRoleTenantId === normalizedTenantId;
  }, [canManageAllTenants, normalizedTenantId]);

  const handleItemPress = useCallback((id) => {
    if (!canManageUserRoles) return;
    const userRoleId = normalizeValue(id);
    if (!userRoleId) return;

    const targetUserRole = resolveUserRoleById(userRoleId);
    if (!canManageAllTenants && (!targetUserRole || !canAccessUserRoleRecord(targetUserRole))) {
      router.push('/settings/user-roles?notice=accessDenied');
      return;
    }

    router.push(`/settings/user-roles/${userRoleId}`);
  }, [canManageUserRoles, canManageAllTenants, resolveUserRoleById, canAccessUserRoleRecord, router]);

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteUserRole) return;
      if (e?.stopPropagation) e.stopPropagation();

      const userRoleId = normalizeValue(id);
      if (!userRoleId) return;

      const targetUserRole = resolveUserRoleById(userRoleId);
      if (!canManageAllTenants && (!targetUserRole || !canAccessUserRoleRecord(targetUserRole))) {
        router.push('/settings/user-roles?notice=accessDenied');
        return;
      }

      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(userRoleId);
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
      canDeleteUserRole,
      canManageAllTenants,
      resolveUserRoleById,
      canAccessUserRoleRecord,
      router,
      t,
      remove,
      fetchList,
      isOffline,
    ]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateUserRole) return;
    router.push('/settings/user-roles/create');
  }, [canCreateUserRole, router]);

  const searchScopeOptions = useMemo(() => ([
    { value: 'all', label: t('userRole.list.searchScopeAll') },
    { value: 'user', label: t('userRole.list.searchScopeUser') },
    { value: 'role', label: t('userRole.list.searchScopeRole') },
    { value: 'tenant', label: t('userRole.list.searchScopeTenant') },
    { value: 'facility', label: t('userRole.list.searchScopeFacility') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'user', label: t('userRole.list.filterFieldUser') },
    { value: 'role', label: t('userRole.list.filterFieldRole') },
    { value: 'tenant', label: t('userRole.list.filterFieldTenant') },
    { value: 'facility', label: t('userRole.list.filterFieldFacility') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('userRole.list.filterLogicAnd') },
    { value: 'OR', label: t('userRole.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('userRole.list.densityCompact') },
    { value: 'comfortable', label: t('userRole.list.densityComfortable') },
  ]), [t]);

  const visibleColumnSet = useMemo(() => new Set(visibleColumns), [visibleColumns]);

  const orderedColumns = useMemo(() => {
    const normalized = sanitizeColumns(columnOrder, DEFAULT_COLUMN_ORDER);
    const missing = TABLE_COLUMNS.filter((column) => !normalized.includes(column));
    return [...normalized, ...missing];
  }, [columnOrder]);

  const visibleOrderedColumns = useMemo(() => {
    const filtered = orderedColumns.filter((column) => visibleColumnSet.has(column));
    if (filtered.length === 0) return ['user'];
    return filtered;
  }, [orderedColumns, visibleColumnSet]);

  const canAddFilter = filters.length < 4;

  const resolveFilterOperatorOptions = useCallback((field) => {
    const normalizedField = sanitizeFilterField(field);
    const operators = FILTER_OPERATORS[normalizedField] || FILTER_OPERATORS.user;
    return operators.map((operator) => ({
      value: operator,
      label: t(`userRole.list.filterOperator${operator}`),
    }));
  }, [t]);

  const handleDismissNotice = useCallback(() => {
    setNoticeMessage(null);
  }, []);

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
    resolveRoleLabel,
    resolveUserLabel,
    resolveTenantLabel,
    resolveFacilityLabel,
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
    onDelete: canDeleteUserRole ? handleDelete : undefined,
    onAdd: canCreateUserRole ? handleAdd : undefined,
  };
};

export default useUserRoleListScreen;


