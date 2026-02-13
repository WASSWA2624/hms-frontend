import { normalizeContextId, normalizeRouteId, sanitizeString } from './schedulingResourceConfigs';

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
      return t('scheduling.notices.created', { resource: resourceLabel });
    case 'updated':
      return t('scheduling.notices.updated', { resource: resourceLabel });
    case 'deleted':
      return t('scheduling.notices.deleted', { resource: resourceLabel });
    case 'queued':
      return t('scheduling.notices.queued');
    case 'accessDenied':
      return t('scheduling.notices.accessDenied', { resource: resourceLabel });
    case 'cancelled':
      return t('scheduling.notices.cancelled');
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

const normalizeSchedulingContext = (params = {}) => {
  const patientId = normalizeContextId(params.patientId);
  const providerUserId = normalizeContextId(params.providerUserId);
  const scheduleId = normalizeContextId(params.scheduleId);
  const appointmentId = normalizeContextId(params.appointmentId);
  const status = sanitizeString(Array.isArray(params.status) ? params.status[0] : params.status);
  const dayOfWeekRaw = sanitizeString(Array.isArray(params.dayOfWeek) ? params.dayOfWeek[0] : params.dayOfWeek);
  const dayOfWeek = dayOfWeekRaw && Number.isInteger(Number(dayOfWeekRaw)) ? Number(dayOfWeekRaw) : undefined;
  const isAvailable = sanitizeString(Array.isArray(params.isAvailable) ? params.isAvailable[0] : params.isAvailable);

  return {
    patientId,
    providerUserId,
    scheduleId,
    appointmentId,
    status: status || undefined,
    dayOfWeek,
    isAvailable: isAvailable || undefined,
  };
};

const normalizeRecordId = (value) => normalizeRouteId(value);

export {
  buildNoticeMessage,
  formatFieldValue,
  isAccessDeniedError,
  normalizeNoticeValue,
  normalizeRecordId,
  normalizeSchedulingContext,
  resolveErrorMessage,
};
