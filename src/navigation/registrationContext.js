/**
 * Registration context persistence
 * Stores light-weight onboarding registration data for post-login welcome context.
 */
import { async as asyncStorage } from '@services/storage';

export const REGISTRATION_CONTEXT_KEY = 'hms.onboarding.registration.context';

const normalizeRecord = (record) => {
  if (!record || typeof record !== 'object') return null;
  const expiryMinutes = Number(record.verification_expires_in_minutes);
  return {
    email: typeof record.email === 'string' ? record.email.trim().toLowerCase() : '',
    admin_name: typeof record.admin_name === 'string' ? record.admin_name.trim() : '',
    facility_name: typeof record.facility_name === 'string' ? record.facility_name.trim() : '',
    facility_type: typeof record.facility_type === 'string' ? record.facility_type.trim().toUpperCase() : '',
    tenant_id: typeof record.tenant_id === 'string' ? record.tenant_id : '',
    facility_id: typeof record.facility_id === 'string' ? record.facility_id : '',
    tenant_name: typeof record.tenant_name === 'string' ? record.tenant_name.trim() : '',
    facility_display_name:
      typeof record.facility_display_name === 'string' ? record.facility_display_name.trim() : '',
    created_at: typeof record.created_at === 'string' ? record.created_at : new Date().toISOString(),
    verification_expires_in_minutes:
      Number.isFinite(expiryMinutes) && expiryMinutes > 0 ? Math.round(expiryMinutes) : 15,
  };
};

export const saveRegistrationContext = async (record) => {
  const normalized = normalizeRecord(record);
  if (!normalized || !normalized.email) return false;
  return asyncStorage.setItem(REGISTRATION_CONTEXT_KEY, normalized);
};

export const readRegistrationContext = async () => {
  const stored = await asyncStorage.getItem(REGISTRATION_CONTEXT_KEY);
  return normalizeRecord(stored);
};

export const clearRegistrationContext = async () => {
  return asyncStorage.removeItem(REGISTRATION_CONTEXT_KEY);
};
