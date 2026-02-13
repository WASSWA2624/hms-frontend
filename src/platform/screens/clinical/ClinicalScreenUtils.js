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

const normalizeClinicalContext = (params = {}) => {
  const tenantId = normalizeContextId(params.tenantId);
  const facilityId = normalizeContextId(params.facilityId);
  const patientId = normalizeContextId(params.patientId);
  const providerUserId = normalizeContextId(params.providerUserId);
  const encounterId = normalizeContextId(params.encounterId);
  const authorUserId = normalizeContextId(params.authorUserId);
  const fromDepartmentId = normalizeContextId(params.fromDepartmentId);
  const toDepartmentId = normalizeContextId(params.toDepartmentId);
  const status = sanitizeString(Array.isArray(params.status) ? params.status[0] : params.status) || undefined;
  const encounterType = sanitizeString(
    Array.isArray(params.encounterType) ? params.encounterType[0] : params.encounterType
  ) || undefined;
  const diagnosisType = sanitizeString(
    Array.isArray(params.diagnosisType) ? params.diagnosisType[0] : params.diagnosisType
  ) || undefined;
  const code = sanitizeString(Array.isArray(params.code) ? params.code[0] : params.code) || undefined;
  const vitalType = sanitizeString(
    Array.isArray(params.vitalType) ? params.vitalType[0] : params.vitalType
  ) || undefined;
  const startDate = sanitizeString(
    Array.isArray(params.startDate) ? params.startDate[0] : params.startDate
  ) || undefined;
  const endDate = sanitizeString(Array.isArray(params.endDate) ? params.endDate[0] : params.endDate) || undefined;

  return {
    tenantId,
    facilityId,
    patientId,
    providerUserId,
    encounterId,
    authorUserId,
    fromDepartmentId,
    toDepartmentId,
    status,
    encounterType,
    diagnosisType,
    code,
    vitalType,
    startDate,
    endDate,
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
