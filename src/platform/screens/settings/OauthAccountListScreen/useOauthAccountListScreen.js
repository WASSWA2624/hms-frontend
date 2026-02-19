/**
 * useOauthAccountListScreen Hook
 * Shared logic for OauthAccountListScreen across platforms.
 * File: useOauthAccountListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useAuth,
  useI18n,
  useNetwork,
  useOauthAccount,
  useTenantAccess,
  useUser,
} from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeIdentifier } from '@utils';

const PREFS_STORAGE_PREFIX = 'hms.settings.oauthAccounts.list.preferences';
const TABLE_COLUMNS = Object.freeze(['provider', 'user', 'providerUser', 'expires']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const MAX_FETCH_LIMIT = 100;
const DEFAULT_FETCH_PAGE = 1;
const DEFAULT_FETCH_LIMIT = MAX_FETCH_LIMIT;
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'provider', 'user', 'providerUser', 'expires']);
const FILTER_FIELDS = Object.freeze(['provider', 'user', 'providerUser', 'expires']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  provider: ['contains', 'equals', 'startsWith'],
  user: ['contains', 'equals', 'startsWith'],
  providerUser: ['contains', 'equals', 'startsWith'],
  expires: ['contains', 'equals', 'startsWith'],
});

const DEFAULT_FILTER = (id = 'oauth-account-filter-1') => ({
  id,
  field: 'provider',
  operator: 'contains',
  value: '',
});

const normalizeValue = (value) => String(value ?? '').trim();

const normalizeLower = (value) => normalizeValue(value).toLowerCase();

const uniqueArray = (values = []) => [...new Set(values)];

const normalizeDateValue = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
};

const sanitizeColumns = (values, fallback) => {
  if (!Array.isArray(values)) return [...fallback];
  const sanitized = values.filter((value) => TABLE_COLUMNS.includes(value));
  return sanitized.length > 0 ? uniqueArray(sanitized) : [...fallback];
};

const sanitizeSortField = (value) => (TABLE_COLUMNS.includes(value) ? value : 'provider');

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
  FILTER_FIELDS.includes(value) ? value : 'provider'
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
    created: 'oauthAccount.list.noticeCreated',
    updated: 'oauthAccount.list.noticeUpdated',
    deleted: 'oauthAccount.list.noticeDeleted',
    queued: 'oauthAccount.list.noticeQueued',
    accessDenied: 'oauthAccount.list.noticeAccessDenied',
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

const matchesOauthAccountSearch = (oauthAccount, query, scope, resolveOauthAccountFieldValue) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(
      resolveOauthAccountFieldValue(oauthAccount, field)
    ).includes(normalizedQuery));
  }

  const field = sanitizeFilterField(scope);
  return normalizeLower(resolveOauthAccountFieldValue(oauthAccount, field)).includes(normalizedQuery);
};

const matchesOauthAccountFilter = (oauthAccount, filter, resolveOauthAccountFieldValue) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolveOauthAccountFieldValue(oauthAccount, field);
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
  leftOauthAccount,
  rightOauthAccount,
  field,
  direction,
  resolveOauthAccountFieldValue
) => {
  const normalizedField = sanitizeSortField(field);
  let result = 0;

  if (normalizedField === 'expires') {
    const leftValue = new Date(leftOauthAccount?.expires_at).getTime() || 0;
    const rightValue = new Date(rightOauthAccount?.expires_at).getTime() || 0;
    result = leftValue - rightValue;
  } else {
    const leftValue = resolveOauthAccountFieldValue(leftOauthAccount, normalizedField);
    const rightValue = resolveOauthAccountFieldValue(rightOauthAccount, normalizedField);
    result = compareText(leftValue, rightValue);
  }

  return direction === 'desc' ? result * -1 : result;
};

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

const useOauthAccountListScreen = () => {
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
  } = useOauthAccount();
  const {
    list: listUsers,
    data: userData,
    reset: resetUsers,
  } = useUser();

  const filterCounterRef = useRef(1);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([DEFAULT_FILTER('oauth-account-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('provider');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const canManageOauthAccounts = canAccessTenantSettings;
  const canViewTechnicalIds = canManageAllTenants;
  const canCreateOauthAccount = canManageOauthAccounts;
  const canDeleteOauthAccount = canManageOauthAccounts;
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
    return `oauth-account-filter-${filterCounterRef.current}`;
  }, []);

  const rawItems = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );

  const userLookup = useMemo(() => {
    const map = new Map();
    userItems.forEach((userItem, index) => {
      const userIdValue = normalizeValue(userItem?.id);
      if (!userIdValue) return;
      const userLabel = resolveReadableValue(
        userItem?.name,
        userItem?.full_name,
        userItem?.display_name,
        userItem?.email,
        userItem?.phone
      ) || (
        canViewTechnicalIds
          ? userIdValue
          : t('oauthAccount.form.userOptionFallback', { index: index + 1 })
      );
      map.set(userIdValue, {
        label: userLabel,
        tenantId: normalizeValue(userItem?.tenant_id || userItem?.tenant?.id),
      });
    });
    return map;
  }, [userItems, canViewTechnicalIds, t]);

  const resolveOauthAccountTenantContext = useCallback((oauthAccount) => {
    const explicitTenantId = normalizeValue(oauthAccount?.tenant_id);
    const userIdValue = normalizeValue(oauthAccount?.user_id);
    const userContext = userLookup.get(userIdValue);
    const tenantIds = uniqueArray(
      [
        explicitTenantId,
        normalizeValue(userContext?.tenantId),
      ].filter(Boolean)
    );
    return {
      tenantIds,
      tenantId: tenantIds[0] || '',
    };
  }, [userLookup]);

  const resolveProviderLabel = useCallback((oauthAccount) => {
    const providerValue = resolveReadableValue(oauthAccount?.provider);
    if (providerValue) return providerValue;
    return t('common.notAvailable');
  }, [t]);

  const resolveUserLabel = useCallback((oauthAccount) => {
    const userIdValue = normalizeValue(oauthAccount?.user_id);
    const userContext = userLookup.get(userIdValue);
    const readableUser = resolveReadableValue(
      oauthAccount?.user_name,
      oauthAccount?.user?.name,
      oauthAccount?.user?.full_name,
      oauthAccount?.user?.display_name,
      oauthAccount?.user?.email,
      oauthAccount?.user?.phone,
      userContext?.label
    );
    if (readableUser) return readableUser;
    if (userIdValue && canViewTechnicalIds) return userIdValue;
    if (userIdValue) return t('oauthAccount.list.currentUserLabel');
    return t('common.notAvailable');
  }, [userLookup, canViewTechnicalIds, t]);

  const resolveProviderUserLabel = useCallback((oauthAccount) => {
    const providerUserValue = normalizeValue(oauthAccount?.provider_user_id);
    const readableValue = resolveReadableValue(providerUserValue);
    if (readableValue) return readableValue;
    if (providerUserValue && canViewTechnicalIds) return providerUserValue;
    if (providerUserValue) return t('oauthAccount.list.currentProviderUserLabel');
    return t('common.notAvailable');
  }, [canViewTechnicalIds, t]);

  const resolveOauthAccountFieldValue = useCallback((oauthAccount, field) => {
    if (field === 'provider') return resolveProviderLabel(oauthAccount);
    if (field === 'user') return resolveUserLabel(oauthAccount);
    if (field === 'providerUser') return resolveProviderUserLabel(oauthAccount);
    if (field === 'expires') return normalizeDateValue(oauthAccount?.expires_at);
    return '';
  }, [resolveProviderLabel, resolveUserLabel, resolveProviderUserLabel]);

  const normalizedFilters = useMemo(
    () => sanitizeFilters(filters, getNextFilterId),
    [filters, getNextFilterId]
  );

  const normalizedSearchScope = useMemo(
    () => sanitizeSearchScope(searchScope),
    [searchScope]
  );

  const scopedItems = useMemo(() => {
    if (canManageAllTenants) return rawItems;
    if (!normalizedTenantId) return [];

    return rawItems.filter((oauthAccount) => {
      const { tenantIds } = resolveOauthAccountTenantContext(oauthAccount);
      if (tenantIds.length === 0) return false;
      return tenantIds.every((tenantIdValue) => tenantIdValue === normalizedTenantId);
    });
  }, [
    rawItems,
    canManageAllTenants,
    normalizedTenantId,
    resolveOauthAccountTenantContext,
  ]);

  const activeFilters = useMemo(
    () => normalizedFilters.filter((filter) => normalizeValue(filter.value).length > 0),
    [normalizedFilters]
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch = normalizeValue(search);
    const hasSearch = normalizedSearch.length > 0;
    const hasFilters = activeFilters.length > 0;

    return scopedItems.filter((oauthAccount) => {
      if (hasSearch && !matchesOauthAccountSearch(
        oauthAccount,
        normalizedSearch,
        normalizedSearchScope,
        resolveOauthAccountFieldValue
      )) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesOauthAccountFilter(
        oauthAccount,
        filter,
        resolveOauthAccountFieldValue
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
    resolveOauthAccountFieldValue,
  ]);

  const sortedItems = useMemo(() => stableSort(
    filteredItems,
    (left, right) => compareByField(
      left,
      right,
      sortField,
      sortDirection,
      resolveOauthAccountFieldValue
    )
  ), [filteredItems, sortField, sortDirection, resolveOauthAccountFieldValue]);

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
    () => resolveErrorMessage(t, errorCode, 'oauthAccount.list.loadError'),
    [t, errorCode]
  );

  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageOauthAccounts || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = {
      page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
      limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
    };

    reset();
    list(params);
  }, [
    isResolved,
    canManageOauthAccounts,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    reset,
    list,
  ]);

  const fetchReferenceData = useCallback(() => {
    if (!isResolved || !canManageOauthAccounts || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = {
      page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
      limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
    };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    resetUsers();
    listUsers(params);
  }, [
    isResolved,
    canManageOauthAccounts,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    resetUsers,
    listUsers,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageOauthAccounts) {
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
    canManageOauthAccounts,
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
    router.replace('/settings/oauth-accounts');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageOauthAccounts) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageOauthAccounts, errorCode, t]);

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

      setSortDirection(nextField === 'expires' ? 'desc' : 'asc');
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
    setSortField('provider');
    setSortDirection('asc');
    setPageSize(DEFAULT_PAGE_SIZE);
    setDensity(DEFAULT_DENSITY);
    setSearchScope('all');
    setFilterLogic('AND');
    setFilters([DEFAULT_FILTER(getNextFilterId())]);
    setPage(1);
  }, [getNextFilterId]);

  const resolveOauthAccountById = useCallback((oauthAccountIdValue) => (
    scopedItems.find(
      (oauthAccount) => normalizeValue(oauthAccount?.id) === oauthAccountIdValue
    ) ?? null
  ), [scopedItems]);

  const canAccessOauthAccountRecord = useCallback((oauthAccount) => {
    if (!oauthAccount) return false;
    if (canManageAllTenants) return true;
    if (!normalizedTenantId) return false;

    const { tenantIds } = resolveOauthAccountTenantContext(oauthAccount);
    if (tenantIds.length === 0) return false;
    return tenantIds.every((tenantIdValue) => tenantIdValue === normalizedTenantId);
  }, [canManageAllTenants, normalizedTenantId, resolveOauthAccountTenantContext]);

  const handleItemPress = useCallback((id) => {
    if (!canManageOauthAccounts) return;
    const oauthAccountId = normalizeValue(id);
    if (!oauthAccountId) return;

    const targetOauthAccount = resolveOauthAccountById(oauthAccountId);
    if (!targetOauthAccount && !canManageAllTenants) {
      router.push('/settings/oauth-accounts?notice=accessDenied');
      return;
    }
    if (targetOauthAccount && !canAccessOauthAccountRecord(targetOauthAccount)) {
      router.push('/settings/oauth-accounts?notice=accessDenied');
      return;
    }

    router.push(`/settings/oauth-accounts/${oauthAccountId}`);
  }, [
    canManageOauthAccounts,
    canManageAllTenants,
    resolveOauthAccountById,
    canAccessOauthAccountRecord,
    router,
  ]);

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteOauthAccount) return;
      if (e?.stopPropagation) e.stopPropagation();

      const oauthAccountId = normalizeValue(id);
      if (!oauthAccountId) return;

      const targetOauthAccount = resolveOauthAccountById(oauthAccountId);
      if (!targetOauthAccount && !canManageAllTenants) {
        router.push('/settings/oauth-accounts?notice=accessDenied');
        return;
      }
      if (targetOauthAccount && !canAccessOauthAccountRecord(targetOauthAccount)) {
        router.push('/settings/oauth-accounts?notice=accessDenied');
        return;
      }

      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(oauthAccountId);
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
      canDeleteOauthAccount,
      canManageAllTenants,
      resolveOauthAccountById,
      canAccessOauthAccountRecord,
      router,
      t,
      remove,
      fetchList,
      isOffline,
    ]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateOauthAccount) return;
    router.push('/settings/oauth-accounts/create');
  }, [canCreateOauthAccount, router]);

  const searchScopeOptions = useMemo(() => ([
    { value: 'all', label: t('oauthAccount.list.searchScopeAll') },
    { value: 'provider', label: t('oauthAccount.list.searchScopeProvider') },
    { value: 'user', label: t('oauthAccount.list.searchScopeUser') },
    { value: 'providerUser', label: t('oauthAccount.list.searchScopeProviderUser') },
    { value: 'expires', label: t('oauthAccount.list.searchScopeExpires') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'provider', label: t('oauthAccount.list.filterFieldProvider') },
    { value: 'user', label: t('oauthAccount.list.filterFieldUser') },
    { value: 'providerUser', label: t('oauthAccount.list.filterFieldProviderUser') },
    { value: 'expires', label: t('oauthAccount.list.filterFieldExpires') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('oauthAccount.list.filterLogicAnd') },
    { value: 'OR', label: t('oauthAccount.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('oauthAccount.list.densityCompact') },
    { value: 'comfortable', label: t('oauthAccount.list.densityComfortable') },
  ]), [t]);

  const visibleColumnSet = useMemo(() => new Set(visibleColumns), [visibleColumns]);

  const orderedColumns = useMemo(() => {
    const normalized = sanitizeColumns(columnOrder, DEFAULT_COLUMN_ORDER);
    const missing = TABLE_COLUMNS.filter((column) => !normalized.includes(column));
    return [...normalized, ...missing];
  }, [columnOrder]);

  const visibleOrderedColumns = useMemo(() => {
    const filtered = orderedColumns.filter((column) => visibleColumnSet.has(column));
    if (filtered.length === 0) return ['provider'];
    return filtered;
  }, [orderedColumns, visibleColumnSet]);

  const canAddFilter = filters.length < 4;

  const resolveFilterOperatorOptions = useCallback((field) => {
    const normalizedField = sanitizeFilterField(field);
    const operators = FILTER_OPERATORS[normalizedField] || FILTER_OPERATORS.provider;
    return operators.map((operator) => ({
      value: operator,
      label: t(`oauthAccount.list.filterOperator${operator}`),
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
    resolveProviderLabel,
    resolveUserLabel,
    resolveProviderUserLabel,
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
    onDelete: canDeleteOauthAccount ? handleDelete : undefined,
    onAdd: canCreateOauthAccount ? handleAdd : undefined,
  };
};

export default useOauthAccountListScreen;

