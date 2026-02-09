/**
 * useUserProfileFormScreen Hook
 * Shared logic for UserProfileFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useUserProfile } from '@hooks';
import { normalizeIsoDateTime, toDateInputValue } from '@utils';

const useUserProfileFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { get, create, update, data, isLoading, errorCode, reset } = useUserProfile();

  const isEdit = Boolean(id);
  const [userId, setUserId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const profile = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
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

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        facility_id: facilityId.trim() || undefined,
        first_name: firstName.trim(),
        middle_name: middleName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        gender: gender || undefined,
      };
      const normalizedDob = normalizeIsoDateTime(dateOfBirth);
      if (normalizedDob) {
        payload.date_of_birth = normalizedDob;
      }
      if (!isEdit && userId?.trim()) {
        payload.user_id = userId.trim();
      }
      if (isEdit && id) {
        await update(id, payload);
      } else {
        await create(payload);
      }
      router.replace('/settings/user-profiles');
    } catch {
      /* error from hook */
    }
  }, [
    isEdit,
    id,
    userId,
    facilityId,
    firstName,
    middleName,
    lastName,
    gender,
    dateOfBirth,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/user-profiles');
  }, [router]);

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
    isLoading,
    hasError: Boolean(errorCode),
    profile,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    testID: 'user-profile-form-screen',
  };
};

export default useUserProfileFormScreen;
