/**
 * useAddressDetailScreen Hook
 * Shared logic for AddressDetailScreen across platforms.
 * File: useAddressDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useAddress, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useAddressDetailScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useTenantAccess();
  const { get, remove, data, isLoading, errorCode, reset } = useAddress();
  const addressId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageAddresses = canAccessTenantSettings;
  const canEditAddress = canManageAddresses;
  const canDeleteAddress = canManageAddresses;
  const isTenantScopedAdmin = canManageAddresses && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const address = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageAddresses || !addressId) return;
    reset();
    get(addressId);
  }, [isResolved, canManageAddresses, addressId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageAddresses) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageAddresses, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageAddresses || !isTenantScopedAdmin || !address) return;
    const addressTenantId = String(address.tenant_id ?? '').trim();
    if (!addressTenantId || addressTenantId !== normalizedTenantId) {
      router.replace('/settings/addresses?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageAddresses,
    isTenantScopedAdmin,
    address,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageAddresses) return;
    if (address) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/addresses?notice=accessDenied');
    }
  }, [isResolved, canManageAddresses, address, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/addresses');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditAddress || !addressId) return;
    router.push(`/settings/addresses/${addressId}/edit`);
  }, [canEditAddress, addressId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteAddress || !addressId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(addressId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/addresses?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteAddress, addressId, remove, isOffline, router, t]);

  return {
    id: addressId,
    address,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditAddress ? handleEdit : undefined,
    onDelete: canDeleteAddress ? handleDelete : undefined,
  };
};

export default useAddressDetailScreen;
