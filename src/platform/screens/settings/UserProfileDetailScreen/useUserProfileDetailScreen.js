/**
 * useUserProfileDetailScreen Hook
 * Shared logic for UserProfileDetailScreen across platforms.
 * File: useUserProfileDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useTenantAccess, useUserProfile } from '@hooks';
import { confirmAction } from '@utils';

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

  const profileId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageUserProfiles = canAccessTenantSettings;
  const canEditUserProfile = canManageUserProfiles;
  const canDeleteUserProfile = canManageUserProfiles;
  const isTenantScopedAdmin = canManageUserProfiles && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => String(tenantId ?? '').trim(), [tenantId]);
  const profile = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageUserProfiles || !profileId) return;
    reset();
    get(profileId);
  }, [isResolved, canManageUserProfiles, profileId, get, reset]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserProfiles) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [isResolved, canManageUserProfiles, isTenantScopedAdmin, normalizedTenantId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!isResolved || !canManageUserProfiles) return;
    if (profile) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/user-profiles?notice=accessDenied');
    }
  }, [isResolved, canManageUserProfiles, profile, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
  }, [fetchDetail]);

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
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditUserProfile ? handleEdit : undefined,
    onDelete: canDeleteUserProfile ? handleDelete : undefined,
  };
};

export default useUserProfileDetailScreen;
