/**
 * Shared logic for scheduling resource detail screens.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useSchedulingAccess } from '@hooks';
import { confirmAction } from '@utils';
import {
  getSchedulingResourceConfig,
  sanitizeString,
  SCHEDULING_ROUTE_ROOT,
  SCHEDULING_RESOURCE_IDS,
  withSchedulingContext,
} from '../schedulingResourceConfigs';
import useSchedulingResourceCrud from '../useSchedulingResourceCrud';
import {
  isAccessDeniedError,
  normalizeRecordId,
  normalizeSchedulingContext,
  resolveErrorMessage,
} from '../schedulingScreenUtils';

const getSearchParamValue = (value) => (Array.isArray(value) ? value[0] : value);

const useSchedulingResourceDetailScreen = (resourceId) => {
  const config = getSchedulingResourceConfig(resourceId);
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const patientParam = getSearchParamValue(searchParams?.patientId);
  const providerUserParam = getSearchParamValue(searchParams?.providerUserId);
  const scheduleParam = getSearchParamValue(searchParams?.scheduleId);
  const appointmentParam = getSearchParamValue(searchParams?.appointmentId);
  const statusParam = getSearchParamValue(searchParams?.status);
  const dayOfWeekParam = getSearchParamValue(searchParams?.dayOfWeek);
  const isAvailableParam = getSearchParamValue(searchParams?.isAvailable);
  const recordIdParam = getSearchParamValue(searchParams?.id);
  const routeRecordId = useMemo(() => normalizeRecordId(recordIdParam), [recordIdParam]);
  const context = useMemo(
    () => normalizeSchedulingContext({
      patientId: patientParam,
      providerUserId: providerUserParam,
      scheduleId: scheduleParam,
      appointmentId: appointmentParam,
      status: statusParam,
      dayOfWeek: dayOfWeekParam,
      isAvailable: isAvailableParam,
    }),
    [
      patientParam,
      providerUserParam,
      scheduleParam,
      appointmentParam,
      statusParam,
      dayOfWeekParam,
      isAvailableParam,
    ]
  );
  const { isOffline } = useNetwork();
  const {
    canAccessScheduling,
    canCreateSchedulingRecords,
    canEditSchedulingRecords,
    canDeleteSchedulingRecords,
    canCancelAppointments,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useSchedulingAccess();

  const {
    get,
    remove,
    cancel,
    prioritize,
    markSent,
    update,
    data,
    isLoading,
    errorCode,
    reset,
  } = useSchedulingResourceCrud(resourceId);

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const listPath = useMemo(
    () => withSchedulingContext(config?.routePath || SCHEDULING_ROUTE_ROOT, context),
    [config?.routePath, context]
  );

  const item = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  const errorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.detail.loadError`);
  }, [config, errorCode, t]);

  const fetchDetail = useCallback(() => {
    if (!config || !routeRecordId || !isResolved || !canAccessScheduling || !hasScope) return;
    reset();
    get(routeRecordId);
  }, [config, routeRecordId, isResolved, canAccessScheduling, hasScope, reset, get]);

  useEffect(() => {
    if (!isResolved || !config) return;
    if (!canAccessScheduling || !hasScope) {
      router.replace('/dashboard');
      return;
    }
    if (!routeRecordId) {
      router.replace(listPath);
    }
  }, [isResolved, config, canAccessScheduling, hasScope, routeRecordId, router, listPath]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !item || canManageAllTenants || !config?.requiresTenant) return;
    const itemTenantId = sanitizeString(item.tenant_id);
    if (!itemTenantId || itemTenantId !== normalizedTenantId) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
    }
  }, [isResolved, item, canManageAllTenants, config?.requiresTenant, normalizedTenantId, router, listPath]);

  useEffect(() => {
    if (!isResolved || item) return;
    if (isAccessDeniedError(errorCode)) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
    }
  }, [isResolved, item, errorCode, router, listPath]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push(listPath);
  }, [router, listPath]);

  const handleEdit = useCallback(() => {
    if (!canEditSchedulingRecords || !config || !routeRecordId) return;
    router.push(withSchedulingContext(`${config.routePath}/${routeRecordId}/edit`, context));
  }, [canEditSchedulingRecords, config, routeRecordId, context, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteSchedulingRecords || !routeRecordId || !config) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(routeRecordId);
      if (!result) return;
      const noticeType = isOffline ? 'queued' : 'deleted';
      const separator = listPath.includes('?') ? '&' : '?';
      router.push(`${listPath}${separator}notice=${noticeType}`);
    } catch {
      // Hook-level error handling already updates state.
    }
  }, [canDeleteSchedulingRecords, routeRecordId, config, t, remove, isOffline, router, listPath]);

  const handleCancelAppointment = useCallback(async () => {
    const isAppointmentResource = resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENTS;
    if (!isAppointmentResource || !canCancelAppointments || !routeRecordId || typeof cancel !== 'function') return;
    if (!confirmAction(t('scheduling.resources.appointments.cancel.confirm'))) return;
    try {
      const result = await cancel(routeRecordId, {});
      if (!result) return;
      const separator = listPath.includes('?') ? '&' : '?';
      router.push(`${listPath}${separator}notice=cancelled`);
    } catch {
      // Hook-level error handling already updates state.
    }
  }, [resourceId, canCancelAppointments, routeRecordId, cancel, t, listPath, router]);

  const handleMarkReminderSent = useCallback(async () => {
    const isReminderResource = resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS;
    if (!isReminderResource || !canEditSchedulingRecords || !routeRecordId || typeof markSent !== 'function') return;
    try {
      const result = await markSent(routeRecordId, {});
      if (!result) return;
      const separator = listPath.includes('?') ? '&' : '?';
      router.push(`${listPath}${separator}notice=${isOffline ? 'queued' : 'updated'}`);
    } catch {
      // Hook-level error handling already updates state.
    }
  }, [resourceId, canEditSchedulingRecords, routeRecordId, markSent, listPath, router, isOffline]);

  const handlePrioritizeQueue = useCallback(async () => {
    const isVisitQueueResource = resourceId === SCHEDULING_RESOURCE_IDS.VISIT_QUEUES;
    if (!isVisitQueueResource || !canEditSchedulingRecords || !routeRecordId || typeof prioritize !== 'function') return;
    try {
      const result = await prioritize(routeRecordId, {});
      if (!result) return;
      const separator = listPath.includes('?') ? '&' : '?';
      router.push(`${listPath}${separator}notice=${isOffline ? 'queued' : 'updated'}`);
    } catch {
      // Hook-level error handling already updates state.
    }
  }, [resourceId, canEditSchedulingRecords, routeRecordId, prioritize, listPath, router, isOffline]);

  const handleToggleAvailability = useCallback(async () => {
    const isSlotResource = resourceId === SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS;
    if (!isSlotResource || !canEditSchedulingRecords || !routeRecordId || typeof update !== 'function') return;
    const nextAvailability = !(item?.is_available !== false);
    try {
      const result = await update(routeRecordId, { is_available: nextAvailability });
      if (!result) return;
      const separator = listPath.includes('?') ? '&' : '?';
      router.push(`${listPath}${separator}notice=${isOffline ? 'queued' : 'updated'}`);
    } catch {
      // Hook-level error handling already updates state.
    }
  }, [resourceId, canEditSchedulingRecords, routeRecordId, update, item?.is_available, listPath, router, isOffline]);

  const handleCreateAppointmentParticipant = useCallback(() => {
    if (resourceId !== SCHEDULING_RESOURCE_IDS.APPOINTMENTS || !canCreateSchedulingRecords || !item?.id) return;
    const path = withSchedulingContext('/scheduling/appointment-participants/create', {
      ...context,
      appointmentId: item.id,
      patientId: item.patient_id || context.patientId,
      providerUserId: item.provider_user_id || context.providerUserId,
    });
    router.push(path);
  }, [resourceId, canCreateSchedulingRecords, item, context, router]);

  const handleCreateAppointmentReminder = useCallback(() => {
    if (resourceId !== SCHEDULING_RESOURCE_IDS.APPOINTMENTS || !canCreateSchedulingRecords || !item?.id) return;
    const path = withSchedulingContext('/scheduling/appointment-reminders/create', {
      ...context,
      appointmentId: item.id,
      patientId: item.patient_id || context.patientId,
      providerUserId: item.provider_user_id || context.providerUserId,
    });
    router.push(path);
  }, [resourceId, canCreateSchedulingRecords, item, context, router]);

  const handleCreateVisitQueue = useCallback(() => {
    if (resourceId !== SCHEDULING_RESOURCE_IDS.APPOINTMENTS || !canCreateSchedulingRecords || !item?.id) return;
    const path = withSchedulingContext('/scheduling/visit-queues/create', {
      ...context,
      appointmentId: item.id,
      patientId: item.patient_id || context.patientId,
      providerUserId: item.provider_user_id || context.providerUserId,
    });
    router.push(path);
  }, [resourceId, canCreateSchedulingRecords, item, context, router]);

  const canCancel = resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENTS && canCancelAppointments;
  const canMarkReminderSent = resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS
    && canEditSchedulingRecords
    && typeof markSent === 'function';
  const canPrioritizeQueue = resourceId === SCHEDULING_RESOURCE_IDS.VISIT_QUEUES
    && canEditSchedulingRecords
    && typeof prioritize === 'function';
  const canToggleAvailability = resourceId === SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS
    && canEditSchedulingRecords
    && typeof update === 'function';
  const canCreateFromAppointment = resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENTS
    && canCreateSchedulingRecords
    && Boolean(item?.id);

  return {
    config,
    context,
    id: routeRecordId,
    item,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onCancelAppointment: handleCancelAppointment,
    onMarkReminderSent: handleMarkReminderSent,
    onPrioritizeQueue: handlePrioritizeQueue,
    onToggleAvailability: handleToggleAvailability,
    onCreateAppointmentParticipant: handleCreateAppointmentParticipant,
    onCreateAppointmentReminder: handleCreateAppointmentReminder,
    onCreateVisitQueue: handleCreateVisitQueue,
    canEdit: canEditSchedulingRecords,
    canDelete: canDeleteSchedulingRecords,
    canCancel,
    canMarkReminderSent,
    canPrioritizeQueue,
    canToggleAvailability,
    canCreateFromAppointment,
    editBlockedReason: canEditSchedulingRecords ? '' : t('scheduling.access.editDenied'),
    deleteBlockedReason: canDeleteSchedulingRecords ? '' : t('scheduling.access.deleteDenied'),
    cancelBlockedReason: canCancel ? '' : t('scheduling.access.cancelDenied'),
    markSentBlockedReason: canMarkReminderSent ? '' : t('scheduling.access.editDenied'),
    prioritizeBlockedReason: canPrioritizeQueue ? '' : t('scheduling.access.editDenied'),
    toggleAvailabilityBlockedReason: canToggleAvailability ? '' : t('scheduling.access.editDenied'),
    createBlockedReason: canCreateSchedulingRecords ? '' : t('scheduling.access.createDenied'),
    listPath,
  };
};

export default useSchedulingResourceDetailScreen;
