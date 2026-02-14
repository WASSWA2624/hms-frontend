/**
 * Clinical resource configuration shared by list/detail/form screens.
 */

const CLINICAL_RESOURCE_IDS = {
  ENCOUNTERS: 'encounters',
  CLINICAL_NOTES: 'clinical-notes',
  DIAGNOSES: 'diagnoses',
  PROCEDURES: 'procedures',
  VITAL_SIGNS: 'vital-signs',
  CARE_PLANS: 'care-plans',
  REFERRALS: 'referrals',
  FOLLOW_UPS: 'follow-ups',
  ADMISSIONS: 'admissions',
  BED_ASSIGNMENTS: 'bed-assignments',
  WARD_ROUNDS: 'ward-rounds',
  NURSING_NOTES: 'nursing-notes',
  MEDICATION_ADMINISTRATIONS: 'medication-administrations',
  DISCHARGE_SUMMARIES: 'discharge-summaries',
  TRANSFER_REQUESTS: 'transfer-requests',
  ICU_STAYS: 'icu-stays',
  ICU_OBSERVATIONS: 'icu-observations',
  CRITICAL_ALERTS: 'critical-alerts',
  THEATRE_CASES: 'theatre-cases',
  ANESTHESIA_RECORDS: 'anesthesia-records',
  POST_OP_NOTES: 'post-op-notes',
  EMERGENCY_CASES: 'emergency-cases',
  TRIAGE_ASSESSMENTS: 'triage-assessments',
  EMERGENCY_RESPONSES: 'emergency-responses',
  AMBULANCES: 'ambulances',
  AMBULANCE_DISPATCHES: 'ambulance-dispatches',
  AMBULANCE_TRIPS: 'ambulance-trips',
  LAB_TESTS: 'lab-tests',
  LAB_PANELS: 'lab-panels',
  LAB_ORDERS: 'lab-orders',
  LAB_SAMPLES: 'lab-samples',
  LAB_RESULTS: 'lab-results',
  LAB_QC_LOGS: 'lab-qc-logs',
  RADIOLOGY_TESTS: 'radiology-tests',
  RADIOLOGY_ORDERS: 'radiology-orders',
  RADIOLOGY_RESULTS: 'radiology-results',
  IMAGING_STUDIES: 'imaging-studies',
  PACS_LINKS: 'pacs-links',
};

const CLINICAL_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.ENCOUNTERS,
  CLINICAL_RESOURCE_IDS.CLINICAL_NOTES,
  CLINICAL_RESOURCE_IDS.DIAGNOSES,
  CLINICAL_RESOURCE_IDS.PROCEDURES,
  CLINICAL_RESOURCE_IDS.VITAL_SIGNS,
  CLINICAL_RESOURCE_IDS.CARE_PLANS,
  CLINICAL_RESOURCE_IDS.REFERRALS,
  CLINICAL_RESOURCE_IDS.FOLLOW_UPS,
];

const IPD_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.ADMISSIONS,
  CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS,
  CLINICAL_RESOURCE_IDS.WARD_ROUNDS,
  CLINICAL_RESOURCE_IDS.NURSING_NOTES,
  CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS,
  CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES,
  CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS,
];

const ICU_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.ICU_STAYS,
  CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS,
  CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS,
];

const THEATRE_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.THEATRE_CASES,
  CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS,
  CLINICAL_RESOURCE_IDS.POST_OP_NOTES,
];

const EMERGENCY_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.EMERGENCY_CASES,
  CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS,
  CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES,
  CLINICAL_RESOURCE_IDS.AMBULANCES,
  CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES,
  CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS,
];

const LAB_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.LAB_TESTS,
  CLINICAL_RESOURCE_IDS.LAB_PANELS,
  CLINICAL_RESOURCE_IDS.LAB_ORDERS,
  CLINICAL_RESOURCE_IDS.LAB_SAMPLES,
  CLINICAL_RESOURCE_IDS.LAB_RESULTS,
  CLINICAL_RESOURCE_IDS.LAB_QC_LOGS,
];

const RADIOLOGY_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS,
  CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS,
  CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS,
  CLINICAL_RESOURCE_IDS.IMAGING_STUDIES,
  CLINICAL_RESOURCE_IDS.PACS_LINKS,
];

const CLINICAL_ROUTE_ROOT = '/clinical';
const IPD_ROUTE_ROOT = '/ipd';
const ICU_ROUTE_ROOT = '/icu';
const THEATRE_ROUTE_ROOT = '/theatre';
const EMERGENCY_ROUTE_ROOT = '/emergency';
const LAB_ROUTE_ROOT = '/diagnostics/lab';
const RADIOLOGY_ROUTE_ROOT = '/diagnostics/radiology';
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const sanitizeString = (value) => (value == null ? '' : String(value).trim());

const normalizeRouteId = (value) => {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = sanitizeString(candidate);
  if (!normalized) return null;
  return /^[A-Za-z0-9._:-]+$/.test(normalized) ? normalized : null;
};

const normalizeSearchParam = (value) => {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = sanitizeString(candidate);
  return normalized || null;
};

const normalizeContextId = (value) => normalizeRouteId(value);

const toIsoDateTime = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return undefined;
  if (DATE_ONLY_REGEX.test(normalized)) {
    return `${normalized}T00:00:00.000Z`;
  }
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

const normalizeIsoDateValue = (value) => {
  const isoValue = toIsoDateTime(value);
  return isoValue || undefined;
};

const withClinicalContext = (path, context = {}) => {
  const searchParams = new URLSearchParams();
  const tenantId = normalizeContextId(context.tenantId);
  const facilityId = normalizeContextId(context.facilityId);
  const patientId = normalizeContextId(context.patientId);
  const providerUserId = normalizeContextId(context.providerUserId);
  const encounterId = normalizeContextId(context.encounterId);
  const authorUserId = normalizeContextId(context.authorUserId);
  const fromDepartmentId = normalizeContextId(context.fromDepartmentId);
  const toDepartmentId = normalizeContextId(context.toDepartmentId);
  const encounterType = sanitizeString(context.encounterType);
  const status = sanitizeString(context.status);
  const diagnosisType = sanitizeString(context.diagnosisType);
  const code = sanitizeString(context.code);
  const vitalType = sanitizeString(context.vitalType);
  const startDate = normalizeIsoDateValue(context.startDate);
  const endDate = normalizeIsoDateValue(context.endDate);
  const admissionId = normalizeContextId(context.admissionId);
  const bedId = normalizeContextId(context.bedId);
  const nurseUserId = normalizeContextId(context.nurseUserId);
  const prescriptionId = normalizeContextId(context.prescriptionId);
  const fromWardId = normalizeContextId(context.fromWardId);
  const toWardId = normalizeContextId(context.toWardId);
  const icuStayId = normalizeContextId(context.icuStayId);
  const theatreCaseId = normalizeContextId(context.theatreCaseId);
  const anesthetistUserId = normalizeContextId(context.anesthetistUserId);
  const emergencyCaseId = normalizeContextId(context.emergencyCaseId);
  const ambulanceId = normalizeContextId(context.ambulanceId);
  const labTestId = normalizeContextId(context.labTestId);
  const labPanelId = normalizeContextId(context.labPanelId);
  const labOrderId = normalizeContextId(context.labOrderId);
  const labOrderItemId = normalizeContextId(context.labOrderItemId);
  const radiologyTestId = normalizeContextId(context.radiologyTestId);
  const radiologyOrderId = normalizeContextId(context.radiologyOrderId);
  const imagingStudyId = normalizeContextId(context.imagingStudyId);
  const severity = sanitizeString(context.severity);
  const triageLevel = sanitizeString(context.triageLevel);
  const modality = sanitizeString(context.modality);
  const route = sanitizeString(context.route);
  const search = sanitizeString(context.search);
  const orderedAtFrom = normalizeIsoDateValue(context.orderedAtFrom);
  const orderedAtTo = normalizeIsoDateValue(context.orderedAtTo);
  const performedAt = normalizeIsoDateValue(context.performedAt);
  const expiresAt = normalizeIsoDateValue(context.expiresAt);
  const startedAtFrom = normalizeIsoDateValue(context.startedAtFrom);
  const startedAtTo = normalizeIsoDateValue(context.startedAtTo);
  const endedAtFrom = normalizeIsoDateValue(context.endedAtFrom);
  const endedAtTo = normalizeIsoDateValue(context.endedAtTo);
  const observedAtFrom = normalizeIsoDateValue(context.observedAtFrom);
  const observedAtTo = normalizeIsoDateValue(context.observedAtTo);
  const scheduledFrom = normalizeIsoDateValue(context.scheduledFrom);
  const scheduledTo = normalizeIsoDateValue(context.scheduledTo);
  const isActive = context.isActive;

  if (tenantId) searchParams.set('tenantId', tenantId);
  if (facilityId) searchParams.set('facilityId', facilityId);
  if (patientId) searchParams.set('patientId', patientId);
  if (providerUserId) searchParams.set('providerUserId', providerUserId);
  if (encounterId) searchParams.set('encounterId', encounterId);
  if (authorUserId) searchParams.set('authorUserId', authorUserId);
  if (fromDepartmentId) searchParams.set('fromDepartmentId', fromDepartmentId);
  if (toDepartmentId) searchParams.set('toDepartmentId', toDepartmentId);
  if (encounterType) searchParams.set('encounterType', encounterType);
  if (status) searchParams.set('status', status);
  if (diagnosisType) searchParams.set('diagnosisType', diagnosisType);
  if (code) searchParams.set('code', code);
  if (vitalType) searchParams.set('vitalType', vitalType);
  if (startDate) searchParams.set('startDate', startDate);
  if (endDate) searchParams.set('endDate', endDate);
  if (admissionId) searchParams.set('admissionId', admissionId);
  if (bedId) searchParams.set('bedId', bedId);
  if (nurseUserId) searchParams.set('nurseUserId', nurseUserId);
  if (prescriptionId) searchParams.set('prescriptionId', prescriptionId);
  if (fromWardId) searchParams.set('fromWardId', fromWardId);
  if (toWardId) searchParams.set('toWardId', toWardId);
  if (icuStayId) searchParams.set('icuStayId', icuStayId);
  if (theatreCaseId) searchParams.set('theatreCaseId', theatreCaseId);
  if (anesthetistUserId) searchParams.set('anesthetistUserId', anesthetistUserId);
  if (emergencyCaseId) searchParams.set('emergencyCaseId', emergencyCaseId);
  if (ambulanceId) searchParams.set('ambulanceId', ambulanceId);
  if (labTestId) searchParams.set('labTestId', labTestId);
  if (labPanelId) searchParams.set('labPanelId', labPanelId);
  if (labOrderId) searchParams.set('labOrderId', labOrderId);
  if (labOrderItemId) searchParams.set('labOrderItemId', labOrderItemId);
  if (radiologyTestId) searchParams.set('radiologyTestId', radiologyTestId);
  if (radiologyOrderId) searchParams.set('radiologyOrderId', radiologyOrderId);
  if (imagingStudyId) searchParams.set('imagingStudyId', imagingStudyId);
  if (severity) searchParams.set('severity', severity);
  if (triageLevel) searchParams.set('triageLevel', triageLevel);
  if (modality) searchParams.set('modality', modality);
  if (route) searchParams.set('route', route);
  if (search) searchParams.set('search', search);
  if (orderedAtFrom) searchParams.set('orderedAtFrom', orderedAtFrom);
  if (orderedAtTo) searchParams.set('orderedAtTo', orderedAtTo);
  if (performedAt) searchParams.set('performedAt', performedAt);
  if (expiresAt) searchParams.set('expiresAt', expiresAt);
  if (startedAtFrom) searchParams.set('startedAtFrom', startedAtFrom);
  if (startedAtTo) searchParams.set('startedAtTo', startedAtTo);
  if (endedAtFrom) searchParams.set('endedAtFrom', endedAtFrom);
  if (endedAtTo) searchParams.set('endedAtTo', endedAtTo);
  if (observedAtFrom) searchParams.set('observedAtFrom', observedAtFrom);
  if (observedAtTo) searchParams.set('observedAtTo', observedAtTo);
  if (scheduledFrom) searchParams.set('scheduledFrom', scheduledFrom);
  if (scheduledTo) searchParams.set('scheduledTo', scheduledTo);
  if (typeof isActive === 'boolean') {
    searchParams.set('isActive', isActive ? 'true' : 'false');
  }
  if (sanitizeString(isActive) === 'true' || sanitizeString(isActive) === 'false') {
    searchParams.set('isActive', sanitizeString(isActive));
  }

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
};

const ENCOUNTER_TYPE_OPTIONS = [
  { value: 'OPD', labelKey: 'clinical.options.encounterType.opd' },
  { value: 'IPD', labelKey: 'clinical.options.encounterType.ipd' },
  { value: 'ICU', labelKey: 'clinical.options.encounterType.icu' },
  { value: 'THEATRE', labelKey: 'clinical.options.encounterType.theatre' },
  { value: 'EMERGENCY', labelKey: 'clinical.options.encounterType.emergency' },
  { value: 'TELEMEDICINE', labelKey: 'clinical.options.encounterType.telemedicine' },
];

const ENCOUNTER_STATUS_OPTIONS = [
  { value: 'OPEN', labelKey: 'clinical.options.encounterStatus.open' },
  { value: 'CLOSED', labelKey: 'clinical.options.encounterStatus.closed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.encounterStatus.cancelled' },
];

const DIAGNOSIS_TYPE_OPTIONS = [
  { value: 'PRIMARY', labelKey: 'clinical.options.diagnosisType.primary' },
  { value: 'SECONDARY', labelKey: 'clinical.options.diagnosisType.secondary' },
  { value: 'DIFFERENTIAL', labelKey: 'clinical.options.diagnosisType.differential' },
];

const VITAL_TYPE_OPTIONS = [
  { value: 'TEMPERATURE', labelKey: 'clinical.options.vitalType.temperature' },
  { value: 'BLOOD_PRESSURE', labelKey: 'clinical.options.vitalType.bloodPressure' },
  { value: 'HEART_RATE', labelKey: 'clinical.options.vitalType.heartRate' },
  { value: 'RESPIRATORY_RATE', labelKey: 'clinical.options.vitalType.respiratoryRate' },
  { value: 'OXYGEN_SATURATION', labelKey: 'clinical.options.vitalType.oxygenSaturation' },
  { value: 'WEIGHT', labelKey: 'clinical.options.vitalType.weight' },
  { value: 'HEIGHT', labelKey: 'clinical.options.vitalType.height' },
  { value: 'BMI', labelKey: 'clinical.options.vitalType.bmi' },
];

const REFERRAL_CREATE_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.referralStatus.pending' },
  { value: 'APPROVED', labelKey: 'clinical.options.referralStatus.approved' },
  { value: 'REJECTED', labelKey: 'clinical.options.referralStatus.rejected' },
  { value: 'COMPLETED', labelKey: 'clinical.options.referralStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.referralStatus.cancelled' },
];

const REFERRAL_UPDATE_STATUS_OPTIONS = [
  { value: 'REQUESTED', labelKey: 'clinical.options.referralStatus.requested' },
  { value: 'APPROVED', labelKey: 'clinical.options.referralStatus.approved' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.referralStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.referralStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.referralStatus.cancelled' },
];

const ADMISSION_STATUS_OPTIONS = [
  { value: 'ADMITTED', labelKey: 'clinical.options.admissionStatus.admitted' },
  { value: 'DISCHARGED', labelKey: 'clinical.options.admissionStatus.discharged' },
  { value: 'TRANSFERRED', labelKey: 'clinical.options.admissionStatus.transferred' },
  { value: 'CANCELLED', labelKey: 'clinical.options.admissionStatus.cancelled' },
];

const DISCHARGE_STATUS_OPTIONS = [
  { value: 'PLANNED', labelKey: 'clinical.options.dischargeStatus.planned' },
  { value: 'COMPLETED', labelKey: 'clinical.options.dischargeStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.dischargeStatus.cancelled' },
];

const TRANSFER_STATUS_OPTIONS = [
  { value: 'REQUESTED', labelKey: 'clinical.options.transferStatus.requested' },
  { value: 'APPROVED', labelKey: 'clinical.options.transferStatus.approved' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.transferStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.transferStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.transferStatus.cancelled' },
];

const MEDICATION_ROUTE_OPTIONS = [
  { value: 'ORAL', labelKey: 'clinical.options.medicationRoute.oral' },
  { value: 'IV', labelKey: 'clinical.options.medicationRoute.iv' },
  { value: 'IM', labelKey: 'clinical.options.medicationRoute.im' },
  { value: 'SC', labelKey: 'clinical.options.medicationRoute.sc' },
  { value: 'TOPICAL', labelKey: 'clinical.options.medicationRoute.topical' },
  { value: 'INHALATION', labelKey: 'clinical.options.medicationRoute.inhalation' },
  { value: 'RECTAL', labelKey: 'clinical.options.medicationRoute.rectal' },
  { value: 'OTHER', labelKey: 'clinical.options.medicationRoute.other' },
];

const CRITICAL_ALERT_SEVERITY_OPTIONS = [
  { value: 'LOW', labelKey: 'clinical.options.criticalAlertSeverity.low' },
  { value: 'MEDIUM', labelKey: 'clinical.options.criticalAlertSeverity.medium' },
  { value: 'HIGH', labelKey: 'clinical.options.criticalAlertSeverity.high' },
  { value: 'CRITICAL', labelKey: 'clinical.options.criticalAlertSeverity.critical' },
];

const THEATRE_CASE_STATUS_OPTIONS = [
  { value: 'SCHEDULED', labelKey: 'clinical.options.theatreCaseStatus.scheduled' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.theatreCaseStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.theatreCaseStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.theatreCaseStatus.cancelled' },
];

const EMERGENCY_CASE_SEVERITY_OPTIONS = [
  { value: 'LOW', labelKey: 'clinical.options.emergencySeverity.low' },
  { value: 'MEDIUM', labelKey: 'clinical.options.emergencySeverity.medium' },
  { value: 'HIGH', labelKey: 'clinical.options.emergencySeverity.high' },
  { value: 'CRITICAL', labelKey: 'clinical.options.emergencySeverity.critical' },
];

const EMERGENCY_CASE_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.emergencyStatus.pending' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.emergencyStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.emergencyStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.emergencyStatus.cancelled' },
];

const TRIAGE_LEVEL_OPTIONS = [
  { value: 'IMMEDIATE', labelKey: 'clinical.options.triageLevel.immediate' },
  { value: 'URGENT', labelKey: 'clinical.options.triageLevel.urgent' },
  { value: 'LESS_URGENT', labelKey: 'clinical.options.triageLevel.lessUrgent' },
  { value: 'NON_URGENT', labelKey: 'clinical.options.triageLevel.nonUrgent' },
];

const AMBULANCE_STATUS_OPTIONS = [
  { value: 'AVAILABLE', labelKey: 'clinical.options.ambulanceStatus.available' },
  { value: 'DISPATCHED', labelKey: 'clinical.options.ambulanceStatus.dispatched' },
  { value: 'EN_ROUTE', labelKey: 'clinical.options.ambulanceStatus.enRoute' },
  { value: 'ON_SCENE', labelKey: 'clinical.options.ambulanceStatus.onScene' },
  { value: 'TRANSPORTING', labelKey: 'clinical.options.ambulanceStatus.transporting' },
  { value: 'OUT_OF_SERVICE', labelKey: 'clinical.options.ambulanceStatus.outOfService' },
];

const LAB_ORDER_STATUS_OPTIONS = [
  { value: 'ORDERED', labelKey: 'clinical.options.labOrderStatus.ordered' },
  { value: 'COLLECTED', labelKey: 'clinical.options.labOrderStatus.collected' },
  { value: 'IN_PROCESS', labelKey: 'clinical.options.labOrderStatus.inProcess' },
  { value: 'COMPLETED', labelKey: 'clinical.options.labOrderStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.labOrderStatus.cancelled' },
];

const LAB_SAMPLE_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.labSampleStatus.pending' },
  { value: 'COLLECTED', labelKey: 'clinical.options.labSampleStatus.collected' },
  { value: 'REJECTED', labelKey: 'clinical.options.labSampleStatus.rejected' },
  { value: 'RECEIVED', labelKey: 'clinical.options.labSampleStatus.received' },
];

const LAB_RESULT_STATUS_OPTIONS = [
  { value: 'NORMAL', labelKey: 'clinical.options.labResultStatus.normal' },
  { value: 'ABNORMAL', labelKey: 'clinical.options.labResultStatus.abnormal' },
  { value: 'CRITICAL', labelKey: 'clinical.options.labResultStatus.critical' },
  { value: 'PENDING', labelKey: 'clinical.options.labResultStatus.pending' },
];

const RADIOLOGY_MODALITY_OPTIONS = [
  { value: 'XRAY', labelKey: 'clinical.options.radiologyModality.xray' },
  { value: 'CT', labelKey: 'clinical.options.radiologyModality.ct' },
  { value: 'MRI', labelKey: 'clinical.options.radiologyModality.mri' },
  { value: 'ULTRASOUND', labelKey: 'clinical.options.radiologyModality.ultrasound' },
  { value: 'PET', labelKey: 'clinical.options.radiologyModality.pet' },
  { value: 'OTHER', labelKey: 'clinical.options.radiologyModality.other' },
];

const RADIOLOGY_ORDER_STATUS_OPTIONS = [
  { value: 'ORDERED', labelKey: 'clinical.options.radiologyOrderStatus.ordered' },
  { value: 'IN_PROCESS', labelKey: 'clinical.options.radiologyOrderStatus.inProcess' },
  { value: 'COMPLETED', labelKey: 'clinical.options.radiologyOrderStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.radiologyOrderStatus.cancelled' },
];

const RADIOLOGY_RESULT_STATUS_OPTIONS = [
  { value: 'DRAFT', labelKey: 'clinical.options.radiologyResultStatus.draft' },
  { value: 'FINAL', labelKey: 'clinical.options.radiologyResultStatus.final' },
  { value: 'AMENDED', labelKey: 'clinical.options.radiologyResultStatus.amended' },
];

const buildDateTimeError = (value, t) => {
  if (!sanitizeString(value)) return null;
  if (toIsoDateTime(value)) return null;
  return t('clinical.common.form.dateTimeFormat');
};

const buildUrlError = (value, t) => {
  const normalized = sanitizeString(value);
  if (!normalized) return null;
  if (typeof URL === 'function') {
    try {
      const parsed = new URL(normalized);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
        ? null
        : t('forms.validation.invalidUrl');
    } catch {
      return t('forms.validation.invalidUrl');
    }
  }
  return /^https?:\/\/\S+$/i.test(normalized) ? null : t('forms.validation.invalidUrl');
};

const validateDateOrder = (startValue, endValue, t, { allowEqual = false } = {}) => {
  const startIso = toIsoDateTime(startValue);
  const endIso = toIsoDateTime(endValue);
  if (!startIso || !endIso) return null;
  const startTime = new Date(startIso).getTime();
  const endTime = new Date(endIso).getTime();
  if (allowEqual ? startTime <= endTime : startTime < endTime) return null;
  return allowEqual
    ? t('clinical.common.form.endOnOrAfterStart')
    : t('clinical.common.form.endAfterStart');
};

const getContextFilters = (resourceId, context) => {
  const tenantId = normalizeContextId(context?.tenantId);
  const facilityId = normalizeContextId(context?.facilityId);
  const patientId = normalizeContextId(context?.patientId);
  const providerUserId = normalizeContextId(context?.providerUserId);
  const encounterId = normalizeContextId(context?.encounterId);
  const authorUserId = normalizeContextId(context?.authorUserId);
  const fromDepartmentId = normalizeContextId(context?.fromDepartmentId);
  const toDepartmentId = normalizeContextId(context?.toDepartmentId);
  const encounterType = sanitizeString(context?.encounterType);
  const status = sanitizeString(context?.status);
  const diagnosisType = sanitizeString(context?.diagnosisType);
  const code = sanitizeString(context?.code);
  const vitalType = sanitizeString(context?.vitalType);
  const startDate = normalizeIsoDateValue(context?.startDate);
  const endDate = normalizeIsoDateValue(context?.endDate);
  const admissionId = normalizeContextId(context?.admissionId);
  const bedId = normalizeContextId(context?.bedId);
  const nurseUserId = normalizeContextId(context?.nurseUserId);
  const prescriptionId = normalizeContextId(context?.prescriptionId);
  const fromWardId = normalizeContextId(context?.fromWardId);
  const toWardId = normalizeContextId(context?.toWardId);
  const icuStayId = normalizeContextId(context?.icuStayId);
  const theatreCaseId = normalizeContextId(context?.theatreCaseId);
  const anesthetistUserId = normalizeContextId(context?.anesthetistUserId);
  const emergencyCaseId = normalizeContextId(context?.emergencyCaseId);
  const ambulanceId = normalizeContextId(context?.ambulanceId);
  const labTestId = normalizeContextId(context?.labTestId);
  const labOrderId = normalizeContextId(context?.labOrderId);
  const labOrderItemId = normalizeContextId(context?.labOrderItemId);
  const radiologyTestId = normalizeContextId(context?.radiologyTestId);
  const radiologyOrderId = normalizeContextId(context?.radiologyOrderId);
  const imagingStudyId = normalizeContextId(context?.imagingStudyId);
  const severity = sanitizeString(context?.severity);
  const triageLevel = sanitizeString(context?.triageLevel);
  const modality = sanitizeString(context?.modality);
  const route = sanitizeString(context?.route);
  const search = sanitizeString(context?.search);
  const orderedAtFrom = normalizeIsoDateValue(context?.orderedAtFrom);
  const orderedAtTo = normalizeIsoDateValue(context?.orderedAtTo);
  const performedAt = normalizeIsoDateValue(context?.performedAt);
  const expiresAt = normalizeIsoDateValue(context?.expiresAt);
  const startedAtFrom = normalizeIsoDateValue(context?.startedAtFrom);
  const startedAtTo = normalizeIsoDateValue(context?.startedAtTo);
  const endedAtFrom = normalizeIsoDateValue(context?.endedAtFrom);
  const endedAtTo = normalizeIsoDateValue(context?.endedAtTo);
  const observedAtFrom = normalizeIsoDateValue(context?.observedAtFrom);
  const observedAtTo = normalizeIsoDateValue(context?.observedAtTo);
  const scheduledFrom = normalizeIsoDateValue(context?.scheduledFrom);
  const scheduledTo = normalizeIsoDateValue(context?.scheduledTo);
  const isActiveRaw = context?.isActive;
  const isActive =
    typeof isActiveRaw === 'boolean'
      ? isActiveRaw
      : sanitizeString(isActiveRaw) === 'true'
        ? true
        : sanitizeString(isActiveRaw) === 'false'
          ? false
          : undefined;

  if (resourceId === CLINICAL_RESOURCE_IDS.ENCOUNTERS) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      patient_id: patientId || undefined,
      provider_user_id: providerUserId || undefined,
      encounter_type: encounterType || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CLINICAL_NOTES) {
    return {
      encounter_id: encounterId || undefined,
      author_user_id: authorUserId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DIAGNOSES) {
    return {
      encounter_id: encounterId || undefined,
      diagnosis_type: diagnosisType || undefined,
      code: code || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PROCEDURES) {
    return {
      encounter_id: encounterId || undefined,
      code: code || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.VITAL_SIGNS) {
    return {
      encounter_id: encounterId || undefined,
      vital_type: vitalType || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CARE_PLANS) {
    return {
      encounter_id: encounterId || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.REFERRALS) {
    return {
      encounter_id: encounterId || undefined,
      from_department_id: fromDepartmentId || undefined,
      to_department_id: toDepartmentId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.FOLLOW_UPS) {
    return {
      encounter_id: encounterId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ADMISSIONS) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      patient_id: patientId || undefined,
      encounter_id: encounterId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS) {
    return {
      admission_id: admissionId || undefined,
      bed_id: bedId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.WARD_ROUNDS) {
    return {
      admission_id: admissionId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.NURSING_NOTES) {
    return {
      admission_id: admissionId || undefined,
      nurse_user_id: nurseUserId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS) {
    return {
      admission_id: admissionId || undefined,
      prescription_id: prescriptionId || undefined,
      route: route || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES) {
    return {
      admission_id: admissionId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS) {
    return {
      admission_id: admissionId || undefined,
      from_ward_id: fromWardId || undefined,
      to_ward_id: toWardId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ICU_STAYS) {
    return {
      admission_id: admissionId || undefined,
      started_at_from: startedAtFrom || undefined,
      started_at_to: startedAtTo || undefined,
      ended_at_from: endedAtFrom || undefined,
      ended_at_to: endedAtTo || undefined,
      is_active: typeof isActive === 'boolean' ? isActive : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS) {
    return {
      icu_stay_id: icuStayId || undefined,
      observed_at_from: observedAtFrom || undefined,
      observed_at_to: observedAtTo || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS) {
    return {
      icu_stay_id: icuStayId || undefined,
      severity: severity || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.THEATRE_CASES) {
    return {
      encounter_id: encounterId || undefined,
      status: status || undefined,
      scheduled_from: scheduledFrom || undefined,
      scheduled_to: scheduledTo || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS) {
    return {
      theatre_case_id: theatreCaseId || undefined,
      anesthetist_user_id: anesthetistUserId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.POST_OP_NOTES) {
    return {
      theatre_case_id: theatreCaseId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.EMERGENCY_CASES) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      patient_id: patientId || undefined,
      severity: severity || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS) {
    return {
      emergency_case_id: emergencyCaseId || undefined,
      triage_level: triageLevel || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES) {
    return {
      emergency_case_id: emergencyCaseId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCES) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES) {
    return {
      ambulance_id: ambulanceId || undefined,
      emergency_case_id: emergencyCaseId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS) {
    return {
      ambulance_id: ambulanceId || undefined,
      emergency_case_id: emergencyCaseId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_TESTS) {
    return {
      tenant_id: tenantId || undefined,
      name: sanitizeString(context?.name) || undefined,
      code: code || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_PANELS) {
    return {
      tenant_id: tenantId || undefined,
      name: sanitizeString(context?.name) || undefined,
      code: code || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_ORDERS) {
    const hasValidOrderedRange =
      !orderedAtFrom ||
      !orderedAtTo ||
      new Date(orderedAtFrom).getTime() <= new Date(orderedAtTo).getTime();

    return {
      encounter_id: encounterId || undefined,
      patient_id: patientId || undefined,
      status: status || undefined,
      ordered_at_from: orderedAtFrom || undefined,
      ordered_at_to: hasValidOrderedRange ? orderedAtTo || undefined : undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_SAMPLES) {
    return {
      lab_order_id: labOrderId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_RESULTS) {
    return {
      lab_order_item_id: labOrderItemId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_QC_LOGS) {
    return {
      lab_test_id: labTestId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS) {
    return {
      tenant_id: tenantId || undefined,
      name: sanitizeString(context?.name) || undefined,
      code: code || undefined,
      modality: modality || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS) {
    return {
      encounter_id: encounterId || undefined,
      patient_id: patientId || undefined,
      radiology_test_id: radiologyTestId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS) {
    return {
      radiology_order_id: radiologyOrderId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.IMAGING_STUDIES) {
    return {
      radiology_order_id: radiologyOrderId || undefined,
      modality: modality || undefined,
      performed_at: performedAt || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PACS_LINKS) {
    return {
      imaging_study_id: imagingStudyId || undefined,
      expires_at: expiresAt || undefined,
    };
  }

  return {};
};

const resourceConfigs = {
  [CLINICAL_RESOURCE_IDS.ENCOUNTERS]: {
    id: CLINICAL_RESOURCE_IDS.ENCOUNTERS,
    routePath: `${CLINICAL_ROUTE_ROOT}/encounters`,
    i18nKey: 'clinical.resources.encounters',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.encounters.form.patientIdLabel',
        placeholderKey: 'clinical.resources.encounters.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.encounters.form.patientIdHint',
      },
      {
        name: 'provider_user_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.providerUserIdLabel',
        placeholderKey: 'clinical.resources.encounters.form.providerUserIdPlaceholder',
        hintKey: 'clinical.resources.encounters.form.providerUserIdHint',
      },
      {
        name: 'encounter_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.encounters.form.encounterTypeLabel',
        placeholderKey: 'clinical.resources.encounters.form.encounterTypePlaceholder',
        hintKey: 'clinical.resources.encounters.form.encounterTypeHint',
        options: ENCOUNTER_TYPE_OPTIONS,
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.encounters.form.statusLabel',
        placeholderKey: 'clinical.resources.encounters.form.statusPlaceholder',
        hintKey: 'clinical.resources.encounters.form.statusHint',
        options: ENCOUNTER_STATUS_OPTIONS,
      },
      {
        name: 'started_at',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.startedAtLabel',
        placeholderKey: 'clinical.resources.encounters.form.startedAtPlaceholder',
        hintKey: 'clinical.resources.encounters.form.startedAtHint',
      },
      {
        name: 'ended_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.endedAtLabel',
        placeholderKey: 'clinical.resources.encounters.form.endedAtPlaceholder',
        hintKey: 'clinical.resources.encounters.form.endedAtHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.encounters.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.encounters.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      const encounterType = sanitizeString(item?.encounter_type);
      if (status && encounterType) {
        return `${t('clinical.resources.encounters.detail.statusLabel')}: ${status} - ${encounterType}`;
      }
      if (status) return `${t('clinical.resources.encounters.detail.statusLabel')}: ${status}`;
      return encounterType;
    },
    getInitialValues: (record, context) => ({
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      provider_user_id: sanitizeString(record?.provider_user_id || context?.providerUserId),
      encounter_type: sanitizeString(record?.encounter_type || context?.encounterType || 'OPD'),
      status: sanitizeString(record?.status || context?.status || 'OPEN'),
      started_at: sanitizeString(record?.started_at),
      ended_at: sanitizeString(record?.ended_at),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const endedAtRaw = sanitizeString(values.ended_at);
      const payload = {
        provider_user_id: sanitizeString(values.provider_user_id) || undefined,
        encounter_type: sanitizeString(values.encounter_type),
        status: sanitizeString(values.status),
        started_at: toIsoDateTime(values.started_at),
        ended_at: endedAtRaw ? toIsoDateTime(endedAtRaw) : isEdit ? null : undefined,
        facility_id: sanitizeString(values.facility_id) || undefined,
      };

      if (!isEdit) {
        payload.patient_id = sanitizeString(values.patient_id);
      }

      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const startedAtError = buildDateTimeError(values.started_at, t);
      const endedAtError = buildDateTimeError(values.ended_at, t);
      if (startedAtError) errors.started_at = startedAtError;
      if (endedAtError) errors.ended_at = endedAtError;
      if (!endedAtError) {
        const orderError = validateDateOrder(values.started_at, values.ended_at, t, { allowEqual: false });
        if (orderError) errors.ended_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.encounters.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.encounters.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.encounters.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.encounters.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.encounters.detail.providerLabel', valueKey: 'provider_user_id' },
      { labelKey: 'clinical.resources.encounters.detail.encounterTypeLabel', valueKey: 'encounter_type' },
      { labelKey: 'clinical.resources.encounters.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.encounters.detail.startedAtLabel', valueKey: 'started_at', type: 'datetime' },
      { labelKey: 'clinical.resources.encounters.detail.endedAtLabel', valueKey: 'ended_at', type: 'datetime' },
      { labelKey: 'clinical.resources.encounters.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.encounters.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.CLINICAL_NOTES]: {
    id: CLINICAL_RESOURCE_IDS.CLINICAL_NOTES,
    routePath: `${CLINICAL_ROUTE_ROOT}/clinical-notes`,
    i18nKey: 'clinical.resources.clinicalNotes',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.clinicalNotes.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.clinicalNotes.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.clinicalNotes.form.encounterIdHint',
      },
      {
        name: 'author_user_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.clinicalNotes.form.authorUserIdLabel',
        placeholderKey: 'clinical.resources.clinicalNotes.form.authorUserIdPlaceholder',
        hintKey: 'clinical.resources.clinicalNotes.form.authorUserIdHint',
      },
      {
        name: 'note',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.clinicalNotes.form.noteLabel',
        placeholderKey: 'clinical.resources.clinicalNotes.form.notePlaceholder',
        hintKey: 'clinical.resources.clinicalNotes.form.noteHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.note) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const authorUserId = sanitizeString(item?.author_user_id);
      if (!authorUserId) return '';
      return `${t('clinical.resources.clinicalNotes.detail.authorLabel')}: ${authorUserId}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      author_user_id: sanitizeString(record?.author_user_id || context?.authorUserId || context?.providerUserId),
      note: sanitizeString(record?.note),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        note: sanitizeString(values.note),
      };
      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
        payload.author_user_id = sanitizeString(values.author_user_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.clinicalNotes.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.authorLabel', valueKey: 'author_user_id' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.noteLabel', valueKey: 'note' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.DIAGNOSES]: {
    id: CLINICAL_RESOURCE_IDS.DIAGNOSES,
    routePath: `${CLINICAL_ROUTE_ROOT}/diagnoses`,
    i18nKey: 'clinical.resources.diagnoses',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.diagnoses.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.encounterIdHint',
      },
      {
        name: 'diagnosis_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.diagnoses.form.diagnosisTypeLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.diagnosisTypePlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.diagnosisTypeHint',
        options: DIAGNOSIS_TYPE_OPTIONS,
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.diagnoses.form.codeLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.codePlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.codeHint',
      },
      {
        name: 'description',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.diagnoses.form.descriptionLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.descriptionPlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.descriptionHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.description) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const diagnosisType = sanitizeString(item?.diagnosis_type);
      if (!diagnosisType) return '';
      return `${t('clinical.resources.diagnoses.detail.diagnosisTypeLabel')}: ${diagnosisType}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      diagnosis_type: sanitizeString(record?.diagnosis_type || context?.diagnosisType || 'PRIMARY'),
      code: sanitizeString(record?.code || context?.code),
      description: sanitizeString(record?.description),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        diagnosis_type: sanitizeString(values.diagnosis_type),
        code: sanitizeString(values.code) || undefined,
        description: sanitizeString(values.description),
      };
      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.diagnoses.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.diagnoses.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.diagnoses.detail.diagnosisTypeLabel', valueKey: 'diagnosis_type' },
      { labelKey: 'clinical.resources.diagnoses.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.diagnoses.detail.descriptionLabel', valueKey: 'description' },
      { labelKey: 'clinical.resources.diagnoses.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.diagnoses.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PROCEDURES]: {
    id: CLINICAL_RESOURCE_IDS.PROCEDURES,
    routePath: `${CLINICAL_ROUTE_ROOT}/procedures`,
    i18nKey: 'clinical.resources.procedures',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.procedures.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.procedures.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.procedures.form.encounterIdHint',
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.procedures.form.codeLabel',
        placeholderKey: 'clinical.resources.procedures.form.codePlaceholder',
        hintKey: 'clinical.resources.procedures.form.codeHint',
      },
      {
        name: 'description',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.procedures.form.descriptionLabel',
        placeholderKey: 'clinical.resources.procedures.form.descriptionPlaceholder',
        hintKey: 'clinical.resources.procedures.form.descriptionHint',
      },
      {
        name: 'performed_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.procedures.form.performedAtLabel',
        placeholderKey: 'clinical.resources.procedures.form.performedAtPlaceholder',
        hintKey: 'clinical.resources.procedures.form.performedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.description) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const code = sanitizeString(item?.code);
      if (!code) return '';
      return `${t('clinical.resources.procedures.detail.codeLabel')}: ${code}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      code: sanitizeString(record?.code || context?.code),
      description: sanitizeString(record?.description),
      performed_at: sanitizeString(record?.performed_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        code: sanitizeString(values.code) || undefined,
        description: sanitizeString(values.description),
        performed_at: toIsoDateTime(values.performed_at) || undefined,
      };
      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const performedAtError = buildDateTimeError(values.performed_at, t);
      if (performedAtError) errors.performed_at = performedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.procedures.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.procedures.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.procedures.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.procedures.detail.descriptionLabel', valueKey: 'description' },
      { labelKey: 'clinical.resources.procedures.detail.performedAtLabel', valueKey: 'performed_at', type: 'datetime' },
      { labelKey: 'clinical.resources.procedures.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.procedures.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.VITAL_SIGNS]: {
    id: CLINICAL_RESOURCE_IDS.VITAL_SIGNS,
    routePath: `${CLINICAL_ROUTE_ROOT}/vital-signs`,
    i18nKey: 'clinical.resources.vitalSigns',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.vitalSigns.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.encounterIdHint',
      },
      {
        name: 'vital_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.vitalSigns.form.vitalTypeLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.vitalTypePlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.vitalTypeHint',
        options: VITAL_TYPE_OPTIONS,
      },
      {
        name: 'value',
        type: 'text',
        required: true,
        maxLength: 80,
        labelKey: 'clinical.resources.vitalSigns.form.valueLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.valuePlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.valueHint',
      },
      {
        name: 'unit',
        type: 'text',
        required: false,
        maxLength: 20,
        labelKey: 'clinical.resources.vitalSigns.form.unitLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.unitPlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.unitHint',
      },
      {
        name: 'recorded_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.vitalSigns.form.recordedAtLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.recordedAtPlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.recordedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.vital_type) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const value = sanitizeString(item?.value);
      if (!value) return '';
      return `${t('clinical.resources.vitalSigns.detail.valueLabel')}: ${value}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      vital_type: sanitizeString(record?.vital_type || context?.vitalType),
      value: sanitizeString(record?.value),
      unit: sanitizeString(record?.unit),
      recorded_at: sanitizeString(record?.recorded_at),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id),
      vital_type: sanitizeString(values.vital_type),
      value: sanitizeString(values.value),
      unit: sanitizeString(values.unit) || undefined,
      recorded_at: toIsoDateTime(values.recorded_at) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const recordedAtError = buildDateTimeError(values.recorded_at, t);
      if (recordedAtError) errors.recorded_at = recordedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.vitalSigns.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.vitalSigns.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.vitalSigns.detail.vitalTypeLabel', valueKey: 'vital_type' },
      { labelKey: 'clinical.resources.vitalSigns.detail.valueLabel', valueKey: 'value' },
      { labelKey: 'clinical.resources.vitalSigns.detail.unitLabel', valueKey: 'unit' },
      { labelKey: 'clinical.resources.vitalSigns.detail.recordedAtLabel', valueKey: 'recorded_at', type: 'datetime' },
      { labelKey: 'clinical.resources.vitalSigns.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.vitalSigns.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.CARE_PLANS]: {
    id: CLINICAL_RESOURCE_IDS.CARE_PLANS,
    routePath: `${CLINICAL_ROUTE_ROOT}/care-plans`,
    i18nKey: 'clinical.resources.carePlans',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.carePlans.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.carePlans.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.carePlans.form.encounterIdHint',
      },
      {
        name: 'plan',
        type: 'text',
        required: true,
        labelKey: 'clinical.resources.carePlans.form.planLabel',
        placeholderKey: 'clinical.resources.carePlans.form.planPlaceholder',
        hintKey: 'clinical.resources.carePlans.form.planHint',
      },
      {
        name: 'start_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.carePlans.form.startDateLabel',
        placeholderKey: 'clinical.resources.carePlans.form.startDatePlaceholder',
        hintKey: 'clinical.resources.carePlans.form.startDateHint',
      },
      {
        name: 'end_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.carePlans.form.endDateLabel',
        placeholderKey: 'clinical.resources.carePlans.form.endDatePlaceholder',
        hintKey: 'clinical.resources.carePlans.form.endDateHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.plan) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const startDate = sanitizeString(item?.start_date);
      if (!startDate) return '';
      return `${t('clinical.resources.carePlans.detail.startDateLabel')}: ${startDate}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      plan: sanitizeString(record?.plan),
      start_date: sanitizeString(record?.start_date || context?.startDate),
      end_date: sanitizeString(record?.end_date || context?.endDate),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id),
      plan: sanitizeString(values.plan),
      start_date: toIsoDateTime(values.start_date) || undefined,
      end_date: toIsoDateTime(values.end_date) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const startDateError = buildDateTimeError(values.start_date, t);
      const endDateError = buildDateTimeError(values.end_date, t);
      if (startDateError) errors.start_date = startDateError;
      if (endDateError) errors.end_date = endDateError;
      if (!endDateError) {
        const orderError = validateDateOrder(values.start_date, values.end_date, t, { allowEqual: true });
        if (orderError) errors.end_date = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.carePlans.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.carePlans.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.carePlans.detail.planLabel', valueKey: 'plan' },
      { labelKey: 'clinical.resources.carePlans.detail.startDateLabel', valueKey: 'start_date', type: 'datetime' },
      { labelKey: 'clinical.resources.carePlans.detail.endDateLabel', valueKey: 'end_date', type: 'datetime' },
      { labelKey: 'clinical.resources.carePlans.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.carePlans.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.REFERRALS]: {
    id: CLINICAL_RESOURCE_IDS.REFERRALS,
    routePath: `${CLINICAL_ROUTE_ROOT}/referrals`,
    i18nKey: 'clinical.resources.referrals',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.referrals.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.referrals.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.referrals.form.encounterIdHint',
      },
      {
        name: 'from_department_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.referrals.form.fromDepartmentIdLabel',
        placeholderKey: 'clinical.resources.referrals.form.fromDepartmentIdPlaceholder',
        hintKey: 'clinical.resources.referrals.form.fromDepartmentIdHint',
      },
      {
        name: 'to_department_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.referrals.form.toDepartmentIdLabel',
        placeholderKey: 'clinical.resources.referrals.form.toDepartmentIdPlaceholder',
        hintKey: 'clinical.resources.referrals.form.toDepartmentIdHint',
      },
      {
        name: 'reason',
        type: 'text',
        required: false,
        maxLength: 10000,
        labelKey: 'clinical.resources.referrals.form.reasonLabel',
        placeholderKey: 'clinical.resources.referrals.form.reasonPlaceholder',
        hintKey: 'clinical.resources.referrals.form.reasonHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.referrals.form.statusLabel',
        placeholderKey: 'clinical.resources.referrals.form.statusPlaceholder',
        hintKey: 'clinical.resources.referrals.form.statusHint',
        options: ({ isEdit }) =>
          isEdit ? REFERRAL_UPDATE_STATUS_OPTIONS : REFERRAL_CREATE_STATUS_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.to_department_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.referrals.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      from_department_id: sanitizeString(record?.from_department_id || context?.fromDepartmentId),
      to_department_id: sanitizeString(record?.to_department_id || context?.toDepartmentId),
      reason: sanitizeString(record?.reason),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        from_department_id: sanitizeString(values.from_department_id) || undefined,
        to_department_id: sanitizeString(values.to_department_id) || undefined,
        reason: sanitizeString(values.reason) || undefined,
        status: sanitizeString(values.status),
      };

      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }

      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.referrals.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.referrals.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.referrals.detail.fromDepartmentLabel', valueKey: 'from_department_id' },
      { labelKey: 'clinical.resources.referrals.detail.toDepartmentLabel', valueKey: 'to_department_id' },
      { labelKey: 'clinical.resources.referrals.detail.reasonLabel', valueKey: 'reason' },
      { labelKey: 'clinical.resources.referrals.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.referrals.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.referrals.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.FOLLOW_UPS]: {
    id: CLINICAL_RESOURCE_IDS.FOLLOW_UPS,
    routePath: `${CLINICAL_ROUTE_ROOT}/follow-ups`,
    i18nKey: 'clinical.resources.followUps',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.followUps.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.followUps.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.followUps.form.encounterIdHint',
      },
      {
        name: 'scheduled_at',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.followUps.form.scheduledAtLabel',
        placeholderKey: 'clinical.resources.followUps.form.scheduledAtPlaceholder',
        hintKey: 'clinical.resources.followUps.form.scheduledAtHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 10000,
        labelKey: 'clinical.resources.followUps.form.notesLabel',
        placeholderKey: 'clinical.resources.followUps.form.notesPlaceholder',
        hintKey: 'clinical.resources.followUps.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.scheduled_at) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const scheduledAt = sanitizeString(item?.scheduled_at);
      if (!scheduledAt) return '';
      return `${t('clinical.resources.followUps.detail.scheduledAtLabel')}: ${scheduledAt}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      scheduled_at: sanitizeString(record?.scheduled_at),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        scheduled_at: toIsoDateTime(values.scheduled_at),
        notes: sanitizeString(values.notes) || undefined,
      };

      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }

      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const scheduledAtError = buildDateTimeError(values.scheduled_at, t);
      if (scheduledAtError) errors.scheduled_at = scheduledAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.followUps.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.followUps.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.followUps.detail.scheduledAtLabel', valueKey: 'scheduled_at', type: 'datetime' },
      { labelKey: 'clinical.resources.followUps.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.followUps.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.followUps.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ADMISSIONS]: {
    id: CLINICAL_RESOURCE_IDS.ADMISSIONS,
    routePath: `${IPD_ROUTE_ROOT}/admissions`,
    i18nKey: 'clinical.resources.admissions',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.admissions.form.patientIdLabel',
        placeholderKey: 'clinical.resources.admissions.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.admissions.form.patientIdHint',
      },
      {
        name: 'encounter_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.admissions.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.admissions.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.admissions.form.encounterIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.admissions.form.statusLabel',
        placeholderKey: 'clinical.resources.admissions.form.statusPlaceholder',
        hintKey: 'clinical.resources.admissions.form.statusHint',
        options: ADMISSION_STATUS_OPTIONS,
      },
      {
        name: 'admitted_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.admissions.form.admittedAtLabel',
        placeholderKey: 'clinical.resources.admissions.form.admittedAtPlaceholder',
        hintKey: 'clinical.resources.admissions.form.admittedAtHint',
      },
      {
        name: 'discharged_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.admissions.form.dischargedAtLabel',
        placeholderKey: 'clinical.resources.admissions.form.dischargedAtPlaceholder',
        hintKey: 'clinical.resources.admissions.form.dischargedAtHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.admissions.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.admissions.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.admissions.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.admissions.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      status: sanitizeString(record?.status || context?.status || 'ADMITTED'),
      admitted_at: sanitizeString(record?.admitted_at),
      discharged_at: sanitizeString(record?.discharged_at),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        facility_id: sanitizeString(values.facility_id) || undefined,
        encounter_id: sanitizeString(values.encounter_id) || undefined,
        status: sanitizeString(values.status),
        admitted_at: toIsoDateTime(values.admitted_at) || undefined,
      };
      if (isEdit) {
        payload.discharged_at = sanitizeString(values.discharged_at)
          ? toIsoDateTime(values.discharged_at)
          : undefined;
      } else {
        payload.patient_id = sanitizeString(values.patient_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const admittedAtError = buildDateTimeError(values.admitted_at, t);
      const dischargedAtError = buildDateTimeError(values.discharged_at, t);
      if (admittedAtError) errors.admitted_at = admittedAtError;
      if (dischargedAtError) errors.discharged_at = dischargedAtError;
      if (!dischargedAtError) {
        const orderError = validateDateOrder(values.admitted_at, values.discharged_at, t, { allowEqual: true });
        if (orderError) errors.discharged_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.admissions.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.admissions.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.admissions.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.admissions.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.admissions.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.admissions.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.admissions.detail.admittedAtLabel', valueKey: 'admitted_at', type: 'datetime' },
      { labelKey: 'clinical.resources.admissions.detail.dischargedAtLabel', valueKey: 'discharged_at', type: 'datetime' },
      { labelKey: 'clinical.resources.admissions.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.admissions.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS]: {
    id: CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS,
    routePath: `${IPD_ROUTE_ROOT}/bed-assignments`,
    i18nKey: 'clinical.resources.bedAssignments',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.bedAssignments.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.bedAssignments.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.bedAssignments.form.admissionIdHint',
      },
      {
        name: 'bed_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.bedAssignments.form.bedIdLabel',
        placeholderKey: 'clinical.resources.bedAssignments.form.bedIdPlaceholder',
        hintKey: 'clinical.resources.bedAssignments.form.bedIdHint',
      },
      {
        name: 'assigned_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.bedAssignments.form.assignedAtLabel',
        placeholderKey: 'clinical.resources.bedAssignments.form.assignedAtPlaceholder',
        hintKey: 'clinical.resources.bedAssignments.form.assignedAtHint',
      },
      {
        name: 'released_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.bedAssignments.form.releasedAtLabel',
        placeholderKey: 'clinical.resources.bedAssignments.form.releasedAtPlaceholder',
        hintKey: 'clinical.resources.bedAssignments.form.releasedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.bed_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const admissionId = sanitizeString(item?.admission_id);
      if (!admissionId) return '';
      return `${t('clinical.resources.bedAssignments.detail.admissionLabel')}: ${admissionId}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      bed_id: sanitizeString(record?.bed_id || context?.bedId),
      assigned_at: sanitizeString(record?.assigned_at),
      released_at: sanitizeString(record?.released_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        bed_id: sanitizeString(values.bed_id) || undefined,
        assigned_at: toIsoDateTime(values.assigned_at) || undefined,
      };
      if (isEdit) {
        payload.released_at = sanitizeString(values.released_at)
          ? toIsoDateTime(values.released_at)
          : null;
      } else {
        payload.admission_id = sanitizeString(values.admission_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const assignedAtError = buildDateTimeError(values.assigned_at, t);
      const releasedAtError = buildDateTimeError(values.released_at, t);
      if (assignedAtError) errors.assigned_at = assignedAtError;
      if (releasedAtError) errors.released_at = releasedAtError;
      if (!releasedAtError) {
        const orderError = validateDateOrder(values.assigned_at, values.released_at, t, { allowEqual: true });
        if (orderError) errors.released_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.bedAssignments.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.bedAssignments.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.bedAssignments.detail.bedLabel', valueKey: 'bed_id' },
      { labelKey: 'clinical.resources.bedAssignments.detail.assignedAtLabel', valueKey: 'assigned_at', type: 'datetime' },
      { labelKey: 'clinical.resources.bedAssignments.detail.releasedAtLabel', valueKey: 'released_at', type: 'datetime' },
      { labelKey: 'clinical.resources.bedAssignments.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.bedAssignments.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.WARD_ROUNDS]: {
    id: CLINICAL_RESOURCE_IDS.WARD_ROUNDS,
    routePath: `${IPD_ROUTE_ROOT}/ward-rounds`,
    i18nKey: 'clinical.resources.wardRounds',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.wardRounds.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.wardRounds.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.wardRounds.form.admissionIdHint',
      },
      {
        name: 'round_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.wardRounds.form.roundAtLabel',
        placeholderKey: 'clinical.resources.wardRounds.form.roundAtPlaceholder',
        hintKey: 'clinical.resources.wardRounds.form.roundAtHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 65535,
        labelKey: 'clinical.resources.wardRounds.form.notesLabel',
        placeholderKey: 'clinical.resources.wardRounds.form.notesPlaceholder',
        hintKey: 'clinical.resources.wardRounds.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.round_at) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const admissionId = sanitizeString(item?.admission_id);
      if (!admissionId) return '';
      return `${t('clinical.resources.wardRounds.detail.admissionLabel')}: ${admissionId}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      round_at: sanitizeString(record?.round_at),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        round_at: toIsoDateTime(values.round_at) || undefined,
        notes: sanitizeString(values.notes) || null,
      };
      if (!isEdit) {
        payload.admission_id = sanitizeString(values.admission_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const roundAtError = buildDateTimeError(values.round_at, t);
      if (roundAtError) errors.round_at = roundAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.wardRounds.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.wardRounds.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.wardRounds.detail.roundAtLabel', valueKey: 'round_at', type: 'datetime' },
      { labelKey: 'clinical.resources.wardRounds.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.wardRounds.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.wardRounds.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.NURSING_NOTES]: {
    id: CLINICAL_RESOURCE_IDS.NURSING_NOTES,
    routePath: `${IPD_ROUTE_ROOT}/nursing-notes`,
    i18nKey: 'clinical.resources.nursingNotes',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.nursingNotes.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.nursingNotes.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.nursingNotes.form.admissionIdHint',
      },
      {
        name: 'nurse_user_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.nursingNotes.form.nurseUserIdLabel',
        placeholderKey: 'clinical.resources.nursingNotes.form.nurseUserIdPlaceholder',
        hintKey: 'clinical.resources.nursingNotes.form.nurseUserIdHint',
      },
      {
        name: 'note',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.nursingNotes.form.noteLabel',
        placeholderKey: 'clinical.resources.nursingNotes.form.notePlaceholder',
        hintKey: 'clinical.resources.nursingNotes.form.noteHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.note) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const nurseUserId = sanitizeString(item?.nurse_user_id);
      if (!nurseUserId) return '';
      return `${t('clinical.resources.nursingNotes.detail.nurseLabel')}: ${nurseUserId}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      nurse_user_id: sanitizeString(record?.nurse_user_id || context?.nurseUserId),
      note: sanitizeString(record?.note),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = { note: sanitizeString(values.note) };
      if (!isEdit) {
        payload.admission_id = sanitizeString(values.admission_id);
        payload.nurse_user_id = sanitizeString(values.nurse_user_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.nursingNotes.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.nursingNotes.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.nursingNotes.detail.nurseLabel', valueKey: 'nurse_user_id' },
      { labelKey: 'clinical.resources.nursingNotes.detail.noteLabel', valueKey: 'note' },
      { labelKey: 'clinical.resources.nursingNotes.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.nursingNotes.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS]: {
    id: CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS,
    routePath: `${IPD_ROUTE_ROOT}/medication-administrations`,
    i18nKey: 'clinical.resources.medicationAdministrations',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.medicationAdministrations.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.admissionIdHint',
      },
      {
        name: 'prescription_id',
        type: 'text',
        required: false,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.medicationAdministrations.form.prescriptionIdLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.prescriptionIdPlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.prescriptionIdHint',
      },
      {
        name: 'administered_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.medicationAdministrations.form.administeredAtLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.administeredAtPlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.administeredAtHint',
      },
      {
        name: 'dose',
        type: 'text',
        required: true,
        maxLength: 80,
        labelKey: 'clinical.resources.medicationAdministrations.form.doseLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.dosePlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.doseHint',
      },
      {
        name: 'unit',
        type: 'text',
        required: false,
        maxLength: 40,
        labelKey: 'clinical.resources.medicationAdministrations.form.unitLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.unitPlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.unitHint',
      },
      {
        name: 'route',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.medicationAdministrations.form.routeLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.routePlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.routeHint',
        options: MEDICATION_ROUTE_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.dose) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const routeValue = sanitizeString(item?.route);
      if (!routeValue) return '';
      return `${t('clinical.resources.medicationAdministrations.detail.routeLabel')}: ${routeValue}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      prescription_id: sanitizeString(record?.prescription_id || context?.prescriptionId),
      administered_at: sanitizeString(record?.administered_at),
      dose: sanitizeString(record?.dose),
      unit: sanitizeString(record?.unit),
      route: sanitizeString(record?.route || context?.route || 'ORAL'),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        administered_at: toIsoDateTime(values.administered_at) || undefined,
        dose: sanitizeString(values.dose),
        unit: sanitizeString(values.unit) || undefined,
        route: sanitizeString(values.route),
      };
      if (!isEdit) {
        payload.admission_id = sanitizeString(values.admission_id);
        payload.prescription_id = sanitizeString(values.prescription_id) || undefined;
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const administeredAtError = buildDateTimeError(values.administered_at, t);
      if (administeredAtError) errors.administered_at = administeredAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.medicationAdministrations.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.prescriptionLabel', valueKey: 'prescription_id' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.doseLabel', valueKey: 'dose' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.unitLabel', valueKey: 'unit' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.routeLabel', valueKey: 'route' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.administeredAtLabel', valueKey: 'administered_at', type: 'datetime' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES]: {
    id: CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES,
    routePath: `${IPD_ROUTE_ROOT}/discharge-summaries`,
    i18nKey: 'clinical.resources.dischargeSummaries',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.dischargeSummaries.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.dischargeSummaries.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.dischargeSummaries.form.admissionIdHint',
      },
      {
        name: 'summary',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.dischargeSummaries.form.summaryLabel',
        placeholderKey: 'clinical.resources.dischargeSummaries.form.summaryPlaceholder',
        hintKey: 'clinical.resources.dischargeSummaries.form.summaryHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.dischargeSummaries.form.statusLabel',
        placeholderKey: 'clinical.resources.dischargeSummaries.form.statusPlaceholder',
        hintKey: 'clinical.resources.dischargeSummaries.form.statusHint',
        options: DISCHARGE_STATUS_OPTIONS,
      },
      {
        name: 'discharged_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.dischargeSummaries.form.dischargedAtLabel',
        placeholderKey: 'clinical.resources.dischargeSummaries.form.dischargedAtPlaceholder',
        hintKey: 'clinical.resources.dischargeSummaries.form.dischargedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.summary) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.dischargeSummaries.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      summary: sanitizeString(record?.summary),
      status: sanitizeString(record?.status || context?.status || 'PLANNED'),
      discharged_at: sanitizeString(record?.discharged_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        summary: sanitizeString(values.summary),
        status: sanitizeString(values.status),
        discharged_at: toIsoDateTime(values.discharged_at) || undefined,
      };
      if (!isEdit) {
        payload.admission_id = sanitizeString(values.admission_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const dischargedAtError = buildDateTimeError(values.discharged_at, t);
      if (dischargedAtError) errors.discharged_at = dischargedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.dischargeSummaries.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.summaryLabel', valueKey: 'summary' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.dischargedAtLabel', valueKey: 'discharged_at', type: 'datetime' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS]: {
    id: CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS,
    routePath: `${IPD_ROUTE_ROOT}/transfer-requests`,
    i18nKey: 'clinical.resources.transferRequests',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.transferRequests.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.transferRequests.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.transferRequests.form.admissionIdHint',
      },
      {
        name: 'from_ward_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.transferRequests.form.fromWardIdLabel',
        placeholderKey: 'clinical.resources.transferRequests.form.fromWardIdPlaceholder',
        hintKey: 'clinical.resources.transferRequests.form.fromWardIdHint',
      },
      {
        name: 'to_ward_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.transferRequests.form.toWardIdLabel',
        placeholderKey: 'clinical.resources.transferRequests.form.toWardIdPlaceholder',
        hintKey: 'clinical.resources.transferRequests.form.toWardIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: false,
        labelKey: 'clinical.resources.transferRequests.form.statusLabel',
        placeholderKey: 'clinical.resources.transferRequests.form.statusPlaceholder',
        hintKey: 'clinical.resources.transferRequests.form.statusHint',
        options: TRANSFER_STATUS_OPTIONS,
      },
      {
        name: 'requested_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.transferRequests.form.requestedAtLabel',
        placeholderKey: 'clinical.resources.transferRequests.form.requestedAtPlaceholder',
        hintKey: 'clinical.resources.transferRequests.form.requestedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.to_ward_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.transferRequests.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      from_ward_id: sanitizeString(record?.from_ward_id || context?.fromWardId),
      to_ward_id: sanitizeString(record?.to_ward_id || context?.toWardId),
      status: sanitizeString(record?.status || context?.status || 'REQUESTED'),
      requested_at: sanitizeString(record?.requested_at),
    }),
    toPayload: (values) => ({
      admission_id: sanitizeString(values.admission_id),
      from_ward_id: sanitizeString(values.from_ward_id) || null,
      to_ward_id: sanitizeString(values.to_ward_id) || null,
      status: sanitizeString(values.status) || undefined,
      requested_at: toIsoDateTime(values.requested_at) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const requestedAtError = buildDateTimeError(values.requested_at, t);
      if (requestedAtError) errors.requested_at = requestedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.transferRequests.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.transferRequests.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.transferRequests.detail.fromWardLabel', valueKey: 'from_ward_id' },
      { labelKey: 'clinical.resources.transferRequests.detail.toWardLabel', valueKey: 'to_ward_id' },
      { labelKey: 'clinical.resources.transferRequests.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.transferRequests.detail.requestedAtLabel', valueKey: 'requested_at', type: 'datetime' },
      { labelKey: 'clinical.resources.transferRequests.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.transferRequests.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ICU_STAYS]: {
    id: CLINICAL_RESOURCE_IDS.ICU_STAYS,
    routePath: `${ICU_ROUTE_ROOT}/icu-stays`,
    i18nKey: 'clinical.resources.icuStays',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.icuStays.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.icuStays.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.icuStays.form.admissionIdHint',
      },
      {
        name: 'started_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.icuStays.form.startedAtLabel',
        placeholderKey: 'clinical.resources.icuStays.form.startedAtPlaceholder',
        hintKey: 'clinical.resources.icuStays.form.startedAtHint',
      },
      {
        name: 'ended_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.icuStays.form.endedAtLabel',
        placeholderKey: 'clinical.resources.icuStays.form.endedAtPlaceholder',
        hintKey: 'clinical.resources.icuStays.form.endedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.admission_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const startedAt = sanitizeString(item?.started_at);
      if (!startedAt) return '';
      return `${t('clinical.resources.icuStays.detail.startedAtLabel')}: ${startedAt}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      started_at: sanitizeString(record?.started_at),
      ended_at: sanitizeString(record?.ended_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        started_at: toIsoDateTime(values.started_at) || undefined,
        ended_at: sanitizeString(values.ended_at) ? toIsoDateTime(values.ended_at) : null,
      };
      if (!isEdit) {
        payload.admission_id = sanitizeString(values.admission_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const startedAtError = buildDateTimeError(values.started_at, t);
      const endedAtError = buildDateTimeError(values.ended_at, t);
      if (startedAtError) errors.started_at = startedAtError;
      if (endedAtError) errors.ended_at = endedAtError;
      if (!endedAtError) {
        const orderError = validateDateOrder(values.started_at, values.ended_at, t, { allowEqual: true });
        if (orderError) errors.ended_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.icuStays.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.icuStays.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.icuStays.detail.startedAtLabel', valueKey: 'started_at', type: 'datetime' },
      { labelKey: 'clinical.resources.icuStays.detail.endedAtLabel', valueKey: 'ended_at', type: 'datetime' },
      { labelKey: 'clinical.resources.icuStays.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.icuStays.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS]: {
    id: CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS,
    routePath: `${ICU_ROUTE_ROOT}/icu-observations`,
    i18nKey: 'clinical.resources.icuObservations',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'icu_stay_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.icuObservations.form.icuStayIdLabel',
        placeholderKey: 'clinical.resources.icuObservations.form.icuStayIdPlaceholder',
        hintKey: 'clinical.resources.icuObservations.form.icuStayIdHint',
      },
      {
        name: 'observed_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.icuObservations.form.observedAtLabel',
        placeholderKey: 'clinical.resources.icuObservations.form.observedAtPlaceholder',
        hintKey: 'clinical.resources.icuObservations.form.observedAtHint',
      },
      {
        name: 'observation',
        type: 'text',
        required: true,
        maxLength: 5000,
        labelKey: 'clinical.resources.icuObservations.form.observationLabel',
        placeholderKey: 'clinical.resources.icuObservations.form.observationPlaceholder',
        hintKey: 'clinical.resources.icuObservations.form.observationHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.observation) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const observedAt = sanitizeString(item?.observed_at);
      if (!observedAt) return '';
      return `${t('clinical.resources.icuObservations.detail.observedAtLabel')}: ${observedAt}`;
    },
    getInitialValues: (record, context) => ({
      icu_stay_id: sanitizeString(record?.icu_stay_id || context?.icuStayId),
      observed_at: sanitizeString(record?.observed_at),
      observation: sanitizeString(record?.observation),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        observed_at: toIsoDateTime(values.observed_at) || undefined,
        observation: sanitizeString(values.observation),
      };
      if (!isEdit) {
        payload.icu_stay_id = sanitizeString(values.icu_stay_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const observedAtError = buildDateTimeError(values.observed_at, t);
      if (observedAtError) errors.observed_at = observedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.icuObservations.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.icuObservations.detail.icuStayLabel', valueKey: 'icu_stay_id' },
      { labelKey: 'clinical.resources.icuObservations.detail.observedAtLabel', valueKey: 'observed_at', type: 'datetime' },
      { labelKey: 'clinical.resources.icuObservations.detail.observationLabel', valueKey: 'observation' },
      { labelKey: 'clinical.resources.icuObservations.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.icuObservations.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS]: {
    id: CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS,
    routePath: `${ICU_ROUTE_ROOT}/critical-alerts`,
    i18nKey: 'clinical.resources.criticalAlerts',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'icu_stay_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.criticalAlerts.form.icuStayIdLabel',
        placeholderKey: 'clinical.resources.criticalAlerts.form.icuStayIdPlaceholder',
        hintKey: 'clinical.resources.criticalAlerts.form.icuStayIdHint',
      },
      {
        name: 'severity',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.criticalAlerts.form.severityLabel',
        placeholderKey: 'clinical.resources.criticalAlerts.form.severityPlaceholder',
        hintKey: 'clinical.resources.criticalAlerts.form.severityHint',
        options: CRITICAL_ALERT_SEVERITY_OPTIONS,
      },
      {
        name: 'message',
        type: 'text',
        required: true,
        maxLength: 2000,
        labelKey: 'clinical.resources.criticalAlerts.form.messageLabel',
        placeholderKey: 'clinical.resources.criticalAlerts.form.messagePlaceholder',
        hintKey: 'clinical.resources.criticalAlerts.form.messageHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.message) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const severityLabel = sanitizeString(item?.severity);
      if (!severityLabel) return '';
      return `${t('clinical.resources.criticalAlerts.detail.severityLabel')}: ${severityLabel}`;
    },
    getInitialValues: (record, context) => ({
      icu_stay_id: sanitizeString(record?.icu_stay_id || context?.icuStayId),
      severity: sanitizeString(record?.severity || context?.severity || 'MEDIUM'),
      message: sanitizeString(record?.message),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        severity: sanitizeString(values.severity),
        message: sanitizeString(values.message),
      };
      if (!isEdit) {
        payload.icu_stay_id = sanitizeString(values.icu_stay_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.criticalAlerts.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.criticalAlerts.detail.icuStayLabel', valueKey: 'icu_stay_id' },
      { labelKey: 'clinical.resources.criticalAlerts.detail.severityLabel', valueKey: 'severity' },
      { labelKey: 'clinical.resources.criticalAlerts.detail.messageLabel', valueKey: 'message' },
      { labelKey: 'clinical.resources.criticalAlerts.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.criticalAlerts.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.THEATRE_CASES]: {
    id: CLINICAL_RESOURCE_IDS.THEATRE_CASES,
    routePath: `${THEATRE_ROUTE_ROOT}/theatre-cases`,
    i18nKey: 'clinical.resources.theatreCases',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.theatreCases.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.theatreCases.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.theatreCases.form.encounterIdHint',
      },
      {
        name: 'scheduled_at',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.theatreCases.form.scheduledAtLabel',
        placeholderKey: 'clinical.resources.theatreCases.form.scheduledAtPlaceholder',
        hintKey: 'clinical.resources.theatreCases.form.scheduledAtHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.theatreCases.form.statusLabel',
        placeholderKey: 'clinical.resources.theatreCases.form.statusPlaceholder',
        hintKey: 'clinical.resources.theatreCases.form.statusHint',
        options: THEATRE_CASE_STATUS_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.encounter_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.theatreCases.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      scheduled_at: sanitizeString(record?.scheduled_at),
      status: sanitizeString(record?.status || context?.status || 'SCHEDULED'),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id),
      scheduled_at: toIsoDateTime(values.scheduled_at),
      status: sanitizeString(values.status),
    }),
    validate: (values, t) => {
      const errors = {};
      const scheduledAtError = buildDateTimeError(values.scheduled_at, t);
      if (scheduledAtError) errors.scheduled_at = scheduledAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.theatreCases.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.theatreCases.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.theatreCases.detail.scheduledAtLabel', valueKey: 'scheduled_at', type: 'datetime' },
      { labelKey: 'clinical.resources.theatreCases.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.theatreCases.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.theatreCases.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS]: {
    id: CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS,
    routePath: `${THEATRE_ROUTE_ROOT}/anesthesia-records`,
    i18nKey: 'clinical.resources.anesthesiaRecords',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'theatre_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.anesthesiaRecords.form.theatreCaseIdLabel',
        placeholderKey: 'clinical.resources.anesthesiaRecords.form.theatreCaseIdPlaceholder',
        hintKey: 'clinical.resources.anesthesiaRecords.form.theatreCaseIdHint',
      },
      {
        name: 'anesthetist_user_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.anesthesiaRecords.form.anesthetistUserIdLabel',
        placeholderKey: 'clinical.resources.anesthesiaRecords.form.anesthetistUserIdPlaceholder',
        hintKey: 'clinical.resources.anesthesiaRecords.form.anesthetistUserIdHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 65535,
        labelKey: 'clinical.resources.anesthesiaRecords.form.notesLabel',
        placeholderKey: 'clinical.resources.anesthesiaRecords.form.notesPlaceholder',
        hintKey: 'clinical.resources.anesthesiaRecords.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.theatre_case_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const anesthetistUserId = sanitizeString(item?.anesthetist_user_id);
      if (!anesthetistUserId) return '';
      return `${t('clinical.resources.anesthesiaRecords.detail.anesthetistLabel')}: ${anesthetistUserId}`;
    },
    getInitialValues: (record, context) => ({
      theatre_case_id: sanitizeString(record?.theatre_case_id || context?.theatreCaseId),
      anesthetist_user_id: sanitizeString(record?.anesthetist_user_id || context?.anesthetistUserId),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values) => ({
      theatre_case_id: sanitizeString(values.theatre_case_id),
      anesthetist_user_id: sanitizeString(values.anesthetist_user_id) || null,
      notes: sanitizeString(values.notes) || null,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.theatreCaseLabel', valueKey: 'theatre_case_id' },
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.anesthetistLabel', valueKey: 'anesthetist_user_id' },
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.POST_OP_NOTES]: {
    id: CLINICAL_RESOURCE_IDS.POST_OP_NOTES,
    routePath: `${THEATRE_ROUTE_ROOT}/post-op-notes`,
    i18nKey: 'clinical.resources.postOpNotes',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'theatre_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.postOpNotes.form.theatreCaseIdLabel',
        placeholderKey: 'clinical.resources.postOpNotes.form.theatreCaseIdPlaceholder',
        hintKey: 'clinical.resources.postOpNotes.form.theatreCaseIdHint',
      },
      {
        name: 'note',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.postOpNotes.form.noteLabel',
        placeholderKey: 'clinical.resources.postOpNotes.form.notePlaceholder',
        hintKey: 'clinical.resources.postOpNotes.form.noteHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.note) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const theatreCaseId = sanitizeString(item?.theatre_case_id);
      if (!theatreCaseId) return '';
      return `${t('clinical.resources.postOpNotes.detail.theatreCaseLabel')}: ${theatreCaseId}`;
    },
    getInitialValues: (record, context) => ({
      theatre_case_id: sanitizeString(record?.theatre_case_id || context?.theatreCaseId),
      note: sanitizeString(record?.note),
    }),
    toPayload: (values) => ({
      theatre_case_id: sanitizeString(values.theatre_case_id),
      note: sanitizeString(values.note),
    }),
    detailRows: [
      { labelKey: 'clinical.resources.postOpNotes.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.postOpNotes.detail.theatreCaseLabel', valueKey: 'theatre_case_id' },
      { labelKey: 'clinical.resources.postOpNotes.detail.noteLabel', valueKey: 'note' },
      { labelKey: 'clinical.resources.postOpNotes.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.postOpNotes.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.EMERGENCY_CASES]: {
    id: CLINICAL_RESOURCE_IDS.EMERGENCY_CASES,
    routePath: `${EMERGENCY_ROUTE_ROOT}/emergency-cases`,
    i18nKey: 'clinical.resources.emergencyCases',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.emergencyCases.form.patientIdLabel',
        placeholderKey: 'clinical.resources.emergencyCases.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.emergencyCases.form.patientIdHint',
      },
      {
        name: 'severity',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.emergencyCases.form.severityLabel',
        placeholderKey: 'clinical.resources.emergencyCases.form.severityPlaceholder',
        hintKey: 'clinical.resources.emergencyCases.form.severityHint',
        options: EMERGENCY_CASE_SEVERITY_OPTIONS,
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.emergencyCases.form.statusLabel',
        placeholderKey: 'clinical.resources.emergencyCases.form.statusPlaceholder',
        hintKey: 'clinical.resources.emergencyCases.form.statusHint',
        options: EMERGENCY_CASE_STATUS_OPTIONS,
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.emergencyCases.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.emergencyCases.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.emergencyCases.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const severityValue = sanitizeString(item?.severity);
      if (!severityValue) return '';
      return `${t('clinical.resources.emergencyCases.detail.severityLabel')}: ${severityValue}`;
    },
    getInitialValues: (record, context) => ({
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      severity: sanitizeString(record?.severity || context?.severity || 'MEDIUM'),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values) => ({
      patient_id: sanitizeString(values.patient_id),
      severity: sanitizeString(values.severity),
      status: sanitizeString(values.status),
      facility_id: sanitizeString(values.facility_id) || undefined,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.emergencyCases.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.emergencyCases.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.emergencyCases.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.emergencyCases.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.emergencyCases.detail.severityLabel', valueKey: 'severity' },
      { labelKey: 'clinical.resources.emergencyCases.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.emergencyCases.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.emergencyCases.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS]: {
    id: CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS,
    routePath: `${EMERGENCY_ROUTE_ROOT}/triage-assessments`,
    i18nKey: 'clinical.resources.triageAssessments',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'emergency_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.triageAssessments.form.emergencyCaseIdLabel',
        placeholderKey: 'clinical.resources.triageAssessments.form.emergencyCaseIdPlaceholder',
        hintKey: 'clinical.resources.triageAssessments.form.emergencyCaseIdHint',
      },
      {
        name: 'triage_level',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.triageAssessments.form.triageLevelLabel',
        placeholderKey: 'clinical.resources.triageAssessments.form.triageLevelPlaceholder',
        hintKey: 'clinical.resources.triageAssessments.form.triageLevelHint',
        options: TRIAGE_LEVEL_OPTIONS,
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 5000,
        labelKey: 'clinical.resources.triageAssessments.form.notesLabel',
        placeholderKey: 'clinical.resources.triageAssessments.form.notesPlaceholder',
        hintKey: 'clinical.resources.triageAssessments.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.triage_level) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const emergencyCaseId = sanitizeString(item?.emergency_case_id);
      if (!emergencyCaseId) return '';
      return `${t('clinical.resources.triageAssessments.detail.emergencyCaseLabel')}: ${emergencyCaseId}`;
    },
    getInitialValues: (record, context) => ({
      emergency_case_id: sanitizeString(record?.emergency_case_id || context?.emergencyCaseId),
      triage_level: sanitizeString(record?.triage_level || context?.triageLevel || 'URGENT'),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values) => ({
      emergency_case_id: sanitizeString(values.emergency_case_id),
      triage_level: sanitizeString(values.triage_level),
      notes: sanitizeString(values.notes) || null,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.triageAssessments.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.triageAssessments.detail.emergencyCaseLabel', valueKey: 'emergency_case_id' },
      { labelKey: 'clinical.resources.triageAssessments.detail.triageLevelLabel', valueKey: 'triage_level' },
      { labelKey: 'clinical.resources.triageAssessments.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.triageAssessments.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.triageAssessments.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES]: {
    id: CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES,
    routePath: `${EMERGENCY_ROUTE_ROOT}/emergency-responses`,
    i18nKey: 'clinical.resources.emergencyResponses',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'emergency_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.emergencyResponses.form.emergencyCaseIdLabel',
        placeholderKey: 'clinical.resources.emergencyResponses.form.emergencyCaseIdPlaceholder',
        hintKey: 'clinical.resources.emergencyResponses.form.emergencyCaseIdHint',
      },
      {
        name: 'response_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.emergencyResponses.form.responseAtLabel',
        placeholderKey: 'clinical.resources.emergencyResponses.form.responseAtPlaceholder',
        hintKey: 'clinical.resources.emergencyResponses.form.responseAtHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 5000,
        labelKey: 'clinical.resources.emergencyResponses.form.notesLabel',
        placeholderKey: 'clinical.resources.emergencyResponses.form.notesPlaceholder',
        hintKey: 'clinical.resources.emergencyResponses.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.response_at) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const emergencyCaseId = sanitizeString(item?.emergency_case_id);
      if (!emergencyCaseId) return '';
      return `${t('clinical.resources.emergencyResponses.detail.emergencyCaseLabel')}: ${emergencyCaseId}`;
    },
    getInitialValues: (record, context) => ({
      emergency_case_id: sanitizeString(record?.emergency_case_id || context?.emergencyCaseId),
      response_at: sanitizeString(record?.response_at),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values) => ({
      emergency_case_id: sanitizeString(values.emergency_case_id),
      response_at: toIsoDateTime(values.response_at) || undefined,
      notes: sanitizeString(values.notes) || null,
    }),
    validate: (values, t) => {
      const errors = {};
      const responseAtError = buildDateTimeError(values.response_at, t);
      if (responseAtError) errors.response_at = responseAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.emergencyResponses.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.emergencyResponses.detail.emergencyCaseLabel', valueKey: 'emergency_case_id' },
      { labelKey: 'clinical.resources.emergencyResponses.detail.responseAtLabel', valueKey: 'response_at', type: 'datetime' },
      { labelKey: 'clinical.resources.emergencyResponses.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.emergencyResponses.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.emergencyResponses.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.AMBULANCES]: {
    id: CLINICAL_RESOURCE_IDS.AMBULANCES,
    routePath: `${EMERGENCY_ROUTE_ROOT}/ambulances`,
    i18nKey: 'clinical.resources.ambulances',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'identifier',
        type: 'text',
        required: true,
        maxLength: 120,
        labelKey: 'clinical.resources.ambulances.form.identifierLabel',
        placeholderKey: 'clinical.resources.ambulances.form.identifierPlaceholder',
        hintKey: 'clinical.resources.ambulances.form.identifierHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.ambulances.form.statusLabel',
        placeholderKey: 'clinical.resources.ambulances.form.statusPlaceholder',
        hintKey: 'clinical.resources.ambulances.form.statusHint',
        options: AMBULANCE_STATUS_OPTIONS,
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulances.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.ambulances.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.ambulances.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.identifier) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.ambulances.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      identifier: sanitizeString(record?.identifier),
      status: sanitizeString(record?.status || context?.status || 'AVAILABLE'),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values) => ({
      identifier: sanitizeString(values.identifier),
      status: sanitizeString(values.status),
      facility_id: sanitizeString(values.facility_id) || undefined,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.ambulances.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.ambulances.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.ambulances.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.ambulances.detail.identifierLabel', valueKey: 'identifier' },
      { labelKey: 'clinical.resources.ambulances.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.ambulances.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulances.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES]: {
    id: CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES,
    routePath: `${EMERGENCY_ROUTE_ROOT}/ambulance-dispatches`,
    i18nKey: 'clinical.resources.ambulanceDispatches',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'ambulance_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceDispatches.form.ambulanceIdLabel',
        placeholderKey: 'clinical.resources.ambulanceDispatches.form.ambulanceIdPlaceholder',
        hintKey: 'clinical.resources.ambulanceDispatches.form.ambulanceIdHint',
      },
      {
        name: 'emergency_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceDispatches.form.emergencyCaseIdLabel',
        placeholderKey: 'clinical.resources.ambulanceDispatches.form.emergencyCaseIdPlaceholder',
        hintKey: 'clinical.resources.ambulanceDispatches.form.emergencyCaseIdHint',
      },
      {
        name: 'dispatched_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceDispatches.form.dispatchedAtLabel',
        placeholderKey: 'clinical.resources.ambulanceDispatches.form.dispatchedAtPlaceholder',
        hintKey: 'clinical.resources.ambulanceDispatches.form.dispatchedAtHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.ambulanceDispatches.form.statusLabel',
        placeholderKey: 'clinical.resources.ambulanceDispatches.form.statusPlaceholder',
        hintKey: 'clinical.resources.ambulanceDispatches.form.statusHint',
        options: AMBULANCE_STATUS_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.ambulance_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.ambulanceDispatches.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      ambulance_id: sanitizeString(record?.ambulance_id || context?.ambulanceId),
      emergency_case_id: sanitizeString(record?.emergency_case_id || context?.emergencyCaseId),
      dispatched_at: sanitizeString(record?.dispatched_at),
      status: sanitizeString(record?.status || context?.status || 'DISPATCHED'),
    }),
    toPayload: (values) => ({
      ambulance_id: sanitizeString(values.ambulance_id),
      emergency_case_id: sanitizeString(values.emergency_case_id),
      dispatched_at: toIsoDateTime(values.dispatched_at) || undefined,
      status: sanitizeString(values.status),
    }),
    validate: (values, t) => {
      const errors = {};
      const dispatchedAtError = buildDateTimeError(values.dispatched_at, t);
      if (dispatchedAtError) errors.dispatched_at = dispatchedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.ambulanceLabel', valueKey: 'ambulance_id' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.emergencyCaseLabel', valueKey: 'emergency_case_id' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.dispatchedAtLabel', valueKey: 'dispatched_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS]: {
    id: CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS,
    routePath: `${EMERGENCY_ROUTE_ROOT}/ambulance-trips`,
    i18nKey: 'clinical.resources.ambulanceTrips',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'ambulance_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceTrips.form.ambulanceIdLabel',
        placeholderKey: 'clinical.resources.ambulanceTrips.form.ambulanceIdPlaceholder',
        hintKey: 'clinical.resources.ambulanceTrips.form.ambulanceIdHint',
      },
      {
        name: 'emergency_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceTrips.form.emergencyCaseIdLabel',
        placeholderKey: 'clinical.resources.ambulanceTrips.form.emergencyCaseIdPlaceholder',
        hintKey: 'clinical.resources.ambulanceTrips.form.emergencyCaseIdHint',
      },
      {
        name: 'started_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceTrips.form.startedAtLabel',
        placeholderKey: 'clinical.resources.ambulanceTrips.form.startedAtPlaceholder',
        hintKey: 'clinical.resources.ambulanceTrips.form.startedAtHint',
      },
      {
        name: 'ended_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceTrips.form.endedAtLabel',
        placeholderKey: 'clinical.resources.ambulanceTrips.form.endedAtPlaceholder',
        hintKey: 'clinical.resources.ambulanceTrips.form.endedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.ambulance_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const emergencyCaseId = sanitizeString(item?.emergency_case_id);
      if (!emergencyCaseId) return '';
      return `${t('clinical.resources.ambulanceTrips.detail.emergencyCaseLabel')}: ${emergencyCaseId}`;
    },
    getInitialValues: (record, context) => ({
      ambulance_id: sanitizeString(record?.ambulance_id || context?.ambulanceId),
      emergency_case_id: sanitizeString(record?.emergency_case_id || context?.emergencyCaseId),
      started_at: sanitizeString(record?.started_at),
      ended_at: sanitizeString(record?.ended_at),
    }),
    toPayload: (values) => ({
      ambulance_id: sanitizeString(values.ambulance_id),
      emergency_case_id: sanitizeString(values.emergency_case_id),
      started_at: sanitizeString(values.started_at) ? toIsoDateTime(values.started_at) : null,
      ended_at: sanitizeString(values.ended_at) ? toIsoDateTime(values.ended_at) : null,
    }),
    validate: (values, t) => {
      const errors = {};
      const startedAtError = buildDateTimeError(values.started_at, t);
      const endedAtError = buildDateTimeError(values.ended_at, t);
      if (startedAtError) errors.started_at = startedAtError;
      if (endedAtError) errors.ended_at = endedAtError;
      if (!endedAtError) {
        const orderError = validateDateOrder(values.started_at, values.ended_at, t, { allowEqual: true });
        if (orderError) errors.ended_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.ambulanceTrips.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.ambulanceLabel', valueKey: 'ambulance_id' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.emergencyCaseLabel', valueKey: 'emergency_case_id' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.startedAtLabel', valueKey: 'started_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.endedAtLabel', valueKey: 'ended_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_TESTS]: {
    id: CLINICAL_RESOURCE_IDS.LAB_TESTS,
    routePath: `${LAB_ROUTE_ROOT}/lab-tests`,
    i18nKey: 'clinical.resources.labTests',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'clinical.resources.labTests.form.nameLabel',
        placeholderKey: 'clinical.resources.labTests.form.namePlaceholder',
        hintKey: 'clinical.resources.labTests.form.nameHint',
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.labTests.form.codeLabel',
        placeholderKey: 'clinical.resources.labTests.form.codePlaceholder',
        hintKey: 'clinical.resources.labTests.form.codeHint',
      },
      {
        name: 'unit',
        type: 'text',
        required: false,
        maxLength: 40,
        labelKey: 'clinical.resources.labTests.form.unitLabel',
        placeholderKey: 'clinical.resources.labTests.form.unitPlaceholder',
        hintKey: 'clinical.resources.labTests.form.unitHint',
      },
      {
        name: 'reference_range',
        type: 'text',
        required: false,
        maxLength: 120,
        labelKey: 'clinical.resources.labTests.form.referenceRangeLabel',
        placeholderKey: 'clinical.resources.labTests.form.referenceRangePlaceholder',
        hintKey: 'clinical.resources.labTests.form.referenceRangeHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const codeValue = sanitizeString(item?.code);
      if (!codeValue) return '';
      return `${t('clinical.resources.labTests.detail.codeLabel')}: ${codeValue}`;
    },
    getInitialValues: (record) => ({
      name: sanitizeString(record?.name),
      code: sanitizeString(record?.code),
      unit: sanitizeString(record?.unit),
      reference_range: sanitizeString(record?.reference_range),
    }),
    toPayload: (values) => ({
      name: sanitizeString(values.name),
      code: sanitizeString(values.code) || null,
      unit: sanitizeString(values.unit) || null,
      reference_range: sanitizeString(values.reference_range) || null,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.labTests.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labTests.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.labTests.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'clinical.resources.labTests.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.labTests.detail.unitLabel', valueKey: 'unit' },
      { labelKey: 'clinical.resources.labTests.detail.referenceRangeLabel', valueKey: 'reference_range' },
      { labelKey: 'clinical.resources.labTests.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labTests.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_PANELS]: {
    id: CLINICAL_RESOURCE_IDS.LAB_PANELS,
    routePath: `${LAB_ROUTE_ROOT}/lab-panels`,
    i18nKey: 'clinical.resources.labPanels',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'clinical.resources.labPanels.form.nameLabel',
        placeholderKey: 'clinical.resources.labPanels.form.namePlaceholder',
        hintKey: 'clinical.resources.labPanels.form.nameHint',
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.labPanels.form.codeLabel',
        placeholderKey: 'clinical.resources.labPanels.form.codePlaceholder',
        hintKey: 'clinical.resources.labPanels.form.codeHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const codeValue = sanitizeString(item?.code);
      if (!codeValue) return '';
      return `${t('clinical.resources.labPanels.detail.codeLabel')}: ${codeValue}`;
    },
    getInitialValues: (record) => ({
      name: sanitizeString(record?.name),
      code: sanitizeString(record?.code),
    }),
    toPayload: (values) => ({
      name: sanitizeString(values.name),
      code: sanitizeString(values.code) || null,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.labPanels.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labPanels.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.labPanels.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'clinical.resources.labPanels.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.labPanels.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labPanels.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_ORDERS]: {
    id: CLINICAL_RESOURCE_IDS.LAB_ORDERS,
    routePath: `${LAB_ROUTE_ROOT}/lab-orders`,
    i18nKey: 'clinical.resources.labOrders',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labOrders.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.labOrders.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.labOrders.form.encounterIdHint',
      },
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.labOrders.form.patientIdLabel',
        placeholderKey: 'clinical.resources.labOrders.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.labOrders.form.patientIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.labOrders.form.statusLabel',
        placeholderKey: 'clinical.resources.labOrders.form.statusPlaceholder',
        hintKey: 'clinical.resources.labOrders.form.statusHint',
        options: LAB_ORDER_STATUS_OPTIONS,
      },
      {
        name: 'ordered_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labOrders.form.orderedAtLabel',
        placeholderKey: 'clinical.resources.labOrders.form.orderedAtPlaceholder',
        hintKey: 'clinical.resources.labOrders.form.orderedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.labOrders.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      status: sanitizeString(record?.status || context?.status || 'ORDERED'),
      ordered_at: sanitizeString(record?.ordered_at || context?.orderedAtFrom),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id) || null,
      patient_id: sanitizeString(values.patient_id),
      status: sanitizeString(values.status),
      ordered_at: toIsoDateTime(values.ordered_at) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const orderedAtError = buildDateTimeError(values.ordered_at, t);
      if (orderedAtError) errors.ordered_at = orderedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.labOrders.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labOrders.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.labOrders.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.labOrders.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.labOrders.detail.orderedAtLabel', valueKey: 'ordered_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labOrders.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labOrders.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_SAMPLES]: {
    id: CLINICAL_RESOURCE_IDS.LAB_SAMPLES,
    routePath: `${LAB_ROUTE_ROOT}/lab-samples`,
    i18nKey: 'clinical.resources.labSamples',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'lab_order_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.labSamples.form.labOrderIdLabel',
        placeholderKey: 'clinical.resources.labSamples.form.labOrderIdPlaceholder',
        hintKey: 'clinical.resources.labSamples.form.labOrderIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.labSamples.form.statusLabel',
        placeholderKey: 'clinical.resources.labSamples.form.statusPlaceholder',
        hintKey: 'clinical.resources.labSamples.form.statusHint',
        options: LAB_SAMPLE_STATUS_OPTIONS,
      },
      {
        name: 'collected_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labSamples.form.collectedAtLabel',
        placeholderKey: 'clinical.resources.labSamples.form.collectedAtPlaceholder',
        hintKey: 'clinical.resources.labSamples.form.collectedAtHint',
      },
      {
        name: 'received_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labSamples.form.receivedAtLabel',
        placeholderKey: 'clinical.resources.labSamples.form.receivedAtPlaceholder',
        hintKey: 'clinical.resources.labSamples.form.receivedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.lab_order_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.labSamples.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      lab_order_id: sanitizeString(record?.lab_order_id || context?.labOrderId),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
      collected_at: sanitizeString(record?.collected_at),
      received_at: sanitizeString(record?.received_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        status: sanitizeString(values.status),
        collected_at: sanitizeString(values.collected_at)
          ? toIsoDateTime(values.collected_at)
          : null,
        received_at: sanitizeString(values.received_at)
          ? toIsoDateTime(values.received_at)
          : null,
      };
      if (!isEdit) {
        payload.lab_order_id = sanitizeString(values.lab_order_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const collectedAtError = buildDateTimeError(values.collected_at, t);
      const receivedAtError = buildDateTimeError(values.received_at, t);
      if (collectedAtError) errors.collected_at = collectedAtError;
      if (receivedAtError) errors.received_at = receivedAtError;
      if (!receivedAtError) {
        const orderError = validateDateOrder(values.collected_at, values.received_at, t, { allowEqual: true });
        if (orderError) errors.received_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.labSamples.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labSamples.detail.labOrderLabel', valueKey: 'lab_order_id' },
      { labelKey: 'clinical.resources.labSamples.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.labSamples.detail.collectedAtLabel', valueKey: 'collected_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labSamples.detail.receivedAtLabel', valueKey: 'received_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labSamples.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labSamples.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_RESULTS]: {
    id: CLINICAL_RESOURCE_IDS.LAB_RESULTS,
    routePath: `${LAB_ROUTE_ROOT}/lab-results`,
    i18nKey: 'clinical.resources.labResults',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'lab_order_item_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.labResults.form.labOrderItemIdLabel',
        placeholderKey: 'clinical.resources.labResults.form.labOrderItemIdPlaceholder',
        hintKey: 'clinical.resources.labResults.form.labOrderItemIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.labResults.form.statusLabel',
        placeholderKey: 'clinical.resources.labResults.form.statusPlaceholder',
        hintKey: 'clinical.resources.labResults.form.statusHint',
        options: LAB_RESULT_STATUS_OPTIONS,
      },
      {
        name: 'result_value',
        type: 'text',
        required: false,
        maxLength: 120,
        labelKey: 'clinical.resources.labResults.form.resultValueLabel',
        placeholderKey: 'clinical.resources.labResults.form.resultValuePlaceholder',
        hintKey: 'clinical.resources.labResults.form.resultValueHint',
      },
      {
        name: 'result_unit',
        type: 'text',
        required: false,
        maxLength: 40,
        labelKey: 'clinical.resources.labResults.form.resultUnitLabel',
        placeholderKey: 'clinical.resources.labResults.form.resultUnitPlaceholder',
        hintKey: 'clinical.resources.labResults.form.resultUnitHint',
      },
      {
        name: 'result_text',
        type: 'text',
        required: false,
        maxLength: 5000,
        labelKey: 'clinical.resources.labResults.form.resultTextLabel',
        placeholderKey: 'clinical.resources.labResults.form.resultTextPlaceholder',
        hintKey: 'clinical.resources.labResults.form.resultTextHint',
      },
      {
        name: 'reported_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labResults.form.reportedAtLabel',
        placeholderKey: 'clinical.resources.labResults.form.reportedAtPlaceholder',
        hintKey: 'clinical.resources.labResults.form.reportedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.lab_order_item_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.labResults.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      lab_order_item_id: sanitizeString(record?.lab_order_item_id || context?.labOrderItemId),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
      result_value: sanitizeString(record?.result_value),
      result_unit: sanitizeString(record?.result_unit),
      result_text: sanitizeString(record?.result_text),
      reported_at: sanitizeString(record?.reported_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        status: sanitizeString(values.status),
        result_value: sanitizeString(values.result_value) || null,
        result_unit: sanitizeString(values.result_unit) || null,
        result_text: sanitizeString(values.result_text) || null,
        reported_at: sanitizeString(values.reported_at) ? toIsoDateTime(values.reported_at) : null,
      };
      if (!isEdit) {
        payload.lab_order_item_id = sanitizeString(values.lab_order_item_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const reportedAtError = buildDateTimeError(values.reported_at, t);
      if (reportedAtError) errors.reported_at = reportedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.labResults.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labResults.detail.labOrderItemLabel', valueKey: 'lab_order_item_id' },
      { labelKey: 'clinical.resources.labResults.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.labResults.detail.resultValueLabel', valueKey: 'result_value' },
      { labelKey: 'clinical.resources.labResults.detail.resultUnitLabel', valueKey: 'result_unit' },
      { labelKey: 'clinical.resources.labResults.detail.resultTextLabel', valueKey: 'result_text' },
      { labelKey: 'clinical.resources.labResults.detail.reportedAtLabel', valueKey: 'reported_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labResults.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labResults.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_QC_LOGS]: {
    id: CLINICAL_RESOURCE_IDS.LAB_QC_LOGS,
    routePath: `${LAB_ROUTE_ROOT}/lab-qc-logs`,
    i18nKey: 'clinical.resources.labQcLogs',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'lab_test_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.labQcLogs.form.labTestIdLabel',
        placeholderKey: 'clinical.resources.labQcLogs.form.labTestIdPlaceholder',
        hintKey: 'clinical.resources.labQcLogs.form.labTestIdHint',
      },
      {
        name: 'status',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.labQcLogs.form.statusLabel',
        placeholderKey: 'clinical.resources.labQcLogs.form.statusPlaceholder',
        hintKey: 'clinical.resources.labQcLogs.form.statusHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 5000,
        labelKey: 'clinical.resources.labQcLogs.form.notesLabel',
        placeholderKey: 'clinical.resources.labQcLogs.form.notesPlaceholder',
        hintKey: 'clinical.resources.labQcLogs.form.notesHint',
      },
      {
        name: 'logged_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labQcLogs.form.loggedAtLabel',
        placeholderKey: 'clinical.resources.labQcLogs.form.loggedAtPlaceholder',
        hintKey: 'clinical.resources.labQcLogs.form.loggedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.status) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const labTestId = sanitizeString(item?.lab_test_id);
      if (!labTestId) return '';
      return `${t('clinical.resources.labQcLogs.detail.labTestLabel')}: ${labTestId}`;
    },
    getInitialValues: (record, context) => ({
      lab_test_id: sanitizeString(record?.lab_test_id || context?.labTestId),
      status: sanitizeString(record?.status),
      notes: sanitizeString(record?.notes),
      logged_at: sanitizeString(record?.logged_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        status: sanitizeString(values.status) || null,
        notes: sanitizeString(values.notes) || null,
        logged_at: toIsoDateTime(values.logged_at) || undefined,
      };
      if (!isEdit) {
        payload.lab_test_id = sanitizeString(values.lab_test_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const loggedAtError = buildDateTimeError(values.logged_at, t);
      if (loggedAtError) errors.logged_at = loggedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.labQcLogs.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labQcLogs.detail.labTestLabel', valueKey: 'lab_test_id' },
      { labelKey: 'clinical.resources.labQcLogs.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.labQcLogs.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.labQcLogs.detail.loggedAtLabel', valueKey: 'logged_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labQcLogs.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labQcLogs.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS]: {
    id: CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS,
    routePath: `${RADIOLOGY_ROUTE_ROOT}/radiology-tests`,
    i18nKey: 'clinical.resources.radiologyTests',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'clinical.resources.radiologyTests.form.nameLabel',
        placeholderKey: 'clinical.resources.radiologyTests.form.namePlaceholder',
        hintKey: 'clinical.resources.radiologyTests.form.nameHint',
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.radiologyTests.form.codeLabel',
        placeholderKey: 'clinical.resources.radiologyTests.form.codePlaceholder',
        hintKey: 'clinical.resources.radiologyTests.form.codeHint',
      },
      {
        name: 'modality',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.radiologyTests.form.modalityLabel',
        placeholderKey: 'clinical.resources.radiologyTests.form.modalityPlaceholder',
        hintKey: 'clinical.resources.radiologyTests.form.modalityHint',
        options: RADIOLOGY_MODALITY_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const modalityValue = sanitizeString(item?.modality);
      if (!modalityValue) return '';
      return `${t('clinical.resources.radiologyTests.detail.modalityLabel')}: ${modalityValue}`;
    },
    getInitialValues: (record, context) => ({
      name: sanitizeString(record?.name),
      code: sanitizeString(record?.code),
      modality: sanitizeString(record?.modality || context?.modality || 'XRAY'),
    }),
    toPayload: (values) => ({
      name: sanitizeString(values.name),
      code: sanitizeString(values.code) || null,
      modality: sanitizeString(values.modality),
    }),
    detailRows: [
      { labelKey: 'clinical.resources.radiologyTests.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.radiologyTests.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.radiologyTests.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'clinical.resources.radiologyTests.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.radiologyTests.detail.modalityLabel', valueKey: 'modality' },
      { labelKey: 'clinical.resources.radiologyTests.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.radiologyTests.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS]: {
    id: CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS,
    routePath: `${RADIOLOGY_ROUTE_ROOT}/radiology-orders`,
    i18nKey: 'clinical.resources.radiologyOrders',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyOrders.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.radiologyOrders.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.radiologyOrders.form.encounterIdHint',
      },
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyOrders.form.patientIdLabel',
        placeholderKey: 'clinical.resources.radiologyOrders.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.radiologyOrders.form.patientIdHint',
      },
      {
        name: 'radiology_test_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyOrders.form.radiologyTestIdLabel',
        placeholderKey: 'clinical.resources.radiologyOrders.form.radiologyTestIdPlaceholder',
        hintKey: 'clinical.resources.radiologyOrders.form.radiologyTestIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.radiologyOrders.form.statusLabel',
        placeholderKey: 'clinical.resources.radiologyOrders.form.statusPlaceholder',
        hintKey: 'clinical.resources.radiologyOrders.form.statusHint',
        options: RADIOLOGY_ORDER_STATUS_OPTIONS,
      },
      {
        name: 'ordered_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyOrders.form.orderedAtLabel',
        placeholderKey: 'clinical.resources.radiologyOrders.form.orderedAtPlaceholder',
        hintKey: 'clinical.resources.radiologyOrders.form.orderedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.radiologyOrders.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      radiology_test_id: sanitizeString(record?.radiology_test_id || context?.radiologyTestId),
      status: sanitizeString(record?.status || context?.status || 'ORDERED'),
      ordered_at: sanitizeString(record?.ordered_at || context?.orderedAtFrom),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id) || null,
      patient_id: sanitizeString(values.patient_id),
      radiology_test_id: sanitizeString(values.radiology_test_id) || null,
      status: sanitizeString(values.status),
      ordered_at: toIsoDateTime(values.ordered_at) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const orderedAtError = buildDateTimeError(values.ordered_at, t);
      if (orderedAtError) errors.ordered_at = orderedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.radiologyOrders.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.radiologyTestLabel', valueKey: 'radiology_test_id' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.orderedAtLabel', valueKey: 'ordered_at', type: 'datetime' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS]: {
    id: CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS,
    routePath: `${RADIOLOGY_ROUTE_ROOT}/radiology-results`,
    i18nKey: 'clinical.resources.radiologyResults',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'radiology_order_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyResults.form.radiologyOrderIdLabel',
        placeholderKey: 'clinical.resources.radiologyResults.form.radiologyOrderIdPlaceholder',
        hintKey: 'clinical.resources.radiologyResults.form.radiologyOrderIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.radiologyResults.form.statusLabel',
        placeholderKey: 'clinical.resources.radiologyResults.form.statusPlaceholder',
        hintKey: 'clinical.resources.radiologyResults.form.statusHint',
        options: RADIOLOGY_RESULT_STATUS_OPTIONS,
      },
      {
        name: 'report_text',
        type: 'text',
        required: false,
        maxLength: 65535,
        labelKey: 'clinical.resources.radiologyResults.form.reportTextLabel',
        placeholderKey: 'clinical.resources.radiologyResults.form.reportTextPlaceholder',
        hintKey: 'clinical.resources.radiologyResults.form.reportTextHint',
      },
      {
        name: 'reported_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyResults.form.reportedAtLabel',
        placeholderKey: 'clinical.resources.radiologyResults.form.reportedAtPlaceholder',
        hintKey: 'clinical.resources.radiologyResults.form.reportedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.radiology_order_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.radiologyResults.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      radiology_order_id: sanitizeString(record?.radiology_order_id || context?.radiologyOrderId),
      status: sanitizeString(record?.status || context?.status || 'DRAFT'),
      report_text: sanitizeString(record?.report_text),
      reported_at: sanitizeString(record?.reported_at),
    }),
    toPayload: (values) => ({
      radiology_order_id: sanitizeString(values.radiology_order_id),
      status: sanitizeString(values.status),
      report_text: sanitizeString(values.report_text) || null,
      reported_at: sanitizeString(values.reported_at) ? toIsoDateTime(values.reported_at) : null,
    }),
    validate: (values, t) => {
      const errors = {};
      const reportedAtError = buildDateTimeError(values.reported_at, t);
      if (reportedAtError) errors.reported_at = reportedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.radiologyResults.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.radiologyResults.detail.radiologyOrderLabel', valueKey: 'radiology_order_id' },
      { labelKey: 'clinical.resources.radiologyResults.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.radiologyResults.detail.reportTextLabel', valueKey: 'report_text' },
      { labelKey: 'clinical.resources.radiologyResults.detail.reportedAtLabel', valueKey: 'reported_at', type: 'datetime' },
      { labelKey: 'clinical.resources.radiologyResults.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.radiologyResults.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.IMAGING_STUDIES]: {
    id: CLINICAL_RESOURCE_IDS.IMAGING_STUDIES,
    routePath: `${RADIOLOGY_ROUTE_ROOT}/imaging-studies`,
    i18nKey: 'clinical.resources.imagingStudies',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'radiology_order_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.imagingStudies.form.radiologyOrderIdLabel',
        placeholderKey: 'clinical.resources.imagingStudies.form.radiologyOrderIdPlaceholder',
        hintKey: 'clinical.resources.imagingStudies.form.radiologyOrderIdHint',
      },
      {
        name: 'modality',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.imagingStudies.form.modalityLabel',
        placeholderKey: 'clinical.resources.imagingStudies.form.modalityPlaceholder',
        hintKey: 'clinical.resources.imagingStudies.form.modalityHint',
        options: RADIOLOGY_MODALITY_OPTIONS,
      },
      {
        name: 'performed_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.imagingStudies.form.performedAtLabel',
        placeholderKey: 'clinical.resources.imagingStudies.form.performedAtPlaceholder',
        hintKey: 'clinical.resources.imagingStudies.form.performedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.radiology_order_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const modalityValue = sanitizeString(item?.modality);
      if (!modalityValue) return '';
      return `${t('clinical.resources.imagingStudies.detail.modalityLabel')}: ${modalityValue}`;
    },
    getInitialValues: (record, context) => ({
      radiology_order_id: sanitizeString(record?.radiology_order_id || context?.radiologyOrderId),
      modality: sanitizeString(record?.modality || context?.modality || 'XRAY'),
      performed_at: sanitizeString(record?.performed_at || context?.performedAt),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        modality: sanitizeString(values.modality),
        performed_at: sanitizeString(values.performed_at) ? toIsoDateTime(values.performed_at) : null,
      };
      if (!isEdit) {
        payload.radiology_order_id = sanitizeString(values.radiology_order_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const performedAtError = buildDateTimeError(values.performed_at, t);
      if (performedAtError) errors.performed_at = performedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.imagingStudies.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.imagingStudies.detail.radiologyOrderLabel', valueKey: 'radiology_order_id' },
      { labelKey: 'clinical.resources.imagingStudies.detail.modalityLabel', valueKey: 'modality' },
      { labelKey: 'clinical.resources.imagingStudies.detail.performedAtLabel', valueKey: 'performed_at', type: 'datetime' },
      { labelKey: 'clinical.resources.imagingStudies.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.imagingStudies.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PACS_LINKS]: {
    id: CLINICAL_RESOURCE_IDS.PACS_LINKS,
    routePath: `${RADIOLOGY_ROUTE_ROOT}/pacs-links`,
    i18nKey: 'clinical.resources.pacsLinks',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'imaging_study_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.pacsLinks.form.imagingStudyIdLabel',
        placeholderKey: 'clinical.resources.pacsLinks.form.imagingStudyIdPlaceholder',
        hintKey: 'clinical.resources.pacsLinks.form.imagingStudyIdHint',
      },
      {
        name: 'url',
        type: 'text',
        required: true,
        maxLength: 2048,
        labelKey: 'clinical.resources.pacsLinks.form.urlLabel',
        placeholderKey: 'clinical.resources.pacsLinks.form.urlPlaceholder',
        hintKey: 'clinical.resources.pacsLinks.form.urlHint',
      },
      {
        name: 'expires_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.pacsLinks.form.expiresAtLabel',
        placeholderKey: 'clinical.resources.pacsLinks.form.expiresAtPlaceholder',
        hintKey: 'clinical.resources.pacsLinks.form.expiresAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.url) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const imagingStudyId = sanitizeString(item?.imaging_study_id);
      if (!imagingStudyId) return '';
      return `${t('clinical.resources.pacsLinks.detail.imagingStudyLabel')}: ${imagingStudyId}`;
    },
    getInitialValues: (record, context) => ({
      imaging_study_id: sanitizeString(record?.imaging_study_id || context?.imagingStudyId),
      url: sanitizeString(record?.url),
      expires_at: sanitizeString(record?.expires_at || context?.expiresAt),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        url: sanitizeString(values.url),
        expires_at: sanitizeString(values.expires_at) ? toIsoDateTime(values.expires_at) : null,
      };
      if (!isEdit) {
        payload.imaging_study_id = sanitizeString(values.imaging_study_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const urlError = buildUrlError(values.url, t);
      const expiresAtError = buildDateTimeError(values.expires_at, t);
      if (urlError) errors.url = urlError;
      if (expiresAtError) errors.expires_at = expiresAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.pacsLinks.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.pacsLinks.detail.imagingStudyLabel', valueKey: 'imaging_study_id' },
      { labelKey: 'clinical.resources.pacsLinks.detail.urlLabel', valueKey: 'url' },
      { labelKey: 'clinical.resources.pacsLinks.detail.expiresAtLabel', valueKey: 'expires_at', type: 'datetime' },
      { labelKey: 'clinical.resources.pacsLinks.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.pacsLinks.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
};

const getClinicalResourceConfig = (resourceId) => resourceConfigs[resourceId] || null;

export {
  CLINICAL_RESOURCE_IDS,
  CLINICAL_RESOURCE_LIST_ORDER,
  CLINICAL_ROUTE_ROOT,
  IPD_RESOURCE_LIST_ORDER,
  ICU_RESOURCE_LIST_ORDER,
  THEATRE_RESOURCE_LIST_ORDER,
  EMERGENCY_RESOURCE_LIST_ORDER,
  LAB_RESOURCE_LIST_ORDER,
  RADIOLOGY_RESOURCE_LIST_ORDER,
  IPD_ROUTE_ROOT,
  ICU_ROUTE_ROOT,
  THEATRE_ROUTE_ROOT,
  EMERGENCY_ROUTE_ROOT,
  LAB_ROUTE_ROOT,
  RADIOLOGY_ROUTE_ROOT,
  getClinicalResourceConfig,
  getContextFilters,
  normalizeContextId,
  normalizeRouteId,
  normalizeSearchParam,
  sanitizeString,
  toIsoDateTime,
  withClinicalContext,
};
