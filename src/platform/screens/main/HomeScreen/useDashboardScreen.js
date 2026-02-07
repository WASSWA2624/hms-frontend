/**
 * useDashboardScreen Hook
 * Shared behavior/logic for DashboardScreen across all platforms
 * File: useDashboardScreen.js
 */
import { useCallback, useMemo } from 'react';
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

/**
 * DashboardScreen hook
 * @returns {Object} Hook return object
 */
const useDashboardScreen = () => {
  const lastUpdated = useMemo(() => new Date(), []);
  const handleRetry = useCallback(() => {}, []);

  return {
    state: STATES.IDLE,
    isOffline: false,
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
  };
};

export default useDashboardScreen;
