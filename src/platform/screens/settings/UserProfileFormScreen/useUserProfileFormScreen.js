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
import { humanizeIdentifier, normalizeIsoDateTime, toDateInputValue } from '@utils';

const MAX_NAME_LENGTH = 120;
const MAX_FETCH_LIMIT = 100;

const normalizeValue = (value) => String(value ?? '').trim();

const resolveReadableValue = (...values) => {
  for (const value of values) {
    const normalized = normalizeValue(humanizeIdentifier(value));
    if (normalized) return normalized;
  }
  return '';
};

const buildScopedListParams = (isTenantScopedAdmin, normalizedScopedTenantId) => {
  const params = { page: 1, limit: MAX_FETCH_LIMIT };
  if (isTenantScopedAdmin && normalizedScopedTenantId) {
    params.tenant_id = normalizedScopedTenantId;
  }
  return params;
};

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
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageUserProfiles && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => normalizeValue(scopedTenantId),
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
  const normalizedUserId = useMemo(() => normalizeValue(userId), [userId]);
  const normalizedFacilityId = useMemo(() => normalizeValue(facilityId), [facilityId]);
  const userOptions = useMemo(() => {
    const options = userItems
      .map((user, index) => {
        const optionValue = normalizeValue(user?.id ?? user?.user_id);
        if (!optionValue) return null;
        const optionLabel = normalizeValue(
          user?.email
          ?? user?.phone
          ?? resolveReadableValue(user?.display_name, user?.name, `${user?.first_name ?? ''} ${user?.last_name ?? ''}`)
        ) || (
          canViewTechnicalIds
            ? optionValue
            : t('userProfile.form.userOptionFallback', { index: index + 1 })
        );
        return { value: optionValue, label: optionLabel };
      })
      .filter(Boolean);

    if (normalizedUserId && !options.some((option) => option.value === normalizedUserId)) {
      return [{
        value: normalizedUserId,
        label: canViewTechnicalIds ? normalizedUserId : t('userProfile.form.currentUser'),
      }, ...options];
    }
    return options;
  }, [userItems, normalizedUserId, canViewTechnicalIds, t]);
  const facilityOptions = useMemo(() => {
    const options = facilityItems
      .map((facility, index) => {
        const optionValue = normalizeValue(facility?.id);
        if (!optionValue) return null;
        const optionLabel = resolveReadableValue(
          facility?.name,
          facility?.code,
          facility?.slug
        ) || (
          canViewTechnicalIds
            ? optionValue
            : t('userProfile.form.facilityOptionFallback', { index: index + 1 })
        );
        return { value: optionValue, label: optionLabel };
      })
      .filter(Boolean);

    if (normalizedFacilityId && !options.some((option) => option.value === normalizedFacilityId)) {
      return [{
        value: normalizedFacilityId,
        label: canViewTechnicalIds ? normalizedFacilityId : t('userProfile.form.currentFacility'),
      }, ...options];
    }
    return options;
  }, [facilityItems, normalizedFacilityId, canViewTechnicalIds, t]);
  const userDisplayLabel = useMemo(() => {
    const selectedOption = userOptions.find((option) => option.value === normalizedUserId);
    if (selectedOption?.label) return selectedOption.label;

    const profileUserLabel = normalizeValue(
      profile?.user_email
      ?? profile?.user?.email
      ?? profile?.user_phone
      ?? profile?.user?.phone
      ?? resolveReadableValue(profile?.user?.display_name, profile?.user?.name)
    );
    if (profileUserLabel) return profileUserLabel;

    if (normalizedUserId) {
      return canViewTechnicalIds ? normalizedUserId : t('userProfile.form.currentUser');
    }
    return t('common.notAvailable');
  }, [userOptions, normalizedUserId, profile, canViewTechnicalIds, t]);
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
    if (!isResolved || !canManageUserProfiles) return;
    if (isEdit && !canEditUserProfile) return;
    if (!isEdit && !canCreateUserProfile) return;
    if (isTenantScopedAdmin && !normalizedScopedTenantId) return;
    const params = buildScopedListParams(isTenantScopedAdmin, normalizedScopedTenantId);
    resetUsers();
    listUsers(params);
  }, [
    isResolved,
    canManageUserProfiles,
    isEdit,
    canCreateUserProfile,
    canEditUserProfile,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listUsers,
    resetUsers,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserProfiles) return;
    if (isTenantScopedAdmin && !normalizedScopedTenantId) return;
    const params = buildScopedListParams(isTenantScopedAdmin, normalizedScopedTenantId);
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
    if (isEdit) return;
    if (facilityPrefillRef.current) return;
    const paramValue = Array.isArray(facilityIdParam) ? facilityIdParam[0] : facilityIdParam;
    if (paramValue) {
      setFacilityId(normalizeValue(paramValue));
      facilityPrefillRef.current = true;
      return;
    }
    if (facilityOptions.length === 1 && !facilityId) {
      setFacilityId(facilityOptions[0].value);
      facilityPrefillRef.current = true;
    }
  }, [facilityIdParam, facilityOptions, facilityId, isEdit]);

  const trimmedUserId = normalizedUserId;
  const trimmedFacilityId = normalizedFacilityId;
  const trimmedFirstName = firstName.trim();
  const trimmedMiddleName = middleName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedGender = normalizeValue(gender);
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
    if (!isResolved || !canManageUserProfiles) return;
    if (isEdit && !canEditUserProfile) return;
    if (!isEdit && !canCreateUserProfile) return;
    if (isTenantScopedAdmin && !normalizedScopedTenantId) return;
    const params = buildScopedListParams(isTenantScopedAdmin, normalizedScopedTenantId);
    resetUsers();
    listUsers(params);
  }, [
    isResolved,
    canManageUserProfiles,
    isEdit,
    canCreateUserProfile,
    canEditUserProfile,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listUsers,
    resetUsers,
  ]);

  const handleRetryFacilities = useCallback(() => {
    if (!isResolved || !canManageUserProfiles) return;
    if (isTenantScopedAdmin && !normalizedScopedTenantId) return;
    const params = buildScopedListParams(isTenantScopedAdmin, normalizedScopedTenantId);
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
    userDisplayLabel,
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
    canViewTechnicalIds,
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
