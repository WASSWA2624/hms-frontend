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
    appointments: APPOINTMENTS,
    alerts: ALERTS,
    lastUpdated,
    onRetry: handleRetry,
  };
};

export default useDashboardScreen;
