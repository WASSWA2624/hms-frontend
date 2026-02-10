/**
 * useContactFormScreen Hook
 * Shared logic for ContactFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useContact, useTenant } from '@hooks';

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
  const { get, create, update, data, isLoading, errorCode, reset } = useContact();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();

  const isEdit = Boolean(id);
  const [value, setValue] = useState('');
  const [contactType, setContactType] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [tenantId, setTenantId] = useState('');
  const tenantPrefillRef = useRef(false);

  const contact = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? [])),
    [tenantData]
  );
  const tenantOptions = useMemo(
    () =>
      tenantItems.map((tenant) => ({
        value: tenant.id,
        label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
      })),
    [tenantItems]
  );
  const contactTypeOptions = useMemo(
    () => ([
      { label: t('contact.types.PHONE'), value: 'PHONE' },
      { label: t('contact.types.EMAIL'), value: 'EMAIL' },
      { label: t('contact.types.FAX'), value: 'FAX' },
      { label: t('contact.types.OTHER'), value: 'OTHER' },
    ]),
    [t]
  );

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (!isEdit) {
      resetTenants();
      listTenants({ page: 1, limit: 200 });
    }
  }, [isEdit, listTenants, resetTenants]);

  useEffect(() => {
    if (contact) {
      setValue(contact.value ?? '');
      setContactType(contact.contact_type ?? contact.type ?? '');
      setIsPrimary(contact.is_primary ?? false);
      setTenantId(contact.tenant_id ?? '');
    }
  }, [contact]);

  useEffect(() => {
    if (isEdit) return;
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
  }, [isEdit, tenantIdParam, tenantOptions, tenantId]);

  const trimmedTenantId = String(tenantId ?? '').trim();
  const trimmedValue = value.trim();
  const trimmedContactType = contactType.trim();
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'contact.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'contact.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const tenantListError = Boolean(tenantErrorCode);
  const hasTenants = tenantOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasTenants;
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    !trimmedValue ||
    !trimmedContactType ||
    (!isEdit && !trimmedTenantId);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        value: trimmedValue,
        contact_type: trimmedContactType,
        is_primary: Boolean(isPrimary),
      };
      if (!isEdit && trimmedTenantId) {
        payload.tenant_id = trimmedTenantId;
      }
      if (isEdit && id) {
        const result = await update(id, payload);
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
    isOffline,
    isEdit,
    id,
    trimmedValue,
    trimmedContactType,
    isPrimary,
    trimmedTenantId,
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
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [listTenants, resetTenants]);

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
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    hasTenants,
    isCreateBlocked,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    contact,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onRetryTenants: handleRetryTenants,
    isSubmitDisabled,
    testID: 'contact-form-screen',
  };
};

export default useContactFormScreen;
