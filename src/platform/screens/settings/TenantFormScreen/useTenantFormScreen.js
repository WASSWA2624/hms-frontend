/**
 * useTenantFormScreen Hook
 * Shared logic for TenantFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useTenant } from '@hooks';

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useTenantFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useTenant();

  const isEdit = Boolean(id);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);

  const tenant = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name ?? '');
      setSlug(tenant.slug ?? '');
      setIsActive(tenant.is_active ?? true);
    }
  }, [tenant]);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'tenant.form.submitErrorMessage'),
    [t, errorCode]
  );

  const handleSubmit = useCallback(async () => {
    try {
      const trimmedName = name.trim();
      const trimmedSlug = slug.trim();
      if (isEdit && id) {
        const result = await update(id, {
          name: trimmedName,
          slug: trimmedSlug ? trimmedSlug : null,
          is_active: isActive,
        });
        if (!result) return;
      } else {
        const result = await create({
          name: trimmedName,
          slug: trimmedSlug || undefined,
          is_active: isActive,
        });
        if (!result) return;
      }
      router.replace('/settings/tenants');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, name, slug, isActive, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  return {
    isEdit,
    name,
    setName,
    slug,
    setSlug,
    isActive,
    setIsActive,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    tenant,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'tenant-form-screen',
  };
};

export default useTenantFormScreen;
