/**
 * Clinical Term Model
 * File: clinical-term.model.js
 */
const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const normalizeClinicalTermSuggestions = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const normalizeClinicalTermFavorites = (value) => {
  if (Array.isArray(value)) return { items: value, pagination: null };
  return {
    items: normalizeArray(value?.items),
    pagination: value?.pagination || null,
  };
};

export { normalizeClinicalTermSuggestions, normalizeClinicalTermFavorites };
