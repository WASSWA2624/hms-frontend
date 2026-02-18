/**
 * useUnitFormScreen Hook
 * Shared logic for UnitFormScreen (create/edit).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useI18n,
  useNetwork,
  useTenant,
  useFacility,
  useDepartment,
  useUnit,
  useTenantAccess,
} from '@hooks';
import { humanizeIdentifier } from '@utils';

const MAX_NAME_LENGTH = 255;
const MAX_FETCH_LIMIT = 100;

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(fallbackKey) : resolved;
};

const useUnitFormScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    id,
    tenantId: tenantIdParam,
    facilityId: facilityIdParam,
    departmentId: departmentIdParam,
  } = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const {
    canAccessTenantSettings,
    canManageAllTenants,
    tenantId: scopedTenantId,
    isResolved,
  } = useTenantAccess();
  const { get, create, update, data, isLoading, errorCode, reset } = useUnit();
  const {
    list: listTenants,
    data: tenantData,
    isLoading: tenantListLoading,
    errorCode: tenantErrorCode,
    reset: resetTenants,
  } = useTenant();
  const {
    list: listFacilities,
    data: facilityData,
    isLoading: facilityListLoading,
    errorCode: facilityErrorCode,
    reset: resetFacilities,
  } = useFacility();
  const {
    list: listDepartments,
    data: departmentData,
    isLoading: departmentListLoading,
    errorCode: departmentErrorCode,
    reset: resetDepartments,
  } = useDepartment();

  const routeUnitId = useMemo(() => {
    if (Array.isArray(id)) return id[0] || null;
    return id || null;
  }, [id]);
  const isEdit = Boolean(routeUnitId);
  const canManageUnits = canAccessTenantSettings;
  const canCreateUnit = canManageUnits;
  const canEditUnit = canManageUnits;
  const isTenantScopedAdmin = canManageUnits && !canManageAllTenants;
  const normalizedScopedTenantId = useMemo(
    () => String(scopedTenantId ?? '').trim(),
    [scopedTenantId]
  );

  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [tenantId, setTenantId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  const tenantPrefillRef = useRef(false);
  const facilityPrefillRef = useRef(false);
  const departmentPrefillRef = useRef(false);
  const previousTenantRef = useRef('');
  const previousFacilityRef = useRef('');

  const unit = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const tenantItems = useMemo(
    () => (isTenantScopedAdmin || isEdit
      ? []
      : (Array.isArray(tenantData) ? tenantData : (tenantData?.items ?? []))),
    [tenantData, isTenantScopedAdmin, isEdit]
  );
  const facilityItems = useMemo(
    () => (Array.isArray(facilityData) ? facilityData : (facilityData?.items ?? [])),
    [facilityData]
  );
  const departmentItems = useMemo(
    () => (Array.isArray(departmentData) ? departmentData : (departmentData?.items ?? [])),
    [departmentData]
  );

  const tenantOptions = useMemo(() => {
    if (isTenantScopedAdmin && !isEdit && normalizedScopedTenantId) {
      return [{ value: normalizedScopedTenantId, label: t('unit.form.currentTenantLabel') }];
    }
    return tenantItems.map((tenant, index) => ({
      value: tenant.id,
      label: humanizeIdentifier(tenant.name)
        || humanizeIdentifier(tenant.slug)
        || t('unit.form.tenantOptionFallback', { index: index + 1 }),
    }));
  }, [tenantItems, isTenantScopedAdmin, isEdit, normalizedScopedTenantId, t]);

  const facilityOptions = useMemo(() => {
    const options = facilityItems.map((facility, index) => ({
      value: facility.id,
      label: humanizeIdentifier(facility.name)
        || humanizeIdentifier(facility.slug)
        || t('unit.form.facilityOptionFallback', { index: index + 1 }),
    }));
    if (facilityId && !options.some((option) => option.value === facilityId)) {
      const fallbackLabel = humanizeIdentifier(
        unit?.facility_name
        ?? unit?.facility?.name
        ?? unit?.facility_label
      ) || t('unit.form.currentFacilityLabel');
      return [{ value: facilityId, label: fallbackLabel }, ...options];
    }
    return options;
  }, [facilityItems, facilityId, unit, t]);

  const departmentOptions = useMemo(() => {
    const options = departmentItems.map((department, index) => ({
      value: department.id,
      label: humanizeIdentifier(department.name)
        || humanizeIdentifier(department.slug)
        || t('unit.form.departmentOptionFallback', { index: index + 1 }),
    }));
    if (departmentId && !options.some((option) => option.value === departmentId)) {
      const fallbackLabel = humanizeIdentifier(
        unit?.department_name
        ?? unit?.department?.name
        ?? unit?.department_label
      ) || t('unit.form.currentDepartmentLabel');
      return [{ value: departmentId, label: fallbackLabel }, ...options];
    }
    return options;
  }, [departmentItems, departmentId, unit, t]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canManageUnits) {
      router.replace('/settings');
      return;
    }
    if (isTenantScopedAdmin && !normalizedScopedTenantId) {
      router.replace('/settings');
      return;
    }
    if (!isEdit && !canCreateUnit) {
      router.replace('/settings/units?notice=accessDenied');
      return;
    }
    if (isEdit && !canEditUnit) {
      router.replace('/settings/units?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUnits,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    isEdit,
    canCreateUnit,
    canEditUnit,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUnits || !isEdit || !routeUnitId) return;
    if (!canEditUnit) return;
    reset();
    get(routeUnitId);
  }, [isResolved, canManageUnits, isEdit, routeUnitId, canEditUnit, get, reset]);

  useEffect(() => {
    if (!isResolved || !canManageUnits || isEdit) return;
    if (!canCreateUnit) return;
    if (isTenantScopedAdmin) {
      setTenantId(normalizedScopedTenantId);
      return;
    }
    resetTenants();
    listTenants({ page: 1, limit: MAX_FETCH_LIMIT });
  }, [
    isResolved,
    canManageUnits,
    isEdit,
    canCreateUnit,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    listTenants,
    resetTenants,
  ]);

  useEffect(() => {
    if (unit) {
      setName(unit.name ?? '');
      setIsActive(unit.is_active ?? true);
      setTenantId(String(unit.tenant_id ?? normalizedScopedTenantId ?? ''));
      setFacilityId(unit.facility_id ?? '');
      setDepartmentId(unit.department_id ?? '');
    }
  }, [unit, normalizedScopedTenantId]);

  useEffect(() => {
    if (!isResolved || !canManageUnits || !isTenantScopedAdmin || !isEdit || !unit) return;
    const unitTenantId = String(unit.tenant_id ?? '').trim();
    if (!normalizedScopedTenantId || !unitTenantId || unitTenantId !== normalizedScopedTenantId) {
      router.replace('/settings/units?notice=accessDenied');
    }
  }, [
    isResolved,
    canManageUnits,
    isTenantScopedAdmin,
    isEdit,
    unit,
    normalizedScopedTenantId,
    router,
  ]);

  useEffect(() => {
    if (!isResolved || !canManageUnits || !isEdit) return;
    if (unit) return;
    if (errorCode === 'FORBIDDEN' || errorCode === 'UNAUTHORIZED') {
      router.replace('/settings/units?notice=accessDenied');
    }
  }, [isResolved, canManageUnits, isEdit, unit, errorCode, router]);

  useEffect(() => {
    if (!isResolved || !canManageUnits) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (!trimmedTenant) {
      resetFacilities();
      return;
    }
    resetFacilities();
    listFacilities({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: trimmedTenant });
  }, [isResolved, canManageUnits, tenantId, listFacilities, resetFacilities]);

  useEffect(() => {
    if (!isResolved || !canManageUnits) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (!trimmedTenant) {
      resetDepartments();
      return;
    }
    const trimmedFacility = String(facilityId ?? '').trim();
    const params = { page: 1, limit: MAX_FETCH_LIMIT, tenant_id: trimmedTenant };
    if (trimmedFacility) {
      params.facility_id = trimmedFacility;
    }
    resetDepartments();
    listDepartments(params);
  }, [isResolved, canManageUnits, tenantId, facilityId, listDepartments, resetDepartments]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedTenant = String(tenantId ?? '').trim();
    if (previousTenantRef.current && previousTenantRef.current !== trimmedTenant) {
      setFacilityId('');
      setDepartmentId('');
      facilityPrefillRef.current = false;
      departmentPrefillRef.current = false;
    }
    previousTenantRef.current = trimmedTenant;
  }, [tenantId, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    const trimmedFacility = String(facilityId ?? '').trim();
    if (previousFacilityRef.current && previousFacilityRef.current !== trimmedFacility) {
      setDepartmentId('');
      departmentPrefillRef.current = false;
    }
    previousFacilityRef.current = trimmedFacility;
  }, [facilityId, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    if (tenantPrefillRef.current) return;
    if (isTenantScopedAdmin && normalizedScopedTenantId) {
      setTenantId(normalizedScopedTenantId);
      tenantPrefillRef.current = true;
      return;
    }
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
  }, [
    isEdit,
    isTenantScopedAdmin,
    normalizedScopedTenantId,
    tenantIdParam,
    tenantOptions,
    tenantId,
  ]);

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
  }, [isEdit, facilityIdParam, facilityOptions, facilityId]);

  useEffect(() => {
    if (isEdit) return;
    if (departmentPrefillRef.current) return;
    const paramValue = Array.isArray(departmentIdParam) ? departmentIdParam[0] : departmentIdParam;
    if (paramValue) {
      setDepartmentId(String(paramValue));
      departmentPrefillRef.current = true;
      return;
    }
    if (departmentOptions.length === 1 && !departmentId) {
      setDepartmentId(departmentOptions[0].value);
      departmentPrefillRef.current = true;
    }
  }, [isEdit, departmentIdParam, departmentOptions, departmentId]);

  const trimmedName = name.trim();
  const trimmedTenantId = String(tenantId ?? '').trim();
  const trimmedFacilityId = String(facilityId ?? '').trim();
  const trimmedDepartmentId = String(departmentId ?? '').trim();

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'unit.form.submitErrorMessage'),
    [t, errorCode]
  );
  const tenantErrorMessage = useMemo(
    () => resolveErrorMessage(t, tenantErrorCode, 'unit.form.tenantLoadErrorMessage'),
    [t, tenantErrorCode]
  );
  const facilityErrorMessage = useMemo(
    () => resolveErrorMessage(t, facilityErrorCode, 'unit.form.facilityLoadErrorMessage'),
    [t, facilityErrorCode]
  );
  const departmentErrorMessage = useMemo(
    () => resolveErrorMessage(t, departmentErrorCode, 'unit.form.departmentLoadErrorMessage'),
    [t, departmentErrorCode]
  );

  const tenantListError = Boolean(tenantErrorCode);
  const facilityListError = Boolean(facilityErrorCode);
  const departmentListError = Boolean(departmentErrorCode);
  const hasTenants = isTenantScopedAdmin ? Boolean(trimmedTenantId) : tenantOptions.length > 0;
  const hasFacilities = facilityOptions.length > 0;
  const hasDepartments = departmentOptions.length > 0;
  const isCreateBlocked = !isEdit && !hasTenants;

  const nameError = useMemo(() => {
    if (!trimmedName) return t('unit.form.nameRequired');
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return t('unit.form.nameTooLong', { max: MAX_NAME_LENGTH });
    }
    return null;
  }, [trimmedName, t]);

  const tenantError = useMemo(() => {
    if (isEdit) return null;
    if (!trimmedTenantId) return t('unit.form.tenantRequired');
    return null;
  }, [isEdit, trimmedTenantId, t]);

  const isTenantLocked = !isEdit && isTenantScopedAdmin;
  const selectedTenantLabel = useMemo(() => {
    if (!trimmedTenantId) return '';
    return tenantOptions.find((option) => option.value === trimmedTenantId)?.label || '';
  }, [tenantOptions, trimmedTenantId]);
  const unitTenantLabel = useMemo(
    () => humanizeIdentifier(
      unit?.tenant_name
      ?? unit?.tenant?.name
      ?? unit?.tenant_label
    ),
    [unit]
  );
  const lockedTenantDisplay = useMemo(() => {
    if (!isTenantLocked) return '';
    return selectedTenantLabel || t('unit.form.currentTenantLabel');
  }, [isTenantLocked, selectedTenantLabel, t]);
  const tenantDisplayLabel = useMemo(() => {
    if (isEdit) return selectedTenantLabel || unitTenantLabel || t('unit.form.currentTenantLabel');
    if (isTenantLocked) return lockedTenantDisplay;
    return selectedTenantLabel;
  }, [isEdit, selectedTenantLabel, unitTenantLabel, isTenantLocked, lockedTenantDisplay, t]);

  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    isCreateBlocked ||
    Boolean(nameError) ||
    Boolean(tenantError) ||
    (isEdit ? !canEditUnit : !canCreateUnit);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitDisabled) return;
      if (!isEdit && !canCreateUnit) {
        router.replace('/settings/units?notice=accessDenied');
        return;
      }
      if (isEdit && !canEditUnit) {
        router.replace('/settings/units?notice=accessDenied');
        return;
      }
      if (isEdit && isTenantScopedAdmin) {
        const unitTenantId = String(unit?.tenant_id ?? '').trim();
        if (!unitTenantId || unitTenantId !== normalizedScopedTenantId) {
          router.replace('/settings/units?notice=accessDenied');
          return;
        }
      }

      const noticeKey = isOffline ? 'queued' : (isEdit ? 'updated' : 'created');
      const payload = {
        name: trimmedName,
        is_active: isActive,
      };

      if (isEdit) {
        payload.facility_id = trimmedFacilityId || null;
        payload.department_id = trimmedDepartmentId || null;
      } else {
        payload.tenant_id = trimmedTenantId;
        if (trimmedFacilityId) payload.facility_id = trimmedFacilityId;
        if (trimmedDepartmentId) payload.department_id = trimmedDepartmentId;
      }

      if (isEdit && routeUnitId) {
        const result = await update(routeUnitId, payload);
        if (!result) return;
      } else {
        const result = await create(payload);
        if (!result) return;
      }

      router.replace(`/settings/units?notice=${noticeKey}`);
    } catch {
      /* error from hook */
    }
  }, [
    isSubmitDisabled,
    isEdit,
    routeUnitId,
    canCreateUnit,
    canEditUnit,
    isTenantScopedAdmin,
    unit,
    normalizedScopedTenantId,
    isOffline,
    trimmedName,
    trimmedTenantId,
    trimmedFacilityId,
    trimmedDepartmentId,
    isActive,
    update,
    create,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/settings/units');
  }, [router]);

  const handleGoToTenants = useCallback(() => {
    router.push('/settings/tenants');
  }, [router]);

  const handleGoToFacilities = useCallback(() => {
    router.push('/settings/facilities');
  }, [router]);

  const handleGoToDepartments = useCallback(() => {
    router.push('/settings/departments');
  }, [router]);

  const handleRetryTenants = useCallback(() => {
    if (isTenantScopedAdmin || isEdit) return;
    resetTenants();
    listTenants({ page: 1, limit: MAX_FETCH_LIMIT });
  }, [isTenantScopedAdmin, isEdit, listTenants, resetTenants]);

  const handleRetryFacilities = useCallback(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    resetFacilities();
    if (!trimmedTenant) return;
    listFacilities({ page: 1, limit: MAX_FETCH_LIMIT, tenant_id: trimmedTenant });
  }, [tenantId, listFacilities, resetFacilities]);

  const handleRetryDepartments = useCallback(() => {
    const trimmedTenant = String(tenantId ?? '').trim();
    resetDepartments();
    if (!trimmedTenant) return;
    const params = { page: 1, limit: MAX_FETCH_LIMIT, tenant_id: trimmedTenant };
    const trimmedFacility = String(facilityId ?? '').trim();
    if (trimmedFacility) params.facility_id = trimmedFacility;
    listDepartments(params);
  }, [tenantId, facilityId, listDepartments, resetDepartments]);

  return {
    isEdit,
    name,
    setName,
    isActive,
    setIsActive,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    departmentId,
    setDepartmentId,
    tenantOptions,
    facilityOptions,
    departmentOptions,
    tenantListLoading: isTenantScopedAdmin ? false : tenantListLoading,
    tenantListError: isTenantScopedAdmin ? false : tenantListError,
    tenantErrorMessage: isTenantScopedAdmin ? null : tenantErrorMessage,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    departmentListLoading,
    departmentListError,
    departmentErrorMessage,
    hasTenants,
    hasFacilities,
    hasDepartments,
    isCreateBlocked,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    unit,
    nameError,
    tenantError,
    isTenantLocked,
    lockedTenantDisplay,
    tenantDisplayLabel,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onGoToTenants: handleGoToTenants,
    onGoToFacilities: handleGoToFacilities,
    onGoToDepartments: handleGoToDepartments,
    onRetryTenants: handleRetryTenants,
    onRetryFacilities: handleRetryFacilities,
    onRetryDepartments: handleRetryDepartments,
    isSubmitDisabled,
    testID: 'unit-form-screen',
  };
};

export default useUnitFormScreen;
