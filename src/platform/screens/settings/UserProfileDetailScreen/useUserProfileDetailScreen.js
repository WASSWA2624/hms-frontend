/**
 * useUserProfileDetailScreen Hook
 * Shared logic for UserProfileDetailScreen across platforms.
 * File: useUserProfileDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useFacility,
  useI18n,
  useNetwork,
  useTenantAccess,
  useUser,
  useUserProfile,
} from '@hooks';
import { confirmAction, humanizeIdentifier } from '@utils';

const MAX_FETCH_LIMIT = 100;

const normalizeValue = (value) => String(value ?? '').trim();

const resolveReadableValue = (...values) => {
  for (const value of values) {
    const normalized = normalizeValue(humanizeIdentifier(value));
    if (normalized) return normalized;
  }
  return '';
};

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useUserProfileDetailScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useTenantAccess();
  const { get, remove, data, isLoading, errorCode, reset } = useUserProfile();
  const {
    list: listUsers,
    data: userData,
    reset: resetUsers,
  } = useUser();
  const {
    list: listFacilities,
    data: facilityData,
    reset: resetFacilities,
  } = useFacility();

  const profileId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageUserProfiles = canAccessTenantSettings;
  const canEditUserProfile = canManageUserProfiles;
  const canDeleteUserProfile = canManageUserProfiles;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageUserProfiles && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);
  const profile = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );
  const facilityItems = useMemo(
    () => (Array.isArray(facilityData) ? facilityData : (facilityData?.items ?? [])),
    [facilityData]
  );
  const userLookup = useMemo(
    () => new Map(
      userItems
        .map((userItem) => {
          const userId = normalizeValue(userItem?.id ?? userItem?.user_id);
          if (!userId) return null;
          const label = normalizeValue(
            userItem?.email
            ?? userItem?.phone
            ?? resolveReadableValue(userItem?.display_name, userItem?.name, `${userItem?.first_name ?? ''} ${userItem?.last_name ?? ''}`)
          ) || (canViewTechnicalIds ? userId : t('userProfile.detail.currentUser'));
          return [userId, { label, tenantId: normalizeValue(userItem?.tenant_id) }];
        })
        .filter(Boolean)
    ),
    [userItems, canViewTechnicalIds, t]
  );
  const facilityLookup = useMemo(
    () => new Map(
      facilityItems
        .map((facilityItem) => {
          const facilityId = normalizeValue(facilityItem?.id);
          if (!facilityId) return null;
          const label = resolveReadableValue(
            facilityItem?.name,
            facilityItem?.code,
            facilityItem?.slug
          ) || (canViewTechnicalIds ? facilityId : t('userProfile.detail.currentFacility'));
          return [facilityId, { label }];
        })
        .filter(Boolean)
    ),
    [facilityItems, canViewTechnicalIds, t]
  );
  const profileUserId = useMemo(
    () => normalizeValue(profile?.user_id ?? profile?.user?.id),
    [profile]
  );
  const profileFacilityId = useMemo(
    () => normalizeValue(profile?.facility_id ?? profile?.facility?.id),
    [profile]
  );
  const profileDisplayName = useMemo(() => {
    const segments = [
      resolveReadableValue(profile?.first_name),
      resolveReadableValue(profile?.middle_name),
      resolveReadableValue(profile?.last_name),
    ].filter(Boolean);
    if (segments.length > 0) return segments.join(' ');
    return t('userProfile.list.unnamed');
  }, [profile, t]);
  const profileUserDisplay = useMemo(() => {
    const inlineLabel = normalizeValue(
      profile?.user_email
      ?? profile?.user?.email
      ?? profile?.user_phone
      ?? profile?.user?.phone
      ?? resolveReadableValue(profile?.user_name, profile?.user?.display_name, profile?.user?.name)
    );
    if (inlineLabel) return inlineLabel;

    if (profileUserId) {
      const lookupLabel = userLookup.get(profileUserId)?.label;
      if (lookupLabel) return lookupLabel;
      return canViewTechnicalIds ? profileUserId : t('userProfile.detail.currentUser');
    }

    return t('common.notAvailable');
  }, [profile, profileUserId, userLookup, canViewTechnicalIds, t]);
  const profileFacilityDisplay = useMemo(() => {
    const inlineLabel = resolveReadableValue(
      profile?.facility_name,
      profile?.facility?.name,
      profile?.facility_label
    );
    if (inlineLabel) return inlineLabel;

    if (profileFacilityId) {
      const lookupLabel = facilityLookup.get(profileFacilityId)?.label;
      if (lookupLabel) return lookupLabel;
      return canViewTechnicalIds ? profileFacilityId : t('userProfile.detail.currentFacility');
    }

    return t('common.notAvailable');
  }, [profile, profileFacilityId, facilityLookup, canViewTechnicalIds, t]);
  const profileGenderDisplay = useMemo(() => {
    const genderValue = normalizeValue(profile?.gender).toUpperCase();
    if (!genderValue) return t('common.notAvailable');
    const key = `userProfile.gender.${genderValue}`;
    const resolved = t(key);
    return resolved === key ? genderValue : resolved;
  }, [profile, t]);
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageUserProfiles || !profileId) return;
    reset();
    get(profileId);
  }, [isResolved, canManageUserProfiles, profileId, get, reset]);
  const fetchUsers = useCallback(() => {
    if (!isResolved || !canManageUserProfiles || isOffline) return;
    if (isTenantScopedAdmin && !normalizedTenantId) return;

    const params = { page: 1, limit: MAX_FETCH_LIMIT };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedTenantId;
    }

    resetUsers();
    listUsers(params);
  }, [
    isResolved,
    canManageUserProfiles,
    isOffline,
    isTenantScopedAdmin,
    normalizedTenantId,
    resetUsers,
    listUsers,
  ]);
  const fetchFacilities = useCallback(() => {
    if (!isResolved || !canManageUserProfiles || isOffline) return;
    if (isTenantScopedAdmin && !normalizedTenantId) return;

    const params = { page: 1, limit: MAX_FETCH_LIMIT };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedTenantId;
    }

    resetFacilities();
    listFacilities(params);
  }, [
    isResolved,
    canManageUserProfiles,
    isOffline,
    isTenantScopedAdmin,
    normalizedTenantId,
    resetFacilities,
    listFacilities,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserProfiles) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
      return;
    }
    fetchDetail();
    fetchUsers();
    fetchFacilities();
  }, [
    isResolved,
    canManageUserProfiles,
    isTenantScopedAdmin,
    normalizedTenantId,
    fetchDetail,
    fetchUsers,
    fetchFacilities,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserProfiles || !isTenantScopedAdmin || !profile) return;
    if (!normalizedTenantId) return;

    const directTenantId = normalizeValue(profile?.tenant_id ?? profile?.user?.tenant_id);
    const linkedTenantId = profileUserId ? normalizeValue(userLookup.get(profileUserId)?.tenantId) : '';
    const scopedTenantId = directTenantId || linkedTenantId;
    if (scopedTenantId && scopedTenantId !== normalizedTenantId) {
      router.replace('/settings/user-profiles?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUserProfiles,
    isTenantScopedAdmin,
    profile,
    profileUserId,
    userLookup,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserProfiles) return;
    if (profile) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/user-profiles?notice=accessDenied');
    }
  }, [isResolved, canManageUserProfiles, profile, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
    fetchUsers();
    fetchFacilities();
  }, [fetchDetail, fetchUsers, fetchFacilities]);

  const handleBack = useCallback(() => {
    router.push('/settings/user-profiles');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditUserProfile || !profileId) return;
    router.push(`/settings/user-profiles/${profileId}/edit`);
  }, [canEditUserProfile, profileId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteUserProfile || !profileId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(profileId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/user-profiles?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteUserProfile, profileId, remove, isOffline, router, t]);

  return {
    id: profileId,
    profile,
    profileDisplayName,
    profileUserDisplay,
    profileFacilityDisplay,
    profileGenderDisplay,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditUserProfile ? handleEdit : undefined,
    onDelete: canDeleteUserProfile ? handleDelete : undefined,
  };
};

export default useUserProfileDetailScreen;
