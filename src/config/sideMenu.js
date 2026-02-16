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
  'warning-outline': '⚠',
  'bed-outline': '🛏',
  'git-branch-outline': '〰',
  'people-outline': '👥',
  'folder-outline': '📁',
  'business-outline': '🏢',
  'lock-open-outline': '🔓',
  'lock-closed-outline': '🔒',
  'layers-outline': '📚',
  'grid-outline': '▦',
  'list-outline': '☰',
  'image-outline': '🖼',
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
const PATIENT_PORTAL_ACCESS_ROLES = [
  'APP_ADMIN',
  'SUPER_ADMIN',
  'PATIENT',
  'PATIENT_USER',
  'PATIENT_PORTAL_USER',
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
  'EMERGENCY_OFFICER',
  'FINANCE_MANAGER',
  'ACCOUNTANT',
  'BILLING_CLERK',
  'INSURANCE_OFFICER',
];
const SCHEDULING_ACCESS_ROLES = [...PATIENT_ACCESS_ROLES];
const CLINICAL_ACCESS_ROLES = [...PATIENT_ACCESS_ROLES];
const IPD_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES];
const ICU_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES];
const THEATRE_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES];
const EMERGENCY_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES];
const DIAGNOSTICS_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES];
const PHARMACY_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES, 'PHARMACIST', 'PHARMACY_TECHNICIAN'];
const INVENTORY_ACCESS_ROLES = [
  ...CLINICAL_ACCESS_ROLES,
  'PHARMACIST',
  'PHARMACY_TECHNICIAN',
  'INVENTORY_MANAGER',
  'STORE_KEEPER',
  'PROCUREMENT_OFFICER',
];
const BILLING_ACCESS_ROLES = [
  ...CLINICAL_ACCESS_ROLES,
  'FINANCE_MANAGER',
  'ACCOUNTANT',
  'BILLING_CLERK',
  'INSURANCE_OFFICER',
];
const HR_ACCESS_ROLES = [
  ...CLINICAL_ACCESS_ROLES,
  'HR_MANAGER',
  'PAYROLL_MANAGER',
  'NURSE_MANAGER',
];
const HOUSEKEEPING_ACCESS_ROLES = [
  ...CLINICAL_ACCESS_ROLES,
  'HOUSEKEEPING_MANAGER',
  'FACILITY_MANAGER',
  'MAINTENANCE_MANAGER',
];
const REPORTS_ACCESS_ROLES = [
  ...BILLING_ACCESS_ROLES,
  ...HR_ACCESS_ROLES,
  'REPORTING_ANALYST',
];
const COMMUNICATIONS_ACCESS_ROLES = [...CLINICAL_ACCESS_ROLES];
const SUBSCRIPTIONS_ACCESS_ROLES = ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'];
const INTEGRATIONS_ACCESS_ROLES = ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'];
const COMPLIANCE_ACCESS_ROLES = ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'];

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
    id: 'clinical-clinical-alerts',
    icon: 'warning-outline',
    path: '/clinical/clinical-alerts',
    name: `${MAIN_NAV_I18N}.clinical-clinical-alerts`,
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

/** @type {MainNavChild[]} */
const DIAGNOSTICS_ITEMS = [
  {
    id: 'diagnostics-lab',
    icon: 'medkit-outline',
    path: '/diagnostics/lab',
    name: `${MAIN_NAV_I18N}.diagnostics-lab`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-lab-tests',
    icon: 'folder-outline',
    path: '/diagnostics/lab/lab-tests',
    name: `${MAIN_NAV_I18N}.diagnostics-lab-tests`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-lab-panels',
    icon: 'layers-outline',
    path: '/diagnostics/lab/lab-panels',
    name: `${MAIN_NAV_I18N}.diagnostics-lab-panels`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-lab-orders',
    icon: 'time-outline',
    path: '/diagnostics/lab/lab-orders',
    name: `${MAIN_NAV_I18N}.diagnostics-lab-orders`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-lab-order-items',
    icon: 'list-outline',
    path: '/diagnostics/lab/lab-order-items',
    name: `${MAIN_NAV_I18N}.diagnostics-lab-order-items`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-lab-samples',
    icon: 'grid-outline',
    path: '/diagnostics/lab/lab-samples',
    name: `${MAIN_NAV_I18N}.diagnostics-lab-samples`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-lab-results',
    icon: 'mail-outline',
    path: '/diagnostics/lab/lab-results',
    name: `${MAIN_NAV_I18N}.diagnostics-lab-results`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-lab-qc-logs',
    icon: 'shield-outline',
    path: '/diagnostics/lab/lab-qc-logs',
    name: `${MAIN_NAV_I18N}.diagnostics-lab-qc-logs`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-radiology',
    icon: 'medkit-outline',
    path: '/diagnostics/radiology',
    name: `${MAIN_NAV_I18N}.diagnostics-radiology`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-radiology-tests',
    icon: 'folder-outline',
    path: '/diagnostics/radiology/radiology-tests',
    name: `${MAIN_NAV_I18N}.diagnostics-radiology-tests`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-radiology-orders',
    icon: 'time-outline',
    path: '/diagnostics/radiology/radiology-orders',
    name: `${MAIN_NAV_I18N}.diagnostics-radiology-orders`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-radiology-results',
    icon: 'mail-outline',
    path: '/diagnostics/radiology/radiology-results',
    name: `${MAIN_NAV_I18N}.diagnostics-radiology-results`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-imaging-studies',
    icon: 'grid-outline',
    path: '/diagnostics/radiology/imaging-studies',
    name: `${MAIN_NAV_I18N}.diagnostics-imaging-studies`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-imaging-assets',
    icon: 'image-outline',
    path: '/diagnostics/radiology/imaging-assets',
    name: `${MAIN_NAV_I18N}.diagnostics-imaging-assets`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
  {
    id: 'diagnostics-pacs-links',
    icon: 'key-outline',
    path: '/diagnostics/radiology/pacs-links',
    name: `${MAIN_NAV_I18N}.diagnostics-pacs-links`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
  },
];

// ─── Main sidebar nav: id, icon, path, name, children (null = no nesting) ─────
/** @type {MainNavChild[]} */
const PHARMACY_ITEMS = [
  {
    id: 'pharmacy-drugs',
    icon: 'medkit-outline',
    path: '/pharmacy/drugs',
    name: `${MAIN_NAV_I18N}.pharmacy-drugs`,
    roles: PHARMACY_ACCESS_ROLES,
  },
  {
    id: 'pharmacy-drug-batches',
    icon: 'layers-outline',
    path: '/pharmacy/drug-batches',
    name: `${MAIN_NAV_I18N}.pharmacy-drug-batches`,
    roles: PHARMACY_ACCESS_ROLES,
  },
  {
    id: 'pharmacy-formulary-items',
    icon: 'grid-outline',
    path: '/pharmacy/formulary-items',
    name: `${MAIN_NAV_I18N}.pharmacy-formulary-items`,
    roles: PHARMACY_ACCESS_ROLES,
  },
  {
    id: 'pharmacy-pharmacy-orders',
    icon: 'time-outline',
    path: '/pharmacy/pharmacy-orders',
    name: `${MAIN_NAV_I18N}.pharmacy-pharmacy-orders`,
    roles: PHARMACY_ACCESS_ROLES,
  },
  {
    id: 'pharmacy-pharmacy-order-items',
    icon: 'grid-outline',
    path: '/pharmacy/pharmacy-order-items',
    name: `${MAIN_NAV_I18N}.pharmacy-pharmacy-order-items`,
    roles: PHARMACY_ACCESS_ROLES,
  },
  {
    id: 'pharmacy-dispense-logs',
    icon: 'folder-outline',
    path: '/pharmacy/dispense-logs',
    name: `${MAIN_NAV_I18N}.pharmacy-dispense-logs`,
    roles: PHARMACY_ACCESS_ROLES,
  },
  {
    id: 'pharmacy-adverse-events',
    icon: 'shield-outline',
    path: '/pharmacy/adverse-events',
    name: `${MAIN_NAV_I18N}.pharmacy-adverse-events`,
    roles: PHARMACY_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const INVENTORY_ITEMS = [
  {
    id: 'inventory-inventory-items',
    icon: 'layers-outline',
    path: '/inventory/inventory-items',
    name: `${MAIN_NAV_I18N}.inventory-inventory-items`,
    roles: INVENTORY_ACCESS_ROLES,
  },
  {
    id: 'inventory-inventory-stocks',
    icon: 'grid-outline',
    path: '/inventory/inventory-stocks',
    name: `${MAIN_NAV_I18N}.inventory-inventory-stocks`,
    roles: INVENTORY_ACCESS_ROLES,
  },
  {
    id: 'inventory-stock-movements',
    icon: 'git-branch-outline',
    path: '/inventory/stock-movements',
    name: `${MAIN_NAV_I18N}.inventory-stock-movements`,
    roles: INVENTORY_ACCESS_ROLES,
  },
  {
    id: 'inventory-suppliers',
    icon: 'business-outline',
    path: '/inventory/suppliers',
    name: `${MAIN_NAV_I18N}.inventory-suppliers`,
    roles: INVENTORY_ACCESS_ROLES,
  },
  {
    id: 'inventory-purchase-requests',
    icon: 'folder-outline',
    path: '/inventory/purchase-requests',
    name: `${MAIN_NAV_I18N}.inventory-purchase-requests`,
    roles: INVENTORY_ACCESS_ROLES,
  },
  {
    id: 'inventory-purchase-orders',
    icon: 'time-outline',
    path: '/inventory/purchase-orders',
    name: `${MAIN_NAV_I18N}.inventory-purchase-orders`,
    roles: INVENTORY_ACCESS_ROLES,
  },
  {
    id: 'inventory-goods-receipts',
    icon: 'folder-outline',
    path: '/inventory/goods-receipts',
    name: `${MAIN_NAV_I18N}.inventory-goods-receipts`,
    roles: INVENTORY_ACCESS_ROLES,
  },
  {
    id: 'inventory-stock-adjustments',
    icon: 'shield-checkmark-outline',
    path: '/inventory/stock-adjustments',
    name: `${MAIN_NAV_I18N}.inventory-stock-adjustments`,
    roles: INVENTORY_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const BILLING_ITEMS = [
  {
    id: 'billing-invoices',
    icon: 'folder-outline',
    path: '/billing/invoices',
    name: `${MAIN_NAV_I18N}.billing-invoices`,
    roles: BILLING_ACCESS_ROLES,
  },
  {
    id: 'billing-invoice-items',
    icon: 'grid-outline',
    path: '/billing/invoice-items',
    name: `${MAIN_NAV_I18N}.billing-invoice-items`,
    roles: BILLING_ACCESS_ROLES,
  },
  {
    id: 'billing-payments',
    icon: 'time-outline',
    path: '/billing/payments',
    name: `${MAIN_NAV_I18N}.billing-payments`,
    roles: BILLING_ACCESS_ROLES,
  },
  {
    id: 'billing-refunds',
    icon: 'shield-outline',
    path: '/billing/refunds',
    name: `${MAIN_NAV_I18N}.billing-refunds`,
    roles: BILLING_ACCESS_ROLES,
  },
  {
    id: 'billing-pricing-rules',
    icon: 'layers-outline',
    path: '/billing/pricing-rules',
    name: `${MAIN_NAV_I18N}.billing-pricing-rules`,
    roles: BILLING_ACCESS_ROLES,
  },
  {
    id: 'billing-coverage-plans',
    icon: 'grid-outline',
    path: '/billing/coverage-plans',
    name: `${MAIN_NAV_I18N}.billing-coverage-plans`,
    roles: BILLING_ACCESS_ROLES,
  },
  {
    id: 'billing-insurance-claims',
    icon: 'shield-checkmark-outline',
    path: '/billing/insurance-claims',
    name: `${MAIN_NAV_I18N}.billing-insurance-claims`,
    roles: BILLING_ACCESS_ROLES,
  },
  {
    id: 'billing-pre-authorizations',
    icon: 'key-outline',
    path: '/billing/pre-authorizations',
    name: `${MAIN_NAV_I18N}.billing-pre-authorizations`,
    roles: BILLING_ACCESS_ROLES,
  },
  {
    id: 'billing-billing-adjustments',
    icon: 'git-branch-outline',
    path: '/billing/billing-adjustments',
    name: `${MAIN_NAV_I18N}.billing-billing-adjustments`,
    roles: BILLING_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const HR_ITEMS = [
  {
    id: 'hr-staff-profiles',
    icon: 'people-outline',
    path: '/hr/staff-profiles',
    name: `${MAIN_NAV_I18N}.hr-staff-profiles`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-staff-assignments',
    icon: 'git-branch-outline',
    path: '/hr/staff-assignments',
    name: `${MAIN_NAV_I18N}.hr-staff-assignments`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-staff-leaves',
    icon: 'time-outline',
    path: '/hr/staff-leaves',
    name: `${MAIN_NAV_I18N}.hr-staff-leaves`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-shifts',
    icon: 'grid-outline',
    path: '/hr/shifts',
    name: `${MAIN_NAV_I18N}.hr-shifts`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-shift-assignments',
    icon: 'git-branch-outline',
    path: '/hr/shift-assignments',
    name: `${MAIN_NAV_I18N}.hr-shift-assignments`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-shift-swap-requests',
    icon: 'time-outline',
    path: '/hr/shift-swap-requests',
    name: `${MAIN_NAV_I18N}.hr-shift-swap-requests`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-nurse-rosters',
    icon: 'layers-outline',
    path: '/hr/nurse-rosters',
    name: `${MAIN_NAV_I18N}.hr-nurse-rosters`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-shift-templates',
    icon: 'layers-outline',
    path: '/hr/shift-templates',
    name: `${MAIN_NAV_I18N}.hr-shift-templates`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-roster-day-offs',
    icon: 'time-outline',
    path: '/hr/roster-day-offs',
    name: `${MAIN_NAV_I18N}.hr-roster-day-offs`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-staff-availabilities',
    icon: 'grid-outline',
    path: '/hr/staff-availabilities',
    name: `${MAIN_NAV_I18N}.hr-staff-availabilities`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-payroll-runs',
    icon: 'folder-outline',
    path: '/hr/payroll-runs',
    name: `${MAIN_NAV_I18N}.hr-payroll-runs`,
    roles: HR_ACCESS_ROLES,
  },
  {
    id: 'hr-payroll-items',
    icon: 'folder-outline',
    path: '/hr/payroll-items',
    name: `${MAIN_NAV_I18N}.hr-payroll-items`,
    roles: HR_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const HOUSEKEEPING_ITEMS = [
  {
    id: 'housekeeping-housekeeping-tasks',
    icon: 'grid-outline',
    path: '/housekeeping/housekeeping-tasks',
    name: `${MAIN_NAV_I18N}.housekeeping-housekeeping-tasks`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-housekeeping-schedules',
    icon: 'time-outline',
    path: '/housekeeping/housekeeping-schedules',
    name: `${MAIN_NAV_I18N}.housekeeping-housekeeping-schedules`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-maintenance-requests',
    icon: 'shield-outline',
    path: '/housekeeping/maintenance-requests',
    name: `${MAIN_NAV_I18N}.housekeeping-maintenance-requests`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-assets',
    icon: 'business-outline',
    path: '/housekeeping/assets',
    name: `${MAIN_NAV_I18N}.housekeeping-assets`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-asset-service-logs',
    icon: 'folder-outline',
    path: '/housekeeping/asset-service-logs',
    name: `${MAIN_NAV_I18N}.housekeeping-asset-service-logs`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical',
    icon: 'medkit-outline',
    path: '/housekeeping/biomedical',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-categories',
    icon: 'layers-outline',
    path: '/housekeeping/biomedical/equipment-categories',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-categories`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-registries',
    icon: 'grid-outline',
    path: '/housekeeping/biomedical/equipment-registries',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-registries`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-location-histories',
    icon: 'time-outline',
    path: '/housekeeping/biomedical/equipment-location-histories',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-location-histories`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-disposal-transfers',
    icon: 'git-branch-outline',
    path: '/housekeeping/biomedical/equipment-disposal-transfers',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-disposal-transfers`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-maintenance-plans',
    icon: 'folder-outline',
    path: '/housekeeping/biomedical/equipment-maintenance-plans',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-maintenance-plans`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-work-orders',
    icon: 'time-outline',
    path: '/housekeeping/biomedical/equipment-work-orders',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-work-orders`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-calibration-logs',
    icon: 'shield-outline',
    path: '/housekeeping/biomedical/equipment-calibration-logs',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-calibration-logs`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-safety-test-logs',
    icon: 'shield-checkmark-outline',
    path: '/housekeeping/biomedical/equipment-safety-test-logs',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-safety-test-logs`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-downtime-logs',
    icon: 'time-outline',
    path: '/housekeeping/biomedical/equipment-downtime-logs',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-downtime-logs`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-incident-reports',
    icon: 'folder-outline',
    path: '/housekeeping/biomedical/equipment-incident-reports',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-incident-reports`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-recall-notices',
    icon: 'mail-outline',
    path: '/housekeeping/biomedical/equipment-recall-notices',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-recall-notices`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-spare-parts',
    icon: 'grid-outline',
    path: '/housekeeping/biomedical/equipment-spare-parts',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-spare-parts`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-warranty-contracts',
    icon: 'folder-outline',
    path: '/housekeeping/biomedical/equipment-warranty-contracts',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-warranty-contracts`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-service-providers',
    icon: 'business-outline',
    path: '/housekeeping/biomedical/equipment-service-providers',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-service-providers`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
  {
    id: 'housekeeping-biomedical-equipment-utilization-snapshots',
    icon: 'heart-outline',
    path: '/housekeeping/biomedical/equipment-utilization-snapshots',
    name: `${MAIN_NAV_I18N}.housekeeping-biomedical-equipment-utilization-snapshots`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const REPORTS_ITEMS = [
  {
    id: 'reports-report-definitions',
    icon: 'folder-outline',
    path: '/reports/report-definitions',
    name: `${MAIN_NAV_I18N}.reports-report-definitions`,
    roles: REPORTS_ACCESS_ROLES,
  },
  {
    id: 'reports-report-runs',
    icon: 'time-outline',
    path: '/reports/report-runs',
    name: `${MAIN_NAV_I18N}.reports-report-runs`,
    roles: REPORTS_ACCESS_ROLES,
  },
  {
    id: 'reports-dashboard-widgets',
    icon: 'grid-outline',
    path: '/reports/dashboard-widgets',
    name: `${MAIN_NAV_I18N}.reports-dashboard-widgets`,
    roles: REPORTS_ACCESS_ROLES,
  },
  {
    id: 'reports-kpi-snapshots',
    icon: 'heart-outline',
    path: '/reports/kpi-snapshots',
    name: `${MAIN_NAV_I18N}.reports-kpi-snapshots`,
    roles: REPORTS_ACCESS_ROLES,
  },
  {
    id: 'reports-analytics-events',
    icon: 'git-branch-outline',
    path: '/reports/analytics-events',
    name: `${MAIN_NAV_I18N}.reports-analytics-events`,
    roles: REPORTS_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const COMMUNICATIONS_ITEMS = [
  {
    id: 'communications-notifications',
    icon: 'mail-outline',
    path: '/communications/notifications',
    name: `${MAIN_NAV_I18N}.communications-notifications`,
    roles: COMMUNICATIONS_ACCESS_ROLES,
  },
  {
    id: 'communications-notification-deliveries',
    icon: 'time-outline',
    path: '/communications/notification-deliveries',
    name: `${MAIN_NAV_I18N}.communications-notification-deliveries`,
    roles: COMMUNICATIONS_ACCESS_ROLES,
  },
  {
    id: 'communications-conversations',
    icon: 'people-outline',
    path: '/communications/conversations',
    name: `${MAIN_NAV_I18N}.communications-conversations`,
    roles: COMMUNICATIONS_ACCESS_ROLES,
  },
  {
    id: 'communications-messages',
    icon: 'mail-outline',
    path: '/communications/messages',
    name: `${MAIN_NAV_I18N}.communications-messages`,
    roles: COMMUNICATIONS_ACCESS_ROLES,
  },
  {
    id: 'communications-templates',
    icon: 'folder-outline',
    path: '/communications/templates',
    name: `${MAIN_NAV_I18N}.communications-templates`,
    roles: COMMUNICATIONS_ACCESS_ROLES,
  },
  {
    id: 'communications-template-variables',
    icon: 'grid-outline',
    path: '/communications/template-variables',
    name: `${MAIN_NAV_I18N}.communications-template-variables`,
    roles: COMMUNICATIONS_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const SUBSCRIPTIONS_ITEMS = [
  {
    id: 'subscriptions-subscription-plans',
    icon: 'layers-outline',
    path: '/subscriptions/subscription-plans',
    name: `${MAIN_NAV_I18N}.subscriptions-subscription-plans`,
    roles: SUBSCRIPTIONS_ACCESS_ROLES,
  },
  {
    id: 'subscriptions-subscriptions',
    icon: 'key-outline',
    path: '/subscriptions/subscriptions',
    name: `${MAIN_NAV_I18N}.subscriptions-subscriptions`,
    roles: SUBSCRIPTIONS_ACCESS_ROLES,
  },
  {
    id: 'subscriptions-subscription-invoices',
    icon: 'folder-outline',
    path: '/subscriptions/subscription-invoices',
    name: `${MAIN_NAV_I18N}.subscriptions-subscription-invoices`,
    roles: SUBSCRIPTIONS_ACCESS_ROLES,
  },
  {
    id: 'subscriptions-modules',
    icon: 'grid-outline',
    path: '/subscriptions/modules',
    name: `${MAIN_NAV_I18N}.subscriptions-modules`,
    roles: SUBSCRIPTIONS_ACCESS_ROLES,
  },
  {
    id: 'subscriptions-module-subscriptions',
    icon: 'git-branch-outline',
    path: '/subscriptions/module-subscriptions',
    name: `${MAIN_NAV_I18N}.subscriptions-module-subscriptions`,
    roles: SUBSCRIPTIONS_ACCESS_ROLES,
  },
  {
    id: 'subscriptions-licenses',
    icon: 'shield-checkmark-outline',
    path: '/subscriptions/licenses',
    name: `${MAIN_NAV_I18N}.subscriptions-licenses`,
    roles: SUBSCRIPTIONS_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const INTEGRATIONS_ITEMS = [
  {
    id: 'integrations-integrations',
    icon: 'git-branch-outline',
    path: '/integrations/integrations',
    name: `${MAIN_NAV_I18N}.integrations-integrations`,
    roles: INTEGRATIONS_ACCESS_ROLES,
  },
  {
    id: 'integrations-integration-logs',
    icon: 'folder-outline',
    path: '/integrations/integration-logs',
    name: `${MAIN_NAV_I18N}.integrations-integration-logs`,
    roles: INTEGRATIONS_ACCESS_ROLES,
  },
  {
    id: 'integrations-webhook-subscriptions',
    icon: 'key-outline',
    path: '/integrations/webhook-subscriptions',
    name: `${MAIN_NAV_I18N}.integrations-webhook-subscriptions`,
    roles: INTEGRATIONS_ACCESS_ROLES,
  },
];

/** @type {MainNavChild[]} */
const COMPLIANCE_ITEMS = [
  {
    id: 'compliance-audit-logs',
    icon: 'shield-checkmark-outline',
    path: '/compliance/audit-logs',
    name: `${MAIN_NAV_I18N}.compliance-audit-logs`,
    roles: COMPLIANCE_ACCESS_ROLES,
  },
  {
    id: 'compliance-phi-access-logs',
    icon: 'shield-outline',
    path: '/compliance/phi-access-logs',
    name: `${MAIN_NAV_I18N}.compliance-phi-access-logs`,
    roles: COMPLIANCE_ACCESS_ROLES,
  },
  {
    id: 'compliance-data-processing-logs',
    icon: 'grid-outline',
    path: '/compliance/data-processing-logs',
    name: `${MAIN_NAV_I18N}.compliance-data-processing-logs`,
    roles: COMPLIANCE_ACCESS_ROLES,
  },
  {
    id: 'compliance-breach-notifications',
    icon: 'mail-outline',
    path: '/compliance/breach-notifications',
    name: `${MAIN_NAV_I18N}.compliance-breach-notifications`,
    roles: COMPLIANCE_ACCESS_ROLES,
  },
  {
    id: 'compliance-system-change-logs',
    icon: 'time-outline',
    path: '/compliance/system-change-logs',
    name: `${MAIN_NAV_I18N}.compliance-system-change-logs`,
    roles: COMPLIANCE_ACCESS_ROLES,
  },
];

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
  {
    id: 'diagnostics',
    icon: 'medkit-outline',
    path: '/diagnostics/lab',
    name: `${MAIN_NAV_I18N}.diagnostics`,
    roles: DIAGNOSTICS_ACCESS_ROLES,
    children: DIAGNOSTICS_ITEMS,
  },
  {
    id: 'pharmacy',
    icon: 'medkit-outline',
    path: '/pharmacy',
    name: `${MAIN_NAV_I18N}.pharmacy`,
    roles: PHARMACY_ACCESS_ROLES,
    children: PHARMACY_ITEMS,
  },
  {
    id: 'inventory',
    icon: 'layers-outline',
    path: '/inventory',
    name: `${MAIN_NAV_I18N}.inventory`,
    roles: INVENTORY_ACCESS_ROLES,
    children: INVENTORY_ITEMS,
  },
  {
    id: 'billing',
    icon: 'layers-outline',
    path: '/billing',
    name: `${MAIN_NAV_I18N}.billing`,
    roles: BILLING_ACCESS_ROLES,
    children: BILLING_ITEMS,
  },
  {
    id: 'hr',
    icon: 'people-outline',
    path: '/hr',
    name: `${MAIN_NAV_I18N}.hr`,
    roles: HR_ACCESS_ROLES,
    children: HR_ITEMS,
  },
  {
    id: 'housekeeping',
    icon: 'home-outline',
    path: '/housekeeping',
    name: `${MAIN_NAV_I18N}.housekeeping`,
    roles: HOUSEKEEPING_ACCESS_ROLES,
    children: HOUSEKEEPING_ITEMS,
  },
  {
    id: 'reports',
    icon: 'grid-outline',
    path: '/reports',
    name: `${MAIN_NAV_I18N}.reports`,
    roles: REPORTS_ACCESS_ROLES,
    children: REPORTS_ITEMS,
  },
  {
    id: 'communications',
    icon: 'mail-outline',
    path: '/communications',
    name: `${MAIN_NAV_I18N}.communications`,
    roles: COMMUNICATIONS_ACCESS_ROLES,
    children: COMMUNICATIONS_ITEMS,
  },
  {
    id: 'subscriptions',
    icon: 'key-outline',
    path: '/subscriptions',
    name: `${MAIN_NAV_I18N}.subscriptions`,
    roles: SUBSCRIPTIONS_ACCESS_ROLES,
    children: SUBSCRIPTIONS_ITEMS,
  },
  {
    id: 'integrations',
    icon: 'git-branch-outline',
    path: '/integrations',
    name: `${MAIN_NAV_I18N}.integrations`,
    roles: INTEGRATIONS_ACCESS_ROLES,
    children: INTEGRATIONS_ITEMS,
  },
  {
    id: 'compliance',
    icon: 'shield-checkmark-outline',
    path: '/compliance',
    name: `${MAIN_NAV_I18N}.compliance`,
    roles: COMPLIANCE_ACCESS_ROLES,
    children: COMPLIANCE_ITEMS,
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
  DIAGNOSTICS_ITEMS,
  PHARMACY_ITEMS,
  INVENTORY_ITEMS,
  BILLING_ITEMS,
  HR_ITEMS,
  HOUSEKEEPING_ITEMS,
  REPORTS_ITEMS,
  COMMUNICATIONS_ITEMS,
  SUBSCRIPTIONS_ITEMS,
  INTEGRATIONS_ITEMS,
  COMPLIANCE_ITEMS,
};
