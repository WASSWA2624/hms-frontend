/**
 * Shared logic for Clinical resource list screens.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useClinicalAccess } from '@hooks';
import { confirmAction } from '@utils';
import {
  getContextFilters,
  getClinicalResourceConfig,
  normalizeSearchParam,
  sanitizeString,
  CLINICAL_ROUTE_ROOT,
  CLINICAL_RESOURCE_IDS,
  withClinicalContext,
} from '../ClinicalResourceConfigs';
import useClinicalResourceCrud from '../useClinicalResourceCrud';
import {
  buildNoticeMessage,
  isAccessDeniedError,
  normalizeNoticeValue,
  normalizeClinicalContext,
  resolveErrorMessage,
} from '../ClinicalScreenUtils';

const buildItemContext = (resourceId, item, baseContext) => {
  if (!item || typeof item !== 'object') return baseContext;

  if (resourceId === CLINICAL_RESOURCE_IDS.ENCOUNTERS) {
    return {
      ...baseContext,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      encounterId: sanitizeString(item.id) || baseContext.encounterId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      providerUserId: sanitizeString(item.provider_user_id) || baseContext.providerUserId,
      encounterType: sanitizeString(item.encounter_type) || baseContext.encounterType,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CLINICAL_NOTES) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      authorUserId: sanitizeString(item.author_user_id) || baseContext.authorUserId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DIAGNOSES) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      diagnosisType: sanitizeString(item.diagnosis_type) || baseContext.diagnosisType,
      code: sanitizeString(item.code) || baseContext.code,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PROCEDURES) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      code: sanitizeString(item.code) || baseContext.code,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.VITAL_SIGNS) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      vitalType: sanitizeString(item.vital_type) || baseContext.vitalType,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CARE_PLANS) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      startDate: sanitizeString(item.start_date) || baseContext.startDate,
      endDate: sanitizeString(item.end_date) || baseContext.endDate,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.REFERRALS) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      fromDepartmentId: sanitizeString(item.from_department_id) || baseContext.fromDepartmentId,
      toDepartmentId: sanitizeString(item.to_department_id) || baseContext.toDepartmentId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.FOLLOW_UPS) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ADMISSIONS) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.id) || baseContext.admissionId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      bedId: sanitizeString(item.bed_id) || baseContext.bedId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.WARD_ROUNDS) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.NURSING_NOTES) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      nurseUserId: sanitizeString(item.nurse_user_id) || baseContext.nurseUserId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      prescriptionId: sanitizeString(item.prescription_id) || baseContext.prescriptionId,
      route: sanitizeString(item.route) || baseContext.route,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      fromWardId: sanitizeString(item.from_ward_id) || baseContext.fromWardId,
      toWardId: sanitizeString(item.to_ward_id) || baseContext.toWardId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ICU_STAYS) {
    return {
      ...baseContext,
      icuStayId: sanitizeString(item.id) || baseContext.icuStayId,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      startedAtFrom: sanitizeString(item.started_at) || baseContext.startedAtFrom,
      endedAtTo: sanitizeString(item.ended_at) || baseContext.endedAtTo,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS) {
    return {
      ...baseContext,
      icuStayId: sanitizeString(item.icu_stay_id) || baseContext.icuStayId,
      observedAtFrom: sanitizeString(item.observed_at) || baseContext.observedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS) {
    return {
      ...baseContext,
      icuStayId: sanitizeString(item.icu_stay_id) || baseContext.icuStayId,
      severity: sanitizeString(item.severity) || baseContext.severity,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.THEATRE_CASES) {
    return {
      ...baseContext,
      theatreCaseId: sanitizeString(item.id) || baseContext.theatreCaseId,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      status: sanitizeString(item.status) || baseContext.status,
      scheduledFrom: sanitizeString(item.scheduled_at) || baseContext.scheduledFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS) {
    return {
      ...baseContext,
      theatreCaseId: sanitizeString(item.theatre_case_id) || baseContext.theatreCaseId,
      anesthetistUserId: sanitizeString(item.anesthetist_user_id) || baseContext.anesthetistUserId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.POST_OP_NOTES) {
    return {
      ...baseContext,
      theatreCaseId: sanitizeString(item.theatre_case_id) || baseContext.theatreCaseId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.EMERGENCY_CASES) {
    return {
      ...baseContext,
      emergencyCaseId: sanitizeString(item.id) || baseContext.emergencyCaseId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      severity: sanitizeString(item.severity) || baseContext.severity,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS) {
    return {
      ...baseContext,
      emergencyCaseId: sanitizeString(item.emergency_case_id) || baseContext.emergencyCaseId,
      triageLevel: sanitizeString(item.triage_level) || baseContext.triageLevel,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES) {
    return {
      ...baseContext,
      emergencyCaseId: sanitizeString(item.emergency_case_id) || baseContext.emergencyCaseId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCES) {
    return {
      ...baseContext,
      ambulanceId: sanitizeString(item.id) || baseContext.ambulanceId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES) {
    return {
      ...baseContext,
      ambulanceId: sanitizeString(item.ambulance_id) || baseContext.ambulanceId,
      emergencyCaseId: sanitizeString(item.emergency_case_id) || baseContext.emergencyCaseId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS) {
    return {
      ...baseContext,
      ambulanceId: sanitizeString(item.ambulance_id) || baseContext.ambulanceId,
      emergencyCaseId: sanitizeString(item.emergency_case_id) || baseContext.emergencyCaseId,
      startedAtFrom: sanitizeString(item.started_at) || baseContext.startedAtFrom,
      endedAtTo: sanitizeString(item.ended_at) || baseContext.endedAtTo,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_TESTS) {
    return {
      ...baseContext,
      labTestId: sanitizeString(item.id) || baseContext.labTestId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      code: sanitizeString(item.code) || baseContext.code,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_PANELS) {
    return {
      ...baseContext,
      labPanelId: sanitizeString(item.id) || baseContext.labPanelId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      code: sanitizeString(item.code) || baseContext.code,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_ORDERS) {
    return {
      ...baseContext,
      labOrderId: sanitizeString(item.id) || baseContext.labOrderId,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      status: sanitizeString(item.status) || baseContext.status,
      orderedAtFrom: sanitizeString(item.ordered_at) || baseContext.orderedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_SAMPLES) {
    return {
      ...baseContext,
      labOrderId: sanitizeString(item.lab_order_id) || baseContext.labOrderId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_RESULTS) {
    return {
      ...baseContext,
      labOrderItemId: sanitizeString(item.lab_order_item_id) || baseContext.labOrderItemId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_QC_LOGS) {
    return {
      ...baseContext,
      labTestId: sanitizeString(item.lab_test_id) || baseContext.labTestId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS) {
    return {
      ...baseContext,
      radiologyTestId: sanitizeString(item.id) || baseContext.radiologyTestId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      code: sanitizeString(item.code) || baseContext.code,
      modality: sanitizeString(item.modality) || baseContext.modality,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS) {
    return {
      ...baseContext,
      radiologyOrderId: sanitizeString(item.id) || baseContext.radiologyOrderId,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      radiologyTestId: sanitizeString(item.radiology_test_id) || baseContext.radiologyTestId,
      status: sanitizeString(item.status) || baseContext.status,
      orderedAtFrom: sanitizeString(item.ordered_at) || baseContext.orderedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS) {
    return {
      ...baseContext,
      radiologyOrderId: sanitizeString(item.radiology_order_id) || baseContext.radiologyOrderId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.IMAGING_STUDIES) {
    return {
      ...baseContext,
      imagingStudyId: sanitizeString(item.id) || baseContext.imagingStudyId,
      radiologyOrderId: sanitizeString(item.radiology_order_id) || baseContext.radiologyOrderId,
      modality: sanitizeString(item.modality) || baseContext.modality,
      performedAt: sanitizeString(item.performed_at) || baseContext.performedAt,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PACS_LINKS) {
    return {
      ...baseContext,
      imagingStudyId: sanitizeString(item.imaging_study_id) || baseContext.imagingStudyId,
      expiresAt: sanitizeString(item.expires_at) || baseContext.expiresAt,
    };
  }

  return baseContext;
};

const useClinicalResourceListScreen = (resourceId) => {
  const config = getClinicalResourceConfig(resourceId);
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const noticeValue = useMemo(
    () => normalizeNoticeValue(searchParams?.notice),
    [searchParams]
  );
  const context = useMemo(
    () => normalizeClinicalContext(searchParams),
    [searchParams]
  );
  const { isOffline } = useNetwork();
  const {
    canAccessClinical,
    canCreateClinicalRecords,
    canDeleteClinicalRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useClinicalAccess();

  const { list, remove, data, isLoading, errorCode, reset } = useClinicalResourceCrud(resourceId);
  const [noticeMessage, setNoticeMessage] = useState(null);

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const canList = Boolean(config && canAccessClinical && hasScope);
  const resourceLabel = useMemo(() => t(`${config?.i18nKey}.label`), [config?.i18nKey, t]);

  const items = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [data]);

  const errorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.list.loadError`);
  }, [config, errorCode, t]);

  const listPath = useMemo(
    () => withClinicalContext(config?.routePath || CLINICAL_ROUTE_ROOT, context),
    [config?.routePath, context]
  );

  const fetchList = useCallback(() => {
    if (!config || !isResolved || !canList) return;
    const params = { ...config.listParams };
    if (config.requiresTenant && !canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    if (config.supportsFacility && !canManageAllTenants && normalizedFacilityId) {
      params.facility_id = normalizedFacilityId;
    }
    const filters = getContextFilters(resourceId, context);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });
    reset();
    list(params);
  }, [
    config,
    isResolved,
    canList,
    canManageAllTenants,
    normalizedTenantId,
    normalizedFacilityId,
    resourceId,
    context,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessClinical || !hasScope || !config) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessClinical, hasScope, config, router]);

  useEffect(() => {
    if (!canList) return;
    fetchList();
  }, [canList, fetchList]);

  useEffect(() => {
    if (!noticeValue || !config) return;
    const message = buildNoticeMessage(t, noticeValue, resourceLabel);
    if (!message) return;
    setNoticeMessage(message);
    router.replace(listPath);
  }, [noticeValue, config, t, resourceLabel, router, listPath]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => setNoticeMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !config) return;
    if (!isAccessDeniedError(errorCode)) return;
    const message = buildNoticeMessage(t, 'accessDenied', resourceLabel);
    if (message) setNoticeMessage(message);
  }, [isResolved, config, errorCode, t, resourceLabel]);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleItemPress = useCallback(
    (id) => {
      const normalizedId = normalizeSearchParam(id);
      if (!normalizedId || !config) return;
      const item = items.find((candidate) => String(candidate?.id) === String(normalizedId));
      const nextContext = buildItemContext(resourceId, item, context);
      router.push(withClinicalContext(`${config.routePath}/${normalizedId}`, nextContext));
    },
    [config, items, resourceId, context, router]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateClinicalRecords || !config) return;
    router.push(withClinicalContext(`${config.routePath}/create`, context));
  }, [canCreateClinicalRecords, config, context, router]);

  const handleDelete = useCallback(
    async (id, event) => {
      if (!canDeleteClinicalRecords || !config) return;
      if (event?.stopPropagation) event.stopPropagation();
      if (!confirmAction(t('common.confirmDelete'))) return;
      const normalizedId = normalizeSearchParam(id);
      if (!normalizedId) return;
      try {
        const result = await remove(normalizedId);
        if (!result) return;
        fetchList();
        const noticeType = isOffline ? 'queued' : 'deleted';
        const message = buildNoticeMessage(t, noticeType, resourceLabel);
        if (message) setNoticeMessage(message);
      } catch {
        // Hook-level error handling already updates state.
      }
    },
    [canDeleteClinicalRecords, config, t, remove, fetchList, isOffline, resourceLabel]
  );

  return {
    config,
    context,
    items,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onItemPress: handleItemPress,
    onDelete: handleDelete,
    onAdd: handleAdd,
    canCreate: canCreateClinicalRecords,
    canDelete: canDeleteClinicalRecords,
    createBlockedReason: canCreateClinicalRecords ? '' : t('clinical.access.createDenied'),
    deleteBlockedReason: canDeleteClinicalRecords ? '' : t('clinical.access.deleteDenied'),
    listPath,
  };
};

export default useClinicalResourceListScreen;
