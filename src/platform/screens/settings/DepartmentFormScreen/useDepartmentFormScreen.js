/**
 * useDepartmentFormScreen Hook
 * Shared logic for DepartmentFormScreen (create/edit).
 * File: useDepartmentFormScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useDepartment, useNetwork, useTenant, useTenantAccess } from '@hooks';
import { humanizeIdentifier } from '@utils';

const MAX_NAME_LENGTH = 255;
const MAX_SHORT_NAME_LENGTH = 50;
const MAX_FETCH_LIMIT = 100;
const DEPARTMENT_TYPES = Object.freeze([
  { value: 'CLINICAL', labelKey: 'department.form.typeCLINICAL' },
  { value: 'ADMINISTRATIVE', labelKey: 'department.form.typeADMINISTRATIVE' },
  { value: 'SUPPORT', labelKey: 'department.form.typeSUPPORT' },
  { value: 'DIAGNOSTICS', labelKey: 'department.form.typeDIAGNOSTICS' },
  { value: 'OTHER', labelKey: 'department.form.typeOTHER' },
]);
const DEPARTMENT_TYPE_VALUES = new Set(DEPARTMENT_TYPES.map(({ value }) => value));

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useDepartmentFormScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const { get, create, update, data, isLoading, errorCode, reset } = useDepartment();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();

  const routeDepartmentId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeDepartmentId);
  const canManageDepartments = canAccessTenantSettings;
  const canCreateDepartment = canManageDepartments;
  const canEditDepartment = canManageDepartments;
  const isTenantScopedAdmin = canManageDepartments && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [departmentType, setDepartmentType] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [tenantIdValue, setTenantIdValue] = useState('');

  const department = data && typeof data === 'object' && !Array.isArray(data) ? data : null;

  const tenantItems = useMemo(
    () => (isEdit
      ? []
      : (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? []))),
    [tenantData, isEdit]
  );
  const tenantOptions = useMemo(
    () => tenantItems.map((tenant, index) => ({
      value: tenant.id,
      label: humanizeIdentifier(tenant.name)
        || humanizeIdentifier(tenant.slug)
        || t('department.form.tenantOptionFallback', { index: index + 1 }),
    })),
    [tenantItems, t]
  );

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageDepartments) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateDepartment) {
      router.replace('/settings/departments?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditDepartment) {
      router.replace('/settings/departments?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageDepartments,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateDepartment,
    canEditDepartment,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageDepartments || !isEdit || !routeDepartmentId) return;
    if (!canEditDepartment) return;
    reset();
    get(routeDepartmentId);
  }, [isResolved, canManageDepartments, isEdit, routeDepartmentId, canEditDepartment, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageDepartments || isEdit) return;
    if (!canCreateDepartment) return;
    resetTenants();
    listTenants({ page: 1, limit: MAX_FETCH_LIMIT });
    if (isTenantScopedAdmin) {
      setTenantIdValue(normalizedScopedTenantId);
    }
  }, [
    isResolved,
    canManageDepartments,
    isEdit,
    canCreateDepartment,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (department) {
      setName(department.name ?? '');
      setShortName(department.short_name ?? '');
      setDepartmentType(department.department_type ?? '');
      setIsActive(department.is_active ?? true);
      setTenantIdValue(String(department.tenant_id ?? normalizedScopedTenantId ?? ''));
    }
  }, [department, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageDepartments || !isTenantScopedAdmin || !isEdit || !department) return;
    const departmentTenantId = String(department.tenant_id ?? '').trim();
    if (!normalizedScopedTenantId || !departmentTenantId || departmentTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/departments?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageDepartments,
    isTenantScopedAdmin,
    isEdit,
    department,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !isTenantScopedAdmin || !isEdit) return;
    if (department) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/departments?notice=accessDenied');
    }
  }, [isResolved, isTenantScopedAdmin, isEdit, department, errorCode, router]);

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'department.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'department.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );

  const trimmedName = name.trim();
  const trimmedShortName = shortName.trim();
  const trimmedDepartmentType = String(departmentType ?? '').trim();
  const trimmedTenantId = String(tenantIdValue ?? '').trim();
  const hasTenants = isTenantScopedAdmin
    ? Boolean(trimmedTenantId) || tenantOptions.length > 0
    : tenantOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasTenants;
  const nameError = useMemo(() => {
    if (!trimmedName) return t('department.form.nameRequired');
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return t('department.form.nameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedName, t]);
  const shortNameError = useMemo(() => {
    if (!trimmedShortName) return null;
    if (trimmedShortName.length > MAX_SHORT_NAME_LENGTH) {
      return t('department.form.shortNameTooLong', { max: MAX_SHORT_NAME_LENGTH });
    }
    return null;
  }, [trimmedShortName, t]);
  const typeError = useMemo(() => {
    if (!trimmedDepartmentType) return t('department.form.typeRequired');
    if (!DEPARTMENT_TYPE_VALUES.has(trimmedDepartmentType)) return t('department.form.typeInvalid');
    return null;
  }, [trimmedDepartmentType, t]);
  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('department.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);
  const isTenantLocked = !isEdit && isTenantScopedAdmin;
  const selectedTenantLabel = useMemo(() => {
    if (!trimmedTenantId) return '';
    return tenantOptions.find((option) => option.value === trimmedTenantId)?.label || '';
  }, [tenantOptions, trimmedTenantId]);
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return selectedTenantLabel || t('department.form.currentTenantLabel');
  }, [isTenantLocked, selectedTenantLabel, t]);
  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    Boolean(nameError) ||
    Boolean(shortNameError) ||
    Boolean(typeError) ||
    Boolean(tenantError) ||
    (isEdit ? !canEditDepartment : !canCreateDepartment);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateDepartment) {
        router.replace('/settings/departments?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditDepartment) {
        router.replace('/settings/departments?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const departmentTenantId = String(department?.tenant_id ?? '').trim();
        if (!departmentTenantId || departmentTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/departments?notice=accessDenied');
          return;
        }
      }
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        name: trimmedName,
        short_name: trimmedShortName || undefined,
        department_type: trimmedDepartmentType,
        is_active: isActive,
      };

      if (!isEdit) {
        payload.tenant_id = trimmedTenantId;
      }

      if (isEdit && !trimmedShortName) {
        payload.short_name = null;
      }

      if (isEdit && routeDepartmentId) {
        const result = await update(routeDepartmentId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }
      router.replace(`/settings/departments?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isOffline,
    isEdit,
    routeDepartmentId,
    canCreateDepartment,
    canEditDepartment,
    isTenantScopedAdmin,
    department,
    normalizedScopedTenantId,
    trimmedName,
    trimmedShortName,
    trimmedTenantId,
    trimmedDepartmentType,
    isActive,
    create,
    update,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/departments');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const typeOptions = DEPARTMENT_TYPES.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

  const handleRetryTenants = useCallback(() => {
    if (isTenantScopedAdmin || isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: MAX_FETCH_LIMIT });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  return {
    isEdit,
    name,
    setName,
    shortName,
    setShortName,
    departmentType,
    setDepartmentType,
    isActive,
    setIsActive,
    tenantId: tenantIdValue,
    setTenantId: setTenantIdValue,
    tenantOptions,
    tenantListLoading: isTenantScopedAdmin ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin ? false : Boolean(tenantErrorCode),
    tenantErrorMessage: isTenantScopedAdmin ? null : tenantErrorMessage,
    hasTenants,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    department,
    nameError,
    shortNameError,
    typeError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onRetryTenants: handleRetryTenants,
    typeOptions,
    isSubmitDisabled,
    testID: 'department-form-screen',
  };
};

export default useDepartmentFormScreen;