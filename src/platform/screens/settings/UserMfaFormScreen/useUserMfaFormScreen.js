/**
 * useUserMfaFormScreen Hook
 * Shared logic for UserMfaFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useUser, useUserMfa } from '@hooks';

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useUserMfaFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, userId: userIdParam } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useUserMfa();
  const {
    list: listUsers,
    data: userData,
    isLoading: userListLoading,
    errorCode: userErrorCode,
    reset: resetUsers,
  } = useUser();

  const isEdit = Boolean(id);
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
      userItems.map((user) => ({
        value: user.id,
        label: user.email ?? user.phone ?? user.id ?? '',
      })),
    [userItems]
  );
  const channelOptions = useMemo(() => ([
    { label: t('userMfa.channel.EMAIL'), value: 'EMAIL' },
    { label: t('userMfa.channel.SMS'), value: 'SMS' },
    { label: t('userMfa.channel.PUSH'), value: 'PUSH' },
    { label: t('userMfa.channel.WHATSAPP'), value: 'WHATSAPP' },
    { label: t('userMfa.channel.IN_APP'), value: 'IN_APP' },
  ]), [t]);

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
    if (userMfa) {
      setUserId(userMfa.user_id ?? '');
      setChannel(userMfa.channel ?? '');
      setIsEnabled(userMfa.is_enabled ?? true);
    }
  }, [userMfa]);

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
  const trimmedChannel = String(channel ?? '').trim();
  const trimmedSecret = String(secret ?? '').trim();

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
    isLoading ||
    isCreateBlocked ||
    !trimmedUserId ||
    !trimmedChannel ||
    (!isEdit && !trimmedSecret);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
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
      if (isEdit && id) {
        const result = await update(id, payload);
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
    isOffline,
    isEdit,
    id,
    trimmedChannel,
    trimmedUserId,
    trimmedSecret,
    isEnabled,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/user-mfas');
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
    isLoading,
    hasError: Boolean(errorCode),
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
