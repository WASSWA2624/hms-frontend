/**
 * useDashboardScreen Hook
 * Shared behavior/logic for DashboardScreen across all platforms
 * File: useDashboardScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useNavigationVisibility, useNetwork } from '@hooks';
import { normalizeRoleKey } from '@hooks/roleUtils';
import { listTenants } from '@features/tenant';
import { getDashboardSummary } from '@features/dashboard-widget';
import { ROLE_KEYS, SCOPE_KEYS, getScopeRoleKeys } from '@config/accessPolicy';
import { IPD_WORKBENCH_V1 } from '@config/feature.flags';
import { MAIN_NAV_ITEMS } from '@config/sideMenu';
import { readRegistrationContext } from '@navigation/registrationContext';
import { STATES } from './types';

const REFRESH_INTERVAL_MS = 60 * 1000;
const DEFAULT_SUMMARY_DAYS = 7;
const TENANT_FETCH_LIMIT = 200;

const ROLE_PROFILE_META = Object.freeze({
  super_admin: {
    title: 'System operations overview',
    subtitle: 'Cross-tenant operational summary for executive oversight.',
    badgeVariant: 'primary',
  },
  tenant_admin: {
    title: 'Tenant operations overview',
    subtitle: 'Patient flow, scheduling, admissions, billing, and payments.',
    badgeVariant: 'primary',
  },
  facility_admin: {
    title: 'Facility operations overview',
    subtitle: 'Facility-level flow, capacity, and financial movement.',
    badgeVariant: 'primary',
  },
  doctor: {
    title: 'Clinical workload',
    subtitle: 'Consultation load, admissions, and critical diagnostics.',
    badgeVariant: 'success',
  },
  nurse: {
    title: 'Nursing flow',
    subtitle: 'Inpatient movement, medication workload, and ward pressure.',
    badgeVariant: 'warning',
  },
  lab_tech: {
    title: 'Laboratory operations',
    subtitle: 'Order throughput, result mix, and pending backlog.',
    badgeVariant: 'warning',
  },
  pharmacist: {
    title: 'Pharmacy operations',
    subtitle: 'Dispensing demand, fulfillment status, and stock pressure.',
    badgeVariant: 'success',
  },
  receptionist: {
    title: 'Front desk operations',
    subtitle: 'Registrations, appointment queue, and desk billing pressure.',
    badgeVariant: 'primary',
  },
  billing: {
    title: 'Billing operations',
    subtitle: 'Invoice pipeline, receivables pressure, and collections.',
    badgeVariant: 'warning',
  },
  operations: {
    title: 'Operations command center',
    subtitle: 'Capacity, maintenance pressure, inventory, and housekeeping load.',
    badgeVariant: 'primary',
  },
  hr: {
    title: 'Workforce operations',
    subtitle: 'Coverage pressure, shift/leave load, and staffing backlog.',
    badgeVariant: 'primary',
  },
  biomed: {
    title: 'Biomedical operations',
    subtitle: 'Work orders, incidents, downtime pressure, and service risk.',
    badgeVariant: 'warning',
  },
  house_keeper: {
    title: 'Housekeeping operations',
    subtitle: 'Task backlog, overdue pressure, and throughput.',
    badgeVariant: 'success',
  },
  ambulance_operator: {
    title: 'Emergency transport operations',
    subtitle: 'Dispatch load, active trips, severity pressure, and fleet availability.',
    badgeVariant: 'error',
  },
});

const DEFAULT_ROLE_PROFILE = {
  id: 'operations',
  role: ROLE_KEYS.OPERATIONS,
  pack: 'operations',
  ...ROLE_PROFILE_META.operations,
};

const DEFAULT_FACILITY_CONTEXT = {
  userName: 'Dr. Amina',
  roleKey: 'home.welcome.roles.medicalDirector',
  facilityName: 'CityCare Hospital',
  branchName: '',
  facilityTypeKey: 'home.facility.types.hospital',
  planStatusKey: 'home.plan.status.trial',
  planDetailKey: 'home.plan.trialDays',
  planDetailValue: 9,
};

const createEmptyDashboardData = (roleProfile = DEFAULT_ROLE_PROFILE) => ({
  roleProfile,
  summaryCards: [],
  trend: {
    title: '',
    subtitle: '',
    points: [],
  },
  distribution: {
    title: '',
    subtitle: '',
    total: 0,
    segments: [],
  },
  highlights: [],
  queue: [],
  alerts: [],
  activity: [],
  hasLiveData: false,
  generatedAt: new Date().toISOString(),
  scope: {
    tenant_id: null,
    facility_id: null,
    branch_id: null,
    days: DEFAULT_SUMMARY_DAYS,
  },
});

const toOptionalId = (value) => {
  const normalized = value != null ? String(value).trim() : '';
  return normalized || null;
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapRoleToWelcomeKey = (value) => {
  const normalized = String(value || '').toUpperCase();
  if (
    normalized.includes('OWNER')
    || normalized.includes('ADMIN')
    || normalized.includes('SUPER_ADMIN')
    || normalized.includes('TENANT_ADMIN')
    || normalized.includes('FACILITY_ADMIN')
  ) {
    return 'home.welcome.roles.owner';
  }
  if (normalized.includes('DOCTOR') || normalized.includes('MEDICAL')) {
    return 'home.welcome.roles.medicalDirector';
  }
  return 'home.welcome.roles.admin';
};

const mapFacilityTypeToKey = (value) => {
  const normalized = String(value || '').toUpperCase();
  if (normalized === 'CLINIC') return 'home.facility.types.clinic';
  if (normalized === 'HOSPITAL') return 'home.facility.types.hospital';
  if (normalized === 'LAB') return 'home.facility.types.lab';
  if (normalized === 'PHARMACY') return 'home.facility.types.pharmacy';
  if (normalized === 'EMERGENCY') return 'home.facility.types.emergency';
  return DEFAULT_FACILITY_CONTEXT.facilityTypeKey;
};

const normalizeUserName = (user, registrationContext) => {
  const firstName = user?.profile?.first_name || '';
  const lastName = user?.profile?.last_name || '';
  const profileName = `${firstName} ${lastName}`.trim();
  if (profileName) return profileName;

  if (registrationContext?.admin_name) return registrationContext.admin_name;

  if (user?.email && user.email.includes('@')) {
    return user.email.split('@')[0];
  }

  return DEFAULT_FACILITY_CONTEXT.userName;
};

const resolveFacilityName = (user, registrationContext) => (
  user?.facility?.name
  || registrationContext?.facility_display_name
  || registrationContext?.facility_name
  || DEFAULT_FACILITY_CONTEXT.facilityName
);

const PATIENT_WRITE_ROLES = getScopeRoleKeys(SCOPE_KEYS.PATIENTS, 'write');
const SCHEDULING_WRITE_ROLES = getScopeRoleKeys(SCOPE_KEYS.SCHEDULING, 'write');
const BILLING_WRITE_ROLES = getScopeRoleKeys(SCOPE_KEYS.BILLING, 'write');
const IPD_WRITE_ROLES = getScopeRoleKeys(SCOPE_KEYS.IPD, 'write');
const LAB_WRITE_ROLES = getScopeRoleKeys(SCOPE_KEYS.LAB, 'write');
const PHARMACY_WRITE_ROLES = getScopeRoleKeys(SCOPE_KEYS.PHARMACY, 'write');

const QUICK_ACTIONS = [
  {
    id: 'newPatient',
    labelKey: 'home.quickActions.items.newPatient',
    roles: PATIENT_WRITE_ROLES,
    supported: true,
    path: '/patients/patients/create',
  },
  {
    id: 'appointment',
    labelKey: 'home.quickActions.items.appointment',
    roles: SCHEDULING_WRITE_ROLES,
    supported: true,
    path: '/scheduling/appointments/create',
  },
  {
    id: 'invoice',
    labelKey: 'home.quickActions.items.invoice',
    roles: BILLING_WRITE_ROLES,
    supported: true,
    path: '/billing/invoices/create',
  },
  {
    id: 'admit',
    labelKey: 'home.quickActions.items.admit',
    roles: IPD_WRITE_ROLES,
    supported: true,
    path: IPD_WORKBENCH_V1 ? '/ipd?action=start_admission' : '/ipd/admissions/create',
  },
  {
    id: 'labTest',
    labelKey: 'home.quickActions.items.labTest',
    roles: LAB_WRITE_ROLES,
    supported: true,
    path: '/diagnostics/lab/lab-orders/create',
  },
  {
    id: 'sale',
    labelKey: 'home.quickActions.items.sale',
    roles: [...PHARMACY_WRITE_ROLES, ROLE_KEYS.BILLING],
    supported: true,
    path: '/pharmacy/pharmacy-orders/create',
  },
];

const toActionAccessItem = (roles) => ({
  roles: Array.isArray(roles) ? roles : [],
});

const collectUserRoleKeys = (user) => {
  const candidates = [];

  const collect = (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }
    const normalized = normalizeRoleKey(value);
    if (normalized) candidates.push(normalized);
  };

  collect(user?.roles);
  collect(user?.role);
  collect(user?.role_name);

  return [...new Set(candidates)];
};

const resolveScopeContext = (user, registrationContext) => ({
  tenantId: (
    toOptionalId(user?.tenant_id)
    || toOptionalId(user?.tenantId)
    || toOptionalId(user?.tenant?.id)
    || toOptionalId(user?.tenant?.tenant_id)
    || toOptionalId(registrationContext?.tenant_id)
  ),
  facilityId: (
    toOptionalId(user?.facility_id)
    || toOptionalId(user?.facilityId)
    || toOptionalId(user?.facility?.id)
    || toOptionalId(user?.facility?.facility_id)
    || toOptionalId(registrationContext?.facility_id)
  ),
  branchId: (
    toOptionalId(user?.branch_id)
    || toOptionalId(user?.branchId)
    || toOptionalId(user?.branch?.id)
    || toOptionalId(user?.branch?.branch_id)
  ),
});

const resolveTenantOptions = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => {
      const id = (
        toOptionalId(item?.id)
        || toOptionalId(item?.tenant_id)
        || toOptionalId(item?.tenantId)
      );
      if (!id) return null;
      const label = String(item?.name || item?.tenant_name || item?.slug || id);
      return {
        label,
        value: id,
      };
    })
    .filter(Boolean);

const resolveRoleProfile = (payload = {}, fallback = DEFAULT_ROLE_PROFILE) => {
  const profileId = String(payload?.id || fallback?.id || DEFAULT_ROLE_PROFILE.id).toLowerCase();
  const meta = ROLE_PROFILE_META[profileId] || ROLE_PROFILE_META.operations;
  return {
    id: profileId,
    role: String(payload?.role || fallback?.role || ROLE_KEYS.OPERATIONS),
    pack: String(payload?.pack || fallback?.pack || 'operations'),
    title: meta.title,
    subtitle: meta.subtitle,
    badgeVariant: meta.badgeVariant,
  };
};

const normalizeDashboardSummary = (summary, roleProfile) => {
  const source = summary && typeof summary === 'object' ? summary : {};
  return {
    roleProfile,
    summaryCards: (Array.isArray(source.summaryCards) ? source.summaryCards : []).map((item) => ({
      id: item?.id,
      label: item?.label,
      value: toNumber(item?.value),
      format: item?.format,
    })),
    trend: {
      title: String(source?.trend?.title || ''),
      subtitle: String(source?.trend?.subtitle || ''),
      points: (Array.isArray(source?.trend?.points) ? source.trend.points : []).map((point) => ({
        id: point?.id,
        date: point?.date,
        value: toNumber(point?.value),
      })),
    },
    distribution: {
      title: String(source?.distribution?.title || ''),
      subtitle: String(source?.distribution?.subtitle || ''),
      total: toNumber(source?.distribution?.total),
      segments: (Array.isArray(source?.distribution?.segments) ? source.distribution.segments : []).map((segment) => ({
        id: segment?.id,
        label: segment?.label,
        value: toNumber(segment?.value),
        color: segment?.color,
      })),
    },
    highlights: Array.isArray(source.highlights) ? source.highlights : [],
    queue: Array.isArray(source.queue) ? source.queue : [],
    alerts: Array.isArray(source.alerts) ? source.alerts : [],
    activity: Array.isArray(source.activity) ? source.activity : [],
    hasLiveData: Boolean(source.hasLiveData),
    generatedAt: String(source.generatedAt || new Date().toISOString()),
    scope: {
      tenant_id: source?.scope?.tenant_id || null,
      facility_id: source?.scope?.facility_id || null,
      branch_id: source?.scope?.branch_id || null,
      days: toNumber(source?.scope?.days || DEFAULT_SUMMARY_DAYS),
    },
  };
};

/**
 * DashboardScreen hook
 * @returns {Object} Hook return object
 */
const useDashboardScreen = () => {
  const router = useRouter();
  const { user, isAuthenticated, loadCurrentUser, logout } = useAuth();
  const { isItemVisible } = useNavigationVisibility();
  const { isOffline } = useNetwork();

  const dashboardNavItem = useMemo(
    () => MAIN_NAV_ITEMS.find((item) => item?.id === 'dashboard') || null,
    []
  );
  const canAccessDashboard = useMemo(
    () => isItemVisible(dashboardNavItem),
    [dashboardNavItem, isItemVisible]
  );

  const [resolvedUser, setResolvedUser] = useState(user || null);
  const [registrationContext, setRegistrationContext] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [screenState, setScreenState] = useState(STATES.LOADING);
  const [dashboardRole, setDashboardRole] = useState(DEFAULT_ROLE_PROFILE);
  const [liveDashboard, setLiveDashboard] = useState(() => createEmptyDashboardData(DEFAULT_ROLE_PROFILE));
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [tenantOptions, setTenantOptions] = useState([]);
  const [tenantOptionsLoading, setTenantOptionsLoading] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState('');

  const loadTenantOptions = useCallback(async () => {
    setTenantOptionsLoading(true);
    try {
      const tenants = await listTenants({ page: 1, limit: TENANT_FETCH_LIMIT });
      const options = resolveTenantOptions(tenants);
      setTenantOptions(options);
      return options;
    } catch {
      setTenantOptions([]);
      return [];
    } finally {
      setTenantOptionsLoading(false);
    }
  }, []);

  const hydrateDashboard = useCallback(async ({ silent = false, tenantIdOverride = null } = {}) => {
    if (!isAuthenticated) {
      if (!silent) {
        setIsHydrating(false);
      }
      return;
    }

    if (!canAccessDashboard) {
      if (!silent) {
        setIsHydrating(false);
      }
      router.replace('/login');
      return;
    }

    if (!silent) {
      setIsHydrating(true);
      setScreenState(STATES.LOADING);
    }

    let effectiveUser = user || null;

    try {
      if (!effectiveUser) {
        const loadAction = await loadCurrentUser();
        const loadStatus = loadAction?.meta?.requestStatus;

        if (loadStatus !== 'fulfilled' || !loadAction?.payload) {
          const responseStatus = Number(loadAction?.payload?.status || loadAction?.error?.status || 0);
          if (responseStatus === 401 || responseStatus === 403) {
            await logout();
            router.replace('/login');
            return;
          }

          if (!silent) {
            setScreenState(STATES.ERROR);
          }
          return;
        }

        effectiveUser = loadAction.payload;
      }

      const context = await readRegistrationContext();
      const roleKeys = collectUserRoleKeys(effectiveUser);
      const isSuperAdmin = roleKeys.includes(ROLE_KEYS.SUPER_ADMIN);
      const scopeContext = resolveScopeContext(effectiveUser, context);
      const activeTenantId = (
        toOptionalId(tenantIdOverride)
        || toOptionalId(selectedTenantId)
        || scopeContext.tenantId
      );

      setRegistrationContext(context);
      setResolvedUser(effectiveUser);

      if (isSuperAdmin && !activeTenantId) {
        await loadTenantOptions();
        const superRole = resolveRoleProfile({ id: 'super_admin', role: ROLE_KEYS.SUPER_ADMIN, pack: 'admin' });
        setDashboardRole(superRole);
        setLiveDashboard(createEmptyDashboardData(superRole));
        setScreenState(STATES.NEEDS_TENANT_CONTEXT);
        return;
      }

      const summaryQuery = { days: DEFAULT_SUMMARY_DAYS };
      if (isSuperAdmin) {
        summaryQuery.tenant_id = activeTenantId;
        if (scopeContext.facilityId) summaryQuery.facility_id = scopeContext.facilityId;
        if (scopeContext.branchId) summaryQuery.branch_id = scopeContext.branchId;
      }

      const summaryPayload = await getDashboardSummary(summaryQuery);
      const resolvedRole = resolveRoleProfile(summaryPayload?.roleProfile, DEFAULT_ROLE_PROFILE);
      const normalizedSummary = normalizeDashboardSummary(summaryPayload, resolvedRole);
      const generatedAt = parseDate(normalizedSummary.generatedAt) || new Date();

      if (isSuperAdmin) {
        setSelectedTenantId(activeTenantId || '');
      }

      setDashboardRole(resolvedRole);
      setLiveDashboard(normalizedSummary);
      setLastUpdated(generatedAt);
      setScreenState(normalizedSummary.hasLiveData ? STATES.IDLE : STATES.EMPTY);
    } catch (error) {
      const status = Number(error?.status || error?.statusCode || 0);
      const roleKeys = collectUserRoleKeys(effectiveUser || user || null);
      const isSuperAdmin = roleKeys.includes(ROLE_KEYS.SUPER_ADMIN);

      if (status === 401 || status === 403) {
        await logout();
        router.replace('/login');
        return;
      }

      if (isSuperAdmin && status === 422) {
        await loadTenantOptions();
        const superRole = resolveRoleProfile({ id: 'super_admin', role: ROLE_KEYS.SUPER_ADMIN, pack: 'admin' });
        setDashboardRole(superRole);
        setLiveDashboard(createEmptyDashboardData(superRole));
        setScreenState(STATES.NEEDS_TENANT_CONTEXT);
        return;
      }

      if (!silent) {
        setScreenState(STATES.ERROR);
      }
    } finally {
      if (!silent) {
        setIsHydrating(false);
      }
    }
  }, [
    canAccessDashboard,
    isAuthenticated,
    loadCurrentUser,
    loadTenantOptions,
    logout,
    router,
    selectedTenantId,
    user,
  ]);

  useEffect(() => {
    hydrateDashboard();
  }, [hydrateDashboard]);

  const shouldAutoRefresh = process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID;

  useEffect(() => {
    if (!shouldAutoRefresh || !isAuthenticated || !canAccessDashboard) return undefined;
    if (screenState === STATES.NEEDS_TENANT_CONTEXT && !selectedTenantId) return undefined;

    const intervalId = setInterval(() => {
      hydrateDashboard({ silent: true });
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [
    canAccessDashboard,
    hydrateDashboard,
    isAuthenticated,
    screenState,
    selectedTenantId,
    shouldAutoRefresh,
  ]);

  const effectiveUser = resolvedUser || user || null;

  const facilityContext = useMemo(() => {
    const roleName = dashboardRole?.role || effectiveUser?.roles?.[0]?.role?.name || effectiveUser?.role || '';
    const facilityName = resolveFacilityName(effectiveUser, registrationContext);
    const resolvedFacilityType = (
      effectiveUser?.facility?.facility_type
      || registrationContext?.facility_type
      || ''
    );

    return {
      ...DEFAULT_FACILITY_CONTEXT,
      userName: normalizeUserName(effectiveUser, registrationContext),
      roleKey: mapRoleToWelcomeKey(roleName),
      facilityName,
      branchName: registrationContext?.tenant_name || effectiveUser?.tenant?.name || facilityName,
      facilityTypeKey: mapFacilityTypeToKey(resolvedFacilityType),
    };
  }, [dashboardRole?.role, effectiveUser, registrationContext]);

  const quickActions = useMemo(
    () =>
      QUICK_ACTIONS.filter((item) => isItemVisible(toActionAccessItem(item.roles))).map((item) => ({
        ...item,
        isEnabled: Boolean(item.supported),
        blockedReasonKey: item.supported ? '' : 'home.quickActions.blocked.unavailable',
      })),
    [isItemVisible]
  );

  const handleQuickAction = useCallback((action) => {
    if (!action?.isEnabled || !action?.path) return false;
    router.push(action.path);
    return true;
  }, [router]);

  const handleRetry = useCallback(() => {
    hydrateDashboard();
  }, [hydrateDashboard]);

  const handleTenantSelection = useCallback((tenantId) => {
    const normalizedTenantId = toOptionalId(tenantId);
    setSelectedTenantId(normalizedTenantId || '');

    if (!normalizedTenantId) {
      setScreenState(STATES.NEEDS_TENANT_CONTEXT);
      return;
    }

    hydrateDashboard({ tenantIdOverride: normalizedTenantId });
  }, [hydrateDashboard]);

  return {
    state: isHydrating ? STATES.LOADING : screenState,
    isOffline,
    facilityContext,
    dashboardRole,
    liveDashboard,
    quickActions,
    tenantContext: {
      isRequired: screenState === STATES.NEEDS_TENANT_CONTEXT,
      options: tenantOptions,
      selectedTenantId,
      isLoading: tenantOptionsLoading,
      onSelectTenant: handleTenantSelection,
    },
    lastUpdated,
    onRetry: handleRetry,
    onQuickAction: handleQuickAction,
  };
};

export default useDashboardScreen;
