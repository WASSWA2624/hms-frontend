import { humanizeDisplayText } from '@utils';
import { normalizeRouteId, sanitizeString } from './patientResourceConfigs';

const ACCESS_DENIED_CODES = new Set(['FORBIDDEN', 'UNAUTHORIZED']);
const ENTITLEMENT_DENIED_CODES = new Set(['MODULE_NOT_ENTITLED']);
const TECHNICAL_FIELD_KEYS = new Set(['id', 'tenant_id', 'facility_id', 'patient_id', 'user_id']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
const isEntitlementDeniedError = (errorCode) => ENTITLEMENT_DENIED_CODES.has(errorCode);

const sanitizePrimitiveValue = (value) => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  return '';
};

const composeContextLabel = (label, humanFriendlyId, fallback) => {
  const normalizedLabel = sanitizeString(label);
  const normalizedHumanFriendlyId = sanitizeString(humanFriendlyId);
  if (normalizedLabel && normalizedHumanFriendlyId) {
    return `${normalizedLabel} (${normalizedHumanFriendlyId})`;
  }
  return normalizedLabel || normalizedHumanFriendlyId || sanitizeString(fallback);
};

const resolveContextLabel = (context, fallback) => {
  const label = sanitizeString(context?.label || context?.name);
  const contextId = sanitizeString(context?.id);
  const friendlyId = sanitizeString(
    context?.human_friendly_id
    || context?.humanFriendlyId
    || (contextId && !UUID_PATTERN.test(contextId) ? contextId : '')
  );

  return composeContextLabel(label, friendlyId, fallback);
};

const resolveContactEntryValue = (entry) => {
  if (entry == null) return '';
  if (typeof entry === 'string' || typeof entry === 'number') {
    return sanitizePrimitiveValue(entry);
  }

  return [
    entry?.value,
    entry?.contact_value,
    entry?.contact,
    entry?.phone,
    entry?.phone_number,
    entry?.mobile,
    entry?.mobile_number,
    entry?.telephone,
    entry?.tel,
    entry?.email,
    entry?.email_address,
  ]
    .map((value) => sanitizePrimitiveValue(value))
    .find(Boolean) || '';
};

const resolveCollectionContactValue = (collection = []) => {
  if (!Array.isArray(collection) || collection.length === 0) return '';

  const resolvedEntries = collection
    .map((entry) => ({
      isPrimary: Boolean(entry?.is_primary),
      value: resolveContactEntryValue(entry),
    }))
    .filter((entry) => Boolean(entry.value));
  if (resolvedEntries.length === 0) return '';

  const primaryEntry = resolvedEntries.find((entry) => entry.isPrimary);
  return primaryEntry?.value || resolvedEntries[0].value;
};

const resolvePatientContactLabel = (patient, fallback = '', contactRecords = []) => {
  const recordsContactValue = resolveCollectionContactValue(contactRecords);
  if (recordsContactValue) return recordsContactValue;

  const directContactValue = [
    patient?.contact,
    patient?.contact_label,
    patient?.contact_value,
    patient?.primary_contact,
    patient?.phone,
    patient?.phone_number,
    patient?.mobile,
    patient?.mobile_number,
    patient?.telephone,
    patient?.tel,
    patient?.email,
    patient?.email_address,
    patient?.primary_phone,
    patient?.primary_phone_number,
  ]
    .map((value) => sanitizePrimitiveValue(value))
    .find(Boolean);
  if (directContactValue) return directContactValue;

  const nestedContactValue = [
    patient?.primary_contact_details,
    patient?.primary_contact_detail,
    patient?.primaryContact,
    patient?.contact,
  ]
    .map((entry) => resolveContactEntryValue(entry))
    .find(Boolean);
  if (nestedContactValue) return nestedContactValue;

  const contactCollections = [
    patient?.contacts,
    patient?.patient_contacts,
    patient?.contact_entries,
    patient?.contact_list,
  ];

  for (let index = 0; index < contactCollections.length; index += 1) {
    const value = resolveCollectionContactValue(contactCollections[index]);
    if (value) return value;
  }

  return sanitizeString(fallback);
};

const isMatchingRecordId = (record, recordId) => {
  const normalizedRecordId = sanitizeString(recordId);
  if (!normalizedRecordId) return false;

  const candidates = [
    record?.id,
    record?.human_friendly_id,
    record?.humanFriendlyId,
    record?.record_id,
    record?.recordId,
  ];

  return candidates.some((candidate) => sanitizeString(candidate) === normalizedRecordId);
};

const findRecordByRouteId = (records = [], recordId) => {
  if (!Array.isArray(records) || records.length === 0) return null;
  return records.find((record) => isMatchingRecordId(record, recordId)) || null;
};

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
  if (
    normalizedKey === 'human_friendly_id'
    || normalizedKey.endsWith('_human_friendly_id')
    || normalizedKey.endsWith('_context')
  ) {
    return false;
  }
  if (TECHNICAL_FIELD_KEYS.has(normalizedKey)) return true;
  return normalizedKey.endsWith('_id');
};

const filterDetailRowsByIdentityPolicy = (rows, canViewTechnicalIds) => {
  const normalizedRows = Array.isArray(rows) ? rows : [];
  if (canViewTechnicalIds) return normalizedRows;
  return normalizedRows.filter((row) => !isTechnicalFieldKey(row?.valueKey));
};

const resolveFallbackValue = (t) => (
  typeof t === 'function' ? t('common.notAvailable') : '-'
);

const formatFieldValue = (value, type, locale, formatDateTime, t) => {
  if (value == null || value === '') return resolveFallbackValue(t);
  if (type === 'boolean') {
    if (typeof t === 'function') {
      return value ? t('common.boolean.true') : t('common.boolean.false');
    }
    return value ? 'true' : 'false';
  }
  if (type === 'datetime') {
    return formatDateTime(value, locale);
  }
  const readable = humanizeDisplayText(value);
  return readable || resolveFallbackValue(t);
};

const normalizePatientContextId = (searchParamValue) => {
  const normalized = normalizeRouteId(searchParamValue);
  return normalized || null;
};

const resolvePatientDisplayLabel = (patient, fallbackLabel = '') => {
  if (!patient || typeof patient !== 'object') {
    return sanitizeString(fallbackLabel);
  }

  const firstName = sanitizeString(patient.first_name);
  const lastName = sanitizeString(patient.last_name);
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName) return fullName;

  const readableCandidate = [
    patient.human_friendly_id,
    patient.name,
    patient.display_name,
    patient.patient_name,
    patient.patient_label,
    patient.patient_code,
    patient.patient_number,
    patient.medical_record_number,
    patient.mrn,
    patient.identifier_value,
    patient.identifier_type,
  ]
    .map((value) => sanitizeString(value))
    .find(Boolean);

  return readableCandidate || sanitizeString(fallbackLabel);
};

const resolvePatientContextLabel = (record, patientLabelsById = null, fallbackLabel = '') => {
  if (!record || typeof record !== 'object') {
    return sanitizeString(fallbackLabel);
  }

  const nestedLabel = resolvePatientDisplayLabel(record.patient, '');
  if (nestedLabel) return nestedLabel;

  const directLabel = [
    record.human_friendly_id,
    record.patient_display_label,
    record.patient_name,
    record.patient_label,
    record.patient_code,
    record.patient_number,
    record.medical_record_number,
    record.mrn,
  ]
    .map((value) => sanitizeString(value))
    .find(Boolean);

  if (directLabel) return directLabel;

  const patientId = sanitizeString(record.patient_id);
  if (patientId && patientLabelsById && typeof patientLabelsById === 'object') {
    const mapped = sanitizeString(patientLabelsById[patientId]);
    if (mapped) return mapped;
  }

  return sanitizeString(fallbackLabel);
};

const resolveUserDisplayLabel = (user, fallbackLabel = '') => {
  if (!user || typeof user !== 'object') {
    return sanitizeString(fallbackLabel);
  }

  const firstName = sanitizeString(user.first_name);
  const lastName = sanitizeString(user.last_name);
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName) return fullName;

  const readableCandidate = [
    user.human_friendly_id,
    user.display_name,
    user.name,
    user.email,
    user.phone,
    user.username,
    user.user_label,
    user.user_code,
  ]
    .map((value) => sanitizeString(value))
    .find(Boolean);

  return readableCandidate || sanitizeString(fallbackLabel);
};

const resolveUserContextLabel = (record, userLabelsById = null, fallbackLabel = '') => {
  if (!record || typeof record !== 'object') {
    return sanitizeString(fallbackLabel);
  }

  const nestedLabel = resolveUserDisplayLabel(record.user, '');
  if (nestedLabel) return nestedLabel;

  const directLabel = [
    record.human_friendly_id,
    record.user_display_label,
    record.user_name,
    record.user_label,
    record.display_name,
    record.email,
    record.user_email,
    record.username,
  ]
    .map((value) => sanitizeString(value))
    .find(Boolean);

  if (directLabel) return directLabel;

  const userId = sanitizeString(record.user_id);
  if (userId && userLabelsById && typeof userLabelsById === 'object') {
    const mapped = sanitizeString(userLabelsById[userId]);
    if (mapped) return mapped;
  }

  return sanitizeString(fallbackLabel);
};

export {
  buildNoticeMessage,
  filterDetailRowsByIdentityPolicy,
  formatFieldValue,
  sanitizePrimitiveValue,
  composeContextLabel,
  resolveContextLabel,
  resolveContactEntryValue,
  resolvePatientContactLabel,
  findRecordByRouteId,
  isAccessDeniedError,
  isEntitlementDeniedError,
  isTechnicalFieldKey,
  normalizeNoticeValue,
  normalizePatientContextId,
  resolvePatientContextLabel,
  resolvePatientDisplayLabel,
  resolveUserContextLabel,
  resolveUserDisplayLabel,
  resolveErrorMessage,
};
