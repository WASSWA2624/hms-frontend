/**
 * Auth resume context persistence
 * Stores lightweight progress so users can continue from where they stopped.
 */
import { async as asyncStorage } from '@services/storage';

export const AUTH_RESUME_CONTEXT_KEY = 'hms.auth.resume.context';

const normalizeIdentifier = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.includes('@')) return raw.toLowerCase();
  return raw.replace(/[^\d]/g, '');
};

const normalizePath = (value) => {
  const raw = String(value || '').trim();
  if (!raw.startsWith('/')) return '/login';
  return raw;
};

const normalizeParams = (value) => {
  if (!value || typeof value !== 'object') return {};
  const pairs = Object.entries(value)
    .filter(([, item]) => item !== undefined && item !== null && item !== '')
    .map(([key, item]) => [key, String(item)]);
  return Object.fromEntries(pairs);
};

const normalizeRecord = (record) => {
  if (!record || typeof record !== 'object') return null;
  const identifier = normalizeIdentifier(record.identifier);
  if (!identifier) return null;

  return {
    identifier,
    next_path: normalizePath(record.next_path),
    params: normalizeParams(record.params),
    updated_at: typeof record.updated_at === 'string' ? record.updated_at : new Date().toISOString(),
  };
};

export const saveAuthResumeContext = async (record) => {
  const normalized = normalizeRecord(record);
  if (!normalized) return false;
  return asyncStorage.setItem(AUTH_RESUME_CONTEXT_KEY, normalized);
};

export const readAuthResumeContext = async () => {
  const stored = await asyncStorage.getItem(AUTH_RESUME_CONTEXT_KEY);
  return normalizeRecord(stored);
};

export const clearAuthResumeContext = async () => {
  return asyncStorage.removeItem(AUTH_RESUME_CONTEXT_KEY);
};

