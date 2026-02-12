/**
 * useTenantFormScreen Hook
 * Shared logic for TenantFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useTenant, useTenantAccess } from '@hooks';

const MAX_NAME_LENGTH = 255;
const MAX_SLUG_LENGTH = 191;

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
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    canCreateTenant,
    canEditTenant,
    tenantId,
    isResolved,
  } = useTenantAccess();
  const { get, create, update, data, isLoading, errorCode, reset } = useTenant();

  const routeTenantId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeTenantId);
  const targetTenantId = useMemo(() => {
    if (!isEdit) return null;
    if (canManageAllTenants) return routeTenantId;
    return tenantId || null;
  }, [isEdit, canManageAllTenants, routeTenantId, tenantId]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);

  const tenant = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const trimmedName = name.trim();
  const trimmedSlug = slug.trim();

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessTenantSettings) {
      router.replace('/settings');
      return;
    }
    if (canManageAllTenants) return;
    if (!tenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit) {
      router.replace('/settings/tenants');
      return;
    }
    if (routeTenantId && routeTenantId !== tenantId) {
      router.replace(`/settings/tenants/${tenantId}/edit`);
    }
  }, [
    isResolved,
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId,
    isEdit,
    routeTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isEdit || !targetTenantId || !isResolved || !canAccessTenantSettings) return;
    reset();
    get(targetTenantId);
  }, [isEdit, targetTenantId, isResolved, canAccessTenantSettings, get, reset]);

  useEffect(() => {
    if (!isEdit) {
      setName('');
      setSlug('');
      setIsActive(true);
      return;
    }
    if (tenant) {
      setName(tenant.name ?? '');
      setSlug(tenant.slug ?? '');
      setIsActive(tenant.is_active ?? true);
    }
  }, [tenant, isEdit]);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'tenant.form.submitErrorMessage'),
    [t, errorCode]
  );
  const nameError = useMemo(() => {
    if (!trimmedName) return t('tenant.form.nameRequired');
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return t('tenant.form.nameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedName, t]);
  const slugError = useMemo(() => {
    if (!trimmedSlug) return null;
    if (trimmedSlug.length > MAX_SLUG_LENGTH) {
      return t('tenant.form.slugTooLong', { max: MAX_SLUG_LENGTH });
    }
    return null;
  }, [trimmedSlug, t]);
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    Boolean(nameError) ||
    Boolean(slugError) ||
    (isEdit ? !canEditTenant : !canCreateTenant);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      if (isEdit) {
        if (!canEditTenant || !targetTenantId) return;
        const result = await update(targetTenantId, {
          name: trimmedName,
          slug: trimmedSlug ? trimmedSlug : null,
          is_active: isActive,
        });
        if (!result) return;
      } else {
        if (!canCreateTenant) return;
        const result = await create({
          name: trimmedName,
          slug: trimmedSlug || undefined,
          is_active: isActive,
        });
        if (!result) return;
      }
      router.replace(`/settings/tenants?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    canEditTenant,
    canCreateTenant,
    targetTenantId,
    trimmedName,
    trimmedSlug,
    isActive,
    create,
    update,
    router,
  ]);

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
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    nameError,
    slugError,
    isOffline,
    tenant,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    isSubmitDisabled,
    testID: 'tenant-form-screen',
  };
};

export default useTenantFormScreen;
