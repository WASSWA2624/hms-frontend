/**
 * useAddressDetailScreen Hook
 * Shared logic for AddressDetailScreen across platforms.
 * File: useAddressDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useAddress, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const normalizeValue = (value) => String(value ?? '').trim();

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
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);

  const address = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const isAddressInScope = useMemo(() => {
    if (!address) return true;
    if (canManageAllTenants) return true;
    const addressTenantId = normalizeValue(address.tenant_id);
    if (!addressTenantId || !normalizedTenantId) return false;
    return addressTenantId === normalizedTenantId;
  }, [address, canManageAllTenants, normalizedTenantId]);
  const visibleAddress = isAddressInScope ? address : null;
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
    if (!isResolved || !canManageAddresses || !address || isAddressInScope) return;
    router.replace('/settings/addresses?notice=accessDenied');
  }, [isResolved, canManageAddresses, address, isAddressInScope, router]);

  useEffect(() => {
    if (!isResolved || !canManageAddresses) return;
    if (visibleAddress) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/addresses?notice=accessDenied');
    }
  }, [isResolved, canManageAddresses, visibleAddress, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/addresses');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditAddress || !addressId || !isAddressInScope) return;
    router.push(`/settings/addresses/${addressId}/edit`);
  }, [canEditAddress, addressId, isAddressInScope, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteAddress || !addressId || !isAddressInScope) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(addressId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/addresses?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteAddress, addressId, isAddressInScope, remove, isOffline, router, t]);

  return {
    id: addressId,
    address: visibleAddress,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode) && isAddressInScope,
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditAddress && isAddressInScope ? handleEdit : undefined,
    onDelete: canDeleteAddress && isAddressInScope ? handleDelete : undefined,
  };
};

export default useAddressDetailScreen;
