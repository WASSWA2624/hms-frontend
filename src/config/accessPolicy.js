const ROLE_KEYS = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  FACILITY_ADMIN: 'FACILITY_ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  LAB_TECH: 'LAB_TECH',
  PHARMACIST: 'PHARMACIST',
  RECEPTIONIST: 'RECEPTIONIST',
  BILLING: 'BILLING',
  OPERATIONS: 'OPERATIONS',
  HR: 'HR',
  BIOMED: 'BIOMED',
  HOUSE_KEEPER: 'HOUSE_KEEPER',
  AMBULANCE_OPERATOR: 'AMBULANCE_OPERATOR',
  PATIENT: 'PATIENT',
  OTHER: 'OTHER',
});

const ROLE_ALIAS_MAP = Object.freeze({
  APP_ADMIN: ROLE_KEYS.SUPER_ADMIN,
  SYSTEM_ADMIN: ROLE_KEYS.SUPER_ADMIN,
  PLATFORM_ADMIN: ROLE_KEYS.SUPER_ADMIN,
  ADMIN: ROLE_KEYS.TENANT_ADMIN,
  OWNER: ROLE_KEYS.TENANT_ADMIN,
  FRONT_DESK: ROLE_KEYS.RECEPTIONIST,
  CLINICAL_OFFICER: ROLE_KEYS.DOCTOR,
  EMERGENCY_OFFICER: ROLE_KEYS.NURSE,
  PHARMACY_TECHNICIAN: ROLE_KEYS.PHARMACIST,
  CASHIER: ROLE_KEYS.BILLING,
  FINANCE_MANAGER: ROLE_KEYS.BILLING,
  ACCOUNTANT: ROLE_KEYS.BILLING,
  BILLING_CLERK: ROLE_KEYS.BILLING,
  INSURANCE_OFFICER: ROLE_KEYS.BILLING,
  INVENTORY_MANAGER: ROLE_KEYS.OPERATIONS,
  STORE_KEEPER: ROLE_KEYS.OPERATIONS,
  PROCUREMENT_OFFICER: ROLE_KEYS.OPERATIONS,
  MAINTENANCE_MANAGER: ROLE_KEYS.OPERATIONS,
  HOUSEKEEPING_MANAGER: ROLE_KEYS.HOUSE_KEEPER,
  AMBULANCE_DRIVER: ROLE_KEYS.AMBULANCE_OPERATOR,
  EMT: ROLE_KEYS.AMBULANCE_OPERATOR,
  PARAMEDIC: ROLE_KEYS.AMBULANCE_OPERATOR,
  FACILITY_MANAGER: ROLE_KEYS.FACILITY_ADMIN,
  PATIENT_USER: ROLE_KEYS.PATIENT,
  PATIENT_PORTAL_USER: ROLE_KEYS.PATIENT,
  USER: ROLE_KEYS.OTHER,
  GUEST: ROLE_KEYS.OTHER,
  MODERATOR: ROLE_KEYS.OTHER,
});

const CANONICAL_ROLE_KEYS = Object.freeze(Object.values(ROLE_KEYS));
const CANONICAL_ROLE_SET = new Set(CANONICAL_ROLE_KEYS);

const STAFF_ROLE_KEYS = Object.freeze([
  ROLE_KEYS.SUPER_ADMIN,
  ROLE_KEYS.TENANT_ADMIN,
  ROLE_KEYS.FACILITY_ADMIN,
  ROLE_KEYS.DOCTOR,
  ROLE_KEYS.NURSE,
  ROLE_KEYS.LAB_TECH,
  ROLE_KEYS.PHARMACIST,
  ROLE_KEYS.RECEPTIONIST,
  ROLE_KEYS.BILLING,
  ROLE_KEYS.OPERATIONS,
  ROLE_KEYS.HR,
  ROLE_KEYS.BIOMED,
  ROLE_KEYS.HOUSE_KEEPER,
  ROLE_KEYS.AMBULANCE_OPERATOR,
]);

const ADMIN_ROLE_KEYS = Object.freeze([
  ROLE_KEYS.SUPER_ADMIN,
  ROLE_KEYS.TENANT_ADMIN,
  ROLE_KEYS.FACILITY_ADMIN,
]);

const GLOBAL_ADMIN_ROLE_KEYS = Object.freeze([ROLE_KEYS.SUPER_ADMIN]);

const SCOPE_KEYS = Object.freeze({
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings',
  PATIENTS: 'patients',
  SCHEDULING: 'scheduling',
  CLINICAL: 'clinical',
  IPD: 'ipd',
  ICU: 'icu',
  THEATRE: 'theatre',
  EMERGENCY: 'emergency',
  LAB: 'lab',
  RADIOLOGY: 'radiology',
  PHARMACY: 'pharmacy',
  INVENTORY: 'inventory',
  BILLING: 'billing',
  HR: 'hr',
  HOUSEKEEPING: 'housekeeping',
  BIOMEDICAL: 'biomedical',
  REPORTS: 'reports',
  COMMUNICATIONS: 'communications',
  SUBSCRIPTIONS: 'subscriptions',
  INTEGRATIONS: 'integrations',
  COMPLIANCE: 'compliance',
  PATIENT_PORTAL: 'patient_portal',
});

const toRoleList = (values = []) => Object.freeze([...new Set(values)]);

const SCOPE_ACCESS_MATRIX = Object.freeze({
  [SCOPE_KEYS.DASHBOARD]: Object.freeze({
    read: toRoleList(STAFF_ROLE_KEYS),
    write: toRoleList(STAFF_ROLE_KEYS),
    delete: toRoleList([]),
  }),
  [SCOPE_KEYS.SETTINGS]: Object.freeze({
    read: toRoleList(ADMIN_ROLE_KEYS),
    write: toRoleList(ADMIN_ROLE_KEYS),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.PATIENTS]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
      ROLE_KEYS.RECEPTIONIST,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
      ROLE_KEYS.RECEPTIONIST,
    ]),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.SCHEDULING]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
      ROLE_KEYS.RECEPTIONIST,
      ROLE_KEYS.OPERATIONS,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
      ROLE_KEYS.RECEPTIONIST,
      ROLE_KEYS.OPERATIONS,
    ]),
    delete: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.OPERATIONS,
    ]),
  }),
  [SCOPE_KEYS.CLINICAL]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.IPD]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.ICU]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.THEATRE]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.EMERGENCY]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
      ROLE_KEYS.AMBULANCE_OPERATOR,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
      ROLE_KEYS.AMBULANCE_OPERATOR,
    ]),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.LAB]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.LAB_TECH,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.LAB_TECH,
    ]),
    delete: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.LAB_TECH,
    ]),
  }),
  [SCOPE_KEYS.RADIOLOGY]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.LAB_TECH,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.LAB_TECH,
    ]),
    delete: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.LAB_TECH,
    ]),
  }),
  [SCOPE_KEYS.PHARMACY]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.PHARMACIST,
      ROLE_KEYS.DOCTOR,
      ROLE_KEYS.NURSE,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.PHARMACIST,
    ]),
    delete: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.PHARMACIST,
    ]),
  }),
  [SCOPE_KEYS.INVENTORY]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.OPERATIONS,
      ROLE_KEYS.PHARMACIST,
      ROLE_KEYS.BIOMED,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.OPERATIONS,
      ROLE_KEYS.PHARMACIST,
      ROLE_KEYS.BIOMED,
    ]),
    delete: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.OPERATIONS,
      ROLE_KEYS.PHARMACIST,
      ROLE_KEYS.BIOMED,
    ]),
  }),
  [SCOPE_KEYS.BILLING]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.BILLING,
      ROLE_KEYS.RECEPTIONIST,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.BILLING,
      ROLE_KEYS.RECEPTIONIST,
    ]),
    delete: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.BILLING,
    ]),
  }),
  [SCOPE_KEYS.HR]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.HR,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.HR,
    ]),
    delete: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.HR,
    ]),
  }),
  [SCOPE_KEYS.HOUSEKEEPING]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.OPERATIONS,
      ROLE_KEYS.HOUSE_KEEPER,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.OPERATIONS,
    ]),
    delete: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.OPERATIONS,
    ]),
  }),
  [SCOPE_KEYS.BIOMEDICAL]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.BIOMED,
      ROLE_KEYS.OPERATIONS,
    ]),
    write: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.BIOMED,
    ]),
    delete: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.BIOMED,
    ]),
  }),
  [SCOPE_KEYS.REPORTS]: Object.freeze({
    read: toRoleList([
      ...ADMIN_ROLE_KEYS,
      ROLE_KEYS.OPERATIONS,
      ROLE_KEYS.BILLING,
      ROLE_KEYS.HR,
    ]),
    write: toRoleList(ADMIN_ROLE_KEYS),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.COMMUNICATIONS]: Object.freeze({
    read: toRoleList(STAFF_ROLE_KEYS),
    write: toRoleList(STAFF_ROLE_KEYS),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.SUBSCRIPTIONS]: Object.freeze({
    read: toRoleList(ADMIN_ROLE_KEYS),
    write: toRoleList(ADMIN_ROLE_KEYS),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.INTEGRATIONS]: Object.freeze({
    read: toRoleList(ADMIN_ROLE_KEYS),
    write: toRoleList(ADMIN_ROLE_KEYS),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.COMPLIANCE]: Object.freeze({
    read: toRoleList(ADMIN_ROLE_KEYS),
    write: toRoleList(ADMIN_ROLE_KEYS),
    delete: toRoleList(ADMIN_ROLE_KEYS),
  }),
  [SCOPE_KEYS.PATIENT_PORTAL]: Object.freeze({
    read: toRoleList([ROLE_KEYS.PATIENT]),
    write: toRoleList([ROLE_KEYS.PATIENT]),
    delete: toRoleList([]),
  }),
});

const BACKEND_PERMISSION_SCOPE_MAP = Object.freeze({
  'patient:read': SCOPE_KEYS.PATIENTS,
  'patient:write': SCOPE_KEYS.PATIENTS,
  'patient:delete': SCOPE_KEYS.PATIENTS,
  'clinical:read': SCOPE_KEYS.CLINICAL,
  'clinical:write': SCOPE_KEYS.CLINICAL,
  'emergency:read': SCOPE_KEYS.EMERGENCY,
  'emergency:write': SCOPE_KEYS.EMERGENCY,
  'emergency:delete': SCOPE_KEYS.EMERGENCY,
  'lab:read': SCOPE_KEYS.LAB,
  'lab:write': SCOPE_KEYS.LAB,
  'pharmacy:read': SCOPE_KEYS.PHARMACY,
  'pharmacy:write': SCOPE_KEYS.PHARMACY,
  'billing:read': SCOPE_KEYS.BILLING,
  'billing:write': SCOPE_KEYS.BILLING,
  'operations:read': SCOPE_KEYS.INVENTORY,
  'operations:write': SCOPE_KEYS.INVENTORY,
  'hr:read': SCOPE_KEYS.HR,
  'hr:write': SCOPE_KEYS.HR,
  'biomed:read': SCOPE_KEYS.BIOMEDICAL,
  'biomed:write': SCOPE_KEYS.BIOMEDICAL,
  'tenant:admin': SCOPE_KEYS.SETTINGS,
  'facility:admin': SCOPE_KEYS.SETTINGS,
  'system:admin': SCOPE_KEYS.SETTINGS,
});

const OPD_ACCESS_POLICY = Object.freeze({
  view: toRoleList([
    ROLE_KEYS.SUPER_ADMIN,
    ROLE_KEYS.TENANT_ADMIN,
    ROLE_KEYS.FACILITY_ADMIN,
    ROLE_KEYS.RECEPTIONIST,
    ROLE_KEYS.NURSE,
    ROLE_KEYS.DOCTOR,
    ROLE_KEYS.OPERATIONS,
    ROLE_KEYS.BILLING,
  ]),
  start: toRoleList([
    ROLE_KEYS.SUPER_ADMIN,
    ROLE_KEYS.TENANT_ADMIN,
    ROLE_KEYS.FACILITY_ADMIN,
    ROLE_KEYS.RECEPTIONIST,
    ROLE_KEYS.NURSE,
    ROLE_KEYS.DOCTOR,
    ROLE_KEYS.OPERATIONS,
  ]),
  payConsultation: toRoleList([
    ROLE_KEYS.SUPER_ADMIN,
    ROLE_KEYS.TENANT_ADMIN,
    ROLE_KEYS.FACILITY_ADMIN,
    ROLE_KEYS.RECEPTIONIST,
    ROLE_KEYS.BILLING,
  ]),
  recordVitals: toRoleList([
    ROLE_KEYS.SUPER_ADMIN,
    ROLE_KEYS.TENANT_ADMIN,
    ROLE_KEYS.FACILITY_ADMIN,
    ROLE_KEYS.DOCTOR,
    ROLE_KEYS.NURSE,
  ]),
  assignDoctor: toRoleList([
    ROLE_KEYS.SUPER_ADMIN,
    ROLE_KEYS.TENANT_ADMIN,
    ROLE_KEYS.FACILITY_ADMIN,
    ROLE_KEYS.RECEPTIONIST,
    ROLE_KEYS.NURSE,
  ]),
  doctorReview: toRoleList([
    ROLE_KEYS.SUPER_ADMIN,
    ROLE_KEYS.TENANT_ADMIN,
    ROLE_KEYS.FACILITY_ADMIN,
    ROLE_KEYS.DOCTOR,
  ]),
  disposition: toRoleList([
    ROLE_KEYS.SUPER_ADMIN,
    ROLE_KEYS.TENANT_ADMIN,
    ROLE_KEYS.FACILITY_ADMIN,
    ROLE_KEYS.DOCTOR,
  ]),
  correctStage: toRoleList([
    ROLE_KEYS.SUPER_ADMIN,
    ROLE_KEYS.TENANT_ADMIN,
    ROLE_KEYS.FACILITY_ADMIN,
    ROLE_KEYS.NURSE,
    ROLE_KEYS.DOCTOR,
  ]),
});

const DOCTOR_ONBOARDING_ACCESS_POLICY = Object.freeze({
  create: toRoleList([
    ROLE_KEYS.SUPER_ADMIN,
    ROLE_KEYS.TENANT_ADMIN,
    ROLE_KEYS.FACILITY_ADMIN,
    ROLE_KEYS.HR,
  ]),
});

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const extractRoleName = (value) => {
  if (isNonEmptyString(value) || typeof value === 'number') {
    return String(value);
  }

  if (!value || typeof value !== 'object') return null;

  const directFields = ['name', 'role_name', 'roleName', 'authority'];
  for (const field of directFields) {
    const candidate = value[field];
    if (isNonEmptyString(candidate) || typeof candidate === 'number') {
      return String(candidate);
    }
  }

  if (value.role) {
    return extractRoleName(value.role);
  }

  return null;
};

const normalizeScopeKey = (scope) => {
  const raw = String(scope || '').trim().toLowerCase();
  return raw || null;
};

const normalizeActionKey = (action) => {
  const raw = String(action || '').trim().toLowerCase();
  if (!raw) return 'read';
  if (raw === 'create' || raw === 'update' || raw === 'edit') return 'write';
  return raw;
};

const normalizeRoleKey = (role) => {
  const roleName = extractRoleName(role);
  if (!isNonEmptyString(roleName)) return null;

  const rawRoleKey = roleName.trim().toUpperCase();
  const canonicalRoleKey = ROLE_ALIAS_MAP[rawRoleKey] || rawRoleKey;

  if (CANONICAL_ROLE_SET.has(canonicalRoleKey)) {
    return canonicalRoleKey;
  }

  return ROLE_KEYS.OTHER;
};

const resolveCanonicalRoles = (roles) => {
  if (!roles) return [];
  const roleList = Array.isArray(roles) ? roles : [roles];
  return [...new Set(roleList.map((entry) => normalizeRoleKey(entry)).filter(Boolean))];
};

const getScopeRoleKeys = (scope, action = 'read') => {
  const normalizedScope = normalizeScopeKey(scope);
  if (!normalizedScope) return [];

  const accessConfig = SCOPE_ACCESS_MATRIX[normalizedScope];
  if (!accessConfig) return [];

  const normalizedAction = normalizeActionKey(action);
  const roleKeys = accessConfig[normalizedAction] || accessConfig.read || [];
  return [...roleKeys];
};

const hasScopeAccess = (...args) => {
  let roles;
  let scope;
  let action = 'read';

  if (args.length === 1 && args[0] && typeof args[0] === 'object' && !Array.isArray(args[0])) {
    ({ roles, scope, action = 'read' } = args[0]);
  } else {
    [roles, scope, action = 'read'] = args;
  }

  const requiredRoles = getScopeRoleKeys(scope, action);
  if (!requiredRoles.length) return false;

  const assignedRoles = resolveCanonicalRoles(roles);
  if (!assignedRoles.length) return false;

  return assignedRoles.some((roleKey) => requiredRoles.includes(roleKey));
};

const isGlobalAdminRole = (roles) =>
  resolveCanonicalRoles(roles).some((roleKey) => GLOBAL_ADMIN_ROLE_KEYS.includes(roleKey));

const isPatientRole = (roles) => resolveCanonicalRoles(roles).includes(ROLE_KEYS.PATIENT);

const resolveHomePath = (roles) => {
  if (isPatientRole(roles)) return '/portal';
  return '/dashboard';
};

export {
  ROLE_KEYS,
  ROLE_ALIAS_MAP,
  CANONICAL_ROLE_KEYS,
  STAFF_ROLE_KEYS,
  ADMIN_ROLE_KEYS,
  GLOBAL_ADMIN_ROLE_KEYS,
  SCOPE_KEYS,
  SCOPE_ACCESS_MATRIX,
  BACKEND_PERMISSION_SCOPE_MAP,
  OPD_ACCESS_POLICY,
  DOCTOR_ONBOARDING_ACCESS_POLICY,
  normalizeRoleKey,
  resolveCanonicalRoles,
  getScopeRoleKeys,
  hasScopeAccess,
  isGlobalAdminRole,
  isPatientRole,
  resolveHomePath,
};
