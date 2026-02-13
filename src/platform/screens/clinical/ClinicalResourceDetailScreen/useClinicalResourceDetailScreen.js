/**
 * Shared logic for Clinical resource detail screens.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useClinicalAccess } from '@hooks';
import { confirmAction } from '@utils';
import {
  getClinicalResourceConfig,
  sanitizeString,
  CLINICAL_ROUTE_ROOT,
  withClinicalContext,
} from '../ClinicalResourceConfigs';
import useClinicalResourceCrud from '../useClinicalResourceCrud';
import {
  isAccessDeniedError,
  normalizeRecordId,
  normalizeClinicalContext,
  resolveErrorMessage,
} from '../ClinicalScreenUtils';

const useClinicalResourceDetailScreen = (resourceId) => {
  const config = getClinicalResourceConfig(resourceId);
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const routeRecordId = useMemo(() => normalizeRecordId(searchParams?.id), [searchParams?.id]);
  const context = useMemo(() => normalizeClinicalContext(searchParams), [searchParams]);
  const { isOffline } = useNetwork();
  const {
    canAccessClinical,
    canEditClinicalRecords,
    canDeleteClinicalRecords,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useClinicalAccess();

  const { get, remove, data, isLoading, errorCode, reset } = useClinicalResourceCrud(resourceId);

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const listPath = useMemo(
    () => withClinicalContext(config?.routePath || CLINICAL_ROUTE_ROOT, context),
    [config?.routePath, context]
  );

  const item = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  const errorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.detail.loadError`);
  }, [config, errorCode, t]);

  const fetchDetail = useCallback(() => {
    if (!config || !routeRecordId || !isResolved || !canAccessClinical || !hasScope) return;
    reset();
    get(routeRecordId);
  }, [config, routeRecordId, isResolved, canAccessClinical, hasScope, reset, get]);

  useEffect(() => {
    if (!isResolved || !config) return;
    if (!canAccessClinical || !hasScope) {
      router.replace('/dashboard');
      return;
    }
    if (!routeRecordId) {
      router.replace(listPath);
    }
  }, [isResolved, config, canAccessClinical, hasScope, routeRecordId, router, listPath]);

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
    if (!canEditClinicalRecords || !config || !routeRecordId) return;
    router.push(withClinicalContext(`${config.routePath}/${routeRecordId}/edit`, context));
  }, [canEditClinicalRecords, config, routeRecordId, context, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteClinicalRecords || !routeRecordId || !config) return;
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
  }, [canDeleteClinicalRecords, routeRecordId, config, t, remove, isOffline, router, listPath]);

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
    canEdit: canEditClinicalRecords,
    canDelete: canDeleteClinicalRecords,
    editBlockedReason: canEditClinicalRecords ? '' : t('clinical.access.editDenied'),
    deleteBlockedReason: canDeleteClinicalRecords ? '' : t('clinical.access.deleteDenied'),
    listPath,
  };
};

export default useClinicalResourceDetailScreen;
