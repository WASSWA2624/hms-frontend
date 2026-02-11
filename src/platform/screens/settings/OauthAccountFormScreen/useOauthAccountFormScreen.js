/**
 * useOauthAccountFormScreen Hook
 * Shared logic for OauthAccountFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useOauthAccount, useUser } from '@hooks';
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
  const { get, create, update, data, isLoading, errorCode, reset } = useOauthAccount();
  const {
    list: listUsers,
    data: userData,
    isLoading: userListLoading,
    errorCode: userErrorCode,
    reset: resetUsers,
  } = useUser();

  const isEdit = Boolean(id);
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
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    resetUsers();
    listUsers({ page: 1, limit: 200 });
  }, [listUsers, resetUsers]);

  useEffect(() => {
    if (oauthAccount) {
      setUserId(oauthAccount.user_id ?? '');
      setProvider(oauthAccount.provider ?? '');
      setProviderUserId(oauthAccount.provider_user_id ?? '');
      setExpiresAt(toDateInputValue(oauthAccount.expires_at ?? ''));
    }
  }, [oauthAccount]);

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
      if (isEdit && id) {
        const result = await update(id, payload);
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
    id,
    trimmedProvider,
    trimmedProviderUserId,
    normalizedExpiresAt,
    trimmedAccessToken,
    trimmedRefreshToken,
    trimmedUserId,
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
    resetUsers();
    listUsers({ page: 1, limit: 200 });
  }, [listUsers, resetUsers]);

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
    isLoading,
    hasError: Boolean(errorCode),
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
