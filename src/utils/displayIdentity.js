/**
 * Display identity helpers.
 * Keep technical IDs internal by sanitizing UUID-like values before rendering.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;
const LONG_TOKEN_REGEX = /^(?=.*[a-z])(?=.*\d)[a-z0-9_-]{20,}$/i;
const UUID_TOKEN_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;
const OBJECT_ID_TOKEN_REGEX = /\b[a-f0-9]{24}\b/gi;

const normalizeValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const isTechnicalIdentifier = (value) => {
  const normalized = normalizeValue(value);
  if (!normalized) return false;
  if (UUID_REGEX.test(normalized)) return true;
  if (OBJECT_ID_REGEX.test(normalized)) return true;
  if (LONG_TOKEN_REGEX.test(normalized)) return true;
  return false;
};

const humanizeIdentifier = (value) => {
  const normalized = normalizeValue(value);
  if (!normalized) return '';
  return isTechnicalIdentifier(normalized) ? '' : normalized;
};

const humanizeDisplayText = (value) => {
  const normalized = normalizeValue(value);
  if (!normalized) return '';
  if (isTechnicalIdentifier(normalized)) return '';

  const stripped = normalized
    .replace(UUID_TOKEN_REGEX, '')
    .replace(OBJECT_ID_TOKEN_REGEX, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[:;,\-|/]\s*$/, '')
    .trim();

  return stripped;
};

export {
  humanizeDisplayText,
  humanizeIdentifier,
  isTechnicalIdentifier,
};
