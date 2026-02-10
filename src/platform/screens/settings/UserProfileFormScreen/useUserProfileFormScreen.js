/**
 * useUserProfileFormScreen Hook
 * Shared logic for UserProfileFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, useFacility, useUser, useUserProfile } from '@hooks';
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

const useUserProfileFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id, userId: userIdParam, facilityId: facilityIdParam } = useLocalSearchParams();
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

  const isEdit = Boolean(id);
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
  const userOptions = useMemo(
    () =>
      userItems.map((user) => ({
        value: user.id,
        label: user.email ?? user.phone ?? user.id ?? '',
      })),
    [userItems]
  );
  const facilityOptions = useMemo(
    () =>
      facilityItems.map((facility) => ({
        value: facility.id,
        label: facility.name ?? facility.id ?? '',
      })),
    [facilityItems]
  );
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
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (isEdit) return;
    resetUsers();
    listUsers({ page: 1, limit: 200 });
  }, [isEdit, listUsers, resetUsers]);

  useEffect(() => {
    resetFacilities();
    listFacilities({ page: 1, limit: 200 });
  }, [listFacilities, resetFacilities]);

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
  }, [facilityIdParam, facilityOptions, facilityId]);

  const trimmedUserId = String(userId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();
  const trimmedFirstName = firstName.trim();
  const trimmedMiddleName = middleName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedGender = gender.trim();

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

  const hasUsers = userOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasUsers;
  const isSubmitDisabled =
    isLoading ||
    isCreateBlocked ||
    !trimmedFirstName ||
    (!isEdit && !trimmedUserId);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
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

      const normalizedDob = normalizeIsoDateTime(dateOfBirth);
      if (normalizedDob) {
        payload.date_of_birth = normalizedDob;
      } else if (isEdit) {
        payload.date_of_birth = null;
      }

      if (!isEdit && trimmedUserId) {
        payload.user_id = trimmedUserId;
      }

      if (isEdit && id) {
        const result = await update(id, payload);
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
    isOffline,
    isEdit,
    id,
    trimmedFirstName,
    trimmedFacilityId,
    trimmedMiddleName,
    trimmedLastName,
    trimmedGender,
    dateOfBirth,
    trimmedUserId,
    create,
    update,
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
    resetUsers();
    listUsers({ page: 1, limit: 200 });
  }, [listUsers, resetUsers]);

  const handleRetryFacilities = useCallback(() => {
    resetFacilities();
    listFacilities({ page: 1, limit: 200 });
  }, [listFacilities, resetFacilities]);

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
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    profile,
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
