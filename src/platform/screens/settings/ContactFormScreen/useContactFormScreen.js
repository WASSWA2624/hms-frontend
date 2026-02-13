/**
 * useContactFormScreen Hook
 * Shared logic for ContactFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useContact, useTenant, useTenantAccess } from '@hooks';

const MAX_VALUE_LENGTH = 255;
const CONTACT_TYPES = ['PHONE', 'EMAIL', 'FAX', 'OTHER'];

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useContactFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, tenantId: tenantIdParam } = useLocalSearchParams();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const { get, create, update, data, isLoading, errorCode, reset } = useContact();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();

  const routeContactId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeContactId);
  const canManageContacts = canAccessTenantSettings;
  const canCreateContact = canManageContacts;
  const canEditContact = canManageContacts;
  const isTenantScopedAdmin = canManageContacts && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );

  const [value, setValue] = useState('');
  const [contactType, setContactType] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [tenantId, setTenantId] = useState('');
  const tenantPrefillRef = useRef(false);

  const contact = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (isTenantScopedAdmin || isEdit
      ? []
      : (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? []))),
    [tenantData, isTenantScopedAdmin, isEdit]
  );
  const tenantOptions = useMemo(() => {
    if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
      return [{ value: normalizedScopedTenantId, label: normalizedScopedTenantId }];
    }
    return tenantItems.map((tenant) => ({
      value: tenant.id,
      label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
    }));
  }, [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId]);
  const contactTypeOptions = useMemo(
    () => CONTACT_TYPES.map((type) => ({ label: t(`contact.types.${type}`), value: type })),
    [t]
  );

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageContacts) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateContact) {
      router.replace('/settings/contacts?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditContact) {
      router.replace('/settings/contacts?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageContacts,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateContact,
    canEditContact,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageContacts || !isEdit || !routeContactId) return;
    if (!canEditContact) return;
    reset();
    get(routeContactId);
  }, [isResolved, canManageContacts, isEdit, routeContactId, canEditContact, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageContacts || isEdit) return;
    if (!canCreateContact) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      tenantPrefillRef.current = true;
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [
    isResolved,
    canManageContacts,
    isEdit,
    canCreateContact,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageContacts || !isEdit) return;
    if (contact) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/contacts?notice=accessDenied');
    }
  }, [isResolved, canManageContacts, isEdit, contact, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageContacts || !isTenantScopedAdmin || !isEdit || !contact) return;
    const contactTenantId = String(contact.tenant_id ?? '').trim();
    if (!contactTenantId || contactTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/contacts?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageContacts,
    isTenantScopedAdmin,
    isEdit,
    contact,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!contact) return;
    setValue(contact.value ?? '');
    setContactType(contact.contact_type ?? contact.type ?? '');
    setIsPrimary(contact.is_primary ?? false);
    setTenantId(String(contact.tenant_id ?? normalizedScopedTenantId ?? ''));
  }, [contact, normalizedScopedTenantId]);

  useEffect(() => {
    if (isEdit || isTenantScopedAdmin) return;
    if (tenantPrefillRef.current) return;
    const paramValue = Array.isArray(tenantIdParam) ? tenantIdParam[0] : tenantIdParam;
    if (paramValue) {
      setTenantId(String(paramValue));
      tenantPrefillRef.current = true;
      return;
    }
    if (tenantOptions.length === 1 && !tenantId) {
      setTenantId(tenantOptions[0].value);
      tenantPrefillRef.current = true;
    }
  }, [isEdit, isTenantScopedAdmin, tenantIdParam, tenantOptions, tenantId]);

  const trimmedTenantId = String(tenantId ?? '').trim();
  const trimmedValue = String(value ?? '').trim();
  const trimmedContactType = String(contactType ?? '').trim();
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'contact.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'contact.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const tenantListError = Boolean(tenantErrorCode);
  const valueError = useMemo(() => {
    if (!trimmedValue) return t('contact.form.valueRequired');
    if (trimmedValue.length > MAX_VALUE_LENGTH) {
      return t('contact.form.valueTooLong', { max: MAX_VALUE_LENGTH });
    }
    return null;
  }, [trimmedValue, t]);
  const contactTypeError = useMemo(() => {
    if (!trimmedContactType) return t('contact.form.typeRequired');
    if (!CONTACT_TYPES.includes(trimmedContactType)) return t('contact.form.typeInvalid');
    return null;
  }, [trimmedContactType, t]);
  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('contact.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);
  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasTenants;
  const isTenantLocked = !isEdit && isTenantScopedAdmin;
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return trimmedTenantId || normalizedScopedTenantId;
  }, [isTenantLocked, trimmedTenantId, normalizedScopedTenantId]);
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    Boolean(valueError) ||
    Boolean(contactTypeError) ||
    Boolean(tenantError) ||
    (isEdit ? !canEditContact : !canCreateContact);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateContact) {
        router.replace('/settings/contacts?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditContact) {
        router.replace('/settings/contacts?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const contactTenantId = String(contact?.tenant_id ?? '').trim();
        if (!contactTenantId || contactTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/contacts?notice=accessDenied');
          return;
        }
      }
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        value: trimmedValue,
        contact_type: trimmedContactType,
        is_primary: Boolean(isPrimary),
      };
      if (!isEdit && trimmedTenantId) {
        payload.tenant_id = trimmedTenantId;
      }
      if (isEdit && routeContactId) {
        const result = await update(routeContactId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/contacts?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isEdit,
    canCreateContact,
    canEditContact,
    isTenantScopedAdmin,
    contact,
    normalizedScopedTenantId,
    isOffline,
    trimmedValue,
    trimmedContactType,
    isPrimary,
    trimmedTenantId,
    routeContactId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/contacts');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleRetryTenants = useCallback(() => {
    if (isTenantScopedAdmin || isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  return {
    isEdit,
    value,
    setValue,
    contactType,
    setContactType,
    contactTypeOptions,
    isPrimary,
    setIsPrimary,
    tenantId,
    setTenantId,
    tenantOptions,
    tenantListLoading: isTenantScopedAdmin ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin ? false : tenantListError,
    tenantErrorMessage: isTenantScopedAdmin ? null : tenantErrorMessage,
    hasTenants,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    contact,
    valueError,
    contactTypeError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onRetryTenants: handleRetryTenants,
    isSubmitDisabled,
    testID: 'contact-form-screen',
  };
};

export default useContactFormScreen;
