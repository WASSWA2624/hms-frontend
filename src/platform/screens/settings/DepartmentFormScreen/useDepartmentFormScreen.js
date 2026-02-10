/**
 * useDepartmentFormScreen Hook
 * Shared logic for DepartmentFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useI18n, useDepartment, useNetwork, useTenant } from '@hooks';

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
  const router = useRouter();
  const { id, tenantId: tenantIdParam } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const { get, create, update, data, isLoading, errorCode, reset } = useDepartment();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();

  const isEdit = Boolean(id);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [departmentType, setDepartmentType] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [tenantId, setTenantId] = useState('');
  const tenantPrefillRef = useRef(false);

  const department = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? [])),
    [tenantData]
  );
  const tenantOptions = useMemo(
    () =>
      tenantItems.map((tenant) => ({
        value: tenant.id,
        label: tenant.name ?? tenant.slug ?? tenant.id ?? '',
      })),
    [tenantItems]
  );

  useEffect(() => {
    if (isEdit && id) {
      reset();
      get(id);
    }
  }, [isEdit, id, get, reset]);

  useEffect(() => {
    if (!isEdit) {
      resetTenants();
      listTenants({ page: 1, limit: 200 });
    }
  }, [isEdit, listTenants, resetTenants]);

  useEffect(() => {
    if (department) {
      setName(department.name ?? '');
      setShortName(department.short_name ?? '');
      setDepartmentType(department.department_type ?? '');
      setIsActive(department.is_active ?? true);
      setTenantId(department.tenant_id ?? '');
    }
  }, [department]);

  useEffect(() => {
    if (isEdit) return;
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
  }, [isEdit, tenantIdParam, tenantOptions, tenantId]);

  const trimmedName = name.trim();
  const trimmedShortName = shortName.trim();
  const trimmedDepartmentType = departmentType.trim();
  const trimmedTenantId = tenantId.trim();
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'department.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'department.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const hasTenants = tenantOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasTenants;
  const isSubmitDisabled =
    isLoading || isCreateBlocked || !trimmedName || (!isEdit && !trimmedTenantId);

  const typeOptions = useMemo(() => {
    const baseOptions = [
      { value: 'CLINICAL', label: t('department.form.typeOptions.clinical') },
      { value: 'ADMINISTRATIVE', label: t('department.form.typeOptions.administrative') },
      { value: 'SUPPORT', label: t('department.form.typeOptions.support') },
      { value: 'DIAGNOSTICS', label: t('department.form.typeOptions.diagnostics') },
      { value: 'OTHER', label: t('department.form.typeOptions.other') },
    ];
    if (trimmedDepartmentType && !baseOptions.some((option) => option.value === trimmedDepartmentType)) {
      return [{ value: trimmedDepartmentType, label: trimmedDepartmentType }, ...baseOptions];
    }
    return baseOptions;
  }, [t, trimmedDepartmentType]);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        name: trimmedName,
        short_name: trimmedShortName || undefined,
        department_type: trimmedDepartmentType || undefined,
        is_active: isActive,
      };
      if (!isEdit && trimmedTenantId) {
        payload.tenant_id = trimmedTenantId;
      }
      if (isEdit && !trimmedDepartmentType) {
        payload.department_type = null;
      }
      if (isEdit && !trimmedShortName) {
        payload.short_name = null;
      }
      if (isEdit && id) {
        const result = await update(id, payload);
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
    id,
    trimmedName,
    trimmedDepartmentType,
    trimmedTenantId,
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

  const handleRetryTenants = useCallback(() => {
    resetTenants();
    listTenants({ page: 1, limit: 200 });
  }, [listTenants, resetTenants]);

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
    tenantId,
    setTenantId,
    tenantOptions,
    tenantListLoading,
    tenantListError: Boolean(tenantErrorCode),
    tenantErrorMessage,
    hasTenants,
    isCreateBlocked,
    typeOptions,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    department,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onRetryTenants: handleRetryTenants,
    isSubmitDisabled,
    testID: 'department-form-screen',
  };
};

export default useDepartmentFormScreen;
