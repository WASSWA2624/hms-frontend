/**
 * Onboarding progress persistence
 * Stores the active onboarding step and non-sensitive context required for resume flows.
 */
import { async as asyncStorage } from '@services/storage';

export const ONBOARDING_PROGRESS_KEY = 'hms.onboarding.progress';

export const ONBOARDING_STEPS = [
  'landing',
  'register',
  'resume_link_sent',
  'resume',
  'provisioning',
  'welcome',
  'checklist',
  'modules',
  'trial',
  'upgrade',
  'plan',
  'billing_cycle',
  'payment',
  'payment_success',
];

const STEP_TO_PATH = {
  landing: '/landing',
  register: '/register',
  resume_link_sent: '/resume-link-sent',
  resume: '/resume',
  provisioning: '/provisioning',
  welcome: '/(onboarding)/welcome',
  checklist: '/checklist',
  modules: '/modules',
  trial: '/trial',
  upgrade: '/upgrade',
  plan: '/plan',
  billing_cycle: '/billing-cycle',
  payment: '/payment',
  payment_success: '/payment-success',
};

const PATH_TO_STEP = {
  ...Object.fromEntries(Object.entries(STEP_TO_PATH).map(([step, path]) => [path, step])),
  '/welcome': 'welcome',
};

const sanitizeString = (value) => {
  if (value === undefined || value === null) return '';
  return String(value).trim();
};

const sanitizeStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  const sanitized = value
    .map((item) => sanitizeString(item))
    .filter(Boolean);
  return Array.from(new Set(sanitized));
};

export const resolveOnboardingStep = (value) => {
  const normalized = sanitizeString(value).toLowerCase().replace(/[-\s]+/g, '_');
  return ONBOARDING_STEPS.includes(normalized) ? normalized : null;
};

export const resolveOnboardingPath = (step) => {
  const resolved = resolveOnboardingStep(step);
  return resolved ? STEP_TO_PATH[resolved] : null;
};

export const resolveOnboardingStepFromPath = (path) => {
  const normalizedPath = sanitizeString(path);
  return PATH_TO_STEP[normalizedPath] || null;
};

export const getOnboardingStepIndex = (step) => {
  const resolved = resolveOnboardingStep(step);
  if (!resolved) return -1;
  return ONBOARDING_STEPS.indexOf(resolved);
};

const normalizeContext = (value) => {
  if (!value || typeof value !== 'object') return {};

  const normalized = {
    email: sanitizeString(value.email).toLowerCase(),
    facility_type: sanitizeString(value.facility_type).toUpperCase(),
    facility_name: sanitizeString(value.facility_name),
    admin_name: sanitizeString(value.admin_name),
    tenant_id: sanitizeString(value.tenant_id),
    facility_id: sanitizeString(value.facility_id),
    subscription_id: sanitizeString(value.subscription_id),
    subscription_plan_id: sanitizeString(value.subscription_plan_id),
    invoice_id: sanitizeString(value.invoice_id),
    payment_id: sanitizeString(value.payment_id),
    billing_cycle: sanitizeString(value.billing_cycle).toUpperCase(),
    payment_method: sanitizeString(value.payment_method).toUpperCase(),
    payment_amount: sanitizeString(value.payment_amount),
    payment_currency: sanitizeString(value.payment_currency).toUpperCase(),
    trial_status: sanitizeString(value.trial_status).toUpperCase(),
    trial_start_date: sanitizeString(value.trial_start_date),
    trial_end_date: sanitizeString(value.trial_end_date),
    verification_expires_in_minutes: Number.isFinite(Number(value.verification_expires_in_minutes))
      ? Math.max(1, Math.round(Number(value.verification_expires_in_minutes)))
      : '',
    completed_checklist_ids: sanitizeStringArray(value.completed_checklist_ids),
    selected_module_ids: sanitizeStringArray(value.selected_module_ids),
  };

  return Object.fromEntries(Object.entries(normalized).filter(([, item]) => {
    if (Array.isArray(item)) return item.length > 0;
    return item !== '';
  }));
};

const normalizeRecord = (value) => {
  if (!value || typeof value !== 'object') return null;
  const step = resolveOnboardingStep(value.step);
  if (!step) return null;

  return {
    step,
    path: STEP_TO_PATH[step],
    context: normalizeContext(value.context),
    updated_at: sanitizeString(value.updated_at) || new Date().toISOString(),
  };
};

export const readOnboardingProgress = async () => {
  const stored = await asyncStorage.getItem(ONBOARDING_PROGRESS_KEY);
  return normalizeRecord(stored);
};

export const saveOnboardingProgress = async (record) => {
  const normalized = normalizeRecord(record);
  if (!normalized) return false;
  return asyncStorage.setItem(ONBOARDING_PROGRESS_KEY, normalized);
};

export const saveOnboardingStep = async (step, context = {}) => {
  const resolved = resolveOnboardingStep(step);
  if (!resolved) return false;

  const existing = await readOnboardingProgress();
  const mergedContext = {
    ...(existing?.context || {}),
    ...normalizeContext(context),
  };

  return saveOnboardingProgress({
    step: resolved,
    context: mergedContext,
    updated_at: new Date().toISOString(),
  });
};

export const mergeOnboardingContext = async (context = {}) => {
  const existing = await readOnboardingProgress();
  if (!existing) return false;

  return saveOnboardingProgress({
    ...existing,
    context: {
      ...(existing.context || {}),
      ...normalizeContext(context),
    },
    updated_at: new Date().toISOString(),
  });
};

export const clearOnboardingProgress = async () => asyncStorage.removeItem(ONBOARDING_PROGRESS_KEY);
