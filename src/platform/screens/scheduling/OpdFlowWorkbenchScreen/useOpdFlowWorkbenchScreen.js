import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useOpdFlow, useOpdFlowAccess } from '@hooks';
import { resolveErrorMessage } from '../schedulingScreenUtils';

const ACCESS_DENIED_CODES = new Set(['FORBIDDEN', 'UNAUTHORIZED']);
const ENTITLEMENT_DENIED_CODES = new Set(['MODULE_NOT_ENTITLED']);
const TERMINAL_STAGES = new Set(['ADMITTED', 'DISCHARGED']);
const DISPOSITION_STAGES = new Set([
  'LAB_REQUESTED',
  'RADIOLOGY_REQUESTED',
  'LAB_AND_RADIOLOGY_REQUESTED',
  'PHARMACY_REQUESTED',
  'WAITING_DISPOSITION',
]);

const ARRIVAL_MODE_OPTIONS = [
  { value: 'WALK_IN', labelKey: 'scheduling.opdFlow.options.arrivalMode.walkIn' },
  { value: 'ONLINE_APPOINTMENT', labelKey: 'scheduling.opdFlow.options.arrivalMode.onlineAppointment' },
  { value: 'EMERGENCY', labelKey: 'scheduling.opdFlow.options.arrivalMode.emergency' },
];
const EMERGENCY_SEVERITY_OPTIONS = [
  { value: 'LOW', labelKey: 'scheduling.opdFlow.options.emergencySeverity.low' },
  { value: 'MEDIUM', labelKey: 'scheduling.opdFlow.options.emergencySeverity.medium' },
  { value: 'HIGH', labelKey: 'scheduling.opdFlow.options.emergencySeverity.high' },
  { value: 'CRITICAL', labelKey: 'scheduling.opdFlow.options.emergencySeverity.critical' },
];
const TRIAGE_LEVEL_OPTIONS = [
  { value: 'LEVEL_1', labelKey: 'scheduling.opdFlow.options.triageLevel.level1' },
  { value: 'LEVEL_2', labelKey: 'scheduling.opdFlow.options.triageLevel.level2' },
  { value: 'LEVEL_3', labelKey: 'scheduling.opdFlow.options.triageLevel.level3' },
  { value: 'LEVEL_4', labelKey: 'scheduling.opdFlow.options.triageLevel.level4' },
  { value: 'LEVEL_5', labelKey: 'scheduling.opdFlow.options.triageLevel.level5' },
  { value: 'IMMEDIATE', labelKey: 'scheduling.opdFlow.options.triageLevel.immediate' },
  { value: 'URGENT', labelKey: 'scheduling.opdFlow.options.triageLevel.urgent' },
  { value: 'LESS_URGENT', labelKey: 'scheduling.opdFlow.options.triageLevel.lessUrgent' },
  { value: 'NON_URGENT', labelKey: 'scheduling.opdFlow.options.triageLevel.nonUrgent' },
];
const PAYMENT_METHOD_OPTIONS = [
  { value: 'CASH', labelKey: 'scheduling.opdFlow.options.paymentMethod.cash' },
  { value: 'CREDIT_CARD', labelKey: 'scheduling.opdFlow.options.paymentMethod.creditCard' },
  { value: 'DEBIT_CARD', labelKey: 'scheduling.opdFlow.options.paymentMethod.debitCard' },
  { value: 'MOBILE_MONEY', labelKey: 'scheduling.opdFlow.options.paymentMethod.mobileMoney' },
  { value: 'BANK_TRANSFER', labelKey: 'scheduling.opdFlow.options.paymentMethod.bankTransfer' },
  { value: 'INSURANCE', labelKey: 'scheduling.opdFlow.options.paymentMethod.insurance' },
  { value: 'OTHER', labelKey: 'scheduling.opdFlow.options.paymentMethod.other' },
];
const VITAL_TYPE_OPTIONS = [
  { value: 'TEMPERATURE', labelKey: 'scheduling.opdFlow.options.vitalType.temperature' },
  { value: 'BLOOD_PRESSURE', labelKey: 'scheduling.opdFlow.options.vitalType.bloodPressure' },
  { value: 'HEART_RATE', labelKey: 'scheduling.opdFlow.options.vitalType.heartRate' },
  { value: 'RESPIRATORY_RATE', labelKey: 'scheduling.opdFlow.options.vitalType.respiratoryRate' },
  { value: 'OXYGEN_SATURATION', labelKey: 'scheduling.opdFlow.options.vitalType.oxygenSaturation' },
  { value: 'WEIGHT', labelKey: 'scheduling.opdFlow.options.vitalType.weight' },
  { value: 'HEIGHT', labelKey: 'scheduling.opdFlow.options.vitalType.height' },
  { value: 'BMI', labelKey: 'scheduling.opdFlow.options.vitalType.bmi' },
];
const DIAGNOSIS_TYPE_OPTIONS = [
  { value: 'PRIMARY', labelKey: 'scheduling.opdFlow.options.diagnosisType.primary' },
  { value: 'SECONDARY', labelKey: 'scheduling.opdFlow.options.diagnosisType.secondary' },
  { value: 'DIFFERENTIAL', labelKey: 'scheduling.opdFlow.options.diagnosisType.differential' },
];
const MEDICATION_FREQUENCY_OPTIONS = [
  { value: 'ONCE', labelKey: 'scheduling.opdFlow.options.medicationFrequency.once' },
  { value: 'BID', labelKey: 'scheduling.opdFlow.options.medicationFrequency.bid' },
  { value: 'TID', labelKey: 'scheduling.opdFlow.options.medicationFrequency.tid' },
  { value: 'QID', labelKey: 'scheduling.opdFlow.options.medicationFrequency.qid' },
  { value: 'PRN', labelKey: 'scheduling.opdFlow.options.medicationFrequency.prn' },
  { value: 'STAT', labelKey: 'scheduling.opdFlow.options.medicationFrequency.stat' },
  { value: 'CUSTOM', labelKey: 'scheduling.opdFlow.options.medicationFrequency.custom' },
];
const MEDICATION_ROUTE_OPTIONS = [
  { value: 'ORAL', labelKey: 'scheduling.opdFlow.options.medicationRoute.oral' },
  { value: 'IV', labelKey: 'scheduling.opdFlow.options.medicationRoute.iv' },
  { value: 'IM', labelKey: 'scheduling.opdFlow.options.medicationRoute.im' },
  { value: 'TOPICAL', labelKey: 'scheduling.opdFlow.options.medicationRoute.topical' },
  { value: 'INHALATION', labelKey: 'scheduling.opdFlow.options.medicationRoute.inhalation' },
  { value: 'OTHER', labelKey: 'scheduling.opdFlow.options.medicationRoute.other' },
];
const DISPOSITION_OPTIONS = [
  { value: 'ADMIT', labelKey: 'scheduling.opdFlow.options.disposition.admit' },
  { value: 'SEND_TO_PHARMACY', labelKey: 'scheduling.opdFlow.options.disposition.sendToPharmacy' },
  { value: 'DISCHARGE', labelKey: 'scheduling.opdFlow.options.disposition.discharge' },
];

const STAGE_ACTION_MAP = {
  WAITING_CONSULTATION_PAYMENT: 'PAY_CONSULTATION',
  WAITING_VITALS: 'RECORD_VITALS',
  WAITING_DOCTOR_ASSIGNMENT: 'ASSIGN_DOCTOR',
  WAITING_DOCTOR_REVIEW: 'DOCTOR_REVIEW',
  LAB_REQUESTED: 'DISPOSITION',
  RADIOLOGY_REQUESTED: 'DISPOSITION',
  LAB_AND_RADIOLOGY_REQUESTED: 'DISPOSITION',
  PHARMACY_REQUESTED: 'DISPOSITION',
  WAITING_DISPOSITION: 'DISPOSITION',
};

const DEFAULT_START_DRAFT = {
  arrival_mode: 'WALK_IN',
  patient_id: '',
  appointment_id: '',
  provider_user_id: '',
  first_name: '',
  last_name: '',
  consultation_fee: '',
  currency: 'USD',
  require_consultation_payment: true,
  create_consultation_invoice: true,
  pay_now_enabled: false,
  pay_now_method: 'CASH',
  pay_now_amount: '',
  emergency_severity: 'HIGH',
  emergency_triage_level: '',
  emergency_notes: '',
  notes: '',
};
const DEFAULT_PAYMENT_DRAFT = {
  method: 'CASH',
  amount: '',
  currency: 'USD',
  transaction_ref: '',
  notes: '',
};
const createVitalRow = () => ({
  vital_type: 'TEMPERATURE',
  value: '',
  unit: '',
});
const DEFAULT_ASSIGN_DRAFT = {
  provider_user_id: '',
};
const createDiagnosisRow = () => ({
  diagnosis_type: 'PRIMARY',
  code: '',
  description: '',
});
const createProcedureRow = () => ({
  code: '',
  description: '',
});
const createLabRequestRow = () => ({
  lab_test_id: '',
});
const createRadiologyRequestRow = () => ({
  radiology_test_id: '',
});
const createMedicationRow = () => ({
  drug_id: '',
  quantity: '1',
  dosage: '',
  frequency: 'BID',
  route: 'ORAL',
});
const DEFAULT_REVIEW_DRAFT = {
  note: '',
  notes: '',
  diagnoses: [],
  procedures: [],
  lab_requests: [],
  radiology_requests: [],
  medications: [],
};
const DEFAULT_DISPOSITION_DRAFT = {
  decision: 'DISCHARGE',
  admission_facility_id: '',
  notes: '',
};

const sanitizeString = (value) => String(value || '').trim();

const normalizeScalarParam = (value) => {
  if (Array.isArray(value)) return sanitizeString(value[0]);
  return sanitizeString(value);
};

const resolveEncounterId = (value) => {
  const fromValue = sanitizeString(value?.id);
  if (fromValue) return fromValue;
  const fromEncounter = sanitizeString(value?.encounter?.id);
  if (fromEncounter) return fromEncounter;
  const fromFlow = sanitizeString(value?.flow?.encounter_id);
  if (fromFlow) return fromFlow;
  return '';
};

const resolveListItems = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const useOpdFlowWorkbenchScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const requestedFlowId = normalizeScalarParam(searchParams?.id);

  const {
    canAccessOpdFlow,
    canStartFlow,
    canPayConsultation,
    canRecordVitals,
    canAssignDoctor,
    canDoctorReview,
    canDisposition,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useOpdFlowAccess();

  const opdFlowCrud = useOpdFlow();

  const [flowList, setFlowList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedFlowId, setSelectedFlowId] = useState('');
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [isStartFormOpen, setIsStartFormOpen] = useState(false);
  const [startDraft, setStartDraft] = useState(DEFAULT_START_DRAFT);
  const [paymentDraft, setPaymentDraft] = useState(DEFAULT_PAYMENT_DRAFT);
  const [vitalsDraft, setVitalsDraft] = useState({
    vitals: [createVitalRow()],
    triage_level: '',
    triage_notes: '',
  });
  const [assignDraft, setAssignDraft] = useState(DEFAULT_ASSIGN_DRAFT);
  const [reviewDraft, setReviewDraft] = useState(DEFAULT_REVIEW_DRAFT);
  const [dispositionDraft, setDispositionDraft] = useState(DEFAULT_DISPOSITION_DRAFT);
  const [formError, setFormError] = useState('');

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const canViewWorkbench = isResolved && canAccessOpdFlow && hasScope;

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessOpdFlow || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessOpdFlow, hasScope, router]);

  useEffect(() => {
    if (!requestedFlowId) return;
    setSelectedFlowId(requestedFlowId);
  }, [requestedFlowId]);

  const upsertFlowInList = useCallback((snapshot) => {
    const snapshotId = resolveEncounterId(snapshot);
    if (!snapshotId) return;
    setFlowList((previous) => {
      const index = previous.findIndex((item) => resolveEncounterId(item) === snapshotId);
      if (index < 0) {
        return [snapshot, ...previous];
      }
      const next = [...previous];
      next[index] = snapshot;
      return next;
    });
  }, []);

  const loadFlowList = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;
    const params = {
      page: 1,
      limit: 25,
      sort_by: 'started_at',
      order: 'desc',
    };

    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
      if (normalizedFacilityId) {
        params.facility_id = normalizedFacilityId;
      }
    }

    opdFlowCrud.reset();
    const result = await opdFlowCrud.list(params);
    if (!result) return;
    const items = resolveListItems(result);
    setFlowList(items);
    setPagination(result?.pagination || null);
    if (!selectedFlowId && items.length > 0) {
      setSelectedFlowId(resolveEncounterId(items[0]));
    }
  }, [
    canViewWorkbench,
    canManageAllTenants,
    isOffline,
    normalizedTenantId,
    normalizedFacilityId,
    selectedFlowId,
    opdFlowCrud,
  ]);

  const loadSelectedFlow = useCallback(async () => {
    if (!canViewWorkbench || !selectedFlowId || isOffline) return;
    const snapshot = await opdFlowCrud.get(selectedFlowId);
    if (!snapshot) return;
    setSelectedFlow(snapshot);
    upsertFlowInList(snapshot);
  }, [canViewWorkbench, isOffline, opdFlowCrud, selectedFlowId, upsertFlowInList]);

  useEffect(() => {
    loadFlowList();
  }, [loadFlowList]);

  useEffect(() => {
    loadSelectedFlow();
  }, [loadSelectedFlow]);

  const activeFlow = useMemo(() => {
    if (selectedFlow && resolveEncounterId(selectedFlow) === selectedFlowId) {
      return selectedFlow;
    }
    return flowList.find((item) => resolveEncounterId(item) === selectedFlowId) || null;
  }, [selectedFlow, selectedFlowId, flowList]);

  const activeFlowId = resolveEncounterId(activeFlow);
  const activeStage = sanitizeString(activeFlow?.flow?.stage);
  const stageAction = STAGE_ACTION_MAP[activeStage] || null;
  const isTerminalStage = TERMINAL_STAGES.has(activeStage);
  const canSubmitCurrentAction = useMemo(() => {
    if (isOffline) return false;
    if (stageAction === 'PAY_CONSULTATION') return canPayConsultation;
    if (stageAction === 'RECORD_VITALS') return canRecordVitals;
    if (stageAction === 'ASSIGN_DOCTOR') return canAssignDoctor;
    if (stageAction === 'DOCTOR_REVIEW') return canDoctorReview;
    if (stageAction === 'DISPOSITION') return canDisposition;
    return false;
  }, [
    canAssignDoctor,
    canDisposition,
    canDoctorReview,
    canPayConsultation,
    canRecordVitals,
    isOffline,
    stageAction,
  ]);

  const isAccessDenied = ACCESS_DENIED_CODES.has(opdFlowCrud.errorCode);
  const isEntitlementBlocked = ENTITLEMENT_DENIED_CODES.has(opdFlowCrud.errorCode);
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, opdFlowCrud.errorCode, 'scheduling.opdFlow.states.loadError'),
    [t, opdFlowCrud.errorCode]
  );

  const resetDrafts = useCallback(() => {
    setPaymentDraft(DEFAULT_PAYMENT_DRAFT);
    setVitalsDraft({
      vitals: [createVitalRow()],
      triage_level: '',
      triage_notes: '',
    });
    setAssignDraft(DEFAULT_ASSIGN_DRAFT);
    setReviewDraft(DEFAULT_REVIEW_DRAFT);
    setDispositionDraft(DEFAULT_DISPOSITION_DRAFT);
    setFormError('');
  }, []);

  const applySnapshot = useCallback(
    (snapshot, { pushRoute = true } = {}) => {
      const snapshotId = resolveEncounterId(snapshot);
      if (!snapshotId) return;
      setSelectedFlow(snapshot);
      setSelectedFlowId(snapshotId);
      upsertFlowInList(snapshot);
      if (pushRoute) {
        router.push(`/scheduling/opd-flows/${snapshotId}`);
      }
      resetDrafts();
      setIsStartFormOpen(false);
    },
    [router, upsertFlowInList, resetDrafts]
  );

  const handleSelectFlow = useCallback(
    (flowItem) => {
      const flowId = resolveEncounterId(flowItem);
      if (!flowId) return;
      setSelectedFlowId(flowId);
      setSelectedFlow(flowItem);
      router.push(`/scheduling/opd-flows/${flowId}`);
    },
    [router]
  );

  const handleStartDraftChange = useCallback((field, value) => {
    setStartDraft((previous) => ({ ...previous, [field]: value }));
  }, []);

  const handleStartFlow = useCallback(async () => {
    setFormError('');
    if (!canStartFlow || isOffline) return;

    const payload = {
      arrival_mode: startDraft.arrival_mode,
      provider_user_id: sanitizeString(startDraft.provider_user_id) || undefined,
      consultation_fee: sanitizeString(startDraft.consultation_fee) || undefined,
      currency: sanitizeString(startDraft.currency) || undefined,
      require_consultation_payment: Boolean(startDraft.require_consultation_payment),
      create_consultation_invoice: Boolean(startDraft.create_consultation_invoice),
      notes: sanitizeString(startDraft.notes) || undefined,
    };

    if (!canManageAllTenants && normalizedTenantId) {
      payload.tenant_id = normalizedTenantId;
    }
    if (!canManageAllTenants && normalizedFacilityId) {
      payload.facility_id = normalizedFacilityId;
    }

    const patientId = sanitizeString(startDraft.patient_id);
    const appointmentId = sanitizeString(startDraft.appointment_id);
    if (patientId) payload.patient_id = patientId;
    if (appointmentId) payload.appointment_id = appointmentId;

    if (!patientId && !appointmentId) {
      const firstName = sanitizeString(startDraft.first_name);
      const lastName = sanitizeString(startDraft.last_name);
      if (!firstName || !lastName) {
        setFormError(t('scheduling.opdFlow.validation.patientOrAppointmentRequired'));
        return;
      }
      payload.patient_registration = {
        first_name: firstName,
        last_name: lastName,
      };
    }

    if (startDraft.arrival_mode === 'ONLINE_APPOINTMENT' && !appointmentId) {
      setFormError(t('scheduling.opdFlow.validation.appointmentRequired'));
      return;
    }

    if (startDraft.arrival_mode === 'EMERGENCY') {
      payload.emergency = {
        severity: sanitizeString(startDraft.emergency_severity) || 'HIGH',
        triage_level: sanitizeString(startDraft.emergency_triage_level) || undefined,
        notes: sanitizeString(startDraft.emergency_notes) || undefined,
      };
      payload.require_consultation_payment = false;
    }

    if (startDraft.pay_now_enabled) {
      payload.pay_now = {
        method: startDraft.pay_now_method || 'CASH',
        amount: sanitizeString(startDraft.pay_now_amount) || undefined,
      };
    }

    const snapshot = await opdFlowCrud.start(payload);
    if (!snapshot) return;

    applySnapshot(snapshot);
    setStartDraft(DEFAULT_START_DRAFT);
    await loadFlowList();
  }, [
    canManageAllTenants,
    canStartFlow,
    isOffline,
    normalizedFacilityId,
    normalizedTenantId,
    startDraft,
    opdFlowCrud,
    applySnapshot,
    loadFlowList,
    t,
  ]);

  const handlePaymentDraftChange = useCallback((field, value) => {
    setPaymentDraft((previous) => ({ ...previous, [field]: value }));
  }, []);

  const handlePayConsultation = useCallback(async () => {
    setFormError('');
    if (!activeFlowId || !canPayConsultation || isOffline) return;
    const method = sanitizeString(paymentDraft.method);
    if (!method) {
      setFormError(t('scheduling.opdFlow.validation.paymentMethodRequired'));
      return;
    }
    const payload = {
      method,
      amount: sanitizeString(paymentDraft.amount) || undefined,
      currency: sanitizeString(paymentDraft.currency) || undefined,
      transaction_ref: sanitizeString(paymentDraft.transaction_ref) || undefined,
      notes: sanitizeString(paymentDraft.notes) || undefined,
    };
    const snapshot = await opdFlowCrud.payConsultation(activeFlowId, payload);
    if (!snapshot) return;
    applySnapshot(snapshot, { pushRoute: false });
    await loadFlowList();
  }, [
    activeFlowId,
    canPayConsultation,
    isOffline,
    paymentDraft,
    opdFlowCrud,
    applySnapshot,
    loadFlowList,
    t,
  ]);

  const handleVitalsFieldChange = useCallback((field, value) => {
    setVitalsDraft((previous) => ({ ...previous, [field]: value }));
  }, []);

  const handleVitalRowChange = useCallback((index, field, value) => {
    setVitalsDraft((previous) => ({
      ...previous,
      vitals: previous.vitals.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      ),
    }));
  }, []);

  const handleAddVitalRow = useCallback(() => {
    setVitalsDraft((previous) => ({
      ...previous,
      vitals: [...previous.vitals, createVitalRow()],
    }));
  }, []);

  const handleRemoveVitalRow = useCallback((index) => {
    setVitalsDraft((previous) => {
      const nextRows = previous.vitals.filter((_row, rowIndex) => rowIndex !== index);
      return {
        ...previous,
        vitals: nextRows.length > 0 ? nextRows : [createVitalRow()],
      };
    });
  }, []);

  const handleRecordVitals = useCallback(async () => {
    setFormError('');
    if (!activeFlowId || !canRecordVitals || isOffline) return;
    const vitals = vitalsDraft.vitals
      .map((row) => ({
        vital_type: sanitizeString(row.vital_type),
        value: sanitizeString(row.value),
        unit: sanitizeString(row.unit) || undefined,
      }))
      .filter((row) => row.vital_type && row.value);

    if (vitals.length === 0) {
      setFormError(t('scheduling.opdFlow.validation.vitalsRequired'));
      return;
    }

    const payload = {
      vitals,
      triage_level: sanitizeString(vitalsDraft.triage_level) || undefined,
      triage_notes: sanitizeString(vitalsDraft.triage_notes) || undefined,
    };

    const snapshot = await opdFlowCrud.recordVitals(activeFlowId, payload);
    if (!snapshot) return;
    applySnapshot(snapshot, { pushRoute: false });
    await loadFlowList();
  }, [
    activeFlowId,
    canRecordVitals,
    isOffline,
    vitalsDraft,
    opdFlowCrud,
    applySnapshot,
    loadFlowList,
    t,
  ]);

  const handleAssignDraftChange = useCallback((field, value) => {
    setAssignDraft((previous) => ({ ...previous, [field]: value }));
  }, []);

  const handleAssignDoctor = useCallback(async () => {
    setFormError('');
    if (!activeFlowId || !canAssignDoctor || isOffline) return;
    const providerUserId = sanitizeString(assignDraft.provider_user_id);
    if (!providerUserId) {
      setFormError(t('scheduling.opdFlow.validation.providerRequired'));
      return;
    }
    const snapshot = await opdFlowCrud.assignDoctor(activeFlowId, {
      provider_user_id: providerUserId,
    });
    if (!snapshot) return;
    applySnapshot(snapshot, { pushRoute: false });
    await loadFlowList();
  }, [
    activeFlowId,
    canAssignDoctor,
    isOffline,
    assignDraft.provider_user_id,
    opdFlowCrud,
    applySnapshot,
    loadFlowList,
    t,
  ]);

  const handleReviewDraftChange = useCallback((field, value) => {
    setReviewDraft((previous) => ({ ...previous, [field]: value }));
  }, []);

  const handleReviewRowChange = useCallback((section, index, field, value) => {
    setReviewDraft((previous) => ({
      ...previous,
      [section]: (previous[section] || []).map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      ),
    }));
  }, []);

  const handleAddReviewRow = useCallback((section) => {
    const rowFactoryMap = {
      diagnoses: createDiagnosisRow,
      procedures: createProcedureRow,
      lab_requests: createLabRequestRow,
      radiology_requests: createRadiologyRequestRow,
      medications: createMedicationRow,
    };
    const factory = rowFactoryMap[section];
    if (!factory) return;
    setReviewDraft((previous) => ({
      ...previous,
      [section]: [...(previous[section] || []), factory()],
    }));
  }, []);

  const handleRemoveReviewRow = useCallback((section, index) => {
    setReviewDraft((previous) => ({
      ...previous,
      [section]: (previous[section] || []).filter((_row, rowIndex) => rowIndex !== index),
    }));
  }, []);

  const handleDoctorReview = useCallback(async () => {
    setFormError('');
    if (!activeFlowId || !canDoctorReview || isOffline) return;
    const note = sanitizeString(reviewDraft.note);
    if (!note) {
      setFormError(t('scheduling.opdFlow.validation.reviewNoteRequired'));
      return;
    }

    const diagnoses = reviewDraft.diagnoses
      .map((row) => ({
        diagnosis_type: sanitizeString(row.diagnosis_type),
        code: sanitizeString(row.code) || undefined,
        description: sanitizeString(row.description),
      }))
      .filter((row) => row.diagnosis_type && row.description);

    const procedures = reviewDraft.procedures
      .map((row) => ({
        code: sanitizeString(row.code) || undefined,
        description: sanitizeString(row.description),
      }))
      .filter((row) => row.description);

    const labRequests = reviewDraft.lab_requests
      .map((row) => ({
        lab_test_id: sanitizeString(row.lab_test_id),
      }))
      .filter((row) => row.lab_test_id);

    const radiologyRequests = reviewDraft.radiology_requests
      .map((row) => ({
        radiology_test_id: sanitizeString(row.radiology_test_id) || undefined,
      }))
      .filter((row) => row.radiology_test_id);

    const medications = reviewDraft.medications
      .map((row) => ({
        drug_id: sanitizeString(row.drug_id),
        quantity: Number(row.quantity || 0),
        dosage: sanitizeString(row.dosage) || undefined,
        frequency: sanitizeString(row.frequency) || undefined,
        route: sanitizeString(row.route) || undefined,
      }))
      .filter((row) => row.drug_id && Number.isFinite(row.quantity) && row.quantity > 0);

    const payload = {
      note,
      diagnoses: diagnoses.length > 0 ? diagnoses : undefined,
      procedures: procedures.length > 0 ? procedures : undefined,
      lab_requests: labRequests.length > 0 ? labRequests : undefined,
      radiology_requests: radiologyRequests.length > 0 ? radiologyRequests : undefined,
      medications: medications.length > 0 ? medications : undefined,
      notes: sanitizeString(reviewDraft.notes) || undefined,
    };

    const snapshot = await opdFlowCrud.doctorReview(activeFlowId, payload);
    if (!snapshot) return;
    applySnapshot(snapshot, { pushRoute: false });
    await loadFlowList();
  }, [
    activeFlowId,
    canDoctorReview,
    isOffline,
    reviewDraft,
    opdFlowCrud,
    applySnapshot,
    loadFlowList,
    t,
  ]);

  const handleDispositionDraftChange = useCallback((field, value) => {
    setDispositionDraft((previous) => ({ ...previous, [field]: value }));
  }, []);

  const handleDisposition = useCallback(async () => {
    setFormError('');
    if (!activeFlowId || !canDisposition || isOffline) return;
    const decision = sanitizeString(dispositionDraft.decision);
    if (!decision) {
      setFormError(t('scheduling.opdFlow.validation.dispositionRequired'));
      return;
    }
    const payload = {
      decision,
      admission_facility_id: sanitizeString(dispositionDraft.admission_facility_id) || undefined,
      notes: sanitizeString(dispositionDraft.notes) || undefined,
    };
    const snapshot = await opdFlowCrud.disposition(activeFlowId, payload);
    if (!snapshot) return;
    applySnapshot(snapshot, { pushRoute: false });
    await loadFlowList();
  }, [
    activeFlowId,
    canDisposition,
    isOffline,
    dispositionDraft,
    opdFlowCrud,
    applySnapshot,
    loadFlowList,
    t,
  ]);

  const handleRetry = useCallback(() => {
    if (selectedFlowId) {
      loadSelectedFlow();
    }
    loadFlowList();
  }, [loadFlowList, loadSelectedFlow, selectedFlowId]);

  const handleOpenSubscriptions = useCallback(() => {
    router.push('/subscriptions/subscriptions');
  }, [router]);

  const timeline = normalizeScalarParam(activeFlow?.flow?.stage)
    ? activeFlow?.timeline || activeFlow?.flow?.timeline || []
    : [];

  const canMutate = !isOffline;

  return {
    isResolved,
    canViewWorkbench,
    canManageAllTenants,
    tenantId: normalizedTenantId || null,
    facilityId: normalizedFacilityId || null,
    isLoading: !isResolved || opdFlowCrud.isLoading,
    isOffline,
    hasError: Boolean(opdFlowCrud.errorCode),
    errorCode: opdFlowCrud.errorCode,
    errorMessage,
    isAccessDenied,
    isEntitlementBlocked,
    canStartFlow,
    canPayConsultation,
    canRecordVitals,
    canAssignDoctor,
    canDoctorReview,
    canDisposition,
    canMutate,
    canSubmitCurrentAction,
    flowList,
    pagination,
    selectedFlow,
    selectedFlowId,
    activeFlowId,
    activeStage,
    stageAction,
    isTerminalStage,
    isStartFormOpen,
    setIsStartFormOpen,
    startDraft,
    paymentDraft,
    vitalsDraft,
    assignDraft,
    reviewDraft,
    dispositionDraft,
    formError,
    timeline,
    stageLabelKey: activeStage ? `scheduling.opdFlow.stages.${activeStage}` : '',
    dispositionStages: DISPOSITION_STAGES,
    arrivalModeOptions: ARRIVAL_MODE_OPTIONS,
    emergencySeverityOptions: EMERGENCY_SEVERITY_OPTIONS,
    triageLevelOptions: TRIAGE_LEVEL_OPTIONS,
    paymentMethodOptions: PAYMENT_METHOD_OPTIONS,
    vitalTypeOptions: VITAL_TYPE_OPTIONS,
    diagnosisTypeOptions: DIAGNOSIS_TYPE_OPTIONS,
    medicationFrequencyOptions: MEDICATION_FREQUENCY_OPTIONS,
    medicationRouteOptions: MEDICATION_ROUTE_OPTIONS,
    dispositionOptions: DISPOSITION_OPTIONS,
    onRetry: handleRetry,
    onSelectFlow: handleSelectFlow,
    onOpenSubscriptions: handleOpenSubscriptions,
    onStartDraftChange: handleStartDraftChange,
    onStartFlow: handleStartFlow,
    onPaymentDraftChange: handlePaymentDraftChange,
    onPayConsultation: handlePayConsultation,
    onVitalsFieldChange: handleVitalsFieldChange,
    onVitalRowChange: handleVitalRowChange,
    onAddVitalRow: handleAddVitalRow,
    onRemoveVitalRow: handleRemoveVitalRow,
    onRecordVitals: handleRecordVitals,
    onAssignDraftChange: handleAssignDraftChange,
    onAssignDoctor: handleAssignDoctor,
    onReviewDraftChange: handleReviewDraftChange,
    onReviewRowChange: handleReviewRowChange,
    onAddReviewRow: handleAddReviewRow,
    onRemoveReviewRow: handleRemoveReviewRow,
    onDoctorReview: handleDoctorReview,
    onDispositionDraftChange: handleDispositionDraftChange,
    onDisposition: handleDisposition,
  };
};

export default useOpdFlowWorkbenchScreen;
