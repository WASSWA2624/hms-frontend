/**
 * useOauthAccountFormScreen Hook
 * Shared logic for OauthAccountFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useOauthAccount, useTenantAccess, useUser } from '@hooks';
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

const useOauthAccountFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, userId: userIdParam } = useLocalSearchParams();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const { get, create, update, data, isLoading, errorCode, reset } = useOauthAccount();
  const {
    list: listUsers,
    data: userData,
    isLoading: userListLoading,
    errorCode: userErrorCode,
    reset: resetUsers,
  } = useUser();

  const routeOauthAccountId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeOauthAccountId);
  const canManageOauthAccounts = canAccessTenantSettings;
  const canCreateOauthAccount = canManageOauthAccounts;
  const canEditOauthAccount = canManageOauthAccounts;
  const isTenantScopedAdmin = canManageOauthAccounts && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [userId, setUserId] = useState('');
  const [provider, setProvider] = useState('');
  const [providerUserId, setProviderUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const userPrefillRef = useRef(false);

  const oauthAccount = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );
  const userOptions = useMemo(
    () =>
      userItems.map((user) => ({
        value: user.id,
        label: user.email ?? user.phone ?? user.id ?? '',
      })),
    [userItems]
  );
  const hasUsers = userOptions.length > 0;

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageOauthAccounts) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateOauthAccount) {
      router.replace('/settings/oauth-accounts?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditOauthAccount) {
      router.replace('/settings/oauth-accounts?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageOauthAccounts,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateOauthAccount,
    canEditOauthAccount,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageOauthAccounts || !isEdit || !routeOauthAccountId) return;
    if (!canEditOauthAccount) return;
    if (isEdit && routeOauthAccountId) {
      reset();
      get(routeOauthAccountId);
    }
  }, [
    isResolved,
    canManageOauthAccounts,
    isEdit,
    routeOauthAccountId,
    canEditOauthAccount,
    get,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageOauthAccounts) return;
    resetUsers();
    const params = { page: 1, limit: 200 };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listUsers(params);
  }, [
    isResolved,
    canManageOauthAccounts,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listUsers,
    resetUsers,
  ]);

  useEffect(() => {
    if (oauthAccount) {
      setUserId(oauthAccount.user_id ?? '');
      setProvider(oauthAccount.provider ?? '');
      setProviderUserId(oauthAccount.provider_user_id ?? '');
      setExpiresAt(toDateInputValue(oauthAccount.expires_at ?? ''));
    }
  }, [oauthAccount]);

  useEffect(() => {
    if (!isResolved || !canManageOauthAccounts || !isTenantScopedAdmin || !isEdit || !oauthAccount) return;
    const recordTenantId = String(oauthAccount?.tenant_id ?? '').trim();
    if (recordTenantId && recordTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/oauth-accounts?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageOauthAccounts,
    isTenantScopedAdmin,
    isEdit,
    oauthAccount,
    normalizedScopedTenantId,
    router,
  ]);

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

  useEffect(() => {
    if (!isResolved || !canManageOauthAccounts) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    router.replace('/settings/oauth-accounts?notice=accessDenied');
  }, [isResolved, canManageOauthAccounts, errorCode, router]);

  const trimmedUserId = String(userId ?? '').trim();
  const trimmedProvider = String(provider ?? '').trim();
  const trimmedProviderUserId = String(providerUserId ?? '').trim();
  const trimmedAccessToken = String(accessToken ?? '').trim();
  const trimmedRefreshToken = String(refreshToken ?? '').trim();
  const normalizedExpiresAt = normalizeIsoDateTime(expiresAt);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'oauthAccount.form.submitErrorMessage'),
    [t, errorCode]
  );
  const userErrorMessage = useMemo(
    () => resolveErrorMessage(t, userErrorCode, 'oauthAccount.form.userLoadErrorMessage'),
    [t, userErrorCode]
  );
  const isCreateBlocked = !isEdit && !hasUsers;
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    !trimmedProvider ||
    !trimmedProviderUserId ||
    (!isEdit && !trimmedUserId);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateOauthAccount) {
        router.replace('/settings/oauth-accounts?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditOauthAccount) {
        router.replace('/settings/oauth-accounts?notice=accessDenied');
        return;
      }
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        provider: trimmedProvider,
        provider_user_id: trimmedProviderUserId,
      };
      if (normalizedExpiresAt) {
        payload.expires_at = normalizedExpiresAt;
      }
      if (trimmedAccessToken) {
        payload.access_token_encrypted = trimmedAccessToken;
      }
      if (trimmedRefreshToken) {
        payload.refresh_token_encrypted = trimmedRefreshToken;
      }
      if (!isEdit) {
        payload.user_id = trimmedUserId;
      }
      if (isEdit && routeOauthAccountId) {
        const result = await update(routeOauthAccountId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/oauth-accounts?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    trimmedProvider,
    trimmedProviderUserId,
    normalizedExpiresAt,
    trimmedAccessToken,
    trimmedRefreshToken,
    trimmedUserId,
    canCreateOauthAccount,
    canEditOauthAccount,
    routeOauthAccountId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/oauth-accounts');
  }, [router]);

  const handleGoToUsers = useCallback(() => {
    router.push('/settings/users');
  }, [router]);

  const handleRetryUsers = useCallback(() => {
    if (!isResolved || !canManageOauthAccounts) return;
    resetUsers();
    const params = { page: 1, limit: 200 };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listUsers(params);
  }, [
    isResolved,
    canManageOauthAccounts,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listUsers,
    resetUsers,
  ]);

  return {
    isEdit,
    userId,
    setUserId,
    provider,
    setProvider,
    providerUserId,
    setProviderUserId,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    expiresAt,
    setExpiresAt,
    userOptions,
    userListLoading,
    userListError: Boolean(userErrorCode),
    userErrorMessage,
    hasUsers,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    oauthAccount,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToUsers: handleGoToUsers,
    onRetryUsers: handleRetryUsers,
    isSubmitDisabled,
    testID: 'oauth-account-form-screen',
  };
};

export default useOauthAccountFormScreen;
