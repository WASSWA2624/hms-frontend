/**
 * usePermissionFormScreen Hook
 * Shared logic for PermissionFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, usePermission, useTenant } from '@hooks';

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const usePermissionFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, tenantId: tenantIdParam } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = usePermission();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();

  const isEdit = Boolean(id);
  const [tenantId, setTenantId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const tenantPrefillRef = useRef(false);

  const permission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [isEdit, listTenants, resetTenants]);

  useEffect(() => {
    if (permission) {
      setTenantId(permission.tenant_id ?? '');
      setName(permission.name ?? '');
      setDescription(permission.description ?? '');
    }
  }, [permission]);

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
  const trimmedName = name.trim();
  const trimmedDescription = description.trim();

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'permission.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'permission.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );

  const tenantListError = Boolean(tenantErrorCode);
  const hasTenants = tenantOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasTenants;
  const isSubmitDisabled =
    isLoading || isCreateBlocked || !trimmedName || (!isEdit && !trimmedTenantId);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        name: trimmedName,
      };
      if (trimmedDescription) {
        payload.description = trimmedDescription;
      } else if (isEdit) {
        payload.description = null;
      }
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
      router.replace(`/settings/permissions?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    id,
    trimmedName,
    trimmedDescription,
    trimmedTenantId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/permissions');
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
    tenantId,
    setTenantId,
    name,
    setName,
    description,
    setDescription,
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
    permission,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onRetryTenants: handleRetryTenants,
    isSubmitDisabled,
    testID: 'permission-form-screen',
  };
};

export default usePermissionFormScreen;
