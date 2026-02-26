/**
 * Anesthesia Record Model
 * File: anesthesia-record.model.js
 */

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sanitizeString = (value) => String(value || '').trim();

const toPublicId = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized || UUID_LIKE_REGEX.test(normalized)) return '';
  return normalized;
};

const normalizeAnesthesiaRecord = (value) => {
  if (!value || typeof value !== 'object') return null;

  const displayId =
    toPublicId(value.display_id) ||
    toPublicId(value.human_friendly_id) ||
    toPublicId(value.id);

  return {
    ...value,
    id: displayId,
    display_id: displayId,
    human_friendly_id: displayId,
    theatre_case_display_id:
      toPublicId(value.theatre_case_display_id) ||
      toPublicId(value.theatre_case_id),
    theatre_case_id:
      toPublicId(value.theatre_case_display_id) ||
      toPublicId(value.theatre_case_id) ||
      sanitizeString(value.theatre_case_id),
    anesthetist_user_display_id:
      toPublicId(value.anesthetist_user_display_id) ||
      toPublicId(value.anesthetist_user_id),
    anesthetist_user_id:
      toPublicId(value.anesthetist_user_display_id) ||
      toPublicId(value.anesthetist_user_id) ||
      sanitizeString(value.anesthetist_user_id),
  };
};

const normalizeAnesthesiaRecordList = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeAnesthesiaRecord).filter(Boolean);
  }

  if (value && typeof value === 'object' && Array.isArray(value.items)) {
    return {
      ...value,
      items: value.items.map(normalizeAnesthesiaRecord).filter(Boolean),
    };
  }

  return [];
};

export { normalizeAnesthesiaRecord, normalizeAnesthesiaRecordList };
