/**
 * useUserProfileFormScreen Hook
 * Shared logic for UserProfileFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useI18n,
  useNetwork,
  useFacility,
  useTenantAccess,
  useUser,
  useUserProfile,
} from '@hooks';
import { normalizeIsoDateTime, toDateInputValue } from '@utils';

const MAX_NAME_LENGTH = 120;

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useUserProfileFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const router = useRouter();
  const { id, userId: userIdParam, facilityId: facilityIdParam } = useLocalSearchParams();
  const routeProfileId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const { get, create, update, data, isLoading, errorCode, reset } = useUserProfile();
  const {
    list: listUsers,
    data: userData,
    isLoading: userListLoading,
    errorCode: userErrorCode,
    reset: resetUsers,
  } = useUser();
  const {
    list: listFacilities,
    data: facilityData,
    isLoading: facilityListLoading,
    errorCode: facilityErrorCode,
    reset: resetFacilities,
  } = useFacility();

  const isEdit = Boolean(routeProfileId);
  const canManageUserProfiles = canAccessTenantSettings;
  const canCreateUserProfile = canManageUserProfiles;
  const canEditUserProfile = canManageUserProfiles;
  const isTenantScopedAdmin = canManageUserProfiles && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [userId, setUserId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const userPrefillRef = useRef(false);
  const facilityPrefillRef = useRef(false);

  const profile = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );
  const facilityItems = useMemo(
    () => (Array.isArray(facilityData) ? facilityData : (facilityData?.items ?? [])),
    [facilityData]
  );
  const userOptions = useMemo(() => {
    const options = userItems.map((user) => ({
      value: user.id,
      label: user.email ?? user.phone ?? user.id ?? '',
    }));
    if (!isEdit && userId && !options.some((option) => option.value === userId)) {
      return [{ value: userId, label: userId }, ...options];
    }
    return options;
  }, [userItems, isEdit, userId]);
  const facilityOptions = useMemo(() => {
    const options = facilityItems.map((facility) => ({
      value: facility.id,
      label: facility.name ?? facility.id ?? '',
    }));
    if (facilityId && !options.some((option) => option.value === facilityId)) {
      return [{ value: facilityId, label: facilityId }, ...options];
    }
    return options;
  }, [facilityItems, facilityId]);
  const genderOptions = useMemo(
    () => ([
      { label: t('userProfile.gender.MALE'), value: 'MALE' },
      { label: t('userProfile.gender.FEMALE'), value: 'FEMALE' },
      { label: t('userProfile.gender.OTHER'), value: 'OTHER' },
      { label: t('userProfile.gender.UNKNOWN'), value: 'UNKNOWN' },
    ]),
    [t]
  );

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserProfiles) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateUserProfile) {
      router.replace('/settings/user-profiles?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditUserProfile) {
      router.replace('/settings/user-profiles?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUserProfiles,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateUserProfile,
    canEditUserProfile,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserProfiles || !isEdit || !routeProfileId) return;
    if (!canEditUserProfile) return;
    reset();
    get(routeProfileId);
  }, [
    isResolved,
    canManageUserProfiles,
    isEdit,
    routeProfileId,
    canEditUserProfile,
    get,
    reset,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserProfiles || !isEdit) return;
    if (profile) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/user-profiles?notice=accessDenied');
    }
  }, [isResolved, canManageUserProfiles, isEdit, profile, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageUserProfiles || isEdit) return;
    if (!canCreateUserProfile) return;
    if (isTenantScopedAdmin && !normalizedScopedTenantId) return;
    const params = { page: 1, limit: 200 };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    resetUsers();
    listUsers(params);
  }, [
    isResolved,
    canManageUserProfiles,
    isEdit,
    canCreateUserProfile,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listUsers,
    resetUsers,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserProfiles) return;
    if (isTenantScopedAdmin && !normalizedScopedTenantId) return;
    const params = { page: 1, limit: 200 };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    resetFacilities();
    listFacilities(params);
  }, [
    isResolved,
    canManageUserProfiles,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listFacilities,
    resetFacilities,
  ]);

  useEffect(() => {
    if (profile) {
      setUserId(profile.user_id ?? '');
      setFacilityId(profile.facility_id ?? '');
      setFirstName(profile.first_name ?? '');
      setMiddleName(profile.middle_name ?? '');
      setLastName(profile.last_name ?? '');
      setGender(profile.gender ?? '');
      setDateOfBirth(toDateInputValue(profile.date_of_birth ?? ''));
    }
  }, [profile]);

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
    if (isEdit) return;
    if (facilityPrefillRef.current) return;
    const paramValue = Array.isArray(facilityIdParam) ? facilityIdParam[0] : facilityIdParam;
    if (paramValue) {
      setFacilityId(String(paramValue));
      facilityPrefillRef.current = true;
      return;
    }
    if (facilityOptions.length === 1 && !facilityId) {
      setFacilityId(facilityOptions[0].value);
      facilityPrefillRef.current = true;
    }
  }, [facilityIdParam, facilityOptions, facilityId, isEdit]);

  const trimmedUserId = String(userId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();
  const trimmedFirstName = firstName.trim();
  const trimmedMiddleName = middleName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedGender = gender.trim();
  const normalizedDateOfBirth = useMemo(
    () => normalizeIsoDateTime(dateOfBirth),
    [dateOfBirth]
  );

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'userProfile.form.submitErrorMessage'),
    [t, errorCode]
  );
  const userErrorMessage = useMemo(
    () => resolveErrorMessage(t, userErrorCode, 'userProfile.form.userLoadErrorMessage'),
    [t, userErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'userProfile.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );
  const userError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedUserId) return t('userProfile.form.userRequired');
    return null;
  }, [isEdit, trimmedUserId, t]);
  const firstNameError = useMemo(() => {
    if (!trimmedFirstName) return t('userProfile.form.firstNameRequired');
    if (trimmedFirstName.length > MAX_NAME_LENGTH) {
      return t('userProfile.form.firstNameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedFirstName, t]);
  const middleNameError = useMemo(() => {
    if (!trimmedMiddleName) return null;
    if (trimmedMiddleName.length > MAX_NAME_LENGTH) {
      return t('userProfile.form.middleNameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedMiddleName, t]);
  const lastNameError = useMemo(() => {
    if (!trimmedLastName) return null;
    if (trimmedLastName.length > MAX_NAME_LENGTH) {
      return t('userProfile.form.lastNameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedLastName, t]);
  const dateOfBirthError = useMemo(() => {
    if (!String(dateOfBirth ?? '').trim()) return null;
    if (!normalizedDateOfBirth) return t('userProfile.form.dobInvalid');
    return null;
  }, [dateOfBirth, normalizedDateOfBirth, t]);

  const hasUsers = userOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasUsers;
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    Boolean(userError) ||
    Boolean(firstNameError) ||
    Boolean(middleNameError) ||
    Boolean(lastNameError) ||
    Boolean(dateOfBirthError) ||
    (isEdit ? !canEditUserProfile : !canCreateUserProfile);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateUserProfile) {
        router.replace('/settings/user-profiles?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditUserProfile) {
        router.replace('/settings/user-profiles?notice=accessDenied');
        return;
      }
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        first_name: trimmedFirstName,
      };

      if (trimmedFacilityId) {
        payload.facility_id = trimmedFacilityId;
      } else if (isEdit) {
        payload.facility_id = null;
      }

      if (trimmedMiddleName) {
        payload.middle_name = trimmedMiddleName;
      } else if (isEdit) {
        payload.middle_name = null;
      }

      if (trimmedLastName) {
        payload.last_name = trimmedLastName;
      } else if (isEdit) {
        payload.last_name = null;
      }

      if (trimmedGender) {
        payload.gender = trimmedGender;
      } else if (isEdit) {
        payload.gender = null;
      }

      if (normalizedDateOfBirth) {
        payload.date_of_birth = normalizedDateOfBirth;
      } else if (isEdit) {
        payload.date_of_birth = null;
      }

      if (!isEdit && trimmedUserId) {
        payload.user_id = trimmedUserId;
      }

      if (isEdit && routeProfileId) {
        const result = await update(routeProfileId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/user-profiles?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isEdit,
    canCreateUserProfile,
    canEditUserProfile,
    isOffline,
    trimmedFirstName,
    trimmedFacilityId,
    trimmedMiddleName,
    trimmedLastName,
    trimmedGender,
    normalizedDateOfBirth,
    trimmedUserId,
    routeProfileId,
    update,
    create,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/user-profiles');
  }, [router]);

  const handleGoToUsers = useCallback(() => {
    router.push('/settings/users');
  }, [router]);

  const handleGoToFacilities = useCallback(() => {
    router.push('/settings/facilities');
  }, [router]);

  const handleRetryUsers = useCallback(() => {
    if (isEdit || !isResolved || !canManageUserProfiles) return;
    if (isTenantScopedAdmin && !normalizedScopedTenantId) return;
    const params = { page: 1, limit: 200 };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    resetUsers();
    listUsers(params);
  }, [
    isEdit,
    isResolved,
    canManageUserProfiles,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listUsers,
    resetUsers,
  ]);

  const handleRetryFacilities = useCallback(() => {
    if (!isResolved || !canManageUserProfiles) return;
    if (isTenantScopedAdmin && !normalizedScopedTenantId) return;
    const params = { page: 1, limit: 200 };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedScopedTenantId;
    }
    resetFacilities();
    listFacilities(params);
  }, [
    isResolved,
    canManageUserProfiles,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listFacilities,
    resetFacilities,
  ]);

  return {
    isEdit,
    userId,
    setUserId,
    facilityId,
    setFacilityId,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    gender,
    setGender,
    genderOptions,
    dateOfBirth,
    setDateOfBirth,
    userOptions,
    userListLoading,
    userListError: Boolean(userErrorCode),
    userErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError: Boolean(facilityErrorCode),
    facilityErrorMessage,
    hasUsers,
    hasFacilities,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    profile,
    userError,
    firstNameError,
    middleNameError,
    lastNameError,
    dateOfBirthError,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToUsers: handleGoToUsers,
    onGoToFacilities: handleGoToFacilities,
    onRetryUsers: handleRetryUsers,
    onRetryFacilities: handleRetryFacilities,
    isSubmitDisabled,
    testID: 'user-profile-form-screen',
  };
};

export default useUserProfileFormScreen;
