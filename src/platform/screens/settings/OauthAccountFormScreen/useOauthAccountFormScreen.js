/**
 * useOauthAccountFormScreen Hook
 * Shared logic for OauthAccountFormScreen (create/edit).
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useOauthAccount } from '@hooks';
import { normalizeIsoDateTime, toDateInputValue } from '@utils';

const useOauthAccountFormScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useOauthAccount();

  const isEdit = Boolean(id);
  const [userId, setUserId] = useState('');
  const [provider, setProvider] = useState('');
  const [providerUserId, setProviderUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const oauthAccount = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (oauthAccount) {
      setUserId(oauthAccount.user_id ?? '');
      setProvider(oauthAccount.provider ?? '');
      setProviderUserId(oauthAccount.provider_user_id ?? '');
      setExpiresAt(toDateInputValue(oauthAccount.expires_at ?? ''));
    }
  }, [oauthAccount]);

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        provider: provider.trim() || undefined,
        provider_user_id: providerUserId.trim() || undefined,
      };
      const normalizedExpiresAt = normalizeIsoDateTime(expiresAt);
      if (normalizedExpiresAt) {
        payload.expires_at = normalizedExpiresAt;
      }
      const normalizedAccessToken = accessToken.trim();
      if (normalizedAccessToken) {
        payload.access_token_encrypted = normalizedAccessToken;
      }
      const normalizedRefreshToken = refreshToken.trim();
      if (normalizedRefreshToken) {
        payload.refresh_token_encrypted = normalizedRefreshToken;
      }
      if (!isEdit && userId.trim()) {
        payload.user_id = userId.trim();
      }
      if (isEdit && id) {
        await update(id, payload);
      } else {
        await create(payload);
      }
      router.replace('/settings/oauth-accounts');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, provider, providerUserId, expiresAt, accessToken, refreshToken, userId, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/oauth-accounts');
  }, [router]);

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
    isLoading,
    hasError: Boolean(errorCode),
    oauthAccount,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'oauth-account-form-screen',
  };
};

export default useOauthAccountFormScreen;
