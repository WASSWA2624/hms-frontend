import { humanizeDisplayText } from '@utils';
import { normalizeRouteId, sanitizeString } from './patientResourceConfigs';

const ACCESS_DENIED_CODES = new Set(['FORBIDDEN', 'UNAUTHORIZED']);
const TECHNICAL_FIELD_KEYS = new Set(['id', 'tenant_id', 'facility_id', 'patient_id', 'user_id']);

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
      return t('patients.notices.created', { resource: resourceLabel });
    case 'updated':
      return t('patients.notices.updated', { resource: resourceLabel });
    case 'deleted':
      return t('patients.notices.deleted', { resource: resourceLabel });
    case 'queued':
      return t('patients.notices.queued');
    case 'accessDenied':
      return t('patients.notices.accessDenied', { resource: resourceLabel });
    default:
      return null;
  }
};

const isTechnicalFieldKey = (valueKey) => {
  const normalizedKey = sanitizeString(valueKey);
  if (!normalizedKey) return false;
  if (TECHNICAL_FIELD_KEYS.has(normalizedKey)) return true;
  return normalizedKey.endsWith('_id');
};

const filterDetailRowsByIdentityPolicy = (rows, canViewTechnicalIds) => {
  const normalizedRows = Array.isArray(rows) ? rows : [];
  if (canViewTechnicalIds) return normalizedRows;
  return normalizedRows.filter((row) => !isTechnicalFieldKey(row?.valueKey));
};

const formatFieldValue = (value, type, locale, formatDateTime) => {
  if (value == null || value === '') return '-';
  if (type === 'boolean') return value ? 'true' : 'false';
  if (type === 'datetime') {
    return formatDateTime(value, locale);
  }
  const readable = humanizeDisplayText(value);
  return readable || '-';
};

const normalizePatientContextId = (searchParamValue) => {
  const normalized = normalizeRouteId(searchParamValue);
  return normalized || null;
};

export {
  buildNoticeMessage,
  filterDetailRowsByIdentityPolicy,
  formatFieldValue,
  isAccessDeniedError,
  isTechnicalFieldKey,
  normalizeNoticeValue,
  normalizePatientContextId,
  resolveErrorMessage,
};
