/**
 * useOauthAccountFormScreen Hook
 * Shared logic for OauthAccountFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PAGINATION } from '@config/constants';
import { useI18n, useNetwork, useOauthAccount, useTenantAccess, useUser } from '@hooks';
import { normalizeIsoDateTime, toDateInputValue, humanizeIdentifier } from '@utils';

const DEFAULT_REFERENCE_FETCH_LIMIT = PAGINATION.MAX_LIMIT;

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const normalizeValue = (value) => String(value ?? '').trim();
const uniqueArray = (values = []) => [...new Set(values)];

const normalizeFetchLimit = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_REFERENCE_FETCH_LIMIT;
  return Math.min(PAGINATION.MAX_LIMIT, Math.max(1, Math.trunc(numeric)));
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
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageOauthAccounts && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => normalizeValue(scopedTenantId),
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
  const userLookup = useMemo(() => {
    const map = new Map();
    userItems.forEach((userItem, index) => {
      const userIdValue = normalizeValue(userItem?.id);
      if (!userIdValue) return;
      const userLabel = humanizeIdentifier(userItem?.name)
        || humanizeIdentifier(userItem?.full_name)
        || humanizeIdentifier(userItem?.display_name)
        || humanizeIdentifier(userItem?.email)
        || humanizeIdentifier(userItem?.phone)
        || (canViewTechnicalIds ? userIdValue : '')
        || t('oauthAccount.form.userOptionFallback', { index: index + 1 });
      map.set(userIdValue, {
        label: userLabel,
        tenantId: normalizeValue(userItem?.tenant_id || userItem?.tenant?.id),
      });
    });
    return map;
  }, [userItems, canViewTechnicalIds, t]);
  const userOptions = useMemo(
    () =>
      userItems.map((userItem, index) => {
        const userIdValue = normalizeValue(userItem?.id);
        const userContext = userLookup.get(userIdValue);
        return {
          value: userIdValue,
          label: userContext?.label || t('oauthAccount.form.userOptionFallback', { index: index + 1 }),
        };
      }),
    [userItems, userLookup, t]
  );
  const hasUsers = userOptions.length > 0;

  const resolveTenantIdsForSelection = useCallback((targetUserId, record = null) => {
    const selectedUserId = normalizeValue(targetUserId);
    const userContext = userLookup.get(selectedUserId);
    return uniqueArray(
      [
        normalizeValue(record?.tenant_id),
        normalizeValue(userContext?.tenantId),
      ].filter(Boolean)
    );
  }, [userLookup]);

  const canAccessTenantScopedUser = useCallback((targetUserId, record = null) => {
    if (!isTenantScopedAdmin) return true;
    if (!normalizedScopedTenantId) return false;
    const tenantIds = resolveTenantIdsForSelection(targetUserId, record);
    if (tenantIds.length === 0) return false;
    return tenantIds.every((tenantIdValue) => tenantIdValue === normalizedScopedTenantId);
  }, [isTenantScopedAdmin, normalizedScopedTenantId, resolveTenantIdsForSelection]);

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
    const params = {
      page: 1,
      limit: normalizeFetchLimit(DEFAULT_REFERENCE_FETCH_LIMIT),
    };
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
      setUserId(normalizeValue(oauthAccount.user_id));
      setProvider(oauthAccount.provider ?? '');
      setProviderUserId(oauthAccount.provider_user_id ?? '');
      setExpiresAt(toDateInputValue(oauthAccount.expires_at ?? ''));
    }
  }, [oauthAccount]);

  useEffect(() => {
    if (!isResolved || !canManageOauthAccounts || !isTenantScopedAdmin || !isEdit || !oauthAccount) return;
    if (userListLoading) return;
    if (!canAccessTenantScopedUser(oauthAccount?.user_id, oauthAccount)) {
      router.replace('/settings/oauth-accounts?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageOauthAccounts,
    isTenantScopedAdmin,
    isEdit,
    oauthAccount,
    userListLoading,
    canAccessTenantScopedUser,
    router,
  ]);

  useEffect(() => {
    if (isEdit) return;
    if (userPrefillRef.current) return;
    const paramValue = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
    if (paramValue) {
      setUserId(normalizeValue(paramValue));
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

  const trimmedUserId = normalizeValue(userId);
  const trimmedProvider = normalizeValue(provider);
  const trimmedProviderUserId = normalizeValue(providerUserId);
  const trimmedAccessToken = normalizeValue(accessToken);
  const trimmedRefreshToken = normalizeValue(refreshToken);
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
  const isTenantScopedSelectionAllowed = canAccessTenantScopedUser(
    trimmedUserId,
    isEdit ? oauthAccount : null
  );
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    !trimmedProvider ||
    !trimmedProviderUserId ||
    (!isEdit && !trimmedUserId) ||
    !isTenantScopedSelectionAllowed;

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
      if (!canAccessTenantScopedUser(trimmedUserId, isEdit ? oauthAccount : null)) {
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
    canAccessTenantScopedUser,
    oauthAccount,
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
    const params = {
      page: 1,
      limit: normalizeFetchLimit(DEFAULT_REFERENCE_FETCH_LIMIT),
    };
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
