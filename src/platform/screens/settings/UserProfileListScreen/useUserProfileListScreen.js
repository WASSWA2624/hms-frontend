/**
 * useUserProfileListScreen Hook
 * Shared logic for UserProfileListScreen across platforms.
 * File: useUserProfileListScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useAuth,
  useI18n,
  useNetwork,
  useUser,
  useFacility,
  useUserProfile,
  useTenantAccess,
} from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeIdentifier, toDateInputValue } from '@utils';

const TABLE_MODE_BREAKPOINT = 768;
const PREFS_STORAGE_PREFIX = 'hms.settings.userProfiles.list.preferences';
const USER_CACHE_STORAGE_PREFIX = 'hms.settings.userProfiles.list.cache';
const TABLE_COLUMNS = Object.freeze(['profile', 'user', 'facility', 'gender', 'dob']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const MAX_FETCH_LIMIT = 100;
const DEFAULT_FETCH_PAGE = 1;
const DEFAULT_FETCH_LIMIT = 100;
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const SEARCH_SCOPES = Object.freeze(['all', 'profile', 'user', 'facility', 'gender', 'dob']);
const FILTER_FIELDS = Object.freeze(['profile', 'user', 'facility', 'gender', 'dob']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const FILTER_OPERATORS = Object.freeze({
  profile: ['contains', 'equals', 'startsWith'],
  user: ['contains', 'equals', 'startsWith'],
  facility: ['contains', 'equals', 'startsWith'],
  gender: ['is'],
  dob: ['equals', 'startsWith'],
});

const DEFAULT_FILTER = (id = 'user-profile-filter-1') => ({
  id,
  field: 'profile',
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

const sanitizeSortField = (value) => (TABLE_COLUMNS.includes(value) ? value : 'profile');

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
  FILTER_FIELDS.includes(value) ? value : 'profile'
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
    created: 'userProfile.list.noticeCreated',
    updated: 'userProfile.list.noticeUpdated',
    deleted: 'userProfile.list.noticeDeleted',
    queued: 'userProfile.list.noticeQueued',
    accessDenied: 'userProfile.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const resolveProfileId = (profileItem) => normalizeValue(profileItem?.id ?? profileItem?.user_profile_id);
const resolveProfileUserId = (profileItem) => normalizeValue(profileItem?.user_id ?? profileItem?.user?.id);
const resolveProfileFacilityId = (profileItem) => normalizeValue(
  profileItem?.facility_id ?? profileItem?.facility?.id
);
const resolveProfileTenantId = (profileItem, userLookup) => {
  const directTenantId = normalizeValue(profileItem?.tenant_id ?? profileItem?.user?.tenant_id);
  if (directTenantId) return directTenantId;

  const profileUserId = resolveProfileUserId(profileItem);
  if (!profileUserId || !userLookup) return '';
  return normalizeValue(userLookup.get(profileUserId)?.tenantId);
};

const resolveProfileName = (t, profileItem) => {
  const nameSegments = [
    profileItem?.first_name,
    profileItem?.middle_name,
    profileItem?.last_name,
  ]
    .map((segment) => humanizeIdentifier(segment))
    .map((segment) => normalizeValue(segment))
    .filter(Boolean);

  if (nameSegments.length > 0) {
    return nameSegments.join(' ');
  }

  return t('userProfile.list.unnamed');
};

const resolveUserFallbackLabel = (t, profileItem, canViewTechnicalIds = false) => {
  const profileUserId = resolveProfileUserId(profileItem);
  if (!profileUserId) return t('common.notAvailable');
  if (canViewTechnicalIds) return profileUserId;
  return t('userProfile.list.currentUser');
};

const resolveFacilityFallbackLabel = (t, profileItem, canViewTechnicalIds = false) => {
  const profileFacilityId = resolveProfileFacilityId(profileItem);
  if (!profileFacilityId) return t('common.notAvailable');
  if (canViewTechnicalIds) return profileFacilityId;
  return t('userProfile.list.currentFacility');
};

const resolveProfileGenderValue = (profileItem) => normalizeValue(profileItem?.gender).toUpperCase();

const resolveProfileGenderLabel = (t, profileItem) => {
  const genderValue = resolveProfileGenderValue(profileItem);
  if (!genderValue) return t('common.notAvailable');
  const key = `userProfile.gender.${genderValue}`;
  const resolved = t(key);
  return resolved === key ? genderValue : resolved;
};

const resolveProfileDobValue = (profileItem) => normalizeValue(toDateInputValue(profileItem?.date_of_birth));

const resolveProfileUserLabel = (t, profileItem, userLookup, canViewTechnicalIds = false) => {
  const userEmail = normalizeValue(profileItem?.user_email ?? profileItem?.user?.email);
  if (userEmail) return userEmail;

  const userPhone = normalizeValue(profileItem?.user_phone ?? profileItem?.user?.phone);
  if (userPhone) return userPhone;

  const profileUserId = resolveProfileUserId(profileItem);
  if (profileUserId) {
    const fromLookup = userLookup.get(profileUserId)?.label;
    if (fromLookup) return fromLookup;
  }

  return resolveUserFallbackLabel(t, profileItem, canViewTechnicalIds);
};

const resolveProfileFacilityLabel = (t, profileItem, facilityLookup, canViewTechnicalIds = false) => {
  const facilityName = humanizeIdentifier(
    profileItem?.facility_name
    ?? profileItem?.facility?.name
    ?? profileItem?.facility_label
  );
  if (facilityName) return normalizeValue(facilityName);

  const profileFacilityId = resolveProfileFacilityId(profileItem);
  if (profileFacilityId) {
    const fromLookup = facilityLookup.get(profileFacilityId)?.label;
    if (fromLookup) return fromLookup;
  }

  return resolveFacilityFallbackLabel(t, profileItem, canViewTechnicalIds);
};

const resolveProfileFieldValue = (t, profileItem, field, userLookup, facilityLookup, canViewTechnicalIds) => {
  if (field === 'profile') return resolveProfileName(t, profileItem);
  if (field === 'user') return resolveProfileUserLabel(t, profileItem, userLookup, canViewTechnicalIds);
  if (field === 'facility') {
    return resolveProfileFacilityLabel(t, profileItem, facilityLookup, canViewTechnicalIds);
  }
  if (field === 'gender') return resolveProfileGenderLabel(t, profileItem);
  if (field === 'dob') return resolveProfileDobValue(profileItem) || t('common.notAvailable');
  return '';
};

const matchesTextOperator = (fieldValue, operator, normalizedNeedle) => {
  const normalizedValue = normalizeLower(fieldValue);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesGenderOperator = (fieldValue, operator, normalizedNeedle) => {
  if (!normalizedNeedle) return true;
  if (operator !== 'is') return true;
  return normalizeValue(fieldValue).toUpperCase() === normalizeValue(normalizedNeedle).toUpperCase();
};

const matchesDateOperator = (fieldValue, operator, normalizedNeedle) => {
  if (!normalizedNeedle) return true;
  const normalizedValue = normalizeLower(fieldValue);
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesProfileSearch = (
  t,
  profileItem,
  query,
  scope,
  userLookup,
  facilityLookup,
  canViewTechnicalIds
) => {
  const normalizedQuery = normalizeLower(query);
  if (!normalizedQuery) return true;
  if (scope === 'all') {
    return TABLE_COLUMNS.some((field) => normalizeLower(
      resolveProfileFieldValue(t, profileItem, field, userLookup, facilityLookup, canViewTechnicalIds)
    ).includes(normalizedQuery));
  }
  const field = sanitizeFilterField(scope);
  return normalizeLower(
    resolveProfileFieldValue(t, profileItem, field, userLookup, facilityLookup, canViewTechnicalIds)
  ).includes(normalizedQuery);
};

const matchesProfileFilter = (t, profileItem, filter, userLookup, facilityLookup, canViewTechnicalIds) => {
  const field = sanitizeFilterField(filter?.field);
  const operator = sanitizeFilterOperator(field, filter?.operator);
  const value = sanitizeFilterValue(filter?.value);
  if (!value) return true;

  const fieldValue = resolveProfileFieldValue(
    t,
    profileItem,
    field,
    userLookup,
    facilityLookup,
    canViewTechnicalIds
  );
  const normalizedNeedle = normalizeLower(value);

  if (field === 'gender') {
    return matchesGenderOperator(fieldValue, operator, value);
  }

  if (field === 'dob') {
    return matchesDateOperator(fieldValue, operator, normalizedNeedle);
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

const compareDate = (left, right) => {
  const leftTime = Date.parse(left || '');
  const rightTime = Date.parse(right || '');
  const leftValue = Number.isFinite(leftTime) ? leftTime : -1;
  const rightValue = Number.isFinite(rightTime) ? rightTime : -1;
  if (leftValue === rightValue) return 0;
  return leftValue > rightValue ? 1 : -1;
};

const compareByField = (
  t,
  leftProfile,
  rightProfile,
  field,
  direction,
  userLookup,
  facilityLookup,
  canViewTechnicalIds
) => {
  const normalizedField = sanitizeSortField(field);
  const leftValue = resolveProfileFieldValue(
    t,
    leftProfile,
    normalizedField,
    userLookup,
    facilityLookup,
    canViewTechnicalIds
  );
  const rightValue = resolveProfileFieldValue(
    t,
    rightProfile,
    normalizedField,
    userLookup,
    facilityLookup,
    canViewTechnicalIds
  );

  const result = normalizedField === 'dob'
    ? compareDate(leftValue, rightValue)
    : compareText(leftValue, rightValue);

  return direction === 'desc' ? result * -1 : result;
};

const useUserProfileListScreen = () => {
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
  } = useUserProfile();
  const {
    list: listUsers,
    data: userData,
    reset: resetUsers,
  } = useUser();
  const {
    list: listFacilities,
    data: facilityData,
    reset: resetFacilities,
  } = useFacility();

  const filterCounterRef = useRef(1);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([DEFAULT_FILTER('user-profile-filter-1')]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState('profile');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [selectedProfileIds, setSelectedProfileIds] = useState([]);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const [cachedProfileItems, setCachedProfileItems] = useState([]);
  const isPreferencesLoadedRef = useRef(false);
  const canManageUserProfiles = canAccessTenantSettings;
  const canCreateUserProfile = canManageUserProfiles;
  const canEditUserProfile = canManageUserProfiles;
  const canDeleteUserProfile = canManageUserProfiles;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageUserProfiles && !canManageAllTenants;
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
  const profileDataCacheKey = useMemo(() => {
    const scope = canManageAllTenants
      ? 'all'
      : (normalizedTenantId || 'self');
    return `${USER_CACHE_STORAGE_PREFIX}.${preferenceSubject}.${scope}`;
  }, [canManageAllTenants, normalizedTenantId, preferenceSubject]);
  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;

  const getNextFilterId = useCallback(() => {
    filterCounterRef.current += 1;
    return `user-profile-filter-${filterCounterRef.current}`;
  }, []);

  const liveItems = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );

  const hasLiveProfilePayload = useMemo(
    () => Array.isArray(data) || Array.isArray(data?.items),
    [data]
  );

  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );

  const facilityItems = useMemo(
    () => (Array.isArray(facilityData) ? facilityData : (facilityData?.items ?? [])),
    [facilityData]
  );

  const userLookup = useMemo(
    () => new Map(
      userItems
        .map((userItem, index) => {
          const userId = normalizeValue(userItem?.id ?? userItem?.user_id);
          if (!userId) return null;
          const userEmail = normalizeValue(userItem?.email);
          const userPhone = normalizeValue(userItem?.phone);
          const label = userEmail
            || userPhone
            || (canViewTechnicalIds ? userId : t('userProfile.list.userOptionFallback', { index: index + 1 }));
          return [userId, { label, tenantId: normalizeValue(userItem?.tenant_id) }];
        })
        .filter(Boolean)
    ),
    [userItems, canViewTechnicalIds, t]
  );

  const facilityLookup = useMemo(
    () => new Map(
      facilityItems
        .map((facilityItem, index) => {
          const facilityId = normalizeValue(facilityItem?.id);
          if (!facilityId) return null;
          const label = normalizeValue(
            humanizeIdentifier(
              facilityItem?.name
              ?? facilityItem?.code
              ?? facilityItem?.slug
            )
          ) || (canViewTechnicalIds
            ? facilityId
            : t('userProfile.list.facilityOptionFallback', { index: index + 1 }));
          return [facilityId, { label }];
        })
        .filter(Boolean)
    ),
    [facilityItems, canViewTechnicalIds, t]
  );

  const baseItems = useMemo(() => {
    if (liveItems.length > 0) return liveItems;
    if (isOffline && cachedProfileItems.length > 0) return cachedProfileItems;
    return liveItems;
  }, [liveItems, isOffline, cachedProfileItems]);

  const scopedItems = useMemo(() => {
    if (canManageAllTenants) return baseItems;
    if (!normalizedTenantId) return [];
    return baseItems.filter((profileItem) => (
      resolveProfileTenantId(profileItem, userLookup) === normalizedTenantId
    ));
  }, [canManageAllTenants, normalizedTenantId, baseItems, userLookup]);

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
    return scopedItems.filter((profileItem) => {
      if (hasSearch && !matchesProfileSearch(
        t,
        profileItem,
        normalizedSearch,
        normalizedSearchScope,
        userLookup,
        facilityLookup,
        canViewTechnicalIds
      )) {
        return false;
      }
      if (!hasFilters) return true;

      const matches = activeFilters.map((filter) => matchesProfileFilter(
        t,
        profileItem,
        filter,
        userLookup,
        facilityLookup,
        canViewTechnicalIds
      ));
      if (filterLogic === 'OR') {
        return matches.some(Boolean);
      }
      return matches.every(Boolean);
    });
  }, [
    t,
    scopedItems,
    search,
    normalizedSearchScope,
    activeFilters,
    filterLogic,
    userLookup,
    facilityLookup,
    canViewTechnicalIds,
  ]);

  const sortedItems = useMemo(() => stableSort(
    filteredItems,
    (left, right) => compareByField(
      t,
      left,
      right,
      sortField,
      sortDirection,
      userLookup,
      facilityLookup,
      canViewTechnicalIds
    )
  ), [t, filteredItems, sortField, sortDirection, userLookup, facilityLookup, canViewTechnicalIds]);

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

  const currentPageProfileIds = useMemo(
    () => pagedItems.map((profileItem) => resolveProfileId(profileItem)).filter(Boolean),
    [pagedItems]
  );

  const selectedOnPageCount = useMemo(
    () => currentPageProfileIds.filter((id) => selectedProfileIds.includes(id)).length,
    [currentPageProfileIds, selectedProfileIds]
  );

  const allPageSelected = currentPageProfileIds.length > 0
    && selectedOnPageCount === currentPageProfileIds.length;

  const hasActiveSearchOrFilter = normalizeValue(search).length > 0 || activeFilters.length > 0;
  const hasNoResults = hasActiveSearchOrFilter && items.length === 0 && scopedItems.length > 0;

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'userProfile.list.loadError'),
    [t, errorCode]
  );

  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback(() => {
    if (!isResolved || !canManageUserProfiles || isOffline) return;
    if (isTenantScopedAdmin && !normalizedTenantId) return;

    const params = {
      page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
      limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
    };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedTenantId;
    }

    reset();
    list(params);
  }, [
    isResolved,
    canManageUserProfiles,
    isOffline,
    isTenantScopedAdmin,
    normalizedTenantId,
    reset,
    list,
  ]);

  const fetchUsers = useCallback(() => {
    if (!isResolved || !canManageUserProfiles || isOffline) return;
    if (isTenantScopedAdmin && !normalizedTenantId) return;

    const params = {
      page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
      limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
    };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedTenantId;
    }

    resetUsers();
    listUsers(params);
  }, [
    isResolved,
    canManageUserProfiles,
    isOffline,
    isTenantScopedAdmin,
    normalizedTenantId,
    resetUsers,
    listUsers,
  ]);

  const fetchFacilities = useCallback(() => {
    if (!isResolved || !canManageUserProfiles || isOffline) return;
    if (isTenantScopedAdmin && !normalizedTenantId) return;

    const params = {
      page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
      limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
    };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedTenantId;
    }

    resetFacilities();
    listFacilities(params);
  }, [
    isResolved,
    canManageUserProfiles,
    isOffline,
    isTenantScopedAdmin,
    normalizedTenantId,
    resetFacilities,
    listFacilities,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserProfiles) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
      return;
    }
    fetchList();
    fetchUsers();
    fetchFacilities();
  }, [
    isResolved,
    canManageUserProfiles,
    isTenantScopedAdmin,
    normalizedTenantId,
    fetchList,
    fetchUsers,
    fetchFacilities,
    router,
  ]);

  useEffect(() => {
    let cancelled = false;

    const loadCachedProfileItems = async () => {
      const stored = await asyncStorage.getItem(profileDataCacheKey);
      if (cancelled) return;

      if (Array.isArray(stored)) {
        setCachedProfileItems(stored);
        return;
      }

      if (Array.isArray(stored?.items)) {
        setCachedProfileItems(stored.items);
        return;
      }

      setCachedProfileItems((previous) => (previous.length === 0 ? previous : []));
    };

    loadCachedProfileItems();

    return () => {
      cancelled = true;
    };
  }, [profileDataCacheKey]);

  useEffect(() => {
    if (!isResolved || !canManageUserProfiles || !hasLiveProfilePayload) return;
    setCachedProfileItems((previous) => {
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
    asyncStorage.setItem(profileDataCacheKey, liveItems);
  }, [
    isResolved,
    canManageUserProfiles,
    hasLiveProfilePayload,
    profileDataCacheKey,
    liveItems,
  ]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/user-profiles');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageUserProfiles) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageUserProfiles, errorCode, t]);

  const handleDismissNotice = useCallback(() => {
    setNoticeMessage(null);
  }, []);

  const handleRetry = useCallback(() => {
    fetchList();
    fetchUsers();
    fetchFacilities();
  }, [fetchList, fetchUsers, fetchFacilities]);

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
        value: filter.value,
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

  const handleToggleProfileSelection = useCallback((profileIdValue) => {
    const normalizedId = normalizeValue(profileIdValue);
    if (!normalizedId) return;
    setSelectedProfileIds((previous) => {
      if (previous.includes(normalizedId)) {
        return previous.filter((value) => value !== normalizedId);
      }
      return [...previous, normalizedId];
    });
  }, []);

  const handleTogglePageSelection = useCallback((checked) => {
    setSelectedProfileIds((previous) => {
      if (!checked) {
        const pageIdSet = new Set(currentPageProfileIds);
        return previous.filter((value) => !pageIdSet.has(value));
      }
      const merged = new Set([...previous, ...currentPageProfileIds]);
      return [...merged];
    });
  }, [currentPageProfileIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedProfileIds([]);
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
    setSortField('profile');
    setSortDirection('asc');
    setPageSize(DEFAULT_PAGE_SIZE);
    setDensity(DEFAULT_DENSITY);
    setSearchScope('all');
    setFilterLogic('AND');
    setFilters([DEFAULT_FILTER(getNextFilterId())]);
    setPage(1);
    setSelectedProfileIds([]);
  }, [getNextFilterId]);

  const resolveProfileById = useCallback((profileIdValue) => (
    items.find((profileItem) => resolveProfileId(profileItem) === profileIdValue) ?? null
  ), [items]);

  const canAccessProfileRecord = useCallback((profileItem) => {
    if (!profileItem) return false;
    if (canManageAllTenants) return true;

    const profileTenantId = resolveProfileTenantId(profileItem, userLookup);
    if (!profileTenantId || !normalizedTenantId) return false;
    return profileTenantId === normalizedTenantId;
  }, [canManageAllTenants, normalizedTenantId, userLookup]);

  const handleProfilePress = useCallback(
    (profileIdValue) => {
      const normalizedId = normalizeValue(profileIdValue);
      if (!normalizedId) return;

      const targetProfile = resolveProfileById(normalizedId);
      if (!canManageAllTenants && (!targetProfile || !canAccessProfileRecord(targetProfile))) {
        router.push('/settings/user-profiles?notice=accessDenied');
        return;
      }

      router.push(`/settings/user-profiles/${normalizedId}`);
    },
    [canManageAllTenants, resolveProfileById, canAccessProfileRecord, router]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/user-profiles/create');
  }, [router]);

  const handleEdit = useCallback(
    (profileIdValue, e) => {
      if (!canEditUserProfile) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(profileIdValue);
      if (!normalizedId) return;

      const targetProfile = resolveProfileById(normalizedId);
      if (!canManageAllTenants && (!targetProfile || !canAccessProfileRecord(targetProfile))) {
        router.push('/settings/user-profiles?notice=accessDenied');
        return;
      }

      router.push(`/settings/user-profiles/${normalizedId}/edit`);
    },
    [canEditUserProfile, canManageAllTenants, resolveProfileById, canAccessProfileRecord, router]
  );

  const handleDelete = useCallback(
    async (profileIdValue, e) => {
      if (!canDeleteUserProfile) return;
      if (e?.stopPropagation) e.stopPropagation();

      const normalizedId = normalizeValue(profileIdValue);
      if (!normalizedId) return;

      const targetProfile = resolveProfileById(normalizedId);
      if (!canManageAllTenants && (!targetProfile || !canAccessProfileRecord(targetProfile))) {
        router.push('/settings/user-profiles?notice=accessDenied');
        return;
      }

      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(normalizedId);
        if (!result) return;
        fetchList();
        setSelectedProfileIds((previous) => previous.filter((value) => value !== normalizedId));
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
      canDeleteUserProfile,
      canManageAllTenants,
      resolveProfileById,
      canAccessProfileRecord,
      router,
      t,
      remove,
      fetchList,
      isOffline,
    ]
  );

  const handleBulkDelete = useCallback(async () => {
    if (!canDeleteUserProfile || selectedProfileIds.length === 0) return;
    if (!confirmAction(t('userProfile.list.bulkDeleteConfirm', { count: selectedProfileIds.length }))) {
      return;
    }

    let removedCount = 0;
    for (const profileIdValue of selectedProfileIds) {
      const targetProfile = resolveProfileById(profileIdValue);
      if (!canManageAllTenants && (!targetProfile || !canAccessProfileRecord(targetProfile))) {
        continue;
      }

      try {
        const result = await remove(profileIdValue);
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

    setSelectedProfileIds([]);
  }, [
    canDeleteUserProfile,
    canManageAllTenants,
    selectedProfileIds,
    t,
    resolveProfileById,
    canAccessProfileRecord,
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
    const availableIds = new Set(items.map((profileItem) => resolveProfileId(profileItem)).filter(Boolean));
    setSelectedProfileIds((previous) => previous.filter((value) => availableIds.has(value)));
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
    { value: 'all', label: t('userProfile.list.searchScopeAll') },
    { value: 'profile', label: t('userProfile.list.searchScopeProfile') },
    { value: 'user', label: t('userProfile.list.searchScopeUser') },
    { value: 'facility', label: t('userProfile.list.searchScopeFacility') },
    { value: 'gender', label: t('userProfile.list.searchScopeGender') },
    { value: 'dob', label: t('userProfile.list.searchScopeDob') },
  ]), [t]);

  const filterFieldOptions = useMemo(() => ([
    { value: 'profile', label: t('userProfile.list.filterFieldProfile') },
    { value: 'user', label: t('userProfile.list.filterFieldUser') },
    { value: 'facility', label: t('userProfile.list.filterFieldFacility') },
    { value: 'gender', label: t('userProfile.list.filterFieldGender') },
    { value: 'dob', label: t('userProfile.list.filterFieldDob') },
  ]), [t]);

  const filterLogicOptions = useMemo(() => ([
    { value: 'AND', label: t('userProfile.list.filterLogicAnd') },
    { value: 'OR', label: t('userProfile.list.filterLogicOr') },
  ]), [t]);

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(() => ([
    { value: 'compact', label: t('userProfile.list.densityCompact') },
    { value: 'comfortable', label: t('userProfile.list.densityComfortable') },
  ]), [t]);

  const visibleColumnSet = useMemo(() => new Set(visibleColumns), [visibleColumns]);

  const orderedColumns = useMemo(() => {
    const normalized = sanitizeColumns(columnOrder, DEFAULT_COLUMN_ORDER);
    const missing = TABLE_COLUMNS.filter((column) => !normalized.includes(column));
    return [...normalized, ...missing];
  }, [columnOrder]);

  const visibleOrderedColumns = useMemo(() => {
    const filtered = orderedColumns.filter((column) => visibleColumnSet.has(column));
    if (filtered.length === 0) return ['profile'];
    return filtered;
  }, [orderedColumns, visibleColumnSet]);

  const canAddFilter = filters.length < 4;

  const resolveFilterOperatorOptions = useCallback((field) => {
    const normalizedField = sanitizeFilterField(field);
    const operators = FILTER_OPERATORS[normalizedField] || FILTER_OPERATORS.profile;
    return operators.map((operator) => ({
      value: operator,
      label: t(`userProfile.list.filterOperator${operator}`),
    }));
  }, [t]);

  const resolveProfileDisplayName = useCallback(
    (profileItem) => resolveProfileName(t, profileItem),
    [t]
  );
  const resolveProfileUserDisplay = useCallback(
    (profileItem) => resolveProfileUserLabel(
      t,
      profileItem,
      userLookup,
      canViewTechnicalIds
    ),
    [t, userLookup, canViewTechnicalIds]
  );
  const resolveProfileFacilityDisplay = useCallback(
    (profileItem) => resolveProfileFacilityLabel(
      t,
      profileItem,
      facilityLookup,
      canViewTechnicalIds
    ),
    [t, facilityLookup, canViewTechnicalIds]
  );
  const resolveProfileGenderDisplay = useCallback(
    (profileItem) => resolveProfileGenderLabel(t, profileItem),
    [t]
  );
  const resolveProfileDobDisplay = useCallback(
    (profileItem) => resolveProfileDobValue(profileItem) || t('common.notAvailable'),
    [t]
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
    selectedProfileIds,
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
    onToggleProfileSelection: handleToggleProfileSelection,
    onTogglePageSelection: handleTogglePageSelection,
    onClearSelection: handleClearSelection,
    onBulkDelete: canDeleteUserProfile ? handleBulkDelete : undefined,
    resolveFilterOperatorOptions,
    resolveProfileId,
    resolveProfileDisplayName,
    resolveProfileUserDisplay,
    resolveProfileFacilityDisplay,
    resolveProfileGenderDisplay,
    resolveProfileDobDisplay,
    onProfilePress: handleProfilePress,
    onAdd: canCreateUserProfile ? handleAdd : undefined,
    onEdit: canEditUserProfile ? handleEdit : undefined,
    onDelete: canDeleteUserProfile ? handleDelete : undefined,
    // Legacy aliases to keep compatibility with existing screens/tests.
    selectedUserIds: selectedProfileIds,
    onToggleUserSelection: handleToggleProfileSelection,
    onUserPress: handleProfilePress,
  };
};

export default useUserProfileListScreen;


