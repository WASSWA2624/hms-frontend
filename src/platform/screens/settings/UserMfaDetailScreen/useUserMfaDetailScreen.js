/**
 * useUserMfaDetailScreen Hook
 * Shared logic for UserMfaDetailScreen across platforms.
 * File: useUserMfaDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useTenantAccess, useUser, useUserMfa } from '@hooks';
import { confirmAction, humanizeIdentifier } from '@utils';

const MAX_REFERENCE_FETCH_LIMIT = 100;

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const normalizeValue = (value) => String(value ?? '').trim();

const resolveReadableValue = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = humanizeIdentifier(candidate);
    if (normalized) return normalizeValue(normalized);
  }
  return '';
};

const resolveContextValue = (readableValue, technicalId, canViewTechnicalIds, fallbackLabel) => {
  if (readableValue) return readableValue;

  const normalizedTechnicalId = normalizeValue(technicalId);
  if (!normalizedTechnicalId) return '';
  if (canViewTechnicalIds) return normalizedTechnicalId;
  return fallbackLabel;
};

const useUserMfaDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useUserMfa();
  const {
    list: listUsers,
    data: userData,
    reset: resetUsers,
  } = useUser();

  const userMfaId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageUserMfas = canAccessTenantSettings;
  const canEditUserMfa = canManageUserMfas;
  const canDeleteUserMfa = canManageUserMfas;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageUserMfas && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);

  const userMfa = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );
  const userLookup = useMemo(() => {
    const map = new Map();
    userItems.forEach((userItem) => {
      const userId = normalizeValue(userItem?.id);
      if (!userId) return;
      map.set(userId, {
        label: resolveReadableValue(
          userItem?.name,
          userItem?.full_name,
          userItem?.email,
          userItem?.phone,
          userItem?.human_friendly_id
        ),
        tenantId: normalizeValue(userItem?.tenant_id || userItem?.tenant?.id),
      });
    });
    return map;
  }, [userItems]);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const mfaLabel = useMemo(() => {
    if (!userMfa) return '';

    return resolveContextValue(
      resolveReadableValue(
        userMfa?.human_friendly_id,
        userMfa?.mfa_code,
        userMfa?.display_id
      ),
      userMfa?.id,
      canViewTechnicalIds,
      t('userMfa.detail.currentMfaId')
    );
  }, [userMfa, canViewTechnicalIds, t]);

  const userLabel = useMemo(() => {
    if (!userMfa) return '';

    const userId = normalizeValue(userMfa?.user_id);
    const userContext = userLookup.get(userId);

    return resolveContextValue(
      resolveReadableValue(
        userMfa?.user_name,
        userMfa?.user?.name,
        userMfa?.user?.full_name,
        userMfa?.user?.email,
        userMfa?.user?.phone,
        userMfa?.user?.human_friendly_id,
        userContext?.label
      ),
      userId,
      canViewTechnicalIds,
      t('userMfa.detail.currentUser')
    );
  }, [userMfa, userLookup, canViewTechnicalIds, t]);

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageUserMfas || !userMfaId) return;
    reset();
    get(userMfaId);
  }, [isResolved, canManageUserMfas, userMfaId, get, reset]);

  const fetchUsers = useCallback(() => {
    if (!isResolved || !canManageUserMfas) return;
    if (!canManageAllTenants && !normalizedTenantId) return;

    const params = {
      page: 1,
      limit: MAX_REFERENCE_FETCH_LIMIT,
    };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }

    resetUsers();
    listUsers(params);
  }, [
    isResolved,
    canManageUserMfas,
    canManageAllTenants,
    normalizedTenantId,
    resetUsers,
    listUsers,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUserMfas) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
      return;
    }
  }, [
    isResolved,
    canManageUserMfas,
    isTenantScopedAdmin,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    fetchDetail();
    fetchUsers();
  }, [fetchDetail, fetchUsers]);

  useEffect(() => {
    if (!isResolved || !canManageUserMfas || !isTenantScopedAdmin || !userMfa) return;

    const explicitTenantId = normalizeValue(userMfa?.tenant_id);
    const relatedUserId = normalizeValue(userMfa?.user_id);
    const relatedUserTenantId = normalizeValue(userLookup.get(relatedUserId)?.tenantId);
    const recordTenantId = explicitTenantId || relatedUserTenantId;

    if (recordTenantId && recordTenantId !== normalizedTenantId) {
      router.replace('/settings/user-mfas?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUserMfas,
    isTenantScopedAdmin,
    userMfa,
    userLookup,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUserMfas) return;
    if (userMfa) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/user-mfas?notice=accessDenied');
    }
  }, [isResolved, canManageUserMfas, userMfa, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
    fetchUsers();
  }, [fetchDetail, fetchUsers]);

  const handleBack = useCallback(() => {
    router.push('/settings/user-mfas');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditUserMfa || !userMfaId) return;
    router.push(`/settings/user-mfas/${userMfaId}/edit`);
  }, [canEditUserMfa, userMfaId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteUserMfa || !userMfaId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(userMfaId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/user-mfas?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteUserMfa, userMfaId, remove, isOffline, router, t]);

  return {
    id: userMfaId,
    userMfa,
    mfaLabel,
    userLabel,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditUserMfa ? handleEdit : undefined,
    onDelete: canDeleteUserMfa ? handleDelete : undefined,
  };
};

export default useUserMfaDetailScreen;
