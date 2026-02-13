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

const useSchedulingResourceDetailScreen = (resourceId) => {
  const config = getSchedulingResourceConfig(resourceId);
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const routeRecordId = useMemo(() => normalizeRecordId(searchParams?.id), [searchParams?.id]);
  const context = useMemo(() => normalizeSchedulingContext(searchParams), [searchParams]);
  const { isOffline } = useNetwork();
  const {
    canAccessScheduling,
    canEditSchedulingRecords,
    canDeleteSchedulingRecords,
    canCancelAppointments,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useSchedulingAccess();

  const { get, remove, cancel, data, isLoading, errorCode, reset } = useSchedulingResourceCrud(resourceId);

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

  const canCancel = resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENTS && canCancelAppointments;

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
    canEdit: canEditSchedulingRecords,
    canDelete: canDeleteSchedulingRecords,
    canCancel,
    editBlockedReason: canEditSchedulingRecords ? '' : t('scheduling.access.editDenied'),
    deleteBlockedReason: canDeleteSchedulingRecords ? '' : t('scheduling.access.deleteDenied'),
    cancelBlockedReason: canCancel ? '' : t('scheduling.access.cancelDenied'),
    listPath,
  };
};

export default useSchedulingResourceDetailScreen;
