/**
 * useUnitListScreen Hook
 * Shared logic for UnitListScreen across platforms.
 * File: useUnitListScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useUnit, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

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
    created: 'unit.list.noticeCreated',
    updated: 'unit.list.noticeUpdated',
    deleted: 'unit.list.noticeDeleted',
    queued: 'unit.list.noticeQueued',
    accessDenied: 'unit.list.noticeAccessDenied',
  };
  const key = map[notice];
  return key ? t(key) : null;
};

const useUnitListScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { notice } = useLocalSearchParams();
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
  } = useUnit();

  const [noticeMessage, setNoticeMessage] = useState(null);
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const canManageUnits = canAccessTenantSettings;
  const canCreateUnit = canManageUnits;
  const canDeleteUnit = canManageUnits;
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'unit.list.loadError'),
    [t, errorCode]
  );
  const noticeValue = useMemo(() => {
    if (Array.isArray(notice)) return notice[0];
    return notice;
  }, [notice]);

  const fetchList = useCallback((params = {}) => {
    if (!isResolved || !canManageUnits) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    const nextParams = { page: 1, limit: 20, ...params };
    if (!canManageAllTenants) {
      nextParams.tenant_id = normalizedTenantId;
    }
    reset();
    list(nextParams);
  }, [isResolved, canManageUnits, canManageAllTenants, normalizedTenantId, list, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUnits) {
      router.replace('/settings');
      return;
    }
    if (!canManageAllTenants && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageUnits, canManageAllTenants, normalizedTenantId, router]);

  useEffect(() => {
    if (!isResolved || !canManageUnits) return;
    if (!canManageAllTenants && !normalizedTenantId) return;
    fetchList();
  }, [isResolved, canManageUnits, canManageAllTenants, normalizedTenantId, fetchList]);

  useEffect(() => {
    if (!noticeValue) return;
    const message = resolveNoticeMessage(t, noticeValue);
    if (!message) return;
    setNoticeMessage(message);
    router.replace('/settings/units');
  }, [noticeValue, router, t]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !canManageUnits) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    const message = resolveNoticeMessage(t, 'accessDenied');
    if (message) {
      setNoticeMessage(message);
    }
  }, [isResolved, canManageUnits, errorCode, t]);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleUnitPress = useCallback(
    (id) => {
      if (!canManageUnits) return;
      router.push(`/settings/units/${id}`);
    },
    [canManageUnits, router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (!canDeleteUnit) return;
      if (e?.stopPropagation) e.stopPropagation();
      if (!confirmAction(t('common.confirmDelete'))) return;
      try {
        const result = await remove(id);
        if (!result) return;
        fetchList();
        const noticeKey = isOffline ? 'queued' : 'deleted';
        const message = resolveNoticeMessage(t, noticeKey);
        if (message) {
          setNoticeMessage(message);
        }
      } catch {
        /* error handled by hook */
      }
    },
    [canDeleteUnit, remove, fetchList, isOffline, t]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateUnit) return;
    router.push('/settings/units/create');
  }, [canCreateUnit, router]);

  return {
    items,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onUnitPress: handleUnitPress,
    onDelete: canDeleteUnit ? handleDelete : undefined,
    onAdd: canCreateUnit ? handleAdd : undefined,
  };
};

export default useUnitListScreen;
