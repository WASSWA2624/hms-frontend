/**
 * useContactFormScreen Hook
 * Shared logic for ContactFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useContact } from '@hooks';

const useContactFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useContact();

  const isEdit = Boolean(id);
  const [value, setValue] = useState('');
  const [contactType, setContactType] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [tenantId, setTenantId] = useState('');

  const contact = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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
    if (contact) {
      setValue(contact.value ?? '');
      setContactType(contact.contact_type ?? contact.type ?? '');
      setIsPrimary(contact.is_primary ?? false);
      setTenantId(contact.tenant_id ?? '');
    }
  }, [contact]);

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        value: value.trim(),
        contact_type: contactType.trim() || undefined,
        is_primary: isPrimary,
      };
      if (!isEdit && tenantId?.trim()) {
        payload.tenant_id = tenantId.trim();
      }
      if (isEdit && id) {
        await update(id, payload);
      } else {
        await create(payload);
      }
      router.replace('/settings/contacts');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, value, contactType, isPrimary, tenantId, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/contacts');
  }, [router]);

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
    isLoading,
    hasError: Boolean(errorCode),
    contact,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'contact-form-screen',
  };
};

export default useContactFormScreen;
