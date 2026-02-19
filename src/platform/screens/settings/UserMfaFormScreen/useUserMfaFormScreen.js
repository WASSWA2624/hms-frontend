/**
 * useUserMfaFormScreen Hook
 * Shared logic for UserMfaFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useTenantAccess, useUser, useUserMfa } from '@hooks';
import { humanizeIdentifier } from '@utils';

const MAX_REFERENCE_FETCH_LIMIT = 100;

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

const useUserMfaFormScreen = () => {
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
  const { get, create, update, data, isLoading, errorCode, reset } = useUserMfa();
  const {
    list: listUsers,
    data: userData,
    isLoading: userListLoading,
    errorCode: userErrorCode,
    reset: resetUsers,
  } = useUser();

  const routeUserMfaId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeUserMfaId);
  const canManageUserMfas = canAccessTenantSettings;
  const canCreateUserMfa = canManageUserMfas;
  const canEditUserMfa = canManageUserMfas;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageUserMfas && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => normalizeValue(scopedTenantId),
    [scopedTenantId]
  );
  const [userId, setUserId] = useState('');
  const [channel, setChannel] = useState('');
  const [secret, setSecret] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const userPrefillRef = useRef(false);

  const userMfa = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );
  const userOptions = useMemo(
    () =>
      userItems.map((userItem, index) => ({
        value: userItem.id,
        label: humanizeIdentifier(userItem?.name)
          || humanizeIdentifier(userItem?.full_name)
          || humanizeIdentifier(userItem?.email)
          || humanizeIdentifier(userItem?.phone)
          || humanizeIdentifier(userItem?.human_friendly_id)
          || (canViewTechnicalIds ? normalizeValue(userItem?.id) : '')
          || t('userMfa.form.userOptionFallback', { index: index + 1 }),
      })),
    [userItems, canViewTechnicalIds, t]
  );
  const userTenantLookup = useMemo(() => {
    const map = new Map();
    userItems.forEach((userItem) => {
      const mappedUserId = normalizeValue(userItem?.id);
      if (!mappedUserId) return;
      map.set(mappedUserId, normalizeValue(userItem?.tenant_id || userItem?.tenant?.id));
    });
    return map;
  }, [userItems]);
  const channelOptions = useMemo(() => ([
    { label: t('userMfa.channel.EMAIL'), value: 'EMAIL' },
    { label: t('userMfa.channel.SMS'), value: 'SMS' },
    { label: t('userMfa.channel.PUSH'), value: 'PUSH' },
    { label: t('userMfa.channel.WHATSAPP'), value: 'WHATSAPP' },
    { label: t('userMfa.channel.IN_APP'), value: 'IN_APP' },
  ]), [t]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserMfas) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateUserMfa) {
      router.replace('/settings/user-mfas?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditUserMfa) {
      router.replace('/settings/user-mfas?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUserMfas,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateUserMfa,
    canEditUserMfa,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserMfas || !isEdit || !routeUserMfaId) return;
    if (!canEditUserMfa) return;
    if (isEdit && routeUserMfaId) {
      reset();
      get(routeUserMfaId);
    }
  }, [
    isResolved,
    canManageUserMfas,
    isEdit,
    routeUserMfaId,
    canEditUserMfa,
    get,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserMfas) return;
    resetUsers();
    const params = { page: 1, limit: MAX_REFERENCE_FETCH_LIMIT };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listUsers(params);
  }, [
    isResolved,
    canManageUserMfas,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listUsers,
    resetUsers,
  ]);

  useEffect(() => {
    if (userMfa) {
      setUserId(userMfa.user_id ?? '');
      setChannel(userMfa.channel ?? '');
      setIsEnabled(userMfa.is_enabled ?? true);
    }
  }, [userMfa]);

  useEffect(() => {
    if (!isResolved || !canManageUserMfas || !isTenantScopedAdmin || !isEdit || !userMfa) return;
    const recordTenantId = normalizeValue(userMfa?.tenant_id);
    if (recordTenantId && recordTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/user-mfas?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUserMfas,
    isTenantScopedAdmin,
    isEdit,
    userMfa,
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
    if (!isResolved || !canManageUserMfas) return;
    if (errorCode !== 'FORBIDDEN' && errorCode !== 'UNAUTHORIZED') return;
    router.replace('/settings/user-mfas?notice=accessDenied');
  }, [isResolved, canManageUserMfas, errorCode, router]);

  const trimmedUserId = normalizeValue(userId);
  const trimmedChannel = normalizeValue(channel);
  const trimmedSecret = normalizeValue(secret);
  const selectedUserTenantId = useMemo(
    () => normalizeValue(userTenantLookup.get(trimmedUserId)),
    [userTenantLookup, trimmedUserId]
  );

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'userMfa.form.submitErrorMessage'),
    [t, errorCode]
  );
  const userErrorMessage = useMemo(
    () => resolveErrorMessage(t, userErrorCode, 'userMfa.form.userLoadErrorMessage'),
    [t, userErrorCode]
  );

  const hasUsers = userOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasUsers;
  const isSubmitDisabled =
    !isResolved
    || isLoading
    || isCreateBlocked
    || !trimmedUserId
    || !trimmedChannel
    || (!isEdit && !trimmedSecret);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateUserMfa) {
        router.replace('/settings/user-mfas?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditUserMfa) {
        router.replace('/settings/user-mfas?notice=accessDenied');
        return;
      }
      if (
        isTenantScopedAdmin
        && selectedUserTenantId
        && selectedUserTenantId !== normalizedScopedTenantId
      ) {
        router.replace('/settings/user-mfas?notice=accessDenied');
        return;
      }

      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        channel: trimmedChannel,
        is_enabled: isEnabled,
      };
      if (!isEdit) {
        payload.user_id = trimmedUserId;
      }
      if (trimmedSecret) {
        payload.secret_encrypted = trimmedSecret;
      }
      if (isEdit && routeUserMfaId) {
        const result = await update(routeUserMfaId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/user-mfas?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isEdit,
    canCreateUserMfa,
    canEditUserMfa,
    isTenantScopedAdmin,
    selectedUserTenantId,
    normalizedScopedTenantId,
    isOffline,
    trimmedChannel,
    isEnabled,
    trimmedUserId,
    trimmedSecret,
    routeUserMfaId,
    update,
    create,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/user-mfas');
  }, [router]);

  const handleGoToUsers = useCallback(() => {
    router.push('/settings/users');
  }, [router]);

  const handleRetryUsers = useCallback(() => {
    if (!isResolved || !canManageUserMfas) return;
    resetUsers();
    const params = { page: 1, limit: MAX_REFERENCE_FETCH_LIMIT };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    listUsers(params);
  }, [
    isResolved,
    canManageUserMfas,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listUsers,
    resetUsers,
  ]);

  return {
    isEdit,
    userId,
    setUserId,
    channel,
    setChannel,
    channelOptions,
    secret,
    setSecret,
    isEnabled,
    setIsEnabled,
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
    userMfa,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToUsers: handleGoToUsers,
    onRetryUsers: handleRetryUsers,
    isSubmitDisabled,
    testID: 'user-mfa-form-screen',
  };
};

export default useUserMfaFormScreen;
