/**
 * useApiKeyFormScreen Hook
 * Shared logic for ApiKeyFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApiKey, useI18n, useNetwork, useTenant, useUser } from '@hooks';
import { normalizeIsoDateTime, toDateInputValue } from '@utils';

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useApiKeyFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, tenantId: tenantIdParam, userId: userIdParam } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useApiKey();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();
  const {
    list: listUsers,
    data: userData,
    isLoading: userListLoading,
    errorCode: userErrorCode,
    reset: resetUsers,
  } = useUser();

  const isEdit = Boolean(id);
  const [tenantId, setTenantId] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const tenantPrefillRef = useRef(false);
  const userPrefillRef = useRef(false);

  const apiKey = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? [])),
    [tenantData]
  );
  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );
  const tenantOptions = useMemo(
    () =>
      tenantItems.map((tenant) => ({
        value: tenant.id,
        label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
      })),
    [tenantItems]
  );
  const userOptions = useMemo(
    () =>
      userItems.map((user) => ({
        value: user.id,
        label: user.email ?? user.phone ?? user.id ?? '',
      })),
    [userItems]
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
    if (apiKey) {
      setTenantId(apiKey.tenant_id ?? '');
      setUserId(apiKey.user_id ?? '');
      setName(apiKey.name ?? '');
      setIsActive(apiKey.is_active ?? true);
      setExpiresAt(toDateInputValue(apiKey.expires_at ?? ''));
    }
  }, [apiKey]);

  const trimmedTenantId = String(tenantId ?? '').trim();

  useEffect(() => {
    if (isEdit) return;
    if (!trimmedTenantId) {
      resetUsers();
      return;
    }
    resetUsers();
    listUsers({ page: 1, limit: 200, tenant_id: trimmedTenantId });
  }, [isEdit, trimmedTenantId, listUsers, resetUsers]);

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

  useEffect(() => {
    if (isEdit) return;
    if (userPrefillRef.current) return;
    const paramValue = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
    if (paramValue) {
      setUserId(String(paramValue));
      userPrefillRef.current = true;
      return;
    }
    if (userOptions.length === 1 && !userId) {
      setUserId(userOptions[0].value);
      userPrefillRef.current = true;
    }
  }, [isEdit, userIdParam, userOptions, userId]);

  const trimmedUserId = String(userId ?? '').trim();
  const trimmedName = name.trim();

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'apiKey.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'apiKey.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const userErrorMessage = useMemo(
    () => resolveErrorMessage(t, userErrorCode, 'apiKey.form.userLoadErrorMessage'),
    [t, userErrorCode]
  );

  const hasTenants = tenantOptions.length > 0;
  const hasUsers = userOptions.length > 0;
  const isCreateBlocked = !isEdit && (!hasTenants || (trimmedTenantId ? !hasUsers : false));
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    !trimmedName ||
    (!isEdit && (!trimmedTenantId || !trimmedUserId));

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        name: trimmedName,
      };
      const normalizedExpiresAt = normalizeIsoDateTime(expiresAt);
      if (normalizedExpiresAt) {
        payload.expires_at = normalizedExpiresAt;
      } else if (isEdit) {
        payload.expires_at = null;
      }
      if (isEdit && id) {
        payload.is_active = isActive;
        const result = await update(id, payload);
        if (!result) return;
      } else {
        if (trimmedTenantId) payload.tenant_id = trimmedTenantId;
        if (trimmedUserId) payload.user_id = trimmedUserId;
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/api-keys?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    id,
    trimmedName,
    trimmedTenantId,
    trimmedUserId,
    expiresAt,
    isActive,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/api-keys');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleGoToUsers = useCallback(() => {
    router.push('/settings/users');
  }, [router]);

  const handleRetryTenants = useCallback(() => {
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [listTenants, resetTenants]);

  const handleRetryUsers = useCallback(() => {
    resetUsers();
    listUsers({ page: 1, limit: 200, tenant_id: trimmedTenantId || undefined });
  }, [listUsers, resetUsers, trimmedTenantId]);

  return {
    isEdit,
    tenantId,
    setTenantId,
    userId,
    setUserId,
    name,
    setName,
    isActive,
    setIsActive,
    expiresAt,
    setExpiresAt,
    tenantOptions,
    tenantListLoading,
    tenantListError: Boolean(tenantErrorCode),
    tenantErrorMessage,
    userOptions,
    userListLoading,
    userListError: Boolean(userErrorCode),
    userErrorMessage,
    hasTenants,
    hasUsers,
    isCreateBlocked,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    apiKey,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToUsers: handleGoToUsers,
    onRetryTenants: handleRetryTenants,
    onRetryUsers: handleRetryUsers,
    isSubmitDisabled,
    testID: 'api-key-form-screen',
  };
};

export default useApiKeyFormScreen;
