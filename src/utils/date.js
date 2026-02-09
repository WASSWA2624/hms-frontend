/**
 * Date Utilities
 * Pure helpers for date input normalization
 * File: date.js
 */

const normalizeIsoDateTime = (value) => {
  if (value == null) return undefined;
  const trimmed = String(value).trim();
  if (!trimmed) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parsed = new Date(`${trimmed}T00:00:00.000Z`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
    return trimmed;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }
  return parsed.toISOString();
};

const toDateInputValue = (value) => {
  if (value == null) return '';
  const trimmed = String(value).trim();
  if (!trimmed) return '';
  if (trimmed.includes('T')) {
    return trimmed.split('T')[0];
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }
  return parsed.toISOString().split('T')[0];
};

export { normalizeIsoDateTime, toDateInputValue };
