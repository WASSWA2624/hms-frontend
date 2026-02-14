/**
 * Sidebar menu configuration (app-router.mdc: paths omit group segments).
 * Each main item: id, icon, path, name (i18n key for locale), children (null or array).
 * Children: id, icon, path, name (no children). Icons via MENU_ICON_GLYPHS / getMenuIconGlyph.
 */

/** @typedef {{ id: string, icon: string, path: string, name: string, roles?: string[], children?: null | Array<{ id: string, icon: string, path: string, name: string, roles?: string[] }> }} MainNavItem */
/** @typedef {{ id: string, icon: string, path: string, name: string, roles?: string[] }} MainNavChild */

/** Icon key → glyph (single source of truth for menu icons; UI uses getMenuIconGlyph). */
export const MENU_ICON_GLYPHS = {
  'home-outline': '🏠',
  'settings-outline': '⚙',
  'map-outline': '📍',
  'key-outline': '🔑',
  'shield-outline': '🛡',
  'shield-checkmark-outline': '🛡',
  'bed-outline': '🛏',
  'git-branch-outline': '〰',
  'people-outline': '👥',
  'folder-outline': '📁',
  'business-outline': '🏢',
  'lock-open-outline': '🔓',
  'lock-closed-outline': '🔒',
  'layers-outline': '📚',
  'grid-outline': '▦',
  'person-outline': '👤',
  'time-outline': '🕐',
  'heart-outline': '❤',
  'medkit-outline': '🏥',
  'log-in-outline': '🔐',
  'person-add-outline': '👤',
  'mail-outline': '✉',
  'call-outline': '📞',
};

const DEFAULT_ICON_GLYPH = '•';
const MAIN_NAV_I18N = 'navigation.items.main';
const PATIENT_ACCESS_ROLES = [
  'APP_ADMIN',
  'SUPER_ADMIN',
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
  'EMERGENCY_OFFICER',
];
const SCHEDULING_ACCESS_ROLES = [...PATIENT_ACCESS_ROLES];
const CLINICAL_ACCESS_ROLES = [...PATIENT_ACCESS_ROLES];
const IPD_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES];
const ICU_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES];
const THEATRE_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES];
const EMERGENCY_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES];

export function getMenuIconGlyph(iconKey) {
  if (!iconKey) return DEFAULT_ICON_GLYPH;
  return MENU_ICON_GLYPHS[iconKey] ?? DEFAULT_ICON_GLYPH;
}

/**
 * Resolve display label for a nav item (locale support via name).
 * @param {Function} t - i18n translate
 * @param {{ name?: string, id?: string }} item - item with name (i18n key) or id fallback
 * @param {string} [prefix=MAIN_NAV_I18N] - i18n prefix when using id fallback
 * @returns {string}
 */
export function getNavItemLabel(t, item, prefix = MAIN_NAV_I18N) {
  if (!item) return '';
  if (item.name) return t(item.name);
  if (item.id) return t(`${prefix}.${item.id}`);
  return '';
}

// ─── Settings children (same structure: id, icon, path, name; no children) ───
/** @type {MainNavChild[]} */
const SETTINGS_ITEMS = [
  {
    id: 'settings-addresses',
    icon: 'map-outline',
    path: '/settings/addresses',
    name: `${MAIN_NAV_I18N}.settings-addresses`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-api-keys',
    icon: 'key-outline',
    path: '/settings/api-keys',
    name: `${MAIN_NAV_I18N}.settings-api-keys`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-api-key-permissions',
    icon: 'shield-outline',
    path: '/settings/api-key-permissions',
    name: `${MAIN_NAV_I18N}.settings-api-key-permissions`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-beds',
    icon: 'bed-outline',
    path: '/settings/beds',
    name: `${MAIN_NAV_I18N}.settings-beds`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-branches',
    icon: 'git-branch-outline',
    path: '/settings/branches',
    name: `${MAIN_NAV_I18N}.settings-branches`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-contacts',
    icon: 'people-outline',
    path: '/settings/contacts',
    name: `${MAIN_NAV_I18N}.settings-contacts`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  { id: 'settings-departments', icon: 'folder-outline', path: '/settings/departments', name: `${MAIN_NAV_I18N}.settings-departments` },
  {
    id: 'settings-facilities',
    icon: 'business-outline',
    path: '/settings/facilities',
    name: `${MAIN_NAV_I18N}.settings-facilities`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-oauth-accounts',
    icon: 'lock-open-outline',
    path: '/settings/oauth-accounts',
    name: `${MAIN_NAV_I18N}.settings-oauth-accounts`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-permissions',
    icon: 'shield-outline',
    path: '/settings/permissions',
    name: `${MAIN_NAV_I18N}.settings-permissions`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-role-permissions',
    icon: 'shield-checkmark-outline',
    path: '/settings/role-permissions',
    name: `${MAIN_NAV_I18N}.settings-role-permissions`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  { id: 'settings-roles', icon: 'people-outline', path: '/settings/roles', name: `${MAIN_NAV_I18N}.settings-roles` },
  { id: 'settings-rooms', icon: 'home-outline', path: '/settings/rooms', name: `${MAIN_NAV_I18N}.settings-rooms` },
  {
    id: 'settings-tenants',
    icon: 'layers-outline',
    path: '/settings/tenants',
    name: `${MAIN_NAV_I18N}.settings-tenants`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-units',
    icon: 'grid-outline',
    path: '/settings/units',
    name: `${MAIN_NAV_I18N}.settings-units`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-user-mfas',
    icon: 'lock-closed-outline',
    path: '/settings/user-mfas',
    name: `${MAIN_NAV_I18N}.settings-user-mfas`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-user-profiles',
    icon: 'person-outline',
    path: '/settings/user-profiles',
    name: `${MAIN_NAV_I18N}.settings-user-profiles`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-user-roles',
    icon: 'people-outline',
    path: '/settings/user-roles',
    name: `${MAIN_NAV_I18N}.settings-user-roles`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-user-sessions',
    icon: 'time-outline',
    path: '/settings/user-sessions',
    name: `${MAIN_NAV_I18N}.settings-user-sessions`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  {
    id: 'settings-users',
    icon: 'people-outline',
    path: '/settings/users',
    name: `${MAIN_NAV_I18N}.settings-users`,
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  },
  { id: 'settings-wards', icon: 'medkit-outline', path: '/settings/wards', name: `${MAIN_NAV_I18N}.settings-wards` },
];

/** @type {MainNavChild[]} */
const PATIENTS_ITEMS = [
  {
    id: 'patients-patients',
    icon: 'people-outline',
    path: '/patients/patients',
    name: `${MAIN_NAV_I18N}.patients-patients`,
    roles: PATIENT_ACCESS_ROLES,
  },
  {
    id: 'patients-patient-identifiers',
    icon: 'person-outline',
    path: '/patients/patient-identifiers',
    name: `${MAIN_NAV_I18N}.patients-patient-identifiers`,
    roles: PATIENT_ACCESS_ROLES,
  },
  {
    id: 'patients-patient-contacts',
    icon: 'call-outline',
    path: '/patients/patient-contacts',
    name: `${MAIN_NAV_I18N}.patients-patient-contacts`,
    roles: PATIENT_ACCESS_ROLES,
  },
  {
    id: 'patients-patient-guardians',
    icon: 'people-outline',
    path: '/patients/patient-guardians',
    name: `${MAIN_NAV_I18N}.patients-patient-guardians`,
    roles: PATIENT_ACCESS_ROLES,
  },
  {
    id: 'patients-patient-allergies',
    icon: 'medkit-outline',
    path: '/patients/patient-allergies',
    name: `${MAIN_NAV_I18N}.patients-patient-allergies`,
    roles: PATIENT_ACCESS_ROLES,
  },
  {
    id: 'patients-patient-medical-histories',
    icon: 'folder-outline',
    path: '/patients/patient-medical-histories',
    name: `${MAIN_NAV_I18N}.patients-patient-medical-histories`,
    roles: PATIENT_ACCESS_ROLES,
  },
  {
    id: 'patients-patient-documents',
    icon: 'folder-outline',
    path: '/patients/patient-documents',
    name: `${MAIN_NAV_I18N}.patients-patient-documents`,
    roles: PATIENT_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const SCHEDULING_ITEMS = [
  {
    id: 'scheduling-appointments',
    icon: 'time-outline',
    path: '/scheduling/appointments',
    name: `${MAIN_NAV_I18N}.scheduling-appointments`,
    roles: SCHEDULING_ACCESS_ROLES,
  },
  {
    id: 'scheduling-provider-schedules',
    icon: 'time-outline',
    path: '/scheduling/provider-schedules',
    name: `${MAIN_NAV_I18N}.scheduling-provider-schedules`,
    roles: SCHEDULING_ACCESS_ROLES,
  },
  {
    id: 'scheduling-availability-slots',
    icon: 'grid-outline',
    path: '/scheduling/availability-slots',
    name: `${MAIN_NAV_I18N}.scheduling-availability-slots`,
    roles: SCHEDULING_ACCESS_ROLES,
  },
  {
    id: 'scheduling-visit-queues',
    icon: 'people-outline',
    path: '/scheduling/visit-queues',
    name: `${MAIN_NAV_I18N}.scheduling-visit-queues`,
    roles: SCHEDULING_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const CLINICAL_ITEMS = [
  {
    id: 'clinical-encounters',
    icon: 'time-outline',
    path: '/clinical/encounters',
    name: `${MAIN_NAV_I18N}.clinical-encounters`,
    roles: CLINICAL_ACCESS_ROLES,
  },
  {
    id: 'clinical-clinical-notes',
    icon: 'folder-outline',
    path: '/clinical/clinical-notes',
    name: `${MAIN_NAV_I18N}.clinical-clinical-notes`,
    roles: CLINICAL_ACCESS_ROLES,
  },
  {
    id: 'clinical-diagnoses',
    icon: 'medkit-outline',
    path: '/clinical/diagnoses',
    name: `${MAIN_NAV_I18N}.clinical-diagnoses`,
    roles: CLINICAL_ACCESS_ROLES,
  },
  {
    id: 'clinical-procedures',
    icon: 'grid-outline',
    path: '/clinical/procedures',
    name: `${MAIN_NAV_I18N}.clinical-procedures`,
    roles: CLINICAL_ACCESS_ROLES,
  },
  {
    id: 'clinical-vital-signs',
    icon: 'heart-outline',
    path: '/clinical/vital-signs',
    name: `${MAIN_NAV_I18N}.clinical-vital-signs`,
    roles: CLINICAL_ACCESS_ROLES,
  },
  {
    id: 'clinical-care-plans',
    icon: 'layers-outline',
    path: '/clinical/care-plans',
    name: `${MAIN_NAV_I18N}.clinical-care-plans`,
    roles: CLINICAL_ACCESS_ROLES,
  },
  {
    id: 'clinical-referrals',
    icon: 'git-branch-outline',
    path: '/clinical/referrals',
    name: `${MAIN_NAV_I18N}.clinical-referrals`,
    roles: CLINICAL_ACCESS_ROLES,
  },
  {
    id: 'clinical-follow-ups',
    icon: 'mail-outline',
    path: '/clinical/follow-ups',
    name: `${MAIN_NAV_I18N}.clinical-follow-ups`,
    roles: CLINICAL_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const IPD_ITEMS = [
  {
    id: 'ipd-admissions',
    icon: 'time-outline',
    path: '/ipd/admissions',
    name: `${MAIN_NAV_I18N}.ipd-admissions`,
    roles: IPD_ACCESS_ROLES,
  },
  {
    id: 'ipd-bed-assignments',
    icon: 'bed-outline',
    path: '/ipd/bed-assignments',
    name: `${MAIN_NAV_I18N}.ipd-bed-assignments`,
    roles: IPD_ACCESS_ROLES,
  },
  {
    id: 'ipd-ward-rounds',
    icon: 'layers-outline',
    path: '/ipd/ward-rounds',
    name: `${MAIN_NAV_I18N}.ipd-ward-rounds`,
    roles: IPD_ACCESS_ROLES,
  },
  {
    id: 'ipd-nursing-notes',
    icon: 'folder-outline',
    path: '/ipd/nursing-notes',
    name: `${MAIN_NAV_I18N}.ipd-nursing-notes`,
    roles: IPD_ACCESS_ROLES,
  },
  {
    id: 'ipd-medication-administrations',
    icon: 'medkit-outline',
    path: '/ipd/medication-administrations',
    name: `${MAIN_NAV_I18N}.ipd-medication-administrations`,
    roles: IPD_ACCESS_ROLES,
  },
  {
    id: 'ipd-discharge-summaries',
    icon: 'mail-outline',
    path: '/ipd/discharge-summaries',
    name: `${MAIN_NAV_I18N}.ipd-discharge-summaries`,
    roles: IPD_ACCESS_ROLES,
  },
  {
    id: 'ipd-transfer-requests',
    icon: 'git-branch-outline',
    path: '/ipd/transfer-requests',
    name: `${MAIN_NAV_I18N}.ipd-transfer-requests`,
    roles: IPD_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const ICU_ITEMS = [
  {
    id: 'icu-icu-stays',
    icon: 'bed-outline',
    path: '/icu/icu-stays',
    name: `${MAIN_NAV_I18N}.icu-icu-stays`,
    roles: ICU_ACCESS_ROLES,
  },
  {
    id: 'icu-icu-observations',
    icon: 'heart-outline',
    path: '/icu/icu-observations',
    name: `${MAIN_NAV_I18N}.icu-icu-observations`,
    roles: ICU_ACCESS_ROLES,
  },
  {
    id: 'icu-critical-alerts',
    icon: 'shield-checkmark-outline',
    path: '/icu/critical-alerts',
    name: `${MAIN_NAV_I18N}.icu-critical-alerts`,
    roles: ICU_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const THEATRE_ITEMS = [
  {
    id: 'theatre-theatre-cases',
    icon: 'medkit-outline',
    path: '/theatre/theatre-cases',
    name: `${MAIN_NAV_I18N}.theatre-theatre-cases`,
    roles: THEATRE_ACCESS_ROLES,
  },
  {
    id: 'theatre-anesthesia-records',
    icon: 'folder-outline',
    path: '/theatre/anesthesia-records',
    name: `${MAIN_NAV_I18N}.theatre-anesthesia-records`,
    roles: THEATRE_ACCESS_ROLES,
  },
  {
    id: 'theatre-post-op-notes',
    icon: 'mail-outline',
    path: '/theatre/post-op-notes',
    name: `${MAIN_NAV_I18N}.theatre-post-op-notes`,
    roles: THEATRE_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const EMERGENCY_ITEMS = [
  {
    id: 'emergency-emergency-cases',
    icon: 'medkit-outline',
    path: '/emergency/emergency-cases',
    name: `${MAIN_NAV_I18N}.emergency-emergency-cases`,
    roles: EMERGENCY_ACCESS_ROLES,
  },
  {
    id: 'emergency-triage-assessments',
    icon: 'time-outline',
    path: '/emergency/triage-assessments',
    name: `${MAIN_NAV_I18N}.emergency-triage-assessments`,
    roles: EMERGENCY_ACCESS_ROLES,
  },
  {
    id: 'emergency-emergency-responses',
    icon: 'shield-outline',
    path: '/emergency/emergency-responses',
    name: `${MAIN_NAV_I18N}.emergency-emergency-responses`,
    roles: EMERGENCY_ACCESS_ROLES,
  },
  {
    id: 'emergency-ambulances',
    icon: 'business-outline',
    path: '/emergency/ambulances',
    name: `${MAIN_NAV_I18N}.emergency-ambulances`,
    roles: EMERGENCY_ACCESS_ROLES,
  },
  {
    id: 'emergency-ambulance-dispatches',
    icon: 'git-branch-outline',
    path: '/emergency/ambulance-dispatches',
    name: `${MAIN_NAV_I18N}.emergency-ambulance-dispatches`,
    roles: EMERGENCY_ACCESS_ROLES,
  },
  {
    id: 'emergency-ambulance-trips',
    icon: 'time-outline',
    path: '/emergency/ambulance-trips',
    name: `${MAIN_NAV_I18N}.emergency-ambulance-trips`,
    roles: EMERGENCY_ACCESS_ROLES,
  },
];

// ─── Main sidebar nav: id, icon, path, name, children (null = no nesting) ─────
/** @type {MainNavItem[]} */
export const MAIN_NAV_ITEMS = [
  { id: 'dashboard', icon: 'grid-outline', path: '/dashboard', name: `${MAIN_NAV_I18N}.dashboard`, children: null },
  {
    id: 'patients',
    icon: 'people-outline',
    path: '/patients',
    name: `${MAIN_NAV_I18N}.patients`,
    roles: PATIENT_ACCESS_ROLES,
    children: PATIENTS_ITEMS,
  },
  {
    id: 'scheduling',
    icon: 'time-outline',
    path: '/scheduling',
    name: `${MAIN_NAV_I18N}.scheduling`,
    roles: SCHEDULING_ACCESS_ROLES,
    children: SCHEDULING_ITEMS,
  },
  {
    id: 'clinical',
    icon: 'medkit-outline',
    path: '/clinical',
    name: `${MAIN_NAV_I18N}.clinical`,
    roles: CLINICAL_ACCESS_ROLES,
    children: CLINICAL_ITEMS,
  },
  {
    id: 'ipd',
    icon: 'bed-outline',
    path: '/ipd',
    name: `${MAIN_NAV_I18N}.ipd`,
    roles: IPD_ACCESS_ROLES,
    children: IPD_ITEMS,
  },
  {
    id: 'icu',
    icon: 'heart-outline',
    path: '/icu',
    name: `${MAIN_NAV_I18N}.icu`,
    roles: ICU_ACCESS_ROLES,
    children: ICU_ITEMS,
  },
  {
    id: 'theatre',
    icon: 'medkit-outline',
    path: '/theatre',
    name: `${MAIN_NAV_I18N}.theatre`,
    roles: THEATRE_ACCESS_ROLES,
    children: THEATRE_ITEMS,
  },
  {
    id: 'emergency',
    icon: 'call-outline',
    path: '/emergency',
    name: `${MAIN_NAV_I18N}.emergency`,
    roles: EMERGENCY_ACCESS_ROLES,
    children: EMERGENCY_ITEMS,
  },
  { id: 'settings', icon: 'settings-outline', path: '/settings', name: `${MAIN_NAV_I18N}.settings`, children: SETTINGS_ITEMS },
];

/** Flattened list (main + all children). Labels via getNavItemLabel(t, item). */
export const SIDE_MENU_ITEMS = (() => {
  const out = [];
  for (const it of MAIN_NAV_ITEMS) {
    out.push(it);
    if (it.children && it.children.length > 0) out.push(...it.children);
  }
  return out;
})();

/** Patient shell nav. Labels via t('navigation.items.patient.<id>'). */
export const PATIENT_MENU_ITEMS = [
  { id: 'home', icon: 'home-outline', path: '/', name: 'navigation.items.patient.home' },
];

/** @deprecated Kept for export compatibility */
export const AUTH_ITEMS = [];

export {
  SETTINGS_ITEMS,
  PATIENTS_ITEMS,
  SCHEDULING_ITEMS,
  CLINICAL_ITEMS,
  IPD_ITEMS,
  ICU_ITEMS,
  THEATRE_ITEMS,
  EMERGENCY_ITEMS,
};
