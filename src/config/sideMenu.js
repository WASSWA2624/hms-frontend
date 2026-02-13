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

export { SETTINGS_ITEMS, PATIENTS_ITEMS, SCHEDULING_ITEMS };
