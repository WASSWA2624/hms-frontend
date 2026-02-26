/**
 * Theatre Case Model
 * File: theatre-case.model.js
 */

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sanitizeString = (value) => String(value || '').trim();

const toPublicId = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized || UUID_LIKE_REGEX.test(normalized)) return '';
  return normalized;
};

const normalizeTheatreCase = (value) => {
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
    encounter_display_id:
      toPublicId(value.encounter_display_id) || toPublicId(value.encounter_id),
    patient_display_id:
      toPublicId(value.patient_display_id) || toPublicId(value.patient_id),
    room_display_id:
      toPublicId(value.room_display_id) || toPublicId(value.room_id),
    theatre_case_display_id:
      toPublicId(value.theatre_case_display_id) || displayId,
  };
};

const normalizeTheatreCaseList = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeTheatreCase).filter(Boolean);
  }

  if (value && typeof value === 'object' && Array.isArray(value.items)) {
    return {
      ...value,
      items: value.items.map(normalizeTheatreCase).filter(Boolean),
    };
  }

  return [];
};

export { normalizeTheatreCase, normalizeTheatreCaseList };
