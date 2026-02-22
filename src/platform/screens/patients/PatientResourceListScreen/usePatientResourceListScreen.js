/**
 * Shared logic for patient resource list screens.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useAuth,
  useI18n,
  useNetwork,
  usePatient,
  usePatientAccess,
  useUser,
} from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeDisplayText } from '@utils';
import {
  getPatientResourceConfig,
  normalizeSearchParam,
  PATIENT_ROUTE_ROOT,
  sanitizeString,
  withPatientContext,
} from '../patientResourceConfigs';
import usePatientResourceCrud from '../usePatientResourceCrud';
import {
  buildNoticeMessage,
  isAccessDeniedError,
  normalizeNoticeValue,
  normalizePatientContextId,
  resolvePatientContextLabel,
  resolvePatientDisplayLabel,
  resolveErrorMessage,
  resolveUserContextLabel,
  resolveUserDisplayLabel,
} from '../patientScreenUtils';

const TABLE_MODE_BREAKPOINT = 768;
const PREFS_STORAGE_PREFIX = 'hms.patients.resources.list.preferences';
const MAX_FETCH_LIMIT = 100;
const PATIENT_LOOKUP_LIMIT = 100;
const USER_LOOKUP_LIMIT = 100;
const DEFAULT_FETCH_PAGE = 1;
const DEFAULT_FETCH_LIMIT = 100;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const TEXT_OPERATORS = Object.freeze(['contains', 'equals', 'startsWith']);
const BOOLEAN_OPERATORS = Object.freeze(['is']);
const TABLE_COLUMNS = Object.freeze(['title', 'subtitle', 'updatedAt', 'createdAt']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze(['title', 'subtitle', 'updatedAt']);
const DEFAULT_SORT_FIELD = 'updatedAt';
const DEFAULT_SORT_DIRECTION = 'desc';
const STATUS_FIELDS = new Set(['is_active', 'is_primary']);

const normalizeValue = (value) => sanitizeString(value);
const normalizeLower = (value) => normalizeValue(value).toLowerCase();

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

const resolveListItems = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const isBooleanField = (field) => field?.type === 'switch' || STATUS_FIELDS.has(field?.name);

const sanitizeSortDirection = (value) => (value === 'asc' ? 'asc' : 'desc');

const sanitizeSortField = (value) => (
  TABLE_COLUMNS.includes(value) ? value : DEFAULT_SORT_FIELD
);

const sanitizeDensity = (value) => (
  DENSITY_OPTIONS.includes(value) ? value : DEFAULT_DENSITY
);

const sanitizePageSize = (value) => (
  PAGE_SIZE_OPTIONS.includes(Number(value)) ? Number(value) : DEFAULT_PAGE_SIZE
);

const sanitizeColumns = (values, fallback) => {
  if (!Array.isArray(values)) return [...fallback];
  const normalized = values.filter((value) => TABLE_COLUMNS.includes(value));
  if (normalized.length === 0) return [...fallback];
  return [...new Set(normalized)];
};

const sanitizeFilterLogic = (value) => (
  FILTER_LOGICS.includes(value) ? value : 'AND'
);

const getDefaultOperator = (fieldType) => (
  fieldType === 'boolean' ? BOOLEAN_OPERATORS[0] : TEXT_OPERATORS[0]
);

const sanitizeFilterOperator = (fieldType, value) => {
  const allowedOperators = fieldType === 'boolean' ? BOOLEAN_OPERATORS : TEXT_OPERATORS;
  if (allowedOperators.includes(value)) return value;
  return allowedOperators[0];
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

const resolveBooleanSearchValue = (value) => {
  const normalized = normalizeLower(value);
  if (!normalized) return '';
  if (['on', 'active', 'enabled', 'yes', 'true', '1'].includes(normalized)) return 'on';
  if (['off', 'inactive', 'disabled', 'no', 'false', '0'].includes(normalized)) return 'off';
  return normalized;
};

const matchesTextOperator = (fieldValue, operator, needle) => {
  const normalizedValue = normalizeLower(fieldValue);
  const normalizedNeedle = normalizeLower(needle);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesBooleanOperator = (fieldValue, operator, needle) => {
  if (operator !== 'is') return true;
  const normalizedNeedle = resolveBooleanSearchValue(needle);
  if (!normalizedNeedle) return true;
  return resolveBooleanSearchValue(fieldValue) === normalizedNeedle;
};

const normalizeSearchFieldOptions = (fields) => {
  const normalized = Array.isArray(fields) ? fields : [];
  const filtered = normalized.filter((field) => field?.id && field?.label);
  return filtered.length > 0 ? filtered : [{ id: 'title', label: 'Title', type: 'text' }];
};

const SEARCH_SCOPE_ALL = 'all';

const DEFAULT_FILTER = (id = 'patient-resource-filter-1') => ({
  id,
  field: 'title',
  operator: 'contains',
  value: '',
});

const sanitizeSearchScope = (value, allowed) => {
  if (value === SEARCH_SCOPE_ALL) return SEARCH_SCOPE_ALL;
  const options = Array.isArray(allowed) ? allowed : [];
  const hasMatch = options.some((entry) => {
    if (typeof entry === 'string') return entry === value;
    return entry?.id === value;
  });
  return hasMatch ? value : SEARCH_SCOPE_ALL;
};

const sanitizeFilterField = (value, allowed) => (
  allowed.includes(value) ? value : 'title'
);

const resolveFieldType = (fieldId, fieldMap) => (
  fieldMap?.[fieldId]?.type === 'boolean' ? 'boolean' : 'text'
);

const sanitizeFilters = (filters, getNextFilterId, allowedFields, fieldMap) => {
  if (!Array.isArray(filters)) return [DEFAULT_FILTER(getNextFilterId())];

  const nextFilters = filters
    .map((filter) => {
      const field = sanitizeFilterField(filter?.field, allowedFields);
      const fieldType = resolveFieldType(field, fieldMap);
      return {
        id: normalizeValue(filter?.id) || getNextFilterId(),
        field,
        operator: sanitizeFilterOperator(fieldType, filter?.operator),
        value: normalizeValue(filter?.value),
      };
    })
    .filter((filter) => allowedFields.includes(filter.field))
    .slice(0, 4);

  return nextFilters.length > 0 ? nextFilters : [DEFAULT_FILTER(getNextFilterId())];
};

const resolveReadableText = (value) => normalizeValue(humanizeDisplayText(value));

const resolveTimestamp = (value) => {
  const normalized = normalizeValue(value);
  if (!normalized) return 0;
  const parsed = Date.parse(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const compareByField = (leftRecord, rightRecord, field, direction) => {
  let result = 0;
  if (field === 'updatedAt' || field === 'createdAt') {
    result = resolveTimestamp(leftRecord?.[field]) - resolveTimestamp(rightRecord?.[field]);
  } else {
    result = compareText(leftRecord?.[field], rightRecord?.[field]);
  }
  return direction === 'asc' ? result : result * -1;
};

const isRecordInTenantScope = (record, canManageAllTenants, normalizedTenantId) => {
  if (canManageAllTenants) return true;
  if (!normalizedTenantId) return false;
  const recordTenantId = normalizeValue(record?.tenant_id);
  if (!recordTenantId) return false;
  return recordTenantId === normalizedTenantId;
};

const usePatientResourceListScreen = (resourceId) => {
  const config = getPatientResourceConfig(resourceId);
  const { t, locale } = useI18n();
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const searchParams = useLocalSearchParams();
  const noticeValue = useMemo(
    () => normalizeNoticeValue(searchParams?.notice),
    [searchParams]
  );
  const patientContextId = useMemo(
    () => normalizePatientContextId(searchParams?.patientId),
    [searchParams]
  );
  const { isOffline } = useNetwork();
  const {
    canAccessPatients,
    canCreatePatientRecords,
    canEditPatientRecords,
    canDeletePatientRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = usePatientAccess();

  const { list, remove, data, isLoading, errorCode, reset } = usePatientResourceCrud(resourceId);
  const {
    list: listPatients,
    data: patientLookupData,
    reset: resetPatientLookup,
  } = usePatient();
  const {
    list: listUsers,
    data: userLookupData,
    reset: resetUserLookup,
  } = useUser();

  const filterCounterRef = useRef(1);
  const [search, setSearch] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [filters, setFilters] = useState([
    {
      id: 'patient-resource-filter-1',
      field: 'title',
      operator: 'contains',
      value: '',
    },
  ]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [sortField, setSortField] = useState(DEFAULT_SORT_FIELD);
  const [sortDirection, setSortDirection] = useState(DEFAULT_SORT_DIRECTION);
  const [columnOrder, setColumnOrder] = useState([...DEFAULT_COLUMN_ORDER]);
  const [visibleColumns, setVisibleColumns] = useState([...DEFAULT_VISIBLE_COLUMNS]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [selectedRecordIds, setSelectedRecordIds] = useState([]);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);

  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => normalizeValue(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const hasPatientContext = Boolean(patientContextId);
  const requiresPatientContext = Boolean(config?.requiresPatientSelection);
  const requiresPatientContextForList = Boolean(
    requiresPatientContext && config?.allowListWithoutPatientContext !== true
  );
  const requiresPatientContextForCreate = Boolean(
    requiresPatientContext && config?.allowCreateWithoutPatientContext !== true
  );
  const requiresPatientContextForEdit = Boolean(
    requiresPatientContext && config?.allowEditWithoutPatientContext !== true
  );
  const hasRequiredListContext = !requiresPatientContextForList || hasPatientContext;
  const hasRequiredCreateContext = !requiresPatientContextForCreate || hasPatientContext;
  const hasRequiredEditContext = !requiresPatientContextForEdit || hasPatientContext;
  const canList = Boolean(config && canAccessPatients && hasScope && hasRequiredListContext);
  const canCreate = Boolean(
    canCreatePatientRecords
      && config?.supportsCreate !== false
      && hasRequiredCreateContext
  );
  const canEdit = Boolean(
    canEditPatientRecords
      && config?.supportsEdit !== false
      && hasRequiredEditContext
  );
  const canDelete = Boolean(
    canDeletePatientRecords
      && config?.supportsDelete !== false
  );

  const preferenceSubject = useMemo(
    () => (
      normalizeValue(user?.id)
      || normalizeValue(user?.user_id)
      || normalizeValue(user?.email)
      || normalizedTenantId
      || 'anonymous'
    ),
    [user, normalizedTenantId]
  );

  const preferenceKey = useMemo(
    () => `${PREFS_STORAGE_PREFIX}.${resourceId || 'unknown'}.${preferenceSubject}`,
    [resourceId, preferenceSubject]
  );

  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;

  const getNextFilterId = useCallback(() => {
    filterCounterRef.current += 1;
    return `patient-resource-filter-${filterCounterRef.current}`;
  }, []);

  const resourceLabel = useMemo(() => {
    if (!config) return '';
    const pluralLabel = t(`${config.i18nKey}.pluralLabel`);
    if (pluralLabel !== `${config.i18nKey}.pluralLabel`) return pluralLabel;
    const label = t(`${config.i18nKey}.label`);
    if (label !== `${config.i18nKey}.label`) return label;
    return humanizeDisplayText(config.id || '') || '';
  }, [config, t]);

  const listPath = useMemo(
    () => withPatientContext(config?.routePath || PATIENT_ROUTE_ROOT, patientContextId),
    [config?.routePath, patientContextId]
  );

  const shouldResolvePatientLabels = Boolean(config?.resolvePatientLabels);
  const shouldResolveUserLabels = Boolean(config?.resolveUserLabels);
  const patientLookupItems = useMemo(
    () => (shouldResolvePatientLabels ? resolveListItems(patientLookupData) : []),
    [shouldResolvePatientLabels, patientLookupData]
  );
  const userLookupItems = useMemo(
    () => (shouldResolveUserLabels ? resolveListItems(userLookupData) : []),
    [shouldResolveUserLabels, userLookupData]
  );

  const patientLabelsById = useMemo(() => {
    if (!shouldResolvePatientLabels) return {};

    return patientLookupItems.reduce((acc, patient, index) => {
      const patientId = normalizeValue(patient?.id);
      if (!patientId || Object.prototype.hasOwnProperty.call(acc, patientId)) {
        return acc;
      }

      const fallbackLabel = t('patients.common.form.unnamedPatient', { position: index + 1 });
      const label = resolvePatientDisplayLabel(patient, fallbackLabel);
      if (label) {
        acc[patientId] = label;
      }
      return acc;
    }, {});
  }, [shouldResolvePatientLabels, patientLookupItems, t]);
  const userLabelsById = useMemo(() => {
    if (!shouldResolveUserLabels) return {};

    return userLookupItems.reduce((acc, userItem, index) => {
      const userId = normalizeValue(userItem?.id);
      if (!userId || Object.prototype.hasOwnProperty.call(acc, userId)) {
        return acc;
      }

      const fallbackLabel = t(`${config?.i18nKey}.form.unnamedUser`, { position: index + 1 });
      const label = resolveUserDisplayLabel(userItem, fallbackLabel);
      if (label) {
        acc[userId] = label;
      }
      return acc;
    }, {});
  }, [shouldResolveUserLabels, userLookupItems, config?.i18nKey, t]);

  const rawItems = useMemo(() => resolveListItems(data), [data]);

  const scopedItems = useMemo(
    () =>
      rawItems
        .filter((item) => {
          if (!isRecordInTenantScope(item, canManageAllTenants, normalizedTenantId)) {
            return false;
          }
          if (config?.supportsPatientFilter && patientContextId) {
            return normalizeValue(item?.patient_id) === patientContextId;
          }
          return true;
        })
        .map((item) => {
          let resolvedItem = item;

          if (shouldResolvePatientLabels) {
            const patientLabel = resolvePatientContextLabel(item, patientLabelsById);
            if (patientLabel && normalizeValue(item?.patient_display_label) !== patientLabel) {
              resolvedItem = {
                ...resolvedItem,
                patient_display_label: patientLabel,
              };
            }
          }

          if (shouldResolveUserLabels) {
            const userLabel = resolveUserContextLabel(resolvedItem, userLabelsById);
            if (userLabel && normalizeValue(resolvedItem?.user_display_label) !== userLabel) {
              resolvedItem = {
                ...resolvedItem,
                user_display_label: userLabel,
              };
            }
          }

          return resolvedItem;
        }),
    [
      rawItems,
      canManageAllTenants,
      normalizedTenantId,
      config?.supportsPatientFilter,
      patientContextId,
      shouldResolvePatientLabels,
      patientLabelsById,
      shouldResolveUserLabels,
      userLabelsById,
    ]
  );

  const records = useMemo(
    () => scopedItems.map((item, index) => {
      const title = normalizeValue(config?.getItemTitle?.(item, t))
        || t('patients.common.list.unnamedRecord', { position: index + 1 });
      const subtitle = normalizeValue(config?.getItemSubtitle?.(item, t));
      return {
        id: normalizeValue(item?.id) || `patient-record-${index + 1}`,
        item,
        title,
        subtitle,
        updatedAt: normalizeValue(item?.updated_at),
        createdAt: normalizeValue(item?.created_at),
      };
    }),
    [scopedItems, config, t]
  );

  const searchFieldOptions = useMemo(() => {
    if (!config) return normalizeSearchFieldOptions([{ id: 'title', label: t('patients.common.list.columnTitle'), type: 'text' }]);

    const baseOptions = [
      { id: 'title', label: t('patients.common.list.columnTitle'), type: 'text' },
      { id: 'subtitle', label: t('patients.common.list.columnSubtitle'), type: 'text' },
      { id: 'updatedAt', label: t('patients.common.list.columnUpdatedAt'), type: 'text' },
      { id: 'createdAt', label: t('patients.common.list.columnCreatedAt'), type: 'text' },
    ];

    const fieldOptions = (config.fields || [])
      .map((field) => {
        const fieldLabel = t(field.labelKey);
        return {
          id: field.name,
          label: fieldLabel === field.labelKey
            ? humanizeDisplayText(field.name)
            : fieldLabel,
          type: isBooleanField(field) ? 'boolean' : 'text',
        };
      });

    const map = new Map();
    [...baseOptions, ...fieldOptions].forEach((option) => {
      if (!option?.id || map.has(option.id)) return;
      map.set(option.id, option);
    });

    return normalizeSearchFieldOptions([...map.values()]);
  }, [config, t]);

  const searchFieldMap = useMemo(
    () => searchFieldOptions.reduce((acc, option) => {
      acc[option.id] = option;
      return acc;
    }, {}),
    [searchFieldOptions]
  );

  const sanitizeFilterField = useCallback(
    (value) => (
      searchFieldOptions.some((field) => field.id === value) ? value : 'title'
    ),
    [searchFieldOptions]
  );

  const sanitizeFilters = useCallback(
    (value) => {
      if (!Array.isArray(value)) {
        return [{
          id: getNextFilterId(),
          field: 'title',
          operator: 'contains',
          value: '',
        }];
      }

      const normalized = value
        .map((filter) => {
          const field = sanitizeFilterField(filter?.field);
          const fieldType = searchFieldMap[field]?.type === 'boolean' ? 'boolean' : 'text';
          return {
            id: normalizeValue(filter?.id) || getNextFilterId(),
            field,
            operator: sanitizeFilterOperator(fieldType, filter?.operator),
            value: normalizeValue(filter?.value),
          };
        })
        .filter((filter) => Boolean(searchFieldMap[filter.field]));

      if (normalized.length === 0) {
        return [{
          id: getNextFilterId(),
          field: 'title',
          operator: 'contains',
          value: '',
        }];
      }

      return normalized.slice(0, 4);
    },
    [getNextFilterId, sanitizeFilterField, searchFieldMap]
  );

  const searchFieldOptionsRef = useRef(searchFieldOptions);
  const sanitizeFiltersRef = useRef(sanitizeFilters);

  useEffect(() => {
    searchFieldOptionsRef.current = searchFieldOptions;
  }, [searchFieldOptions]);

  useEffect(() => {
    sanitizeFiltersRef.current = sanitizeFilters;
  }, [sanitizeFilters]);

  const activeFilters = useMemo(
    () => sanitizeFilters(filters).filter((filter) => normalizeValue(filter.value).length > 0),
    [filters, sanitizeFilters]
  );

  const resolveFieldValue = useCallback(
    (record, fieldId) => {
      if (fieldId === 'title' || fieldId === 'subtitle' || fieldId === 'updatedAt' || fieldId === 'createdAt') {
        return normalizeValue(record?.[fieldId]);
      }

      const option = searchFieldMap[fieldId];
      const rawValue = record?.item?.[fieldId];
      if (option?.type === 'boolean') {
        return rawValue ? 'on' : 'off';
      }
      return normalizeValue(humanizeDisplayText(rawValue));
    },
    [searchFieldMap]
  );

  const matchesSearch = useCallback(
    (record) => {
      const query = normalizeValue(search);
      if (!query) return true;

      if (searchScope === 'all') {
        return searchFieldOptions.some((option) => {
          const fieldValue = resolveFieldValue(record, option.id);
          if (option.type === 'boolean') {
            return matchesBooleanOperator(fieldValue, 'is', query);
          }
          return matchesTextOperator(fieldValue, 'contains', query);
        });
      }

      const option = searchFieldMap[searchScope];
      if (!option) return true;
      const fieldValue = resolveFieldValue(record, option.id);
      if (option.type === 'boolean') {
        return matchesBooleanOperator(fieldValue, 'is', query);
      }
      return matchesTextOperator(fieldValue, 'contains', query);
    },
    [search, searchScope, searchFieldMap, searchFieldOptions, resolveFieldValue]
  );

  const matchesFilter = useCallback(
    (record, filter) => {
      const option = searchFieldMap[filter.field];
      if (!option) return true;
      const value = normalizeValue(filter.value);
      if (!value) return true;

      const fieldValue = resolveFieldValue(record, option.id);
      if (option.type === 'boolean') {
        return matchesBooleanOperator(fieldValue, filter.operator, value);
      }
      return matchesTextOperator(fieldValue, filter.operator, value);
    },
    [resolveFieldValue, searchFieldMap]
  );

  const filteredRecords = useMemo(
    () => records.filter((record) => {
      if (!matchesSearch(record)) return false;
      if (activeFilters.length === 0) return true;

      const matches = activeFilters.map((filter) => matchesFilter(record, filter));
      if (filterLogic === 'OR') return matches.some(Boolean);
      return matches.every(Boolean);
    }),
    [records, matchesSearch, activeFilters, matchesFilter, filterLogic]
  );

  const sortedRecords = useMemo(
    () => stableSort(
      filteredRecords,
      (left, right) => compareByField(left, right, sortField, sortDirection)
    ),
    [filteredRecords, sortField, sortDirection]
  );

  const totalItems = sortedRecords.length;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );
  const pagedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedRecords.slice(start, end);
  }, [sortedRecords, page, pageSize]);

  const currentPageRecordIds = useMemo(
    () => pagedRecords.map((record) => record.id).filter(Boolean),
    [pagedRecords]
  );

  const selectedOnPageCount = useMemo(
    () => currentPageRecordIds.filter((id) => selectedRecordIds.includes(id)).length,
    [currentPageRecordIds, selectedRecordIds]
  );

  const allPageSelected = currentPageRecordIds.length > 0
    && selectedOnPageCount === currentPageRecordIds.length;

  const hasActiveSearchOrFilter = normalizeValue(search).length > 0 || activeFilters.length > 0;
  const hasNoResults = hasActiveSearchOrFilter && pagedRecords.length === 0 && records.length > 0;

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, `${config?.i18nKey}.list.loadError`),
    [t, errorCode, config?.i18nKey]
  );

  const fetchList = useCallback(() => {
    if (!config || !isResolved || !canList || isOffline) return;

    const params = {
      page: normalizeFetchPage(config?.listParams?.page ?? DEFAULT_FETCH_PAGE),
      limit: normalizeFetchLimit(config?.listParams?.limit ?? DEFAULT_FETCH_LIMIT),
    };

    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    if (config.supportsFacility && !canManageAllTenants && normalizedFacilityId) {
      params.facility_id = normalizedFacilityId;
    }

    if (config.supportsPatientFilter && patientContextId) {
      params.patient_id = patientContextId;
    }

    reset();
    list(params);
  }, [
    config,
    isResolved,
    canList,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    normalizedFacilityId,
    patientContextId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!shouldResolvePatientLabels || !isResolved || !canAccessPatients || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = {
      page: DEFAULT_FETCH_PAGE,
      limit: PATIENT_LOOKUP_LIMIT,
    };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    resetPatientLookup();
    listPatients(params);
  }, [
    shouldResolvePatientLabels,
    isResolved,
    canAccessPatients,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    resetPatientLookup,
    listPatients,
  ]);

  useEffect(() => {
    if (!shouldResolveUserLabels || !isResolved || !canAccessPatients || isOffline) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = {
      page: DEFAULT_FETCH_PAGE,
      limit: USER_LOOKUP_LIMIT,
    };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    resetUserLookup();
    listUsers(params);
  }, [
    shouldResolveUserLabels,
    isResolved,
    canAccessPatients,
    isOffline,
    canManageAllTenants,
    normalizedTenantId,
    resetUserLookup,
    listUsers,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessPatients || !hasScope || !config) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessPatients, hasScope, config, router]);

  useEffect(() => {
    if (!canList || isOffline) return;
    fetchList();
  }, [canList, isOffline, fetchList]);

  useEffect(() => {
    if (!noticeValue || !config) return;
    const message = buildNoticeMessage(t, noticeValue, resourceLabel);
    if (!message) return;
    setNoticeMessage(message);
    router.replace(listPath);
  }, [noticeValue, config, t, resourceLabel, router, listPath]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !config) return;
    if (!isAccessDeniedError(errorCode)) return;
    const message = buildNoticeMessage(t, 'accessDenied', resourceLabel);
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, config, errorCode, t, resourceLabel]);

  const handleDismissNotice = useCallback(() => {
    setNoticeMessage(null);
  }, []);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const resolveRecordById = useCallback(
    (recordId) => pagedRecords.find((record) => record.id === recordId)?.item
      || sortedRecords.find((record) => record.id === recordId)?.item
      || null,
    [pagedRecords, sortedRecords]
  );

  const hasRecordAccess = useCallback(
    (record) => isRecordInTenantScope(record, canManageAllTenants, normalizedTenantId),
    [canManageAllTenants, normalizedTenantId]
  );

  const handleItemPress = useCallback(
    (id) => {
      if (!config) return;
      const normalizedId = normalizeSearchParam(id);
      if (!normalizedId) return;

      const targetRecord = resolveRecordById(normalizedId);
      if (!hasRecordAccess(targetRecord)) {
        const separator = listPath.includes('?') ? '&' : '?';
        router.push(`${listPath}${separator}notice=accessDenied`);
        return;
      }

      router.push(withPatientContext(`${config.routePath}/${normalizedId}`, patientContextId));
    },
    [config, resolveRecordById, hasRecordAccess, listPath, router, patientContextId]
  );

  const handleAdd = useCallback(() => {
    if (!canCreate || !config) return;
    router.push(withPatientContext(`${config.routePath}/create`, patientContextId));
  }, [canCreate, config, router, patientContextId]);

  const handleEdit = useCallback(
    (id, event) => {
      if (event?.stopPropagation) event.stopPropagation();
      if (!canEdit || !config) return;

      const normalizedId = normalizeSearchParam(id);
      if (!normalizedId) return;

      const targetRecord = resolveRecordById(normalizedId);
      if (!hasRecordAccess(targetRecord)) {
        const separator = listPath.includes('?') ? '&' : '?';
        router.push(`${listPath}${separator}notice=accessDenied`);
        return;
      }

      router.push(withPatientContext(`${config.routePath}/${normalizedId}/edit`, patientContextId));
    },
    [canEdit, config, resolveRecordById, hasRecordAccess, listPath, router, patientContextId]
  );

  const handleDelete = useCallback(
    async (id, event) => {
      if (!canDelete || !config) return;
      if (event?.stopPropagation) event.stopPropagation();

      const normalizedId = normalizeSearchParam(id);
      if (!normalizedId) return;

      const targetRecord = resolveRecordById(normalizedId);
      if (!hasRecordAccess(targetRecord)) {
        const separator = listPath.includes('?') ? '&' : '?';
        router.push(`${listPath}${separator}notice=accessDenied`);
        return;
      }

      if (!confirmAction(t('common.confirmDelete'))) return;

      try {
        const result = await remove(normalizedId);
        if (!result) return;
        fetchList();
        setSelectedRecordIds((previous) => previous.filter((value) => value !== normalizedId));
        const message = buildNoticeMessage(t, isOffline ? 'queued' : 'deleted', resourceLabel);
        if (message) setNoticeMessage(message);
      } catch {
        // Hook-level error handling already updates state.
      }
    },
    [
      canDelete,
      config,
      resolveRecordById,
      hasRecordAccess,
      listPath,
      router,
      t,
      remove,
      fetchList,
      isOffline,
      resourceLabel,
    ]
  );

  const handleSearch = useCallback((value) => {
    setSearch(value ?? '');
    setPage(1);
  }, []);

  const handleSearchScopeChange = useCallback((value) => {
    setSearchScope(sanitizeSearchScope(value, searchFieldOptions));
    setPage(1);
  }, [searchFieldOptions]);

  const handleFilterLogicChange = useCallback((value) => {
    setFilterLogic(sanitizeFilterLogic(value));
    setPage(1);
  }, []);

  const handleFilterFieldChange = useCallback(
    (filterId, value) => {
      setFilters((previous) => previous.map((filter) => {
        if (filter.id !== filterId) return filter;
        const field = sanitizeFilterField(value);
        const fieldType = searchFieldMap[field]?.type === 'boolean' ? 'boolean' : 'text';
        return {
          ...filter,
          field,
          operator: getDefaultOperator(fieldType),
          value: '',
        };
      }));
      setPage(1);
    },
    [sanitizeFilterField, searchFieldMap]
  );

  const handleFilterOperatorChange = useCallback(
    (filterId, value) => {
      setFilters((previous) => previous.map((filter) => {
        if (filter.id !== filterId) return filter;
        const fieldType = searchFieldMap[filter.field]?.type === 'boolean' ? 'boolean' : 'text';
        return {
          ...filter,
          operator: sanitizeFilterOperator(fieldType, value),
        };
      }));
      setPage(1);
    },
    [searchFieldMap]
  );

  const handleFilterValueChange = useCallback((filterId, value) => {
    setFilters((previous) => previous.map((filter) => {
      if (filter.id !== filterId) return filter;
      return { ...filter, value: normalizeValue(value) };
    }));
    setPage(1);
  }, []);

  const handleAddFilter = useCallback(() => {
    setFilters((previous) => {
      if (previous.length >= 4) return previous;
      return [
        ...previous,
        {
          id: getNextFilterId(),
          field: 'title',
          operator: 'contains',
          value: '',
        },
      ];
    });
    setPage(1);
  }, [getNextFilterId]);

  const handleRemoveFilter = useCallback(
    (filterId) => {
      setFilters((previous) => {
        const next = previous.filter((filter) => filter.id !== filterId);
        if (next.length > 0) return next;
        return [{
          id: getNextFilterId(),
          field: 'title',
          operator: 'contains',
          value: '',
        }];
      });
      setPage(1);
    },
    [getNextFilterId]
  );

  const handleClearSearchAndFilters = useCallback(() => {
    setSearch('');
    setSearchScope('all');
    setFilterLogic('AND');
    setFilters([{
      id: getNextFilterId(),
      field: 'title',
      operator: 'contains',
      value: '',
    }]);
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
      setSortDirection(DEFAULT_SORT_DIRECTION);
      return nextField;
    });
    setPage(1);
  }, []);

  const handlePageChange = useCallback((value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    const nextPage = Math.max(1, Math.min(Math.trunc(numeric), totalPages));
    setPage(nextPage);
  }, [totalPages]);

  const handlePageSizeChange = useCallback((value) => {
    setPageSize(sanitizePageSize(value));
    setPage(1);
  }, []);

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
      const index = ordered.indexOf(column);
      if (index < 0) return ordered;
      const target = direction === 'left' ? index - 1 : index + 1;
      if (target < 0 || target >= ordered.length) return ordered;
      const next = [...ordered];
      const [value] = next.splice(index, 1);
      next.splice(target, 0, value);
      return next;
    });
  }, []);

  const handleToggleRecordSelection = useCallback((id) => {
    const normalized = normalizeValue(id);
    if (!normalized) return;
    setSelectedRecordIds((previous) => {
      if (previous.includes(normalized)) {
        return previous.filter((value) => value !== normalized);
      }
      return [...previous, normalized];
    });
  }, []);

  const handleTogglePageSelection = useCallback((checked) => {
    setSelectedRecordIds((previous) => {
      if (!checked) {
        const onPage = new Set(currentPageRecordIds);
        return previous.filter((value) => !onPage.has(value));
      }
      const merged = new Set([...previous, ...currentPageRecordIds]);
      return [...merged];
    });
  }, [currentPageRecordIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedRecordIds([]);
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (!canDelete || selectedRecordIds.length === 0) return;
    if (!confirmAction(t('patients.common.list.bulkDeleteConfirm', { count: selectedRecordIds.length }))) {
      return;
    }

    let deleted = 0;
    for (const recordId of selectedRecordIds) {
      const targetRecord = resolveRecordById(recordId);
      if (!hasRecordAccess(targetRecord)) continue;
      try {
        const result = await remove(recordId);
        if (result) deleted += 1;
      } catch {
        // Hook-level error handling already updates state.
      }
    }

    if (deleted > 0) {
      fetchList();
      const message = buildNoticeMessage(t, isOffline ? 'queued' : 'deleted', resourceLabel);
      if (message) setNoticeMessage(message);
    }

    setSelectedRecordIds([]);
  }, [
    canDelete,
    selectedRecordIds,
    t,
    resolveRecordById,
    hasRecordAccess,
    remove,
    fetchList,
    isOffline,
    resourceLabel,
  ]);

  useEffect(() => {
    setPage(1);
  }, [search, searchScope, activeFilters, filterLogic, sortField, sortDirection, pageSize]);

  useEffect(() => {
    setPage((previous) => Math.min(Math.max(previous, 1), totalPages));
  }, [totalPages]);

  useEffect(() => {
    const availableIds = new Set(sortedRecords.map((record) => record.id).filter(Boolean));
    setSelectedRecordIds((previous) => {
      const next = previous.filter((value) => availableIds.has(value));
      if (next.length === previous.length && next.every((value, index) => value === previous[index])) {
        return previous;
      }
      return next;
    });
  }, [sortedRecords]);

  useEffect(() => {
    let cancelled = false;
    setIsPreferencesLoaded(false);

    const loadPreferences = async () => {
      const stored = await asyncStorage.getItem(preferenceKey);
      if (cancelled) return;

      if (stored && typeof stored === 'object') {
        setColumnOrder(sanitizeColumns(stored.columnOrder, DEFAULT_COLUMN_ORDER));
        setVisibleColumns(sanitizeColumns(stored.visibleColumns, DEFAULT_VISIBLE_COLUMNS));
        setSortField(sanitizeSortField(stored.sortField));
        setSortDirection(sanitizeSortDirection(stored.sortDirection));
        setPageSize(sanitizePageSize(stored.pageSize));
        setDensity(sanitizeDensity(stored.density));
        setSearchScope(sanitizeSearchScope(stored.searchScope, searchFieldOptionsRef.current));
        setFilterLogic(sanitizeFilterLogic(stored.filterLogic));
        setFilters(sanitizeFiltersRef.current(stored.filters));
      }

      setIsPreferencesLoaded(true);
    };

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, [preferenceKey]);

  useEffect(() => {
    if (!isPreferencesLoaded) return;

    asyncStorage.setItem(preferenceKey, {
      columnOrder,
      visibleColumns,
      sortField,
      sortDirection,
      pageSize,
      density,
      searchScope,
      filterLogic,
      filters,
    });
  }, [
    isPreferencesLoaded,
    preferenceKey,
    columnOrder,
    visibleColumns,
    sortField,
    sortDirection,
    pageSize,
    density,
    searchScope,
    filterLogic,
    filters,
  ]);

  const searchScopeOptions = useMemo(
    () => [
      { value: 'all', label: t('patients.common.list.searchScopeAll') },
      ...searchFieldOptions.map((field) => ({
        value: field.id,
        label: field.label,
      })),
    ],
    [searchFieldOptions, t]
  );

  const filterFieldOptions = useMemo(
    () => searchFieldOptions.map((field) => ({
      value: field.id,
      label: field.label,
    })),
    [searchFieldOptions]
  );

  const filterLogicOptions = useMemo(
    () => [
      { value: 'AND', label: t('patients.common.list.filterLogicAnd') },
      { value: 'OR', label: t('patients.common.list.filterLogicOr') },
    ],
    [t]
  );

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: String(value) })),
    []
  );

  const densityOptions = useMemo(
    () => [
      { value: 'compact', label: t('patients.common.list.densityCompact') },
      { value: 'comfortable', label: t('patients.common.list.densityComfortable') },
    ],
    [t]
  );

  const orderedColumns = useMemo(() => {
    const normalized = sanitizeColumns(columnOrder, DEFAULT_COLUMN_ORDER);
    const missing = TABLE_COLUMNS.filter((column) => !normalized.includes(column));
    return [...normalized, ...missing];
  }, [columnOrder]);

  const visibleOrderedColumns = useMemo(() => {
    const visibleSet = new Set(visibleColumns);
    const filtered = orderedColumns.filter((column) => visibleSet.has(column));
    if (filtered.length > 0) return filtered;
    return ['title'];
  }, [orderedColumns, visibleColumns]);

  const visibleRecords = useMemo(
    () => pagedRecords.map((record) => record.item),
    [pagedRecords]
  );

  const resolveFilterOperatorOptions = useCallback(
    (fieldId) => {
      const fieldType = searchFieldMap[fieldId]?.type === 'boolean' ? 'boolean' : 'text';
      const operators = fieldType === 'boolean' ? BOOLEAN_OPERATORS : TEXT_OPERATORS;
      return operators.map((operator) => ({
        value: operator,
        label: t(`patients.common.list.filterOperator.${operator}`),
      }));
    },
    [searchFieldMap, t]
  );

  const helpContent = useMemo(() => ({
    label: t('patients.common.list.helpLabel', { resource: resourceLabel }),
    tooltip: t('patients.common.list.helpTooltip', { resource: resourceLabel }),
    title: t('patients.common.list.helpTitle', { resource: resourceLabel }),
    body: t('patients.common.list.helpBody', { resource: resourceLabel }),
    items: [
      t('patients.common.list.helpItems.search'),
      t('patients.common.list.helpItems.filter'),
      t('patients.common.list.helpItems.actions'),
      t('patients.common.list.helpItems.recovery'),
    ],
  }), [t, resourceLabel]);

  return {
    config,
    locale,
    resourceLabel,
    listPath,
    items: visibleRecords,
    pagedRecords,
    totalItems,
    totalPages,
    page,
    pageSize,
    pageSizeOptions,
    density,
    densityOptions,
    search,
    searchScope,
    searchScopeOptions,
    filters: sanitizeFilters(filters),
    filterFieldOptions,
    filterLogic,
    filterLogicOptions,
    canAddFilter: sanitizeFilters(filters).length < 4,
    hasNoResults,
    hasActiveSearchOrFilter,
    sortField,
    sortDirection,
    columnOrder: orderedColumns,
    visibleColumns: visibleOrderedColumns,
    allColumns: TABLE_COLUMNS,
    selectedRecordIds,
    allPageSelected,
    isTableMode,
    isTableSettingsOpen,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    helpContent,
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
    onPageSizeChange: handlePageSizeChange,
    onDensityChange: handleDensityChange,
    onToggleColumnVisibility: handleToggleColumnVisibility,
    onMoveColumnLeft: (column) => handleMoveColumn(column, 'left'),
    onMoveColumnRight: (column) => handleMoveColumn(column, 'right'),
    onOpenTableSettings: () => setIsTableSettingsOpen(true),
    onCloseTableSettings: () => setIsTableSettingsOpen(false),
    onResetTablePreferences: () => {
      setColumnOrder([...DEFAULT_COLUMN_ORDER]);
      setVisibleColumns([...DEFAULT_VISIBLE_COLUMNS]);
      setSortField(DEFAULT_SORT_FIELD);
      setSortDirection(DEFAULT_SORT_DIRECTION);
      setPageSize(DEFAULT_PAGE_SIZE);
      setDensity(DEFAULT_DENSITY);
      setSearchScope('all');
      setFilterLogic('AND');
      setFilters([{
        id: getNextFilterId(),
        field: 'title',
        operator: 'contains',
        value: '',
      }]);
      setPage(1);
      setSelectedRecordIds([]);
    },
    onToggleRecordSelection: handleToggleRecordSelection,
    onTogglePageSelection: handleTogglePageSelection,
    onClearSelection: handleClearSelection,
    onBulkDelete: canDelete ? handleBulkDelete : undefined,
    resolveFilterOperatorOptions,
    onItemPress: handleItemPress,
    onEdit: canEdit ? handleEdit : undefined,
    onDelete: canDelete ? handleDelete : undefined,
    onAdd: canCreate ? handleAdd : undefined,
    canCreate,
    canEdit,
    canDelete,
    createBlockedReason: canCreatePatientRecords
      ? hasRequiredCreateContext ? '' : t('patients.common.list.patientContextRequired')
      : t('patients.access.createDenied'),
    deleteBlockedReason: canDelete ? '' : t('patients.access.deleteDenied'),
  };
};

export default usePatientResourceListScreen;

