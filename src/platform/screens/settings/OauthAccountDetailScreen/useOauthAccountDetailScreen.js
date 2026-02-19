/**
 * useOauthAccountDetailScreen Hook
 * Shared logic for OauthAccountDetailScreen across platforms.
 * File: useOauthAccountDetailScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PAGINATION } from '@config/constants';
import { useI18n, useNetwork, useOauthAccount, useTenantAccess, useUser } from '@hooks';
import { confirmAction, humanizeIdentifier } from '@utils';

const DEFAULT_REFERENCE_FETCH_LIMIT = PAGINATION.MAX_LIMIT;

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const normalizeValue = (value) => String(value ?? '').trim();
const uniqueArray = (values = []) => [...new Set(values)];

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

const normalizeFetchLimit = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_REFERENCE_FETCH_LIMIT;
  return Math.min(PAGINATION.MAX_LIMIT, Math.max(1, Math.trunc(numeric)));
};

const useOauthAccountDetailScreen = () => {
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
  const { get, remove, data, isLoading, errorCode, reset } = useOauthAccount();
  const {
    list: listUsers,
    data: userData,
    isLoading: userListLoading,
    reset: resetUsers,
  } = useUser();

  const oauthAccountId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const canManageOauthAccounts = canAccessTenantSettings;
  const canEditOauthAccount = canManageOauthAccounts;
  const canDeleteOauthAccount = canManageOauthAccounts;
  const canViewTechnicalIds = canManageAllTenants;
  const isTenantScopedAdmin = canManageOauthAccounts && !canManageAllTenants;
  const normalizedTenantId = useMemo(() => normalizeValue(tenantId), [tenantId]);

  const oauthAccount = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const userItems = useMemo(
    () => (Array.isArray(userData) ? userData : (userData?.items ?? [])),
    [userData]
  );

  const userLookup = useMemo(() => {
    const map = new Map();
    userItems.forEach((userItem, index) => {
      const userIdValue = normalizeValue(userItem?.id);
      if (!userIdValue) return;
      const userLabel = resolveReadableValue(
        userItem?.name,
        userItem?.full_name,
        userItem?.display_name,
        userItem?.email,
        userItem?.phone
      ) || (
        canViewTechnicalIds
          ? userIdValue
          : t('oauthAccount.form.userOptionFallback', { index: index + 1 })
      );
      map.set(userIdValue, {
        label: userLabel,
        tenantId: normalizeValue(userItem?.tenant_id || userItem?.tenant?.id),
      });
    });
    return map;
  }, [userItems, canViewTechnicalIds, t]);

  const resolveTenantIdsForRecord = useCallback((record) => {
    const explicitTenantId = normalizeValue(record?.tenant_id);
    const recordUserId = normalizeValue(record?.user_id);
    const userContext = userLookup.get(recordUserId);
    return uniqueArray(
      [
        explicitTenantId,
        normalizeValue(userContext?.tenantId),
      ].filter(Boolean)
    );
  }, [userLookup]);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const providerLabel = useMemo(() => (
    resolveContextValue(
      resolveReadableValue(oauthAccount?.provider),
      null,
      canViewTechnicalIds,
      t('common.notAvailable')
    )
  ), [oauthAccount, canViewTechnicalIds, t]);

  const userLabel = useMemo(() => {
    const userIdValue = normalizeValue(oauthAccount?.user_id);
    const userContext = userLookup.get(userIdValue);
    return resolveContextValue(
      resolveReadableValue(
        oauthAccount?.user_name,
        oauthAccount?.user?.name,
        oauthAccount?.user?.full_name,
        oauthAccount?.user?.display_name,
        oauthAccount?.user?.email,
        oauthAccount?.user?.phone,
        userContext?.label
      ),
      userIdValue,
      canViewTechnicalIds,
      t('oauthAccount.detail.currentUserLabel')
    );
  }, [oauthAccount, userLookup, canViewTechnicalIds, t]);

  const providerUserLabel = useMemo(() => {
    const providerUserId = normalizeValue(oauthAccount?.provider_user_id);
    return resolveContextValue(
      resolveReadableValue(providerUserId),
      providerUserId,
      canViewTechnicalIds,
      t('oauthAccount.detail.currentProviderUserLabel')
    );
  }, [oauthAccount, canViewTechnicalIds, t]);

  const fetchDetail = useCallback(() => {
    if (!isResolved || !canManageOauthAccounts || !oauthAccountId) return;
    reset();
    get(oauthAccountId);
  }, [isResolved, canManageOauthAccounts, oauthAccountId, get, reset]);

  const fetchReferenceData = useCallback(() => {
    if (!isResolved || !canManageOauthAccounts) return;
    if (isTenantScopedAdmin && !normalizedTenantId) return;

    const params = {
      page: 1,
      limit: normalizeFetchLimit(DEFAULT_REFERENCE_FETCH_LIMIT),
    };
    if (isTenantScopedAdmin) {
      params.tenant_id = normalizedTenantId;
    }

    resetUsers();
    listUsers(params);
  }, [
    isResolved,
    canManageOauthAccounts,
    isTenantScopedAdmin,
    normalizedTenantId,
    resetUsers,
    listUsers,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageOauthAccounts) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedTenantId) {
      router.replace('/settings');
    }
  }, [
    isResolved,
    canManageOauthAccounts,
    isTenantScopedAdmin,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    fetchReferenceData();
  }, [fetchReferenceData]);

  useEffect(() => {
    if (!isResolved || !canManageOauthAccounts || !isTenantScopedAdmin || !oauthAccount) return;
    if (userListLoading) return;

    const tenantIds = resolveTenantIdsForRecord(oauthAccount);
    if (tenantIds.length === 0 || tenantIds.some((tenantIdValue) => tenantIdValue !== normalizedTenantId)) {
      router.replace('/settings/oauth-accounts?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageOauthAccounts,
    isTenantScopedAdmin,
    oauthAccount,
    userListLoading,
    resolveTenantIdsForRecord,
    normalizedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageOauthAccounts) return;
    if (oauthAccount) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/oauth-accounts?notice=accessDenied');
    }
  }, [isResolved, canManageOauthAccounts, oauthAccount, errorCode, router]);

  const handleRetry = useCallback(() => {
    fetchDetail();
    fetchReferenceData();
  }, [fetchDetail, fetchReferenceData]);

  const handleBack = useCallback(() => {
    router.push('/settings/oauth-accounts');
  }, [router]);

  const handleEdit = useCallback(() => {
    if (!canEditOauthAccount || !oauthAccountId) return;
    router.push(`/settings/oauth-accounts/${oauthAccountId}/edit`);
  }, [canEditOauthAccount, oauthAccountId, router]);

  const handleDelete = useCallback(async () => {
    if (!canDeleteOauthAccount || !oauthAccountId) return;
    if (!confirmAction(t('common.confirmDelete'))) return;
    try {
      const result = await remove(oauthAccountId);
      if (!result) return;
      const noticeKey = isOffline ? 'queued' : 'deleted';
      router.push(`/settings/oauth-accounts?notice=${noticeKey}`);
    } catch {
      /* error handled by hook */
    }
  }, [canDeleteOauthAccount, oauthAccountId, remove, isOffline, router, t]);

  return {
    id: oauthAccountId,
    oauthAccount,
    providerLabel,
    userLabel,
    providerUserLabel,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry: handleRetry,
    onBack: handleBack,
    onEdit: canEditOauthAccount ? handleEdit : undefined,
    onDelete: canDeleteOauthAccount ? handleDelete : undefined,
  };
};

export default useOauthAccountDetailScreen;
