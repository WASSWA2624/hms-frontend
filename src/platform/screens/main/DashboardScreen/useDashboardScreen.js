/**
 * useDashboardScreen Hook
 * Shared behavior/logic for DashboardScreen across all platforms
 * File: useDashboardScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useNavigationVisibility } from '@hooks';
import { MAIN_NAV_ITEMS } from '@config/sideMenu';
import { readRegistrationContext } from '@navigation/registrationContext';
import { STATES } from './types';

const SUMMARY_CARDS = [
  { id: 'patients', labelKey: 'home.summary.patientsToday', value: 128, delta: 12 },
  { id: 'appointments', labelKey: 'home.summary.appointments', value: 46, delta: -5 },
  { id: 'admissions', labelKey: 'home.summary.admissions', value: 18, delta: 3 },
  { id: 'discharges', labelKey: 'home.summary.discharges', value: 9, delta: 0 },
];

const CAPACITY_STATS = [
  { id: 'beds', labelKey: 'home.capacity.beds', used: 98, total: 120, variant: 'warning' },
  { id: 'icu', labelKey: 'home.capacity.icu', used: 12, total: 16, variant: 'error' },
  { id: 'theatre', labelKey: 'home.capacity.theatre', used: 3, total: 6, variant: 'primary' },
];

const PRIORITY_ALERTS = [
  {
    id: 'priority-1',
    titleKey: 'home.priority.items.edSurge.title',
    metaKey: 'home.priority.items.edSurge.meta',
    severityKey: 'home.priority.severity.critical',
    severityVariant: 'error',
  },
  {
    id: 'priority-2',
    titleKey: 'home.priority.items.icuOverflow.title',
    metaKey: 'home.priority.items.icuOverflow.meta',
    severityKey: 'home.priority.severity.warning',
    severityVariant: 'warning',
  },
  {
    id: 'priority-3',
    titleKey: 'home.priority.items.labDelays.title',
    metaKey: 'home.priority.items.labDelays.meta',
    severityKey: 'home.priority.severity.info',
    severityVariant: 'primary',
  },
];

const APPOINTMENTS = [
  {
    id: 'appt-1',
    titleKey: 'home.appointments.items.rounds.title',
    metaKey: 'home.appointments.items.rounds.meta',
    statusKey: 'home.appointments.status.confirmed',
    statusVariant: 'success',
  },
  {
    id: 'appt-2',
    titleKey: 'home.appointments.items.followup.title',
    metaKey: 'home.appointments.items.followup.meta',
    statusKey: 'home.appointments.status.waiting',
    statusVariant: 'warning',
  },
  {
    id: 'appt-3',
    titleKey: 'home.appointments.items.walkin.title',
    metaKey: 'home.appointments.items.walkin.meta',
    statusKey: 'home.appointments.status.walkIn',
    statusVariant: 'primary',
  },
];

const ALERTS = [
  {
    id: 'alert-1',
    titleKey: 'home.alerts.items.lab.title',
    metaKey: 'home.alerts.items.lab.meta',
    severityKey: 'home.alerts.severity.critical',
    severityVariant: 'error',
  },
  {
    id: 'alert-2',
    titleKey: 'home.alerts.items.pharmacy.title',
    metaKey: 'home.alerts.items.pharmacy.meta',
    severityKey: 'home.alerts.severity.warning',
    severityVariant: 'warning',
  },
  {
    id: 'alert-3',
    titleKey: 'home.alerts.items.admission.title',
    metaKey: 'home.alerts.items.admission.meta',
    severityKey: 'home.alerts.severity.info',
    severityVariant: 'primary',
  },
];

const FLOW_UPDATES = [
  {
    id: 'flow-1',
    titleKey: 'home.flow.items.waitTime.title',
    metaKey: 'home.flow.items.waitTime.meta',
    statusKey: 'home.flow.status.attention',
    statusVariant: 'warning',
  },
  {
    id: 'flow-2',
    titleKey: 'home.flow.items.admitTurnaround.title',
    metaKey: 'home.flow.items.admitTurnaround.meta',
    statusKey: 'home.flow.status.stable',
    statusVariant: 'success',
  },
  {
    id: 'flow-3',
    titleKey: 'home.flow.items.dischargeQueue.title',
    metaKey: 'home.flow.items.dischargeQueue.meta',
    statusKey: 'home.flow.status.monitor',
    statusVariant: 'primary',
  },
];

const STAFFING_UPDATES = [
  {
    id: 'staff-1',
    titleKey: 'home.staffing.items.coverage.title',
    metaKey: 'home.staffing.items.coverage.meta',
    statusKey: 'home.staffing.status.good',
    statusVariant: 'success',
  },
  {
    id: 'staff-2',
    titleKey: 'home.staffing.items.openShifts.title',
    metaKey: 'home.staffing.items.openShifts.meta',
    statusKey: 'home.staffing.status.action',
    statusVariant: 'warning',
  },
  {
    id: 'staff-3',
    titleKey: 'home.staffing.items.onCall.title',
    metaKey: 'home.staffing.items.onCall.meta',
    statusKey: 'home.staffing.status.monitor',
    statusVariant: 'primary',
  },
];

const SERVICE_STATUS = [
  {
    id: 'service-1',
    titleKey: 'home.services.items.pharmacy.title',
    metaKey: 'home.services.items.pharmacy.meta',
    statusKey: 'home.services.status.warning',
    statusVariant: 'warning',
  },
  {
    id: 'service-2',
    titleKey: 'home.services.items.imaging.title',
    metaKey: 'home.services.items.imaging.meta',
    statusKey: 'home.services.status.good',
    statusVariant: 'success',
  },
  {
    id: 'service-3',
    titleKey: 'home.services.items.labs.title',
    metaKey: 'home.services.items.labs.meta',
    statusKey: 'home.services.status.monitor',
    statusVariant: 'primary',
  },
];

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

const mapRoleToWelcomeKey = (value) => {
  const normalized = String(value || '').toUpperCase();
  if (normalized.includes('OWNER') || normalized.includes('ADMIN')) {
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

const resolveFacilityName = (user, registrationContext) =>
  user?.facility?.name ||
  registrationContext?.facility_display_name ||
  registrationContext?.facility_name ||
  DEFAULT_FACILITY_CONTEXT.facilityName;

const SMART_STATUS_STRIP = [
  { id: 'patientsToday', labelKey: 'home.statusStrip.items.patientsToday', value: 128 },
  { id: 'appointmentsToday', labelKey: 'home.statusStrip.items.appointmentsToday', value: 46 },
  { id: 'admissionsToday', labelKey: 'home.statusStrip.items.admissionsToday', value: 18 },
  { id: 'revenueToday', labelKey: 'home.statusStrip.items.revenueToday', value: 2840, format: 'currency' },
  { id: 'pendingBills', labelKey: 'home.statusStrip.items.pendingBills', value: 12 },
];

const ONBOARDING_CHECKLIST = [
  {
    id: 'registerPatient',
    titleKey: 'home.startHere.items.registerPatient.title',
    metaKey: 'home.startHere.items.registerPatient.meta',
    completed: true,
  },
  {
    id: 'bookAppointment',
    titleKey: 'home.startHere.items.bookAppointment.title',
    metaKey: 'home.startHere.items.bookAppointment.meta',
    completed: true,
  },
  {
    id: 'addStaff',
    titleKey: 'home.startHere.items.addStaff.title',
    metaKey: 'home.startHere.items.addStaff.meta',
    completed: false,
  },
  {
    id: 'createInvoice',
    titleKey: 'home.startHere.items.createInvoice.title',
    metaKey: 'home.startHere.items.createInvoice.meta',
    completed: false,
  },
  {
    id: 'admitPatient',
    titleKey: 'home.startHere.items.admitPatient.title',
    metaKey: 'home.startHere.items.admitPatient.meta',
    completed: false,
  },
];

const QUICK_ACTIONS = [
  {
    id: 'newPatient',
    labelKey: 'home.quickActions.items.newPatient',
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE'],
    supported: false,
  },
  {
    id: 'appointment',
    labelKey: 'home.quickActions.items.appointment',
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'],
    supported: false,
  },
  {
    id: 'invoice',
    labelKey: 'home.quickActions.items.invoice',
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'CASHIER', 'BILLING'],
    supported: false,
  },
  {
    id: 'admit',
    labelKey: 'home.quickActions.items.admit',
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE'],
    supported: false,
  },
  {
    id: 'labTest',
    labelKey: 'home.quickActions.items.labTest',
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECH'],
    supported: false,
  },
  {
    id: 'sale',
    labelKey: 'home.quickActions.items.sale',
    roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'PHARMACIST', 'CASHIER'],
    supported: false,
  },
];

const WORK_QUEUE = [
  {
    id: 'queue-1',
    titleKey: 'home.workQueue.items.upcomingAppointments.title',
    metaKey: 'home.workQueue.items.upcomingAppointments.meta',
    statusKey: 'home.workQueue.status.next',
    statusVariant: 'primary',
  },
  {
    id: 'queue-2',
    titleKey: 'home.workQueue.items.waitingPatients.title',
    metaKey: 'home.workQueue.items.waitingPatients.meta',
    statusKey: 'home.workQueue.status.waiting',
    statusVariant: 'warning',
  },
  {
    id: 'queue-3',
    titleKey: 'home.workQueue.items.pendingApprovals.title',
    metaKey: 'home.workQueue.items.pendingApprovals.meta',
    statusKey: 'home.workQueue.status.review',
    statusVariant: 'primary',
  },
  {
    id: 'queue-4',
    titleKey: 'home.workQueue.items.pendingResults.title',
    metaKey: 'home.workQueue.items.pendingResults.meta',
    statusKey: 'home.workQueue.status.inProgress',
    statusVariant: 'warning',
  },
  {
    id: 'queue-5',
    titleKey: 'home.workQueue.items.unpaidInvoices.title',
    metaKey: 'home.workQueue.items.unpaidInvoices.meta',
    statusKey: 'home.workQueue.status.action',
    statusVariant: 'error',
  },
];

const ATTENTION_ALERTS = [
  {
    id: 'attention-1',
    titleKey: 'home.attention.items.lowStock.title',
    metaKey: 'home.attention.items.lowStock.meta',
    severityKey: 'home.attention.severity.warning',
    severityVariant: 'warning',
  },
  {
    id: 'attention-2',
    titleKey: 'home.attention.items.expiringDrugs.title',
    metaKey: 'home.attention.items.expiringDrugs.meta',
    severityKey: 'home.attention.severity.warning',
    severityVariant: 'warning',
  },
  {
    id: 'attention-3',
    titleKey: 'home.attention.items.overdueBills.title',
    metaKey: 'home.attention.items.overdueBills.meta',
    severityKey: 'home.attention.severity.critical',
    severityVariant: 'error',
  },
  {
    id: 'attention-4',
    titleKey: 'home.attention.items.criticalLabs.title',
    metaKey: 'home.attention.items.criticalLabs.meta',
    severityKey: 'home.attention.severity.info',
    severityVariant: 'primary',
  },
  {
    id: 'attention-5',
    titleKey: 'home.attention.items.capacityWarning.title',
    metaKey: 'home.attention.items.capacityWarning.meta',
    severityKey: 'home.attention.severity.warning',
    severityVariant: 'warning',
  },
];

const VALUE_PROOFS = [
  {
    id: 'value-1',
    labelKey: 'home.valueProof.items.revenue.title',
    value: 48250,
    delta: 12,
    format: 'currency',
    comparisonKey: 'home.valueProof.items.revenue.comparison',
  },
  {
    id: 'value-2',
    labelKey: 'home.valueProof.items.patientGrowth.title',
    value: 18,
    delta: 18,
    format: 'percent',
    comparisonKey: 'home.valueProof.items.patientGrowth.comparison',
  },
  {
    id: 'value-3',
    labelKey: 'home.valueProof.items.collectionRate.title',
    value: 94,
    format: 'percent',
    comparisonKey: 'home.valueProof.items.collectionRate.comparison',
  },
  {
    id: 'value-4',
    labelKey: 'home.valueProof.items.turnaround.title',
    value: 37,
    format: 'minutes',
    comparisonKey: 'home.valueProof.items.turnaround.comparison',
  },
  {
    id: 'value-5',
    labelKey: 'home.valueProof.items.bedOccupancy.title',
    value: 82,
    format: 'percent',
    comparisonKey: 'home.valueProof.items.bedOccupancy.comparison',
  },
];

const SMART_INSIGHTS = [
  {
    id: 'insight-1',
    titleKey: 'home.insights.items.volumeIncrease.title',
    metaKey: 'home.insights.items.volumeIncrease.meta',
    variant: 'success',
  },
  {
    id: 'insight-2',
    titleKey: 'home.insights.items.trialLimit.title',
    metaKey: 'home.insights.items.trialLimit.meta',
    variant: 'warning',
  },
  {
    id: 'insight-3',
    titleKey: 'home.insights.items.expiryRisk.title',
    metaKey: 'home.insights.items.expiryRisk.meta',
    variant: 'primary',
  },
  {
    id: 'insight-4',
    titleKey: 'home.insights.items.readyForIpd.title',
    metaKey: 'home.insights.items.readyForIpd.meta',
    variant: 'success',
  },
];

const MODULE_DISCOVERY = [
  {
    id: 'module-1',
    titleKey: 'home.modules.items.pharmacy.title',
    benefitKey: 'home.modules.items.pharmacy.benefit',
    whoKey: 'home.modules.items.pharmacy.who',
    ctaKey: 'home.modules.items.pharmacy.cta',
  },
  {
    id: 'module-2',
    titleKey: 'home.modules.items.lab.title',
    benefitKey: 'home.modules.items.lab.benefit',
    whoKey: 'home.modules.items.lab.who',
    ctaKey: 'home.modules.items.lab.cta',
  },
  {
    id: 'module-3',
    titleKey: 'home.modules.items.inventory.title',
    benefitKey: 'home.modules.items.inventory.benefit',
    whoKey: 'home.modules.items.inventory.who',
    ctaKey: 'home.modules.items.inventory.cta',
  },
  {
    id: 'module-4',
    titleKey: 'home.modules.items.hr.title',
    benefitKey: 'home.modules.items.hr.benefit',
    whoKey: 'home.modules.items.hr.who',
    ctaKey: 'home.modules.items.hr.cta',
  },
  {
    id: 'module-5',
    titleKey: 'home.modules.items.insurance.title',
    benefitKey: 'home.modules.items.insurance.benefit',
    whoKey: 'home.modules.items.insurance.who',
    ctaKey: 'home.modules.items.insurance.cta',
  },
];

const USAGE_PLAN = {
  titleKey: 'home.plan.usage.title',
  subtitleKey: 'home.plan.usage.subtitle',
  statusKey: 'home.plan.status.trial',
  detailKey: 'home.plan.trialDays',
  detailValue: 9,
  usageKey: 'home.plan.usage.remaining',
  usageValue: 320,
  limitKey: 'home.plan.usage.limitNote',
  upgradeCtaKey: 'home.plan.actions.upgrade',
  compareCtaKey: 'home.plan.actions.compare',
};

const ACTIVITY_FEED = [
  {
    id: 'activity-1',
    titleKey: 'home.activity.items.patientRegistered.title',
    metaKey: 'home.activity.items.patientRegistered.meta',
    timeKey: 'home.activity.items.patientRegistered.time',
  },
  {
    id: 'activity-2',
    titleKey: 'home.activity.items.billGenerated.title',
    metaKey: 'home.activity.items.billGenerated.meta',
    timeKey: 'home.activity.items.billGenerated.time',
  },
  {
    id: 'activity-3',
    titleKey: 'home.activity.items.testCompleted.title',
    metaKey: 'home.activity.items.testCompleted.meta',
    timeKey: 'home.activity.items.testCompleted.time',
  },
  {
    id: 'activity-4',
    titleKey: 'home.activity.items.stockUpdated.title',
    metaKey: 'home.activity.items.stockUpdated.meta',
    timeKey: 'home.activity.items.stockUpdated.time',
  },
  {
    id: 'activity-5',
    titleKey: 'home.activity.items.staffAdded.title',
    metaKey: 'home.activity.items.staffAdded.meta',
    timeKey: 'home.activity.items.staffAdded.time',
  },
];

const HELP_RESOURCES = [
  {
    id: 'help-1',
    titleKey: 'home.help.items.showMe.title',
    metaKey: 'home.help.items.showMe.meta',
    ctaKey: 'home.help.items.showMe.cta',
  },
  {
    id: 'help-2',
    titleKey: 'home.help.items.walkthroughs.title',
    metaKey: 'home.help.items.walkthroughs.meta',
    ctaKey: 'home.help.items.walkthroughs.cta',
  },
  {
    id: 'help-3',
    titleKey: 'home.help.items.tips.title',
    metaKey: 'home.help.items.tips.meta',
    ctaKey: 'home.help.items.tips.cta',
  },
];

const toActionAccessItem = (roles) => ({
  roles: Array.isArray(roles) ? roles : [],
});

/**
 * DashboardScreen hook
 * @returns {Object} Hook return object
 */
const useDashboardScreen = () => {
  const router = useRouter();
  const { user, isAuthenticated, loadCurrentUser, logout } = useAuth();
  const { isItemVisible } = useNavigationVisibility();
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
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  const hydrateDashboard = useCallback(async () => {
    if (!isAuthenticated) {
      setIsHydrating(false);
      return;
    }
    if (!canAccessDashboard) {
      setIsHydrating(false);
      router.replace('/login');
      return;
    }

    setIsHydrating(true);
    setScreenState(STATES.LOADING);
    try {
      let effectiveUser = user || null;
      if (!effectiveUser) {
        const loadAction = await loadCurrentUser();
        const loadStatus = loadAction?.meta?.requestStatus;
        if (loadStatus !== 'fulfilled' || !loadAction?.payload) {
          const responseStatus = loadAction?.payload?.status || loadAction?.error?.status;
          if (responseStatus === 401 || responseStatus === 403) {
            await logout();
            router.replace('/login');
            return;
          }
          setScreenState(STATES.ERROR);
          return;
        }
        effectiveUser = loadAction.payload;
      }

      const context = await readRegistrationContext();
      setRegistrationContext(context);
      setResolvedUser(effectiveUser);
      setLastUpdated(new Date());
      setScreenState(STATES.IDLE);
    } catch {
      setScreenState(STATES.ERROR);
    } finally {
      setIsHydrating(false);
    }
  }, [canAccessDashboard, isAuthenticated, loadCurrentUser, logout, router, user]);

  useEffect(() => {
    hydrateDashboard();
  }, [hydrateDashboard]);

  const effectiveUser = resolvedUser || user || null;

  const facilityContext = useMemo(() => {
    const roleName =
      effectiveUser?.roles?.[0]?.role?.name ||
      effectiveUser?.roles?.[0]?.name ||
      effectiveUser?.role ||
      '';
    const facilityName = resolveFacilityName(effectiveUser, registrationContext);
    const resolvedFacilityType =
      effectiveUser?.facility?.facility_type || registrationContext?.facility_type || '';
    return {
      ...DEFAULT_FACILITY_CONTEXT,
      userName: normalizeUserName(effectiveUser, registrationContext),
      roleKey: mapRoleToWelcomeKey(roleName),
      facilityName,
      branchName: registrationContext?.tenant_name || effectiveUser?.tenant?.name || facilityName,
      facilityTypeKey: mapFacilityTypeToKey(resolvedFacilityType),
    };
  }, [effectiveUser, registrationContext]);

  const quickActions = useMemo(
    () =>
      QUICK_ACTIONS.map((item) => {
        const hasRoleAccess = isItemVisible(toActionAccessItem(item.roles));
        const isEnabled = hasRoleAccess && Boolean(item.supported);
        return {
          ...item,
          isEnabled,
          blockedReasonKey: hasRoleAccess
            ? item.supported
              ? ''
              : 'home.quickActions.blocked.unavailable'
            : 'home.quickActions.blocked.access',
        };
      }),
    [isItemVisible]
  );

  const handleQuickAction = useCallback((action) => {
    if (!action?.isEnabled) return false;
    return false;
  }, []);

  const handleRetry = useCallback(() => {
    hydrateDashboard();
  }, [hydrateDashboard]);

  return {
    state: isHydrating ? STATES.LOADING : screenState,
    isOffline: false,
    facilityContext,
    smartStatusStrip: SMART_STATUS_STRIP,
    onboardingChecklist: ONBOARDING_CHECKLIST,
    quickActions,
    workQueue: WORK_QUEUE,
    attentionAlerts: ATTENTION_ALERTS,
    valueProofs: VALUE_PROOFS,
    insights: SMART_INSIGHTS,
    moduleDiscovery: MODULE_DISCOVERY,
    usagePlan: USAGE_PLAN,
    activityFeed: ACTIVITY_FEED,
    helpResources: HELP_RESOURCES,
    summaryCards: SUMMARY_CARDS,
    capacityStats: CAPACITY_STATS,
    priorityAlerts: PRIORITY_ALERTS,
    appointments: APPOINTMENTS,
    alerts: ALERTS,
    flowUpdates: FLOW_UPDATES,
    staffingUpdates: STAFFING_UPDATES,
    serviceStatus: SERVICE_STATUS,
    lastUpdated,
    onRetry: handleRetry,
    onQuickAction: handleQuickAction,
  };
};

export default useDashboardScreen;
