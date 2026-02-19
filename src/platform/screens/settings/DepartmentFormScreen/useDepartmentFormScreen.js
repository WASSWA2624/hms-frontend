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
const DEFAULT_FETCH_PAGE = 1;
const DEFAULT_FETCH_LIMIT = 100;
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

const normalizeFetchPage = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_FETCH_PAGE;
  return Math.max(DEFAULT_FETCH_PAGE, Math.trunc(numeric));
};

const normalizeFetchLimit = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_FETCH_LIMIT;
  return Math.min(MAX_FETCH_LIMIT, Math.max(1, Math.trunc(numeric)));
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
  const isDepartmentInScope = useMemo(() => {
    if (!department) return true;
    if (canManageAllTenants) return true;
    const departmentTenantId = String(department?.tenant_id ?? '').trim();
    if (!departmentTenantId || !normalizedScopedTenantId) return false;
    return departmentTenantId === normalizedScopedTenantId;
  }, [department, canManageAllTenants, normalizedScopedTenantId]);
  const visibleDepartment = isDepartmentInScope ? department : null;

  const tenantItems = useMemo(
    () => (isTenantScopedAdmin || isEdit
      ? []
      : (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? []))),
    [tenantData, isTenantScopedAdmin, isEdit]
  );
  const tenantOptions = useMemo(
    () => {
      if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
        return [{
          value: normalizedScopedTenantId,
          label: t('department.form.currentTenantLabel'),
        }];
      }
      return tenantItems.map((tenant, index) => ({
        value: tenant.id,
        label: humanizeIdentifier(tenant.name)
          || humanizeIdentifier(tenant.slug)
          || t('department.form.tenantOptionFallback', { index: index + 1 }),
      }));
    },
    [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId, t]
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
    if (isTenantScopedAdmin) {
      setTenantIdValue(normalizedScopedTenantId);
      return;
    }
    resetTenants();
    listTenants({
      page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
      limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
    });
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
    if (visibleDepartment) {
      setName(visibleDepartment.name ?? '');
      setShortName(visibleDepartment.short_name ?? '');
      setDepartmentType(visibleDepartment.department_type ?? '');
      setIsActive(visibleDepartment.is_active ?? true);
      setTenantIdValue(String(visibleDepartment.tenant_id ?? normalizedScopedTenantId ?? ''));
    }
  }, [visibleDepartment, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageDepartments || !isEdit || !department || isDepartmentInScope) return;
    router.replace('/settings/departments?notice=accessDenied');
  }, [
    isResolved,
    canManageDepartments,
    isEdit,
    department,
    isDepartmentInScope,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageDepartments || !isEdit) return;
    if (visibleDepartment) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/departments?notice=accessDenied');
    }
  }, [isResolved, canManageDepartments, isEdit, visibleDepartment, errorCode, router]);

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
    (isEdit && !isDepartmentInScope) ||
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
        const departmentTenantId = String(visibleDepartment?.tenant_id ?? '').trim();
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
    visibleDepartment,
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
    listTenants({
      page: normalizeFetchPage(DEFAULT_FETCH_PAGE),
      limit: normalizeFetchLimit(DEFAULT_FETCH_LIMIT),
    });
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
    hasError: isResolved && Boolean(errorCode) && isDepartmentInScope,
    errorMessage,
    isOffline,
    department: visibleDepartment,
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
