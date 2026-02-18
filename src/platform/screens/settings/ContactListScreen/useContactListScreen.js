/**
 * useContactListScreen Hook
 * Shared logic for ContactListScreen across platforms.
 * File: useContactListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth, useI18n, useNetwork, useContact, useTenantAccess } from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeIdentifier } from '@utils';

const TABLE_MODE_BREAKPOINT = 768;
const PREFS_STORAGE_PREFIX = 'hms.settings.contacts.list.preferences';
const CONTACT_CACHE_STORAGE_PREFIX = 'hms.settings.contacts.list.cache';
const TABLE_COLUMNS = Object.freeze(['value', 'type', 'tenant', 'primary']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const MAX_FETCH_LIMIT = 100;
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'value', 'type', 'tenant', 'primary']);
const FILTER_FIELDS = Object.freeze(['value', 'type', 'tenant', 'primary']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  value: ['contains', 'equals', 'startsWith'],
  tenant: ['contains', 'equals', 'startsWith'],
  type: ['contains', 'equals', 'startsWith'],
  primary: ['is'],
});

const DEFAULT_FILTER = (id = 'contact-filter-1') => ({
  id,
  field: 'value',
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

const sanitizeSortField = (value) => (TABLE_COLUMNS.includes(value) ? value : 'value');

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
  FILTER_FIELDS.includes(value) ? value : 'value'
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
    created: 'contact.list.noticeCreated',
    updated: 'contact.list.noticeUpdated',
    deleted: 'contact.list.noticeDeleted',
    queued: 'contact.list.noticeQueued',
    accessDenied: 'contact.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const resolveContactValue = (contact) => normalizeValue(humanizeIdentifier(
  contact?.value
  ?? contact?.name
));
const resolveContactTenant = (contact) => normalizeValue(
  humanizeIdentifier(
    contact?.tenant_name
    ?? contact?.tenant?.name
    ?? contact?.tenant_label
  )
);
const resolveContactType = (contact) => normalizeValue(
  humanizeIdentifier(
    contact?.contact_type
    ?? contact?.type
    ?? contact?.contactType
  )
);
const resolveContactPrimary = (contact) => (contact?.is_primary ? 'primary' : 'secondary');

const resolveContactFieldValue = (contact, field) => {
  if (field === 'value') return resolveContactValue(contact);
  if (field === 'tenant') return resolveContactTenant(contact);
  if (field === 'type') return resolveContactType(contact);
  if (field === 'primary') return resolveContactPrimary(contact);
  return '';
};

const matchesTextOperator = (fieldValue, operator, normalizedNeedle) => {
  const normalizedValue = normalizeLower(fieldValue);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesPrimaryOperator = (fieldValue, operator, normalizedNeedle) => {
  if (!normalizedNeedle) return true;
  if (operator !== 'is') return true;
  if (normalizedNeedle === 'primary' || normalizedNeedle === 'true' || normalizedNeedle === '1') {
    return fieldValue === 'primary';
  }
  if (
    normalizedNeedle === 'secondary'
    || normalizedNeedle === 'false'
    || normalizedNeedle === '0'
  ) {
    return fieldValue === 'secondary';
  }
  return fieldValue === normalizedNeedle;
};

const matchesContactSearch = (contact, query, scope) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(resolveContactFieldValue(contact, field))
      .includes(normalizedQuery));
  }
  const field = sanitizeFilterField(scope);
  return normalizeLower(resolveContactFieldValue(contact, field)).includes(normalizedQuery);
};

const matchesContactFilter = (contact, filter) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolveContactFieldValue(contact, field);
  const normalizedNeedle = normalizeLower(value);

  if (field === 'primary') {
    return matchesPrimaryOperator(fieldValue, operator, normalizedNeedle);
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

const compareByField = (leftContact, rightContact, field, direction) => {
  const normalizedField = sanitizeSortField(field);
  const leftValue = resolveContactFieldValue(leftContact, normalizedField);
  const rightValue = resolveContactFieldValue(rightContact, normalizedField);

  let result = 0;
  if (normalizedField === 'primary') {
    const leftRank = leftValue === 'primary' ? 1 : 0;
    const rightRank = rightValue === 'primary' ? 1 : 0;
    result = leftRank - rightRank;
  } else {
    result = compareText(leftValue, rightValue);
  }

  return direction === 'desc' ? result * -1 : result;
};

const useContactListScreen = () => {
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
  } = useContact();

  const filterCounterRef = useRef(1);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([DEFAULT_FILTER('contact-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('value');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const [cachedContactItems, setCachedContactItems] = useState([]);
  const isPreferencesLoadedRef = useRef(false);
  const canManageContacts = canAccessTenantSettings;
  const canCreateContact = canManageContacts;
  const canEditContact = canManageContacts;
  const canDeleteContact = canManageContacts;
  const canViewTechnicalIds = canManageAllTenants;
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
  const contactDataCacheKey = useMemo(() => {
    const scope = canManageAllTenants
      ? 'all'
      : (normalizedTenantId || 'self');
    return `${CONTACT_CACHE_STORAGE_PREFIX}.${preferenceSubject}.${scope}`;
  }, [canManageAllTenants, normalizedTenantId, preferenceSubject]);
  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;

  const getNextFilterId = useCallback(() => {
    filterCounterRef.current += 1;
    return `contact-filter-${filterCounterRef.current}`;
  }, []);

  const liveItems = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );

  const hasLiveContactPayload = useMemo(
    () => Array.isArray(data) || Array.isArray(data?.items),
    [data]
  );

  const baseItems = useMemo(() => {
    if (liveItems.length > 0) return liveItems;
    if (isOffline && cachedContactItems.length > 0) return cachedContactItems;
    return liveItems;
  }, [liveItems, isOffline, cachedContactItems]);

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
    return baseItems.filter((contact) => {
      if (hasSearch && !matchesContactSearch(contact, normalizedSearch, normalizedSearchScope)) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesContactFilter(contact, filter));
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

  const currentPageContactIds = useMemo(
    () => pagedItems.map((contact) => contact?.id).filter(Boolean),
    [pagedItems]
  );

  const selectedOnPageCount = useMemo(
    () => currentPageContactIds.filter((id) => selectedContactIds.includes(id)).length,
    [currentPageContactIds, selectedContactIds]
  );

  const allPageSelected = currentPageContactIds.length > 0
    && selectedOnPageCount === currentPageContactIds.length;

  const hasActiveSearchOrFilter = normalizeValue(search).length > 0 || activeFilters.length > 0;
  const hasNoResults = hasActiveSearchOrFilter && items.length === 0 && baseItems.length > 0;

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'contact.list.loadError'),
    [t, errorCode]
  );

  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageContacts || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = { page: 1, limit: MAX_FETCH_LIMIT };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    reset();
    list(params);
  }, [
    isResolved,
    canManageContacts,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageContacts) {
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
    canManageContacts,
    canManageAllTenants,
    normalizedTenantId,
    fetchList,
    router,
  ]);

  useEffect(() => {
    let cancelled = false;

    const loadCachedContactItems = async () => {
      const stored = await asyncStorage.getItem(contactDataCacheKey);
      if (cancelled) return;

      if (Array.isArray(stored)) {
        setCachedContactItems(stored);
        return;
      }

      if (Array.isArray(stored?.items)) {
        setCachedContactItems(stored.items);
        return;
      }

      setCachedContactItems((previous) => (previous.length === 0 ? previous : []));
    };

    loadCachedContactItems();

    return () => {
      cancelled = true;
    };
  }, [contactDataCacheKey]);

  useEffect(() => {
    if (!isResolved || !canManageContacts || !hasLiveContactPayload) return;
    setCachedContactItems((previous) => {
      if (previous === liveItems) return previous;
      if (
        Array.isArray(previous)
        && Array.isArray(liveItems)
        && previous.length === 0
        && liveItems.length === 0
      ) {
        return previous;
      }
      return liveItems;
    });
    asyncStorage.setItem(contactDataCacheKey, liveItems);
  }, [
    isResolved,
    canManageContacts,
    hasLiveContactPayload,
    contactDataCacheKey,
    liveItems,
  ]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/contacts');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageContacts) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageContacts, errorCode, t]);

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
        value: nextField === 'primary' ? sanitizeFilterValue(filter.value || 'primary') : filter.value,
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

  const handleToggleContactSelection = useCallback((contactIdValue) => {
    const normalizedId = normalizeValue(contactIdValue);
    if (!normalizedId) return;
    setSelectedContactIds((previous) => {
      if (previous.includes(normalizedId)) {
        return previous.filter((value) => value !== normalizedId);
      }
      return [...previous, normalizedId];
    });
  }, []);

  const handleTogglePageSelection = useCallback((checked) => {
    setSelectedContactIds((previous) => {
      if (!checked) {
        const pageIdSet = new Set(currentPageContactIds);
        return previous.filter((value) => !pageIdSet.has(value));
      }
      const merged = new Set([...previous, ...currentPageContactIds]);
      return [...merged];
    });
  }, [currentPageContactIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedContactIds([]);
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
    setSortField('value');
    setSortDirection('asc');
    setPageSize(DEFAULT_PAGE_SIZE);
    setDensity(DEFAULT_DENSITY);
    setSearchScope('all');
    setFilterLogic('AND');
    setFilters([DEFAULT_FILTER(getNextFilterId())]);
    setPage(1);
    setSelectedContactIds([]);
  }, [getNextFilterId]);

  const resolveContactById = useCallback((contactIdValue) => (
    items.find((contact) => contact?.id === contactIdValue) ?? null
  ), [items]);

  const canAccessContactRecord = useCallback((contact) => {
    if (!contact) return false;
    if (canManageAllTenants) return true;

    const contactTenantId = normalizeValue(contact?.tenant_id);
    if (!contactTenantId || !normalizedTenantId) return true;
    return contactTenantId === normalizedTenantId;
  }, [canManageAllTenants, normalizedTenantId]);

  const handleContactPress = useCallback(
    (contactIdValue) => {
      const normalizedId = normalizeValue(contactIdValue);
      if (!normalizedId) return;

      const targetContact = resolveContactById(normalizedId);
      if (targetContact && !canAccessContactRecord(targetContact)) {
        router.push('/settings/contacts?notice=accessDenied');
        return;
      }

      router.push(`/settings/contacts/${normalizedId}`);
    },
    [resolveContactById, canAccessContactRecord, router]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/contacts/create');
  }, [router]);

  const handleEdit = useCallback(
    (contactIdValue, e) => {
      if (!canEditContact) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(contactIdValue);
      if (!normalizedId) return;

      const targetContact = resolveContactById(normalizedId);
      if (targetContact && !canAccessContactRecord(targetContact)) {
        router.push('/settings/contacts?notice=accessDenied');
        return;
      }

      router.push(`/settings/contacts/${normalizedId}/edit`);
    },
    [canEditContact, resolveContactById, canAccessContactRecord, router]
  );

  const handleDelete = useCallback(
    async (contactIdValue, e) => {
      if (!canDeleteContact) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(contactIdValue);
      if (!normalizedId) return;

      const targetContact = resolveContactById(normalizedId);
      if (targetContact && !canAccessContactRecord(targetContact)) {
        router.push('/settings/contacts?notice=accessDenied');
        return;
      }

      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(normalizedId);
        if (!result) return;
        fetchList();
        setSelectedContactIds((previous) => previous.filter((value) => value !== normalizedId));
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
      canDeleteContact,
      resolveContactById,
      canAccessContactRecord,
      router,
      t,
      remove,
      fetchList,
      isOffline,
    ]
  );

  const handleBulkDelete = useCallback(async () => {
    if (!canDeleteContact || selectedContactIds.length === 0) return;
    if (!confirmAction(t('contact.list.bulkDeleteConfirm', { count: selectedContactIds.length }))) {
      return;
    }

    let removedCount = 0;
    for (const contactIdValue of selectedContactIds) {
      const targetContact = resolveContactById(contactIdValue);
      if (targetContact && !canAccessContactRecord(targetContact)) {
        continue;
      }

      try {
        const result = await remove(contactIdValue);
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

    setSelectedContactIds([]);
  }, [
    canDeleteContact,
    selectedContactIds,
    t,
    resolveContactById,
    canAccessContactRecord,
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
    const availableIds = new Set(items.map((contact) => contact?.id).filter(Boolean));
    setSelectedContactIds((previous) => previous.filter((value) => availableIds.has(value)));
  }, [items]);

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

  const searchScopeOptions = useMemo(() => ([
    { value: 'all', label: t('contact.list.searchScopeAll') },
    { value: 'value', label: t('contact.list.searchScopeValue') },
    { value: 'tenant', label: t('contact.list.searchScopeTenant') },
    { value: 'type', label: t('contact.list.searchScopeType') },
    { value: 'primary', label: t('contact.list.searchScopePrimary') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'value', label: t('contact.list.filterFieldValue') },
    { value: 'tenant', label: t('contact.list.filterFieldTenant') },
    { value: 'type', label: t('contact.list.filterFieldType') },
    { value: 'primary', label: t('contact.list.filterFieldPrimary') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('contact.list.filterLogicAnd') },
    { value: 'OR', label: t('contact.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('contact.list.densityCompact') },
    { value: 'comfortable', label: t('contact.list.densityComfortable') },
  ]), [t]);

  const visibleColumnSet = useMemo(() => new Set(visibleColumns), [visibleColumns]);

  const orderedColumns = useMemo(() => {
    const normalized = sanitizeColumns(columnOrder, DEFAULT_COLUMN_ORDER);
    const missing = TABLE_COLUMNS.filter((column) => !normalized.includes(column));
    return [...normalized, ...missing];
  }, [columnOrder]);

  const visibleOrderedColumns = useMemo(() => {
    const filtered = orderedColumns.filter((column) => visibleColumnSet.has(column));
    if (filtered.length === 0) return ['value'];
    return filtered;
  }, [orderedColumns, visibleColumnSet]);

  const canAddFilter = filters.length < 4;

  const resolveFilterOperatorOptions = useCallback((field) => {
    const normalizedField = sanitizeFilterField(field);
    const operators = FILTER_OPERATORS[normalizedField] || FILTER_OPERATORS.value;
    return operators.map((operator) => ({
      value: operator,
      label: t(`contact.list.filterOperator${operator}`),
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
    selectedContactIds,
    selectedOnPageCount,
    allPageSelected,
    canViewTechnicalIds,
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
    onToggleContactSelection: handleToggleContactSelection,
    onTogglePageSelection: handleTogglePageSelection,
    onClearSelection: handleClearSelection,
    onBulkDelete: canDeleteContact ? handleBulkDelete : undefined,
    resolveFilterOperatorOptions,
    onContactPress: handleContactPress,
    onAdd: canCreateContact ? handleAdd : undefined,
    onEdit: canEditContact ? handleEdit : undefined,
    onDelete: canDeleteContact ? handleDelete : undefined,
  };
};

export default useContactListScreen;

