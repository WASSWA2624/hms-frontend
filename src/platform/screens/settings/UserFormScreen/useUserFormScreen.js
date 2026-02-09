/**
 * useUserFormScreen Hook
 * Shared logic for UserFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useUser } from '@hooks';

const useUserFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useUser();

  const isEdit = Boolean(id);
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const user = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const statusOptions = useMemo(
    () => ([
      { label: t('user.status.ACTIVE'), value: 'ACTIVE' },
      { label: t('user.status.INACTIVE'), value: 'INACTIVE' },
      { label: t('user.status.SUSPENDED'), value: 'SUSPENDED' },
      { label: t('user.status.PENDING'), value: 'PENDING' },
    ]),
    [t]
  );

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (user) {
      setTenantId(user.tenant_id ?? '');
      setFacilityId(user.facility_id ?? '');
      setEmail(user.email ?? '');
      setPhone(user.phone ?? '');
      setStatus(user.status ?? 'ACTIVE');
      setPassword('');
    }
  }, [user]);

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        facility_id: facilityId?.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
        status: status || undefined,
      };
      const trimmedPassword = password.trim();
      if (trimmedPassword) {
        payload.password_hash = trimmedPassword;
      }
      if (!isEdit && tenantId?.trim()) {
        payload.tenant_id = tenantId.trim();
      }
      if (isEdit && id) {
        await update(id, payload);
      } else {
        await create(payload);
      }
      router.replace('/settings/users');
    } catch {
      /* error from hook */
    }
  }, [
    isEdit,
    id,
    tenantId,
    facilityId,
    email,
    phone,
    password,
    status,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/users');
  }, [router]);

  return {
    isEdit,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    status,
    setStatus,
    statusOptions,
    isLoading,
    hasError: Boolean(errorCode),
    user,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'user-form-screen',
  };
};

export default useUserFormScreen;
