import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useDebounce, useI18n, useNetwork, usePatient, usePatientAccess } from '@hooks';
import { isEntitlementDeniedError, resolveErrorMessage } from '../patientScreenUtils';

const PAGE_SIZE_OPTIONS = Object.freeze([20, 50, 100]);
const SORT_FIELDS = Object.freeze([
  'updated_at',
  'created_at',
  'first_name',
  'last_name',
  'human_friendly_id',
]);
const ORDER_FIELDS = Object.freeze(['asc', 'desc']);

const sanitizeString = (value) => String(value || '').trim();
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
  const friendlyId = sanitizeString(context?.id);
  if (label && friendlyId) return `${label} (${friendlyId})`;
  return label || friendlyId || fallback;
};

const usePatientDirectoryScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { list, data, isLoading, errorCode, reset } = usePatient();
  const {
    canAccessPatients,
    canCreatePatientRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = usePatientAccess();

  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('updated_at');
  const [order, setOrder] = useState('desc');
  const debouncedSearch = useDebounce(searchValue, 300);

  const normalizedTenantId = sanitizeString(tenantId);
  const normalizedFacilityId = sanitizeString(facilityId);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const isEntitlementBlocked = isEntitlementDeniedError(errorCode);

  const fetchList = useCallback(() => {
    if (!canAccessPatients || !hasScope || isOffline) return;

    const boundedPageSize = PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : 20;
    const params = {
      page: page > 0 ? page : 1,
      limit: boundedPageSize,
      sort_by: SORT_FIELDS.includes(sortBy) ? sortBy : 'updated_at',
      order: ORDER_FIELDS.includes(order) ? order : 'desc',
      search: sanitizeString(debouncedSearch) || undefined,
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
      rawItems.map((patient, index) => ({
        id: sanitizeString(patient?.id),
        displayName: resolvePatientName(
          patient,
          t('patients.overview.unnamedPatient', { position: index + 1 })
        ),
        humanFriendlyId: sanitizeString(patient?.human_friendly_id) || '-',
        tenantLabel: resolveContextLabel(
          patient?.tenant_context || {
            label: patient?.tenant_label,
            id: patient?.tenant_human_friendly_id,
          },
          '-'
        ),
        facilityLabel: resolveContextLabel(
          patient?.facility_context || {
            label: patient?.facility_label,
            id: patient?.facility_human_friendly_id,
          },
          '-'
        ),
        updatedAt: sanitizeString(patient?.updated_at) || '-',
      })),
    [rawItems, t]
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
    setOrder(ORDER_FIELDS.includes(value) ? value : 'desc');
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
    (patientId) => {
      const normalizedId = sanitizeString(patientId);
      if (!normalizedId) return;
      router.push(`/patients/patients/${normalizedId}`);
    },
    [router]
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
    onSearch,
    onSortBy,
    onOrder,
    onPageSize,
    onPreviousPage,
    onNextPage,
    onOpenPatient,
    onQuickCreate,
    onRetry,
    onGoToSubscriptions,
  };
};

export default usePatientDirectoryScreen;
