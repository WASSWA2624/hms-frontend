/**
 * useUserMfaFormScreen Hook
 * Shared logic for UserMfaFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useUserMfa } from '@hooks';

const useUserMfaFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useUserMfa();

  const isEdit = Boolean(id);
  const [userId, setUserId] = useState('');
  const [channel, setChannel] = useState('');
  const [secret, setSecret] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);

  const userMfa = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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
    if (userMfa) {
      setUserId(userMfa.user_id ?? '');
      setChannel(userMfa.channel ?? '');
      setIsEnabled(userMfa.is_enabled ?? true);
    }
  }, [userMfa]);

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        channel: channel || undefined,
        is_enabled: isEnabled,
      };
      const normalizedSecret = secret.trim();
      if (normalizedSecret) {
        payload.secret_encrypted = normalizedSecret;
      }
      if (!isEdit && userId.trim()) {
        payload.user_id = userId.trim();
      }
      if (isEdit && id) {
        await update(id, payload);
      } else {
        await create(payload);
      }
      router.replace('/settings/user-mfas');
    } catch {
      /* error from hook */
    }
  }, [isEdit, id, channel, isEnabled, secret, userId, create, update, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/user-mfas');
  }, [router]);

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
    isLoading,
    hasError: Boolean(errorCode),
    userMfa,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'user-mfa-form-screen',
  };
};

export default useUserMfaFormScreen;
