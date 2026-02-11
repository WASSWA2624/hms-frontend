/**
 * Onboarding Entry Persistence
 * Stores the landing facility selection to support resume flows.
 */
import { async as asyncStorage } from '@services/storage';

export const ONBOARDING_ENTRY_KEY = 'hms.onboarding.entry';

const FACILITY_ID_TO_TYPE = {
  clinic: 'CLINIC',
  hospital: 'HOSPITAL',
  lab: 'LAB',
  pharmacy: 'PHARMACY',
  emergency: 'OTHER',
};

export const resolveFacilitySelection = (value) => {
  if (Array.isArray(value)) {
    return resolveFacilitySelection(value[0]);
  }
  const normalized = String(value || '')
    .trim()
    .toLowerCase();
  return FACILITY_ID_TO_TYPE[normalized] ? normalized : null;
};

export const mapFacilityToBackendType = (facilityId) => {
  const resolved = resolveFacilitySelection(facilityId);
  return resolved ? FACILITY_ID_TO_TYPE[resolved] : null;
};

export const readOnboardingEntry = async () => {
  const stored = await asyncStorage.getItem(ONBOARDING_ENTRY_KEY);
  const facilityId = resolveFacilitySelection(stored?.facility_id);
  if (!facilityId) return null;
  return {
    facility_id: facilityId,
    facility_type: mapFacilityToBackendType(facilityId),
    updated_at: stored?.updated_at || null,
  };
};

export const saveOnboardingEntry = async (facilityId) => {
  const resolved = resolveFacilitySelection(facilityId);
  if (!resolved) return false;
  return asyncStorage.setItem(ONBOARDING_ENTRY_KEY, {
    facility_id: resolved,
    facility_type: mapFacilityToBackendType(resolved),
    updated_at: new Date().toISOString(),
  });
};

