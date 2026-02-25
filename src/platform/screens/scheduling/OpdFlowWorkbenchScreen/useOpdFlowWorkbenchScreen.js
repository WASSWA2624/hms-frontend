import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useI18n,
  useAppointment,
  useFacility,
  useNetwork,
  useOpdFlow,
  useOpdFlowAccess,
  usePatient,
  useStaffProfile,
  useTenant,
  useRealtimeEvent,
} from '@hooks';
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
const TRIAGE_LEVEL_LEGEND = [
  {
    value: 'LEVEL_1',
    labelKey: 'scheduling.opdFlow.options.triageLevel.level1',
    colorCodeKey: 'scheduling.opdFlow.triage.color.red',
    badgeVariant: 'error',
  },
  {
    value: 'LEVEL_2',
    labelKey: 'scheduling.opdFlow.options.triageLevel.level2',
    colorCodeKey: 'scheduling.opdFlow.triage.color.orange',
    badgeVariant: 'warning',
  },
  {
    value: 'LEVEL_3',
    labelKey: 'scheduling.opdFlow.options.triageLevel.level3',
    colorCodeKey: 'scheduling.opdFlow.triage.color.yellow',
    badgeVariant: 'warning',
  },
  {
    value: 'LEVEL_4',
    labelKey: 'scheduling.opdFlow.options.triageLevel.level4',
    colorCodeKey: 'scheduling.opdFlow.triage.color.green',
    badgeVariant: 'success',
  },
  {
    value: 'LEVEL_5',
    labelKey: 'scheduling.opdFlow.options.triageLevel.level5',
    colorCodeKey: 'scheduling.opdFlow.triage.color.blue',
    badgeVariant: 'primary',
  },
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
const VITAL_DEFAULT_UNIT_BY_TYPE = Object.freeze({
  TEMPERATURE: 'C',
  BLOOD_PRESSURE: 'mmHg',
  HEART_RATE: 'bpm',
  RESPIRATORY_RATE: 'breaths/min',
  OXYGEN_SATURATION: '%',
  WEIGHT: 'kg',
  HEIGHT: 'cm',
  BMI: 'kg/m2',
});
const VITAL_UNIT_OPTIONS_BY_TYPE = Object.freeze({
  TEMPERATURE: ['C', 'F', 'K'],
  BLOOD_PRESSURE: ['mmHg', 'kPa'],
  HEART_RATE: ['bpm', 'beats/min'],
  RESPIRATORY_RATE: ['breaths/min', 'respirations/min'],
  OXYGEN_SATURATION: ['%', 'fraction'],
  WEIGHT: ['kg', 'g', 'lb', 'oz'],
  HEIGHT: ['cm', 'm', 'in', 'ft'],
  BMI: ['kg/m2'],
});

const STATUS_PRIORITY = Object.freeze({
  INCOMPLETE: 0,
  NORMAL: 1,
  ABNORMAL: 2,
  CRITICAL: 3,
});

const DEFAULT_CURRENCY = 'USD';
const CURRENCY_OPTIONS = Object.freeze([
  'USD',
  'UGX',
  'KES',
  'TZS',
  'RWF',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
]);
const LOOKUP_RESULT_LIMIT = 30;

const HEART_RATE_BANDS = Object.freeze({
  NEONATE: { min: 100, max: 180, criticalLow: 80, criticalHigh: 200 },
  INFANT: { min: 100, max: 160, criticalLow: 80, criticalHigh: 190 },
  CHILD: { min: 70, max: 130, criticalLow: 55, criticalHigh: 160 },
  ADOLESCENT: { min: 60, max: 110, criticalLow: 45, criticalHigh: 145 },
  ADULT: { min: 60, max: 100, criticalLow: 45, criticalHigh: 140 },
});
const RESPIRATORY_RATE_BANDS = Object.freeze({
  NEONATE: { min: 30, max: 60, criticalLow: 20, criticalHigh: 70 },
  INFANT: { min: 30, max: 53, criticalLow: 18, criticalHigh: 65 },
  CHILD: { min: 20, max: 30, criticalLow: 12, criticalHigh: 45 },
  ADOLESCENT: { min: 12, max: 20, criticalLow: 8, criticalHigh: 30 },
  ADULT: { min: 12, max: 20, criticalLow: 8, criticalHigh: 30 },
});
const BLOOD_PRESSURE_BANDS = Object.freeze({
  NEONATE: {
    systolic: { min: 60, max: 90, criticalLow: 50, criticalHigh: 110 },
    diastolic: { min: 30, max: 60, criticalLow: 20, criticalHigh: 75 },
    map: { min: 45, max: 70, criticalLow: 35, criticalHigh: 85 },
  },
  INFANT: {
    systolic: { min: 70, max: 100, criticalLow: 55, criticalHigh: 125 },
    diastolic: { min: 35, max: 65, criticalLow: 25, criticalHigh: 80 },
    map: { min: 50, max: 75, criticalLow: 40, criticalHigh: 90 },
  },
  CHILD: {
    systolic: { min: 90, max: 110, criticalLow: 75, criticalHigh: 140 },
    diastolic: { min: 55, max: 75, criticalLow: 45, criticalHigh: 95 },
    map: { min: 60, max: 80, criticalLow: 45, criticalHigh: 100 },
  },
  ADOLESCENT: {
    systolic: { min: 95, max: 120, criticalLow: 80, criticalHigh: 160 },
    diastolic: { min: 60, max: 80, criticalLow: 50, criticalHigh: 105 },
    map: { min: 65, max: 90, criticalLow: 50, criticalHigh: 110 },
  },
  ADULT: {
    systolic: { min: 90, max: 120, criticalLow: 80, criticalHigh: 180 },
    diastolic: { min: 60, max: 80, criticalLow: 50, criticalHigh: 120 },
    map: { min: 70, max: 100, criticalLow: 55, criticalHigh: 130 },
  },
});
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

const FLOW_PROGRESS_STEPS = [
  {
    id: 'REGISTRATION_AND_QUEUE',
    labelKey: 'scheduling.opdFlow.progress.registrationAndQueue',
    stages: ['WAITING_CONSULTATION_PAYMENT', 'WAITING_VITALS'],
  },
  {
    id: 'TRIAGE_AND_ASSIGNMENT',
    labelKey: 'scheduling.opdFlow.progress.triageAndAssignment',
    stages: ['WAITING_DOCTOR_ASSIGNMENT'],
  },
  {
    id: 'DOCTOR_REVIEW',
    labelKey: 'scheduling.opdFlow.progress.doctorReview',
    stages: ['WAITING_DOCTOR_REVIEW'],
  },
  {
    id: 'ORDERS_AND_FOLLOW_THROUGH',
    labelKey: 'scheduling.opdFlow.progress.ordersAndFollowThrough',
    stages: [
      'LAB_REQUESTED',
      'RADIOLOGY_REQUESTED',
      'LAB_AND_RADIOLOGY_REQUESTED',
      'PHARMACY_REQUESTED',
      'WAITING_DISPOSITION',
    ],
  },
  {
    id: 'FINAL_DISPOSITION',
    labelKey: 'scheduling.opdFlow.progress.finalDisposition',
    stages: ['ADMITTED', 'DISCHARGED'],
  },
];
const FLOW_PROGRESS_TONE_BY_STEP = Object.freeze({
  REGISTRATION_AND_QUEUE: 'indigo',
  TRIAGE_AND_ASSIGNMENT: 'amber',
  DOCTOR_REVIEW: 'teal',
  ORDERS_AND_FOLLOW_THROUGH: 'violet',
  FINAL_DISPOSITION: 'green',
});
const CORRECTABLE_STAGE_OPTIONS = Array.from(
  new Set(FLOW_PROGRESS_STEPS.flatMap((step) => step.stages))
);

const ACTION_GUIDANCE_KEY_MAP = {
  PAY_CONSULTATION: 'scheduling.opdFlow.guidance.payConsultation',
  RECORD_VITALS: 'scheduling.opdFlow.guidance.recordVitals',
  ASSIGN_DOCTOR: 'scheduling.opdFlow.guidance.assignDoctor',
  DOCTOR_REVIEW: 'scheduling.opdFlow.guidance.doctorReview',
  DISPOSITION: 'scheduling.opdFlow.guidance.disposition',
};

const ACTION_REQUIREMENT_KEYS_MAP = {
  PAY_CONSULTATION: ['scheduling.opdFlow.guidance.requirements.paymentMethod'],
  RECORD_VITALS: ['scheduling.opdFlow.guidance.requirements.vitals'],
  ASSIGN_DOCTOR: ['scheduling.opdFlow.guidance.requirements.provider'],
  DOCTOR_REVIEW: ['scheduling.opdFlow.guidance.requirements.reviewNote'],
  DISPOSITION: ['scheduling.opdFlow.guidance.requirements.disposition'],
};

const TIMELINE_EVENT_LABEL_KEY_MAP = {
  FLOW_STARTED: 'scheduling.opdFlow.timeline.events.FLOW_STARTED',
  CONSULTATION_INVOICE_CREATED: 'scheduling.opdFlow.timeline.events.CONSULTATION_INVOICE_CREATED',
  CONSULTATION_PAYMENT_RECORDED: 'scheduling.opdFlow.timeline.events.CONSULTATION_PAYMENT_RECORDED',
  EMERGENCY_CASE_OPENED: 'scheduling.opdFlow.timeline.events.EMERGENCY_CASE_OPENED',
  VITALS_RECORDED: 'scheduling.opdFlow.timeline.events.VITALS_RECORDED',
  DOCTOR_ASSIGNED: 'scheduling.opdFlow.timeline.events.DOCTOR_ASSIGNED',
  DOCTOR_REVIEW_COMPLETED: 'scheduling.opdFlow.timeline.events.DOCTOR_REVIEW_COMPLETED',
  DISPOSITION_RECORDED: 'scheduling.opdFlow.timeline.events.DISPOSITION_RECORDED',
  STAGE_CORRECTED: 'scheduling.opdFlow.timeline.events.STAGE_CORRECTED',
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
  systolic_value: '',
  diastolic_value: '',
  map_value: '',
  map_is_manual: false,
  unit: VITAL_DEFAULT_UNIT_BY_TYPE.TEMPERATURE,
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
const DEFAULT_STAGE_CORRECTION_DRAFT = {
  stage_to: '',
  reason: '',
};

const sanitizeString = (value) => String(value || '').trim();
const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUuidLike = (value) => UUID_LIKE_REGEX.test(sanitizeString(value));
const FRIENDLY_ID_REGEX = /^[A-Za-z][A-Za-z0-9_-]*$/;
const isFriendlyIdentifier = (value) => FRIENDLY_ID_REGEX.test(sanitizeString(value));
const toFriendlyScopeIdentifier = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized || isUuidLike(normalized) || !isFriendlyIdentifier(normalized)) return '';
  return normalized;
};
const resolveScopeEntityPublicId = (record) => {
  const candidates = [
    record?.human_friendly_id,
    record?.humanFriendlyId,
    record?.id,
  ];
  for (const candidate of candidates) {
    const publicId = toFriendlyScopeIdentifier(candidate);
    if (publicId) return publicId;
  }
  return '';
};
const areSameIdentifiers = (left, right) =>
  sanitizeString(left).toUpperCase() === sanitizeString(right).toUpperCase();

const toFiniteNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseBloodPressure = (value) => {
  const match = String(value || '').trim().match(/^(\d{2,3}(?:\.\d{1,2})?)\s*\/\s*(\d{2,3}(?:\.\d{1,2})?)$/);
  if (!match) return null;
  const systolic = toFiniteNumber(match[1]);
  const diastolic = toFiniteNumber(match[2]);
  if (!systolic || !diastolic) return null;
  return { systolic, diastolic };
};

const roundToTwo = (value) => {
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 100) / 100;
};

const formatNumericValue = (value) => {
  const numericValue = roundToTwo(toFiniteNumber(value));
  if (!Number.isFinite(numericValue)) return '';
  return Number.isInteger(numericValue) ? String(numericValue) : String(numericValue);
};

const computeMapFromComponents = (systolic, diastolic) => {
  const systolicValue = toFiniteNumber(systolic);
  const diastolicValue = toFiniteNumber(diastolic);
  if (!Number.isFinite(systolicValue) || !Number.isFinite(diastolicValue)) return null;
  return roundToTwo((systolicValue + 2 * diastolicValue) / 3);
};

const resolveAutoMapText = (systolic, diastolic) => formatNumericValue(computeMapFromComponents(systolic, diastolic));

const convertTemperatureToC = (numericValue, unit) => {
  if (numericValue == null) return null;
  const normalizedUnit = sanitizeString(unit || '').toUpperCase();
  if (normalizedUnit === 'F') {
    return ((numericValue - 32) * 5) / 9;
  }
  if (normalizedUnit === 'K') {
    return numericValue - 273.15;
  }
  return numericValue;
};

const convertPressureToMmHg = (numericValue, unit) => {
  if (numericValue == null) return null;
  const normalizedUnit = sanitizeString(unit || '').toLowerCase();
  if (normalizedUnit === 'kpa') {
    return numericValue * 7.50062;
  }
  return numericValue;
};

const convertWeightToKg = (numericValue, unit) => {
  if (numericValue == null) return null;
  const normalizedUnit = sanitizeString(unit || '').toLowerCase();
  if (normalizedUnit === 'g') return numericValue / 1000;
  if (normalizedUnit === 'lb') return numericValue * 0.45359237;
  if (normalizedUnit === 'oz') return numericValue * 0.028349523125;
  return numericValue;
};

const convertHeightToCm = (numericValue, unit) => {
  if (numericValue == null) return null;
  const normalizedUnit = sanitizeString(unit || '').toLowerCase();
  if (normalizedUnit === 'm') return numericValue * 100;
  if (normalizedUnit === 'in') return numericValue * 2.54;
  if (normalizedUnit === 'ft') return numericValue * 30.48;
  return numericValue;
};

const convertOxygenToPercent = (numericValue, unit) => {
  if (numericValue == null) return null;
  const normalizedUnit = sanitizeString(unit || '').toLowerCase();
  if (normalizedUnit === 'fraction') return numericValue * 100;
  return numericValue;
};

const resolveAgeInYears = (patient = null) => {
  const dateValue =
    patient?.date_of_birth ||
    patient?.dob ||
    patient?.birth_date ||
    patient?.dateOfBirth ||
    patient?.birthDate ||
    '';
  const parsed = dateValue ? new Date(dateValue) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - parsed.getFullYear();
  const monthDelta = now.getMonth() - parsed.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < parsed.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
};

const resolveAgeProfile = (patient = null) => {
  const dateValue =
    patient?.date_of_birth ||
    patient?.dob ||
    patient?.birth_date ||
    patient?.dateOfBirth ||
    patient?.birthDate ||
    '';
  const parsed = dateValue ? new Date(dateValue) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return null;

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const ageDays = Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / dayMs));

  let ageMonths = (now.getFullYear() - parsed.getFullYear()) * 12 + (now.getMonth() - parsed.getMonth());
  if (now.getDate() < parsed.getDate()) ageMonths -= 1;
  ageMonths = Math.max(0, ageMonths);

  let ageYears = now.getFullYear() - parsed.getFullYear();
  const monthDelta = now.getMonth() - parsed.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < parsed.getDate())) {
    ageYears -= 1;
  }
  ageYears = ageYears >= 0 ? ageYears : 0;

  return {
    days: ageDays,
    months: ageMonths,
    years: ageYears,
  };
};

const resolveAgeBand = (ageProfile) => {
  if (!ageProfile) return 'ADULT';
  if (ageProfile.days <= 28) return 'NEONATE';
  if (ageProfile.months <= 11) return 'INFANT';
  if (ageProfile.years <= 12) return 'CHILD';
  if (ageProfile.years <= 17) return 'ADOLESCENT';
  return 'ADULT';
};

const evaluateRangeStatus = (value, range) => {
  if (!Number.isFinite(value) || !range) return 'INCOMPLETE';
  if (value < range.criticalLow || value > range.criticalHigh) return 'CRITICAL';
  if (value < range.min || value > range.max) return 'ABNORMAL';
  return 'NORMAL';
};

const mergeStatuses = (...statuses) =>
  statuses.reduce((highest, status) => {
    const nextStatus = String(status || 'INCOMPLETE').toUpperCase();
    if ((STATUS_PRIORITY[nextStatus] || 0) > (STATUS_PRIORITY[highest] || 0)) {
      return nextStatus;
    }
    return highest;
  }, 'INCOMPLETE');

const resolveVitalReference = (vitalType, ageBand) => {
  if (vitalType === 'HEART_RATE') return HEART_RATE_BANDS[ageBand] || HEART_RATE_BANDS.ADULT;
  if (vitalType === 'RESPIRATORY_RATE') return RESPIRATORY_RATE_BANDS[ageBand] || RESPIRATORY_RATE_BANDS.ADULT;
  if (vitalType === 'BLOOD_PRESSURE') return BLOOD_PRESSURE_BANDS[ageBand] || BLOOD_PRESSURE_BANDS.ADULT;
  return null;
};

const resolveVitalUnitOptions = (vitalType) => VITAL_UNIT_OPTIONS_BY_TYPE[vitalType] || [];

const resolveBloodPressureComponents = (row) => {
  const systolic = toFiniteNumber(row?.systolic_value);
  const diastolic = toFiniteNumber(row?.diastolic_value);
  const mapValue = toFiniteNumber(row?.map_value);

  if (Number.isFinite(systolic) && Number.isFinite(diastolic)) {
    return {
      systolic,
      diastolic,
      mapValue: Number.isFinite(mapValue) ? mapValue : computeMapFromComponents(systolic, diastolic),
    };
  }

  const parsedLegacy = parseBloodPressure(row?.value);
  if (!parsedLegacy) {
    return {
      systolic: null,
      diastolic: null,
      mapValue: Number.isFinite(mapValue) ? mapValue : null,
    };
  }

  return {
    systolic: parsedLegacy.systolic,
    diastolic: parsedLegacy.diastolic,
    mapValue: Number.isFinite(mapValue)
      ? mapValue
      : computeMapFromComponents(parsedLegacy.systolic, parsedLegacy.diastolic),
  };
};

const resolveVitalInsight = (row, ageProfile) => {
  const vitalType = sanitizeString(row?.vital_type || '').toUpperCase();
  const unit = sanitizeString(row?.unit) || VITAL_DEFAULT_UNIT_BY_TYPE[vitalType] || '';
  const valueText = sanitizeString(row?.value);
  if (!vitalType) {
    return {
      status: 'INCOMPLETE',
      badgeVariant: 'primary',
      rangeTextKey: 'scheduling.opdFlow.vitals.range.awaitingValue',
    };
  }

  const ageBand = resolveAgeBand(ageProfile);
  if (vitalType === 'TEMPERATURE') {
    if (!valueText) {
      return {
        status: 'INCOMPLETE',
        badgeVariant: 'primary',
        rangeTextKey: 'scheduling.opdFlow.vitals.range.awaitingValue',
      };
    }
    const celsius = convertTemperatureToC(toFiniteNumber(valueText), unit);
    const range = { min: 36.0, max: 37.5, criticalLow: 35.0, criticalHigh: 39.5 };
    const status = evaluateRangeStatus(celsius, range);
    return {
      status,
      badgeVariant: status === 'NORMAL' ? 'success' : status === 'CRITICAL' ? 'error' : 'warning',
      rangeText: '36.0-37.5 C',
    };
  }

  if (vitalType === 'HEART_RATE' || vitalType === 'RESPIRATORY_RATE') {
    if (!valueText) {
      return {
        status: 'INCOMPLETE',
        badgeVariant: 'primary',
        rangeTextKey: 'scheduling.opdFlow.vitals.range.awaitingValue',
      };
    }
    const numericValue = toFiniteNumber(valueText);
    const reference = resolveVitalReference(vitalType, ageBand);
    const status = evaluateRangeStatus(numericValue, reference);
    return {
      status,
      badgeVariant: status === 'NORMAL' ? 'success' : status === 'CRITICAL' ? 'error' : 'warning',
      rangeText: reference ? `${reference.min}-${reference.max}` : '',
    };
  }

  if (vitalType === 'OXYGEN_SATURATION') {
    if (!valueText) {
      return {
        status: 'INCOMPLETE',
        badgeVariant: 'primary',
        rangeTextKey: 'scheduling.opdFlow.vitals.range.awaitingValue',
      };
    }
    const numericValue = convertOxygenToPercent(toFiniteNumber(valueText), unit);
    const range = { min: 95, max: 100, criticalLow: 90, criticalHigh: 100 };
    const status = evaluateRangeStatus(numericValue, range);
    return {
      status,
      badgeVariant: status === 'NORMAL' ? 'success' : status === 'CRITICAL' ? 'error' : 'warning',
      rangeText: '95-100%',
    };
  }

  if (vitalType === 'BLOOD_PRESSURE') {
    const components = resolveBloodPressureComponents(row);
    if (!Number.isFinite(components.systolic) || !Number.isFinite(components.diastolic)) {
      return {
        status: 'INCOMPLETE',
        badgeVariant: 'primary',
        rangeTextKey: 'scheduling.opdFlow.vitals.range.bloodPressureFormat',
      };
    }
    const reference = resolveVitalReference(vitalType, ageBand);
    const systolicMmHg = convertPressureToMmHg(components.systolic, unit);
    const diastolicMmHg = convertPressureToMmHg(components.diastolic, unit);
    const mapMmHg = convertPressureToMmHg(components.mapValue, unit);
    const systolicStatus = evaluateRangeStatus(systolicMmHg, reference?.systolic || null);
    const diastolicStatus = evaluateRangeStatus(diastolicMmHg, reference?.diastolic || null);
    const mapStatus = evaluateRangeStatus(mapMmHg, reference?.map || null);
    const status = mergeStatuses(systolicStatus, diastolicStatus, mapStatus);
    return {
      status,
      badgeVariant: status === 'NORMAL' ? 'success' : status === 'CRITICAL' ? 'error' : 'warning',
      rangeText: reference
        ? `${reference.systolic.min}-${reference.systolic.max} / ${reference.diastolic.min}-${reference.diastolic.max} (MAP ${reference.map.min}-${reference.map.max})`
        : '',
    };
  }

  if (vitalType === 'BMI') {
    if (!valueText) {
      return {
        status: 'INCOMPLETE',
        badgeVariant: 'primary',
        rangeTextKey: 'scheduling.opdFlow.vitals.range.awaitingValue',
      };
    }
    const numericValue = toFiniteNumber(valueText);
    const range = { min: 18.5, max: 24.9, criticalLow: 16, criticalHigh: 35 };
    const status = evaluateRangeStatus(numericValue, range);
    return {
      status,
      badgeVariant: status === 'NORMAL' ? 'success' : status === 'CRITICAL' ? 'error' : 'warning',
      rangeText: '18.5-24.9',
    };
  }

  if (vitalType === 'WEIGHT') {
    if (!valueText) {
      return {
        status: 'INCOMPLETE',
        badgeVariant: 'primary',
        rangeTextKey: 'scheduling.opdFlow.vitals.range.awaitingValue',
      };
    }
    const numericValue = convertWeightToKg(toFiniteNumber(valueText), unit);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      return {
        status: 'ABNORMAL',
        badgeVariant: 'warning',
        rangeTextKey: 'scheduling.opdFlow.vitals.range.weightPositive',
      };
    }
    return {
      status: 'NORMAL',
      badgeVariant: 'success',
      rangeTextKey: 'scheduling.opdFlow.vitals.range.weightRecorded',
    };
  }

  if (vitalType === 'HEIGHT') {
    if (!valueText) {
      return {
        status: 'INCOMPLETE',
        badgeVariant: 'primary',
        rangeTextKey: 'scheduling.opdFlow.vitals.range.awaitingValue',
      };
    }
    const numericValue = convertHeightToCm(toFiniteNumber(valueText), unit);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      return {
        status: 'ABNORMAL',
        badgeVariant: 'warning',
        rangeTextKey: 'scheduling.opdFlow.vitals.range.heightPositive',
      };
    }
    return {
      status: 'NORMAL',
      badgeVariant: 'success',
      rangeTextKey: 'scheduling.opdFlow.vitals.range.heightRecorded',
    };
  }

  return {
    status: 'INCOMPLETE',
    badgeVariant: 'primary',
    rangeTextKey: 'scheduling.opdFlow.vitals.range.awaitingValue',
  };
};

const normalizeScalarParam = (value) => {
  if (Array.isArray(value)) return sanitizeString(value[0]);
  return sanitizeString(value);
};

const resolveEncounterPublicId = (value) => {
  const fromValue = sanitizeString(value?.human_friendly_id);
  if (fromValue && !isUuidLike(fromValue)) return fromValue;
  const fromEncounter = sanitizeString(value?.encounter?.human_friendly_id);
  if (fromEncounter && !isUuidLike(fromEncounter)) return fromEncounter;
  const fromFlow = sanitizeString(value?.linked_record_ids?.encounter_id);
  if (fromFlow && !isUuidLike(fromFlow)) return fromFlow;
  return '';
};

const resolveEncounterIdentifier = (value) => {
  const publicId = resolveEncounterPublicId(value);
  if (publicId) return publicId;
  return '';
};

const resolveEncounterInternalId = (value) => {
  const fromValue = sanitizeString(value?.id);
  if (fromValue) return fromValue;
  const fromEncounter = sanitizeString(value?.encounter?.id);
  if (fromEncounter) return fromEncounter;
  const fromFlow = sanitizeString(value?.flow?.encounter_id);
  if (fromFlow) return fromFlow;
  return '';
};

const matchesEncounterIdentifier = (value, identifier) => {
  const normalizedIdentifier = sanitizeString(identifier);
  if (!normalizedIdentifier) return false;

  const candidates = new Set([
    resolveEncounterIdentifier(value),
    resolveEncounterInternalId(value),
    sanitizeString(value?.linked_record_ids?.encounter_id),
  ].filter(Boolean));

  return candidates.has(normalizedIdentifier);
};

const resolveListItems = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const resolveCurrencyFromExtension = (extension) => {
  if (!extension || typeof extension !== 'object') return '';

  const candidates = [
    extension.currency,
    extension.default_currency,
    extension.defaultCurrency,
    extension?.settings?.currency,
    extension?.settings?.default_currency,
    extension?.settings?.defaultCurrency,
    extension?.billing?.currency,
    extension?.billing?.default_currency,
    extension?.billing?.defaultCurrency,
    extension?.preferences?.currency,
    extension?.preferences?.default_currency,
    extension?.preferences?.defaultCurrency,
  ];

  const matched = candidates.find((value) => sanitizeString(value));
  return sanitizeString(matched).toUpperCase();
};

const resolvePatientDisplayName = (patient) => {
  const firstName = sanitizeString(patient?.first_name || patient?.firstName);
  const lastName = sanitizeString(patient?.last_name || patient?.lastName);
  return [firstName, lastName].filter(Boolean).join(' ').trim();
};

const resolvePatientPublicId = (patient) =>
  sanitizeString(patient?.human_friendly_id || patient?.humanFriendlyId);

const resolveProviderName = (staffProfile) => {
  const profile = staffProfile?.user?.profile || {};
  const firstName = sanitizeString(profile.first_name || profile.firstName);
  const lastName = sanitizeString(profile.last_name || profile.lastName);
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (fullName) return fullName;

  return sanitizeString(staffProfile?.user?.email || staffProfile?.user?.phone);
};

const resolveProviderPublicId = (staffProfile) =>
  sanitizeString(staffProfile?.user?.human_friendly_id || staffProfile?.user?.humanFriendlyId);

const uniqueSelectOptions = (options = []) => {
  const seen = new Set();
  return options.filter((option) => {
    const value = sanitizeString(option?.value);
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

const formatRelativeTime = (isoValue, locale = 'en') => {
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return '';

  const deltaMs = parsed.getTime() - Date.now();
  const absDeltaMs = Math.abs(deltaMs);
  const minuteMs = 60000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  let unit = 'minute';
  let value = Math.round(deltaMs / minuteMs);

  if (absDeltaMs >= dayMs) {
    unit = 'day';
    value = Math.round(deltaMs / dayMs);
  } else if (absDeltaMs >= hourMs) {
    unit = 'hour';
    value = Math.round(deltaMs / hourMs);
  }

  try {
    const formatter = new Intl.RelativeTimeFormat(locale || 'en', { numeric: 'auto' });
    return formatter.format(value, unit);
  } catch {
    return '';
  }
};

const useOpdFlowWorkbenchScreen = () => {
  const { t, locale } = useI18n();
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
    canCorrectStage,
    canDisposition,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useOpdFlowAccess();

  const {
    list: listOpdFlows,
    get: getOpdFlow,
    start: startOpdFlow,
    payConsultation,
    recordVitals,
    assignDoctor,
    doctorReview,
    disposition,
    correctStage,
    reset: resetOpdFlowCrud,
    isLoading: isCrudLoading,
    errorCode,
  } = useOpdFlow();
  const { get: getPatientRecord, list: listPatientRecords } = usePatient();
  const { get: getAppointmentRecord } = useAppointment();
  const { list: listStaffProfiles } = useStaffProfile();
  const { get: getFacilityRecord } = useFacility();
  const { get: getTenantRecord } = useTenant();

  const [flowList, setFlowList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedFlowId, setSelectedFlowId] = useState('');
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [isStartFormOpen, setIsStartFormOpen] = useState(false);
  const [isStartAdvancedOpen, setIsStartAdvancedOpen] = useState(false);
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
  const [startLinkedPatient, setStartLinkedPatient] = useState(null);
  const [startLinkedAppointment, setStartLinkedAppointment] = useState(null);
  const [isPatientLookupLoading, setIsPatientLookupLoading] = useState(false);
  const [isAppointmentLookupLoading, setIsAppointmentLookupLoading] = useState(false);
  const [isPatientSearchLoading, setIsPatientSearchLoading] = useState(false);
  const [isProviderSearchLoading, setIsProviderSearchLoading] = useState(false);
  const [startLookupError, setStartLookupError] = useState('');
  const [globalCurrency, setGlobalCurrency] = useState(DEFAULT_CURRENCY);
  const [startPatientSearchText, setStartPatientSearchText] = useState('');
  const [startProviderSearchText, setStartProviderSearchText] = useState('');
  const [assignProviderSearchText, setAssignProviderSearchText] = useState('');
  const [flowSearchText, setFlowSearchText] = useState('');
  const [debouncedFlowSearch, setDebouncedFlowSearch] = useState('');
  const [startPatientOptions, setStartPatientOptions] = useState([]);
  const [providerOptions, setProviderOptions] = useState([]);
  const [isCorrectionDialogOpen, setIsCorrectionDialogOpen] = useState(false);
  const [stageCorrectionDraft, setStageCorrectionDraft] = useState(DEFAULT_STAGE_CORRECTION_DRAFT);
  const [scopeTenantId, setScopeTenantId] = useState('');
  const [scopeFacilityId, setScopeFacilityId] = useState('');
  const [isScopeResolved, setIsScopeResolved] = useState(false);
  const lastRealtimeRefreshRef = useRef(0);

  const rawTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const rawFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);

  useEffect(() => {
    if (!isResolved) {
      setIsScopeResolved(false);
      return;
    }

    if (canManageAllTenants) {
      setScopeTenantId('');
      setScopeFacilityId('');
      setIsScopeResolved(true);
      return;
    }

    let isDisposed = false;
    setIsScopeResolved(false);

    const resolveScopeIdentifiers = async () => {
      let nextTenantId = toFriendlyScopeIdentifier(rawTenantId);
      let nextFacilityId = toFriendlyScopeIdentifier(rawFacilityId);

      if (!nextTenantId && rawTenantId) {
        try {
          const tenantRecord = await getTenantRecord(rawTenantId);
          nextTenantId = resolveScopeEntityPublicId(tenantRecord);
        } catch (_error) {
          nextTenantId = '';
        }
      }

      if (!nextFacilityId && rawFacilityId) {
        try {
          const facilityRecord = await getFacilityRecord(rawFacilityId);
          nextFacilityId = resolveScopeEntityPublicId(facilityRecord);
        } catch (_error) {
          nextFacilityId = '';
        }
      }

      if (!isDisposed) {
        setScopeTenantId(nextTenantId);
        setScopeFacilityId(nextFacilityId);
        setIsScopeResolved(true);
      }
    };

    resolveScopeIdentifiers().catch(() => {
      if (!isDisposed) {
        setScopeTenantId('');
        setScopeFacilityId('');
        setIsScopeResolved(true);
      }
    });

    return () => {
      isDisposed = true;
    };
  }, [
    canManageAllTenants,
    getFacilityRecord,
    getTenantRecord,
    isResolved,
    rawFacilityId,
    rawTenantId,
  ]);

  const hasScope = canManageAllTenants || Boolean(scopeTenantId);
  const canViewWorkbench = isResolved && isScopeResolved && canAccessOpdFlow && hasScope;
  const patientLookupParams = useMemo(() => {
    const params = { limit: LOOKUP_RESULT_LIMIT, sort_by: 'updated_at', order: 'desc' };
    if (!canManageAllTenants && scopeTenantId) {
      params.tenant_id = scopeTenantId;
    }
    if (!canManageAllTenants && scopeFacilityId) {
      params.facility_id = scopeFacilityId;
    }
    return params;
  }, [canManageAllTenants, scopeFacilityId, scopeTenantId]);
  const providerLookupParams = useMemo(() => {
    const params = { limit: LOOKUP_RESULT_LIMIT, sort_by: 'updated_at', order: 'desc' };
    if (!canManageAllTenants && scopeTenantId) {
      params.tenant_id = scopeTenantId;
    }
    return params;
  }, [canManageAllTenants, scopeTenantId]);

  const currencyOptions = useMemo(() => {
    const options = [...CURRENCY_OPTIONS, sanitizeString(globalCurrency).toUpperCase()].filter(Boolean);
    return Array.from(new Set(options));
  }, [globalCurrency]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFlowSearch(sanitizeString(flowSearchText));
    }, 280);
    return () => clearTimeout(timer);
  }, [flowSearchText]);

  const mapPatientToOption = useCallback(
    (patient) => {
      const patientPublicId = resolvePatientPublicId(patient);
      if (!patientPublicId) return null;

      const patientName = resolvePatientDisplayName(patient) || t('scheduling.opdFlow.start.patientUnknown');
      const phone = sanitizeString(patient?.phone || patient?.contact_phone || patient?.primary_phone);
      const label = [patientName, patientPublicId, phone].filter(Boolean).join(' | ');
      return {
        value: patientPublicId,
        label: label || patientPublicId,
      };
    },
    [t]
  );

  const mapProviderToOption = useCallback(
    (staffProfile) => {
      const providerPublicId = resolveProviderPublicId(staffProfile);
      if (!providerPublicId) return null;

      const providerName = resolveProviderName(staffProfile) || t('scheduling.opdFlow.start.providerUnknown');
      const practitionerType = sanitizeString(staffProfile?.practitioner_type);
      const position = sanitizeString(staffProfile?.position);
      const contact = sanitizeString(staffProfile?.user?.phone || staffProfile?.user?.email);
      const roleLabel = position || practitionerType;
      const label = [providerName, providerPublicId, roleLabel, contact].filter(Boolean).join(' | ');

      return {
        value: providerPublicId,
        label: label || providerPublicId,
      };
    },
    [t]
  );

  useEffect(() => {
    if (!isResolved || isOffline) return;
    let isDisposed = false;

    const hydrateCurrency = async () => {
      const facilityLookupId = rawFacilityId || scopeFacilityId;
      const tenantLookupId = rawTenantId || scopeTenantId;
      const facilityCurrency =
        facilityLookupId && sanitizeString(facilityLookupId)
          ? resolveCurrencyFromExtension((await getFacilityRecord(facilityLookupId))?.extension_json)
          : '';
      if (facilityCurrency) {
        if (!isDisposed) setGlobalCurrency(facilityCurrency);
        return;
      }

      const tenantCurrency =
        tenantLookupId && sanitizeString(tenantLookupId)
          ? resolveCurrencyFromExtension((await getTenantRecord(tenantLookupId))?.extension_json)
          : '';
      if (!isDisposed) {
        setGlobalCurrency(tenantCurrency || DEFAULT_CURRENCY);
      }
    };

    hydrateCurrency().catch(() => {
      if (!isDisposed) setGlobalCurrency(DEFAULT_CURRENCY);
    });

    return () => {
      isDisposed = true;
    };
  }, [
    getFacilityRecord,
    getTenantRecord,
    isOffline,
    isResolved,
    rawFacilityId,
    rawTenantId,
    scopeFacilityId,
    scopeTenantId,
  ]);

  useEffect(() => {
    setStartDraft((previous) => {
      const currentCurrency = sanitizeString(previous.currency).toUpperCase();
      if (currentCurrency && currentCurrency !== DEFAULT_CURRENCY) return previous;
      return {
        ...previous,
        currency: globalCurrency,
      };
    });
    setPaymentDraft((previous) => {
      const currentCurrency = sanitizeString(previous.currency).toUpperCase();
      if (currentCurrency && currentCurrency !== DEFAULT_CURRENCY) return previous;
      return {
        ...previous,
        currency: globalCurrency,
      };
    });
  }, [globalCurrency]);

  useEffect(() => {
    if (isOffline || !canViewWorkbench) return;
    let isDisposed = false;

    const timer = setTimeout(async () => {
      setIsPatientSearchLoading(true);
      try {
        const query = sanitizeString(startPatientSearchText);
        const listResponse = await listPatientRecords({
          ...patientLookupParams,
          search: query || undefined,
        });
        const records = resolveListItems(listResponse);
        const options = uniqueSelectOptions(records.map(mapPatientToOption).filter(Boolean));
        if (!isDisposed) {
          setStartPatientOptions(options);
        }
      } catch (_error) {
        if (!isDisposed) setStartPatientOptions([]);
      } finally {
        if (!isDisposed) setIsPatientSearchLoading(false);
      }
    }, 280);

    return () => {
      isDisposed = true;
      clearTimeout(timer);
    };
  }, [canViewWorkbench, isOffline, listPatientRecords, mapPatientToOption, patientLookupParams, startPatientSearchText]);

  useEffect(() => {
    if (isOffline || !canViewWorkbench) return;
    let isDisposed = false;

    const timer = setTimeout(async () => {
      setIsProviderSearchLoading(true);
      try {
        const query = sanitizeString(startProviderSearchText || assignProviderSearchText);
        const listResponse = await listStaffProfiles({
          ...providerLookupParams,
          search: query || undefined,
        });
        const records = resolveListItems(listResponse);
        const options = uniqueSelectOptions(records.map(mapProviderToOption).filter(Boolean));
        if (!isDisposed) {
          setProviderOptions(options);
        }
      } catch (_error) {
        if (!isDisposed) setProviderOptions([]);
      } finally {
        if (!isDisposed) setIsProviderSearchLoading(false);
      }
    }, 280);

    return () => {
      isDisposed = true;
      clearTimeout(timer);
    };
  }, [
    assignProviderSearchText,
    canViewWorkbench,
    isOffline,
    listStaffProfiles,
    mapProviderToOption,
    providerLookupParams,
    startProviderSearchText,
  ]);

  const resolvePatientLookup = useCallback(
    async (identifier, { silent = true } = {}) => {
      const normalizedIdentifier = sanitizeString(identifier);
      if (!normalizedIdentifier || isOffline) return null;

      setIsPatientLookupLoading(true);
      if (!silent) setStartLookupError('');
      try {
        let patient = null;
        try {
          patient = await getPatientRecord(normalizedIdentifier);
        } catch (_error) {
          patient = null;
        }

        if (!patient) {
          const listResponse = await listPatientRecords({
            ...patientLookupParams,
            search: normalizedIdentifier,
          });
          const items = resolveListItems(listResponse);
          const normalizedUpper = normalizedIdentifier.toUpperCase();
          patient =
            items.find((item) => sanitizeString(item?.human_friendly_id).toUpperCase() === normalizedUpper) ||
            items.find((item) => sanitizeString(item?.id) === normalizedIdentifier) ||
            items[0] ||
            null;
        }

        if (!patient) {
          setStartLinkedPatient(null);
          if (!silent) {
            setStartLookupError(t('scheduling.opdFlow.start.patientNotFound'));
          }
          return null;
        }

        setStartLinkedPatient(patient);
        const patientPublicId = resolvePatientPublicId(patient);
        setStartDraft((previous) => ({
          ...previous,
          patient_id: patientPublicId || previous.patient_id,
          first_name: sanitizeString(previous.first_name) || sanitizeString(patient?.first_name),
          last_name: sanitizeString(previous.last_name) || sanitizeString(patient?.last_name),
        }));
        setStartPatientSearchText(resolvePatientDisplayName(patient));
        return patient;
      } catch (_error) {
        if (!silent) {
          setStartLookupError(t('scheduling.opdFlow.start.patientLookupFailed'));
        }
        return null;
      } finally {
        setIsPatientLookupLoading(false);
      }
    },
    [getPatientRecord, isOffline, listPatientRecords, patientLookupParams, t]
  );

  const resolveAppointmentLookup = useCallback(
    async (identifier, { silent = true } = {}) => {
      const normalizedIdentifier = sanitizeString(identifier);
      if (!normalizedIdentifier || isOffline) return null;

      setIsAppointmentLookupLoading(true);
      if (!silent) setStartLookupError('');
      try {
        const appointment = await getAppointmentRecord(normalizedIdentifier);
        if (!appointment) {
          setStartLinkedAppointment(null);
          if (!silent) {
            setStartLookupError(t('scheduling.opdFlow.start.appointmentNotFound'));
          }
          return null;
        }

        setStartLinkedAppointment(appointment);
        const appointmentPatientPublicId =
          resolvePatientPublicId(appointment?.patient) ||
          sanitizeString(appointment?.patient_human_friendly_id);
        const appointmentProviderPublicId =
          sanitizeString(appointment?.provider?.human_friendly_id) ||
          sanitizeString(appointment?.provider_human_friendly_id);
        const appointmentPublicId = sanitizeString(appointment?.human_friendly_id);
        setStartDraft((previous) => ({
          ...previous,
          appointment_id: appointmentPublicId || previous.appointment_id,
          patient_id: sanitizeString(previous.patient_id) || appointmentPatientPublicId,
          provider_user_id:
            sanitizeString(previous.provider_user_id) ||
            appointmentProviderPublicId,
        }));
        return appointment;
      } catch (_error) {
        if (!silent) {
          setStartLookupError(t('scheduling.opdFlow.start.appointmentLookupFailed'));
        }
        return null;
      } finally {
        setIsAppointmentLookupLoading(false);
      }
    },
    [getAppointmentRecord, isOffline, t]
  );

  useEffect(() => {
    if (!isResolved || !isScopeResolved) return;
    if (!canAccessOpdFlow || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, isScopeResolved, canAccessOpdFlow, hasScope, router]);

  useEffect(() => {
    if (!requestedFlowId) return;
    if (isUuidLike(requestedFlowId)) {
      router.replace('/scheduling/opd-flows');
      return;
    }
    setSelectedFlowId(requestedFlowId);
  }, [requestedFlowId, router]);

  useEffect(() => {
    if (startDraft.arrival_mode !== 'ONLINE_APPOINTMENT') {
      setStartLinkedAppointment(null);
      return undefined;
    }
    const appointmentIdentifier = sanitizeString(startDraft.appointment_id);
    if (!appointmentIdentifier || isOffline) {
      return undefined;
    }

    const timer = setTimeout(() => {
      resolveAppointmentLookup(appointmentIdentifier, { silent: true });
    }, 350);

    return () => clearTimeout(timer);
  }, [
    isOffline,
    resolveAppointmentLookup,
    startDraft.appointment_id,
    startDraft.arrival_mode,
  ]);

  const upsertFlowInList = useCallback((snapshot) => {
    const snapshotId = resolveEncounterIdentifier(snapshot);
    if (!snapshotId) return;
    setFlowList((previous) => {
      const index = previous.findIndex((item) => resolveEncounterIdentifier(item) === snapshotId);
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
    if (debouncedFlowSearch) {
      params.search = debouncedFlowSearch;
    }

    if (!canManageAllTenants) {
      params.tenant_id = scopeTenantId;
      if (scopeFacilityId) {
        params.facility_id = scopeFacilityId;
      }
    }

    resetOpdFlowCrud();
    const result = await listOpdFlows(params);
    if (!result) return;
    const items = resolveListItems(result);
    setFlowList(items);
    setPagination(result?.pagination || null);
    if (items.length > 0) {
      setSelectedFlowId((previous) => {
        if (previous && !isUuidLike(previous)) return previous;
        return resolveEncounterPublicId(items[0]) || '';
      });
    }
  }, [
    canViewWorkbench,
    canManageAllTenants,
    debouncedFlowSearch,
    isOffline,
    scopeTenantId,
    scopeFacilityId,
    resetOpdFlowCrud,
    listOpdFlows,
  ]);

  const loadSelectedFlow = useCallback(async () => {
    if (!canViewWorkbench || !selectedFlowId || isUuidLike(selectedFlowId) || isOffline) return;
    const snapshot = await getOpdFlow(selectedFlowId);
    if (!snapshot) return;
    setSelectedFlow(snapshot);
    upsertFlowInList(snapshot);
  }, [canViewWorkbench, isOffline, getOpdFlow, selectedFlowId, upsertFlowInList]);

  useEffect(() => {
    loadFlowList();
  }, [loadFlowList]);

  useEffect(() => {
    loadSelectedFlow();
  }, [loadSelectedFlow]);

  const refreshFromRealtimeEvent = useCallback(
    async (encounterIdentifier) => {
      const now = Date.now();
      if (now - lastRealtimeRefreshRef.current < 750) return;
      lastRealtimeRefreshRef.current = now;

      if (encounterIdentifier && selectedFlowId && encounterIdentifier === selectedFlowId) {
        await loadSelectedFlow();
        return;
      }

      await loadFlowList();
      if (encounterIdentifier && !isUuidLike(encounterIdentifier) && !selectedFlowId) {
        setSelectedFlowId(encounterIdentifier);
      }
    },
    [loadFlowList, loadSelectedFlow, selectedFlowId]
  );

  const handleRealtimeOpdUpdate = useCallback(
    (payload = {}) => {
      if (!canViewWorkbench || isOffline) return;

      const eventTenantId = sanitizeString(payload?.tenant_id);
      const eventFacilityId = sanitizeString(payload?.facility_id);
      const encounterPublicId = sanitizeString(payload?.encounter_public_id);
      const encounterInternalId = sanitizeString(payload?.encounter_id);
      const encounterIdentifier = encounterPublicId || encounterInternalId;

      if (!encounterIdentifier) return;

      if (!canManageAllTenants) {
        if (scopeTenantId && eventTenantId && !areSameIdentifiers(eventTenantId, scopeTenantId)) return;
        if (scopeFacilityId && eventFacilityId && !areSameIdentifiers(eventFacilityId, scopeFacilityId)) return;
      }

      const realtimeIdentifiers = [encounterPublicId, encounterInternalId].filter(Boolean);
      const isKnownFlow =
        realtimeIdentifiers.some((identifier) => identifier === selectedFlowId) ||
        flowList.some((item) =>
          realtimeIdentifiers.some((identifier) => matchesEncounterIdentifier(item, identifier))
        );

      if (isKnownFlow || !selectedFlowId) {
        refreshFromRealtimeEvent(encounterPublicId || encounterIdentifier);
      }
    },
    [
      canManageAllTenants,
      canViewWorkbench,
      flowList,
      isOffline,
      scopeFacilityId,
      scopeTenantId,
      refreshFromRealtimeEvent,
      selectedFlowId,
    ]
  );

  useRealtimeEvent('opd.flow.updated', handleRealtimeOpdUpdate, {
    enabled: canViewWorkbench && !isOffline,
  });

  const activeFlow = useMemo(() => {
    if (selectedFlow && matchesEncounterIdentifier(selectedFlow, selectedFlowId)) {
      return selectedFlow;
    }
    return flowList.find((item) => matchesEncounterIdentifier(item, selectedFlowId)) || null;
  }, [selectedFlow, selectedFlowId, flowList]);
  const contextPatient = useMemo(
    () => startLinkedPatient || activeFlow?.encounter?.patient || activeFlow?.patient || null,
    [activeFlow, startLinkedPatient]
  );
  const contextPatientAgeProfile = useMemo(
    () => resolveAgeProfile(contextPatient),
    [contextPatient]
  );
  const contextPatientAgeYears = useMemo(
    () => contextPatientAgeProfile?.years ?? resolveAgeInYears(contextPatient),
    [contextPatient, contextPatientAgeProfile]
  );
  const contextPatientAgeLabel = useMemo(() => {
    if (!contextPatientAgeProfile && contextPatientAgeYears == null) return '';
    if (contextPatientAgeProfile?.days <= 28) {
      return t('scheduling.opdFlow.vitals.ageDays', { age: contextPatientAgeProfile.days });
    }
    if (contextPatientAgeProfile && contextPatientAgeProfile.months <= 11) {
      return t('scheduling.opdFlow.vitals.ageMonths', { age: contextPatientAgeProfile.months });
    }
    return t('scheduling.opdFlow.vitals.ageYears', { age: contextPatientAgeYears ?? 0 });
  }, [contextPatientAgeProfile, contextPatientAgeYears, t]);
  const vitalsRowsWithInsights = useMemo(
    () =>
      vitalsDraft.vitals.map((row) => {
        const vitalType = sanitizeString(row?.vital_type).toUpperCase();
        const insight = resolveVitalInsight(row, contextPatientAgeProfile);
        const isBloodPressure = vitalType === 'BLOOD_PRESSURE';
        const resolvedComponents = isBloodPressure ? resolveBloodPressureComponents(row) : null;
        return {
          ...row,
          ...insight,
          normalizedVitalType: vitalType,
          isBloodPressure,
          resolvedBloodPressure: resolvedComponents,
          map_auto_value: resolveAutoMapText(row?.systolic_value, row?.diastolic_value),
          unitOptions: resolveVitalUnitOptions(vitalType),
        };
      }),
    [contextPatientAgeProfile, vitalsDraft.vitals]
  );
  const vitalsStatusSummary = useMemo(
    () =>
      vitalsRowsWithInsights.reduce(
        (acc, row) => {
          if (row.status === 'NORMAL') acc.normal += 1;
          if (row.status === 'ABNORMAL') acc.abnormal += 1;
          if (row.status === 'CRITICAL') acc.critical += 1;
          return acc;
        },
        { normal: 0, abnormal: 0, critical: 0 }
      ),
    [vitalsRowsWithInsights]
  );
  const resolvedStartPatientOptions = useMemo(() => {
    const selectedValue = sanitizeString(startDraft.patient_id);
    const options = [...startPatientOptions];
    if (selectedValue && !isUuidLike(selectedValue)) {
      options.unshift({ value: selectedValue, label: selectedValue });
    }
    return uniqueSelectOptions(options);
  }, [startDraft.patient_id, startPatientOptions]);
  const resolvedProviderOptions = useMemo(() => {
    const options = [...providerOptions];
    const startValue = sanitizeString(startDraft.provider_user_id);
    const assignValue = sanitizeString(assignDraft.provider_user_id);
    if (startValue && !isUuidLike(startValue)) options.unshift({ value: startValue, label: startValue });
    if (assignValue && !isUuidLike(assignValue)) options.unshift({ value: assignValue, label: assignValue });
    return uniqueSelectOptions(options);
  }, [assignDraft.provider_user_id, providerOptions, startDraft.provider_user_id]);

  const activeFlowId = resolveEncounterIdentifier(activeFlow);
  const activeFlowPublicId = resolveEncounterPublicId(activeFlow);
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

  const activeProgressIndex = useMemo(
    () => FLOW_PROGRESS_STEPS.findIndex((step) => step.stages.includes(activeStage)),
    [activeStage]
  );
  const progressSteps = useMemo(
    () =>
      FLOW_PROGRESS_STEPS.map((step, index) => ({
        ...step,
        tone: FLOW_PROGRESS_TONE_BY_STEP[step.id] || 'indigo',
        status:
          activeProgressIndex < 0
            ? 'upcoming'
            : index < activeProgressIndex
              ? 'completed'
              : index === activeProgressIndex
                ? 'current'
                : 'upcoming',
      })),
    [activeProgressIndex]
  );
  const correctionStageOptions = useMemo(
    () =>
      CORRECTABLE_STAGE_OPTIONS.map((stage) => ({
        value: stage,
        labelKey: `scheduling.opdFlow.stages.${stage}`,
      })),
    []
  );

  const currentActionGuidanceKey = stageAction
    ? ACTION_GUIDANCE_KEY_MAP[stageAction] || 'scheduling.opdFlow.guidance.default'
    : 'scheduling.opdFlow.guidance.noAction';
  const currentActionRequirementKeys = ACTION_REQUIREMENT_KEYS_MAP[stageAction] || [];

  const isAccessDenied = ACCESS_DENIED_CODES.has(errorCode);
  const isEntitlementBlocked = ENTITLEMENT_DENIED_CODES.has(errorCode);
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'scheduling.opdFlow.states.loadError'),
    [t, errorCode]
  );

  const resetDrafts = useCallback(() => {
    setPaymentDraft({
      ...DEFAULT_PAYMENT_DRAFT,
      currency: globalCurrency || DEFAULT_CURRENCY,
    });
    setVitalsDraft({
      vitals: [createVitalRow()],
      triage_level: '',
      triage_notes: '',
    });
    setAssignDraft(DEFAULT_ASSIGN_DRAFT);
    setReviewDraft(DEFAULT_REVIEW_DRAFT);
    setDispositionDraft(DEFAULT_DISPOSITION_DRAFT);
    setFormError('');
    setStartLookupError('');
    setStartLinkedPatient(null);
    setStartLinkedAppointment(null);
    setStartPatientSearchText('');
    setStartProviderSearchText('');
    setAssignProviderSearchText('');
    setIsCorrectionDialogOpen(false);
    setStageCorrectionDraft(DEFAULT_STAGE_CORRECTION_DRAFT);
  }, [globalCurrency]);

  const applySnapshot = useCallback(
    (snapshot, { pushRoute = true } = {}) => {
      const snapshotId = resolveEncounterIdentifier(snapshot);
      if (!snapshotId) return;
      const snapshotPublicId = resolveEncounterPublicId(snapshot);
      setSelectedFlow(snapshot);
      setSelectedFlowId(snapshotId);
      upsertFlowInList(snapshot);
      if (pushRoute && snapshotPublicId) {
        router.push(`/scheduling/opd-flows/${snapshotPublicId}`);
      }
      resetDrafts();
      setIsStartFormOpen(false);
      setIsStartAdvancedOpen(false);
    },
    [router, upsertFlowInList, resetDrafts]
  );

  const handleSelectFlow = useCallback(
    (flowItem) => {
      const flowId = resolveEncounterIdentifier(flowItem);
      if (!flowId) return;
      const flowPublicId = resolveEncounterPublicId(flowItem);
      setSelectedFlowId(flowId);
      setSelectedFlow(flowItem);
      if (flowPublicId) {
        router.push(`/scheduling/opd-flows/${flowPublicId}`);
      }
    },
    [router]
  );

  const handleStartDraftChange = useCallback((field, value) => {
    setStartLookupError('');
    setStartDraft((previous) => {
      const normalizedValue =
        field === 'currency' ? sanitizeString(value).toUpperCase() : value;
      const next = { ...previous, [field]: normalizedValue };
      if (field === 'arrival_mode' && value !== 'ONLINE_APPOINTMENT') {
        next.appointment_id = '';
      }
      return next;
    });
    if (field === 'arrival_mode' && value !== 'ONLINE_APPOINTMENT') {
      setStartLinkedAppointment(null);
    }
    if (field === 'patient_id' && !sanitizeString(value)) {
      setStartLinkedPatient(null);
      setStartPatientSearchText('');
    }
    if (field === 'appointment_id' && !sanitizeString(value)) {
      setStartLinkedAppointment(null);
    }
  }, []);

  const handleStartPatientSearchChange = useCallback((value) => {
    setStartPatientSearchText(value);
  }, []);

  const handleStartProviderSearchChange = useCallback((value) => {
    setStartProviderSearchText(value);
  }, []);

  const handleAssignProviderSearchChange = useCallback((value) => {
    setAssignProviderSearchText(value);
  }, []);

  const handleFlowSearchChange = useCallback((value) => {
    setFlowSearchText(value);
  }, []);

  const handleStartPatientSelect = useCallback((value) => {
    handleStartDraftChange('patient_id', value);
    setStartLinkedPatient(null);
  }, [handleStartDraftChange]);

  const handleStartProviderSelect = useCallback((value) => {
    handleStartDraftChange('provider_user_id', value);
  }, [handleStartDraftChange]);

  const handleAssignProviderSelect = useCallback((value) => {
    setAssignDraft((previous) => ({ ...previous, provider_user_id: value }));
  }, []);

  const handleStartFlow = useCallback(async () => {
    setFormError('');
    setStartLookupError('');
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

    if (!canManageAllTenants && scopeTenantId) {
      payload.tenant_id = scopeTenantId;
    }
    if (!canManageAllTenants && scopeFacilityId) {
      payload.facility_id = scopeFacilityId;
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

    const snapshot = await startOpdFlow(payload);
    if (!snapshot) return;

    applySnapshot(snapshot);
    setStartDraft({
      ...DEFAULT_START_DRAFT,
      currency: globalCurrency || DEFAULT_CURRENCY,
    });
    await loadFlowList();
  }, [
    canManageAllTenants,
    canStartFlow,
    isOffline,
    scopeFacilityId,
    scopeTenantId,
    globalCurrency,
    startDraft,
    startOpdFlow,
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
    const snapshot = await payConsultation(activeFlowId, payload);
    if (!snapshot) return;
    applySnapshot(snapshot, { pushRoute: false });
    await loadFlowList();
  }, [
    activeFlowId,
    canPayConsultation,
    isOffline,
    paymentDraft,
    payConsultation,
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
      vitals: previous.vitals.map((row, rowIndex) => {
        if (rowIndex !== index) return row;

        if (field === 'vital_type') {
          const nextType = sanitizeString(value).toUpperCase();
          if (nextType === 'BLOOD_PRESSURE') {
            return {
              ...row,
              vital_type: value,
              value: '',
              systolic_value: '',
              diastolic_value: '',
              map_value: '',
              map_is_manual: false,
              unit: VITAL_DEFAULT_UNIT_BY_TYPE[nextType] || row.unit || '',
            };
          }

          return {
            ...row,
            vital_type: value,
            value: '',
            systolic_value: '',
            diastolic_value: '',
            map_value: '',
            map_is_manual: false,
            unit: VITAL_DEFAULT_UNIT_BY_TYPE[nextType] || row.unit || '',
          };
        }

        if (field === 'map_value') {
          const normalized = sanitizeString(value);
          if (!normalized) {
            return {
              ...row,
              map_value: resolveAutoMapText(row.systolic_value, row.diastolic_value),
              map_is_manual: false,
            };
          }
          return {
            ...row,
            map_value: value,
            map_is_manual: true,
          };
        }

        if (field === 'systolic_value' || field === 'diastolic_value') {
          const nextRow = { ...row, [field]: value };
          if (!nextRow.map_is_manual) {
            nextRow.map_value = resolveAutoMapText(nextRow.systolic_value, nextRow.diastolic_value);
          }
          return nextRow;
        }

        return { ...row, [field]: value };
      }),
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
      .map((row) => {
        const vitalType = sanitizeString(row.vital_type).toUpperCase();
        const unit =
          sanitizeString(row.unit) ||
          VITAL_DEFAULT_UNIT_BY_TYPE[vitalType] ||
          undefined;

        if (vitalType === 'BLOOD_PRESSURE') {
          const systolicText = sanitizeString(row.systolic_value);
          const diastolicText = sanitizeString(row.diastolic_value);
          if (!systolicText || !diastolicText) return null;

          const mapText =
            sanitizeString(row.map_value) ||
            resolveAutoMapText(systolicText, diastolicText) ||
            '';
          const value = `${formatNumericValue(systolicText)}/${formatNumericValue(diastolicText)}`;

          return {
            vital_type: vitalType,
            value,
            unit,
            systolic_value: systolicText,
            diastolic_value: diastolicText,
            map_value: mapText || undefined,
          };
        }

        const scalarValue = sanitizeString(row.value);
        if (!scalarValue) return null;
        return {
          vital_type: vitalType,
          value: scalarValue,
          unit,
        };
      })
      .filter(Boolean);

    if (vitals.length === 0) {
      setFormError(t('scheduling.opdFlow.validation.vitalsRequired'));
      return;
    }

    const payload = {
      vitals,
      triage_level: sanitizeString(vitalsDraft.triage_level) || undefined,
      triage_notes: sanitizeString(vitalsDraft.triage_notes) || undefined,
    };

    const snapshot = await recordVitals(activeFlowId, payload);
    if (!snapshot) return;
    applySnapshot(snapshot, { pushRoute: false });
    await loadFlowList();
  }, [
    activeFlowId,
    canRecordVitals,
    isOffline,
    vitalsDraft,
    recordVitals,
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
    const snapshot = await assignDoctor(activeFlowId, {
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
    assignDoctor,
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

    const snapshot = await doctorReview(activeFlowId, payload);
    if (!snapshot) return;
    applySnapshot(snapshot, { pushRoute: false });
    await loadFlowList();
  }, [
    activeFlowId,
    canDoctorReview,
    isOffline,
    reviewDraft,
    doctorReview,
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
    const snapshot = await disposition(activeFlowId, payload);
    if (!snapshot) return;
    applySnapshot(snapshot, { pushRoute: false });
    await loadFlowList();
  }, [
    activeFlowId,
    canDisposition,
    isOffline,
    dispositionDraft,
    disposition,
    applySnapshot,
    loadFlowList,
    t,
  ]);

  const handleStageCorrectionDraftChange = useCallback((field, value) => {
    setStageCorrectionDraft((previous) => ({ ...previous, [field]: value }));
  }, []);

  const handleOpenCorrectionDialog = useCallback(() => {
    if (!activeFlowId || !canCorrectStage) return;
    setFormError('');
    setStageCorrectionDraft({
      stage_to: activeStage || '',
      reason: '',
    });
    setIsCorrectionDialogOpen(true);
  }, [activeFlowId, activeStage, canCorrectStage]);

  const handleCloseCorrectionDialog = useCallback(() => {
    setIsCorrectionDialogOpen(false);
    setStageCorrectionDraft(DEFAULT_STAGE_CORRECTION_DRAFT);
  }, []);

  const handleCorrectStage = useCallback(async () => {
    setFormError('');
    if (!activeFlowId || !canCorrectStage || isOffline) return;

    const stageTo = sanitizeString(stageCorrectionDraft.stage_to);
    const reason = sanitizeString(stageCorrectionDraft.reason);
    if (!stageTo) {
      setFormError(t('scheduling.opdFlow.validation.stageCorrectionRequired'));
      return;
    }
    if (!reason) {
      setFormError(t('scheduling.opdFlow.validation.correctionReasonRequired'));
      return;
    }

    const snapshot = await correctStage(activeFlowId, {
      stage_to: stageTo,
      reason,
    });
    if (!snapshot) return;
    applySnapshot(snapshot, { pushRoute: false });
    setIsCorrectionDialogOpen(false);
    setStageCorrectionDraft(DEFAULT_STAGE_CORRECTION_DRAFT);
    await loadFlowList();
  }, [
    activeFlowId,
    canCorrectStage,
    isOffline,
    stageCorrectionDraft.stage_to,
    stageCorrectionDraft.reason,
    t,
    correctStage,
    applySnapshot,
    loadFlowList,
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

  const handleResolveStartPatient = useCallback(async () => {
    await resolvePatientLookup(startDraft.patient_id, { silent: false });
  }, [resolvePatientLookup, startDraft.patient_id]);

  const handleResolveStartAppointment = useCallback(async () => {
    await resolveAppointmentLookup(startDraft.appointment_id, { silent: false });
  }, [resolveAppointmentLookup, startDraft.appointment_id]);

  const handleOpenPatientShortcut = useCallback(() => {
    const patientId =
      resolvePatientPublicId(startLinkedPatient) ||
      sanitizeString(startDraft.patient_id) ||
      resolvePatientPublicId(contextPatient);
    if (!patientId || isUuidLike(patientId)) return;
    router.push(`/patients/patients/${patientId}`);
  }, [contextPatient, router, startDraft.patient_id, startLinkedPatient]);

  const handleOpenAdmissionShortcut = useCallback(() => {
    const patientId =
      resolvePatientPublicId(startLinkedPatient) ||
      sanitizeString(startDraft.patient_id) ||
      resolvePatientPublicId(contextPatient);
    const target = patientId && !isUuidLike(patientId)
      ? `/ipd/admissions/create?patientId=${encodeURIComponent(patientId)}`
      : '/ipd/admissions/create';
    router.push(target);
  }, [contextPatient, router, startDraft.patient_id, startLinkedPatient]);

  const handleOpenOpdShortcut = useCallback(() => {
    if (activeFlowPublicId) {
      router.push(`/scheduling/opd-flows/${activeFlowPublicId}`);
      return;
    }
    router.push('/scheduling/opd-flows');
  }, [activeFlowPublicId, router]);

  const timeline = useMemo(
    () =>
      normalizeScalarParam(activeFlow?.flow?.stage)
        ? activeFlow?.timeline || activeFlow?.flow?.timeline || []
        : [],
    [activeFlow]
  );
  const timelineItems = useMemo(
    () =>
      timeline.map((entry) => {
        const eventName = sanitizeString(entry?.event);
        const labelKey =
          TIMELINE_EVENT_LABEL_KEY_MAP[eventName] || 'scheduling.opdFlow.timeline.eventUnknown';
        const parsedAt = entry?.at ? new Date(entry.at) : null;
        const timestampLabel =
          parsedAt && !Number.isNaN(parsedAt.getTime())
            ? parsedAt.toLocaleString(locale || undefined)
            : sanitizeString(entry?.at) || '-';
        const relativeLabel =
          parsedAt && !Number.isNaN(parsedAt.getTime())
            ? formatRelativeTime(entry.at, locale)
            : '';

        return {
          ...entry,
          labelKey,
          label: labelKey === 'scheduling.opdFlow.timeline.eventUnknown' ? eventName || t(labelKey) : t(labelKey),
          timestampLabel,
          relativeLabel,
        };
      }),
    [locale, t, timeline]
  );

  const canMutate = !isOffline;

  return {
    isResolved,
    canViewWorkbench,
    canManageAllTenants,
    tenantId: scopeTenantId || null,
    facilityId: scopeFacilityId || null,
    isLoading: !isResolved || !isScopeResolved || isCrudLoading,
    isOffline,
    hasError: Boolean(errorCode),
    errorCode,
    errorMessage,
    isAccessDenied,
    isEntitlementBlocked,
    canStartFlow,
    canPayConsultation,
    canRecordVitals,
    canAssignDoctor,
    canDoctorReview,
    canCorrectStage,
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
    progressSteps,
    activeProgressIndex,
    currentActionGuidanceKey,
    currentActionRequirementKeys,
    isTerminalStage,
    isStartFormOpen,
    isStartAdvancedOpen,
    setIsStartFormOpen,
    setIsStartAdvancedOpen,
    startDraft,
    paymentDraft,
    vitalsDraft,
    assignDraft,
    reviewDraft,
    dispositionDraft,
    formError,
    startLookupError,
    startLinkedPatient,
    startLinkedAppointment,
    isPatientLookupLoading,
    isAppointmentLookupLoading,
    isPatientSearchLoading,
    isProviderSearchLoading,
    globalCurrency,
    currencyOptions,
    startPatientSearchText,
    startProviderSearchText,
    assignProviderSearchText,
    flowSearchText,
    startPatientOptions: resolvedStartPatientOptions,
    providerOptions: resolvedProviderOptions,
    contextPatientAgeLabel,
    timeline,
    timelineItems,
    vitalsRowsWithInsights,
    vitalsStatusSummary,
    stageLabelKey: activeStage ? `scheduling.opdFlow.stages.${activeStage}` : '',
    dispositionStages: DISPOSITION_STAGES,
    correctionStageOptions,
    isCorrectionDialogOpen,
    stageCorrectionDraft,
    arrivalModeOptions: ARRIVAL_MODE_OPTIONS,
    emergencySeverityOptions: EMERGENCY_SEVERITY_OPTIONS,
    triageLevelOptions: TRIAGE_LEVEL_OPTIONS,
    triageLevelLegend: TRIAGE_LEVEL_LEGEND,
    paymentMethodOptions: PAYMENT_METHOD_OPTIONS,
    vitalTypeOptions: VITAL_TYPE_OPTIONS,
    vitalDefaultUnitByType: VITAL_DEFAULT_UNIT_BY_TYPE,
    diagnosisTypeOptions: DIAGNOSIS_TYPE_OPTIONS,
    medicationFrequencyOptions: MEDICATION_FREQUENCY_OPTIONS,
    medicationRouteOptions: MEDICATION_ROUTE_OPTIONS,
    dispositionOptions: DISPOSITION_OPTIONS,
    onRetry: handleRetry,
    onSelectFlow: handleSelectFlow,
    onOpenSubscriptions: handleOpenSubscriptions,
    onResolveStartPatient: handleResolveStartPatient,
    onResolveStartAppointment: handleResolveStartAppointment,
    onOpenPatientShortcut: handleOpenPatientShortcut,
    onOpenAdmissionShortcut: handleOpenAdmissionShortcut,
    onOpenOpdShortcut: handleOpenOpdShortcut,
    onStartPatientSearchChange: handleStartPatientSearchChange,
    onStartProviderSearchChange: handleStartProviderSearchChange,
    onAssignProviderSearchChange: handleAssignProviderSearchChange,
    onFlowSearchChange: handleFlowSearchChange,
    onStartPatientSelect: handleStartPatientSelect,
    onStartProviderSelect: handleStartProviderSelect,
    onAssignProviderSelect: handleAssignProviderSelect,
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
    onOpenCorrectionDialog: handleOpenCorrectionDialog,
    onCloseCorrectionDialog: handleCloseCorrectionDialog,
    onStageCorrectionDraftChange: handleStageCorrectionDraftChange,
    onCorrectStage: handleCorrectStage,
  };
};

export default useOpdFlowWorkbenchScreen;
