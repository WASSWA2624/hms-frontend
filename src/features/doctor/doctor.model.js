/**
 * Doctor Model
 * File: doctor.model.js
 */
const normalizeObject = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return { ...value };
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const normalizeDoctor = (value) => normalizeObject(value);

const normalizeDoctorList = (value) => {
  if (Array.isArray(value)) {
    return {
      items: normalizeArray(value).map(normalizeDoctor).filter(Boolean),
      pagination: null,
    };
  }

  const normalized = normalizeObject(value);
  if (!normalized) {
    return {
      items: [],
      pagination: null,
    };
  }

  return {
    items: normalizeArray(normalized.items).map(normalizeDoctor).filter(Boolean),
    pagination: normalizeObject(normalized.pagination),
  };
};

export { normalizeDoctor, normalizeDoctorList };
