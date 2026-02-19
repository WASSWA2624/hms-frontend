/**
 * Shared logic for patient resource detail screens.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, usePatientAccess } from '@hooks';
import { confirmAction, humanizeDisplayText } from '@utils';
import {
  getPatientResourceConfig,
  normalizeRouteId,
  PATIENT_ROUTE_ROOT,
  sanitizeString,
  withPatientContext,
} from '../patientResourceConfigs';
import usePatientResourceCrud from '../usePatientResourceCrud';
import {
  filterDetailRowsByIdentityPolicy,
  isAccessDeniedError,
  normalizePatientContextId,
  resolveErrorMessage,
} from '../patientScreenUtils';

const usePatientResourceDetailScreen = (resourceId) => {
  const config = getPatientResourceConfig(resourceId);
  const { t } = useI18n();
  const router = useRouter();
  const { id, patientId: patientIdParam } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const {
    canAccessPatients,
    canEditPatientRecords,
    canDeletePatientRecords,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = usePatientAccess();

  const { get, remove, data, isLoading, errorCode, reset } = usePatientResourceCrud(resourceId);

  const routeRecordId = useMemo(() => normalizeRouteId(id), [id]);
  const patientContextId = useMemo(
    () => normalizePatientContextId(patientIdParam),
    [patientIdParam]
  );

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const listPath = useMemo(
    () => withPatientContext(config?.routePath || PATIENT_ROUTE_ROOT, patientContextId),
    [config?.routePath, patientContextId]
  );
  const supportsEdit = config?.supportsEdit !== false;
  const canEdit = canEditPatientRecords && supportsEdit;
  const canViewTechnicalIds = canManageAllTenants;
  const resourceLabel = useMemo(() => {
    if (!config) return '';
    const pluralLabel = t(`${config.i18nKey}.pluralLabel`);
    if (pluralLabel !== `${config.i18nKey}.pluralLabel`) return pluralLabel;
    const label = t(`${config.i18nKey}.label`);
    if (label !== `${config.i18nKey}.label`) return label;
    return humanizeDisplayText(config.id || '') || '';
  }, [config, t]);

  const item = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const detailRows = useMemo(
    () => filterDetailRowsByIdentityPolicy(config?.detailRows || [], canViewTechnicalIds),
    [config?.detailRows, canViewTechnicalIds]
  );

  const errorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.detail.loadError`);
  }, [config, errorCode, t]);
  const screenDescription = useMemo(
    () => t('patients.common.detail.description', { resource: resourceLabel }),
    [t, resourceLabel]
  );
  const helpContent = useMemo(() => ({
    label: t('patients.common.detail.helpLabel', { resource: resourceLabel }),
    tooltip: t('patients.common.detail.helpTooltip', { resource: resourceLabel }),
    title: t('patients.common.detail.helpTitle', { resource: resourceLabel }),
    body: t('patients.common.detail.helpBody', { resource: resourceLabel }),
    items: [
      t('patients.common.detail.helpItems.review'),
      t('patients.common.detail.helpItems.actions'),
      t('patients.common.detail.helpItems.permissions'),
      t('patients.common.detail.helpItems.recovery'),
    ],
  }), [t, resourceLabel]);

  const fetchDetail = useCallback(() => {
    if (!config || !routeRecordId || !isResolved || !canAccessPatients || !hasScope) return;
    reset();
    get(routeRecordId);
  }, [config, routeRecordId, isResolved, canAccessPatients, hasScope, reset, get]);

  useEffect(() => {
    if (!isResolved || !config) return;
    if (!canAccessPatients || !hasScope) {
      router.replace('/dashboard');
      return;
    }
    if (!routeRecordId) {
      router.replace(listPath);
    }
  }, [isResolved, config, canAccessPatients, hasScope, routeRecordId, router, listPath]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !item || canManageAllTenants) return;
    const itemTenantId = sanitizeString(item.tenant_id);
    if (!itemTenantId || itemTenantId !== normalizedTenantId) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
    }
  }, [isResolved, item, canManageAllTenants, normalizedTenantId, router, listPath]);

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
    if (!canEdit || !config || !routeRecordId) return;
    router.push(withPatientContext(`${config.routePath}/${routeRecordId}/edit`, patientContextId));
  }, [canEdit, config, routeRecordId, router, patientContextId]);

  const handleDelete = useCallback(async () => {
    if (!canDeletePatientRecords || !routeRecordId || !config) return;
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
  }, [canDeletePatientRecords, routeRecordId, config, t, remove, isOffline, router, listPath]);

  return {
    config,
    id: routeRecordId,
    item,
    screenDescription,
    helpContent,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: handleEdit,
    onDelete: handleDelete,
    canEdit,
    canDelete: canDeletePatientRecords,
    showEditAction: supportsEdit,
    listPath,
    detailRows,
  };
};

export default usePatientResourceDetailScreen;
