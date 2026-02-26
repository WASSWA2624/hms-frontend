/**
 * ICU Stay Model
 * File: icu-stay.model.js
 */

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sanitize = (value) => String(value || '').trim();
const toPublic = (value) => {
  const normalized = sanitize(value);
  if (!normalized || UUID_LIKE_REGEX.test(normalized)) return null;
  return normalized;
};

const normalizeIcuStay = (value) => {
  if (!value || typeof value !== 'object') return null;

  const id =
    toPublic(value.display_id) ||
    toPublic(value.human_friendly_id) ||
    toPublic(value.id);
  const admissionId =
    toPublic(value.admission_display_id) ||
    toPublic(value.admission?.human_friendly_id) ||
    toPublic(value.admission_id);
  const patientId =
    toPublic(value.patient_display_id) ||
    toPublic(value.admission?.patient?.human_friendly_id) ||
    toPublic(value.patient_id);

  return {
    ...value,
    id,
    display_id: id,
    human_friendly_id: id,
    admission_id: admissionId,
    admission_display_id: admissionId,
    patient_display_id: patientId,
  };
};

const normalizeIcuStayList = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeIcuStay).filter(Boolean);
};

export { normalizeIcuStay, normalizeIcuStayList };
