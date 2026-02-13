/**
 * Shared logic for patient resource list screens.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, usePatientAccess } from '@hooks';
import { confirmAction } from '@utils';
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
  resolveErrorMessage,
} from '../patientScreenUtils';

const usePatientResourceListScreen = (resourceId) => {
  const config = getPatientResourceConfig(resourceId);
  const { t } = useI18n();
  const router = useRouter();
  const { notice, patientId: patientIdParam } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const {
    canAccessPatients,
    canCreatePatientRecords,
    canDeletePatientRecords,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = usePatientAccess();

  const { list, remove, data, isLoading, errorCode, reset } = usePatientResourceCrud(resourceId);

  const [noticeMessage, setNoticeMessage] = useState(null);

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const patientContextId = useMemo(
    () => normalizePatientContextId(patientIdParam),
    [patientIdParam]
  );
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const canList = Boolean(config && canAccessPatients && hasScope);
  const resourceLabel = useMemo(() => t(`${config?.i18nKey}.label`), [config?.i18nKey, t]);

  const items = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [data]);

  const noticeValue = useMemo(() => normalizeNoticeValue(notice), [notice]);

  const errorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.list.loadError`);
  }, [config, errorCode, t]);

  const listPath = useMemo(
    () => withPatientContext(config?.routePath || PATIENT_ROUTE_ROOT, patientContextId),
    [config?.routePath, patientContextId]
  );

  const fetchList = useCallback(() => {
    if (!config || !isResolved || !canList) return;
    const params = { ...config.listParams };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
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
    canManageAllTenants,
    normalizedTenantId,
    patientContextId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessPatients || !hasScope || !config) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessPatients, hasScope, config, router]);

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
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, config, errorCode, t, resourceLabel]);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleItemPress = useCallback(
    (id) => {
      const normalizedId = normalizeSearchParam(id);
      if (!normalizedId || !config) return;
      router.push(withPatientContext(`${config.routePath}/${normalizedId}`, patientContextId));
    },
    [config, patientContextId, router]
  );

  const handleAdd = useCallback(() => {
    if (!canCreatePatientRecords || !config) return;
    router.push(withPatientContext(`${config.routePath}/create`, patientContextId));
  }, [canCreatePatientRecords, config, patientContextId, router]);

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeletePatientRecords || !config) return;
      if (e?.stopPropagation) e.stopPropagation();
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
    [canDeletePatientRecords, config, t, remove, fetchList, isOffline, resourceLabel]
  );

  return {
    config,
    items,
    patientContextId,
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
    canCreate: canCreatePatientRecords,
    canDelete: canDeletePatientRecords,
    createBlockedReason: canCreatePatientRecords ? '' : t('patients.access.createDenied'),
    deleteBlockedReason: canDeletePatientRecords ? '' : t('patients.access.deleteDenied'),
    listPath,
  };
};

export default usePatientResourceListScreen;
