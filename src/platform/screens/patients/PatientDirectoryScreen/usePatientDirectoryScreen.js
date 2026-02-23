import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useDebounce, useI18n, useNetwork, usePatient, usePatientAccess } from '@hooks';
import { confirmAction } from '@utils';
import { isEntitlementDeniedError, resolveErrorMessage } from '../patientScreenUtils';

const PAGE_SIZE_OPTIONS = Object.freeze([20, 50, 100]);
const SORT_FIELDS = Object.freeze([
  'updated_at',
  'created_at',
  'human_friendly_id',
  'first_name',
  'last_name',
  'date_of_birth',
  'gender',
]);
const ORDER_FIELDS = Object.freeze(['asc', 'desc']);
const GENDER_FILTER_VALUES = Object.freeze(['', 'MALE', 'FEMALE', 'OTHER', 'UNKNOWN']);
const APPOINTMENT_STATUS_FILTER_VALUES = Object.freeze([
  '',
  'SCHEDULED',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
]);
const DATE_PRESET_VALUES = Object.freeze([
  'CUSTOM',
  'TODAY',
  'LAST_7_DAYS',
  'LAST_30_DAYS',
  'THIS_MONTH',
  'LAST_MONTH',
]);

const DEFAULT_FILTERS = Object.freeze({
  patient_id: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  contact: '',
  appointment_status: '',
  created_from: '',
  created_to: '',
  appointment_from: '',
  appointment_to: '',
});

const DEFAULT_RANGE_PRESETS = Object.freeze({
  created: 'CUSTOM',
  appointments: 'CUSTOM',
});

const sanitizeString = (value) => String(value || '').trim();
const sanitizePrimitiveValue = (value) => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  return '';
};
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sanitizeNumber = (value, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.trunc(numeric);
};

const resolveItems = (data) => {
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  return [];
};

const resolvePagination = (data, fallbackPage, fallbackLimit, totalItems) => {
  const pagination = data?.pagination || {};
  const page = sanitizeNumber(pagination.page, fallbackPage);
  const limit = sanitizeNumber(pagination.limit, fallbackLimit);
  const total = sanitizeNumber(pagination.total, totalItems);
  const totalPages = sanitizeNumber(
    pagination.totalPages,
    Math.max(1, Math.ceil((total || 0) / Math.max(1, limit || fallbackLimit)))
  );

  return {
    page: page > 0 ? page : fallbackPage,
    limit: limit > 0 ? limit : fallbackLimit,
    total: total >= 0 ? total : totalItems,
    totalPages: totalPages > 0 ? totalPages : 1,
    hasNextPage: Boolean(pagination.hasNextPage),
    hasPreviousPage: Boolean(pagination.hasPreviousPage),
  };
};

const resolvePatientName = (patient, fallback) => {
  const firstName = sanitizeString(patient?.first_name);
  const lastName = sanitizeString(patient?.last_name);
  if (firstName && lastName && firstName.toLowerCase() === lastName.toLowerCase()) {
    return firstName;
  }
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName) return fullName;

  const readable = [
    patient?.human_friendly_id,
    patient?.patient_code,
    patient?.patient_number,
    patient?.medical_record_number,
  ]
    .map(sanitizeString)
    .find(Boolean);
  return readable || fallback;
};

const resolveContextLabel = (context, fallback) => {
  const label = sanitizeString(context?.label || context?.name);
  const contextId = sanitizeString(context?.id);
  const friendlyId = sanitizeString(
    context?.human_friendly_id
    || context?.humanFriendlyId
    || (contextId && !UUID_PATTERN.test(contextId) ? contextId : '')
  );
  if (label && friendlyId) return `${label} (${friendlyId})`;
  return label || friendlyId || fallback;
};

const composeContextLabel = (label, humanFriendlyId, fallback) => {
  const normalizedLabel = sanitizeString(label);
  const normalizedHumanFriendlyId = sanitizeString(humanFriendlyId);
  if (normalizedLabel && normalizedHumanFriendlyId) {
    return `${normalizedLabel} (${normalizedHumanFriendlyId})`;
  }
  return normalizedLabel || normalizedHumanFriendlyId || fallback;
};

const resolveContactEntryValue = (entry) => {
  if (entry == null) return '';
  if (typeof entry === 'string' || typeof entry === 'number') {
    return sanitizePrimitiveValue(entry);
  }

  return [
    entry?.value,
    entry?.contact_value,
    entry?.contact,
    entry?.phone,
    entry?.phone_number,
    entry?.mobile,
    entry?.mobile_number,
    entry?.telephone,
    entry?.tel,
    entry?.email,
    entry?.email_address,
  ]
    .map((value) => sanitizePrimitiveValue(value))
    .find(Boolean) || '';
};

const resolvePatientContactLabel = (patient, fallback = '') => {
  const directContactValue = [
    patient?.contact,
    patient?.contact_label,
    patient?.contact_value,
    patient?.primary_contact,
    patient?.phone,
    patient?.phone_number,
    patient?.mobile,
    patient?.mobile_number,
    patient?.telephone,
    patient?.tel,
    patient?.email,
    patient?.email_address,
    patient?.primary_phone,
    patient?.primary_phone_number,
  ]
    .map((value) => sanitizePrimitiveValue(value))
    .find(Boolean);
  if (directContactValue) return directContactValue;

  const nestedContactValue = [
    patient?.primary_contact_details,
    patient?.primary_contact_detail,
    patient?.primaryContact,
    patient?.contact,
  ]
    .map((entry) => resolveContactEntryValue(entry))
    .find(Boolean);
  if (nestedContactValue) return nestedContactValue;

  const contactCollections = [
    patient?.contacts,
    patient?.patient_contacts,
    patient?.contact_entries,
    patient?.contact_list,
  ];

  for (let index = 0; index < contactCollections.length; index += 1) {
    const collection = contactCollections[index];
    if (!Array.isArray(collection) || collection.length === 0) continue;
    const value = collection
      .map((entry) => resolveContactEntryValue(entry))
      .find(Boolean);
    if (value) return value;
  }

  return fallback;
};

const formatDateInput = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const resolveDatePresetRange = (preset) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'TODAY':
      return {
        from: formatDateInput(today),
        to: formatDateInput(today),
      };
    case 'LAST_7_DAYS': {
      const fromDate = new Date(today);
      fromDate.setDate(fromDate.getDate() - 6);
      return {
        from: formatDateInput(fromDate),
        to: formatDateInput(today),
      };
    }
    case 'LAST_30_DAYS': {
      const fromDate = new Date(today);
      fromDate.setDate(fromDate.getDate() - 29);
      return {
        from: formatDateInput(fromDate),
        to: formatDateInput(today),
      };
    }
    case 'THIS_MONTH': {
      const fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        from: formatDateInput(fromDate),
        to: formatDateInput(today),
      };
    }
    case 'LAST_MONTH': {
      const fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const toDate = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        from: formatDateInput(fromDate),
        to: formatDateInput(toDate),
      };
    }
    default:
      return {
        from: '',
        to: '',
      };
  }
};

const normalizeFilterState = (filters = {}) => ({
  patient_id: sanitizeString(filters.patient_id),
  first_name: sanitizeString(filters.first_name),
  last_name: sanitizeString(filters.last_name),
  date_of_birth: sanitizeString(filters.date_of_birth),
  gender: sanitizeString(filters.gender),
  contact: sanitizeString(filters.contact),
  appointment_status: sanitizeString(filters.appointment_status),
  created_from: sanitizeString(filters.created_from),
  created_to: sanitizeString(filters.created_to),
  appointment_from: sanitizeString(filters.appointment_from),
  appointment_to: sanitizeString(filters.appointment_to),
});

const toFilterQuery = (filters = {}) =>
  Object.entries(normalizeFilterState(filters)).reduce((acc, [key, value]) => {
    if (value) acc[key] = value;
    return acc;
  }, {});

const usePatientDirectoryScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { list, data, isLoading, errorCode, reset, remove } = usePatient();
  const {
    canAccessPatients,
    canCreatePatientRecords,
    canManageAllTenants,
    tenantId,
    tenantName,
    tenantHumanFriendlyId,
    facilityId,
    facilityName,
    facilityHumanFriendlyId,
    isResolved,
  } = usePatientAccess();

  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('updated_at');
  const [order, setOrder] = useState('asc');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [dateRangePresets, setDateRangePresets] = useState(DEFAULT_RANGE_PRESETS);
  const draftFiltersRef = useRef(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(searchValue, 300);

  const normalizedTenantId = sanitizeString(tenantId);
  const normalizedFacilityId = sanitizeString(facilityId);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const isEntitlementBlocked = isEntitlementDeniedError(errorCode);
  const normalizedAppliedFilters = useMemo(
    () => toFilterQuery(appliedFilters),
    [appliedFilters]
  );
  const hasActiveFilters = Object.keys(normalizedAppliedFilters).length > 0;
  const scopedTenantFallbackLabel = useMemo(
    () => composeContextLabel(tenantName, tenantHumanFriendlyId, t('patients.directory.unassignedTenant')),
    [tenantHumanFriendlyId, tenantName, t]
  );
  const scopedFacilityFallbackLabel = useMemo(
    () => composeContextLabel(facilityName, facilityHumanFriendlyId, t('patients.directory.unassignedFacility')),
    [facilityHumanFriendlyId, facilityName, t]
  );

  const fetchList = useCallback(() => {
    if (!canAccessPatients || !hasScope || isOffline) return;

    const boundedPageSize = PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : 20;
    const params = {
      page: page > 0 ? page : 1,
      limit: boundedPageSize,
      sort_by: SORT_FIELDS.includes(sortBy) ? sortBy : 'updated_at',
      order: ORDER_FIELDS.includes(order) ? order : 'asc',
      search: sanitizeString(debouncedSearch) || undefined,
      ...normalizedAppliedFilters,
    };

    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
      if (normalizedFacilityId) {
        params.facility_id = normalizedFacilityId;
      }
    }

    reset();
    list(params);
  }, [
    canAccessPatients,
    hasScope,
    isOffline,
    pageSize,
    page,
    sortBy,
    order,
    debouncedSearch,
    normalizedAppliedFilters,
    canManageAllTenants,
    normalizedTenantId,
    normalizedFacilityId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessPatients || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessPatients, hasScope, router]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const rawItems = useMemo(() => resolveItems(data), [data]);
  const items = useMemo(
    () =>
      rawItems.map((patient, index) => {
        const routePatientId = sanitizeString(patient?.human_friendly_id);
        return {
          id: sanitizeString(patient?.id),
          routePatientId,
          displayName: resolvePatientName(
            patient,
            t('patients.overview.unnamedPatient', { position: index + 1 })
          ),
          humanFriendlyId: routePatientId || '-',
          tenantLabel: resolveContextLabel(
            patient?.tenant_context || {
              label: patient?.tenant_label,
              human_friendly_id: patient?.tenant_human_friendly_id,
            },
            scopedTenantFallbackLabel
          ),
          facilityLabel: resolveContextLabel(
            patient?.facility_context || {
              label: patient?.facility_label,
              human_friendly_id: patient?.facility_human_friendly_id,
            },
            scopedFacilityFallbackLabel
          ),
          contactLabel: resolvePatientContactLabel(patient, ''),
          updatedAt: sanitizeString(patient?.updated_at) || '-',
        };
      }),
    [rawItems, scopedFacilityFallbackLabel, scopedTenantFallbackLabel, t]
  );

  const pagination = useMemo(
    () => resolvePagination(data, page, pageSize, items.length),
    [data, page, pageSize, items.length]
  );
  const totalPages = pagination.totalPages;

  const hasError = isResolved && Boolean(errorCode) && !isEntitlementBlocked;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'patients.directory.loadError'),
    [t, errorCode]
  );

  const onSearch = useCallback((value) => {
    setSearchValue(String(value || ''));
    setPage(1);
  }, []);

  const onSortBy = useCallback((value) => {
    setSortBy(SORT_FIELDS.includes(value) ? value : 'updated_at');
    setPage(1);
  }, []);

  const onOrder = useCallback((value) => {
    setOrder(ORDER_FIELDS.includes(value) ? value : 'asc');
    setPage(1);
  }, []);

  const onPageSize = useCallback((value) => {
    const numeric = Number(value);
    setPageSize(PAGE_SIZE_OPTIONS.includes(numeric) ? numeric : 20);
    setPage(1);
  }, []);

  const onPreviousPage = useCallback(() => {
    setPage((current) => Math.max(1, current - 1));
  }, []);

  const onNextPage = useCallback(() => {
    setPage((current) => Math.min(totalPages, current + 1));
  }, [totalPages]);

  const onOpenPatient = useCallback(
    (routePatientId) => {
      const normalizedId = sanitizeString(routePatientId);
      if (!normalizedId) return;
      router.push(`/patients/patients/${encodeURIComponent(normalizedId)}`);
    },
    [router]
  );

  const onEditPatient = useCallback(
    (routePatientId) => {
      if (!canCreatePatientRecords) return;
      const normalizedId = sanitizeString(routePatientId);
      if (!normalizedId) return;
      router.push(`/patients/patients/${encodeURIComponent(normalizedId)}/edit`);
    },
    [canCreatePatientRecords, router]
  );

  const onDeletePatient = useCallback(
    async (patientId) => {
      if (!canCreatePatientRecords) return;
      const normalizedId = sanitizeString(patientId);
      if (!normalizedId) return;
      if (!confirmAction(t('common.confirmDelete'))) return;

      const result = await remove(normalizedId);
      if (result === undefined) return;
      fetchList();
    },
    [canCreatePatientRecords, fetchList, remove, t]
  );

  const onQuickCreate = useCallback(() => {
    if (!canCreatePatientRecords) return;
    router.push('/patients/patients/create');
  }, [canCreatePatientRecords, router]);

  const onRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const onGoToSubscriptions = useCallback(() => {
    router.push('/subscriptions/subscriptions');
  }, [router]);

  const onToggleFilterPanel = useCallback(() => {
    setIsFilterPanelOpen((current) => !current);
  }, []);

  const commitDraftFilters = useCallback((nextFiltersOrUpdater) => {
    const nextFilters = typeof nextFiltersOrUpdater === 'function'
      ? nextFiltersOrUpdater(draftFiltersRef.current)
      : nextFiltersOrUpdater;
    const normalized = normalizeFilterState(nextFilters);
    draftFiltersRef.current = normalized;
    setDraftFilters(normalized);
  }, []);

  const onFilterChange = useCallback((name, value) => {
    commitDraftFilters((current) => ({
      ...current,
      [name]: sanitizeString(value),
    }));
  }, [commitDraftFilters]);

  const onDateRangePresetChange = useCallback((scope, preset) => {
    const normalizedPreset = DATE_PRESET_VALUES.includes(preset) ? preset : 'CUSTOM';
    const fromKey = scope === 'created' ? 'created_from' : 'appointment_from';
    const toKey = scope === 'created' ? 'created_to' : 'appointment_to';

    setDateRangePresets((current) => ({
      ...current,
      [scope]: normalizedPreset,
    }));

    if (normalizedPreset === 'CUSTOM') return;

    const { from, to } = resolveDatePresetRange(normalizedPreset);
    commitDraftFilters((current) => ({
      ...current,
      [fromKey]: from,
      [toKey]: to,
    }));
  }, [commitDraftFilters]);

  const onDateRangeValueChange = useCallback((scope, boundary, value) => {
    const targetKey = scope === 'created'
      ? (boundary === 'from' ? 'created_from' : 'created_to')
      : (boundary === 'from' ? 'appointment_from' : 'appointment_to');
    const normalizedValue = sanitizeString(value);

    setDateRangePresets((current) => ({
      ...current,
      [scope]: 'CUSTOM',
    }));
    commitDraftFilters((current) => ({
      ...current,
      [targetKey]: normalizedValue,
    }));
  }, [commitDraftFilters]);

  const onClearDateRange = useCallback((scope) => {
    const fromKey = scope === 'created' ? 'created_from' : 'appointment_from';
    const toKey = scope === 'created' ? 'created_to' : 'appointment_to';

    setDateRangePresets((current) => ({
      ...current,
      [scope]: 'CUSTOM',
    }));
    commitDraftFilters((current) => ({
      ...current,
      [fromKey]: '',
      [toKey]: '',
    }));
  }, [commitDraftFilters]);

  const onApplyFilters = useCallback(() => {
    setAppliedFilters(normalizeFilterState(draftFiltersRef.current));
    setPage(1);
  }, []);

  const onClearFilters = useCallback(() => {
    draftFiltersRef.current = DEFAULT_FILTERS;
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setDateRangePresets(DEFAULT_RANGE_PRESETS);
    setPage(1);
  }, []);

  return {
    items,
    searchValue,
    page,
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    sortBy,
    sortOptions: SORT_FIELDS,
    order,
    orderOptions: ORDER_FIELDS,
    pagination,
    isLoading: !isResolved || isLoading,
    isOffline,
    hasError,
    errorMessage,
    isEntitlementBlocked,
    canCreatePatientRecords,
    hasResults: items.length > 0,
    isFilterPanelOpen,
    filters: draftFilters,
    dateRangePresets,
    hasActiveFilters,
    genderFilterValues: GENDER_FILTER_VALUES,
    appointmentStatusFilterValues: APPOINTMENT_STATUS_FILTER_VALUES,
    datePresetValues: DATE_PRESET_VALUES,
    onSearch,
    onSortBy,
    onOrder,
    onPageSize,
    onPreviousPage,
    onNextPage,
    onOpenPatient,
    onEditPatient,
    onDeletePatient,
    onQuickCreate,
    onRetry,
    onGoToSubscriptions,
    onToggleFilterPanel,
    onFilterChange,
    onDateRangePresetChange,
    onDateRangeValueChange,
    onClearDateRange,
    onApplyFilters,
    onClearFilters,
  };
};

export default usePatientDirectoryScreen;
