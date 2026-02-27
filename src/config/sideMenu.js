/**
 * Sidebar menu configuration.
 * Main items are module-level entries and intentionally flat (no nested children).
 */
import {
  ROLE_KEYS,
  SCOPE_KEYS,
  getScopeRoleKeys,
} from '@config/accessPolicy';

/** @typedef {{ id: string, icon: string, path: string, name: string, roles?: string[], children?: null | Array<{ id: string, icon: string, path: string, name: string, roles?: string[] }> }} MainNavItem */
/** @typedef {{ id: string, icon: string, path: string, name: string, roles?: string[] }} MainNavChild */

/** Icon key -> glyph (single source of truth for menu icons; UI uses getMenuIconGlyph). */
export const MENU_ICON_GLYPHS = {
  'home-outline': '\u{1F3E0}',
  'settings-outline': '\u2699',
  'map-outline': '\u{1F4CD}',
  'key-outline': '\u{1F511}',
  'shield-outline': '\u{1F6E1}',
  'shield-checkmark-outline': '\u{1F6E1}',
  'warning-outline': '\u26A0',
  'bed-outline': '\u{1F6CF}',
  'git-branch-outline': '\u{3030}',
  'people-outline': '\u{1F465}',
  'folder-outline': '\u{1F4C1}',
  'business-outline': '\u{1F3E2}',
  'lock-open-outline': '\u{1F513}',
  'lock-closed-outline': '\u{1F512}',
  'layers-outline': '\u{1F4DA}',
  'grid-outline': '\u25A6',
  'list-outline': '\u2630',
  'image-outline': '\u{1F5BC}',
  'person-outline': '\u{1F464}',
  'time-outline': '\u{1F550}',
  'heart-outline': '\u2764',
  'medkit-outline': '\u{1F3E5}',
  'log-in-outline': '\u{1F510}',
  'person-add-outline': '\u{1F464}',
  'mail-outline': '\u2709',
  'call-outline': '\u{1F4DE}',
};

const DEFAULT_ICON_GLYPH = '\u2022';
const MAIN_NAV_I18N = 'navigation.items.main';

const DASHBOARD_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.DASHBOARD, 'read');
const SETTINGS_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.SETTINGS, 'read');
const PATIENT_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.PATIENTS, 'read');
const PATIENT_PORTAL_ACCESS_ROLES = [ROLE_KEYS.PATIENT];
const SCHEDULING_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.SCHEDULING, 'read');
const CLINICAL_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.CLINICAL, 'read');
const IPD_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.IPD, 'read');
const ICU_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.ICU, 'read');
const THEATRE_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.THEATRE, 'read');
const EMERGENCY_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.EMERGENCY, 'read');
const LAB_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.LAB, 'read');
const RADIOLOGY_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.RADIOLOGY, 'read');
const PHARMACY_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.PHARMACY, 'read');
const INVENTORY_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.INVENTORY, 'read');
const BILLING_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.BILLING, 'read');
const HR_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.HR, 'read');
const HOUSEKEEPING_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.HOUSEKEEPING, 'read');
const BIOMEDICAL_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.BIOMEDICAL, 'read');
const REPORTS_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.REPORTS, 'read');
const COMMUNICATIONS_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.COMMUNICATIONS, 'read');
const SUBSCRIPTIONS_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.SUBSCRIPTIONS, 'read');
const INTEGRATIONS_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.INTEGRATIONS, 'read');
const COMPLIANCE_ACCESS_ROLES = getScopeRoleKeys(SCOPE_KEYS.COMPLIANCE, 'read');

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

const EMPTY_NAV_ITEMS = Object.freeze([]);

/**
 * Legacy nested child exports are intentionally empty.
 * Kept for backward compatibility with existing import paths.
 */
const SETTINGS_ITEMS = EMPTY_NAV_ITEMS;
const PATIENTS_ITEMS = EMPTY_NAV_ITEMS;
const SCHEDULING_ITEMS = EMPTY_NAV_ITEMS;
const CLINICAL_ITEMS = EMPTY_NAV_ITEMS;
const IPD_ITEMS = EMPTY_NAV_ITEMS;
const ICU_ITEMS = EMPTY_NAV_ITEMS;
const THEATRE_ITEMS = EMPTY_NAV_ITEMS;
const EMERGENCY_ITEMS = EMPTY_NAV_ITEMS;
const DIAGNOSTICS_ITEMS = EMPTY_NAV_ITEMS;
const LAB_ITEMS = EMPTY_NAV_ITEMS;
const RADIOLOGY_ITEMS = EMPTY_NAV_ITEMS;
const PHARMACY_ITEMS = EMPTY_NAV_ITEMS;
const INVENTORY_ITEMS = EMPTY_NAV_ITEMS;
const BILLING_ITEMS = EMPTY_NAV_ITEMS;
const HR_ITEMS = EMPTY_NAV_ITEMS;
const HOUSEKEEPING_ITEMS = EMPTY_NAV_ITEMS;
const HOUSEKEEPING_SERVICE_ITEMS = EMPTY_NAV_ITEMS;
const BIOMEDICAL_ITEMS = EMPTY_NAV_ITEMS;
const REPORTS_ITEMS = EMPTY_NAV_ITEMS;
const COMMUNICATIONS_ITEMS = EMPTY_NAV_ITEMS;
const SUBSCRIPTIONS_ITEMS = EMPTY_NAV_ITEMS;
const INTEGRATIONS_ITEMS = EMPTY_NAV_ITEMS;
const COMPLIANCE_ITEMS = EMPTY_NAV_ITEMS;

/** @type {MainNavItem[]} */
export const MAIN_NAV_ITEMS = Object.freeze([
  {
    id: 'dashboard',
    icon: 'grid-outline',
    path: '/dashboard',
    name: `${MAIN_NAV_I18N}.dashboard`,
    roles: DASHBOARD_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'patients',
    icon: 'people-outline',
    path: '/patients',
    name: `${MAIN_NAV_I18N}.patients`,
    roles: PATIENT_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'scheduling',
    icon: 'time-outline',
    path: '/scheduling',
    name: `${MAIN_NAV_I18N}.scheduling`,
    roles: SCHEDULING_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'clinical',
    icon: 'medkit-outline',
    path: '/clinical',
    name: `${MAIN_NAV_I18N}.clinical`,
    roles: CLINICAL_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'ipd',
    icon: 'bed-outline',
    path: '/ipd',
    name: `${MAIN_NAV_I18N}.ipd`,
    roles: IPD_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'icu',
    icon: 'heart-outline',
    path: '/icu',
    name: `${MAIN_NAV_I18N}.icu`,
    roles: ICU_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'theatre',
    icon: 'medkit-outline',
    path: '/theatre',
    name: `${MAIN_NAV_I18N}.theatre`,
    roles: THEATRE_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'emergency',
    icon: 'call-outline',
    path: '/emergency',
    name: `${MAIN_NAV_I18N}.emergency`,
    roles: EMERGENCY_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'lab',
    icon: 'medkit-outline',
    path: '/lab',
    name: `${MAIN_NAV_I18N}.diagnostics-lab`,
    roles: LAB_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'radiology',
    icon: 'image-outline',
    path: '/diagnostics/radiology',
    name: `${MAIN_NAV_I18N}.diagnostics-radiology`,
    roles: RADIOLOGY_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'pharmacy',
    icon: 'medkit-outline',
    path: '/pharmacy',
    name: `${MAIN_NAV_I18N}.pharmacy`,
    roles: PHARMACY_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'inventory',
    icon: 'layers-outline',
    path: '/inventory',
    name: `${MAIN_NAV_I18N}.inventory`,
    roles: INVENTORY_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'billing',
    icon: 'layers-outline',
    path: '/billing',
    name: `${MAIN_NAV_I18N}.billing`,
    roles: BILLING_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'hr',
    icon: 'people-outline',
    path: '/hr',
    name: `${MAIN_NAV_I18N}.hr`,
    roles: HR_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'housekeeping',
    icon: 'home-outline',
    path: '/housekeeping',
    name: `${MAIN_NAV_I18N}.housekeeping`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'biomedical',
    icon: 'medkit-outline',
    path: '/housekeeping/biomedical',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical`,
    roles: BIOMEDICAL_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'reports',
    icon: 'grid-outline',
    path: '/reports',
    name: `${MAIN_NAV_I18N}.reports`,
    roles: REPORTS_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'communications',
    icon: 'mail-outline',
    path: '/communications',
    name: `${MAIN_NAV_I18N}.communications`,
    roles: COMMUNICATIONS_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'subscriptions',
    icon: 'key-outline',
    path: '/subscriptions',
    name: `${MAIN_NAV_I18N}.subscriptions`,
    roles: SUBSCRIPTIONS_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'integrations',
    icon: 'git-branch-outline',
    path: '/integrations',
    name: `${MAIN_NAV_I18N}.integrations`,
    roles: INTEGRATIONS_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'compliance',
    icon: 'shield-checkmark-outline',
    path: '/compliance',
    name: `${MAIN_NAV_I18N}.compliance`,
    roles: COMPLIANCE_ACCESS_ROLES,
    children: null,
  },
  {
    id: 'settings',
    icon: 'settings-outline',
    path: '/settings',
    name: `${MAIN_NAV_I18N}.settings`,
    roles: SETTINGS_ACCESS_ROLES,
    children: null,
  },
]);

/** Flat list (staff menu only, no nested children). */
export const SIDE_MENU_ITEMS = Object.freeze([...MAIN_NAV_ITEMS]);

/** Patient shell nav. Labels via t('navigation.items.patient.<id>'). */
export const PATIENT_MENU_ITEMS = Object.freeze([
  {
    id: 'home',
    icon: 'home-outline',
    path: '/portal',
    name: 'navigation.items.patient.home',
    roles: PATIENT_PORTAL_ACCESS_ROLES,
  },
  {
    id: 'appointments',
    icon: 'time-outline',
    path: '/appointments',
    name: 'navigation.items.patient.appointments',
    roles: PATIENT_PORTAL_ACCESS_ROLES,
  },
  {
    id: 'results',
    icon: 'heart-outline',
    path: '/results',
    name: 'navigation.items.patient.results',
    roles: PATIENT_PORTAL_ACCESS_ROLES,
  },
  {
    id: 'prescriptions',
    icon: 'medkit-outline',
    path: '/prescriptions',
    name: 'navigation.items.patient.prescriptions',
    roles: PATIENT_PORTAL_ACCESS_ROLES,
  },
  {
    id: 'billing',
    icon: 'business-outline',
    path: '/billing',
    name: 'navigation.items.patient.billing',
    roles: PATIENT_PORTAL_ACCESS_ROLES,
  },
]);

/** @deprecated Kept for export compatibility */
export const AUTH_ITEMS = Object.freeze([]);

export {
  SETTINGS_ITEMS,
  PATIENTS_ITEMS,
  SCHEDULING_ITEMS,
  CLINICAL_ITEMS,
  IPD_ITEMS,
  ICU_ITEMS,
  THEATRE_ITEMS,
  EMERGENCY_ITEMS,
  DIAGNOSTICS_ITEMS,
  LAB_ITEMS,
  RADIOLOGY_ITEMS,
  PHARMACY_ITEMS,
  INVENTORY_ITEMS,
  BILLING_ITEMS,
  HR_ITEMS,
  HOUSEKEEPING_ITEMS,
  HOUSEKEEPING_SERVICE_ITEMS,
  BIOMEDICAL_ITEMS,
  REPORTS_ITEMS,
  COMMUNICATIONS_ITEMS,
  SUBSCRIPTIONS_ITEMS,
  INTEGRATIONS_ITEMS,
  COMPLIANCE_ITEMS,
};
