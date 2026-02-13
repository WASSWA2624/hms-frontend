/**
 * In-memory facility-selection session context.
 * Holds temporary login challenge data between /login and /facility-selection.
 */

const MAX_FACILITY_OPTIONS = 50;

let activeSession = null;

const toTrimmed = (value) => String(value || '').trim();

const normalizeIdentifier = (value) => {
  const raw = toTrimmed(value);
  if (!raw) return '';
  if (raw.includes('@')) return raw.toLowerCase();
  return raw.replace(/[^\d]/g, '');
};

const normalizeFacilities = (value) => {
  if (!Array.isArray(value)) return [];
  const mapped = value
    .map((facility) => {
      if (!facility || typeof facility !== 'object') return null;
      const id = toTrimmed(facility.id || facility.facility_id || facility.uuid || '');
      if (!id) return null;
      return {
        id,
        name: toTrimmed(facility.name || facility.facility_name || facility.display_name || ''),
        slug: toTrimmed(facility.slug || facility.facility_slug || ''),
      };
    })
    .filter(Boolean);

  return mapped.slice(0, MAX_FACILITY_OPTIONS);
};

const normalizeSession = (record) => {
  if (!record || typeof record !== 'object') return null;

  const identifier = normalizeIdentifier(record.identifier || record.email || record.phone);
  const password = String(record.password || '');
  const tenantId = toTrimmed(record.tenant_id || record.tenantId);
  const facilities = normalizeFacilities(record.facilities);

  if (!identifier || !password || !tenantId || facilities.length === 0) {
    return null;
  }

  const email = identifier.includes('@') ? identifier : '';
  const phone = email ? '' : identifier;

  return {
    identifier,
    email,
    phone,
    password,
    tenant_id: tenantId,
    facilities,
    remember_me: Boolean(record.remember_me),
    created_at: new Date().toISOString(),
  };
};

export const saveFacilitySelectionSession = (record) => {
  const normalized = normalizeSession(record);
  if (!normalized) return false;
  activeSession = normalized;
  return true;
};

export const readFacilitySelectionSession = () => activeSession;

export const clearFacilitySelectionSession = () => {
  activeSession = null;
};

