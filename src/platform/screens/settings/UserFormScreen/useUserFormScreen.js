/**
 * useUserFormScreen Hook
 * Shared logic for UserFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useTenant, useFacility, useUser, useTenantAccess } from '@hooks';
import { isValidEmail } from '@utils';

const MAX_EMAIL_LENGTH = 255;
const MAX_PHONE_LENGTH = 40;
const MAX_PASSWORD_LENGTH = 255;
const MIN_PASSWORD_LENGTH = 8;
const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'];

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useUserFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, tenantId: tenantIdParam } = useLocalSearchParams();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const routeUserId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const { get, create, update, data, isLoading, errorCode, reset } = useUser();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();
  const {
    list: listFacilities,
    data: facilityData,
    isLoading: facilityListLoading,
    errorCode: facilityErrorCode,
    reset: resetFacilities,
  } = useFacility();

  const isEdit = Boolean(routeUserId);
  const canManageUsers = canAccessTenantSettings;
  const canCreateUser = canManageUsers;
  const canEditUser = canManageUsers;
  const isTenantScopedAdmin = canManageUsers && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const tenantPrefillRef = useRef(false);
  const previousTenantRef = useRef('');

  const user = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (isTenantScopedAdmin || isEdit
      ? []
      : (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? []))),
    [tenantData, isTenantScopedAdmin, isEdit]
  );
  const facilityItems = useMemo(
    () => (Array.isArray(facilityData) ? facilityData : (facilityData?.items ?? [])),
    [facilityData]
  );
  const tenantOptions = useMemo(
    () => {
      if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
        return [{ value: normalizedScopedTenantId, label: normalizedScopedTenantId }];
      }
      return tenantItems.map((tenant) => ({
        value: tenant.id,
        label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
      }));
    },
    [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId]
  );
  const facilityOptions = useMemo(
    () => {
      const options = facilityItems.map((facility) => ({
        value: facility.id,
        label: facility.name ?? facility.id ?? '',
      }));
      if (facilityId && !options.some((option) => option.value === facilityId)) {
        return [{ value: facilityId, label: facilityId }, ...options];
      }
      return options;
    },
    [facilityItems, facilityId]
  );
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
    if (!isResolved) return;
    if (!canManageUsers) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateUser) {
      router.replace('/settings/users?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditUser) {
      router.replace('/settings/users?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUsers,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateUser,
    canEditUser,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUsers || !isEdit || !routeUserId) return;
    if (!canEditUser) return;
    reset();
    get(routeUserId);
  }, [isResolved, canManageUsers, isEdit, routeUserId, canEditUser, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageUsers || !isEdit) return;
    if (user) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/users?notice=accessDenied');
    }
  }, [isResolved, canManageUsers, isEdit, user, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageUsers || !isTenantScopedAdmin || !isEdit || !user) return;
    const userTenantId = String(user.tenant_id ?? '').trim();
    if (!userTenantId || userTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/users?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUsers,
    isTenantScopedAdmin,
    isEdit,
    user,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUsers || isEdit) return;
    if (!canCreateUser) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      tenantPrefillRef.current = true;
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [
    isResolved,
    canManageUsers,
    isEdit,
    canCreateUser,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (user) {
      setTenantId(String(user.tenant_id ?? normalizedScopedTenantId ?? ''));
      setFacilityId(String(user.facility_id ?? ''));
      setEmail(user.email ?? '');
      setPhone(user.phone ?? '');
      setStatus(user.status ?? 'ACTIVE');
      setPassword('');
    }
  }, [user, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageUsers) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (!trimmedTenant) {
      resetFacilities();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenant });
  }, [isResolved, canManageUsers, tenantId, listFacilities, resetFacilities]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (previousTenantRef.current && previousTenantRef.current !== trimmedTenant) {
      setFacilityId('');
    }
    previousTenantRef.current = trimmedTenant;
  }, [tenantId, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    if (isTenantScopedAdmin) return;
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
  }, [isEdit, isTenantScopedAdmin, tenantIdParam, tenantOptions, tenantId]);

  const trimmedTenantId = String(tenantId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();
  const trimmedEmail = email.trim();
  const trimmedPhone = phone.trim();
  const trimmedPassword = password.trim();
  const trimmedStatus = status.trim();

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'user.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'user.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'user.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );
  const emailError = useMemo(() => {
    if (!trimmedEmail) return t('user.form.emailRequired');
    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      return t('user.form.emailTooLong', { max: MAX_EMAIL_LENGTH });
    }
    if (!isValidEmail(trimmedEmail)) {
      return t('user.form.emailInvalid');
    }
    return null;
  }, [trimmedEmail, t]);
  const phoneError = useMemo(() => {
    if (!trimmedPhone) return null;
    if (trimmedPhone.length > MAX_PHONE_LENGTH) {
      return t('user.form.phoneTooLong', { max: MAX_PHONE_LENGTH });
    }
    return null;
  }, [trimmedPhone, t]);
  const passwordError = useMemo(() => {
    if (!trimmedPassword) {
      return isEdit ? null : t('user.form.passwordRequired');
    }
    if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
      return t('user.form.passwordTooShort', { min: MIN_PASSWORD_LENGTH });
    }
    if (trimmedPassword.length > MAX_PASSWORD_LENGTH) {
      return t('user.form.passwordTooLong', { max: MAX_PASSWORD_LENGTH });
    }
    return null;
  }, [isEdit, trimmedPassword, t]);
  const statusError = useMemo(() => {
    if (!trimmedStatus) return t('user.form.statusRequired');
    if (!USER_STATUSES.includes(trimmedStatus)) {
      return t('user.form.statusInvalid');
    }
    return null;
  }, [trimmedStatus, t]);
  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('user.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);

  const hasTenants = isTenantScopedAdmin
    ? Boolean(trimmedTenantId)
    : (tenantOptions.length > 0 || Boolean(trimmedTenantId));
  const hasFacilities = facilityOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasTenants;
  const isTenantLocked = !isEdit && isTenantScopedAdmin;
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return trimmedTenantId || normalizedScopedTenantId;
  }, [isTenantLocked, trimmedTenantId, normalizedScopedTenantId]);
  const showFacilityEmpty =
    !isEdit && Boolean(trimmedTenantId) && !facilityListLoading && !facilityErrorCode && !hasFacilities;
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    Boolean(emailError) ||
    Boolean(phoneError) ||
    Boolean(passwordError) ||
    Boolean(statusError) ||
    Boolean(tenantError) ||
    (isEdit ? !canEditUser : !canCreateUser);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateUser) {
        router.replace('/settings/users?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditUser) {
        router.replace('/settings/users?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const userTenantId = String(user?.tenant_id ?? '').trim();
        if (!userTenantId || userTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/users?notice=accessDenied');
          return;
        }
      }

      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        email: trimmedEmail,
        status: trimmedStatus || undefined,
      };
      if (trimmedPhone) {
        payload.phone = trimmedPhone;
      } else if (isEdit) {
        payload.phone = null;
      }
      if (trimmedFacilityId) {
        payload.facility_id = trimmedFacilityId;
      } else if (isEdit) {
        payload.facility_id = null;
      }
      if (trimmedPassword) {
        payload.password = trimmedPassword;
      }
      if (!isEdit) {
        payload.tenant_id = isTenantScopedAdmin ? normalizedScopedTenantId : trimmedTenantId;
      }
      if (isEdit && routeUserId) {
        const result = await update(routeUserId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/users?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isEdit,
    canCreateUser,
    canEditUser,
    isTenantScopedAdmin,
    user,
    normalizedScopedTenantId,
    isOffline,
    routeUserId,
    trimmedEmail,
    trimmedStatus,
    trimmedPhone,
    trimmedPassword,
    trimmedFacilityId,
    trimmedTenantId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/users');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleGoToFacilities = useCallback(() => {
    router.push('/settings/facilities');
  }, [router]);

  const handleRetryTenants = useCallback(() => {
    if (isTenantScopedAdmin || isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  const handleRetryFacilities = useCallback(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    resetFacilities();
    if (!trimmedTenant) return;
    listFacilities({ page: 1, limit: 200, tenant_id: trimmedTenant });
  }, [listFacilities, resetFacilities, tenantId]);

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
    tenantOptions,
    tenantListLoading: isTenantScopedAdmin || isEdit ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin || isEdit ? false : Boolean(tenantErrorCode),
    tenantErrorMessage: isTenantScopedAdmin || isEdit ? null : tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError: Boolean(facilityErrorCode),
    facilityErrorMessage,
    hasTenants,
    hasFacilities,
    isCreateBlocked,
    showFacilityEmpty,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    user,
    emailError,
    phoneError,
    passwordError,
    statusError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToFacilities: handleGoToFacilities,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    isSubmitDisabled,
    testID: 'user-form-screen',
  };
};

export default useUserFormScreen;
