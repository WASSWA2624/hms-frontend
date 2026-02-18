/**
 * Dashboard live data aggregation helpers.
 * File: dashboardLiveData.js
 */
import {
  listAdmissions,
  listAppointments,
  listDispenseLogs,
  listInventoryStocks,
  listInvoices,
  listLabOrders,
  listLabResults,
  listPatients,
  listPharmacyOrders,
} from '@features';
import { normalizeRoleKey } from '@hooks/roleUtils';

const FETCH_LIMIT = 100;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const TREND_DAYS = 7;

const ROLE_IDS = {
  GENERAL: 'general',
  LAB: 'lab',
  PHARMACY: 'pharmacy',
};

const ROLE_PROFILES = {
  [ROLE_IDS.GENERAL]: {
    id: ROLE_IDS.GENERAL,
    title: 'Care operations overview',
    subtitle: 'Patient flow, appointments, admissions, and billing performance.',
    badgeVariant: 'primary',
  },
  [ROLE_IDS.LAB]: {
    id: ROLE_IDS.LAB,
    title: 'Laboratory operations',
    subtitle: 'Sample throughput, critical findings, and result turnaround.',
    badgeVariant: 'warning',
  },
  [ROLE_IDS.PHARMACY]: {
    id: ROLE_IDS.PHARMACY,
    title: 'Pharmacy operations',
    subtitle: 'Dispensing load, stock pressure, and fulfillment status.',
    badgeVariant: 'success',
  },
};

const STATUS_VARIANTS = {
  success: 'success',
  warning: 'warning',
  critical: 'error',
  info: 'primary',
};

const CHART_COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#dc2626', '#7c3aed', '#14b8a6'];

const createEmptyDashboardData = (roleProfile = ROLE_PROFILES[ROLE_IDS.GENERAL]) => ({
  roleProfile,
  summaryCards: [],
  trend: {
    title: '7-day trend',
    subtitle: 'No data available yet.',
    points: [],
  },
  distribution: {
    title: 'Status distribution',
    subtitle: 'No data available yet.',
    total: 0,
    segments: [],
  },
  highlights: [],
  queue: [],
  alerts: [],
  activity: [],
  hasLiveData: false,
});

const toArray = (value) => (Array.isArray(value) ? value : []);

const toNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === 'object' && typeof value.toString === 'function') {
    const parsed = Number(value.toString());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const normalizeStatus = (value) => String(value || '').trim().toUpperCase();

const safeList = async (listAction, params = {}) => {
  try {
    const result = await listAction(params);
    return toArray(result);
  } catch {
    return [];
  }
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const readDate = (item, keys = []) => {
  for (const key of keys) {
    const parsed = parseDate(item?.[key]);
    if (parsed) return parsed;
  }
  return null;
};

const startOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const sameDay = (left, right = new Date()) => {
  if (!left) return false;
  return startOfDay(left).getTime() === startOfDay(right).getTime();
};

const dateKey = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createTrailingDates = (days = TREND_DAYS, now = new Date()) => {
  const end = startOfDay(now);
  return Array.from({ length: days }).map((_, index) => {
    const point = new Date(end);
    point.setDate(end.getDate() - (days - 1 - index));
    return point;
  });
};

const buildSeries = (records, dateKeys, now = new Date(), days = TREND_DAYS) => {
  const timeline = createTrailingDates(days, now);
  const counts = new Map(timeline.map((value) => [dateKey(value), 0]));

  records.forEach((item) => {
    const timestamp = readDate(item, dateKeys);
    if (!timestamp) return;
    const key = dateKey(timestamp);
    if (!counts.has(key)) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return timeline.map((value) => {
    const key = dateKey(value);
    return {
      id: key,
      date: value,
      value: counts.get(key) || 0,
    };
  });
};

const countByDate = (records, keys, now = new Date()) =>
  records.reduce((total, item) => total + (sameDay(readDate(item, keys), now) ? 1 : 0), 0);

const countByStatus = (records, statuses, field = 'status') => {
  const desired = new Set(statuses.map(normalizeStatus));
  return records.reduce((total, item) => total + (desired.has(normalizeStatus(item?.[field])) ? 1 : 0), 0);
};

const countByStatusAnyField = (records, statuses, fields = ['status']) => {
  const desired = new Set(statuses.map(normalizeStatus));
  return records.reduce((total, item) => {
    const hasMatch = fields.some((field) => desired.has(normalizeStatus(item?.[field])));
    return total + (hasMatch ? 1 : 0);
  }, 0);
};

const sumBy = (records, mapper) =>
  records.reduce((total, item) => total + toNumber(mapper(item)), 0);

const toPercent = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

const average = (values = []) => {
  const filtered = values.filter((value) => Number.isFinite(value));
  if (!filtered.length) return 0;
  return Math.round(filtered.reduce((sum, value) => sum + value, 0) / filtered.length);
};

const formatRelativeTime = (date, now = new Date()) => {
  if (!date) return 'No timestamp';
  const diff = Math.max(0, now.getTime() - date.getTime());
  const minutes = Math.floor(diff / (60 * 1000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const buildStatusSegments = (records, statuses, labelMap = {}, fields = ['status']) => {
  const counts = statuses.map((status) => ({
    status,
    label: labelMap[status] || status.replace(/_/g, ' '),
    value: countByStatusAnyField(records, [status], fields),
  }));
  const nonZero = counts.filter((item) => item.value > 0);
  const target = nonZero.length ? nonZero : counts.slice(0, 1);
  return target.map((item, index) => ({
    id: item.status,
    label: item.label,
    value: item.value,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
};

const createQueueItem = (id, title, count, statusLabel, statusVariant, description) => ({
  id,
  title,
  meta: `${count} ${description}`,
  statusLabel,
  statusVariant,
});

const createAlertItem = (id, title, count, severityLabel, severityVariant, description) => ({
  id,
  title,
  meta: `${count} ${description}`,
  severityLabel,
  severityVariant,
});

const buildActivity = (entries, now = new Date(), limit = 8) =>
  entries
    .filter((item) => item?.date)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit)
    .map((item, index) => ({
      id: item.id || `activity-${index}`,
      title: item.title,
      meta: item.meta,
      timeLabel: formatRelativeTime(item.date, now),
    }));

const hasRoleToken = (roleKeys, token) =>
  roleKeys.some((role) => role.includes(token));

const resolveRoleProfile = ({ roleKeys = [], facilityType = '' } = {}) => {
  const normalizedFacilityType = String(facilityType || '').trim().toUpperCase();
  if (hasRoleToken(roleKeys, 'LAB') || normalizedFacilityType === 'LAB') {
    return ROLE_PROFILES[ROLE_IDS.LAB];
  }
  if (
    hasRoleToken(roleKeys, 'PHARMACY') ||
    hasRoleToken(roleKeys, 'PHARMACIST') ||
    normalizedFacilityType === 'PHARMACY'
  ) {
    return ROLE_PROFILES[ROLE_IDS.PHARMACY];
  }
  return ROLE_PROFILES[ROLE_IDS.GENERAL];
};

const collectUserRoleKeys = (user) => {
  const values = [];

  const collect = (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }
    const key = normalizeRoleKey(value);
    if (key) values.push(key);
  };

  collect(user?.roles);
  collect(user?.role);
  collect(user?.role_name);

  return [...new Set(values)];
};

const daysOld = (date, now = new Date()) => Math.floor((now.getTime() - date.getTime()) / ONE_DAY_MS);

const buildGeneralDashboard = (datasets, now) => {
  const {
    patients,
    appointments,
    admissions,
    invoices,
    labOrders,
    labResults,
  } = datasets;

  const appointmentsToday = countByDate(appointments, ['scheduled_start', 'created_at'], now);
  const patientsToday = countByDate(patients, ['created_at'], now);
  const activeAdmissions = countByStatus(admissions, ['ADMITTED']);
  const openInvoices = countByStatusAnyField(invoices, ['SENT', 'OVERDUE', 'DRAFT', 'PARTIAL'], [
    'status',
    'billing_status',
  ]);
  const revenueToday = sumBy(
    invoices.filter(
      (invoice) =>
        countByStatusAnyField([invoice], ['PAID', 'COMPLETED'], ['status', 'billing_status']) > 0 &&
        sameDay(readDate(invoice, ['issued_at', 'created_at']), now)
    ),
    (invoice) => invoice?.total_amount
  );

  const completedAppointments = countByStatus(appointments, ['COMPLETED']);
  const paidInvoices = countByStatusAnyField(invoices, ['PAID', 'COMPLETED'], ['status', 'billing_status']);
  const overdueInvoices = countByStatusAnyField(invoices, ['OVERDUE'], ['status', 'billing_status']);
  const cancelledAppointments = countByStatus(appointments, ['CANCELLED', 'NO_SHOW']);
  const criticalResults = countByStatus(labResults, ['CRITICAL']);

  const summaryCards = [
    { id: 'patientsToday', label: 'Patients added today', value: patientsToday },
    { id: 'appointmentsToday', label: 'Appointments today', value: appointmentsToday },
    { id: 'activeAdmissions', label: 'Active admissions', value: activeAdmissions },
    { id: 'openInvoices', label: 'Open invoices', value: openInvoices },
    { id: 'revenueToday', label: 'Revenue collected today', value: revenueToday, format: 'currency' },
  ];

  const trendPoints = buildSeries(appointments, ['scheduled_start', 'created_at'], now);
  const distributionSegments = buildStatusSegments(
    invoices,
    ['PAID', 'SENT', 'OVERDUE', 'DRAFT'],
    {
      PAID: 'Paid',
      SENT: 'Sent',
      OVERDUE: 'Overdue',
      DRAFT: 'Draft',
    },
    ['status']
  );
  const distributionTotal = distributionSegments.reduce((total, segment) => total + segment.value, 0);

  const highlights = [
    {
      id: 'collectionRate',
      label: 'Collection rate',
      value: `${toPercent(paidInvoices, invoices.length)}%`,
      context: `${paidInvoices} paid / ${invoices.length} total`,
      variant: 'success',
    },
    {
      id: 'appointmentCompletion',
      label: 'Appointment completion',
      value: `${toPercent(completedAppointments, appointments.length)}%`,
      context: `${completedAppointments} completed`,
      variant: 'primary',
    },
    {
      id: 'avgAppointments',
      label: 'Avg appointments/day',
      value: String(average(trendPoints.map((point) => point.value))),
      context: 'Last 7 days',
      variant: 'warning',
    },
  ];

  const queue = [
    createQueueItem(
      'upcomingAppointments',
      'Upcoming appointments',
      countByStatus(appointments, ['SCHEDULED', 'CONFIRMED']),
      'Next to handle',
      STATUS_VARIANTS.info,
      'appointments pending'
    ),
    createQueueItem(
      'inProgress',
      'Consultations in progress',
      countByStatus(appointments, ['IN_PROGRESS']),
      'Live workload',
      STATUS_VARIANTS.warning,
      'appointments active now'
    ),
    createQueueItem(
      'pendingDischarge',
      'Admissions pending discharge',
      activeAdmissions,
      'Monitor capacity',
      STATUS_VARIANTS.warning,
      'patients currently admitted'
    ),
  ];

  const alerts = [
    createAlertItem(
      'overdueInvoices',
      'Overdue invoices',
      overdueInvoices,
      overdueInvoices > 0 ? 'Needs follow-up' : 'Under control',
      overdueInvoices > 0 ? STATUS_VARIANTS.critical : STATUS_VARIANTS.success,
      'records overdue'
    ),
    createAlertItem(
      'missedAppointments',
      'Cancelled or no-show appointments',
      cancelledAppointments,
      cancelledAppointments > 3 ? 'Rising trend' : 'Stable trend',
      cancelledAppointments > 3 ? STATUS_VARIANTS.warning : STATUS_VARIANTS.info,
      'appointments affected today'
    ),
    createAlertItem(
      'criticalLabResults',
      'Critical lab findings',
      criticalResults,
      criticalResults > 0 ? 'Immediate review' : 'No critical findings',
      criticalResults > 0 ? STATUS_VARIANTS.critical : STATUS_VARIANTS.success,
      'critical lab results'
    ),
  ];

  const activity = buildActivity(
    [
      ...appointments.map((item) => ({
        id: `appointment-${item.id}`,
        date: readDate(item, ['created_at', 'scheduled_start']),
        title: 'Appointment updated',
        meta: `Status: ${normalizeStatus(item.status) || 'UNKNOWN'}`,
      })),
      ...patients.map((item) => ({
        id: `patient-${item.id}`,
        date: readDate(item, ['created_at']),
        title: 'Patient profile added',
        meta: `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Patient record',
      })),
      ...invoices.map((item) => ({
        id: `invoice-${item.id}`,
        date: readDate(item, ['issued_at', 'created_at']),
        title: 'Invoice updated',
        meta: `Status: ${normalizeStatus(item.status) || 'UNKNOWN'}`,
      })),
      ...labOrders.map((item) => ({
        id: `lab-order-${item.id}`,
        date: readDate(item, ['ordered_at', 'created_at']),
        title: 'Lab order processed',
        meta: `Status: ${normalizeStatus(item.status) || 'UNKNOWN'}`,
      })),
    ],
    now
  );

  const hasLiveData =
    summaryCards.some((item) => toNumber(item.value) > 0) ||
    trendPoints.some((item) => item.value > 0) ||
    distributionTotal > 0 ||
    activity.length > 0;

  return {
    summaryCards,
    trend: {
      title: 'Appointments over the last 7 days',
      subtitle: 'Workload trend based on scheduled appointments.',
      points: trendPoints,
    },
    distribution: {
      title: 'Invoice status mix',
      subtitle: 'Current billing health by invoice state.',
      total: distributionTotal,
      segments: distributionSegments,
    },
    highlights,
    queue,
    alerts,
    activity,
    hasLiveData,
  };
};

const buildLabDashboard = (datasets, now) => {
  const { labOrders, labResults } = datasets;

  const ordersToday = countByDate(labOrders, ['ordered_at', 'created_at'], now);
  const inProcessOrders = countByStatus(labOrders, ['IN_PROCESS']);
  const pendingCollection = countByStatus(labOrders, ['ORDERED']);
  const completedOrders = countByStatus(labOrders, ['COMPLETED']);
  const criticalResults = countByStatus(labResults, ['CRITICAL']);
  const pendingResults = countByStatus(labResults, ['PENDING']);

  const turnaroundValues = labResults
    .map((result) => {
      const createdAt = readDate(result, ['created_at']);
      const reportedAt = readDate(result, ['reported_at', 'updated_at']);
      if (!createdAt || !reportedAt) return null;
      const minutes = Math.round((reportedAt.getTime() - createdAt.getTime()) / (60 * 1000));
      return minutes >= 0 ? minutes : null;
    })
    .filter((value) => Number.isFinite(value));

  const avgTurnaround = average(turnaroundValues);

  const summaryCards = [
    { id: 'ordersToday', label: 'Orders received today', value: ordersToday },
    { id: 'inProcess', label: 'Tests in process', value: inProcessOrders },
    { id: 'pendingCollection', label: 'Awaiting collection', value: pendingCollection },
    { id: 'criticalResults', label: 'Critical results', value: criticalResults },
    { id: 'avgTurnaround', label: 'Avg turnaround', value: avgTurnaround, format: 'minutes' },
  ];

  const trendPoints = buildSeries(labOrders, ['ordered_at', 'created_at'], now);
  const distributionSegments = buildStatusSegments(
    labResults,
    ['PENDING', 'NORMAL', 'ABNORMAL', 'CRITICAL'],
    {
      PENDING: 'Pending',
      NORMAL: 'Normal',
      ABNORMAL: 'Abnormal',
      CRITICAL: 'Critical',
    },
    ['status']
  );
  const distributionTotal = distributionSegments.reduce((total, segment) => total + segment.value, 0);
  const resultsCompletedToday = countByDate(labResults, ['reported_at', 'updated_at'], now);

  const staleOrders = labOrders.filter((order) => {
    const date = readDate(order, ['ordered_at', 'created_at']);
    if (!date) return false;
    const status = normalizeStatus(order.status);
    if (status === 'COMPLETED' || status === 'CANCELLED') return false;
    return daysOld(date, now) >= 1;
  }).length;

  const highlights = [
    {
      id: 'criticalRatio',
      label: 'Critical ratio',
      value: `${toPercent(criticalResults, labResults.length)}%`,
      context: `${criticalResults} critical / ${labResults.length} total`,
      variant: criticalResults > 0 ? 'warning' : 'success',
    },
    {
      id: 'completionRate',
      label: 'Order completion',
      value: `${toPercent(completedOrders, labOrders.length)}%`,
      context: `${completedOrders} completed orders`,
      variant: 'primary',
    },
    {
      id: 'resultsToday',
      label: 'Results reported today',
      value: String(resultsCompletedToday),
      context: 'Daily reporting throughput',
      variant: 'success',
    },
  ];

  const queue = [
    createQueueItem(
      'queue-collection',
      'Samples to collect',
      pendingCollection,
      pendingCollection > 0 ? 'Queue forming' : 'No waiting samples',
      pendingCollection > 0 ? STATUS_VARIANTS.warning : STATUS_VARIANTS.success,
      'orders not yet collected'
    ),
    createQueueItem(
      'queue-in-process',
      'Tests currently in process',
      inProcessOrders,
      inProcessOrders > 0 ? 'Active processing' : 'Idle',
      STATUS_VARIANTS.info,
      'orders in process'
    ),
    createQueueItem(
      'queue-results',
      'Results awaiting release',
      pendingResults,
      pendingResults > 0 ? 'Requires validation' : 'All results released',
      pendingResults > 0 ? STATUS_VARIANTS.warning : STATUS_VARIANTS.success,
      'pending result entries'
    ),
  ];

  const alerts = [
    createAlertItem(
      'alert-critical',
      'Critical findings',
      criticalResults,
      criticalResults > 0 ? 'Immediate review required' : 'No critical findings',
      criticalResults > 0 ? STATUS_VARIANTS.critical : STATUS_VARIANTS.success,
      'critical result records'
    ),
    createAlertItem(
      'alert-stale',
      'Aging lab orders',
      staleOrders,
      staleOrders > 0 ? 'Delayed turnaround risk' : 'Turnaround within target',
      staleOrders > 0 ? STATUS_VARIANTS.warning : STATUS_VARIANTS.success,
      'orders older than 24h'
    ),
    createAlertItem(
      'alert-pending',
      'Pending result backlog',
      pendingResults,
      pendingResults > 5 ? 'Backlog building' : 'Backlog manageable',
      pendingResults > 5 ? STATUS_VARIANTS.warning : STATUS_VARIANTS.info,
      'results pending validation'
    ),
  ];

  const activity = buildActivity(
    [
      ...labOrders.map((item) => ({
        id: `lab-order-${item.id}`,
        date: readDate(item, ['ordered_at', 'created_at']),
        title: 'Lab order updated',
        meta: `Status: ${normalizeStatus(item.status) || 'UNKNOWN'}`,
      })),
      ...labResults.map((item) => ({
        id: `lab-result-${item.id}`,
        date: readDate(item, ['reported_at', 'updated_at', 'created_at']),
        title: 'Lab result reported',
        meta: `Status: ${normalizeStatus(item.status) || 'UNKNOWN'}`,
      })),
    ],
    now
  );

  const hasLiveData =
    summaryCards.some((item) => toNumber(item.value) > 0) ||
    trendPoints.some((item) => item.value > 0) ||
    distributionTotal > 0 ||
    activity.length > 0;

  return {
    summaryCards,
    trend: {
      title: 'Lab orders over the last 7 days',
      subtitle: 'Incoming demand measured by order creation time.',
      points: trendPoints,
    },
    distribution: {
      title: 'Lab result status mix',
      subtitle: 'Distribution of reported result outcomes.',
      total: distributionTotal,
      segments: distributionSegments,
    },
    highlights,
    queue,
    alerts,
    activity,
    hasLiveData,
  };
};

const buildPharmacyDashboard = (datasets, now) => {
  const {
    pharmacyOrders,
    inventoryStocks,
    dispenseLogs,
    invoices,
  } = datasets;

  const ordersToday = countByDate(pharmacyOrders, ['ordered_at', 'created_at'], now);
  const pendingDispense = countByStatus(pharmacyOrders, ['ORDERED']);
  const partiallyDispensed = countByStatus(pharmacyOrders, ['PARTIALLY_DISPENSED']);
  const dispensedToday = dispenseLogs.reduce((total, item) => {
    const isDispensed = normalizeStatus(item.status) === 'DISPENSED';
    const isToday = sameDay(readDate(item, ['dispensed_at', 'created_at']), now);
    return total + (isDispensed && isToday ? 1 : 0);
  }, 0);

  const lowStockItems = inventoryStocks.filter((stock) => {
    const quantity = toNumber(stock.quantity);
    const reorderLevel = toNumber(stock.reorder_level);
    return reorderLevel > 0 && quantity <= reorderLevel;
  });
  const criticalStockItems = lowStockItems.filter((stock) => {
    const quantity = toNumber(stock.quantity);
    const reorderLevel = toNumber(stock.reorder_level);
    return reorderLevel > 0 && quantity <= Math.ceil(reorderLevel * 0.5);
  });

  const salesToday = sumBy(
    invoices.filter(
      (invoice) =>
        countByStatusAnyField([invoice], ['PAID', 'COMPLETED'], ['status', 'billing_status']) > 0 &&
        sameDay(readDate(invoice, ['issued_at', 'created_at']), now)
    ),
    (invoice) => invoice?.total_amount
  );

  const dispensedQuantityToday = sumBy(
    dispenseLogs.filter(
      (item) =>
        normalizeStatus(item.status) === 'DISPENSED' &&
        sameDay(readDate(item, ['dispensed_at', 'created_at']), now)
    ),
    (item) => item?.quantity_dispensed
  );

  const summaryCards = [
    { id: 'ordersToday', label: 'Medication orders today', value: ordersToday },
    { id: 'pendingDispense', label: 'Pending dispense', value: pendingDispense },
    { id: 'dispensedToday', label: 'Dispensed today', value: dispensedToday },
    { id: 'lowStock', label: 'Low stock items', value: lowStockItems.length },
    { id: 'salesToday', label: 'Sales today', value: salesToday, format: 'currency' },
  ];

  const dispenseTrendSource = dispenseLogs.some((item) => readDate(item, ['dispensed_at', 'created_at']))
    ? dispenseLogs
    : pharmacyOrders;
  const dispenseTrendKeys = dispenseTrendSource === dispenseLogs ? ['dispensed_at', 'created_at'] : ['ordered_at', 'created_at'];
  const trendPoints = buildSeries(dispenseTrendSource, dispenseTrendKeys, now);

  const distributionSegments = buildStatusSegments(
    pharmacyOrders,
    ['ORDERED', 'PARTIALLY_DISPENSED', 'DISPENSED', 'CANCELLED'],
    {
      ORDERED: 'Ordered',
      PARTIALLY_DISPENSED: 'Partially dispensed',
      DISPENSED: 'Dispensed',
      CANCELLED: 'Cancelled',
    }
  );
  const distributionTotal = distributionSegments.reduce((total, segment) => total + segment.value, 0);

  const fulfilledOrders = countByStatus(pharmacyOrders, ['DISPENSED', 'PARTIALLY_DISPENSED']);
  const cancelledOrders = countByStatus(pharmacyOrders, ['CANCELLED']);

  const highlights = [
    {
      id: 'fulfillmentRate',
      label: 'Fulfillment rate',
      value: `${toPercent(fulfilledOrders, pharmacyOrders.length)}%`,
      context: `${fulfilledOrders} fulfilled / ${pharmacyOrders.length} total`,
      variant: fulfilledOrders > 0 ? 'success' : 'primary',
    },
    {
      id: 'dispensedUnits',
      label: 'Units dispensed today',
      value: String(dispensedQuantityToday),
      context: 'From dispense logs',
      variant: 'primary',
    },
    {
      id: 'criticalStock',
      label: 'Critical stock risk',
      value: String(criticalStockItems.length),
      context: 'Items below half reorder level',
      variant: criticalStockItems.length > 0 ? 'warning' : 'success',
    },
  ];

  const queue = [
    createQueueItem(
      'queue-pending-orders',
      'Orders waiting dispensing',
      pendingDispense,
      pendingDispense > 0 ? 'Needs action' : 'Queue clear',
      pendingDispense > 0 ? STATUS_VARIANTS.warning : STATUS_VARIANTS.success,
      'orders to dispense'
    ),
    createQueueItem(
      'queue-partials',
      'Partial fills to complete',
      partiallyDispensed,
      partiallyDispensed > 0 ? 'Follow-up required' : 'No partial fills',
      partiallyDispensed > 0 ? STATUS_VARIANTS.info : STATUS_VARIANTS.success,
      'orders partially dispensed'
    ),
    createQueueItem(
      'queue-stock',
      'Stock lines to reorder',
      lowStockItems.length,
      lowStockItems.length > 0 ? 'Replenishment needed' : 'Stock healthy',
      lowStockItems.length > 0 ? STATUS_VARIANTS.warning : STATUS_VARIANTS.success,
      'inventory items below reorder level'
    ),
  ];

  const alerts = [
    createAlertItem(
      'alert-critical-stock',
      'Critical low stock',
      criticalStockItems.length,
      criticalStockItems.length > 0 ? 'Immediate purchase recommended' : 'No critical items',
      criticalStockItems.length > 0 ? STATUS_VARIANTS.critical : STATUS_VARIANTS.success,
      'items in critical stock band'
    ),
    createAlertItem(
      'alert-cancelled-orders',
      'Cancelled pharmacy orders',
      cancelledOrders,
      cancelledOrders > 0 ? 'Investigate cancellation reasons' : 'No cancellations',
      cancelledOrders > 0 ? STATUS_VARIANTS.warning : STATUS_VARIANTS.success,
      'orders cancelled'
    ),
    createAlertItem(
      'alert-pending-backlog',
      'Pending dispensing backlog',
      pendingDispense,
      pendingDispense > 5 ? 'Backlog building' : 'Backlog manageable',
      pendingDispense > 5 ? STATUS_VARIANTS.warning : STATUS_VARIANTS.info,
      'orders awaiting dispense'
    ),
  ];

  const activity = buildActivity(
    [
      ...pharmacyOrders.map((item) => ({
        id: `pharmacy-order-${item.id}`,
        date: readDate(item, ['ordered_at', 'created_at']),
        title: 'Pharmacy order updated',
        meta: `Status: ${normalizeStatus(item.status) || 'UNKNOWN'}`,
      })),
      ...dispenseLogs.map((item) => ({
        id: `dispense-${item.id}`,
        date: readDate(item, ['dispensed_at', 'created_at']),
        title: 'Dispense log recorded',
        meta: `Status: ${normalizeStatus(item.status) || 'UNKNOWN'}`,
      })),
    ],
    now
  );

  const hasLiveData =
    summaryCards.some((item) => toNumber(item.value) > 0) ||
    trendPoints.some((item) => item.value > 0) ||
    distributionTotal > 0 ||
    activity.length > 0;

  return {
    summaryCards,
    trend: {
      title: 'Dispensing trend over the last 7 days',
      subtitle: 'Daily completed dispensing activity.',
      points: trendPoints,
    },
    distribution: {
      title: 'Pharmacy order status mix',
      subtitle: 'Current lifecycle distribution for medication orders.',
      total: distributionTotal,
      segments: distributionSegments,
    },
    highlights,
    queue,
    alerts,
    activity,
    hasLiveData,
  };
};

const loadDashboardDatasets = async (roleProfile) => {
  const shouldFetchLab = roleProfile.id !== ROLE_IDS.PHARMACY;
  const shouldFetchPharmacy = roleProfile.id !== ROLE_IDS.LAB;

  const [
    patients,
    appointments,
    admissions,
    invoices,
    labOrders,
    labResults,
    pharmacyOrders,
    inventoryStocks,
    dispenseLogs,
  ] = await Promise.all([
    safeList(listPatients, { limit: FETCH_LIMIT }),
    safeList(listAppointments, { limit: FETCH_LIMIT }),
    safeList(listAdmissions, { limit: FETCH_LIMIT }),
    safeList(listInvoices, { limit: FETCH_LIMIT }),
    shouldFetchLab ? safeList(listLabOrders, { limit: FETCH_LIMIT }) : Promise.resolve([]),
    shouldFetchLab ? safeList(listLabResults, { limit: FETCH_LIMIT }) : Promise.resolve([]),
    shouldFetchPharmacy ? safeList(listPharmacyOrders, { limit: FETCH_LIMIT }) : Promise.resolve([]),
    shouldFetchPharmacy ? safeList(listInventoryStocks, { limit: FETCH_LIMIT }) : Promise.resolve([]),
    shouldFetchPharmacy ? safeList(listDispenseLogs, { limit: FETCH_LIMIT }) : Promise.resolve([]),
  ]);

  return {
    patients,
    appointments,
    admissions,
    invoices,
    labOrders,
    labResults,
    pharmacyOrders,
    inventoryStocks,
    dispenseLogs,
  };
};

const buildDashboardLiveData = async ({ roleProfile }) => {
  const activeRole = roleProfile || ROLE_PROFILES[ROLE_IDS.GENERAL];
  const datasets = await loadDashboardDatasets(activeRole);
  const now = new Date();

  let computed;
  if (activeRole.id === ROLE_IDS.LAB) {
    computed = buildLabDashboard(datasets, now);
  } else if (activeRole.id === ROLE_IDS.PHARMACY) {
    computed = buildPharmacyDashboard(datasets, now);
  } else {
    computed = buildGeneralDashboard(datasets, now);
  }

  return {
    roleProfile: activeRole,
    summaryCards: computed.summaryCards,
    trend: computed.trend,
    distribution: computed.distribution,
    highlights: computed.highlights,
    queue: computed.queue,
    alerts: computed.alerts,
    activity: computed.activity,
    hasLiveData: Boolean(computed.hasLiveData),
  };
};

export {
  ROLE_IDS,
  ROLE_PROFILES,
  collectUserRoleKeys,
  resolveRoleProfile,
  buildDashboardLiveData,
  createEmptyDashboardData,
};
