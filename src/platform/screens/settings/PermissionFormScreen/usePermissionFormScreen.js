/**
 * usePermissionFormScreen Hook
 * Shared logic for PermissionFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useNetwork, usePermission, useTenant, useTenantAccess } from '@hooks';

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 255;

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const usePermissionFormScreen = () => {
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
  const routePermissionId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const { get, create, update, data, isLoading, errorCode, reset } = usePermission();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();

  const isEdit = Boolean(routePermissionId);
  const canManagePermissions = canAccessTenantSettings;
  const canCreatePermission = canManagePermissions;
  const canEditPermission = canManagePermissions;
  const isTenantScopedAdmin = canManagePermissions && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );

  const [tenantId, setTenantId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const tenantPrefillRef = useRef(false);

  const permission = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (isTenantScopedAdmin || isEdit
      ? []
      : (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? []))),
    [tenantData, isTenantScopedAdmin, isEdit]
  );
  const tenantOptions = useMemo(() => {
    if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
      return [{ value: normalizedScopedTenantId, label: normalizedScopedTenantId }];
    }
    return tenantItems.map((tenant) => ({
      value: tenant.id,
      label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
    }));
  }, [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManagePermissions) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreatePermission) {
      router.replace('/settings/permissions?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditPermission) {
      router.replace('/settings/permissions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManagePermissions,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreatePermission,
    canEditPermission,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManagePermissions || !isEdit || !routePermissionId) return;
    if (!canEditPermission) return;
    reset();
    get(routePermissionId);
  }, [isResolved, canManagePermissions, isEdit, routePermissionId, canEditPermission, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManagePermissions || !isEdit) return;
    if (permission) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/permissions?notice=accessDenied');
    }
  }, [isResolved, canManagePermissions, isEdit, permission, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManagePermissions || !isTenantScopedAdmin || !isEdit || !permission) return;
    const permissionTenantId = String(permission.tenant_id ?? '').trim();
    if (!permissionTenantId || permissionTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/permissions?notice=accessDenied');
    }
  }, [
    isResolved,
    canManagePermissions,
    isTenantScopedAdmin,
    isEdit,
    permission,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManagePermissions || isEdit) return;
    if (!canCreatePermission) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      tenantPrefillRef.current = true;
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [
    isResolved,
    canManagePermissions,
    isEdit,
    canCreatePermission,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (permission) {
      setTenantId(String(permission.tenant_id ?? normalizedScopedTenantId ?? ''));
      setName(permission.name ?? '');
      setDescription(permission.description ?? '');
    }
  }, [permission, normalizedScopedTenantId]);

  useEffect(() => {
    if (isEdit || isTenantScopedAdmin) return;
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
  const trimmedName = name.trim();
  const trimmedDescription = description.trim();

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'permission.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'permission.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const nameError = useMemo(() => {
    if (!trimmedName) return t('permission.form.nameRequired');
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return t('permission.form.nameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedName, t]);
  const descriptionError = useMemo(() => {
    if (!trimmedDescription) return null;
    if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      return t('permission.form.descriptionTooLong', { max: MAX_DESCRIPTION_LENGTH });
    }
    return null;
  }, [trimmedDescription, t]);
  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('permission.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);

  const tenantListError = Boolean(tenantErrorCode);
  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasTenants;
  const isTenantLocked = !isEdit && isTenantScopedAdmin;
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return trimmedTenantId || normalizedScopedTenantId;
  }, [isTenantLocked, trimmedTenantId, normalizedScopedTenantId]);
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    Boolean(nameError) ||
    Boolean(descriptionError) ||
    Boolean(tenantError) ||
    (isEdit ? !canEditPermission : !canCreatePermission);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreatePermission) {
        router.replace('/settings/permissions?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditPermission) {
        router.replace('/settings/permissions?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const permissionTenantId = String(permission?.tenant_id ?? '').trim();
        if (!permissionTenantId || permissionTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/permissions?notice=accessDenied');
          return;
        }
      }

      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        name: trimmedName,
      };
      if (trimmedDescription) {
        payload.description = trimmedDescription;
      } else if (isEdit) {
        payload.description = null;
      }
      if (!isEdit) {
        payload.tenant_id = isTenantScopedAdmin ? normalizedScopedTenantId : trimmedTenantId;
      }

      if (isEdit && routePermissionId) {
        const result = await update(routePermissionId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/permissions?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isEdit,
    canCreatePermission,
    canEditPermission,
    isTenantScopedAdmin,
    permission,
    normalizedScopedTenantId,
    isOffline,
    trimmedName,
    trimmedDescription,
    trimmedTenantId,
    routePermissionId,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/permissions');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleRetryTenants = useCallback(() => {
    if (isTenantScopedAdmin || isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  return {
    isEdit,
    tenantId,
    setTenantId,
    name,
    setName,
    description,
    setDescription,
    tenantOptions,
    tenantListLoading: isTenantScopedAdmin || isEdit ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin || isEdit ? false : tenantListError,
    tenantErrorMessage: isTenantScopedAdmin || isEdit ? null : tenantErrorMessage,
    hasTenants,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    permission,
    nameError,
    descriptionError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onRetryTenants: handleRetryTenants,
    isSubmitDisabled,
    testID: 'permission-form-screen',
  };
};

export default usePermissionFormScreen;
