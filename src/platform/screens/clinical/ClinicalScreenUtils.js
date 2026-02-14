import { normalizeContextId, normalizeRouteId, sanitizeString } from './ClinicalResourceConfigs';

const ACCESS_DENIED_CODES = new Set(['FORBIDDEN', 'UNAUTHORIZED']);

const resolveErrorMessage = (t, errorCode, fallbackKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(fallbackKey);
  }
  const errorKey = `errors.codes.${errorCode}`;
  const translated = t(errorKey);
  return translated === errorKey ? t(fallbackKey) : translated;
};

const isAccessDeniedError = (errorCode) => ACCESS_DENIED_CODES.has(errorCode);

const normalizeNoticeValue = (value) => {
  if (Array.isArray(value)) return sanitizeString(value[0]);
  return sanitizeString(value);
};

const buildNoticeMessage = (t, notice, resourceLabel) => {
  switch (notice) {
    case 'created':
      return t('clinical.notices.created', { resource: resourceLabel });
    case 'updated':
      return t('clinical.notices.updated', { resource: resourceLabel });
    case 'deleted':
      return t('clinical.notices.deleted', { resource: resourceLabel });
    case 'queued':
      return t('clinical.notices.queued');
    case 'accessDenied':
      return t('clinical.notices.accessDenied', { resource: resourceLabel });
    default:
      return null;
  }
};

const formatFieldValue = (value, type, locale, formatDateTime, t) => {
  if (value == null || value === '') return '-';
  if (type === 'boolean') {
    return value ? t('common.on') : t('common.off');
  }
  if (type === 'datetime') {
    return formatDateTime(value, locale);
  }
  return String(value);
};

const firstValue = (value) => (Array.isArray(value) ? value[0] : value);

const normalizeClinicalContext = (params = {}) => {
  const tenantId = normalizeContextId(params.tenantId);
  const facilityId = normalizeContextId(params.facilityId);
  const patientId = normalizeContextId(params.patientId);
  const providerUserId = normalizeContextId(params.providerUserId);
  const encounterId = normalizeContextId(params.encounterId);
  const authorUserId = normalizeContextId(params.authorUserId);
  const fromDepartmentId = normalizeContextId(params.fromDepartmentId);
  const toDepartmentId = normalizeContextId(params.toDepartmentId);
  const admissionId = normalizeContextId(params.admissionId);
  const bedId = normalizeContextId(params.bedId);
  const nurseUserId = normalizeContextId(params.nurseUserId);
  const prescriptionId = normalizeContextId(params.prescriptionId);
  const fromWardId = normalizeContextId(params.fromWardId);
  const toWardId = normalizeContextId(params.toWardId);
  const icuStayId = normalizeContextId(params.icuStayId);
  const theatreCaseId = normalizeContextId(params.theatreCaseId);
  const anesthetistUserId = normalizeContextId(params.anesthetistUserId);
  const emergencyCaseId = normalizeContextId(params.emergencyCaseId);
  const ambulanceId = normalizeContextId(params.ambulanceId);
  const status = sanitizeString(firstValue(params.status)) || undefined;
  const encounterType = sanitizeString(firstValue(params.encounterType)) || undefined;
  const diagnosisType = sanitizeString(firstValue(params.diagnosisType)) || undefined;
  const code = sanitizeString(firstValue(params.code)) || undefined;
  const vitalType = sanitizeString(firstValue(params.vitalType)) || undefined;
  const startDate = sanitizeString(firstValue(params.startDate)) || undefined;
  const endDate = sanitizeString(firstValue(params.endDate)) || undefined;
  const severity = sanitizeString(firstValue(params.severity)) || undefined;
  const triageLevel = sanitizeString(firstValue(params.triageLevel)) || undefined;
  const route = sanitizeString(firstValue(params.route)) || undefined;
  const search = sanitizeString(firstValue(params.search)) || undefined;
  const startedAtFrom = sanitizeString(firstValue(params.startedAtFrom)) || undefined;
  const startedAtTo = sanitizeString(firstValue(params.startedAtTo)) || undefined;
  const endedAtFrom = sanitizeString(firstValue(params.endedAtFrom)) || undefined;
  const endedAtTo = sanitizeString(firstValue(params.endedAtTo)) || undefined;
  const observedAtFrom = sanitizeString(firstValue(params.observedAtFrom)) || undefined;
  const observedAtTo = sanitizeString(firstValue(params.observedAtTo)) || undefined;
  const scheduledFrom = sanitizeString(firstValue(params.scheduledFrom)) || undefined;
  const scheduledTo = sanitizeString(firstValue(params.scheduledTo)) || undefined;
  const isActiveRaw = sanitizeString(firstValue(params.isActive));
  const isActive = isActiveRaw === 'true' ? true : isActiveRaw === 'false' ? false : undefined;

  return {
    tenantId,
    facilityId,
    patientId,
    providerUserId,
    encounterId,
    authorUserId,
    fromDepartmentId,
    toDepartmentId,
    admissionId,
    bedId,
    nurseUserId,
    prescriptionId,
    fromWardId,
    toWardId,
    icuStayId,
    theatreCaseId,
    anesthetistUserId,
    emergencyCaseId,
    ambulanceId,
    status,
    encounterType,
    diagnosisType,
    code,
    vitalType,
    startDate,
    endDate,
    severity,
    triageLevel,
    route,
    search,
    startedAtFrom,
    startedAtTo,
    endedAtFrom,
    endedAtTo,
    observedAtFrom,
    observedAtTo,
    scheduledFrom,
    scheduledTo,
    isActive,
  };
};

const normalizeRecordId = (value) => normalizeRouteId(value);

export {
  buildNoticeMessage,
  formatFieldValue,
  isAccessDeniedError,
  normalizeNoticeValue,
  normalizeRecordId,
  normalizeClinicalContext,
  resolveErrorMessage,
};
