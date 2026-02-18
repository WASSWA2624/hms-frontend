/**
 * useContactDetailScreen Hook
 * Shared logic for ContactDetailScreen across platforms.
 * File: useContactDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useContact, useTenantAccess } from '@hooks';
import { confirmAction } from '@utils';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useContactDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useContact();
  const routeContactId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageContacts = canAccessTenantSettings;
  const canEditContact = canManageContacts;
  const canDeleteContact = canManageContacts;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageContacts && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);

  const contact = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageContacts || !routeContactId) return;
    reset();
    get(routeContactId);
  }, [isResolved, canManageContacts, routeContactId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageContacts) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageContacts, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageContacts || !isTenantScopedAdmin || !contact) return;
    const contactTenantId = String(contact.tenant_id ?? '').trim();
    if (!contactTenantId || contactTenantId !== normalizedTenantId) {
      router.replace('/settings/contacts?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageContacts,
    isTenantScopedAdmin,
    contact,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageContacts) return;
    if (contact) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/contacts?notice=accessDenied');
    }
  }, [isResolved, canManageContacts, contact, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = useCallback(() => {
    router.push('/settings/contacts');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditContact || !routeContactId) return;
    router.push(`/settings/contacts/${routeContactId}/edit`);
  }, [canEditContact, routeContactId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteContact || !routeContactId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(routeContactId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/contacts?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteContact, routeContactId, remove, isOffline, router, t]);

  return {
    id: routeContactId,
    contact,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditContact ? handleEdit : undefined,
    onDelete: canDeleteContact ? handleDelete : undefined,
  };
};

export default useContactDetailScreen;
