/**
 * Shared logic for scheduling resource list screens.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useSchedulingAccess } from '@hooks';
import { confirmAction } from '@utils';
import {
  getContextFilters,
  getSchedulingResourceConfig,
  normalizeSearchParam,
  sanitizeString,
  SCHEDULING_ROUTE_ROOT,
  SCHEDULING_RESOURCE_IDS,
  withSchedulingContext,
} from '../schedulingResourceConfigs';
import useSchedulingResourceCrud from '../useSchedulingResourceCrud';
import {
  buildNoticeMessage,
  isAccessDeniedError,
  normalizeNoticeValue,
  normalizeSchedulingContext,
  resolveErrorMessage,
} from '../schedulingScreenUtils';

const buildItemContext = (resourceId, item, baseContext) => {
  if (!item || typeof item !== 'object') return baseContext;

  if (resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENTS) {
    return {
      ...baseContext,
      appointmentId: sanitizeString(item.id) || baseContext.appointmentId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      providerUserId: sanitizeString(item.provider_user_id) || baseContext.providerUserId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === SCHEDULING_RESOURCE_IDS.PROVIDER_SCHEDULES) {
    return {
      ...baseContext,
      scheduleId: sanitizeString(item.id) || baseContext.scheduleId,
      providerUserId: sanitizeString(item.provider_user_id) || baseContext.providerUserId,
    };
  }

  if (resourceId === SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS) {
    return {
      ...baseContext,
      scheduleId: sanitizeString(item.schedule_id) || baseContext.scheduleId,
    };
  }

  if (resourceId === SCHEDULING_RESOURCE_IDS.VISIT_QUEUES) {
    return {
      ...baseContext,
      appointmentId: sanitizeString(item.appointment_id) || baseContext.appointmentId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      providerUserId: sanitizeString(item.provider_user_id) || baseContext.providerUserId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  return baseContext;
};

const useSchedulingResourceListScreen = (resourceId) => {
  const config = getSchedulingResourceConfig(resourceId);
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const noticeValue = useMemo(
    () => normalizeNoticeValue(searchParams?.notice),
    [searchParams]
  );
  const context = useMemo(
    () => normalizeSchedulingContext(searchParams),
    [searchParams]
  );
  const { isOffline } = useNetwork();
  const {
    canAccessScheduling,
    canCreateSchedulingRecords,
    canDeleteSchedulingRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useSchedulingAccess();

  const { list, remove, data, isLoading, errorCode, reset } = useSchedulingResourceCrud(resourceId);
  const [noticeMessage, setNoticeMessage] = useState(null);

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const canList = Boolean(config && canAccessScheduling && hasScope);
  const resourceLabel = useMemo(() => t(`${config?.i18nKey}.label`), [config?.i18nKey, t]);

  const items = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [data]);

  const errorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.list.loadError`);
  }, [config, errorCode, t]);

  const listPath = useMemo(
    () => withSchedulingContext(config?.routePath || SCHEDULING_ROUTE_ROOT, context),
    [config?.routePath, context]
  );

  const fetchList = useCallback(() => {
    if (!config || !isResolved || !canList) return;
    const params = { ...config.listParams };
    if (config.requiresTenant && !canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    if (config.supportsFacility && !canManageAllTenants && normalizedFacilityId) {
      params.facility_id = normalizedFacilityId;
    }
    const filters = getContextFilters(resourceId, context);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });
    reset();
    list(params);
  }, [
    config,
    isResolved,
    canList,
    canManageAllTenants,
    normalizedTenantId,
    normalizedFacilityId,
    resourceId,
    context,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessScheduling || !hasScope || !config) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessScheduling, hasScope, config, router]);

  useEffect(() => {
    if (!canList) return;
    fetchList();
  }, [canList, fetchList]);

  useEffect(() => {
    if (!noticeValue || !config) return;
    const message = buildNoticeMessage(t, noticeValue, resourceLabel);
    if (!message) return;
    setNoticeMessage(message);
    router.replace(listPath);
  }, [noticeValue, config, t, resourceLabel, router, listPath]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => setNoticeMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !config) return;
    if (!isAccessDeniedError(errorCode)) return;
    const message = buildNoticeMessage(t, 'accessDenied', resourceLabel);
    if (message) setNoticeMessage(message);
  }, [isResolved, config, errorCode, t, resourceLabel]);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleItemPress = useCallback(
    (id) => {
      const normalizedId = normalizeSearchParam(id);
      if (!normalizedId || !config) return;
      const item = items.find((candidate) => String(candidate?.id) === String(normalizedId));
      const nextContext = buildItemContext(resourceId, item, context);
      router.push(withSchedulingContext(`${config.routePath}/${normalizedId}`, nextContext));
    },
    [config, items, resourceId, context, router]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateSchedulingRecords || !config) return;
    router.push(withSchedulingContext(`${config.routePath}/create`, context));
  }, [canCreateSchedulingRecords, config, context, router]);

  const handleDelete = useCallback(
    async (id, event) => {
      if (!canDeleteSchedulingRecords || !config) return;
      if (event?.stopPropagation) event.stopPropagation();
      if (!confirmAction(t('common.confirmDelete'))) return;
      const normalizedId = normalizeSearchParam(id);
      if (!normalizedId) return;
      try {
        const result = await remove(normalizedId);
        if (!result) return;
        fetchList();
        const noticeType = isOffline ? 'queued' : 'deleted';
        const message = buildNoticeMessage(t, noticeType, resourceLabel);
        if (message) setNoticeMessage(message);
      } catch {
        // Hook-level error handling already updates state.
      }
    },
    [canDeleteSchedulingRecords, config, t, remove, fetchList, isOffline, resourceLabel]
  );

  return {
    config,
    context,
    items,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onItemPress: handleItemPress,
    onDelete: handleDelete,
    onAdd: handleAdd,
    canCreate: canCreateSchedulingRecords,
    canDelete: canDeleteSchedulingRecords,
    createBlockedReason: canCreateSchedulingRecords ? '' : t('scheduling.access.createDenied'),
    deleteBlockedReason: canDeleteSchedulingRecords ? '' : t('scheduling.access.deleteDenied'),
    listPath,
  };
};

export default useSchedulingResourceListScreen;
