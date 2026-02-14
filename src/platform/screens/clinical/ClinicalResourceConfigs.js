/**
 * Clinical resource configuration shared by list/detail/form screens.
 */

const CLINICAL_RESOURCE_IDS = {
  ENCOUNTERS: 'encounters',
  CLINICAL_NOTES: 'clinical-notes',
  DIAGNOSES: 'diagnoses',
  PROCEDURES: 'procedures',
  VITAL_SIGNS: 'vital-signs',
  CARE_PLANS: 'care-plans',
  REFERRALS: 'referrals',
  FOLLOW_UPS: 'follow-ups',
  ADMISSIONS: 'admissions',
  BED_ASSIGNMENTS: 'bed-assignments',
  WARD_ROUNDS: 'ward-rounds',
  NURSING_NOTES: 'nursing-notes',
  MEDICATION_ADMINISTRATIONS: 'medication-administrations',
  DISCHARGE_SUMMARIES: 'discharge-summaries',
  TRANSFER_REQUESTS: 'transfer-requests',
  ICU_STAYS: 'icu-stays',
  ICU_OBSERVATIONS: 'icu-observations',
  CRITICAL_ALERTS: 'critical-alerts',
  THEATRE_CASES: 'theatre-cases',
  ANESTHESIA_RECORDS: 'anesthesia-records',
  POST_OP_NOTES: 'post-op-notes',
  EMERGENCY_CASES: 'emergency-cases',
  TRIAGE_ASSESSMENTS: 'triage-assessments',
  EMERGENCY_RESPONSES: 'emergency-responses',
  AMBULANCES: 'ambulances',
  AMBULANCE_DISPATCHES: 'ambulance-dispatches',
  AMBULANCE_TRIPS: 'ambulance-trips',
  LAB_TESTS: 'lab-tests',
  LAB_PANELS: 'lab-panels',
  LAB_ORDERS: 'lab-orders',
  LAB_SAMPLES: 'lab-samples',
  LAB_RESULTS: 'lab-results',
  LAB_QC_LOGS: 'lab-qc-logs',
  RADIOLOGY_TESTS: 'radiology-tests',
  RADIOLOGY_ORDERS: 'radiology-orders',
  RADIOLOGY_RESULTS: 'radiology-results',
  IMAGING_STUDIES: 'imaging-studies',
  PACS_LINKS: 'pacs-links',
  DRUGS: 'drugs',
  DRUG_BATCHES: 'drug-batches',
  FORMULARY_ITEMS: 'formulary-items',
  PHARMACY_ORDERS: 'pharmacy-orders',
  DISPENSE_LOGS: 'dispense-logs',
  ADVERSE_EVENTS: 'adverse-events',
  INVENTORY_ITEMS: 'inventory-items',
  INVENTORY_STOCKS: 'inventory-stocks',
  STOCK_MOVEMENTS: 'stock-movements',
  SUPPLIERS: 'suppliers',
  PURCHASE_ORDERS: 'purchase-orders',
  GOODS_RECEIPTS: 'goods-receipts',
  STOCK_ADJUSTMENTS: 'stock-adjustments',
};

Object.assign(CLINICAL_RESOURCE_IDS, {
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  REFUNDS: 'refunds',
  PRICING_RULES: 'pricing-rules',
  COVERAGE_PLANS: 'coverage-plans',
  INSURANCE_CLAIMS: 'insurance-claims',
  PRE_AUTHORIZATIONS: 'pre-authorizations',
  BILLING_ADJUSTMENTS: 'billing-adjustments',
  STAFF_PROFILES: 'staff-profiles',
  STAFF_ASSIGNMENTS: 'staff-assignments',
  STAFF_LEAVES: 'staff-leaves',
  SHIFTS: 'shifts',
  NURSE_ROSTERS: 'nurse-rosters',
  PAYROLL_RUNS: 'payroll-runs',
  HOUSEKEEPING_TASKS: 'housekeeping-tasks',
  HOUSEKEEPING_SCHEDULES: 'housekeeping-schedules',
  MAINTENANCE_REQUESTS: 'maintenance-requests',
  ASSETS: 'assets',
  ASSET_SERVICE_LOGS: 'asset-service-logs',
  DASHBOARD_WIDGETS: 'dashboard-widgets',
  KPI_SNAPSHOTS: 'kpi-snapshots',
  ANALYTICS_EVENTS: 'analytics-events',
  NOTIFICATIONS: 'notifications',
  NOTIFICATION_DELIVERIES: 'notification-deliveries',
  TEMPLATES: 'templates',
  TEMPLATE_VARIABLES: 'template-variables',
  SUBSCRIPTION_PLANS: 'subscription-plans',
  SUBSCRIPTIONS: 'subscriptions',
  SUBSCRIPTION_INVOICES: 'subscription-invoices',
  MODULES: 'modules',
  MODULE_SUBSCRIPTIONS: 'module-subscriptions',
  LICENSES: 'licenses',
  INTEGRATIONS: 'integrations',
  INTEGRATION_LOGS: 'integration-logs',
  WEBHOOK_SUBSCRIPTIONS: 'webhook-subscriptions',
  AUDIT_LOGS: 'audit-logs',
  PHI_ACCESS_LOGS: 'phi-access-logs',
  DATA_PROCESSING_LOGS: 'data-processing-logs',
  BREACH_NOTIFICATIONS: 'breach-notifications',
  SYSTEM_CHANGE_LOGS: 'system-change-logs',
});

const CLINICAL_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.ENCOUNTERS,
  CLINICAL_RESOURCE_IDS.CLINICAL_NOTES,
  CLINICAL_RESOURCE_IDS.DIAGNOSES,
  CLINICAL_RESOURCE_IDS.PROCEDURES,
  CLINICAL_RESOURCE_IDS.VITAL_SIGNS,
  CLINICAL_RESOURCE_IDS.CARE_PLANS,
  CLINICAL_RESOURCE_IDS.REFERRALS,
  CLINICAL_RESOURCE_IDS.FOLLOW_UPS,
];

const IPD_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.ADMISSIONS,
  CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS,
  CLINICAL_RESOURCE_IDS.WARD_ROUNDS,
  CLINICAL_RESOURCE_IDS.NURSING_NOTES,
  CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS,
  CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES,
  CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS,
];

const ICU_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.ICU_STAYS,
  CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS,
  CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS,
];

const THEATRE_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.THEATRE_CASES,
  CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS,
  CLINICAL_RESOURCE_IDS.POST_OP_NOTES,
];

const EMERGENCY_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.EMERGENCY_CASES,
  CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS,
  CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES,
  CLINICAL_RESOURCE_IDS.AMBULANCES,
  CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES,
  CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS,
];

const LAB_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.LAB_TESTS,
  CLINICAL_RESOURCE_IDS.LAB_PANELS,
  CLINICAL_RESOURCE_IDS.LAB_ORDERS,
  CLINICAL_RESOURCE_IDS.LAB_SAMPLES,
  CLINICAL_RESOURCE_IDS.LAB_RESULTS,
  CLINICAL_RESOURCE_IDS.LAB_QC_LOGS,
];

const RADIOLOGY_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS,
  CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS,
  CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS,
  CLINICAL_RESOURCE_IDS.IMAGING_STUDIES,
  CLINICAL_RESOURCE_IDS.PACS_LINKS,
];

const PHARMACY_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.DRUGS,
  CLINICAL_RESOURCE_IDS.DRUG_BATCHES,
  CLINICAL_RESOURCE_IDS.FORMULARY_ITEMS,
  CLINICAL_RESOURCE_IDS.PHARMACY_ORDERS,
  CLINICAL_RESOURCE_IDS.DISPENSE_LOGS,
  CLINICAL_RESOURCE_IDS.ADVERSE_EVENTS,
];

const INVENTORY_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.INVENTORY_ITEMS,
  CLINICAL_RESOURCE_IDS.INVENTORY_STOCKS,
  CLINICAL_RESOURCE_IDS.STOCK_MOVEMENTS,
  CLINICAL_RESOURCE_IDS.SUPPLIERS,
  CLINICAL_RESOURCE_IDS.PURCHASE_ORDERS,
  CLINICAL_RESOURCE_IDS.GOODS_RECEIPTS,
  CLINICAL_RESOURCE_IDS.STOCK_ADJUSTMENTS,
];

const BILLING_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.INVOICES,
  CLINICAL_RESOURCE_IDS.PAYMENTS,
  CLINICAL_RESOURCE_IDS.REFUNDS,
  CLINICAL_RESOURCE_IDS.PRICING_RULES,
  CLINICAL_RESOURCE_IDS.COVERAGE_PLANS,
  CLINICAL_RESOURCE_IDS.INSURANCE_CLAIMS,
  CLINICAL_RESOURCE_IDS.PRE_AUTHORIZATIONS,
  CLINICAL_RESOURCE_IDS.BILLING_ADJUSTMENTS,
];

const HR_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.STAFF_PROFILES,
  CLINICAL_RESOURCE_IDS.STAFF_ASSIGNMENTS,
  CLINICAL_RESOURCE_IDS.STAFF_LEAVES,
  CLINICAL_RESOURCE_IDS.SHIFTS,
  CLINICAL_RESOURCE_IDS.NURSE_ROSTERS,
  CLINICAL_RESOURCE_IDS.PAYROLL_RUNS,
];

const HOUSEKEEPING_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.HOUSEKEEPING_TASKS,
  CLINICAL_RESOURCE_IDS.HOUSEKEEPING_SCHEDULES,
  CLINICAL_RESOURCE_IDS.MAINTENANCE_REQUESTS,
  CLINICAL_RESOURCE_IDS.ASSETS,
  CLINICAL_RESOURCE_IDS.ASSET_SERVICE_LOGS,
];

const REPORTS_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.DASHBOARD_WIDGETS,
];

const COMMUNICATIONS_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.NOTIFICATIONS,
];

const SUBSCRIPTIONS_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.SUBSCRIPTIONS,
];

const INTEGRATIONS_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.INTEGRATIONS,
];

const COMPLIANCE_RESOURCE_LIST_ORDER = [
  CLINICAL_RESOURCE_IDS.AUDIT_LOGS,
];

const CLINICAL_ROUTE_ROOT = '/clinical';
const IPD_ROUTE_ROOT = '/ipd';
const ICU_ROUTE_ROOT = '/icu';
const THEATRE_ROUTE_ROOT = '/theatre';
const EMERGENCY_ROUTE_ROOT = '/emergency';
const LAB_ROUTE_ROOT = '/diagnostics/lab';
const RADIOLOGY_ROUTE_ROOT = '/diagnostics/radiology';
const PHARMACY_ROUTE_ROOT = '/pharmacy';
const INVENTORY_ROUTE_ROOT = '/inventory';
const BILLING_ROUTE_ROOT = '/billing';
const HR_ROUTE_ROOT = '/hr';
const HOUSEKEEPING_ROUTE_ROOT = '/housekeeping';
const REPORTS_ROUTE_ROOT = '/reports';
const COMMUNICATIONS_ROUTE_ROOT = '/communications';
const SUBSCRIPTIONS_ROUTE_ROOT = '/subscriptions';
const INTEGRATIONS_ROUTE_ROOT = '/integrations';
const COMPLIANCE_ROUTE_ROOT = '/compliance';
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const sanitizeString = (value) => (value == null ? '' : String(value).trim());

const normalizeRouteId = (value) => {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = sanitizeString(candidate);
  if (!normalized) return null;
  return /^[A-Za-z0-9._:-]+$/.test(normalized) ? normalized : null;
};

const normalizeSearchParam = (value) => {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = sanitizeString(candidate);
  return normalized || null;
};

const normalizeContextId = (value) => normalizeRouteId(value);

const toIsoDateTime = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return undefined;
  if (DATE_ONLY_REGEX.test(normalized)) {
    return `${normalized}T00:00:00.000Z`;
  }
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

const normalizeIsoDateValue = (value) => {
  const isoValue = toIsoDateTime(value);
  return isoValue || undefined;
};

const withClinicalContext = (path, context = {}) => {
  const searchParams = new URLSearchParams();
  const tenantId = normalizeContextId(context.tenantId);
  const facilityId = normalizeContextId(context.facilityId);
  const patientId = normalizeContextId(context.patientId);
  const providerUserId = normalizeContextId(context.providerUserId);
  const encounterId = normalizeContextId(context.encounterId);
  const authorUserId = normalizeContextId(context.authorUserId);
  const fromDepartmentId = normalizeContextId(context.fromDepartmentId);
  const toDepartmentId = normalizeContextId(context.toDepartmentId);
  const encounterType = sanitizeString(context.encounterType);
  const status = sanitizeString(context.status);
  const diagnosisType = sanitizeString(context.diagnosisType);
  const code = sanitizeString(context.code);
  const vitalType = sanitizeString(context.vitalType);
  const startDate = normalizeIsoDateValue(context.startDate);
  const endDate = normalizeIsoDateValue(context.endDate);
  const admissionId = normalizeContextId(context.admissionId);
  const bedId = normalizeContextId(context.bedId);
  const nurseUserId = normalizeContextId(context.nurseUserId);
  const prescriptionId = normalizeContextId(context.prescriptionId);
  const fromWardId = normalizeContextId(context.fromWardId);
  const toWardId = normalizeContextId(context.toWardId);
  const icuStayId = normalizeContextId(context.icuStayId);
  const theatreCaseId = normalizeContextId(context.theatreCaseId);
  const anesthetistUserId = normalizeContextId(context.anesthetistUserId);
  const emergencyCaseId = normalizeContextId(context.emergencyCaseId);
  const ambulanceId = normalizeContextId(context.ambulanceId);
  const labTestId = normalizeContextId(context.labTestId);
  const labPanelId = normalizeContextId(context.labPanelId);
  const labOrderId = normalizeContextId(context.labOrderId);
  const labOrderItemId = normalizeContextId(context.labOrderItemId);
  const radiologyTestId = normalizeContextId(context.radiologyTestId);
  const radiologyOrderId = normalizeContextId(context.radiologyOrderId);
  const imagingStudyId = normalizeContextId(context.imagingStudyId);
  const drugId = normalizeContextId(context.drugId);
  const pharmacyOrderId = normalizeContextId(context.pharmacyOrderId);
  const pharmacyOrderItemId = normalizeContextId(context.pharmacyOrderItemId);
  const inventoryItemId = normalizeContextId(context.inventoryItemId);
  const supplierId = normalizeContextId(context.supplierId);
  const purchaseRequestId = normalizeContextId(context.purchaseRequestId);
  const purchaseOrderId = normalizeContextId(context.purchaseOrderId);
  const requestedByUserId = normalizeContextId(context.requestedByUserId);
  const invoiceId = normalizeContextId(context.invoiceId);
  const paymentId = normalizeContextId(context.paymentId);
  const coveragePlanId = normalizeContextId(context.coveragePlanId);
  const staffProfileId = normalizeContextId(context.staffProfileId);
  const departmentId = normalizeContextId(context.departmentId);
  const unitId = normalizeContextId(context.unitId);
  const roomId = normalizeContextId(context.roomId);
  const assetId = normalizeContextId(context.assetId);
  const userId = normalizeContextId(context.userId);
  const integrationId = normalizeContextId(context.integrationId);
  const notificationId = normalizeContextId(context.notificationId);
  const templateId = normalizeContextId(context.templateId);
  const severity = sanitizeString(context.severity);
  const triageLevel = sanitizeString(context.triageLevel);
  const modality = sanitizeString(context.modality);
  const route = sanitizeString(context.route);
  const billingStatus = sanitizeString(context.billingStatus);
  const method = sanitizeString(context.method);
  const shiftType = sanitizeString(context.shiftType);
  const frequency = sanitizeString(context.frequency);
  const form = sanitizeString(context.form);
  const strength = sanitizeString(context.strength);
  const batchNumber = sanitizeString(context.batchNumber);
  const category = sanitizeString(context.category);
  const sku = sanitizeString(context.sku);
  const unit = sanitizeString(context.unit);
  const contactEmail = sanitizeString(context.contactEmail);
  const movementType = sanitizeString(context.movementType);
  const reason = sanitizeString(context.reason);
  const minQuantity = sanitizeString(context.minQuantity);
  const maxQuantity = sanitizeString(context.maxQuantity);
  const search = sanitizeString(context.search);
  const expired = context.expired;
  const belowReorder = context.belowReorder;
  const orderedAtFrom = normalizeIsoDateValue(context.orderedAtFrom);
  const orderedAtTo = normalizeIsoDateValue(context.orderedAtTo);
  const dispensedAtFrom = normalizeIsoDateValue(context.dispensedAtFrom);
  const dispensedAtTo = normalizeIsoDateValue(context.dispensedAtTo);
  const reportedAtFrom = normalizeIsoDateValue(context.reportedAtFrom);
  const reportedAtTo = normalizeIsoDateValue(context.reportedAtTo);
  const fromDate = normalizeIsoDateValue(context.fromDate);
  const toDate = normalizeIsoDateValue(context.toDate);
  const performedAt = normalizeIsoDateValue(context.performedAt);
  const expiresAt = normalizeIsoDateValue(context.expiresAt);
  const startedAtFrom = normalizeIsoDateValue(context.startedAtFrom);
  const startedAtTo = normalizeIsoDateValue(context.startedAtTo);
  const endedAtFrom = normalizeIsoDateValue(context.endedAtFrom);
  const endedAtTo = normalizeIsoDateValue(context.endedAtTo);
  const observedAtFrom = normalizeIsoDateValue(context.observedAtFrom);
  const observedAtTo = normalizeIsoDateValue(context.observedAtTo);
  const scheduledFrom = normalizeIsoDateValue(context.scheduledFrom);
  const scheduledTo = normalizeIsoDateValue(context.scheduledTo);
  const paidAtFrom = normalizeIsoDateValue(context.paidAtFrom);
  const paidAtTo = normalizeIsoDateValue(context.paidAtTo);
  const refundedAtFrom = normalizeIsoDateValue(context.refundedAtFrom);
  const refundedAtTo = normalizeIsoDateValue(context.refundedAtTo);
  const submittedAtFrom = normalizeIsoDateValue(context.submittedAtFrom);
  const submittedAtTo = normalizeIsoDateValue(context.submittedAtTo);
  const requestedAtFrom = normalizeIsoDateValue(context.requestedAtFrom);
  const requestedAtTo = normalizeIsoDateValue(context.requestedAtTo);
  const approvedAtFrom = normalizeIsoDateValue(context.approvedAtFrom);
  const approvedAtTo = normalizeIsoDateValue(context.approvedAtTo);
  const startTimeFrom = normalizeIsoDateValue(context.startTimeFrom);
  const startTimeTo = normalizeIsoDateValue(context.startTimeTo);
  const endTimeFrom = normalizeIsoDateValue(context.endTimeFrom);
  const endTimeTo = normalizeIsoDateValue(context.endTimeTo);
  const periodStartFrom = normalizeIsoDateValue(context.periodStartFrom);
  const periodStartTo = normalizeIsoDateValue(context.periodStartTo);
  const periodEndFrom = normalizeIsoDateValue(context.periodEndFrom);
  const periodEndTo = normalizeIsoDateValue(context.periodEndTo);
  const isActive = context.isActive;

  if (tenantId) searchParams.set('tenantId', tenantId);
  if (facilityId) searchParams.set('facilityId', facilityId);
  if (patientId) searchParams.set('patientId', patientId);
  if (providerUserId) searchParams.set('providerUserId', providerUserId);
  if (encounterId) searchParams.set('encounterId', encounterId);
  if (authorUserId) searchParams.set('authorUserId', authorUserId);
  if (fromDepartmentId) searchParams.set('fromDepartmentId', fromDepartmentId);
  if (toDepartmentId) searchParams.set('toDepartmentId', toDepartmentId);
  if (encounterType) searchParams.set('encounterType', encounterType);
  if (status) searchParams.set('status', status);
  if (diagnosisType) searchParams.set('diagnosisType', diagnosisType);
  if (code) searchParams.set('code', code);
  if (vitalType) searchParams.set('vitalType', vitalType);
  if (startDate) searchParams.set('startDate', startDate);
  if (endDate) searchParams.set('endDate', endDate);
  if (admissionId) searchParams.set('admissionId', admissionId);
  if (bedId) searchParams.set('bedId', bedId);
  if (nurseUserId) searchParams.set('nurseUserId', nurseUserId);
  if (prescriptionId) searchParams.set('prescriptionId', prescriptionId);
  if (fromWardId) searchParams.set('fromWardId', fromWardId);
  if (toWardId) searchParams.set('toWardId', toWardId);
  if (icuStayId) searchParams.set('icuStayId', icuStayId);
  if (theatreCaseId) searchParams.set('theatreCaseId', theatreCaseId);
  if (anesthetistUserId) searchParams.set('anesthetistUserId', anesthetistUserId);
  if (emergencyCaseId) searchParams.set('emergencyCaseId', emergencyCaseId);
  if (ambulanceId) searchParams.set('ambulanceId', ambulanceId);
  if (labTestId) searchParams.set('labTestId', labTestId);
  if (labPanelId) searchParams.set('labPanelId', labPanelId);
  if (labOrderId) searchParams.set('labOrderId', labOrderId);
  if (labOrderItemId) searchParams.set('labOrderItemId', labOrderItemId);
  if (radiologyTestId) searchParams.set('radiologyTestId', radiologyTestId);
  if (radiologyOrderId) searchParams.set('radiologyOrderId', radiologyOrderId);
  if (imagingStudyId) searchParams.set('imagingStudyId', imagingStudyId);
  if (drugId) searchParams.set('drugId', drugId);
  if (pharmacyOrderId) searchParams.set('pharmacyOrderId', pharmacyOrderId);
  if (pharmacyOrderItemId) searchParams.set('pharmacyOrderItemId', pharmacyOrderItemId);
  if (inventoryItemId) searchParams.set('inventoryItemId', inventoryItemId);
  if (supplierId) searchParams.set('supplierId', supplierId);
  if (purchaseRequestId) searchParams.set('purchaseRequestId', purchaseRequestId);
  if (purchaseOrderId) searchParams.set('purchaseOrderId', purchaseOrderId);
  if (requestedByUserId) searchParams.set('requestedByUserId', requestedByUserId);
  if (invoiceId) searchParams.set('invoiceId', invoiceId);
  if (paymentId) searchParams.set('paymentId', paymentId);
  if (coveragePlanId) searchParams.set('coveragePlanId', coveragePlanId);
  if (staffProfileId) searchParams.set('staffProfileId', staffProfileId);
  if (departmentId) searchParams.set('departmentId', departmentId);
  if (unitId) searchParams.set('unitId', unitId);
  if (roomId) searchParams.set('roomId', roomId);
  if (assetId) searchParams.set('assetId', assetId);
  if (userId) searchParams.set('userId', userId);
  if (integrationId) searchParams.set('integrationId', integrationId);
  if (notificationId) searchParams.set('notificationId', notificationId);
  if (templateId) searchParams.set('templateId', templateId);
  if (severity) searchParams.set('severity', severity);
  if (triageLevel) searchParams.set('triageLevel', triageLevel);
  if (modality) searchParams.set('modality', modality);
  if (route) searchParams.set('route', route);
  if (billingStatus) searchParams.set('billingStatus', billingStatus);
  if (method) searchParams.set('method', method);
  if (shiftType) searchParams.set('shiftType', shiftType);
  if (frequency) searchParams.set('frequency', frequency);
  if (form) searchParams.set('form', form);
  if (strength) searchParams.set('strength', strength);
  if (batchNumber) searchParams.set('batchNumber', batchNumber);
  if (category) searchParams.set('category', category);
  if (sku) searchParams.set('sku', sku);
  if (unit) searchParams.set('unit', unit);
  if (contactEmail) searchParams.set('contactEmail', contactEmail);
  if (movementType) searchParams.set('movementType', movementType);
  if (reason) searchParams.set('reason', reason);
  if (minQuantity) searchParams.set('minQuantity', minQuantity);
  if (maxQuantity) searchParams.set('maxQuantity', maxQuantity);
  if (search) searchParams.set('search', search);
  if (typeof expired === 'boolean') {
    searchParams.set('expired', expired ? 'true' : 'false');
  }
  if (sanitizeString(expired) === 'true' || sanitizeString(expired) === 'false') {
    searchParams.set('expired', sanitizeString(expired));
  }
  if (typeof belowReorder === 'boolean') {
    searchParams.set('belowReorder', belowReorder ? 'true' : 'false');
  }
  if (sanitizeString(belowReorder) === 'true' || sanitizeString(belowReorder) === 'false') {
    searchParams.set('belowReorder', sanitizeString(belowReorder));
  }
  if (orderedAtFrom) searchParams.set('orderedAtFrom', orderedAtFrom);
  if (orderedAtTo) searchParams.set('orderedAtTo', orderedAtTo);
  if (dispensedAtFrom) searchParams.set('dispensedAtFrom', dispensedAtFrom);
  if (dispensedAtTo) searchParams.set('dispensedAtTo', dispensedAtTo);
  if (reportedAtFrom) searchParams.set('reportedAtFrom', reportedAtFrom);
  if (reportedAtTo) searchParams.set('reportedAtTo', reportedAtTo);
  if (fromDate) searchParams.set('fromDate', fromDate);
  if (toDate) searchParams.set('toDate', toDate);
  if (performedAt) searchParams.set('performedAt', performedAt);
  if (expiresAt) searchParams.set('expiresAt', expiresAt);
  if (startedAtFrom) searchParams.set('startedAtFrom', startedAtFrom);
  if (startedAtTo) searchParams.set('startedAtTo', startedAtTo);
  if (endedAtFrom) searchParams.set('endedAtFrom', endedAtFrom);
  if (endedAtTo) searchParams.set('endedAtTo', endedAtTo);
  if (observedAtFrom) searchParams.set('observedAtFrom', observedAtFrom);
  if (observedAtTo) searchParams.set('observedAtTo', observedAtTo);
  if (scheduledFrom) searchParams.set('scheduledFrom', scheduledFrom);
  if (scheduledTo) searchParams.set('scheduledTo', scheduledTo);
  if (paidAtFrom) searchParams.set('paidAtFrom', paidAtFrom);
  if (paidAtTo) searchParams.set('paidAtTo', paidAtTo);
  if (refundedAtFrom) searchParams.set('refundedAtFrom', refundedAtFrom);
  if (refundedAtTo) searchParams.set('refundedAtTo', refundedAtTo);
  if (submittedAtFrom) searchParams.set('submittedAtFrom', submittedAtFrom);
  if (submittedAtTo) searchParams.set('submittedAtTo', submittedAtTo);
  if (requestedAtFrom) searchParams.set('requestedAtFrom', requestedAtFrom);
  if (requestedAtTo) searchParams.set('requestedAtTo', requestedAtTo);
  if (approvedAtFrom) searchParams.set('approvedAtFrom', approvedAtFrom);
  if (approvedAtTo) searchParams.set('approvedAtTo', approvedAtTo);
  if (startTimeFrom) searchParams.set('startTimeFrom', startTimeFrom);
  if (startTimeTo) searchParams.set('startTimeTo', startTimeTo);
  if (endTimeFrom) searchParams.set('endTimeFrom', endTimeFrom);
  if (endTimeTo) searchParams.set('endTimeTo', endTimeTo);
  if (periodStartFrom) searchParams.set('periodStartFrom', periodStartFrom);
  if (periodStartTo) searchParams.set('periodStartTo', periodStartTo);
  if (periodEndFrom) searchParams.set('periodEndFrom', periodEndFrom);
  if (periodEndTo) searchParams.set('periodEndTo', periodEndTo);
  if (typeof isActive === 'boolean') {
    searchParams.set('isActive', isActive ? 'true' : 'false');
  }
  if (sanitizeString(isActive) === 'true' || sanitizeString(isActive) === 'false') {
    searchParams.set('isActive', sanitizeString(isActive));
  }

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
};

const ENCOUNTER_TYPE_OPTIONS = [
  { value: 'OPD', labelKey: 'clinical.options.encounterType.opd' },
  { value: 'IPD', labelKey: 'clinical.options.encounterType.ipd' },
  { value: 'ICU', labelKey: 'clinical.options.encounterType.icu' },
  { value: 'THEATRE', labelKey: 'clinical.options.encounterType.theatre' },
  { value: 'EMERGENCY', labelKey: 'clinical.options.encounterType.emergency' },
  { value: 'TELEMEDICINE', labelKey: 'clinical.options.encounterType.telemedicine' },
];

const ENCOUNTER_STATUS_OPTIONS = [
  { value: 'OPEN', labelKey: 'clinical.options.encounterStatus.open' },
  { value: 'CLOSED', labelKey: 'clinical.options.encounterStatus.closed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.encounterStatus.cancelled' },
];

const DIAGNOSIS_TYPE_OPTIONS = [
  { value: 'PRIMARY', labelKey: 'clinical.options.diagnosisType.primary' },
  { value: 'SECONDARY', labelKey: 'clinical.options.diagnosisType.secondary' },
  { value: 'DIFFERENTIAL', labelKey: 'clinical.options.diagnosisType.differential' },
];

const VITAL_TYPE_OPTIONS = [
  { value: 'TEMPERATURE', labelKey: 'clinical.options.vitalType.temperature' },
  { value: 'BLOOD_PRESSURE', labelKey: 'clinical.options.vitalType.bloodPressure' },
  { value: 'HEART_RATE', labelKey: 'clinical.options.vitalType.heartRate' },
  { value: 'RESPIRATORY_RATE', labelKey: 'clinical.options.vitalType.respiratoryRate' },
  { value: 'OXYGEN_SATURATION', labelKey: 'clinical.options.vitalType.oxygenSaturation' },
  { value: 'WEIGHT', labelKey: 'clinical.options.vitalType.weight' },
  { value: 'HEIGHT', labelKey: 'clinical.options.vitalType.height' },
  { value: 'BMI', labelKey: 'clinical.options.vitalType.bmi' },
];

const REFERRAL_CREATE_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.referralStatus.pending' },
  { value: 'APPROVED', labelKey: 'clinical.options.referralStatus.approved' },
  { value: 'REJECTED', labelKey: 'clinical.options.referralStatus.rejected' },
  { value: 'COMPLETED', labelKey: 'clinical.options.referralStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.referralStatus.cancelled' },
];

const REFERRAL_UPDATE_STATUS_OPTIONS = [
  { value: 'REQUESTED', labelKey: 'clinical.options.referralStatus.requested' },
  { value: 'APPROVED', labelKey: 'clinical.options.referralStatus.approved' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.referralStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.referralStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.referralStatus.cancelled' },
];

const ADMISSION_STATUS_OPTIONS = [
  { value: 'ADMITTED', labelKey: 'clinical.options.admissionStatus.admitted' },
  { value: 'DISCHARGED', labelKey: 'clinical.options.admissionStatus.discharged' },
  { value: 'TRANSFERRED', labelKey: 'clinical.options.admissionStatus.transferred' },
  { value: 'CANCELLED', labelKey: 'clinical.options.admissionStatus.cancelled' },
];

const DISCHARGE_STATUS_OPTIONS = [
  { value: 'PLANNED', labelKey: 'clinical.options.dischargeStatus.planned' },
  { value: 'COMPLETED', labelKey: 'clinical.options.dischargeStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.dischargeStatus.cancelled' },
];

const TRANSFER_STATUS_OPTIONS = [
  { value: 'REQUESTED', labelKey: 'clinical.options.transferStatus.requested' },
  { value: 'APPROVED', labelKey: 'clinical.options.transferStatus.approved' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.transferStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.transferStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.transferStatus.cancelled' },
];

const MEDICATION_ROUTE_OPTIONS = [
  { value: 'ORAL', labelKey: 'clinical.options.medicationRoute.oral' },
  { value: 'IV', labelKey: 'clinical.options.medicationRoute.iv' },
  { value: 'IM', labelKey: 'clinical.options.medicationRoute.im' },
  { value: 'SC', labelKey: 'clinical.options.medicationRoute.sc' },
  { value: 'TOPICAL', labelKey: 'clinical.options.medicationRoute.topical' },
  { value: 'INHALATION', labelKey: 'clinical.options.medicationRoute.inhalation' },
  { value: 'RECTAL', labelKey: 'clinical.options.medicationRoute.rectal' },
  { value: 'OTHER', labelKey: 'clinical.options.medicationRoute.other' },
];

const CRITICAL_ALERT_SEVERITY_OPTIONS = [
  { value: 'LOW', labelKey: 'clinical.options.criticalAlertSeverity.low' },
  { value: 'MEDIUM', labelKey: 'clinical.options.criticalAlertSeverity.medium' },
  { value: 'HIGH', labelKey: 'clinical.options.criticalAlertSeverity.high' },
  { value: 'CRITICAL', labelKey: 'clinical.options.criticalAlertSeverity.critical' },
];

const THEATRE_CASE_STATUS_OPTIONS = [
  { value: 'SCHEDULED', labelKey: 'clinical.options.theatreCaseStatus.scheduled' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.theatreCaseStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.theatreCaseStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.theatreCaseStatus.cancelled' },
];

const EMERGENCY_CASE_SEVERITY_OPTIONS = [
  { value: 'LOW', labelKey: 'clinical.options.emergencySeverity.low' },
  { value: 'MEDIUM', labelKey: 'clinical.options.emergencySeverity.medium' },
  { value: 'HIGH', labelKey: 'clinical.options.emergencySeverity.high' },
  { value: 'CRITICAL', labelKey: 'clinical.options.emergencySeverity.critical' },
];

const EMERGENCY_CASE_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.emergencyStatus.pending' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.emergencyStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.emergencyStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.emergencyStatus.cancelled' },
];

const TRIAGE_LEVEL_OPTIONS = [
  { value: 'IMMEDIATE', labelKey: 'clinical.options.triageLevel.immediate' },
  { value: 'URGENT', labelKey: 'clinical.options.triageLevel.urgent' },
  { value: 'LESS_URGENT', labelKey: 'clinical.options.triageLevel.lessUrgent' },
  { value: 'NON_URGENT', labelKey: 'clinical.options.triageLevel.nonUrgent' },
];

const AMBULANCE_STATUS_OPTIONS = [
  { value: 'AVAILABLE', labelKey: 'clinical.options.ambulanceStatus.available' },
  { value: 'DISPATCHED', labelKey: 'clinical.options.ambulanceStatus.dispatched' },
  { value: 'EN_ROUTE', labelKey: 'clinical.options.ambulanceStatus.enRoute' },
  { value: 'ON_SCENE', labelKey: 'clinical.options.ambulanceStatus.onScene' },
  { value: 'TRANSPORTING', labelKey: 'clinical.options.ambulanceStatus.transporting' },
  { value: 'OUT_OF_SERVICE', labelKey: 'clinical.options.ambulanceStatus.outOfService' },
];

const LAB_ORDER_STATUS_OPTIONS = [
  { value: 'ORDERED', labelKey: 'clinical.options.labOrderStatus.ordered' },
  { value: 'COLLECTED', labelKey: 'clinical.options.labOrderStatus.collected' },
  { value: 'IN_PROCESS', labelKey: 'clinical.options.labOrderStatus.inProcess' },
  { value: 'COMPLETED', labelKey: 'clinical.options.labOrderStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.labOrderStatus.cancelled' },
];

const LAB_SAMPLE_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.labSampleStatus.pending' },
  { value: 'COLLECTED', labelKey: 'clinical.options.labSampleStatus.collected' },
  { value: 'REJECTED', labelKey: 'clinical.options.labSampleStatus.rejected' },
  { value: 'RECEIVED', labelKey: 'clinical.options.labSampleStatus.received' },
];

const LAB_RESULT_STATUS_OPTIONS = [
  { value: 'NORMAL', labelKey: 'clinical.options.labResultStatus.normal' },
  { value: 'ABNORMAL', labelKey: 'clinical.options.labResultStatus.abnormal' },
  { value: 'CRITICAL', labelKey: 'clinical.options.labResultStatus.critical' },
  { value: 'PENDING', labelKey: 'clinical.options.labResultStatus.pending' },
];

const RADIOLOGY_MODALITY_OPTIONS = [
  { value: 'XRAY', labelKey: 'clinical.options.radiologyModality.xray' },
  { value: 'CT', labelKey: 'clinical.options.radiologyModality.ct' },
  { value: 'MRI', labelKey: 'clinical.options.radiologyModality.mri' },
  { value: 'ULTRASOUND', labelKey: 'clinical.options.radiologyModality.ultrasound' },
  { value: 'PET', labelKey: 'clinical.options.radiologyModality.pet' },
  { value: 'OTHER', labelKey: 'clinical.options.radiologyModality.other' },
];

const RADIOLOGY_ORDER_STATUS_OPTIONS = [
  { value: 'ORDERED', labelKey: 'clinical.options.radiologyOrderStatus.ordered' },
  { value: 'IN_PROCESS', labelKey: 'clinical.options.radiologyOrderStatus.inProcess' },
  { value: 'COMPLETED', labelKey: 'clinical.options.radiologyOrderStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.radiologyOrderStatus.cancelled' },
];

const RADIOLOGY_RESULT_STATUS_OPTIONS = [
  { value: 'DRAFT', labelKey: 'clinical.options.radiologyResultStatus.draft' },
  { value: 'FINAL', labelKey: 'clinical.options.radiologyResultStatus.final' },
  { value: 'AMENDED', labelKey: 'clinical.options.radiologyResultStatus.amended' },
];

const PHARMACY_ORDER_STATUS_OPTIONS = [
  { value: 'ORDERED', labelKey: 'clinical.options.pharmacyOrderStatus.ordered' },
  { value: 'DISPENSED', labelKey: 'clinical.options.pharmacyOrderStatus.dispensed' },
  { value: 'PARTIALLY_DISPENSED', labelKey: 'clinical.options.pharmacyOrderStatus.partiallyDispensed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.pharmacyOrderStatus.cancelled' },
];

const DISPENSE_LOG_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.dispenseLogStatus.pending' },
  { value: 'DISPENSED', labelKey: 'clinical.options.dispenseLogStatus.dispensed' },
  { value: 'RETURNED', labelKey: 'clinical.options.dispenseLogStatus.returned' },
  { value: 'CANCELLED', labelKey: 'clinical.options.dispenseLogStatus.cancelled' },
];

const ADVERSE_EVENT_SEVERITY_OPTIONS = [
  { value: 'MILD', labelKey: 'clinical.options.adverseEventSeverity.mild' },
  { value: 'MODERATE', labelKey: 'clinical.options.adverseEventSeverity.moderate' },
  { value: 'SEVERE', labelKey: 'clinical.options.adverseEventSeverity.severe' },
];

const INVENTORY_CATEGORY_OPTIONS = [
  { value: 'MEDICATION', labelKey: 'clinical.options.inventoryCategory.medication' },
  { value: 'SUPPLY', labelKey: 'clinical.options.inventoryCategory.supply' },
  { value: 'EQUIPMENT', labelKey: 'clinical.options.inventoryCategory.equipment' },
  { value: 'OTHER', labelKey: 'clinical.options.inventoryCategory.other' },
];

const STOCK_MOVEMENT_TYPE_OPTIONS = [
  { value: 'INBOUND', labelKey: 'clinical.options.stockMovementType.inbound' },
  { value: 'OUTBOUND', labelKey: 'clinical.options.stockMovementType.outbound' },
  { value: 'ADJUSTMENT', labelKey: 'clinical.options.stockMovementType.adjustment' },
  { value: 'TRANSFER', labelKey: 'clinical.options.stockMovementType.transfer' },
];

const STOCK_MOVEMENT_REASON_OPTIONS = [
  { value: 'PURCHASE', labelKey: 'clinical.options.stockMovementReason.purchase' },
  { value: 'DISPENSE', labelKey: 'clinical.options.stockMovementReason.dispense' },
  { value: 'RETURN', labelKey: 'clinical.options.stockMovementReason.return' },
  { value: 'DAMAGE', labelKey: 'clinical.options.stockMovementReason.damage' },
  { value: 'EXPIRY', labelKey: 'clinical.options.stockMovementReason.expiry' },
  { value: 'OTHER', labelKey: 'clinical.options.stockMovementReason.other' },
];

const STOCK_ADJUSTMENT_REASON_OPTIONS = [
  { value: 'DAMAGED', labelKey: 'clinical.options.stockAdjustmentReason.damaged' },
  { value: 'EXPIRED', labelKey: 'clinical.options.stockAdjustmentReason.expired' },
  { value: 'LOST', labelKey: 'clinical.options.stockAdjustmentReason.lost' },
  { value: 'FOUND', labelKey: 'clinical.options.stockAdjustmentReason.found' },
  { value: 'CORRECTION', labelKey: 'clinical.options.stockAdjustmentReason.correction' },
  { value: 'OTHER', labelKey: 'clinical.options.stockAdjustmentReason.other' },
];

const INVOICE_STATUS_OPTIONS = [
  { value: 'DRAFT', labelKey: 'clinical.options.invoiceStatus.draft' },
  { value: 'SENT', labelKey: 'clinical.options.invoiceStatus.sent' },
  { value: 'PAID', labelKey: 'clinical.options.invoiceStatus.paid' },
  { value: 'OVERDUE', labelKey: 'clinical.options.invoiceStatus.overdue' },
  { value: 'CANCELLED', labelKey: 'clinical.options.invoiceStatus.cancelled' },
];

const BILLING_STATUS_OPTIONS = [
  { value: 'DRAFT', labelKey: 'clinical.options.billingStatus.draft' },
  { value: 'ISSUED', labelKey: 'clinical.options.billingStatus.issued' },
  { value: 'PAID', labelKey: 'clinical.options.billingStatus.paid' },
  { value: 'PARTIAL', labelKey: 'clinical.options.billingStatus.partial' },
  { value: 'CANCELLED', labelKey: 'clinical.options.billingStatus.cancelled' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.paymentStatus.pending' },
  { value: 'COMPLETED', labelKey: 'clinical.options.paymentStatus.completed' },
  { value: 'FAILED', labelKey: 'clinical.options.paymentStatus.failed' },
  { value: 'REFUNDED', labelKey: 'clinical.options.paymentStatus.refunded' },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: 'CASH', labelKey: 'clinical.options.paymentMethod.cash' },
  { value: 'CREDIT_CARD', labelKey: 'clinical.options.paymentMethod.creditCard' },
  { value: 'DEBIT_CARD', labelKey: 'clinical.options.paymentMethod.debitCard' },
  { value: 'PREPAID_CARD', labelKey: 'clinical.options.paymentMethod.prepaidCard' },
  { value: 'GIFT_CARD', labelKey: 'clinical.options.paymentMethod.giftCard' },
  { value: 'VOUCHER', labelKey: 'clinical.options.paymentMethod.voucher' },
  { value: 'BANK_CHECK', labelKey: 'clinical.options.paymentMethod.bankCheck' },
  { value: 'MOBILE_MONEY', labelKey: 'clinical.options.paymentMethod.mobileMoney' },
  { value: 'BANK_TRANSFER', labelKey: 'clinical.options.paymentMethod.bankTransfer' },
  { value: 'INSURANCE', labelKey: 'clinical.options.paymentMethod.insurance' },
  { value: 'OTHER', labelKey: 'clinical.options.paymentMethod.other' },
];

const INSURANCE_CLAIM_STATUS_OPTIONS = [
  { value: 'SUBMITTED', labelKey: 'clinical.options.insuranceClaimStatus.submitted' },
  { value: 'APPROVED', labelKey: 'clinical.options.insuranceClaimStatus.approved' },
  { value: 'REJECTED', labelKey: 'clinical.options.insuranceClaimStatus.rejected' },
  { value: 'PAID', labelKey: 'clinical.options.insuranceClaimStatus.paid' },
  { value: 'CANCELLED', labelKey: 'clinical.options.insuranceClaimStatus.cancelled' },
];

const PRE_AUTHORIZATION_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.preAuthorizationStatus.pending' },
  { value: 'APPROVED', labelKey: 'clinical.options.preAuthorizationStatus.approved' },
  { value: 'DENIED', labelKey: 'clinical.options.preAuthorizationStatus.denied' },
  { value: 'EXPIRED', labelKey: 'clinical.options.preAuthorizationStatus.expired' },
];

const STAFF_LEAVE_STATUS_OPTIONS = [
  { value: 'REQUESTED', labelKey: 'clinical.options.staffLeaveStatus.requested' },
  { value: 'APPROVED', labelKey: 'clinical.options.staffLeaveStatus.approved' },
  { value: 'REJECTED', labelKey: 'clinical.options.staffLeaveStatus.rejected' },
  { value: 'CANCELLED', labelKey: 'clinical.options.staffLeaveStatus.cancelled' },
];

const SHIFT_TYPE_OPTIONS = [
  { value: 'DAY', labelKey: 'clinical.options.shiftType.day' },
  { value: 'NIGHT', labelKey: 'clinical.options.shiftType.night' },
  { value: 'SWING', labelKey: 'clinical.options.shiftType.swing' },
  { value: 'ON_CALL', labelKey: 'clinical.options.shiftType.onCall' },
];

const SHIFT_STATUS_OPTIONS = [
  { value: 'SCHEDULED', labelKey: 'clinical.options.shiftStatus.scheduled' },
  { value: 'COMPLETED', labelKey: 'clinical.options.shiftStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.shiftStatus.cancelled' },
];

const NURSE_ROSTER_STATUS_OPTIONS = [
  { value: 'DRAFT', labelKey: 'clinical.options.nurseRosterStatus.draft' },
  { value: 'PUBLISHED', labelKey: 'clinical.options.nurseRosterStatus.published' },
];

const PAYROLL_RUN_STATUS_OPTIONS = [
  { value: 'DRAFT', labelKey: 'clinical.options.payrollRunStatus.draft' },
  { value: 'PROCESSED', labelKey: 'clinical.options.payrollRunStatus.processed' },
  { value: 'PAID', labelKey: 'clinical.options.payrollRunStatus.paid' },
  { value: 'CANCELLED', labelKey: 'clinical.options.payrollRunStatus.cancelled' },
];

const HOUSEKEEPING_TASK_STATUS_OPTIONS = [
  { value: 'PENDING', labelKey: 'clinical.options.housekeepingTaskStatus.pending' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.housekeepingTaskStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.housekeepingTaskStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.housekeepingTaskStatus.cancelled' },
];

const MAINTENANCE_STATUS_OPTIONS = [
  { value: 'OPEN', labelKey: 'clinical.options.maintenanceStatus.open' },
  { value: 'IN_PROGRESS', labelKey: 'clinical.options.maintenanceStatus.inProgress' },
  { value: 'COMPLETED', labelKey: 'clinical.options.maintenanceStatus.completed' },
  { value: 'CANCELLED', labelKey: 'clinical.options.maintenanceStatus.cancelled' },
];

const parseOptionalInteger = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return undefined;
  if (!/^-?\d+$/.test(normalized)) return undefined;
  return Number.parseInt(normalized, 10);
};

const parseRequiredInteger = (value, fallback = 0) => {
  const parsed = parseOptionalInteger(value);
  return Number.isInteger(parsed) ? parsed : fallback;
};

const buildIntegerError = (value, t, { min = null, required = false } = {}) => {
  const normalized = sanitizeString(value);
  if (!normalized) {
    return required ? t('clinical.common.form.requiredField') : null;
  }

  if (!/^-?\d+$/.test(normalized)) {
    return t('forms.validation.invalidValue');
  }

  const parsed = Number.parseInt(normalized, 10);
  if (min != null && parsed < min) {
    return t('forms.validation.invalidValue');
  }

  return null;
};

const DECIMAL_PATTERN = /^-?\d+(\.\d+)?$/;

const buildDecimalError = (value, t, { required = false } = {}) => {
  const normalized = sanitizeString(value);
  if (!normalized) {
    return required ? t('clinical.common.form.requiredField') : null;
  }
  return DECIMAL_PATTERN.test(normalized) ? null : t('forms.validation.invalidValue');
};

const buildEmailError = (value, t) => {
  const normalized = sanitizeString(value);
  if (!normalized) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    ? null
    : t('forms.validation.invalidEmail');
};

const buildDateTimeError = (value, t) => {
  if (!sanitizeString(value)) return null;
  if (toIsoDateTime(value)) return null;
  return t('clinical.common.form.dateTimeFormat');
};

const buildUrlError = (value, t) => {
  const normalized = sanitizeString(value);
  if (!normalized) return null;
  if (typeof URL === 'function') {
    try {
      const parsed = new URL(normalized);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
        ? null
        : t('forms.validation.invalidUrl');
    } catch {
      return t('forms.validation.invalidUrl');
    }
  }
  return /^https?:\/\/\S+$/i.test(normalized) ? null : t('forms.validation.invalidUrl');
};

const validateDateOrder = (startValue, endValue, t, { allowEqual = false } = {}) => {
  const startIso = toIsoDateTime(startValue);
  const endIso = toIsoDateTime(endValue);
  if (!startIso || !endIso) return null;
  const startTime = new Date(startIso).getTime();
  const endTime = new Date(endIso).getTime();
  if (allowEqual ? startTime <= endTime : startTime < endTime) return null;
  return allowEqual
    ? t('clinical.common.form.endOnOrAfterStart')
    : t('clinical.common.form.endAfterStart');
};

const getContextFilters = (resourceId, context) => {
  const tenantId = normalizeContextId(context?.tenantId);
  const facilityId = normalizeContextId(context?.facilityId);
  const patientId = normalizeContextId(context?.patientId);
  const providerUserId = normalizeContextId(context?.providerUserId);
  const encounterId = normalizeContextId(context?.encounterId);
  const authorUserId = normalizeContextId(context?.authorUserId);
  const fromDepartmentId = normalizeContextId(context?.fromDepartmentId);
  const toDepartmentId = normalizeContextId(context?.toDepartmentId);
  const encounterType = sanitizeString(context?.encounterType);
  const status = sanitizeString(context?.status);
  const diagnosisType = sanitizeString(context?.diagnosisType);
  const code = sanitizeString(context?.code);
  const vitalType = sanitizeString(context?.vitalType);
  const startDate = normalizeIsoDateValue(context?.startDate);
  const endDate = normalizeIsoDateValue(context?.endDate);
  const admissionId = normalizeContextId(context?.admissionId);
  const bedId = normalizeContextId(context?.bedId);
  const nurseUserId = normalizeContextId(context?.nurseUserId);
  const prescriptionId = normalizeContextId(context?.prescriptionId);
  const fromWardId = normalizeContextId(context?.fromWardId);
  const toWardId = normalizeContextId(context?.toWardId);
  const icuStayId = normalizeContextId(context?.icuStayId);
  const theatreCaseId = normalizeContextId(context?.theatreCaseId);
  const anesthetistUserId = normalizeContextId(context?.anesthetistUserId);
  const emergencyCaseId = normalizeContextId(context?.emergencyCaseId);
  const ambulanceId = normalizeContextId(context?.ambulanceId);
  const labTestId = normalizeContextId(context?.labTestId);
  const labOrderId = normalizeContextId(context?.labOrderId);
  const labOrderItemId = normalizeContextId(context?.labOrderItemId);
  const radiologyTestId = normalizeContextId(context?.radiologyTestId);
  const radiologyOrderId = normalizeContextId(context?.radiologyOrderId);
  const imagingStudyId = normalizeContextId(context?.imagingStudyId);
  const drugId = normalizeContextId(context?.drugId);
  const pharmacyOrderItemId = normalizeContextId(context?.pharmacyOrderItemId);
  const inventoryItemId = normalizeContextId(context?.inventoryItemId);
  const supplierId = normalizeContextId(context?.supplierId);
  const purchaseRequestId = normalizeContextId(context?.purchaseRequestId);
  const purchaseOrderId = normalizeContextId(context?.purchaseOrderId);
  const invoiceId = normalizeContextId(context?.invoiceId);
  const paymentId = normalizeContextId(context?.paymentId);
  const coveragePlanId = normalizeContextId(context?.coveragePlanId);
  const staffProfileId = normalizeContextId(context?.staffProfileId);
  const departmentId = normalizeContextId(context?.departmentId);
  const unitId = normalizeContextId(context?.unitId);
  const roomId = normalizeContextId(context?.roomId);
  const assetId = normalizeContextId(context?.assetId);
  const userId = normalizeContextId(context?.userId);
  const severity = sanitizeString(context?.severity);
  const triageLevel = sanitizeString(context?.triageLevel);
  const modality = sanitizeString(context?.modality);
  const route = sanitizeString(context?.route);
  const billingStatus = sanitizeString(context?.billingStatus);
  const method = sanitizeString(context?.method);
  const shiftType = sanitizeString(context?.shiftType);
  const frequency = sanitizeString(context?.frequency);
  const form = sanitizeString(context?.form);
  const strength = sanitizeString(context?.strength);
  const batchNumber = sanitizeString(context?.batchNumber);
  const category = sanitizeString(context?.category);
  const unit = sanitizeString(context?.unit);
  const contactEmail = sanitizeString(context?.contactEmail);
  const movementType = sanitizeString(context?.movementType);
  const reason = sanitizeString(context?.reason);
  const search = sanitizeString(context?.search);
  const orderedAtFrom = normalizeIsoDateValue(context?.orderedAtFrom);
  const orderedAtTo = normalizeIsoDateValue(context?.orderedAtTo);
  const dispensedAtFrom = normalizeIsoDateValue(context?.dispensedAtFrom);
  const dispensedAtTo = normalizeIsoDateValue(context?.dispensedAtTo);
  const reportedAtFrom = normalizeIsoDateValue(context?.reportedAtFrom);
  const reportedAtTo = normalizeIsoDateValue(context?.reportedAtTo);
  const fromDate = normalizeIsoDateValue(context?.fromDate);
  const toDate = normalizeIsoDateValue(context?.toDate);
  const performedAt = normalizeIsoDateValue(context?.performedAt);
  const expiresAt = normalizeIsoDateValue(context?.expiresAt);
  const startedAtFrom = normalizeIsoDateValue(context?.startedAtFrom);
  const startedAtTo = normalizeIsoDateValue(context?.startedAtTo);
  const endedAtFrom = normalizeIsoDateValue(context?.endedAtFrom);
  const endedAtTo = normalizeIsoDateValue(context?.endedAtTo);
  const observedAtFrom = normalizeIsoDateValue(context?.observedAtFrom);
  const observedAtTo = normalizeIsoDateValue(context?.observedAtTo);
  const scheduledFrom = normalizeIsoDateValue(context?.scheduledFrom);
  const scheduledTo = normalizeIsoDateValue(context?.scheduledTo);
  const paidAtFrom = normalizeIsoDateValue(context?.paidAtFrom);
  const paidAtTo = normalizeIsoDateValue(context?.paidAtTo);
  const refundedAtFrom = normalizeIsoDateValue(context?.refundedAtFrom);
  const refundedAtTo = normalizeIsoDateValue(context?.refundedAtTo);
  const submittedAtFrom = normalizeIsoDateValue(context?.submittedAtFrom);
  const submittedAtTo = normalizeIsoDateValue(context?.submittedAtTo);
  const requestedAtFrom = normalizeIsoDateValue(context?.requestedAtFrom);
  const requestedAtTo = normalizeIsoDateValue(context?.requestedAtTo);
  const approvedAtFrom = normalizeIsoDateValue(context?.approvedAtFrom);
  const approvedAtTo = normalizeIsoDateValue(context?.approvedAtTo);
  const startTimeFrom = normalizeIsoDateValue(context?.startTimeFrom);
  const startTimeTo = normalizeIsoDateValue(context?.startTimeTo);
  const endTimeFrom = normalizeIsoDateValue(context?.endTimeFrom);
  const endTimeTo = normalizeIsoDateValue(context?.endTimeTo);
  const periodStartFrom = normalizeIsoDateValue(context?.periodStartFrom);
  const periodStartTo = normalizeIsoDateValue(context?.periodStartTo);
  const periodEndFrom = normalizeIsoDateValue(context?.periodEndFrom);
  const periodEndTo = normalizeIsoDateValue(context?.periodEndTo);
  const isActiveRaw = context?.isActive;
  const isActive =
    typeof isActiveRaw === 'boolean'
      ? isActiveRaw
      : sanitizeString(isActiveRaw) === 'true'
        ? true
        : sanitizeString(isActiveRaw) === 'false'
          ? false
          : undefined;
  const expiredRaw = context?.expired;
  const expired =
    typeof expiredRaw === 'boolean'
      ? expiredRaw
      : sanitizeString(expiredRaw) === 'true'
        ? true
        : sanitizeString(expiredRaw) === 'false'
          ? false
          : undefined;
  const belowReorderRaw = context?.belowReorder;
  const belowReorder =
    typeof belowReorderRaw === 'boolean'
      ? belowReorderRaw
      : sanitizeString(belowReorderRaw) === 'true'
        ? true
        : sanitizeString(belowReorderRaw) === 'false'
          ? false
          : undefined;
  const minQuantity = parseOptionalInteger(context?.minQuantity);
  const maxQuantity = parseOptionalInteger(context?.maxQuantity);

  if (resourceId === CLINICAL_RESOURCE_IDS.ENCOUNTERS) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      patient_id: patientId || undefined,
      provider_user_id: providerUserId || undefined,
      encounter_type: encounterType || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CLINICAL_NOTES) {
    return {
      encounter_id: encounterId || undefined,
      author_user_id: authorUserId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DIAGNOSES) {
    return {
      encounter_id: encounterId || undefined,
      diagnosis_type: diagnosisType || undefined,
      code: code || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PROCEDURES) {
    return {
      encounter_id: encounterId || undefined,
      code: code || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.VITAL_SIGNS) {
    return {
      encounter_id: encounterId || undefined,
      vital_type: vitalType || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CARE_PLANS) {
    return {
      encounter_id: encounterId || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.REFERRALS) {
    return {
      encounter_id: encounterId || undefined,
      from_department_id: fromDepartmentId || undefined,
      to_department_id: toDepartmentId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.FOLLOW_UPS) {
    return {
      encounter_id: encounterId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ADMISSIONS) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      patient_id: patientId || undefined,
      encounter_id: encounterId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS) {
    return {
      admission_id: admissionId || undefined,
      bed_id: bedId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.WARD_ROUNDS) {
    return {
      admission_id: admissionId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.NURSING_NOTES) {
    return {
      admission_id: admissionId || undefined,
      nurse_user_id: nurseUserId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS) {
    return {
      admission_id: admissionId || undefined,
      prescription_id: prescriptionId || undefined,
      route: route || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES) {
    return {
      admission_id: admissionId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS) {
    return {
      admission_id: admissionId || undefined,
      from_ward_id: fromWardId || undefined,
      to_ward_id: toWardId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ICU_STAYS) {
    return {
      admission_id: admissionId || undefined,
      started_at_from: startedAtFrom || undefined,
      started_at_to: startedAtTo || undefined,
      ended_at_from: endedAtFrom || undefined,
      ended_at_to: endedAtTo || undefined,
      is_active: typeof isActive === 'boolean' ? isActive : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS) {
    return {
      icu_stay_id: icuStayId || undefined,
      observed_at_from: observedAtFrom || undefined,
      observed_at_to: observedAtTo || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS) {
    return {
      icu_stay_id: icuStayId || undefined,
      severity: severity || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.THEATRE_CASES) {
    return {
      encounter_id: encounterId || undefined,
      status: status || undefined,
      scheduled_from: scheduledFrom || undefined,
      scheduled_to: scheduledTo || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS) {
    return {
      theatre_case_id: theatreCaseId || undefined,
      anesthetist_user_id: anesthetistUserId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.POST_OP_NOTES) {
    return {
      theatre_case_id: theatreCaseId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.EMERGENCY_CASES) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      patient_id: patientId || undefined,
      severity: severity || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS) {
    return {
      emergency_case_id: emergencyCaseId || undefined,
      triage_level: triageLevel || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES) {
    return {
      emergency_case_id: emergencyCaseId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCES) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES) {
    return {
      ambulance_id: ambulanceId || undefined,
      emergency_case_id: emergencyCaseId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS) {
    return {
      ambulance_id: ambulanceId || undefined,
      emergency_case_id: emergencyCaseId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_TESTS) {
    return {
      tenant_id: tenantId || undefined,
      name: sanitizeString(context?.name) || undefined,
      code: code || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_PANELS) {
    return {
      tenant_id: tenantId || undefined,
      name: sanitizeString(context?.name) || undefined,
      code: code || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_ORDERS) {
    const hasValidOrderedRange =
      !orderedAtFrom ||
      !orderedAtTo ||
      new Date(orderedAtFrom).getTime() <= new Date(orderedAtTo).getTime();

    return {
      encounter_id: encounterId || undefined,
      patient_id: patientId || undefined,
      status: status || undefined,
      ordered_at_from: orderedAtFrom || undefined,
      ordered_at_to: hasValidOrderedRange ? orderedAtTo || undefined : undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_SAMPLES) {
    return {
      lab_order_id: labOrderId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_RESULTS) {
    return {
      lab_order_item_id: labOrderItemId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_QC_LOGS) {
    return {
      lab_test_id: labTestId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS) {
    return {
      tenant_id: tenantId || undefined,
      name: sanitizeString(context?.name) || undefined,
      code: code || undefined,
      modality: modality || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS) {
    return {
      encounter_id: encounterId || undefined,
      patient_id: patientId || undefined,
      radiology_test_id: radiologyTestId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS) {
    return {
      radiology_order_id: radiologyOrderId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.IMAGING_STUDIES) {
    return {
      radiology_order_id: radiologyOrderId || undefined,
      modality: modality || undefined,
      performed_at: performedAt || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PACS_LINKS) {
    return {
      imaging_study_id: imagingStudyId || undefined,
      expires_at: expiresAt || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DRUGS) {
    return {
      tenant_id: tenantId || undefined,
      name: sanitizeString(context?.name) || undefined,
      code: code || undefined,
      form: form || undefined,
      strength: strength || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DRUG_BATCHES) {
    return {
      drug_id: drugId || undefined,
      batch_number: batchNumber || undefined,
      expired: typeof expired === 'boolean' ? expired : undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.FORMULARY_ITEMS) {
    return {
      tenant_id: tenantId || undefined,
      drug_id: drugId || undefined,
      is_active: typeof isActive === 'boolean' ? isActive : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PHARMACY_ORDERS) {
    const hasValidOrderedRange =
      !orderedAtFrom ||
      !orderedAtTo ||
      new Date(orderedAtFrom).getTime() <= new Date(orderedAtTo).getTime();

    return {
      encounter_id: encounterId || undefined,
      patient_id: patientId || undefined,
      status: status || undefined,
      ordered_at_from: orderedAtFrom || undefined,
      ordered_at_to: hasValidOrderedRange ? orderedAtTo || undefined : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DISPENSE_LOGS) {
    const hasValidDispensedRange =
      !dispensedAtFrom ||
      !dispensedAtTo ||
      new Date(dispensedAtFrom).getTime() <= new Date(dispensedAtTo).getTime();

    return {
      pharmacy_order_item_id: pharmacyOrderItemId || undefined,
      status: status || undefined,
      dispensed_at_from: dispensedAtFrom || undefined,
      dispensed_at_to: hasValidDispensedRange ? dispensedAtTo || undefined : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ADVERSE_EVENTS) {
    const hasValidReportedRange =
      !reportedAtFrom ||
      !reportedAtTo ||
      new Date(reportedAtFrom).getTime() <= new Date(reportedAtTo).getTime();

    return {
      patient_id: patientId || undefined,
      drug_id: drugId || undefined,
      severity: severity || undefined,
      reported_at_from: reportedAtFrom || undefined,
      reported_at_to: hasValidReportedRange ? reportedAtTo || undefined : undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.INVENTORY_ITEMS) {
    return {
      tenant_id: tenantId || undefined,
      name: sanitizeString(context?.name) || undefined,
      category: category || undefined,
      sku: sanitizeString(context?.sku) || undefined,
      unit: unit || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.INVENTORY_STOCKS) {
    return {
      inventory_item_id: inventoryItemId || undefined,
      facility_id: facilityId || undefined,
      min_quantity: Number.isInteger(minQuantity) ? minQuantity : undefined,
      max_quantity: Number.isInteger(maxQuantity) ? maxQuantity : undefined,
      below_reorder: typeof belowReorder === 'boolean' ? belowReorder : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STOCK_MOVEMENTS) {
    const hasValidDateRange =
      !fromDate ||
      !toDate ||
      new Date(fromDate).getTime() <= new Date(toDate).getTime();

    return {
      inventory_item_id: inventoryItemId || undefined,
      facility_id: facilityId || undefined,
      movement_type: movementType || undefined,
      reason: reason || undefined,
      from_date: fromDate || undefined,
      to_date: hasValidDateRange ? toDate || undefined : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.SUPPLIERS) {
    return {
      tenant_id: tenantId || undefined,
      name: sanitizeString(context?.name) || undefined,
      contact_email: contactEmail || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PURCHASE_ORDERS) {
    return {
      purchase_request_id: purchaseRequestId || undefined,
      supplier_id: supplierId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.GOODS_RECEIPTS) {
    return {
      purchase_order_id: purchaseOrderId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STOCK_ADJUSTMENTS) {
    return {
      inventory_item_id: inventoryItemId || undefined,
      facility_id: facilityId || undefined,
      reason: reason || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.INVOICES) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      patient_id: patientId || undefined,
      status: status || undefined,
      billing_status: billingStatus || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PAYMENTS) {
    const hasValidPaidRange =
      !paidAtFrom ||
      !paidAtTo ||
      new Date(paidAtFrom).getTime() <= new Date(paidAtTo).getTime();

    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      patient_id: patientId || undefined,
      invoice_id: invoiceId || undefined,
      status: status || undefined,
      method: method || undefined,
      paid_at_from: paidAtFrom || undefined,
      paid_at_to: hasValidPaidRange ? paidAtTo || undefined : undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.REFUNDS) {
    const hasValidRefundedRange =
      !refundedAtFrom ||
      !refundedAtTo ||
      new Date(refundedAtFrom).getTime() <= new Date(refundedAtTo).getTime();

    return {
      payment_id: paymentId || undefined,
      refunded_at_from: refundedAtFrom || undefined,
      refunded_at_to: hasValidRefundedRange ? refundedAtTo || undefined : undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.INSURANCE_CLAIMS) {
    const hasValidSubmittedRange =
      !submittedAtFrom ||
      !submittedAtTo ||
      new Date(submittedAtFrom).getTime() <= new Date(submittedAtTo).getTime();

    return {
      coverage_plan_id: coveragePlanId || undefined,
      invoice_id: invoiceId || undefined,
      status: status || undefined,
      submitted_at_from: submittedAtFrom || undefined,
      submitted_at_to: hasValidSubmittedRange ? submittedAtTo || undefined : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PRE_AUTHORIZATIONS) {
    const hasValidRequestedRange =
      !requestedAtFrom ||
      !requestedAtTo ||
      new Date(requestedAtFrom).getTime() <= new Date(requestedAtTo).getTime();
    const hasValidApprovedRange =
      !approvedAtFrom ||
      !approvedAtTo ||
      new Date(approvedAtFrom).getTime() <= new Date(approvedAtTo).getTime();

    return {
      coverage_plan_id: coveragePlanId || undefined,
      status: status || undefined,
      requested_at_from: requestedAtFrom || undefined,
      requested_at_to: hasValidRequestedRange ? requestedAtTo || undefined : undefined,
      approved_at_from: approvedAtFrom || undefined,
      approved_at_to: hasValidApprovedRange ? approvedAtTo || undefined : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.BILLING_ADJUSTMENTS) {
    return {
      invoice_id: invoiceId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STAFF_PROFILES) {
    return {
      tenant_id: tenantId || undefined,
      user_id: userId || undefined,
      department_id: departmentId || undefined,
      staff_number: sanitizeString(context?.staffNumber) || undefined,
      position: sanitizeString(context?.position) || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STAFF_ASSIGNMENTS) {
    return {
      staff_profile_id: staffProfileId || undefined,
      department_id: departmentId || undefined,
      unit_id: unitId || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STAFF_LEAVES) {
    return {
      staff_profile_id: staffProfileId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.SHIFTS) {
    const hasValidShiftStartRange =
      !startTimeFrom ||
      !startTimeTo ||
      new Date(startTimeFrom).getTime() <= new Date(startTimeTo).getTime();
    const hasValidShiftEndRange =
      !endTimeFrom ||
      !endTimeTo ||
      new Date(endTimeFrom).getTime() <= new Date(endTimeTo).getTime();

    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      shift_type: shiftType || undefined,
      status: status || undefined,
      start_time_from: startTimeFrom || undefined,
      start_time_to: hasValidShiftStartRange ? startTimeTo || undefined : undefined,
      end_time_from: endTimeFrom || undefined,
      end_time_to: hasValidShiftEndRange ? endTimeTo || undefined : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.NURSE_ROSTERS) {
    const hasValidPeriodStartRange =
      !periodStartFrom ||
      !periodStartTo ||
      new Date(periodStartFrom).getTime() <= new Date(periodStartTo).getTime();

    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      department_id: departmentId || undefined,
      status: status || undefined,
      period_start_from: periodStartFrom || undefined,
      period_start_to: hasValidPeriodStartRange ? periodStartTo || undefined : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PAYROLL_RUNS) {
    const hasValidPayrollStartRange =
      !periodStartFrom ||
      !periodStartTo ||
      new Date(periodStartFrom).getTime() <= new Date(periodStartTo).getTime();
    const hasValidPayrollEndRange =
      !periodEndFrom ||
      !periodEndTo ||
      new Date(periodEndFrom).getTime() <= new Date(periodEndTo).getTime();

    return {
      tenant_id: tenantId || undefined,
      status: status || undefined,
      period_start_from: periodStartFrom || undefined,
      period_start_to: hasValidPayrollStartRange ? periodStartTo || undefined : undefined,
      period_end_from: periodEndFrom || undefined,
      period_end_to: hasValidPayrollEndRange ? periodEndTo || undefined : undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.HOUSEKEEPING_TASKS) {
    return {
      facility_id: facilityId || undefined,
      room_id: roomId || undefined,
      assigned_to_staff_id: userId || undefined,
      status: status || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.HOUSEKEEPING_SCHEDULES) {
    return {
      facility_id: facilityId || undefined,
      room_id: roomId || undefined,
      frequency: frequency || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.MAINTENANCE_REQUESTS) {
    return {
      facility_id: facilityId || undefined,
      asset_id: assetId || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ASSETS) {
    return {
      tenant_id: tenantId || undefined,
      facility_id: facilityId || undefined,
      name: sanitizeString(context?.name) || undefined,
      asset_tag: sanitizeString(context?.assetTag) || undefined,
      status: status || undefined,
      search: search || undefined,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ASSET_SERVICE_LOGS) {
    return {
      asset_id: assetId || undefined,
      search: search || undefined,
    };
  }

  return {};
};

const resourceConfigs = {
  [CLINICAL_RESOURCE_IDS.ENCOUNTERS]: {
    id: CLINICAL_RESOURCE_IDS.ENCOUNTERS,
    routePath: `${CLINICAL_ROUTE_ROOT}/encounters`,
    i18nKey: 'clinical.resources.encounters',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.encounters.form.patientIdLabel',
        placeholderKey: 'clinical.resources.encounters.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.encounters.form.patientIdHint',
      },
      {
        name: 'provider_user_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.providerUserIdLabel',
        placeholderKey: 'clinical.resources.encounters.form.providerUserIdPlaceholder',
        hintKey: 'clinical.resources.encounters.form.providerUserIdHint',
      },
      {
        name: 'encounter_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.encounters.form.encounterTypeLabel',
        placeholderKey: 'clinical.resources.encounters.form.encounterTypePlaceholder',
        hintKey: 'clinical.resources.encounters.form.encounterTypeHint',
        options: ENCOUNTER_TYPE_OPTIONS,
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.encounters.form.statusLabel',
        placeholderKey: 'clinical.resources.encounters.form.statusPlaceholder',
        hintKey: 'clinical.resources.encounters.form.statusHint',
        options: ENCOUNTER_STATUS_OPTIONS,
      },
      {
        name: 'started_at',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.startedAtLabel',
        placeholderKey: 'clinical.resources.encounters.form.startedAtPlaceholder',
        hintKey: 'clinical.resources.encounters.form.startedAtHint',
      },
      {
        name: 'ended_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.endedAtLabel',
        placeholderKey: 'clinical.resources.encounters.form.endedAtPlaceholder',
        hintKey: 'clinical.resources.encounters.form.endedAtHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.encounters.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.encounters.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.encounters.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      const encounterType = sanitizeString(item?.encounter_type);
      if (status && encounterType) {
        return `${t('clinical.resources.encounters.detail.statusLabel')}: ${status} - ${encounterType}`;
      }
      if (status) return `${t('clinical.resources.encounters.detail.statusLabel')}: ${status}`;
      return encounterType;
    },
    getInitialValues: (record, context) => ({
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      provider_user_id: sanitizeString(record?.provider_user_id || context?.providerUserId),
      encounter_type: sanitizeString(record?.encounter_type || context?.encounterType || 'OPD'),
      status: sanitizeString(record?.status || context?.status || 'OPEN'),
      started_at: sanitizeString(record?.started_at),
      ended_at: sanitizeString(record?.ended_at),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const endedAtRaw = sanitizeString(values.ended_at);
      const payload = {
        provider_user_id: sanitizeString(values.provider_user_id) || undefined,
        encounter_type: sanitizeString(values.encounter_type),
        status: sanitizeString(values.status),
        started_at: toIsoDateTime(values.started_at),
        ended_at: endedAtRaw ? toIsoDateTime(endedAtRaw) : isEdit ? null : undefined,
        facility_id: sanitizeString(values.facility_id) || undefined,
      };

      if (!isEdit) {
        payload.patient_id = sanitizeString(values.patient_id);
      }

      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const startedAtError = buildDateTimeError(values.started_at, t);
      const endedAtError = buildDateTimeError(values.ended_at, t);
      if (startedAtError) errors.started_at = startedAtError;
      if (endedAtError) errors.ended_at = endedAtError;
      if (!endedAtError) {
        const orderError = validateDateOrder(values.started_at, values.ended_at, t, { allowEqual: false });
        if (orderError) errors.ended_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.encounters.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.encounters.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.encounters.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.encounters.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.encounters.detail.providerLabel', valueKey: 'provider_user_id' },
      { labelKey: 'clinical.resources.encounters.detail.encounterTypeLabel', valueKey: 'encounter_type' },
      { labelKey: 'clinical.resources.encounters.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.encounters.detail.startedAtLabel', valueKey: 'started_at', type: 'datetime' },
      { labelKey: 'clinical.resources.encounters.detail.endedAtLabel', valueKey: 'ended_at', type: 'datetime' },
      { labelKey: 'clinical.resources.encounters.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.encounters.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.CLINICAL_NOTES]: {
    id: CLINICAL_RESOURCE_IDS.CLINICAL_NOTES,
    routePath: `${CLINICAL_ROUTE_ROOT}/clinical-notes`,
    i18nKey: 'clinical.resources.clinicalNotes',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.clinicalNotes.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.clinicalNotes.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.clinicalNotes.form.encounterIdHint',
      },
      {
        name: 'author_user_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.clinicalNotes.form.authorUserIdLabel',
        placeholderKey: 'clinical.resources.clinicalNotes.form.authorUserIdPlaceholder',
        hintKey: 'clinical.resources.clinicalNotes.form.authorUserIdHint',
      },
      {
        name: 'note',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.clinicalNotes.form.noteLabel',
        placeholderKey: 'clinical.resources.clinicalNotes.form.notePlaceholder',
        hintKey: 'clinical.resources.clinicalNotes.form.noteHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.note) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const authorUserId = sanitizeString(item?.author_user_id);
      if (!authorUserId) return '';
      return `${t('clinical.resources.clinicalNotes.detail.authorLabel')}: ${authorUserId}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      author_user_id: sanitizeString(record?.author_user_id || context?.authorUserId || context?.providerUserId),
      note: sanitizeString(record?.note),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        note: sanitizeString(values.note),
      };
      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
        payload.author_user_id = sanitizeString(values.author_user_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.clinicalNotes.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.authorLabel', valueKey: 'author_user_id' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.noteLabel', valueKey: 'note' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.clinicalNotes.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.DIAGNOSES]: {
    id: CLINICAL_RESOURCE_IDS.DIAGNOSES,
    routePath: `${CLINICAL_ROUTE_ROOT}/diagnoses`,
    i18nKey: 'clinical.resources.diagnoses',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.diagnoses.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.encounterIdHint',
      },
      {
        name: 'diagnosis_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.diagnoses.form.diagnosisTypeLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.diagnosisTypePlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.diagnosisTypeHint',
        options: DIAGNOSIS_TYPE_OPTIONS,
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.diagnoses.form.codeLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.codePlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.codeHint',
      },
      {
        name: 'description',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.diagnoses.form.descriptionLabel',
        placeholderKey: 'clinical.resources.diagnoses.form.descriptionPlaceholder',
        hintKey: 'clinical.resources.diagnoses.form.descriptionHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.description) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const diagnosisType = sanitizeString(item?.diagnosis_type);
      if (!diagnosisType) return '';
      return `${t('clinical.resources.diagnoses.detail.diagnosisTypeLabel')}: ${diagnosisType}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      diagnosis_type: sanitizeString(record?.diagnosis_type || context?.diagnosisType || 'PRIMARY'),
      code: sanitizeString(record?.code || context?.code),
      description: sanitizeString(record?.description),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        diagnosis_type: sanitizeString(values.diagnosis_type),
        code: sanitizeString(values.code) || undefined,
        description: sanitizeString(values.description),
      };
      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.diagnoses.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.diagnoses.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.diagnoses.detail.diagnosisTypeLabel', valueKey: 'diagnosis_type' },
      { labelKey: 'clinical.resources.diagnoses.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.diagnoses.detail.descriptionLabel', valueKey: 'description' },
      { labelKey: 'clinical.resources.diagnoses.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.diagnoses.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PROCEDURES]: {
    id: CLINICAL_RESOURCE_IDS.PROCEDURES,
    routePath: `${CLINICAL_ROUTE_ROOT}/procedures`,
    i18nKey: 'clinical.resources.procedures',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.procedures.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.procedures.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.procedures.form.encounterIdHint',
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.procedures.form.codeLabel',
        placeholderKey: 'clinical.resources.procedures.form.codePlaceholder',
        hintKey: 'clinical.resources.procedures.form.codeHint',
      },
      {
        name: 'description',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.procedures.form.descriptionLabel',
        placeholderKey: 'clinical.resources.procedures.form.descriptionPlaceholder',
        hintKey: 'clinical.resources.procedures.form.descriptionHint',
      },
      {
        name: 'performed_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.procedures.form.performedAtLabel',
        placeholderKey: 'clinical.resources.procedures.form.performedAtPlaceholder',
        hintKey: 'clinical.resources.procedures.form.performedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.description) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const code = sanitizeString(item?.code);
      if (!code) return '';
      return `${t('clinical.resources.procedures.detail.codeLabel')}: ${code}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      code: sanitizeString(record?.code || context?.code),
      description: sanitizeString(record?.description),
      performed_at: sanitizeString(record?.performed_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        code: sanitizeString(values.code) || undefined,
        description: sanitizeString(values.description),
        performed_at: toIsoDateTime(values.performed_at) || undefined,
      };
      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const performedAtError = buildDateTimeError(values.performed_at, t);
      if (performedAtError) errors.performed_at = performedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.procedures.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.procedures.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.procedures.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.procedures.detail.descriptionLabel', valueKey: 'description' },
      { labelKey: 'clinical.resources.procedures.detail.performedAtLabel', valueKey: 'performed_at', type: 'datetime' },
      { labelKey: 'clinical.resources.procedures.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.procedures.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.VITAL_SIGNS]: {
    id: CLINICAL_RESOURCE_IDS.VITAL_SIGNS,
    routePath: `${CLINICAL_ROUTE_ROOT}/vital-signs`,
    i18nKey: 'clinical.resources.vitalSigns',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.vitalSigns.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.encounterIdHint',
      },
      {
        name: 'vital_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.vitalSigns.form.vitalTypeLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.vitalTypePlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.vitalTypeHint',
        options: VITAL_TYPE_OPTIONS,
      },
      {
        name: 'value',
        type: 'text',
        required: true,
        maxLength: 80,
        labelKey: 'clinical.resources.vitalSigns.form.valueLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.valuePlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.valueHint',
      },
      {
        name: 'unit',
        type: 'text',
        required: false,
        maxLength: 20,
        labelKey: 'clinical.resources.vitalSigns.form.unitLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.unitPlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.unitHint',
      },
      {
        name: 'recorded_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.vitalSigns.form.recordedAtLabel',
        placeholderKey: 'clinical.resources.vitalSigns.form.recordedAtPlaceholder',
        hintKey: 'clinical.resources.vitalSigns.form.recordedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.vital_type) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const value = sanitizeString(item?.value);
      if (!value) return '';
      return `${t('clinical.resources.vitalSigns.detail.valueLabel')}: ${value}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      vital_type: sanitizeString(record?.vital_type || context?.vitalType),
      value: sanitizeString(record?.value),
      unit: sanitizeString(record?.unit),
      recorded_at: sanitizeString(record?.recorded_at),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id),
      vital_type: sanitizeString(values.vital_type),
      value: sanitizeString(values.value),
      unit: sanitizeString(values.unit) || undefined,
      recorded_at: toIsoDateTime(values.recorded_at) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const recordedAtError = buildDateTimeError(values.recorded_at, t);
      if (recordedAtError) errors.recorded_at = recordedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.vitalSigns.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.vitalSigns.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.vitalSigns.detail.vitalTypeLabel', valueKey: 'vital_type' },
      { labelKey: 'clinical.resources.vitalSigns.detail.valueLabel', valueKey: 'value' },
      { labelKey: 'clinical.resources.vitalSigns.detail.unitLabel', valueKey: 'unit' },
      { labelKey: 'clinical.resources.vitalSigns.detail.recordedAtLabel', valueKey: 'recorded_at', type: 'datetime' },
      { labelKey: 'clinical.resources.vitalSigns.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.vitalSigns.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.CARE_PLANS]: {
    id: CLINICAL_RESOURCE_IDS.CARE_PLANS,
    routePath: `${CLINICAL_ROUTE_ROOT}/care-plans`,
    i18nKey: 'clinical.resources.carePlans',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.carePlans.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.carePlans.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.carePlans.form.encounterIdHint',
      },
      {
        name: 'plan',
        type: 'text',
        required: true,
        labelKey: 'clinical.resources.carePlans.form.planLabel',
        placeholderKey: 'clinical.resources.carePlans.form.planPlaceholder',
        hintKey: 'clinical.resources.carePlans.form.planHint',
      },
      {
        name: 'start_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.carePlans.form.startDateLabel',
        placeholderKey: 'clinical.resources.carePlans.form.startDatePlaceholder',
        hintKey: 'clinical.resources.carePlans.form.startDateHint',
      },
      {
        name: 'end_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.carePlans.form.endDateLabel',
        placeholderKey: 'clinical.resources.carePlans.form.endDatePlaceholder',
        hintKey: 'clinical.resources.carePlans.form.endDateHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.plan) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const startDate = sanitizeString(item?.start_date);
      if (!startDate) return '';
      return `${t('clinical.resources.carePlans.detail.startDateLabel')}: ${startDate}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      plan: sanitizeString(record?.plan),
      start_date: sanitizeString(record?.start_date || context?.startDate),
      end_date: sanitizeString(record?.end_date || context?.endDate),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id),
      plan: sanitizeString(values.plan),
      start_date: toIsoDateTime(values.start_date) || undefined,
      end_date: toIsoDateTime(values.end_date) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const startDateError = buildDateTimeError(values.start_date, t);
      const endDateError = buildDateTimeError(values.end_date, t);
      if (startDateError) errors.start_date = startDateError;
      if (endDateError) errors.end_date = endDateError;
      if (!endDateError) {
        const orderError = validateDateOrder(values.start_date, values.end_date, t, { allowEqual: true });
        if (orderError) errors.end_date = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.carePlans.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.carePlans.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.carePlans.detail.planLabel', valueKey: 'plan' },
      { labelKey: 'clinical.resources.carePlans.detail.startDateLabel', valueKey: 'start_date', type: 'datetime' },
      { labelKey: 'clinical.resources.carePlans.detail.endDateLabel', valueKey: 'end_date', type: 'datetime' },
      { labelKey: 'clinical.resources.carePlans.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.carePlans.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.REFERRALS]: {
    id: CLINICAL_RESOURCE_IDS.REFERRALS,
    routePath: `${CLINICAL_ROUTE_ROOT}/referrals`,
    i18nKey: 'clinical.resources.referrals',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.referrals.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.referrals.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.referrals.form.encounterIdHint',
      },
      {
        name: 'from_department_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.referrals.form.fromDepartmentIdLabel',
        placeholderKey: 'clinical.resources.referrals.form.fromDepartmentIdPlaceholder',
        hintKey: 'clinical.resources.referrals.form.fromDepartmentIdHint',
      },
      {
        name: 'to_department_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.referrals.form.toDepartmentIdLabel',
        placeholderKey: 'clinical.resources.referrals.form.toDepartmentIdPlaceholder',
        hintKey: 'clinical.resources.referrals.form.toDepartmentIdHint',
      },
      {
        name: 'reason',
        type: 'text',
        required: false,
        maxLength: 10000,
        labelKey: 'clinical.resources.referrals.form.reasonLabel',
        placeholderKey: 'clinical.resources.referrals.form.reasonPlaceholder',
        hintKey: 'clinical.resources.referrals.form.reasonHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.referrals.form.statusLabel',
        placeholderKey: 'clinical.resources.referrals.form.statusPlaceholder',
        hintKey: 'clinical.resources.referrals.form.statusHint',
        options: ({ isEdit }) =>
          isEdit ? REFERRAL_UPDATE_STATUS_OPTIONS : REFERRAL_CREATE_STATUS_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.to_department_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.referrals.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      from_department_id: sanitizeString(record?.from_department_id || context?.fromDepartmentId),
      to_department_id: sanitizeString(record?.to_department_id || context?.toDepartmentId),
      reason: sanitizeString(record?.reason),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        from_department_id: sanitizeString(values.from_department_id) || undefined,
        to_department_id: sanitizeString(values.to_department_id) || undefined,
        reason: sanitizeString(values.reason) || undefined,
        status: sanitizeString(values.status),
      };

      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }

      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.referrals.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.referrals.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.referrals.detail.fromDepartmentLabel', valueKey: 'from_department_id' },
      { labelKey: 'clinical.resources.referrals.detail.toDepartmentLabel', valueKey: 'to_department_id' },
      { labelKey: 'clinical.resources.referrals.detail.reasonLabel', valueKey: 'reason' },
      { labelKey: 'clinical.resources.referrals.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.referrals.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.referrals.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.FOLLOW_UPS]: {
    id: CLINICAL_RESOURCE_IDS.FOLLOW_UPS,
    routePath: `${CLINICAL_ROUTE_ROOT}/follow-ups`,
    i18nKey: 'clinical.resources.followUps',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.followUps.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.followUps.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.followUps.form.encounterIdHint',
      },
      {
        name: 'scheduled_at',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.followUps.form.scheduledAtLabel',
        placeholderKey: 'clinical.resources.followUps.form.scheduledAtPlaceholder',
        hintKey: 'clinical.resources.followUps.form.scheduledAtHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 10000,
        labelKey: 'clinical.resources.followUps.form.notesLabel',
        placeholderKey: 'clinical.resources.followUps.form.notesPlaceholder',
        hintKey: 'clinical.resources.followUps.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.scheduled_at) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const scheduledAt = sanitizeString(item?.scheduled_at);
      if (!scheduledAt) return '';
      return `${t('clinical.resources.followUps.detail.scheduledAtLabel')}: ${scheduledAt}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      scheduled_at: sanitizeString(record?.scheduled_at),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        scheduled_at: toIsoDateTime(values.scheduled_at),
        notes: sanitizeString(values.notes) || undefined,
      };

      if (!isEdit) {
        payload.encounter_id = sanitizeString(values.encounter_id);
      }

      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const scheduledAtError = buildDateTimeError(values.scheduled_at, t);
      if (scheduledAtError) errors.scheduled_at = scheduledAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.followUps.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.followUps.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.followUps.detail.scheduledAtLabel', valueKey: 'scheduled_at', type: 'datetime' },
      { labelKey: 'clinical.resources.followUps.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.followUps.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.followUps.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ADMISSIONS]: {
    id: CLINICAL_RESOURCE_IDS.ADMISSIONS,
    routePath: `${IPD_ROUTE_ROOT}/admissions`,
    i18nKey: 'clinical.resources.admissions',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.admissions.form.patientIdLabel',
        placeholderKey: 'clinical.resources.admissions.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.admissions.form.patientIdHint',
      },
      {
        name: 'encounter_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.admissions.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.admissions.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.admissions.form.encounterIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.admissions.form.statusLabel',
        placeholderKey: 'clinical.resources.admissions.form.statusPlaceholder',
        hintKey: 'clinical.resources.admissions.form.statusHint',
        options: ADMISSION_STATUS_OPTIONS,
      },
      {
        name: 'admitted_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.admissions.form.admittedAtLabel',
        placeholderKey: 'clinical.resources.admissions.form.admittedAtPlaceholder',
        hintKey: 'clinical.resources.admissions.form.admittedAtHint',
      },
      {
        name: 'discharged_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.admissions.form.dischargedAtLabel',
        placeholderKey: 'clinical.resources.admissions.form.dischargedAtPlaceholder',
        hintKey: 'clinical.resources.admissions.form.dischargedAtHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.admissions.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.admissions.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.admissions.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.admissions.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      status: sanitizeString(record?.status || context?.status || 'ADMITTED'),
      admitted_at: sanitizeString(record?.admitted_at),
      discharged_at: sanitizeString(record?.discharged_at),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        facility_id: sanitizeString(values.facility_id) || undefined,
        encounter_id: sanitizeString(values.encounter_id) || undefined,
        status: sanitizeString(values.status),
        admitted_at: toIsoDateTime(values.admitted_at) || undefined,
      };
      if (isEdit) {
        payload.discharged_at = sanitizeString(values.discharged_at)
          ? toIsoDateTime(values.discharged_at)
          : undefined;
      } else {
        payload.patient_id = sanitizeString(values.patient_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const admittedAtError = buildDateTimeError(values.admitted_at, t);
      const dischargedAtError = buildDateTimeError(values.discharged_at, t);
      if (admittedAtError) errors.admitted_at = admittedAtError;
      if (dischargedAtError) errors.discharged_at = dischargedAtError;
      if (!dischargedAtError) {
        const orderError = validateDateOrder(values.admitted_at, values.discharged_at, t, { allowEqual: true });
        if (orderError) errors.discharged_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.admissions.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.admissions.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.admissions.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.admissions.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.admissions.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.admissions.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.admissions.detail.admittedAtLabel', valueKey: 'admitted_at', type: 'datetime' },
      { labelKey: 'clinical.resources.admissions.detail.dischargedAtLabel', valueKey: 'discharged_at', type: 'datetime' },
      { labelKey: 'clinical.resources.admissions.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.admissions.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS]: {
    id: CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS,
    routePath: `${IPD_ROUTE_ROOT}/bed-assignments`,
    i18nKey: 'clinical.resources.bedAssignments',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.bedAssignments.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.bedAssignments.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.bedAssignments.form.admissionIdHint',
      },
      {
        name: 'bed_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.bedAssignments.form.bedIdLabel',
        placeholderKey: 'clinical.resources.bedAssignments.form.bedIdPlaceholder',
        hintKey: 'clinical.resources.bedAssignments.form.bedIdHint',
      },
      {
        name: 'assigned_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.bedAssignments.form.assignedAtLabel',
        placeholderKey: 'clinical.resources.bedAssignments.form.assignedAtPlaceholder',
        hintKey: 'clinical.resources.bedAssignments.form.assignedAtHint',
      },
      {
        name: 'released_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.bedAssignments.form.releasedAtLabel',
        placeholderKey: 'clinical.resources.bedAssignments.form.releasedAtPlaceholder',
        hintKey: 'clinical.resources.bedAssignments.form.releasedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.bed_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const admissionId = sanitizeString(item?.admission_id);
      if (!admissionId) return '';
      return `${t('clinical.resources.bedAssignments.detail.admissionLabel')}: ${admissionId}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      bed_id: sanitizeString(record?.bed_id || context?.bedId),
      assigned_at: sanitizeString(record?.assigned_at),
      released_at: sanitizeString(record?.released_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        bed_id: sanitizeString(values.bed_id) || undefined,
        assigned_at: toIsoDateTime(values.assigned_at) || undefined,
      };
      if (isEdit) {
        payload.released_at = sanitizeString(values.released_at)
          ? toIsoDateTime(values.released_at)
          : null;
      } else {
        payload.admission_id = sanitizeString(values.admission_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const assignedAtError = buildDateTimeError(values.assigned_at, t);
      const releasedAtError = buildDateTimeError(values.released_at, t);
      if (assignedAtError) errors.assigned_at = assignedAtError;
      if (releasedAtError) errors.released_at = releasedAtError;
      if (!releasedAtError) {
        const orderError = validateDateOrder(values.assigned_at, values.released_at, t, { allowEqual: true });
        if (orderError) errors.released_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.bedAssignments.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.bedAssignments.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.bedAssignments.detail.bedLabel', valueKey: 'bed_id' },
      { labelKey: 'clinical.resources.bedAssignments.detail.assignedAtLabel', valueKey: 'assigned_at', type: 'datetime' },
      { labelKey: 'clinical.resources.bedAssignments.detail.releasedAtLabel', valueKey: 'released_at', type: 'datetime' },
      { labelKey: 'clinical.resources.bedAssignments.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.bedAssignments.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.WARD_ROUNDS]: {
    id: CLINICAL_RESOURCE_IDS.WARD_ROUNDS,
    routePath: `${IPD_ROUTE_ROOT}/ward-rounds`,
    i18nKey: 'clinical.resources.wardRounds',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.wardRounds.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.wardRounds.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.wardRounds.form.admissionIdHint',
      },
      {
        name: 'round_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.wardRounds.form.roundAtLabel',
        placeholderKey: 'clinical.resources.wardRounds.form.roundAtPlaceholder',
        hintKey: 'clinical.resources.wardRounds.form.roundAtHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 65535,
        labelKey: 'clinical.resources.wardRounds.form.notesLabel',
        placeholderKey: 'clinical.resources.wardRounds.form.notesPlaceholder',
        hintKey: 'clinical.resources.wardRounds.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.round_at) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const admissionId = sanitizeString(item?.admission_id);
      if (!admissionId) return '';
      return `${t('clinical.resources.wardRounds.detail.admissionLabel')}: ${admissionId}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      round_at: sanitizeString(record?.round_at),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        round_at: toIsoDateTime(values.round_at) || undefined,
        notes: sanitizeString(values.notes) || null,
      };
      if (!isEdit) {
        payload.admission_id = sanitizeString(values.admission_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const roundAtError = buildDateTimeError(values.round_at, t);
      if (roundAtError) errors.round_at = roundAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.wardRounds.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.wardRounds.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.wardRounds.detail.roundAtLabel', valueKey: 'round_at', type: 'datetime' },
      { labelKey: 'clinical.resources.wardRounds.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.wardRounds.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.wardRounds.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.NURSING_NOTES]: {
    id: CLINICAL_RESOURCE_IDS.NURSING_NOTES,
    routePath: `${IPD_ROUTE_ROOT}/nursing-notes`,
    i18nKey: 'clinical.resources.nursingNotes',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.nursingNotes.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.nursingNotes.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.nursingNotes.form.admissionIdHint',
      },
      {
        name: 'nurse_user_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.nursingNotes.form.nurseUserIdLabel',
        placeholderKey: 'clinical.resources.nursingNotes.form.nurseUserIdPlaceholder',
        hintKey: 'clinical.resources.nursingNotes.form.nurseUserIdHint',
      },
      {
        name: 'note',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.nursingNotes.form.noteLabel',
        placeholderKey: 'clinical.resources.nursingNotes.form.notePlaceholder',
        hintKey: 'clinical.resources.nursingNotes.form.noteHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.note) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const nurseUserId = sanitizeString(item?.nurse_user_id);
      if (!nurseUserId) return '';
      return `${t('clinical.resources.nursingNotes.detail.nurseLabel')}: ${nurseUserId}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      nurse_user_id: sanitizeString(record?.nurse_user_id || context?.nurseUserId),
      note: sanitizeString(record?.note),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = { note: sanitizeString(values.note) };
      if (!isEdit) {
        payload.admission_id = sanitizeString(values.admission_id);
        payload.nurse_user_id = sanitizeString(values.nurse_user_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.nursingNotes.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.nursingNotes.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.nursingNotes.detail.nurseLabel', valueKey: 'nurse_user_id' },
      { labelKey: 'clinical.resources.nursingNotes.detail.noteLabel', valueKey: 'note' },
      { labelKey: 'clinical.resources.nursingNotes.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.nursingNotes.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS]: {
    id: CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS,
    routePath: `${IPD_ROUTE_ROOT}/medication-administrations`,
    i18nKey: 'clinical.resources.medicationAdministrations',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.medicationAdministrations.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.admissionIdHint',
      },
      {
        name: 'prescription_id',
        type: 'text',
        required: false,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.medicationAdministrations.form.prescriptionIdLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.prescriptionIdPlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.prescriptionIdHint',
      },
      {
        name: 'administered_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.medicationAdministrations.form.administeredAtLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.administeredAtPlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.administeredAtHint',
      },
      {
        name: 'dose',
        type: 'text',
        required: true,
        maxLength: 80,
        labelKey: 'clinical.resources.medicationAdministrations.form.doseLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.dosePlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.doseHint',
      },
      {
        name: 'unit',
        type: 'text',
        required: false,
        maxLength: 40,
        labelKey: 'clinical.resources.medicationAdministrations.form.unitLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.unitPlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.unitHint',
      },
      {
        name: 'route',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.medicationAdministrations.form.routeLabel',
        placeholderKey: 'clinical.resources.medicationAdministrations.form.routePlaceholder',
        hintKey: 'clinical.resources.medicationAdministrations.form.routeHint',
        options: MEDICATION_ROUTE_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.dose) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const routeValue = sanitizeString(item?.route);
      if (!routeValue) return '';
      return `${t('clinical.resources.medicationAdministrations.detail.routeLabel')}: ${routeValue}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      prescription_id: sanitizeString(record?.prescription_id || context?.prescriptionId),
      administered_at: sanitizeString(record?.administered_at),
      dose: sanitizeString(record?.dose),
      unit: sanitizeString(record?.unit),
      route: sanitizeString(record?.route || context?.route || 'ORAL'),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        administered_at: toIsoDateTime(values.administered_at) || undefined,
        dose: sanitizeString(values.dose),
        unit: sanitizeString(values.unit) || undefined,
        route: sanitizeString(values.route),
      };
      if (!isEdit) {
        payload.admission_id = sanitizeString(values.admission_id);
        payload.prescription_id = sanitizeString(values.prescription_id) || undefined;
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const administeredAtError = buildDateTimeError(values.administered_at, t);
      if (administeredAtError) errors.administered_at = administeredAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.medicationAdministrations.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.prescriptionLabel', valueKey: 'prescription_id' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.doseLabel', valueKey: 'dose' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.unitLabel', valueKey: 'unit' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.routeLabel', valueKey: 'route' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.administeredAtLabel', valueKey: 'administered_at', type: 'datetime' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.medicationAdministrations.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES]: {
    id: CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES,
    routePath: `${IPD_ROUTE_ROOT}/discharge-summaries`,
    i18nKey: 'clinical.resources.dischargeSummaries',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.dischargeSummaries.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.dischargeSummaries.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.dischargeSummaries.form.admissionIdHint',
      },
      {
        name: 'summary',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.dischargeSummaries.form.summaryLabel',
        placeholderKey: 'clinical.resources.dischargeSummaries.form.summaryPlaceholder',
        hintKey: 'clinical.resources.dischargeSummaries.form.summaryHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.dischargeSummaries.form.statusLabel',
        placeholderKey: 'clinical.resources.dischargeSummaries.form.statusPlaceholder',
        hintKey: 'clinical.resources.dischargeSummaries.form.statusHint',
        options: DISCHARGE_STATUS_OPTIONS,
      },
      {
        name: 'discharged_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.dischargeSummaries.form.dischargedAtLabel',
        placeholderKey: 'clinical.resources.dischargeSummaries.form.dischargedAtPlaceholder',
        hintKey: 'clinical.resources.dischargeSummaries.form.dischargedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.summary) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.dischargeSummaries.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      summary: sanitizeString(record?.summary),
      status: sanitizeString(record?.status || context?.status || 'PLANNED'),
      discharged_at: sanitizeString(record?.discharged_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        summary: sanitizeString(values.summary),
        status: sanitizeString(values.status),
        discharged_at: toIsoDateTime(values.discharged_at) || undefined,
      };
      if (!isEdit) {
        payload.admission_id = sanitizeString(values.admission_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const dischargedAtError = buildDateTimeError(values.discharged_at, t);
      if (dischargedAtError) errors.discharged_at = dischargedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.dischargeSummaries.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.summaryLabel', valueKey: 'summary' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.dischargedAtLabel', valueKey: 'discharged_at', type: 'datetime' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.dischargeSummaries.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS]: {
    id: CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS,
    routePath: `${IPD_ROUTE_ROOT}/transfer-requests`,
    i18nKey: 'clinical.resources.transferRequests',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.transferRequests.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.transferRequests.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.transferRequests.form.admissionIdHint',
      },
      {
        name: 'from_ward_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.transferRequests.form.fromWardIdLabel',
        placeholderKey: 'clinical.resources.transferRequests.form.fromWardIdPlaceholder',
        hintKey: 'clinical.resources.transferRequests.form.fromWardIdHint',
      },
      {
        name: 'to_ward_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.transferRequests.form.toWardIdLabel',
        placeholderKey: 'clinical.resources.transferRequests.form.toWardIdPlaceholder',
        hintKey: 'clinical.resources.transferRequests.form.toWardIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: false,
        labelKey: 'clinical.resources.transferRequests.form.statusLabel',
        placeholderKey: 'clinical.resources.transferRequests.form.statusPlaceholder',
        hintKey: 'clinical.resources.transferRequests.form.statusHint',
        options: TRANSFER_STATUS_OPTIONS,
      },
      {
        name: 'requested_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.transferRequests.form.requestedAtLabel',
        placeholderKey: 'clinical.resources.transferRequests.form.requestedAtPlaceholder',
        hintKey: 'clinical.resources.transferRequests.form.requestedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.to_ward_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.transferRequests.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      from_ward_id: sanitizeString(record?.from_ward_id || context?.fromWardId),
      to_ward_id: sanitizeString(record?.to_ward_id || context?.toWardId),
      status: sanitizeString(record?.status || context?.status || 'REQUESTED'),
      requested_at: sanitizeString(record?.requested_at),
    }),
    toPayload: (values) => ({
      admission_id: sanitizeString(values.admission_id),
      from_ward_id: sanitizeString(values.from_ward_id) || null,
      to_ward_id: sanitizeString(values.to_ward_id) || null,
      status: sanitizeString(values.status) || undefined,
      requested_at: toIsoDateTime(values.requested_at) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const requestedAtError = buildDateTimeError(values.requested_at, t);
      if (requestedAtError) errors.requested_at = requestedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.transferRequests.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.transferRequests.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.transferRequests.detail.fromWardLabel', valueKey: 'from_ward_id' },
      { labelKey: 'clinical.resources.transferRequests.detail.toWardLabel', valueKey: 'to_ward_id' },
      { labelKey: 'clinical.resources.transferRequests.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.transferRequests.detail.requestedAtLabel', valueKey: 'requested_at', type: 'datetime' },
      { labelKey: 'clinical.resources.transferRequests.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.transferRequests.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ICU_STAYS]: {
    id: CLINICAL_RESOURCE_IDS.ICU_STAYS,
    routePath: `${ICU_ROUTE_ROOT}/icu-stays`,
    i18nKey: 'clinical.resources.icuStays',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'admission_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.icuStays.form.admissionIdLabel',
        placeholderKey: 'clinical.resources.icuStays.form.admissionIdPlaceholder',
        hintKey: 'clinical.resources.icuStays.form.admissionIdHint',
      },
      {
        name: 'started_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.icuStays.form.startedAtLabel',
        placeholderKey: 'clinical.resources.icuStays.form.startedAtPlaceholder',
        hintKey: 'clinical.resources.icuStays.form.startedAtHint',
      },
      {
        name: 'ended_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.icuStays.form.endedAtLabel',
        placeholderKey: 'clinical.resources.icuStays.form.endedAtPlaceholder',
        hintKey: 'clinical.resources.icuStays.form.endedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.admission_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const startedAt = sanitizeString(item?.started_at);
      if (!startedAt) return '';
      return `${t('clinical.resources.icuStays.detail.startedAtLabel')}: ${startedAt}`;
    },
    getInitialValues: (record, context) => ({
      admission_id: sanitizeString(record?.admission_id || context?.admissionId),
      started_at: sanitizeString(record?.started_at),
      ended_at: sanitizeString(record?.ended_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        started_at: toIsoDateTime(values.started_at) || undefined,
        ended_at: sanitizeString(values.ended_at) ? toIsoDateTime(values.ended_at) : null,
      };
      if (!isEdit) {
        payload.admission_id = sanitizeString(values.admission_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const startedAtError = buildDateTimeError(values.started_at, t);
      const endedAtError = buildDateTimeError(values.ended_at, t);
      if (startedAtError) errors.started_at = startedAtError;
      if (endedAtError) errors.ended_at = endedAtError;
      if (!endedAtError) {
        const orderError = validateDateOrder(values.started_at, values.ended_at, t, { allowEqual: true });
        if (orderError) errors.ended_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.icuStays.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.icuStays.detail.admissionLabel', valueKey: 'admission_id' },
      { labelKey: 'clinical.resources.icuStays.detail.startedAtLabel', valueKey: 'started_at', type: 'datetime' },
      { labelKey: 'clinical.resources.icuStays.detail.endedAtLabel', valueKey: 'ended_at', type: 'datetime' },
      { labelKey: 'clinical.resources.icuStays.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.icuStays.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS]: {
    id: CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS,
    routePath: `${ICU_ROUTE_ROOT}/icu-observations`,
    i18nKey: 'clinical.resources.icuObservations',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'icu_stay_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.icuObservations.form.icuStayIdLabel',
        placeholderKey: 'clinical.resources.icuObservations.form.icuStayIdPlaceholder',
        hintKey: 'clinical.resources.icuObservations.form.icuStayIdHint',
      },
      {
        name: 'observed_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.icuObservations.form.observedAtLabel',
        placeholderKey: 'clinical.resources.icuObservations.form.observedAtPlaceholder',
        hintKey: 'clinical.resources.icuObservations.form.observedAtHint',
      },
      {
        name: 'observation',
        type: 'text',
        required: true,
        maxLength: 5000,
        labelKey: 'clinical.resources.icuObservations.form.observationLabel',
        placeholderKey: 'clinical.resources.icuObservations.form.observationPlaceholder',
        hintKey: 'clinical.resources.icuObservations.form.observationHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.observation) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const observedAt = sanitizeString(item?.observed_at);
      if (!observedAt) return '';
      return `${t('clinical.resources.icuObservations.detail.observedAtLabel')}: ${observedAt}`;
    },
    getInitialValues: (record, context) => ({
      icu_stay_id: sanitizeString(record?.icu_stay_id || context?.icuStayId),
      observed_at: sanitizeString(record?.observed_at),
      observation: sanitizeString(record?.observation),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        observed_at: toIsoDateTime(values.observed_at) || undefined,
        observation: sanitizeString(values.observation),
      };
      if (!isEdit) {
        payload.icu_stay_id = sanitizeString(values.icu_stay_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const observedAtError = buildDateTimeError(values.observed_at, t);
      if (observedAtError) errors.observed_at = observedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.icuObservations.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.icuObservations.detail.icuStayLabel', valueKey: 'icu_stay_id' },
      { labelKey: 'clinical.resources.icuObservations.detail.observedAtLabel', valueKey: 'observed_at', type: 'datetime' },
      { labelKey: 'clinical.resources.icuObservations.detail.observationLabel', valueKey: 'observation' },
      { labelKey: 'clinical.resources.icuObservations.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.icuObservations.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS]: {
    id: CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS,
    routePath: `${ICU_ROUTE_ROOT}/critical-alerts`,
    i18nKey: 'clinical.resources.criticalAlerts',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'icu_stay_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.criticalAlerts.form.icuStayIdLabel',
        placeholderKey: 'clinical.resources.criticalAlerts.form.icuStayIdPlaceholder',
        hintKey: 'clinical.resources.criticalAlerts.form.icuStayIdHint',
      },
      {
        name: 'severity',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.criticalAlerts.form.severityLabel',
        placeholderKey: 'clinical.resources.criticalAlerts.form.severityPlaceholder',
        hintKey: 'clinical.resources.criticalAlerts.form.severityHint',
        options: CRITICAL_ALERT_SEVERITY_OPTIONS,
      },
      {
        name: 'message',
        type: 'text',
        required: true,
        maxLength: 2000,
        labelKey: 'clinical.resources.criticalAlerts.form.messageLabel',
        placeholderKey: 'clinical.resources.criticalAlerts.form.messagePlaceholder',
        hintKey: 'clinical.resources.criticalAlerts.form.messageHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.message) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const severityLabel = sanitizeString(item?.severity);
      if (!severityLabel) return '';
      return `${t('clinical.resources.criticalAlerts.detail.severityLabel')}: ${severityLabel}`;
    },
    getInitialValues: (record, context) => ({
      icu_stay_id: sanitizeString(record?.icu_stay_id || context?.icuStayId),
      severity: sanitizeString(record?.severity || context?.severity || 'MEDIUM'),
      message: sanitizeString(record?.message),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        severity: sanitizeString(values.severity),
        message: sanitizeString(values.message),
      };
      if (!isEdit) {
        payload.icu_stay_id = sanitizeString(values.icu_stay_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.criticalAlerts.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.criticalAlerts.detail.icuStayLabel', valueKey: 'icu_stay_id' },
      { labelKey: 'clinical.resources.criticalAlerts.detail.severityLabel', valueKey: 'severity' },
      { labelKey: 'clinical.resources.criticalAlerts.detail.messageLabel', valueKey: 'message' },
      { labelKey: 'clinical.resources.criticalAlerts.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.criticalAlerts.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.THEATRE_CASES]: {
    id: CLINICAL_RESOURCE_IDS.THEATRE_CASES,
    routePath: `${THEATRE_ROUTE_ROOT}/theatre-cases`,
    i18nKey: 'clinical.resources.theatreCases',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.theatreCases.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.theatreCases.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.theatreCases.form.encounterIdHint',
      },
      {
        name: 'scheduled_at',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.theatreCases.form.scheduledAtLabel',
        placeholderKey: 'clinical.resources.theatreCases.form.scheduledAtPlaceholder',
        hintKey: 'clinical.resources.theatreCases.form.scheduledAtHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.theatreCases.form.statusLabel',
        placeholderKey: 'clinical.resources.theatreCases.form.statusPlaceholder',
        hintKey: 'clinical.resources.theatreCases.form.statusHint',
        options: THEATRE_CASE_STATUS_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.encounter_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.theatreCases.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      scheduled_at: sanitizeString(record?.scheduled_at),
      status: sanitizeString(record?.status || context?.status || 'SCHEDULED'),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id),
      scheduled_at: toIsoDateTime(values.scheduled_at),
      status: sanitizeString(values.status),
    }),
    validate: (values, t) => {
      const errors = {};
      const scheduledAtError = buildDateTimeError(values.scheduled_at, t);
      if (scheduledAtError) errors.scheduled_at = scheduledAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.theatreCases.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.theatreCases.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.theatreCases.detail.scheduledAtLabel', valueKey: 'scheduled_at', type: 'datetime' },
      { labelKey: 'clinical.resources.theatreCases.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.theatreCases.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.theatreCases.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS]: {
    id: CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS,
    routePath: `${THEATRE_ROUTE_ROOT}/anesthesia-records`,
    i18nKey: 'clinical.resources.anesthesiaRecords',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'theatre_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.anesthesiaRecords.form.theatreCaseIdLabel',
        placeholderKey: 'clinical.resources.anesthesiaRecords.form.theatreCaseIdPlaceholder',
        hintKey: 'clinical.resources.anesthesiaRecords.form.theatreCaseIdHint',
      },
      {
        name: 'anesthetist_user_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.anesthesiaRecords.form.anesthetistUserIdLabel',
        placeholderKey: 'clinical.resources.anesthesiaRecords.form.anesthetistUserIdPlaceholder',
        hintKey: 'clinical.resources.anesthesiaRecords.form.anesthetistUserIdHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 65535,
        labelKey: 'clinical.resources.anesthesiaRecords.form.notesLabel',
        placeholderKey: 'clinical.resources.anesthesiaRecords.form.notesPlaceholder',
        hintKey: 'clinical.resources.anesthesiaRecords.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.theatre_case_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const anesthetistUserId = sanitizeString(item?.anesthetist_user_id);
      if (!anesthetistUserId) return '';
      return `${t('clinical.resources.anesthesiaRecords.detail.anesthetistLabel')}: ${anesthetistUserId}`;
    },
    getInitialValues: (record, context) => ({
      theatre_case_id: sanitizeString(record?.theatre_case_id || context?.theatreCaseId),
      anesthetist_user_id: sanitizeString(record?.anesthetist_user_id || context?.anesthetistUserId),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values) => ({
      theatre_case_id: sanitizeString(values.theatre_case_id),
      anesthetist_user_id: sanitizeString(values.anesthetist_user_id) || null,
      notes: sanitizeString(values.notes) || null,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.theatreCaseLabel', valueKey: 'theatre_case_id' },
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.anesthetistLabel', valueKey: 'anesthetist_user_id' },
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.anesthesiaRecords.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.POST_OP_NOTES]: {
    id: CLINICAL_RESOURCE_IDS.POST_OP_NOTES,
    routePath: `${THEATRE_ROUTE_ROOT}/post-op-notes`,
    i18nKey: 'clinical.resources.postOpNotes',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'theatre_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.postOpNotes.form.theatreCaseIdLabel',
        placeholderKey: 'clinical.resources.postOpNotes.form.theatreCaseIdPlaceholder',
        hintKey: 'clinical.resources.postOpNotes.form.theatreCaseIdHint',
      },
      {
        name: 'note',
        type: 'text',
        required: true,
        maxLength: 65535,
        labelKey: 'clinical.resources.postOpNotes.form.noteLabel',
        placeholderKey: 'clinical.resources.postOpNotes.form.notePlaceholder',
        hintKey: 'clinical.resources.postOpNotes.form.noteHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.note) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const theatreCaseId = sanitizeString(item?.theatre_case_id);
      if (!theatreCaseId) return '';
      return `${t('clinical.resources.postOpNotes.detail.theatreCaseLabel')}: ${theatreCaseId}`;
    },
    getInitialValues: (record, context) => ({
      theatre_case_id: sanitizeString(record?.theatre_case_id || context?.theatreCaseId),
      note: sanitizeString(record?.note),
    }),
    toPayload: (values) => ({
      theatre_case_id: sanitizeString(values.theatre_case_id),
      note: sanitizeString(values.note),
    }),
    detailRows: [
      { labelKey: 'clinical.resources.postOpNotes.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.postOpNotes.detail.theatreCaseLabel', valueKey: 'theatre_case_id' },
      { labelKey: 'clinical.resources.postOpNotes.detail.noteLabel', valueKey: 'note' },
      { labelKey: 'clinical.resources.postOpNotes.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.postOpNotes.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.EMERGENCY_CASES]: {
    id: CLINICAL_RESOURCE_IDS.EMERGENCY_CASES,
    routePath: `${EMERGENCY_ROUTE_ROOT}/emergency-cases`,
    i18nKey: 'clinical.resources.emergencyCases',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.emergencyCases.form.patientIdLabel',
        placeholderKey: 'clinical.resources.emergencyCases.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.emergencyCases.form.patientIdHint',
      },
      {
        name: 'severity',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.emergencyCases.form.severityLabel',
        placeholderKey: 'clinical.resources.emergencyCases.form.severityPlaceholder',
        hintKey: 'clinical.resources.emergencyCases.form.severityHint',
        options: EMERGENCY_CASE_SEVERITY_OPTIONS,
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.emergencyCases.form.statusLabel',
        placeholderKey: 'clinical.resources.emergencyCases.form.statusPlaceholder',
        hintKey: 'clinical.resources.emergencyCases.form.statusHint',
        options: EMERGENCY_CASE_STATUS_OPTIONS,
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.emergencyCases.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.emergencyCases.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.emergencyCases.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const severityValue = sanitizeString(item?.severity);
      if (!severityValue) return '';
      return `${t('clinical.resources.emergencyCases.detail.severityLabel')}: ${severityValue}`;
    },
    getInitialValues: (record, context) => ({
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      severity: sanitizeString(record?.severity || context?.severity || 'MEDIUM'),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values) => ({
      patient_id: sanitizeString(values.patient_id),
      severity: sanitizeString(values.severity),
      status: sanitizeString(values.status),
      facility_id: sanitizeString(values.facility_id) || undefined,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.emergencyCases.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.emergencyCases.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.emergencyCases.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.emergencyCases.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.emergencyCases.detail.severityLabel', valueKey: 'severity' },
      { labelKey: 'clinical.resources.emergencyCases.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.emergencyCases.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.emergencyCases.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS]: {
    id: CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS,
    routePath: `${EMERGENCY_ROUTE_ROOT}/triage-assessments`,
    i18nKey: 'clinical.resources.triageAssessments',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'emergency_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.triageAssessments.form.emergencyCaseIdLabel',
        placeholderKey: 'clinical.resources.triageAssessments.form.emergencyCaseIdPlaceholder',
        hintKey: 'clinical.resources.triageAssessments.form.emergencyCaseIdHint',
      },
      {
        name: 'triage_level',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.triageAssessments.form.triageLevelLabel',
        placeholderKey: 'clinical.resources.triageAssessments.form.triageLevelPlaceholder',
        hintKey: 'clinical.resources.triageAssessments.form.triageLevelHint',
        options: TRIAGE_LEVEL_OPTIONS,
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 5000,
        labelKey: 'clinical.resources.triageAssessments.form.notesLabel',
        placeholderKey: 'clinical.resources.triageAssessments.form.notesPlaceholder',
        hintKey: 'clinical.resources.triageAssessments.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.triage_level) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const emergencyCaseId = sanitizeString(item?.emergency_case_id);
      if (!emergencyCaseId) return '';
      return `${t('clinical.resources.triageAssessments.detail.emergencyCaseLabel')}: ${emergencyCaseId}`;
    },
    getInitialValues: (record, context) => ({
      emergency_case_id: sanitizeString(record?.emergency_case_id || context?.emergencyCaseId),
      triage_level: sanitizeString(record?.triage_level || context?.triageLevel || 'URGENT'),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values) => ({
      emergency_case_id: sanitizeString(values.emergency_case_id),
      triage_level: sanitizeString(values.triage_level),
      notes: sanitizeString(values.notes) || null,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.triageAssessments.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.triageAssessments.detail.emergencyCaseLabel', valueKey: 'emergency_case_id' },
      { labelKey: 'clinical.resources.triageAssessments.detail.triageLevelLabel', valueKey: 'triage_level' },
      { labelKey: 'clinical.resources.triageAssessments.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.triageAssessments.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.triageAssessments.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES]: {
    id: CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES,
    routePath: `${EMERGENCY_ROUTE_ROOT}/emergency-responses`,
    i18nKey: 'clinical.resources.emergencyResponses',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'emergency_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.emergencyResponses.form.emergencyCaseIdLabel',
        placeholderKey: 'clinical.resources.emergencyResponses.form.emergencyCaseIdPlaceholder',
        hintKey: 'clinical.resources.emergencyResponses.form.emergencyCaseIdHint',
      },
      {
        name: 'response_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.emergencyResponses.form.responseAtLabel',
        placeholderKey: 'clinical.resources.emergencyResponses.form.responseAtPlaceholder',
        hintKey: 'clinical.resources.emergencyResponses.form.responseAtHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 5000,
        labelKey: 'clinical.resources.emergencyResponses.form.notesLabel',
        placeholderKey: 'clinical.resources.emergencyResponses.form.notesPlaceholder',
        hintKey: 'clinical.resources.emergencyResponses.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.response_at) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const emergencyCaseId = sanitizeString(item?.emergency_case_id);
      if (!emergencyCaseId) return '';
      return `${t('clinical.resources.emergencyResponses.detail.emergencyCaseLabel')}: ${emergencyCaseId}`;
    },
    getInitialValues: (record, context) => ({
      emergency_case_id: sanitizeString(record?.emergency_case_id || context?.emergencyCaseId),
      response_at: sanitizeString(record?.response_at),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values) => ({
      emergency_case_id: sanitizeString(values.emergency_case_id),
      response_at: toIsoDateTime(values.response_at) || undefined,
      notes: sanitizeString(values.notes) || null,
    }),
    validate: (values, t) => {
      const errors = {};
      const responseAtError = buildDateTimeError(values.response_at, t);
      if (responseAtError) errors.response_at = responseAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.emergencyResponses.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.emergencyResponses.detail.emergencyCaseLabel', valueKey: 'emergency_case_id' },
      { labelKey: 'clinical.resources.emergencyResponses.detail.responseAtLabel', valueKey: 'response_at', type: 'datetime' },
      { labelKey: 'clinical.resources.emergencyResponses.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.emergencyResponses.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.emergencyResponses.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.AMBULANCES]: {
    id: CLINICAL_RESOURCE_IDS.AMBULANCES,
    routePath: `${EMERGENCY_ROUTE_ROOT}/ambulances`,
    i18nKey: 'clinical.resources.ambulances',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'identifier',
        type: 'text',
        required: true,
        maxLength: 120,
        labelKey: 'clinical.resources.ambulances.form.identifierLabel',
        placeholderKey: 'clinical.resources.ambulances.form.identifierPlaceholder',
        hintKey: 'clinical.resources.ambulances.form.identifierHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.ambulances.form.statusLabel',
        placeholderKey: 'clinical.resources.ambulances.form.statusPlaceholder',
        hintKey: 'clinical.resources.ambulances.form.statusHint',
        options: AMBULANCE_STATUS_OPTIONS,
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulances.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.ambulances.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.ambulances.form.facilityIdHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.identifier) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.ambulances.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      identifier: sanitizeString(record?.identifier),
      status: sanitizeString(record?.status || context?.status || 'AVAILABLE'),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
    }),
    toPayload: (values) => ({
      identifier: sanitizeString(values.identifier),
      status: sanitizeString(values.status),
      facility_id: sanitizeString(values.facility_id) || undefined,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.ambulances.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.ambulances.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.ambulances.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.ambulances.detail.identifierLabel', valueKey: 'identifier' },
      { labelKey: 'clinical.resources.ambulances.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.ambulances.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulances.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES]: {
    id: CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES,
    routePath: `${EMERGENCY_ROUTE_ROOT}/ambulance-dispatches`,
    i18nKey: 'clinical.resources.ambulanceDispatches',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'ambulance_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceDispatches.form.ambulanceIdLabel',
        placeholderKey: 'clinical.resources.ambulanceDispatches.form.ambulanceIdPlaceholder',
        hintKey: 'clinical.resources.ambulanceDispatches.form.ambulanceIdHint',
      },
      {
        name: 'emergency_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceDispatches.form.emergencyCaseIdLabel',
        placeholderKey: 'clinical.resources.ambulanceDispatches.form.emergencyCaseIdPlaceholder',
        hintKey: 'clinical.resources.ambulanceDispatches.form.emergencyCaseIdHint',
      },
      {
        name: 'dispatched_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceDispatches.form.dispatchedAtLabel',
        placeholderKey: 'clinical.resources.ambulanceDispatches.form.dispatchedAtPlaceholder',
        hintKey: 'clinical.resources.ambulanceDispatches.form.dispatchedAtHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.ambulanceDispatches.form.statusLabel',
        placeholderKey: 'clinical.resources.ambulanceDispatches.form.statusPlaceholder',
        hintKey: 'clinical.resources.ambulanceDispatches.form.statusHint',
        options: AMBULANCE_STATUS_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.ambulance_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const status = sanitizeString(item?.status);
      if (!status) return '';
      return `${t('clinical.resources.ambulanceDispatches.detail.statusLabel')}: ${status}`;
    },
    getInitialValues: (record, context) => ({
      ambulance_id: sanitizeString(record?.ambulance_id || context?.ambulanceId),
      emergency_case_id: sanitizeString(record?.emergency_case_id || context?.emergencyCaseId),
      dispatched_at: sanitizeString(record?.dispatched_at),
      status: sanitizeString(record?.status || context?.status || 'DISPATCHED'),
    }),
    toPayload: (values) => ({
      ambulance_id: sanitizeString(values.ambulance_id),
      emergency_case_id: sanitizeString(values.emergency_case_id),
      dispatched_at: toIsoDateTime(values.dispatched_at) || undefined,
      status: sanitizeString(values.status),
    }),
    validate: (values, t) => {
      const errors = {};
      const dispatchedAtError = buildDateTimeError(values.dispatched_at, t);
      if (dispatchedAtError) errors.dispatched_at = dispatchedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.ambulanceLabel', valueKey: 'ambulance_id' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.emergencyCaseLabel', valueKey: 'emergency_case_id' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.dispatchedAtLabel', valueKey: 'dispatched_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulanceDispatches.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS]: {
    id: CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS,
    routePath: `${EMERGENCY_ROUTE_ROOT}/ambulance-trips`,
    i18nKey: 'clinical.resources.ambulanceTrips',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'ambulance_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceTrips.form.ambulanceIdLabel',
        placeholderKey: 'clinical.resources.ambulanceTrips.form.ambulanceIdPlaceholder',
        hintKey: 'clinical.resources.ambulanceTrips.form.ambulanceIdHint',
      },
      {
        name: 'emergency_case_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceTrips.form.emergencyCaseIdLabel',
        placeholderKey: 'clinical.resources.ambulanceTrips.form.emergencyCaseIdPlaceholder',
        hintKey: 'clinical.resources.ambulanceTrips.form.emergencyCaseIdHint',
      },
      {
        name: 'started_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceTrips.form.startedAtLabel',
        placeholderKey: 'clinical.resources.ambulanceTrips.form.startedAtPlaceholder',
        hintKey: 'clinical.resources.ambulanceTrips.form.startedAtHint',
      },
      {
        name: 'ended_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.ambulanceTrips.form.endedAtLabel',
        placeholderKey: 'clinical.resources.ambulanceTrips.form.endedAtPlaceholder',
        hintKey: 'clinical.resources.ambulanceTrips.form.endedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.ambulance_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const emergencyCaseId = sanitizeString(item?.emergency_case_id);
      if (!emergencyCaseId) return '';
      return `${t('clinical.resources.ambulanceTrips.detail.emergencyCaseLabel')}: ${emergencyCaseId}`;
    },
    getInitialValues: (record, context) => ({
      ambulance_id: sanitizeString(record?.ambulance_id || context?.ambulanceId),
      emergency_case_id: sanitizeString(record?.emergency_case_id || context?.emergencyCaseId),
      started_at: sanitizeString(record?.started_at),
      ended_at: sanitizeString(record?.ended_at),
    }),
    toPayload: (values) => ({
      ambulance_id: sanitizeString(values.ambulance_id),
      emergency_case_id: sanitizeString(values.emergency_case_id),
      started_at: sanitizeString(values.started_at) ? toIsoDateTime(values.started_at) : null,
      ended_at: sanitizeString(values.ended_at) ? toIsoDateTime(values.ended_at) : null,
    }),
    validate: (values, t) => {
      const errors = {};
      const startedAtError = buildDateTimeError(values.started_at, t);
      const endedAtError = buildDateTimeError(values.ended_at, t);
      if (startedAtError) errors.started_at = startedAtError;
      if (endedAtError) errors.ended_at = endedAtError;
      if (!endedAtError) {
        const orderError = validateDateOrder(values.started_at, values.ended_at, t, { allowEqual: true });
        if (orderError) errors.ended_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.ambulanceTrips.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.ambulanceLabel', valueKey: 'ambulance_id' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.emergencyCaseLabel', valueKey: 'emergency_case_id' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.startedAtLabel', valueKey: 'started_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.endedAtLabel', valueKey: 'ended_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.ambulanceTrips.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_TESTS]: {
    id: CLINICAL_RESOURCE_IDS.LAB_TESTS,
    routePath: `${LAB_ROUTE_ROOT}/lab-tests`,
    i18nKey: 'clinical.resources.labTests',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'clinical.resources.labTests.form.nameLabel',
        placeholderKey: 'clinical.resources.labTests.form.namePlaceholder',
        hintKey: 'clinical.resources.labTests.form.nameHint',
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.labTests.form.codeLabel',
        placeholderKey: 'clinical.resources.labTests.form.codePlaceholder',
        hintKey: 'clinical.resources.labTests.form.codeHint',
      },
      {
        name: 'unit',
        type: 'text',
        required: false,
        maxLength: 40,
        labelKey: 'clinical.resources.labTests.form.unitLabel',
        placeholderKey: 'clinical.resources.labTests.form.unitPlaceholder',
        hintKey: 'clinical.resources.labTests.form.unitHint',
      },
      {
        name: 'reference_range',
        type: 'text',
        required: false,
        maxLength: 120,
        labelKey: 'clinical.resources.labTests.form.referenceRangeLabel',
        placeholderKey: 'clinical.resources.labTests.form.referenceRangePlaceholder',
        hintKey: 'clinical.resources.labTests.form.referenceRangeHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const codeValue = sanitizeString(item?.code);
      if (!codeValue) return '';
      return `${t('clinical.resources.labTests.detail.codeLabel')}: ${codeValue}`;
    },
    getInitialValues: (record) => ({
      name: sanitizeString(record?.name),
      code: sanitizeString(record?.code),
      unit: sanitizeString(record?.unit),
      reference_range: sanitizeString(record?.reference_range),
    }),
    toPayload: (values) => ({
      name: sanitizeString(values.name),
      code: sanitizeString(values.code) || null,
      unit: sanitizeString(values.unit) || null,
      reference_range: sanitizeString(values.reference_range) || null,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.labTests.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labTests.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.labTests.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'clinical.resources.labTests.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.labTests.detail.unitLabel', valueKey: 'unit' },
      { labelKey: 'clinical.resources.labTests.detail.referenceRangeLabel', valueKey: 'reference_range' },
      { labelKey: 'clinical.resources.labTests.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labTests.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_PANELS]: {
    id: CLINICAL_RESOURCE_IDS.LAB_PANELS,
    routePath: `${LAB_ROUTE_ROOT}/lab-panels`,
    i18nKey: 'clinical.resources.labPanels',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'clinical.resources.labPanels.form.nameLabel',
        placeholderKey: 'clinical.resources.labPanels.form.namePlaceholder',
        hintKey: 'clinical.resources.labPanels.form.nameHint',
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.labPanels.form.codeLabel',
        placeholderKey: 'clinical.resources.labPanels.form.codePlaceholder',
        hintKey: 'clinical.resources.labPanels.form.codeHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const codeValue = sanitizeString(item?.code);
      if (!codeValue) return '';
      return `${t('clinical.resources.labPanels.detail.codeLabel')}: ${codeValue}`;
    },
    getInitialValues: (record) => ({
      name: sanitizeString(record?.name),
      code: sanitizeString(record?.code),
    }),
    toPayload: (values) => ({
      name: sanitizeString(values.name),
      code: sanitizeString(values.code) || null,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.labPanels.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labPanels.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.labPanels.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'clinical.resources.labPanels.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.labPanels.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labPanels.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_ORDERS]: {
    id: CLINICAL_RESOURCE_IDS.LAB_ORDERS,
    routePath: `${LAB_ROUTE_ROOT}/lab-orders`,
    i18nKey: 'clinical.resources.labOrders',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labOrders.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.labOrders.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.labOrders.form.encounterIdHint',
      },
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.labOrders.form.patientIdLabel',
        placeholderKey: 'clinical.resources.labOrders.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.labOrders.form.patientIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.labOrders.form.statusLabel',
        placeholderKey: 'clinical.resources.labOrders.form.statusPlaceholder',
        hintKey: 'clinical.resources.labOrders.form.statusHint',
        options: LAB_ORDER_STATUS_OPTIONS,
      },
      {
        name: 'ordered_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labOrders.form.orderedAtLabel',
        placeholderKey: 'clinical.resources.labOrders.form.orderedAtPlaceholder',
        hintKey: 'clinical.resources.labOrders.form.orderedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.labOrders.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      status: sanitizeString(record?.status || context?.status || 'ORDERED'),
      ordered_at: sanitizeString(record?.ordered_at || context?.orderedAtFrom),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id) || null,
      patient_id: sanitizeString(values.patient_id),
      status: sanitizeString(values.status),
      ordered_at: toIsoDateTime(values.ordered_at) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const orderedAtError = buildDateTimeError(values.ordered_at, t);
      if (orderedAtError) errors.ordered_at = orderedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.labOrders.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labOrders.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.labOrders.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.labOrders.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.labOrders.detail.orderedAtLabel', valueKey: 'ordered_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labOrders.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labOrders.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_SAMPLES]: {
    id: CLINICAL_RESOURCE_IDS.LAB_SAMPLES,
    routePath: `${LAB_ROUTE_ROOT}/lab-samples`,
    i18nKey: 'clinical.resources.labSamples',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'lab_order_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.labSamples.form.labOrderIdLabel',
        placeholderKey: 'clinical.resources.labSamples.form.labOrderIdPlaceholder',
        hintKey: 'clinical.resources.labSamples.form.labOrderIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.labSamples.form.statusLabel',
        placeholderKey: 'clinical.resources.labSamples.form.statusPlaceholder',
        hintKey: 'clinical.resources.labSamples.form.statusHint',
        options: LAB_SAMPLE_STATUS_OPTIONS,
      },
      {
        name: 'collected_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labSamples.form.collectedAtLabel',
        placeholderKey: 'clinical.resources.labSamples.form.collectedAtPlaceholder',
        hintKey: 'clinical.resources.labSamples.form.collectedAtHint',
      },
      {
        name: 'received_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labSamples.form.receivedAtLabel',
        placeholderKey: 'clinical.resources.labSamples.form.receivedAtPlaceholder',
        hintKey: 'clinical.resources.labSamples.form.receivedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.lab_order_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.labSamples.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      lab_order_id: sanitizeString(record?.lab_order_id || context?.labOrderId),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
      collected_at: sanitizeString(record?.collected_at),
      received_at: sanitizeString(record?.received_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        status: sanitizeString(values.status),
        collected_at: sanitizeString(values.collected_at)
          ? toIsoDateTime(values.collected_at)
          : null,
        received_at: sanitizeString(values.received_at)
          ? toIsoDateTime(values.received_at)
          : null,
      };
      if (!isEdit) {
        payload.lab_order_id = sanitizeString(values.lab_order_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const collectedAtError = buildDateTimeError(values.collected_at, t);
      const receivedAtError = buildDateTimeError(values.received_at, t);
      if (collectedAtError) errors.collected_at = collectedAtError;
      if (receivedAtError) errors.received_at = receivedAtError;
      if (!receivedAtError) {
        const orderError = validateDateOrder(values.collected_at, values.received_at, t, { allowEqual: true });
        if (orderError) errors.received_at = orderError;
      }
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.labSamples.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labSamples.detail.labOrderLabel', valueKey: 'lab_order_id' },
      { labelKey: 'clinical.resources.labSamples.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.labSamples.detail.collectedAtLabel', valueKey: 'collected_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labSamples.detail.receivedAtLabel', valueKey: 'received_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labSamples.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labSamples.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_RESULTS]: {
    id: CLINICAL_RESOURCE_IDS.LAB_RESULTS,
    routePath: `${LAB_ROUTE_ROOT}/lab-results`,
    i18nKey: 'clinical.resources.labResults',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'lab_order_item_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.labResults.form.labOrderItemIdLabel',
        placeholderKey: 'clinical.resources.labResults.form.labOrderItemIdPlaceholder',
        hintKey: 'clinical.resources.labResults.form.labOrderItemIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.labResults.form.statusLabel',
        placeholderKey: 'clinical.resources.labResults.form.statusPlaceholder',
        hintKey: 'clinical.resources.labResults.form.statusHint',
        options: LAB_RESULT_STATUS_OPTIONS,
      },
      {
        name: 'result_value',
        type: 'text',
        required: false,
        maxLength: 120,
        labelKey: 'clinical.resources.labResults.form.resultValueLabel',
        placeholderKey: 'clinical.resources.labResults.form.resultValuePlaceholder',
        hintKey: 'clinical.resources.labResults.form.resultValueHint',
      },
      {
        name: 'result_unit',
        type: 'text',
        required: false,
        maxLength: 40,
        labelKey: 'clinical.resources.labResults.form.resultUnitLabel',
        placeholderKey: 'clinical.resources.labResults.form.resultUnitPlaceholder',
        hintKey: 'clinical.resources.labResults.form.resultUnitHint',
      },
      {
        name: 'result_text',
        type: 'text',
        required: false,
        maxLength: 5000,
        labelKey: 'clinical.resources.labResults.form.resultTextLabel',
        placeholderKey: 'clinical.resources.labResults.form.resultTextPlaceholder',
        hintKey: 'clinical.resources.labResults.form.resultTextHint',
      },
      {
        name: 'reported_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labResults.form.reportedAtLabel',
        placeholderKey: 'clinical.resources.labResults.form.reportedAtPlaceholder',
        hintKey: 'clinical.resources.labResults.form.reportedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.lab_order_item_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.labResults.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      lab_order_item_id: sanitizeString(record?.lab_order_item_id || context?.labOrderItemId),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
      result_value: sanitizeString(record?.result_value),
      result_unit: sanitizeString(record?.result_unit),
      result_text: sanitizeString(record?.result_text),
      reported_at: sanitizeString(record?.reported_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        status: sanitizeString(values.status),
        result_value: sanitizeString(values.result_value) || null,
        result_unit: sanitizeString(values.result_unit) || null,
        result_text: sanitizeString(values.result_text) || null,
        reported_at: sanitizeString(values.reported_at) ? toIsoDateTime(values.reported_at) : null,
      };
      if (!isEdit) {
        payload.lab_order_item_id = sanitizeString(values.lab_order_item_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const reportedAtError = buildDateTimeError(values.reported_at, t);
      if (reportedAtError) errors.reported_at = reportedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.labResults.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labResults.detail.labOrderItemLabel', valueKey: 'lab_order_item_id' },
      { labelKey: 'clinical.resources.labResults.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.labResults.detail.resultValueLabel', valueKey: 'result_value' },
      { labelKey: 'clinical.resources.labResults.detail.resultUnitLabel', valueKey: 'result_unit' },
      { labelKey: 'clinical.resources.labResults.detail.resultTextLabel', valueKey: 'result_text' },
      { labelKey: 'clinical.resources.labResults.detail.reportedAtLabel', valueKey: 'reported_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labResults.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labResults.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.LAB_QC_LOGS]: {
    id: CLINICAL_RESOURCE_IDS.LAB_QC_LOGS,
    routePath: `${LAB_ROUTE_ROOT}/lab-qc-logs`,
    i18nKey: 'clinical.resources.labQcLogs',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'lab_test_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.labQcLogs.form.labTestIdLabel',
        placeholderKey: 'clinical.resources.labQcLogs.form.labTestIdPlaceholder',
        hintKey: 'clinical.resources.labQcLogs.form.labTestIdHint',
      },
      {
        name: 'status',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.labQcLogs.form.statusLabel',
        placeholderKey: 'clinical.resources.labQcLogs.form.statusPlaceholder',
        hintKey: 'clinical.resources.labQcLogs.form.statusHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 5000,
        labelKey: 'clinical.resources.labQcLogs.form.notesLabel',
        placeholderKey: 'clinical.resources.labQcLogs.form.notesPlaceholder',
        hintKey: 'clinical.resources.labQcLogs.form.notesHint',
      },
      {
        name: 'logged_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.labQcLogs.form.loggedAtLabel',
        placeholderKey: 'clinical.resources.labQcLogs.form.loggedAtPlaceholder',
        hintKey: 'clinical.resources.labQcLogs.form.loggedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.status) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const labTestId = sanitizeString(item?.lab_test_id);
      if (!labTestId) return '';
      return `${t('clinical.resources.labQcLogs.detail.labTestLabel')}: ${labTestId}`;
    },
    getInitialValues: (record, context) => ({
      lab_test_id: sanitizeString(record?.lab_test_id || context?.labTestId),
      status: sanitizeString(record?.status),
      notes: sanitizeString(record?.notes),
      logged_at: sanitizeString(record?.logged_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        status: sanitizeString(values.status) || null,
        notes: sanitizeString(values.notes) || null,
        logged_at: toIsoDateTime(values.logged_at) || undefined,
      };
      if (!isEdit) {
        payload.lab_test_id = sanitizeString(values.lab_test_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const loggedAtError = buildDateTimeError(values.logged_at, t);
      if (loggedAtError) errors.logged_at = loggedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.labQcLogs.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.labQcLogs.detail.labTestLabel', valueKey: 'lab_test_id' },
      { labelKey: 'clinical.resources.labQcLogs.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.labQcLogs.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.labQcLogs.detail.loggedAtLabel', valueKey: 'logged_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labQcLogs.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.labQcLogs.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS]: {
    id: CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS,
    routePath: `${RADIOLOGY_ROUTE_ROOT}/radiology-tests`,
    i18nKey: 'clinical.resources.radiologyTests',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'clinical.resources.radiologyTests.form.nameLabel',
        placeholderKey: 'clinical.resources.radiologyTests.form.namePlaceholder',
        hintKey: 'clinical.resources.radiologyTests.form.nameHint',
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.radiologyTests.form.codeLabel',
        placeholderKey: 'clinical.resources.radiologyTests.form.codePlaceholder',
        hintKey: 'clinical.resources.radiologyTests.form.codeHint',
      },
      {
        name: 'modality',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.radiologyTests.form.modalityLabel',
        placeholderKey: 'clinical.resources.radiologyTests.form.modalityPlaceholder',
        hintKey: 'clinical.resources.radiologyTests.form.modalityHint',
        options: RADIOLOGY_MODALITY_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const modalityValue = sanitizeString(item?.modality);
      if (!modalityValue) return '';
      return `${t('clinical.resources.radiologyTests.detail.modalityLabel')}: ${modalityValue}`;
    },
    getInitialValues: (record, context) => ({
      name: sanitizeString(record?.name),
      code: sanitizeString(record?.code),
      modality: sanitizeString(record?.modality || context?.modality || 'XRAY'),
    }),
    toPayload: (values) => ({
      name: sanitizeString(values.name),
      code: sanitizeString(values.code) || null,
      modality: sanitizeString(values.modality),
    }),
    detailRows: [
      { labelKey: 'clinical.resources.radiologyTests.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.radiologyTests.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.radiologyTests.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'clinical.resources.radiologyTests.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.radiologyTests.detail.modalityLabel', valueKey: 'modality' },
      { labelKey: 'clinical.resources.radiologyTests.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.radiologyTests.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS]: {
    id: CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS,
    routePath: `${RADIOLOGY_ROUTE_ROOT}/radiology-orders`,
    i18nKey: 'clinical.resources.radiologyOrders',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyOrders.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.radiologyOrders.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.radiologyOrders.form.encounterIdHint',
      },
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyOrders.form.patientIdLabel',
        placeholderKey: 'clinical.resources.radiologyOrders.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.radiologyOrders.form.patientIdHint',
      },
      {
        name: 'radiology_test_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyOrders.form.radiologyTestIdLabel',
        placeholderKey: 'clinical.resources.radiologyOrders.form.radiologyTestIdPlaceholder',
        hintKey: 'clinical.resources.radiologyOrders.form.radiologyTestIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.radiologyOrders.form.statusLabel',
        placeholderKey: 'clinical.resources.radiologyOrders.form.statusPlaceholder',
        hintKey: 'clinical.resources.radiologyOrders.form.statusHint',
        options: RADIOLOGY_ORDER_STATUS_OPTIONS,
      },
      {
        name: 'ordered_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyOrders.form.orderedAtLabel',
        placeholderKey: 'clinical.resources.radiologyOrders.form.orderedAtPlaceholder',
        hintKey: 'clinical.resources.radiologyOrders.form.orderedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.radiologyOrders.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      radiology_test_id: sanitizeString(record?.radiology_test_id || context?.radiologyTestId),
      status: sanitizeString(record?.status || context?.status || 'ORDERED'),
      ordered_at: sanitizeString(record?.ordered_at || context?.orderedAtFrom),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id) || null,
      patient_id: sanitizeString(values.patient_id),
      radiology_test_id: sanitizeString(values.radiology_test_id) || null,
      status: sanitizeString(values.status),
      ordered_at: toIsoDateTime(values.ordered_at) || undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const orderedAtError = buildDateTimeError(values.ordered_at, t);
      if (orderedAtError) errors.ordered_at = orderedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.radiologyOrders.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.radiologyTestLabel', valueKey: 'radiology_test_id' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.orderedAtLabel', valueKey: 'ordered_at', type: 'datetime' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.radiologyOrders.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS]: {
    id: CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS,
    routePath: `${RADIOLOGY_ROUTE_ROOT}/radiology-results`,
    i18nKey: 'clinical.resources.radiologyResults',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'radiology_order_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyResults.form.radiologyOrderIdLabel',
        placeholderKey: 'clinical.resources.radiologyResults.form.radiologyOrderIdPlaceholder',
        hintKey: 'clinical.resources.radiologyResults.form.radiologyOrderIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.radiologyResults.form.statusLabel',
        placeholderKey: 'clinical.resources.radiologyResults.form.statusPlaceholder',
        hintKey: 'clinical.resources.radiologyResults.form.statusHint',
        options: RADIOLOGY_RESULT_STATUS_OPTIONS,
      },
      {
        name: 'report_text',
        type: 'text',
        required: false,
        maxLength: 65535,
        labelKey: 'clinical.resources.radiologyResults.form.reportTextLabel',
        placeholderKey: 'clinical.resources.radiologyResults.form.reportTextPlaceholder',
        hintKey: 'clinical.resources.radiologyResults.form.reportTextHint',
      },
      {
        name: 'reported_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.radiologyResults.form.reportedAtLabel',
        placeholderKey: 'clinical.resources.radiologyResults.form.reportedAtPlaceholder',
        hintKey: 'clinical.resources.radiologyResults.form.reportedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.radiology_order_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.radiologyResults.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      radiology_order_id: sanitizeString(record?.radiology_order_id || context?.radiologyOrderId),
      status: sanitizeString(record?.status || context?.status || 'DRAFT'),
      report_text: sanitizeString(record?.report_text),
      reported_at: sanitizeString(record?.reported_at),
    }),
    toPayload: (values) => ({
      radiology_order_id: sanitizeString(values.radiology_order_id),
      status: sanitizeString(values.status),
      report_text: sanitizeString(values.report_text) || null,
      reported_at: sanitizeString(values.reported_at) ? toIsoDateTime(values.reported_at) : null,
    }),
    validate: (values, t) => {
      const errors = {};
      const reportedAtError = buildDateTimeError(values.reported_at, t);
      if (reportedAtError) errors.reported_at = reportedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.radiologyResults.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.radiologyResults.detail.radiologyOrderLabel', valueKey: 'radiology_order_id' },
      { labelKey: 'clinical.resources.radiologyResults.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.radiologyResults.detail.reportTextLabel', valueKey: 'report_text' },
      { labelKey: 'clinical.resources.radiologyResults.detail.reportedAtLabel', valueKey: 'reported_at', type: 'datetime' },
      { labelKey: 'clinical.resources.radiologyResults.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.radiologyResults.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.IMAGING_STUDIES]: {
    id: CLINICAL_RESOURCE_IDS.IMAGING_STUDIES,
    routePath: `${RADIOLOGY_ROUTE_ROOT}/imaging-studies`,
    i18nKey: 'clinical.resources.imagingStudies',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'radiology_order_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.imagingStudies.form.radiologyOrderIdLabel',
        placeholderKey: 'clinical.resources.imagingStudies.form.radiologyOrderIdPlaceholder',
        hintKey: 'clinical.resources.imagingStudies.form.radiologyOrderIdHint',
      },
      {
        name: 'modality',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.imagingStudies.form.modalityLabel',
        placeholderKey: 'clinical.resources.imagingStudies.form.modalityPlaceholder',
        hintKey: 'clinical.resources.imagingStudies.form.modalityHint',
        options: RADIOLOGY_MODALITY_OPTIONS,
      },
      {
        name: 'performed_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.imagingStudies.form.performedAtLabel',
        placeholderKey: 'clinical.resources.imagingStudies.form.performedAtPlaceholder',
        hintKey: 'clinical.resources.imagingStudies.form.performedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.radiology_order_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const modalityValue = sanitizeString(item?.modality);
      if (!modalityValue) return '';
      return `${t('clinical.resources.imagingStudies.detail.modalityLabel')}: ${modalityValue}`;
    },
    getInitialValues: (record, context) => ({
      radiology_order_id: sanitizeString(record?.radiology_order_id || context?.radiologyOrderId),
      modality: sanitizeString(record?.modality || context?.modality || 'XRAY'),
      performed_at: sanitizeString(record?.performed_at || context?.performedAt),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        modality: sanitizeString(values.modality),
        performed_at: sanitizeString(values.performed_at) ? toIsoDateTime(values.performed_at) : null,
      };
      if (!isEdit) {
        payload.radiology_order_id = sanitizeString(values.radiology_order_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const performedAtError = buildDateTimeError(values.performed_at, t);
      if (performedAtError) errors.performed_at = performedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.imagingStudies.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.imagingStudies.detail.radiologyOrderLabel', valueKey: 'radiology_order_id' },
      { labelKey: 'clinical.resources.imagingStudies.detail.modalityLabel', valueKey: 'modality' },
      { labelKey: 'clinical.resources.imagingStudies.detail.performedAtLabel', valueKey: 'performed_at', type: 'datetime' },
      { labelKey: 'clinical.resources.imagingStudies.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.imagingStudies.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PACS_LINKS]: {
    id: CLINICAL_RESOURCE_IDS.PACS_LINKS,
    routePath: `${RADIOLOGY_ROUTE_ROOT}/pacs-links`,
    i18nKey: 'clinical.resources.pacsLinks',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'imaging_study_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.pacsLinks.form.imagingStudyIdLabel',
        placeholderKey: 'clinical.resources.pacsLinks.form.imagingStudyIdPlaceholder',
        hintKey: 'clinical.resources.pacsLinks.form.imagingStudyIdHint',
      },
      {
        name: 'url',
        type: 'text',
        required: true,
        maxLength: 2048,
        labelKey: 'clinical.resources.pacsLinks.form.urlLabel',
        placeholderKey: 'clinical.resources.pacsLinks.form.urlPlaceholder',
        hintKey: 'clinical.resources.pacsLinks.form.urlHint',
      },
      {
        name: 'expires_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.pacsLinks.form.expiresAtLabel',
        placeholderKey: 'clinical.resources.pacsLinks.form.expiresAtPlaceholder',
        hintKey: 'clinical.resources.pacsLinks.form.expiresAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.url) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const imagingStudyId = sanitizeString(item?.imaging_study_id);
      if (!imagingStudyId) return '';
      return `${t('clinical.resources.pacsLinks.detail.imagingStudyLabel')}: ${imagingStudyId}`;
    },
    getInitialValues: (record, context) => ({
      imaging_study_id: sanitizeString(record?.imaging_study_id || context?.imagingStudyId),
      url: sanitizeString(record?.url),
      expires_at: sanitizeString(record?.expires_at || context?.expiresAt),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        url: sanitizeString(values.url),
        expires_at: sanitizeString(values.expires_at) ? toIsoDateTime(values.expires_at) : null,
      };
      if (!isEdit) {
        payload.imaging_study_id = sanitizeString(values.imaging_study_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const urlError = buildUrlError(values.url, t);
      const expiresAtError = buildDateTimeError(values.expires_at, t);
      if (urlError) errors.url = urlError;
      if (expiresAtError) errors.expires_at = expiresAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.pacsLinks.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.pacsLinks.detail.imagingStudyLabel', valueKey: 'imaging_study_id' },
      { labelKey: 'clinical.resources.pacsLinks.detail.urlLabel', valueKey: 'url' },
      { labelKey: 'clinical.resources.pacsLinks.detail.expiresAtLabel', valueKey: 'expires_at', type: 'datetime' },
      { labelKey: 'clinical.resources.pacsLinks.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.pacsLinks.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.DRUGS]: {
    id: CLINICAL_RESOURCE_IDS.DRUGS,
    routePath: `${PHARMACY_ROUTE_ROOT}/drugs`,
    i18nKey: 'clinical.resources.drugs',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'clinical.resources.drugs.form.nameLabel',
        placeholderKey: 'clinical.resources.drugs.form.namePlaceholder',
        hintKey: 'clinical.resources.drugs.form.nameHint',
      },
      {
        name: 'code',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.drugs.form.codeLabel',
        placeholderKey: 'clinical.resources.drugs.form.codePlaceholder',
        hintKey: 'clinical.resources.drugs.form.codeHint',
      },
      {
        name: 'form',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.drugs.form.formLabel',
        placeholderKey: 'clinical.resources.drugs.form.formPlaceholder',
        hintKey: 'clinical.resources.drugs.form.formHint',
      },
      {
        name: 'strength',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.drugs.form.strengthLabel',
        placeholderKey: 'clinical.resources.drugs.form.strengthPlaceholder',
        hintKey: 'clinical.resources.drugs.form.strengthHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const codeValue = sanitizeString(item?.code);
      if (!codeValue) return '';
      return `${t('clinical.resources.drugs.detail.codeLabel')}: ${codeValue}`;
    },
    getInitialValues: (record, context) => ({
      name: sanitizeString(record?.name || context?.name),
      code: sanitizeString(record?.code || context?.code),
      form: sanitizeString(record?.form || context?.form),
      strength: sanitizeString(record?.strength || context?.strength),
    }),
    toPayload: (values) => ({
      name: sanitizeString(values.name),
      code: sanitizeString(values.code) || null,
      form: sanitizeString(values.form) || null,
      strength: sanitizeString(values.strength) || null,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.drugs.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.drugs.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.drugs.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'clinical.resources.drugs.detail.codeLabel', valueKey: 'code' },
      { labelKey: 'clinical.resources.drugs.detail.formLabel', valueKey: 'form' },
      { labelKey: 'clinical.resources.drugs.detail.strengthLabel', valueKey: 'strength' },
      { labelKey: 'clinical.resources.drugs.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.drugs.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.DRUG_BATCHES]: {
    id: CLINICAL_RESOURCE_IDS.DRUG_BATCHES,
    routePath: `${PHARMACY_ROUTE_ROOT}/drug-batches`,
    i18nKey: 'clinical.resources.drugBatches',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'drug_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.drugBatches.form.drugIdLabel',
        placeholderKey: 'clinical.resources.drugBatches.form.drugIdPlaceholder',
        hintKey: 'clinical.resources.drugBatches.form.drugIdHint',
      },
      {
        name: 'batch_number',
        type: 'text',
        required: true,
        maxLength: 80,
        labelKey: 'clinical.resources.drugBatches.form.batchNumberLabel',
        placeholderKey: 'clinical.resources.drugBatches.form.batchNumberPlaceholder',
        hintKey: 'clinical.resources.drugBatches.form.batchNumberHint',
      },
      {
        name: 'expiry_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.drugBatches.form.expiryDateLabel',
        placeholderKey: 'clinical.resources.drugBatches.form.expiryDatePlaceholder',
        hintKey: 'clinical.resources.drugBatches.form.expiryDateHint',
      },
      {
        name: 'quantity',
        type: 'text',
        required: false,
        maxLength: 12,
        labelKey: 'clinical.resources.drugBatches.form.quantityLabel',
        placeholderKey: 'clinical.resources.drugBatches.form.quantityPlaceholder',
        hintKey: 'clinical.resources.drugBatches.form.quantityHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.batch_number) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const drugIdValue = sanitizeString(item?.drug_id);
      if (!drugIdValue) return '';
      return `${t('clinical.resources.drugBatches.detail.drugLabel')}: ${drugIdValue}`;
    },
    getInitialValues: (record, context) => ({
      drug_id: sanitizeString(record?.drug_id || context?.drugId),
      batch_number: sanitizeString(record?.batch_number || context?.batchNumber),
      expiry_date: sanitizeString(record?.expiry_date),
      quantity: sanitizeString(record?.quantity),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        batch_number: sanitizeString(values.batch_number),
        expiry_date: sanitizeString(values.expiry_date) ? toIsoDateTime(values.expiry_date) : null,
      };
      const quantity = parseOptionalInteger(values.quantity);
      if (Number.isInteger(quantity) && quantity >= 0) {
        payload.quantity = quantity;
      }
      if (!isEdit) {
        payload.drug_id = sanitizeString(values.drug_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const expiryDateError = buildDateTimeError(values.expiry_date, t);
      const quantityError = buildIntegerError(values.quantity, t, { min: 0, required: false });
      if (expiryDateError) errors.expiry_date = expiryDateError;
      if (quantityError) errors.quantity = quantityError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.drugBatches.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.drugBatches.detail.drugLabel', valueKey: 'drug_id' },
      { labelKey: 'clinical.resources.drugBatches.detail.batchNumberLabel', valueKey: 'batch_number' },
      { labelKey: 'clinical.resources.drugBatches.detail.expiryDateLabel', valueKey: 'expiry_date', type: 'datetime' },
      { labelKey: 'clinical.resources.drugBatches.detail.quantityLabel', valueKey: 'quantity' },
      { labelKey: 'clinical.resources.drugBatches.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.drugBatches.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.FORMULARY_ITEMS]: {
    id: CLINICAL_RESOURCE_IDS.FORMULARY_ITEMS,
    routePath: `${PHARMACY_ROUTE_ROOT}/formulary-items`,
    i18nKey: 'clinical.resources.formularyItems',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'drug_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.formularyItems.form.drugIdLabel',
        placeholderKey: 'clinical.resources.formularyItems.form.drugIdPlaceholder',
        hintKey: 'clinical.resources.formularyItems.form.drugIdHint',
      },
      {
        name: 'is_active',
        type: 'switch',
        required: false,
        labelKey: 'clinical.resources.formularyItems.form.isActiveLabel',
        hintKey: 'clinical.resources.formularyItems.form.isActiveHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.drug_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      if (typeof item?.is_active === 'boolean') {
        return `${t('clinical.resources.formularyItems.detail.isActiveLabel')}: ${item.is_active ? t('common.on') : t('common.off')}`;
      }
      return '';
    },
    getInitialValues: (record, context) => ({
      drug_id: sanitizeString(record?.drug_id || context?.drugId),
      is_active:
        typeof record?.is_active === 'boolean'
          ? record.is_active
          : typeof context?.isActive === 'boolean'
            ? context.isActive
            : true,
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        is_active: Boolean(values.is_active),
      };
      if (!isEdit) {
        payload.drug_id = sanitizeString(values.drug_id);
      }
      return payload;
    },
    detailRows: [
      { labelKey: 'clinical.resources.formularyItems.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.formularyItems.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.formularyItems.detail.drugLabel', valueKey: 'drug_id' },
      { labelKey: 'clinical.resources.formularyItems.detail.isActiveLabel', valueKey: 'is_active', type: 'boolean' },
      { labelKey: 'clinical.resources.formularyItems.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.formularyItems.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PHARMACY_ORDERS]: {
    id: CLINICAL_RESOURCE_IDS.PHARMACY_ORDERS,
    routePath: `${PHARMACY_ROUTE_ROOT}/pharmacy-orders`,
    i18nKey: 'clinical.resources.pharmacyOrders',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'encounter_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.pharmacyOrders.form.encounterIdLabel',
        placeholderKey: 'clinical.resources.pharmacyOrders.form.encounterIdPlaceholder',
        hintKey: 'clinical.resources.pharmacyOrders.form.encounterIdHint',
      },
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.pharmacyOrders.form.patientIdLabel',
        placeholderKey: 'clinical.resources.pharmacyOrders.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.pharmacyOrders.form.patientIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.pharmacyOrders.form.statusLabel',
        placeholderKey: 'clinical.resources.pharmacyOrders.form.statusPlaceholder',
        hintKey: 'clinical.resources.pharmacyOrders.form.statusHint',
        options: PHARMACY_ORDER_STATUS_OPTIONS,
      },
      {
        name: 'ordered_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.pharmacyOrders.form.orderedAtLabel',
        placeholderKey: 'clinical.resources.pharmacyOrders.form.orderedAtPlaceholder',
        hintKey: 'clinical.resources.pharmacyOrders.form.orderedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.patient_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.pharmacyOrders.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      encounter_id: sanitizeString(record?.encounter_id || context?.encounterId),
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      status: sanitizeString(record?.status || context?.status || 'ORDERED'),
      ordered_at: sanitizeString(record?.ordered_at || context?.orderedAtFrom),
    }),
    toPayload: (values) => ({
      encounter_id: sanitizeString(values.encounter_id) || null,
      patient_id: sanitizeString(values.patient_id),
      status: sanitizeString(values.status) || undefined,
      ordered_at: sanitizeString(values.ordered_at) ? toIsoDateTime(values.ordered_at) : undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const orderedAtError = buildDateTimeError(values.ordered_at, t);
      if (orderedAtError) errors.ordered_at = orderedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.pharmacyOrders.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.pharmacyOrders.detail.encounterLabel', valueKey: 'encounter_id' },
      { labelKey: 'clinical.resources.pharmacyOrders.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.pharmacyOrders.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.pharmacyOrders.detail.orderedAtLabel', valueKey: 'ordered_at', type: 'datetime' },
      { labelKey: 'clinical.resources.pharmacyOrders.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.pharmacyOrders.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.DISPENSE_LOGS]: {
    id: CLINICAL_RESOURCE_IDS.DISPENSE_LOGS,
    routePath: `${PHARMACY_ROUTE_ROOT}/dispense-logs`,
    i18nKey: 'clinical.resources.dispenseLogs',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'pharmacy_order_item_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.dispenseLogs.form.pharmacyOrderItemIdLabel',
        placeholderKey: 'clinical.resources.dispenseLogs.form.pharmacyOrderItemIdPlaceholder',
        hintKey: 'clinical.resources.dispenseLogs.form.pharmacyOrderItemIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.dispenseLogs.form.statusLabel',
        placeholderKey: 'clinical.resources.dispenseLogs.form.statusPlaceholder',
        hintKey: 'clinical.resources.dispenseLogs.form.statusHint',
        options: DISPENSE_LOG_STATUS_OPTIONS,
      },
      {
        name: 'dispensed_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.dispenseLogs.form.dispensedAtLabel',
        placeholderKey: 'clinical.resources.dispenseLogs.form.dispensedAtPlaceholder',
        hintKey: 'clinical.resources.dispenseLogs.form.dispensedAtHint',
      },
      {
        name: 'quantity_dispensed',
        type: 'text',
        required: false,
        maxLength: 12,
        labelKey: 'clinical.resources.dispenseLogs.form.quantityDispensedLabel',
        placeholderKey: 'clinical.resources.dispenseLogs.form.quantityDispensedPlaceholder',
        hintKey: 'clinical.resources.dispenseLogs.form.quantityDispensedHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.pharmacy_order_item_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.dispenseLogs.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      pharmacy_order_item_id: sanitizeString(record?.pharmacy_order_item_id || context?.pharmacyOrderItemId),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
      dispensed_at: sanitizeString(record?.dispensed_at || context?.dispensedAtFrom),
      quantity_dispensed: sanitizeString(record?.quantity_dispensed ?? 0),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        status: sanitizeString(values.status),
        dispensed_at: sanitizeString(values.dispensed_at) ? toIsoDateTime(values.dispensed_at) : null,
        quantity_dispensed: parseRequiredInteger(values.quantity_dispensed, 0),
      };
      if (!isEdit) {
        payload.pharmacy_order_item_id = sanitizeString(values.pharmacy_order_item_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const dispensedAtError = buildDateTimeError(values.dispensed_at, t);
      const quantityError = buildIntegerError(values.quantity_dispensed, t, { min: 0, required: false });
      if (dispensedAtError) errors.dispensed_at = dispensedAtError;
      if (quantityError) errors.quantity_dispensed = quantityError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.dispenseLogs.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.dispenseLogs.detail.pharmacyOrderItemLabel', valueKey: 'pharmacy_order_item_id' },
      { labelKey: 'clinical.resources.dispenseLogs.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.dispenseLogs.detail.dispensedAtLabel', valueKey: 'dispensed_at', type: 'datetime' },
      { labelKey: 'clinical.resources.dispenseLogs.detail.quantityDispensedLabel', valueKey: 'quantity_dispensed' },
      { labelKey: 'clinical.resources.dispenseLogs.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.dispenseLogs.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ADVERSE_EVENTS]: {
    id: CLINICAL_RESOURCE_IDS.ADVERSE_EVENTS,
    routePath: `${PHARMACY_ROUTE_ROOT}/adverse-events`,
    i18nKey: 'clinical.resources.adverseEvents',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'patient_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.adverseEvents.form.patientIdLabel',
        placeholderKey: 'clinical.resources.adverseEvents.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.adverseEvents.form.patientIdHint',
      },
      {
        name: 'drug_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.adverseEvents.form.drugIdLabel',
        placeholderKey: 'clinical.resources.adverseEvents.form.drugIdPlaceholder',
        hintKey: 'clinical.resources.adverseEvents.form.drugIdHint',
      },
      {
        name: 'severity',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.adverseEvents.form.severityLabel',
        placeholderKey: 'clinical.resources.adverseEvents.form.severityPlaceholder',
        hintKey: 'clinical.resources.adverseEvents.form.severityHint',
        options: ADVERSE_EVENT_SEVERITY_OPTIONS,
      },
      {
        name: 'description',
        type: 'text',
        required: false,
        maxLength: 5000,
        labelKey: 'clinical.resources.adverseEvents.form.descriptionLabel',
        placeholderKey: 'clinical.resources.adverseEvents.form.descriptionPlaceholder',
        hintKey: 'clinical.resources.adverseEvents.form.descriptionHint',
      },
      {
        name: 'reported_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.adverseEvents.form.reportedAtLabel',
        placeholderKey: 'clinical.resources.adverseEvents.form.reportedAtPlaceholder',
        hintKey: 'clinical.resources.adverseEvents.form.reportedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.description) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const severityValue = sanitizeString(item?.severity);
      if (!severityValue) return '';
      return `${t('clinical.resources.adverseEvents.detail.severityLabel')}: ${severityValue}`;
    },
    getInitialValues: (record, context) => ({
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      drug_id: sanitizeString(record?.drug_id || context?.drugId),
      severity: sanitizeString(record?.severity || context?.severity || 'MILD'),
      description: sanitizeString(record?.description),
      reported_at: sanitizeString(record?.reported_at || context?.reportedAtFrom),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        drug_id: sanitizeString(values.drug_id) || null,
        severity: sanitizeString(values.severity),
        description: sanitizeString(values.description) || null,
        reported_at: sanitizeString(values.reported_at) ? toIsoDateTime(values.reported_at) : undefined,
      };
      if (!isEdit) {
        payload.patient_id = sanitizeString(values.patient_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const reportedAtError = buildDateTimeError(values.reported_at, t);
      if (reportedAtError) errors.reported_at = reportedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.adverseEvents.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.adverseEvents.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.adverseEvents.detail.drugLabel', valueKey: 'drug_id' },
      { labelKey: 'clinical.resources.adverseEvents.detail.severityLabel', valueKey: 'severity' },
      { labelKey: 'clinical.resources.adverseEvents.detail.descriptionLabel', valueKey: 'description' },
      { labelKey: 'clinical.resources.adverseEvents.detail.reportedAtLabel', valueKey: 'reported_at', type: 'datetime' },
      { labelKey: 'clinical.resources.adverseEvents.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.adverseEvents.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.INVENTORY_ITEMS]: {
    id: CLINICAL_RESOURCE_IDS.INVENTORY_ITEMS,
    routePath: `${INVENTORY_ROUTE_ROOT}/inventory-items`,
    i18nKey: 'clinical.resources.inventoryItems',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'clinical.resources.inventoryItems.form.nameLabel',
        placeholderKey: 'clinical.resources.inventoryItems.form.namePlaceholder',
        hintKey: 'clinical.resources.inventoryItems.form.nameHint',
      },
      {
        name: 'category',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.inventoryItems.form.categoryLabel',
        placeholderKey: 'clinical.resources.inventoryItems.form.categoryPlaceholder',
        hintKey: 'clinical.resources.inventoryItems.form.categoryHint',
        options: INVENTORY_CATEGORY_OPTIONS,
      },
      {
        name: 'sku',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.inventoryItems.form.skuLabel',
        placeholderKey: 'clinical.resources.inventoryItems.form.skuPlaceholder',
        hintKey: 'clinical.resources.inventoryItems.form.skuHint',
      },
      {
        name: 'unit',
        type: 'text',
        required: false,
        maxLength: 40,
        labelKey: 'clinical.resources.inventoryItems.form.unitLabel',
        placeholderKey: 'clinical.resources.inventoryItems.form.unitPlaceholder',
        hintKey: 'clinical.resources.inventoryItems.form.unitHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const categoryValue = sanitizeString(item?.category);
      if (!categoryValue) return '';
      return `${t('clinical.resources.inventoryItems.detail.categoryLabel')}: ${categoryValue}`;
    },
    getInitialValues: (record, context) => ({
      name: sanitizeString(record?.name || context?.name),
      category: sanitizeString(record?.category || context?.category || 'SUPPLY'),
      sku: sanitizeString(record?.sku || context?.sku),
      unit: sanitizeString(record?.unit || context?.unit),
    }),
    toPayload: (values) => ({
      name: sanitizeString(values.name),
      category: sanitizeString(values.category),
      sku: sanitizeString(values.sku) || null,
      unit: sanitizeString(values.unit) || null,
    }),
    detailRows: [
      { labelKey: 'clinical.resources.inventoryItems.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.inventoryItems.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.inventoryItems.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'clinical.resources.inventoryItems.detail.categoryLabel', valueKey: 'category' },
      { labelKey: 'clinical.resources.inventoryItems.detail.skuLabel', valueKey: 'sku' },
      { labelKey: 'clinical.resources.inventoryItems.detail.unitLabel', valueKey: 'unit' },
      { labelKey: 'clinical.resources.inventoryItems.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.inventoryItems.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.INVENTORY_STOCKS]: {
    id: CLINICAL_RESOURCE_IDS.INVENTORY_STOCKS,
    routePath: `${INVENTORY_ROUTE_ROOT}/inventory-stocks`,
    i18nKey: 'clinical.resources.inventoryStocks',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'inventory_item_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.inventoryStocks.form.inventoryItemIdLabel',
        placeholderKey: 'clinical.resources.inventoryStocks.form.inventoryItemIdPlaceholder',
        hintKey: 'clinical.resources.inventoryStocks.form.inventoryItemIdHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.inventoryStocks.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.inventoryStocks.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.inventoryStocks.form.facilityIdHint',
      },
      {
        name: 'quantity',
        type: 'text',
        required: true,
        maxLength: 12,
        labelKey: 'clinical.resources.inventoryStocks.form.quantityLabel',
        placeholderKey: 'clinical.resources.inventoryStocks.form.quantityPlaceholder',
        hintKey: 'clinical.resources.inventoryStocks.form.quantityHint',
      },
      {
        name: 'reorder_level',
        type: 'text',
        required: true,
        maxLength: 12,
        labelKey: 'clinical.resources.inventoryStocks.form.reorderLevelLabel',
        placeholderKey: 'clinical.resources.inventoryStocks.form.reorderLevelPlaceholder',
        hintKey: 'clinical.resources.inventoryStocks.form.reorderLevelHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.inventory_item_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => `${t('clinical.resources.inventoryStocks.detail.quantityLabel')}: ${sanitizeString(item?.quantity) || '0'}`,
    getInitialValues: (record, context) => ({
      inventory_item_id: sanitizeString(record?.inventory_item_id || context?.inventoryItemId),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      quantity: sanitizeString(record?.quantity),
      reorder_level: sanitizeString(record?.reorder_level ?? 0),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        facility_id: sanitizeString(values.facility_id) || null,
        quantity: parseRequiredInteger(values.quantity, 0),
        reorder_level: parseRequiredInteger(values.reorder_level, 0),
      };
      if (!isEdit) {
        payload.inventory_item_id = sanitizeString(values.inventory_item_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const quantityError = buildIntegerError(values.quantity, t, { min: 0, required: true });
      const reorderLevelError = buildIntegerError(values.reorder_level, t, { min: 0, required: true });
      if (quantityError) errors.quantity = quantityError;
      if (reorderLevelError) errors.reorder_level = reorderLevelError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.inventoryStocks.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.inventoryStocks.detail.inventoryItemLabel', valueKey: 'inventory_item_id' },
      { labelKey: 'clinical.resources.inventoryStocks.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.inventoryStocks.detail.quantityLabel', valueKey: 'quantity' },
      { labelKey: 'clinical.resources.inventoryStocks.detail.reorderLevelLabel', valueKey: 'reorder_level' },
      { labelKey: 'clinical.resources.inventoryStocks.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.inventoryStocks.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.STOCK_MOVEMENTS]: {
    id: CLINICAL_RESOURCE_IDS.STOCK_MOVEMENTS,
    routePath: `${INVENTORY_ROUTE_ROOT}/stock-movements`,
    i18nKey: 'clinical.resources.stockMovements',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'inventory_item_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.stockMovements.form.inventoryItemIdLabel',
        placeholderKey: 'clinical.resources.stockMovements.form.inventoryItemIdPlaceholder',
        hintKey: 'clinical.resources.stockMovements.form.inventoryItemIdHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.stockMovements.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.stockMovements.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.stockMovements.form.facilityIdHint',
      },
      {
        name: 'movement_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.stockMovements.form.movementTypeLabel',
        placeholderKey: 'clinical.resources.stockMovements.form.movementTypePlaceholder',
        hintKey: 'clinical.resources.stockMovements.form.movementTypeHint',
        options: STOCK_MOVEMENT_TYPE_OPTIONS,
      },
      {
        name: 'reason',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.stockMovements.form.reasonLabel',
        placeholderKey: 'clinical.resources.stockMovements.form.reasonPlaceholder',
        hintKey: 'clinical.resources.stockMovements.form.reasonHint',
        options: STOCK_MOVEMENT_REASON_OPTIONS,
      },
      {
        name: 'quantity',
        type: 'text',
        required: true,
        maxLength: 12,
        labelKey: 'clinical.resources.stockMovements.form.quantityLabel',
        placeholderKey: 'clinical.resources.stockMovements.form.quantityPlaceholder',
        hintKey: 'clinical.resources.stockMovements.form.quantityHint',
      },
      {
        name: 'occurred_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.stockMovements.form.occurredAtLabel',
        placeholderKey: 'clinical.resources.stockMovements.form.occurredAtPlaceholder',
        hintKey: 'clinical.resources.stockMovements.form.occurredAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.inventory_item_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const movementTypeValue = sanitizeString(item?.movement_type);
      if (!movementTypeValue) return '';
      return `${t('clinical.resources.stockMovements.detail.movementTypeLabel')}: ${movementTypeValue}`;
    },
    getInitialValues: (record, context) => ({
      inventory_item_id: sanitizeString(record?.inventory_item_id || context?.inventoryItemId),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      movement_type: sanitizeString(record?.movement_type || context?.movementType || 'INBOUND'),
      reason: sanitizeString(record?.reason || context?.reason || 'OTHER'),
      quantity: sanitizeString(record?.quantity),
      occurred_at: sanitizeString(record?.occurred_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        facility_id: sanitizeString(values.facility_id) || null,
        movement_type: sanitizeString(values.movement_type),
        reason: sanitizeString(values.reason),
        quantity: parseRequiredInteger(values.quantity, 0),
        occurred_at: sanitizeString(values.occurred_at) ? toIsoDateTime(values.occurred_at) : undefined,
      };
      if (!isEdit) {
        payload.inventory_item_id = sanitizeString(values.inventory_item_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const quantityError = buildIntegerError(values.quantity, t, { required: true });
      const occurredAtError = buildDateTimeError(values.occurred_at, t);
      if (quantityError) errors.quantity = quantityError;
      if (occurredAtError) errors.occurred_at = occurredAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.stockMovements.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.stockMovements.detail.inventoryItemLabel', valueKey: 'inventory_item_id' },
      { labelKey: 'clinical.resources.stockMovements.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.stockMovements.detail.movementTypeLabel', valueKey: 'movement_type' },
      { labelKey: 'clinical.resources.stockMovements.detail.reasonLabel', valueKey: 'reason' },
      { labelKey: 'clinical.resources.stockMovements.detail.quantityLabel', valueKey: 'quantity' },
      { labelKey: 'clinical.resources.stockMovements.detail.occurredAtLabel', valueKey: 'occurred_at', type: 'datetime' },
      { labelKey: 'clinical.resources.stockMovements.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.stockMovements.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.SUPPLIERS]: {
    id: CLINICAL_RESOURCE_IDS.SUPPLIERS,
    routePath: `${INVENTORY_ROUTE_ROOT}/suppliers`,
    i18nKey: 'clinical.resources.suppliers',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'clinical.resources.suppliers.form.nameLabel',
        placeholderKey: 'clinical.resources.suppliers.form.namePlaceholder',
        hintKey: 'clinical.resources.suppliers.form.nameHint',
      },
      {
        name: 'contact_email',
        type: 'text',
        required: false,
        maxLength: 255,
        labelKey: 'clinical.resources.suppliers.form.contactEmailLabel',
        placeholderKey: 'clinical.resources.suppliers.form.contactEmailPlaceholder',
        hintKey: 'clinical.resources.suppliers.form.contactEmailHint',
      },
      {
        name: 'phone',
        type: 'text',
        required: false,
        maxLength: 40,
        labelKey: 'clinical.resources.suppliers.form.phoneLabel',
        placeholderKey: 'clinical.resources.suppliers.form.phonePlaceholder',
        hintKey: 'clinical.resources.suppliers.form.phoneHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const contactEmailValue = sanitizeString(item?.contact_email);
      if (!contactEmailValue) return '';
      return `${t('clinical.resources.suppliers.detail.contactEmailLabel')}: ${contactEmailValue}`;
    },
    getInitialValues: (record, context) => ({
      name: sanitizeString(record?.name || context?.name),
      contact_email: sanitizeString(record?.contact_email || context?.contactEmail),
      phone: sanitizeString(record?.phone),
    }),
    toPayload: (values) => ({
      name: sanitizeString(values.name),
      contact_email: sanitizeString(values.contact_email) || null,
      phone: sanitizeString(values.phone) || null,
    }),
    validate: (values, t) => {
      const errors = {};
      const contactEmailError = buildEmailError(values.contact_email, t);
      if (contactEmailError) errors.contact_email = contactEmailError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.suppliers.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.suppliers.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.suppliers.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'clinical.resources.suppliers.detail.contactEmailLabel', valueKey: 'contact_email' },
      { labelKey: 'clinical.resources.suppliers.detail.phoneLabel', valueKey: 'phone' },
      { labelKey: 'clinical.resources.suppliers.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.suppliers.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PURCHASE_ORDERS]: {
    id: CLINICAL_RESOURCE_IDS.PURCHASE_ORDERS,
    routePath: `${INVENTORY_ROUTE_ROOT}/purchase-orders`,
    i18nKey: 'clinical.resources.purchaseOrders',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'purchase_request_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.purchaseOrders.form.purchaseRequestIdLabel',
        placeholderKey: 'clinical.resources.purchaseOrders.form.purchaseRequestIdPlaceholder',
        hintKey: 'clinical.resources.purchaseOrders.form.purchaseRequestIdHint',
      },
      {
        name: 'supplier_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.purchaseOrders.form.supplierIdLabel',
        placeholderKey: 'clinical.resources.purchaseOrders.form.supplierIdPlaceholder',
        hintKey: 'clinical.resources.purchaseOrders.form.supplierIdHint',
      },
      {
        name: 'status',
        type: 'text',
        required: true,
        maxLength: 60,
        labelKey: 'clinical.resources.purchaseOrders.form.statusLabel',
        placeholderKey: 'clinical.resources.purchaseOrders.form.statusPlaceholder',
        hintKey: 'clinical.resources.purchaseOrders.form.statusHint',
      },
      {
        name: 'ordered_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.purchaseOrders.form.orderedAtLabel',
        placeholderKey: 'clinical.resources.purchaseOrders.form.orderedAtPlaceholder',
        hintKey: 'clinical.resources.purchaseOrders.form.orderedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.status) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const supplierIdValue = sanitizeString(item?.supplier_id);
      if (!supplierIdValue) return '';
      return `${t('clinical.resources.purchaseOrders.detail.supplierLabel')}: ${supplierIdValue}`;
    },
    getInitialValues: (record, context) => ({
      purchase_request_id: sanitizeString(record?.purchase_request_id || context?.purchaseRequestId),
      supplier_id: sanitizeString(record?.supplier_id || context?.supplierId),
      status: sanitizeString(record?.status || context?.status),
      ordered_at: sanitizeString(record?.ordered_at),
    }),
    toPayload: (values) => ({
      purchase_request_id: sanitizeString(values.purchase_request_id) || null,
      supplier_id: sanitizeString(values.supplier_id) || null,
      status: sanitizeString(values.status),
      ordered_at: sanitizeString(values.ordered_at) ? toIsoDateTime(values.ordered_at) : undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const orderedAtError = buildDateTimeError(values.ordered_at, t);
      if (orderedAtError) errors.ordered_at = orderedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.purchaseOrders.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.purchaseOrders.detail.purchaseRequestLabel', valueKey: 'purchase_request_id' },
      { labelKey: 'clinical.resources.purchaseOrders.detail.supplierLabel', valueKey: 'supplier_id' },
      { labelKey: 'clinical.resources.purchaseOrders.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.purchaseOrders.detail.orderedAtLabel', valueKey: 'ordered_at', type: 'datetime' },
      { labelKey: 'clinical.resources.purchaseOrders.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.purchaseOrders.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.GOODS_RECEIPTS]: {
    id: CLINICAL_RESOURCE_IDS.GOODS_RECEIPTS,
    routePath: `${INVENTORY_ROUTE_ROOT}/goods-receipts`,
    i18nKey: 'clinical.resources.goodsReceipts',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'purchase_order_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.goodsReceipts.form.purchaseOrderIdLabel',
        placeholderKey: 'clinical.resources.goodsReceipts.form.purchaseOrderIdPlaceholder',
        hintKey: 'clinical.resources.goodsReceipts.form.purchaseOrderIdHint',
      },
      {
        name: 'received_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.goodsReceipts.form.receivedAtLabel',
        placeholderKey: 'clinical.resources.goodsReceipts.form.receivedAtPlaceholder',
        hintKey: 'clinical.resources.goodsReceipts.form.receivedAtHint',
      },
      {
        name: 'status',
        type: 'text',
        required: true,
        maxLength: 60,
        labelKey: 'clinical.resources.goodsReceipts.form.statusLabel',
        placeholderKey: 'clinical.resources.goodsReceipts.form.statusPlaceholder',
        hintKey: 'clinical.resources.goodsReceipts.form.statusHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.purchase_order_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.goodsReceipts.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      purchase_order_id: sanitizeString(record?.purchase_order_id || context?.purchaseOrderId),
      received_at: sanitizeString(record?.received_at),
      status: sanitizeString(record?.status || context?.status),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        received_at: sanitizeString(values.received_at) ? toIsoDateTime(values.received_at) : undefined,
        status: sanitizeString(values.status),
      };
      if (!isEdit) {
        payload.purchase_order_id = sanitizeString(values.purchase_order_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const receivedAtError = buildDateTimeError(values.received_at, t);
      if (receivedAtError) errors.received_at = receivedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.goodsReceipts.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.goodsReceipts.detail.purchaseOrderLabel', valueKey: 'purchase_order_id' },
      { labelKey: 'clinical.resources.goodsReceipts.detail.receivedAtLabel', valueKey: 'received_at', type: 'datetime' },
      { labelKey: 'clinical.resources.goodsReceipts.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.goodsReceipts.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.goodsReceipts.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.STOCK_ADJUSTMENTS]: {
    id: CLINICAL_RESOURCE_IDS.STOCK_ADJUSTMENTS,
    routePath: `${INVENTORY_ROUTE_ROOT}/stock-adjustments`,
    i18nKey: 'clinical.resources.stockAdjustments',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'inventory_item_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.stockAdjustments.form.inventoryItemIdLabel',
        placeholderKey: 'clinical.resources.stockAdjustments.form.inventoryItemIdPlaceholder',
        hintKey: 'clinical.resources.stockAdjustments.form.inventoryItemIdHint',
      },
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.stockAdjustments.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.stockAdjustments.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.stockAdjustments.form.facilityIdHint',
      },
      {
        name: 'quantity',
        type: 'text',
        required: true,
        maxLength: 12,
        labelKey: 'clinical.resources.stockAdjustments.form.quantityLabel',
        placeholderKey: 'clinical.resources.stockAdjustments.form.quantityPlaceholder',
        hintKey: 'clinical.resources.stockAdjustments.form.quantityHint',
      },
      {
        name: 'reason',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.stockAdjustments.form.reasonLabel',
        placeholderKey: 'clinical.resources.stockAdjustments.form.reasonPlaceholder',
        hintKey: 'clinical.resources.stockAdjustments.form.reasonHint',
        options: STOCK_ADJUSTMENT_REASON_OPTIONS,
      },
      {
        name: 'adjusted_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.stockAdjustments.form.adjustedAtLabel',
        placeholderKey: 'clinical.resources.stockAdjustments.form.adjustedAtPlaceholder',
        hintKey: 'clinical.resources.stockAdjustments.form.adjustedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.inventory_item_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const reasonValue = sanitizeString(item?.reason);
      if (!reasonValue) return '';
      return `${t('clinical.resources.stockAdjustments.detail.reasonLabel')}: ${reasonValue}`;
    },
    getInitialValues: (record, context) => ({
      inventory_item_id: sanitizeString(record?.inventory_item_id || context?.inventoryItemId),
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      quantity: sanitizeString(record?.quantity),
      reason: sanitizeString(record?.reason || context?.reason || 'CORRECTION'),
      adjusted_at: sanitizeString(record?.adjusted_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        facility_id: sanitizeString(values.facility_id) || null,
        quantity: parseRequiredInteger(values.quantity, 0),
        reason: sanitizeString(values.reason),
        adjusted_at: sanitizeString(values.adjusted_at) ? toIsoDateTime(values.adjusted_at) : undefined,
      };
      if (!isEdit) {
        payload.inventory_item_id = sanitizeString(values.inventory_item_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const quantityError = buildIntegerError(values.quantity, t, { required: true });
      const adjustedAtError = buildDateTimeError(values.adjusted_at, t);
      if (quantityError) errors.quantity = quantityError;
      if (adjustedAtError) errors.adjusted_at = adjustedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.stockAdjustments.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.stockAdjustments.detail.inventoryItemLabel', valueKey: 'inventory_item_id' },
      { labelKey: 'clinical.resources.stockAdjustments.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.stockAdjustments.detail.quantityLabel', valueKey: 'quantity' },
      { labelKey: 'clinical.resources.stockAdjustments.detail.reasonLabel', valueKey: 'reason' },
      { labelKey: 'clinical.resources.stockAdjustments.detail.adjustedAtLabel', valueKey: 'adjusted_at', type: 'datetime' },
      { labelKey: 'clinical.resources.stockAdjustments.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.stockAdjustments.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PRICING_RULES]: {
    id: CLINICAL_RESOURCE_IDS.PRICING_RULES,
    routePath: `${BILLING_ROUTE_ROOT}/pricing-rules`,
    i18nKey: 'clinical.resources.pricingRules',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: () => '',
    getInitialValues: () => ({}),
    toPayload: () => ({}),
    validate: () => ({}),
    detailRows: [],
  },
  [CLINICAL_RESOURCE_IDS.COVERAGE_PLANS]: {
    id: CLINICAL_RESOURCE_IDS.COVERAGE_PLANS,
    routePath: `${BILLING_ROUTE_ROOT}/coverage-plans`,
    i18nKey: 'clinical.resources.coveragePlans',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: () => '',
    getInitialValues: () => ({}),
    toPayload: () => ({}),
    validate: () => ({}),
    detailRows: [],
  },
  [CLINICAL_RESOURCE_IDS.INVOICES]: {
    id: CLINICAL_RESOURCE_IDS.INVOICES,
    routePath: `${BILLING_ROUTE_ROOT}/invoices`,
    i18nKey: 'clinical.resources.invoices',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.invoices.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.invoices.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.invoices.form.facilityIdHint',
      },
      {
        name: 'patient_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.invoices.form.patientIdLabel',
        placeholderKey: 'clinical.resources.invoices.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.invoices.form.patientIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.invoices.form.statusLabel',
        placeholderKey: 'clinical.resources.invoices.form.statusPlaceholder',
        hintKey: 'clinical.resources.invoices.form.statusHint',
        options: INVOICE_STATUS_OPTIONS,
      },
      {
        name: 'billing_status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.invoices.form.billingStatusLabel',
        placeholderKey: 'clinical.resources.invoices.form.billingStatusPlaceholder',
        hintKey: 'clinical.resources.invoices.form.billingStatusHint',
        options: BILLING_STATUS_OPTIONS,
      },
      {
        name: 'total_amount',
        type: 'text',
        required: true,
        maxLength: 24,
        labelKey: 'clinical.resources.invoices.form.totalAmountLabel',
        placeholderKey: 'clinical.resources.invoices.form.totalAmountPlaceholder',
        hintKey: 'clinical.resources.invoices.form.totalAmountHint',
      },
      {
        name: 'currency',
        type: 'text',
        required: true,
        maxLength: 10,
        labelKey: 'clinical.resources.invoices.form.currencyLabel',
        placeholderKey: 'clinical.resources.invoices.form.currencyPlaceholder',
        hintKey: 'clinical.resources.invoices.form.currencyHint',
      },
      {
        name: 'issued_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.invoices.form.issuedAtLabel',
        placeholderKey: 'clinical.resources.invoices.form.issuedAtPlaceholder',
        hintKey: 'clinical.resources.invoices.form.issuedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.id) || sanitizeString(item?.patient_id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.invoices.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      status: sanitizeString(record?.status || context?.status || 'DRAFT'),
      billing_status: sanitizeString(record?.billing_status || context?.billingStatus || 'DRAFT'),
      total_amount: sanitizeString(record?.total_amount),
      currency: sanitizeString(record?.currency || 'USD'),
      issued_at: sanitizeString(record?.issued_at),
    }),
    toPayload: (values) => ({
      facility_id: sanitizeString(values.facility_id) || null,
      patient_id: sanitizeString(values.patient_id) || null,
      status: sanitizeString(values.status),
      billing_status: sanitizeString(values.billing_status),
      total_amount: sanitizeString(values.total_amount),
      currency: sanitizeString(values.currency),
      issued_at: sanitizeString(values.issued_at) ? toIsoDateTime(values.issued_at) : undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const issuedAtError = buildDateTimeError(values.issued_at, t);
      const totalAmountError = buildDecimalError(values.total_amount, t, { required: true });
      if (issuedAtError) errors.issued_at = issuedAtError;
      if (totalAmountError) errors.total_amount = totalAmountError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.invoices.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.invoices.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.invoices.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.invoices.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.invoices.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.invoices.detail.billingStatusLabel', valueKey: 'billing_status' },
      { labelKey: 'clinical.resources.invoices.detail.totalAmountLabel', valueKey: 'total_amount' },
      { labelKey: 'clinical.resources.invoices.detail.currencyLabel', valueKey: 'currency' },
      { labelKey: 'clinical.resources.invoices.detail.issuedAtLabel', valueKey: 'issued_at', type: 'datetime' },
      { labelKey: 'clinical.resources.invoices.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.invoices.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PAYMENTS]: {
    id: CLINICAL_RESOURCE_IDS.PAYMENTS,
    routePath: `${BILLING_ROUTE_ROOT}/payments`,
    i18nKey: 'clinical.resources.payments',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.payments.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.payments.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.payments.form.facilityIdHint',
      },
      {
        name: 'patient_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.payments.form.patientIdLabel',
        placeholderKey: 'clinical.resources.payments.form.patientIdPlaceholder',
        hintKey: 'clinical.resources.payments.form.patientIdHint',
      },
      {
        name: 'invoice_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.payments.form.invoiceIdLabel',
        placeholderKey: 'clinical.resources.payments.form.invoiceIdPlaceholder',
        hintKey: 'clinical.resources.payments.form.invoiceIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.payments.form.statusLabel',
        placeholderKey: 'clinical.resources.payments.form.statusPlaceholder',
        hintKey: 'clinical.resources.payments.form.statusHint',
        options: PAYMENT_STATUS_OPTIONS,
      },
      {
        name: 'method',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.payments.form.methodLabel',
        placeholderKey: 'clinical.resources.payments.form.methodPlaceholder',
        hintKey: 'clinical.resources.payments.form.methodHint',
        options: PAYMENT_METHOD_OPTIONS,
      },
      {
        name: 'amount',
        type: 'text',
        required: true,
        maxLength: 24,
        labelKey: 'clinical.resources.payments.form.amountLabel',
        placeholderKey: 'clinical.resources.payments.form.amountPlaceholder',
        hintKey: 'clinical.resources.payments.form.amountHint',
      },
      {
        name: 'paid_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.payments.form.paidAtLabel',
        placeholderKey: 'clinical.resources.payments.form.paidAtPlaceholder',
        hintKey: 'clinical.resources.payments.form.paidAtHint',
      },
      {
        name: 'transaction_ref',
        type: 'text',
        required: false,
        maxLength: 120,
        labelKey: 'clinical.resources.payments.form.transactionRefLabel',
        placeholderKey: 'clinical.resources.payments.form.transactionRefPlaceholder',
        hintKey: 'clinical.resources.payments.form.transactionRefHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.invoice_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const methodValue = sanitizeString(item?.method);
      if (!methodValue) return '';
      return `${t('clinical.resources.payments.detail.methodLabel')}: ${methodValue}`;
    },
    getInitialValues: (record, context) => ({
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      patient_id: sanitizeString(record?.patient_id || context?.patientId),
      invoice_id: sanitizeString(record?.invoice_id || context?.invoiceId),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
      method: sanitizeString(record?.method || context?.method || 'CASH'),
      amount: sanitizeString(record?.amount),
      paid_at: sanitizeString(record?.paid_at),
      transaction_ref: sanitizeString(record?.transaction_ref),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        facility_id: sanitizeString(values.facility_id) || null,
        patient_id: sanitizeString(values.patient_id) || null,
        status: sanitizeString(values.status),
        method: sanitizeString(values.method),
        amount: sanitizeString(values.amount),
        paid_at: sanitizeString(values.paid_at) ? toIsoDateTime(values.paid_at) : null,
        transaction_ref: sanitizeString(values.transaction_ref) || null,
      };
      if (!isEdit) {
        payload.invoice_id = sanitizeString(values.invoice_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const paidAtError = buildDateTimeError(values.paid_at, t);
      const amountError = buildDecimalError(values.amount, t, { required: true });
      if (paidAtError) errors.paid_at = paidAtError;
      if (amountError) errors.amount = amountError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.payments.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.payments.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.payments.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.payments.detail.patientLabel', valueKey: 'patient_id' },
      { labelKey: 'clinical.resources.payments.detail.invoiceLabel', valueKey: 'invoice_id' },
      { labelKey: 'clinical.resources.payments.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.payments.detail.methodLabel', valueKey: 'method' },
      { labelKey: 'clinical.resources.payments.detail.amountLabel', valueKey: 'amount' },
      { labelKey: 'clinical.resources.payments.detail.paidAtLabel', valueKey: 'paid_at', type: 'datetime' },
      { labelKey: 'clinical.resources.payments.detail.transactionRefLabel', valueKey: 'transaction_ref' },
      { labelKey: 'clinical.resources.payments.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.payments.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.REFUNDS]: {
    id: CLINICAL_RESOURCE_IDS.REFUNDS,
    routePath: `${BILLING_ROUTE_ROOT}/refunds`,
    i18nKey: 'clinical.resources.refunds',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'payment_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.refunds.form.paymentIdLabel',
        placeholderKey: 'clinical.resources.refunds.form.paymentIdPlaceholder',
        hintKey: 'clinical.resources.refunds.form.paymentIdHint',
      },
      {
        name: 'amount',
        type: 'text',
        required: true,
        maxLength: 24,
        labelKey: 'clinical.resources.refunds.form.amountLabel',
        placeholderKey: 'clinical.resources.refunds.form.amountPlaceholder',
        hintKey: 'clinical.resources.refunds.form.amountHint',
      },
      {
        name: 'refunded_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.refunds.form.refundedAtLabel',
        placeholderKey: 'clinical.resources.refunds.form.refundedAtPlaceholder',
        hintKey: 'clinical.resources.refunds.form.refundedAtHint',
      },
      {
        name: 'reason',
        type: 'text',
        required: false,
        maxLength: 255,
        labelKey: 'clinical.resources.refunds.form.reasonLabel',
        placeholderKey: 'clinical.resources.refunds.form.reasonPlaceholder',
        hintKey: 'clinical.resources.refunds.form.reasonHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.payment_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const amountValue = sanitizeString(item?.amount);
      if (!amountValue) return '';
      return `${t('clinical.resources.refunds.detail.amountLabel')}: ${amountValue}`;
    },
    getInitialValues: (record, context) => ({
      payment_id: sanitizeString(record?.payment_id || context?.paymentId),
      amount: sanitizeString(record?.amount),
      refunded_at: sanitizeString(record?.refunded_at),
      reason: sanitizeString(record?.reason),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        amount: sanitizeString(values.amount),
        refunded_at: sanitizeString(values.refunded_at) ? toIsoDateTime(values.refunded_at) : undefined,
        reason: sanitizeString(values.reason) || null,
      };
      if (!isEdit) {
        payload.payment_id = sanitizeString(values.payment_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const refundedAtError = buildDateTimeError(values.refunded_at, t);
      const amountError = buildDecimalError(values.amount, t, { required: true });
      if (refundedAtError) errors.refunded_at = refundedAtError;
      if (amountError) errors.amount = amountError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.refunds.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.refunds.detail.paymentLabel', valueKey: 'payment_id' },
      { labelKey: 'clinical.resources.refunds.detail.amountLabel', valueKey: 'amount' },
      { labelKey: 'clinical.resources.refunds.detail.refundedAtLabel', valueKey: 'refunded_at', type: 'datetime' },
      { labelKey: 'clinical.resources.refunds.detail.reasonLabel', valueKey: 'reason' },
      { labelKey: 'clinical.resources.refunds.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.refunds.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.INSURANCE_CLAIMS]: {
    id: CLINICAL_RESOURCE_IDS.INSURANCE_CLAIMS,
    routePath: `${BILLING_ROUTE_ROOT}/insurance-claims`,
    i18nKey: 'clinical.resources.insuranceClaims',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'coverage_plan_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.insuranceClaims.form.coveragePlanIdLabel',
        placeholderKey: 'clinical.resources.insuranceClaims.form.coveragePlanIdPlaceholder',
        hintKey: 'clinical.resources.insuranceClaims.form.coveragePlanIdHint',
      },
      {
        name: 'invoice_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.insuranceClaims.form.invoiceIdLabel',
        placeholderKey: 'clinical.resources.insuranceClaims.form.invoiceIdPlaceholder',
        hintKey: 'clinical.resources.insuranceClaims.form.invoiceIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.insuranceClaims.form.statusLabel',
        placeholderKey: 'clinical.resources.insuranceClaims.form.statusPlaceholder',
        hintKey: 'clinical.resources.insuranceClaims.form.statusHint',
        options: INSURANCE_CLAIM_STATUS_OPTIONS,
      },
      {
        name: 'submitted_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.insuranceClaims.form.submittedAtLabel',
        placeholderKey: 'clinical.resources.insuranceClaims.form.submittedAtPlaceholder',
        hintKey: 'clinical.resources.insuranceClaims.form.submittedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.invoice_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.insuranceClaims.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      coverage_plan_id: sanitizeString(record?.coverage_plan_id || context?.coveragePlanId),
      invoice_id: sanitizeString(record?.invoice_id || context?.invoiceId),
      status: sanitizeString(record?.status || context?.status || 'SUBMITTED'),
      submitted_at: sanitizeString(record?.submitted_at),
    }),
    toPayload: (values) => ({
      coverage_plan_id: sanitizeString(values.coverage_plan_id),
      invoice_id: sanitizeString(values.invoice_id),
      status: sanitizeString(values.status) || undefined,
      submitted_at: sanitizeString(values.submitted_at) ? toIsoDateTime(values.submitted_at) : undefined,
    }),
    validate: (values, t) => {
      const errors = {};
      const submittedAtError = buildDateTimeError(values.submitted_at, t);
      if (submittedAtError) errors.submitted_at = submittedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.insuranceClaims.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.insuranceClaims.detail.coveragePlanLabel', valueKey: 'coverage_plan_id' },
      { labelKey: 'clinical.resources.insuranceClaims.detail.invoiceLabel', valueKey: 'invoice_id' },
      { labelKey: 'clinical.resources.insuranceClaims.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.insuranceClaims.detail.submittedAtLabel', valueKey: 'submitted_at', type: 'datetime' },
      { labelKey: 'clinical.resources.insuranceClaims.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.insuranceClaims.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PRE_AUTHORIZATIONS]: {
    id: CLINICAL_RESOURCE_IDS.PRE_AUTHORIZATIONS,
    routePath: `${BILLING_ROUTE_ROOT}/pre-authorizations`,
    i18nKey: 'clinical.resources.preAuthorizations',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'coverage_plan_id',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.preAuthorizations.form.coveragePlanIdLabel',
        placeholderKey: 'clinical.resources.preAuthorizations.form.coveragePlanIdPlaceholder',
        hintKey: 'clinical.resources.preAuthorizations.form.coveragePlanIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.preAuthorizations.form.statusLabel',
        placeholderKey: 'clinical.resources.preAuthorizations.form.statusPlaceholder',
        hintKey: 'clinical.resources.preAuthorizations.form.statusHint',
        options: PRE_AUTHORIZATION_STATUS_OPTIONS,
      },
      {
        name: 'requested_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.preAuthorizations.form.requestedAtLabel',
        placeholderKey: 'clinical.resources.preAuthorizations.form.requestedAtPlaceholder',
        hintKey: 'clinical.resources.preAuthorizations.form.requestedAtHint',
      },
      {
        name: 'approved_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.preAuthorizations.form.approvedAtLabel',
        placeholderKey: 'clinical.resources.preAuthorizations.form.approvedAtPlaceholder',
        hintKey: 'clinical.resources.preAuthorizations.form.approvedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.coverage_plan_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.preAuthorizations.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      coverage_plan_id: sanitizeString(record?.coverage_plan_id || context?.coveragePlanId),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
      requested_at: sanitizeString(record?.requested_at),
      approved_at: sanitizeString(record?.approved_at),
    }),
    toPayload: (values) => ({
      coverage_plan_id: sanitizeString(values.coverage_plan_id),
      status: sanitizeString(values.status) || undefined,
      requested_at: sanitizeString(values.requested_at) ? toIsoDateTime(values.requested_at) : undefined,
      approved_at: sanitizeString(values.approved_at) ? toIsoDateTime(values.approved_at) : null,
    }),
    validate: (values, t) => {
      const errors = {};
      const requestedAtError = buildDateTimeError(values.requested_at, t);
      const approvedAtError = buildDateTimeError(values.approved_at, t);
      if (requestedAtError) errors.requested_at = requestedAtError;
      if (approvedAtError) errors.approved_at = approvedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.preAuthorizations.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.preAuthorizations.detail.coveragePlanLabel', valueKey: 'coverage_plan_id' },
      { labelKey: 'clinical.resources.preAuthorizations.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.preAuthorizations.detail.requestedAtLabel', valueKey: 'requested_at', type: 'datetime' },
      { labelKey: 'clinical.resources.preAuthorizations.detail.approvedAtLabel', valueKey: 'approved_at', type: 'datetime' },
      { labelKey: 'clinical.resources.preAuthorizations.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.preAuthorizations.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.BILLING_ADJUSTMENTS]: {
    id: CLINICAL_RESOURCE_IDS.BILLING_ADJUSTMENTS,
    routePath: `${BILLING_ROUTE_ROOT}/billing-adjustments`,
    i18nKey: 'clinical.resources.billingAdjustments',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'invoice_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.billingAdjustments.form.invoiceIdLabel',
        placeholderKey: 'clinical.resources.billingAdjustments.form.invoiceIdPlaceholder',
        hintKey: 'clinical.resources.billingAdjustments.form.invoiceIdHint',
      },
      {
        name: 'amount',
        type: 'text',
        required: true,
        maxLength: 24,
        labelKey: 'clinical.resources.billingAdjustments.form.amountLabel',
        placeholderKey: 'clinical.resources.billingAdjustments.form.amountPlaceholder',
        hintKey: 'clinical.resources.billingAdjustments.form.amountHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.billingAdjustments.form.statusLabel',
        placeholderKey: 'clinical.resources.billingAdjustments.form.statusPlaceholder',
        hintKey: 'clinical.resources.billingAdjustments.form.statusHint',
        options: BILLING_STATUS_OPTIONS,
      },
      {
        name: 'reason',
        type: 'text',
        required: false,
        maxLength: 255,
        labelKey: 'clinical.resources.billingAdjustments.form.reasonLabel',
        placeholderKey: 'clinical.resources.billingAdjustments.form.reasonPlaceholder',
        hintKey: 'clinical.resources.billingAdjustments.form.reasonHint',
      },
      {
        name: 'adjusted_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.billingAdjustments.form.adjustedAtLabel',
        placeholderKey: 'clinical.resources.billingAdjustments.form.adjustedAtPlaceholder',
        hintKey: 'clinical.resources.billingAdjustments.form.adjustedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.invoice_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.billingAdjustments.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      invoice_id: sanitizeString(record?.invoice_id || context?.invoiceId),
      amount: sanitizeString(record?.amount),
      status: sanitizeString(record?.status || context?.status || 'DRAFT'),
      reason: sanitizeString(record?.reason),
      adjusted_at: sanitizeString(record?.adjusted_at),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        amount: Number.parseFloat(sanitizeString(values.amount)),
        status: sanitizeString(values.status),
        reason: sanitizeString(values.reason) || null,
        adjusted_at: sanitizeString(values.adjusted_at) ? toIsoDateTime(values.adjusted_at) : undefined,
      };
      if (!isEdit) {
        payload.invoice_id = sanitizeString(values.invoice_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const adjustedAtError = buildDateTimeError(values.adjusted_at, t);
      const amountValue = Number.parseFloat(sanitizeString(values.amount));
      if (!Number.isFinite(amountValue)) {
        errors.amount = t('forms.validation.invalidValue');
      }
      if (adjustedAtError) errors.adjusted_at = adjustedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.billingAdjustments.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.billingAdjustments.detail.invoiceLabel', valueKey: 'invoice_id' },
      { labelKey: 'clinical.resources.billingAdjustments.detail.amountLabel', valueKey: 'amount' },
      { labelKey: 'clinical.resources.billingAdjustments.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.billingAdjustments.detail.reasonLabel', valueKey: 'reason' },
      { labelKey: 'clinical.resources.billingAdjustments.detail.adjustedAtLabel', valueKey: 'adjusted_at', type: 'datetime' },
      { labelKey: 'clinical.resources.billingAdjustments.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.billingAdjustments.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.STAFF_PROFILES]: {
    id: CLINICAL_RESOURCE_IDS.STAFF_PROFILES,
    routePath: `${HR_ROUTE_ROOT}/staff-profiles`,
    i18nKey: 'clinical.resources.staffProfiles',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'user_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.staffProfiles.form.userIdLabel',
        placeholderKey: 'clinical.resources.staffProfiles.form.userIdPlaceholder',
        hintKey: 'clinical.resources.staffProfiles.form.userIdHint',
      },
      {
        name: 'department_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.staffProfiles.form.departmentIdLabel',
        placeholderKey: 'clinical.resources.staffProfiles.form.departmentIdPlaceholder',
        hintKey: 'clinical.resources.staffProfiles.form.departmentIdHint',
      },
      {
        name: 'staff_number',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.staffProfiles.form.staffNumberLabel',
        placeholderKey: 'clinical.resources.staffProfiles.form.staffNumberPlaceholder',
        hintKey: 'clinical.resources.staffProfiles.form.staffNumberHint',
      },
      {
        name: 'position',
        type: 'text',
        required: false,
        maxLength: 120,
        labelKey: 'clinical.resources.staffProfiles.form.positionLabel',
        placeholderKey: 'clinical.resources.staffProfiles.form.positionPlaceholder',
        hintKey: 'clinical.resources.staffProfiles.form.positionHint',
      },
      {
        name: 'hire_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.staffProfiles.form.hireDateLabel',
        placeholderKey: 'clinical.resources.staffProfiles.form.hireDatePlaceholder',
        hintKey: 'clinical.resources.staffProfiles.form.hireDateHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.staff_number) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const positionValue = sanitizeString(item?.position);
      if (!positionValue) return '';
      return `${t('clinical.resources.staffProfiles.detail.positionLabel')}: ${positionValue}`;
    },
    getInitialValues: (record, context) => ({
      user_id: sanitizeString(record?.user_id || context?.userId),
      department_id: sanitizeString(record?.department_id || context?.departmentId),
      staff_number: sanitizeString(record?.staff_number || context?.staffNumber),
      position: sanitizeString(record?.position || context?.position),
      hire_date: sanitizeString(record?.hire_date),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        department_id: sanitizeString(values.department_id) || null,
        staff_number: sanitizeString(values.staff_number) || null,
        position: sanitizeString(values.position) || null,
        hire_date: sanitizeString(values.hire_date) ? toIsoDateTime(values.hire_date) : null,
      };
      if (!isEdit) {
        payload.user_id = sanitizeString(values.user_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const hireDateError = buildDateTimeError(values.hire_date, t);
      if (hireDateError) errors.hire_date = hireDateError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.staffProfiles.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.staffProfiles.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.staffProfiles.detail.userLabel', valueKey: 'user_id' },
      { labelKey: 'clinical.resources.staffProfiles.detail.departmentLabel', valueKey: 'department_id' },
      { labelKey: 'clinical.resources.staffProfiles.detail.staffNumberLabel', valueKey: 'staff_number' },
      { labelKey: 'clinical.resources.staffProfiles.detail.positionLabel', valueKey: 'position' },
      { labelKey: 'clinical.resources.staffProfiles.detail.hireDateLabel', valueKey: 'hire_date', type: 'datetime' },
      { labelKey: 'clinical.resources.staffProfiles.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.staffProfiles.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.STAFF_ASSIGNMENTS]: {
    id: CLINICAL_RESOURCE_IDS.STAFF_ASSIGNMENTS,
    routePath: `${HR_ROUTE_ROOT}/staff-assignments`,
    i18nKey: 'clinical.resources.staffAssignments',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'staff_profile_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.staffAssignments.form.staffProfileIdLabel',
        placeholderKey: 'clinical.resources.staffAssignments.form.staffProfileIdPlaceholder',
        hintKey: 'clinical.resources.staffAssignments.form.staffProfileIdHint',
      },
      {
        name: 'department_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.staffAssignments.form.departmentIdLabel',
        placeholderKey: 'clinical.resources.staffAssignments.form.departmentIdPlaceholder',
        hintKey: 'clinical.resources.staffAssignments.form.departmentIdHint',
      },
      {
        name: 'unit_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.staffAssignments.form.unitIdLabel',
        placeholderKey: 'clinical.resources.staffAssignments.form.unitIdPlaceholder',
        hintKey: 'clinical.resources.staffAssignments.form.unitIdHint',
      },
      {
        name: 'start_date',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.staffAssignments.form.startDateLabel',
        placeholderKey: 'clinical.resources.staffAssignments.form.startDatePlaceholder',
        hintKey: 'clinical.resources.staffAssignments.form.startDateHint',
      },
      {
        name: 'end_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.staffAssignments.form.endDateLabel',
        placeholderKey: 'clinical.resources.staffAssignments.form.endDatePlaceholder',
        hintKey: 'clinical.resources.staffAssignments.form.endDateHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.staff_profile_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const departmentValue = sanitizeString(item?.department_id);
      if (!departmentValue) return '';
      return `${t('clinical.resources.staffAssignments.detail.departmentLabel')}: ${departmentValue}`;
    },
    getInitialValues: (record, context) => ({
      staff_profile_id: sanitizeString(record?.staff_profile_id || context?.staffProfileId),
      department_id: sanitizeString(record?.department_id || context?.departmentId),
      unit_id: sanitizeString(record?.unit_id || context?.unitId),
      start_date: sanitizeString(record?.start_date),
      end_date: sanitizeString(record?.end_date),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        department_id: sanitizeString(values.department_id) || null,
        unit_id: sanitizeString(values.unit_id) || null,
        start_date: toIsoDateTime(values.start_date),
        end_date: sanitizeString(values.end_date) ? toIsoDateTime(values.end_date) : null,
      };
      if (!isEdit) {
        payload.staff_profile_id = sanitizeString(values.staff_profile_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const startDateError = buildDateTimeError(values.start_date, t);
      const endDateError = buildDateTimeError(values.end_date, t);
      const dateOrderError = validateDateOrder(values.start_date, values.end_date, t, { allowEqual: true });
      if (startDateError) errors.start_date = startDateError;
      if (endDateError) errors.end_date = endDateError;
      if (!startDateError && !endDateError && dateOrderError) errors.end_date = dateOrderError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.staffAssignments.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.staffAssignments.detail.staffProfileLabel', valueKey: 'staff_profile_id' },
      { labelKey: 'clinical.resources.staffAssignments.detail.departmentLabel', valueKey: 'department_id' },
      { labelKey: 'clinical.resources.staffAssignments.detail.unitLabel', valueKey: 'unit_id' },
      { labelKey: 'clinical.resources.staffAssignments.detail.startDateLabel', valueKey: 'start_date', type: 'datetime' },
      { labelKey: 'clinical.resources.staffAssignments.detail.endDateLabel', valueKey: 'end_date', type: 'datetime' },
      { labelKey: 'clinical.resources.staffAssignments.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.staffAssignments.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.STAFF_LEAVES]: {
    id: CLINICAL_RESOURCE_IDS.STAFF_LEAVES,
    routePath: `${HR_ROUTE_ROOT}/staff-leaves`,
    i18nKey: 'clinical.resources.staffLeaves',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'staff_profile_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.staffLeaves.form.staffProfileIdLabel',
        placeholderKey: 'clinical.resources.staffLeaves.form.staffProfileIdPlaceholder',
        hintKey: 'clinical.resources.staffLeaves.form.staffProfileIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.staffLeaves.form.statusLabel',
        placeholderKey: 'clinical.resources.staffLeaves.form.statusPlaceholder',
        hintKey: 'clinical.resources.staffLeaves.form.statusHint',
        options: STAFF_LEAVE_STATUS_OPTIONS,
      },
      {
        name: 'start_date',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.staffLeaves.form.startDateLabel',
        placeholderKey: 'clinical.resources.staffLeaves.form.startDatePlaceholder',
        hintKey: 'clinical.resources.staffLeaves.form.startDateHint',
      },
      {
        name: 'end_date',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.staffLeaves.form.endDateLabel',
        placeholderKey: 'clinical.resources.staffLeaves.form.endDatePlaceholder',
        hintKey: 'clinical.resources.staffLeaves.form.endDateHint',
      },
      {
        name: 'reason',
        type: 'text',
        required: false,
        maxLength: 255,
        labelKey: 'clinical.resources.staffLeaves.form.reasonLabel',
        placeholderKey: 'clinical.resources.staffLeaves.form.reasonPlaceholder',
        hintKey: 'clinical.resources.staffLeaves.form.reasonHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.staff_profile_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.staffLeaves.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      staff_profile_id: sanitizeString(record?.staff_profile_id || context?.staffProfileId),
      status: sanitizeString(record?.status || context?.status || 'REQUESTED'),
      start_date: sanitizeString(record?.start_date),
      end_date: sanitizeString(record?.end_date),
      reason: sanitizeString(record?.reason),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        status: sanitizeString(values.status),
        start_date: toIsoDateTime(values.start_date),
        end_date: toIsoDateTime(values.end_date),
        reason: sanitizeString(values.reason) || null,
      };
      if (!isEdit) {
        payload.staff_profile_id = sanitizeString(values.staff_profile_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const startDateError = buildDateTimeError(values.start_date, t);
      const endDateError = buildDateTimeError(values.end_date, t);
      const dateOrderError = validateDateOrder(values.start_date, values.end_date, t, { allowEqual: true });
      if (startDateError) errors.start_date = startDateError;
      if (endDateError) errors.end_date = endDateError;
      if (!startDateError && !endDateError && dateOrderError) errors.end_date = dateOrderError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.staffLeaves.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.staffLeaves.detail.staffProfileLabel', valueKey: 'staff_profile_id' },
      { labelKey: 'clinical.resources.staffLeaves.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.staffLeaves.detail.startDateLabel', valueKey: 'start_date', type: 'datetime' },
      { labelKey: 'clinical.resources.staffLeaves.detail.endDateLabel', valueKey: 'end_date', type: 'datetime' },
      { labelKey: 'clinical.resources.staffLeaves.detail.reasonLabel', valueKey: 'reason' },
      { labelKey: 'clinical.resources.staffLeaves.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.staffLeaves.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.SHIFTS]: {
    id: CLINICAL_RESOURCE_IDS.SHIFTS,
    routePath: `${HR_ROUTE_ROOT}/shifts`,
    i18nKey: 'clinical.resources.shifts',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.shifts.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.shifts.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.shifts.form.facilityIdHint',
      },
      {
        name: 'shift_type',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.shifts.form.shiftTypeLabel',
        placeholderKey: 'clinical.resources.shifts.form.shiftTypePlaceholder',
        hintKey: 'clinical.resources.shifts.form.shiftTypeHint',
        options: SHIFT_TYPE_OPTIONS,
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.shifts.form.statusLabel',
        placeholderKey: 'clinical.resources.shifts.form.statusPlaceholder',
        hintKey: 'clinical.resources.shifts.form.statusHint',
        options: SHIFT_STATUS_OPTIONS,
      },
      {
        name: 'start_time',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.shifts.form.startTimeLabel',
        placeholderKey: 'clinical.resources.shifts.form.startTimePlaceholder',
        hintKey: 'clinical.resources.shifts.form.startTimeHint',
      },
      {
        name: 'end_time',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.shifts.form.endTimeLabel',
        placeholderKey: 'clinical.resources.shifts.form.endTimePlaceholder',
        hintKey: 'clinical.resources.shifts.form.endTimeHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.shift_type) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.shifts.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      shift_type: sanitizeString(record?.shift_type || context?.shiftType || 'DAY'),
      status: sanitizeString(record?.status || context?.status || 'SCHEDULED'),
      start_time: sanitizeString(record?.start_time),
      end_time: sanitizeString(record?.end_time),
    }),
    toPayload: (values) => ({
      facility_id: sanitizeString(values.facility_id) || null,
      shift_type: sanitizeString(values.shift_type),
      status: sanitizeString(values.status),
      start_time: toIsoDateTime(values.start_time),
      end_time: toIsoDateTime(values.end_time),
    }),
    validate: (values, t) => {
      const errors = {};
      const startTimeError = buildDateTimeError(values.start_time, t);
      const endTimeError = buildDateTimeError(values.end_time, t);
      const dateOrderError = validateDateOrder(values.start_time, values.end_time, t);
      if (startTimeError) errors.start_time = startTimeError;
      if (endTimeError) errors.end_time = endTimeError;
      if (!startTimeError && !endTimeError && dateOrderError) errors.end_time = dateOrderError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.shifts.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.shifts.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.shifts.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.shifts.detail.shiftTypeLabel', valueKey: 'shift_type' },
      { labelKey: 'clinical.resources.shifts.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.shifts.detail.startTimeLabel', valueKey: 'start_time', type: 'datetime' },
      { labelKey: 'clinical.resources.shifts.detail.endTimeLabel', valueKey: 'end_time', type: 'datetime' },
      { labelKey: 'clinical.resources.shifts.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.shifts.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.NURSE_ROSTERS]: {
    id: CLINICAL_RESOURCE_IDS.NURSE_ROSTERS,
    routePath: `${HR_ROUTE_ROOT}/nurse-rosters`,
    i18nKey: 'clinical.resources.nurseRosters',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.nurseRosters.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.nurseRosters.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.nurseRosters.form.facilityIdHint',
      },
      {
        name: 'department_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.nurseRosters.form.departmentIdLabel',
        placeholderKey: 'clinical.resources.nurseRosters.form.departmentIdPlaceholder',
        hintKey: 'clinical.resources.nurseRosters.form.departmentIdHint',
      },
      {
        name: 'period_start',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.nurseRosters.form.periodStartLabel',
        placeholderKey: 'clinical.resources.nurseRosters.form.periodStartPlaceholder',
        hintKey: 'clinical.resources.nurseRosters.form.periodStartHint',
      },
      {
        name: 'period_end',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.nurseRosters.form.periodEndLabel',
        placeholderKey: 'clinical.resources.nurseRosters.form.periodEndPlaceholder',
        hintKey: 'clinical.resources.nurseRosters.form.periodEndHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.nurseRosters.form.statusLabel',
        placeholderKey: 'clinical.resources.nurseRosters.form.statusPlaceholder',
        hintKey: 'clinical.resources.nurseRosters.form.statusHint',
        options: NURSE_ROSTER_STATUS_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.nurseRosters.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      department_id: sanitizeString(record?.department_id || context?.departmentId),
      period_start: sanitizeString(record?.period_start),
      period_end: sanitizeString(record?.period_end),
      status: sanitizeString(record?.status || context?.status || 'DRAFT'),
    }),
    toPayload: (values) => ({
      facility_id: sanitizeString(values.facility_id) || null,
      department_id: sanitizeString(values.department_id) || null,
      period_start: toIsoDateTime(values.period_start),
      period_end: toIsoDateTime(values.period_end),
      status: sanitizeString(values.status),
    }),
    validate: (values, t) => {
      const errors = {};
      const periodStartError = buildDateTimeError(values.period_start, t);
      const periodEndError = buildDateTimeError(values.period_end, t);
      const dateOrderError = validateDateOrder(values.period_start, values.period_end, t);
      if (periodStartError) errors.period_start = periodStartError;
      if (periodEndError) errors.period_end = periodEndError;
      if (!periodStartError && !periodEndError && dateOrderError) errors.period_end = dateOrderError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.nurseRosters.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.nurseRosters.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.nurseRosters.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.nurseRosters.detail.departmentLabel', valueKey: 'department_id' },
      { labelKey: 'clinical.resources.nurseRosters.detail.periodStartLabel', valueKey: 'period_start', type: 'datetime' },
      { labelKey: 'clinical.resources.nurseRosters.detail.periodEndLabel', valueKey: 'period_end', type: 'datetime' },
      { labelKey: 'clinical.resources.nurseRosters.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.nurseRosters.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.nurseRosters.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.PAYROLL_RUNS]: {
    id: CLINICAL_RESOURCE_IDS.PAYROLL_RUNS,
    routePath: `${HR_ROUTE_ROOT}/payroll-runs`,
    i18nKey: 'clinical.resources.payrollRuns',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'period_start',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.payrollRuns.form.periodStartLabel',
        placeholderKey: 'clinical.resources.payrollRuns.form.periodStartPlaceholder',
        hintKey: 'clinical.resources.payrollRuns.form.periodStartHint',
      },
      {
        name: 'period_end',
        type: 'text',
        required: true,
        maxLength: 64,
        labelKey: 'clinical.resources.payrollRuns.form.periodEndLabel',
        placeholderKey: 'clinical.resources.payrollRuns.form.periodEndPlaceholder',
        hintKey: 'clinical.resources.payrollRuns.form.periodEndHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.payrollRuns.form.statusLabel',
        placeholderKey: 'clinical.resources.payrollRuns.form.statusPlaceholder',
        hintKey: 'clinical.resources.payrollRuns.form.statusHint',
        options: PAYROLL_RUN_STATUS_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.payrollRuns.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      period_start: sanitizeString(record?.period_start),
      period_end: sanitizeString(record?.period_end),
      status: sanitizeString(record?.status || context?.status || 'DRAFT'),
    }),
    toPayload: (values) => ({
      period_start: toIsoDateTime(values.period_start),
      period_end: toIsoDateTime(values.period_end),
      status: sanitizeString(values.status),
    }),
    validate: (values, t) => {
      const errors = {};
      const periodStartError = buildDateTimeError(values.period_start, t);
      const periodEndError = buildDateTimeError(values.period_end, t);
      const dateOrderError = validateDateOrder(values.period_start, values.period_end, t);
      if (periodStartError) errors.period_start = periodStartError;
      if (periodEndError) errors.period_end = periodEndError;
      if (!periodStartError && !periodEndError && dateOrderError) errors.period_end = dateOrderError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.payrollRuns.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.payrollRuns.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.payrollRuns.detail.periodStartLabel', valueKey: 'period_start', type: 'datetime' },
      { labelKey: 'clinical.resources.payrollRuns.detail.periodEndLabel', valueKey: 'period_end', type: 'datetime' },
      { labelKey: 'clinical.resources.payrollRuns.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.payrollRuns.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.payrollRuns.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.HOUSEKEEPING_TASKS]: {
    id: CLINICAL_RESOURCE_IDS.HOUSEKEEPING_TASKS,
    routePath: `${HOUSEKEEPING_ROUTE_ROOT}/housekeeping-tasks`,
    i18nKey: 'clinical.resources.housekeepingTasks',
    requiresTenant: false,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.housekeepingTasks.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.housekeepingTasks.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.housekeepingTasks.form.facilityIdHint',
      },
      {
        name: 'room_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.housekeepingTasks.form.roomIdLabel',
        placeholderKey: 'clinical.resources.housekeepingTasks.form.roomIdPlaceholder',
        hintKey: 'clinical.resources.housekeepingTasks.form.roomIdHint',
      },
      {
        name: 'assigned_to_staff_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.housekeepingTasks.form.assignedToStaffIdLabel',
        placeholderKey: 'clinical.resources.housekeepingTasks.form.assignedToStaffIdPlaceholder',
        hintKey: 'clinical.resources.housekeepingTasks.form.assignedToStaffIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.housekeepingTasks.form.statusLabel',
        placeholderKey: 'clinical.resources.housekeepingTasks.form.statusPlaceholder',
        hintKey: 'clinical.resources.housekeepingTasks.form.statusHint',
        options: HOUSEKEEPING_TASK_STATUS_OPTIONS,
      },
      {
        name: 'scheduled_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.housekeepingTasks.form.scheduledAtLabel',
        placeholderKey: 'clinical.resources.housekeepingTasks.form.scheduledAtPlaceholder',
        hintKey: 'clinical.resources.housekeepingTasks.form.scheduledAtHint',
      },
      {
        name: 'completed_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.housekeepingTasks.form.completedAtLabel',
        placeholderKey: 'clinical.resources.housekeepingTasks.form.completedAtPlaceholder',
        hintKey: 'clinical.resources.housekeepingTasks.form.completedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.housekeepingTasks.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      room_id: sanitizeString(record?.room_id || context?.roomId),
      assigned_to_staff_id: sanitizeString(record?.assigned_to_staff_id || context?.userId),
      status: sanitizeString(record?.status || context?.status || 'PENDING'),
      scheduled_at: sanitizeString(record?.scheduled_at),
      completed_at: sanitizeString(record?.completed_at),
    }),
    toPayload: (values) => ({
      facility_id: sanitizeString(values.facility_id) || null,
      room_id: sanitizeString(values.room_id) || null,
      assigned_to_staff_id: sanitizeString(values.assigned_to_staff_id) || null,
      status: sanitizeString(values.status),
      scheduled_at: sanitizeString(values.scheduled_at) ? toIsoDateTime(values.scheduled_at) : null,
      completed_at: sanitizeString(values.completed_at) ? toIsoDateTime(values.completed_at) : null,
    }),
    validate: (values, t) => {
      const errors = {};
      const scheduledAtError = buildDateTimeError(values.scheduled_at, t);
      const completedAtError = buildDateTimeError(values.completed_at, t);
      if (scheduledAtError) errors.scheduled_at = scheduledAtError;
      if (completedAtError) errors.completed_at = completedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.housekeepingTasks.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.housekeepingTasks.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.housekeepingTasks.detail.roomLabel', valueKey: 'room_id' },
      { labelKey: 'clinical.resources.housekeepingTasks.detail.assignedToStaffLabel', valueKey: 'assigned_to_staff_id' },
      { labelKey: 'clinical.resources.housekeepingTasks.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.housekeepingTasks.detail.scheduledAtLabel', valueKey: 'scheduled_at', type: 'datetime' },
      { labelKey: 'clinical.resources.housekeepingTasks.detail.completedAtLabel', valueKey: 'completed_at', type: 'datetime' },
      { labelKey: 'clinical.resources.housekeepingTasks.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.housekeepingTasks.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.HOUSEKEEPING_SCHEDULES]: {
    id: CLINICAL_RESOURCE_IDS.HOUSEKEEPING_SCHEDULES,
    routePath: `${HOUSEKEEPING_ROUTE_ROOT}/housekeeping-schedules`,
    i18nKey: 'clinical.resources.housekeepingSchedules',
    requiresTenant: false,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.housekeepingSchedules.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.housekeepingSchedules.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.housekeepingSchedules.form.facilityIdHint',
      },
      {
        name: 'room_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.housekeepingSchedules.form.roomIdLabel',
        placeholderKey: 'clinical.resources.housekeepingSchedules.form.roomIdPlaceholder',
        hintKey: 'clinical.resources.housekeepingSchedules.form.roomIdHint',
      },
      {
        name: 'frequency',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.housekeepingSchedules.form.frequencyLabel',
        placeholderKey: 'clinical.resources.housekeepingSchedules.form.frequencyPlaceholder',
        hintKey: 'clinical.resources.housekeepingSchedules.form.frequencyHint',
      },
      {
        name: 'start_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.housekeepingSchedules.form.startDateLabel',
        placeholderKey: 'clinical.resources.housekeepingSchedules.form.startDatePlaceholder',
        hintKey: 'clinical.resources.housekeepingSchedules.form.startDateHint',
      },
      {
        name: 'end_date',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.housekeepingSchedules.form.endDateLabel',
        placeholderKey: 'clinical.resources.housekeepingSchedules.form.endDatePlaceholder',
        hintKey: 'clinical.resources.housekeepingSchedules.form.endDateHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.frequency) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const roomValue = sanitizeString(item?.room_id);
      if (!roomValue) return '';
      return `${t('clinical.resources.housekeepingSchedules.detail.roomLabel')}: ${roomValue}`;
    },
    getInitialValues: (record, context) => ({
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      room_id: sanitizeString(record?.room_id || context?.roomId),
      frequency: sanitizeString(record?.frequency || context?.frequency),
      start_date: sanitizeString(record?.start_date),
      end_date: sanitizeString(record?.end_date),
    }),
    toPayload: (values) => ({
      facility_id: sanitizeString(values.facility_id) || null,
      room_id: sanitizeString(values.room_id) || null,
      frequency: sanitizeString(values.frequency) || null,
      start_date: sanitizeString(values.start_date) ? toIsoDateTime(values.start_date) : null,
      end_date: sanitizeString(values.end_date) ? toIsoDateTime(values.end_date) : null,
    }),
    validate: (values, t) => {
      const errors = {};
      const startDateError = buildDateTimeError(values.start_date, t);
      const endDateError = buildDateTimeError(values.end_date, t);
      const dateOrderError = validateDateOrder(values.start_date, values.end_date, t, { allowEqual: true });
      if (startDateError) errors.start_date = startDateError;
      if (endDateError) errors.end_date = endDateError;
      if (!startDateError && !endDateError && dateOrderError) errors.end_date = dateOrderError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.housekeepingSchedules.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.housekeepingSchedules.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.housekeepingSchedules.detail.roomLabel', valueKey: 'room_id' },
      { labelKey: 'clinical.resources.housekeepingSchedules.detail.frequencyLabel', valueKey: 'frequency' },
      { labelKey: 'clinical.resources.housekeepingSchedules.detail.startDateLabel', valueKey: 'start_date', type: 'datetime' },
      { labelKey: 'clinical.resources.housekeepingSchedules.detail.endDateLabel', valueKey: 'end_date', type: 'datetime' },
      { labelKey: 'clinical.resources.housekeepingSchedules.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.housekeepingSchedules.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.MAINTENANCE_REQUESTS]: {
    id: CLINICAL_RESOURCE_IDS.MAINTENANCE_REQUESTS,
    routePath: `${HOUSEKEEPING_ROUTE_ROOT}/maintenance-requests`,
    i18nKey: 'clinical.resources.maintenanceRequests',
    requiresTenant: false,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.maintenanceRequests.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.maintenanceRequests.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.maintenanceRequests.form.facilityIdHint',
      },
      {
        name: 'asset_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.maintenanceRequests.form.assetIdLabel',
        placeholderKey: 'clinical.resources.maintenanceRequests.form.assetIdPlaceholder',
        hintKey: 'clinical.resources.maintenanceRequests.form.assetIdHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.maintenanceRequests.form.statusLabel',
        placeholderKey: 'clinical.resources.maintenanceRequests.form.statusPlaceholder',
        hintKey: 'clinical.resources.maintenanceRequests.form.statusHint',
        options: MAINTENANCE_STATUS_OPTIONS,
      },
      {
        name: 'description',
        type: 'text',
        required: false,
        maxLength: 255,
        labelKey: 'clinical.resources.maintenanceRequests.form.descriptionLabel',
        placeholderKey: 'clinical.resources.maintenanceRequests.form.descriptionPlaceholder',
        hintKey: 'clinical.resources.maintenanceRequests.form.descriptionHint',
      },
      {
        name: 'reported_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.maintenanceRequests.form.reportedAtLabel',
        placeholderKey: 'clinical.resources.maintenanceRequests.form.reportedAtPlaceholder',
        hintKey: 'clinical.resources.maintenanceRequests.form.reportedAtHint',
      },
      {
        name: 'resolved_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.maintenanceRequests.form.resolvedAtLabel',
        placeholderKey: 'clinical.resources.maintenanceRequests.form.resolvedAtPlaceholder',
        hintKey: 'clinical.resources.maintenanceRequests.form.resolvedAtHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.maintenanceRequests.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      asset_id: sanitizeString(record?.asset_id || context?.assetId),
      status: sanitizeString(record?.status || context?.status || 'OPEN'),
      description: sanitizeString(record?.description),
      reported_at: sanitizeString(record?.reported_at),
      resolved_at: sanitizeString(record?.resolved_at),
    }),
    toPayload: (values) => ({
      facility_id: sanitizeString(values.facility_id) || null,
      asset_id: sanitizeString(values.asset_id) || null,
      status: sanitizeString(values.status),
      description: sanitizeString(values.description) || null,
      reported_at: sanitizeString(values.reported_at) ? toIsoDateTime(values.reported_at) : undefined,
      resolved_at: sanitizeString(values.resolved_at) ? toIsoDateTime(values.resolved_at) : null,
    }),
    validate: (values, t) => {
      const errors = {};
      const reportedAtError = buildDateTimeError(values.reported_at, t);
      const resolvedAtError = buildDateTimeError(values.resolved_at, t);
      if (reportedAtError) errors.reported_at = reportedAtError;
      if (resolvedAtError) errors.resolved_at = resolvedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.maintenanceRequests.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.maintenanceRequests.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.maintenanceRequests.detail.assetLabel', valueKey: 'asset_id' },
      { labelKey: 'clinical.resources.maintenanceRequests.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.maintenanceRequests.detail.descriptionLabel', valueKey: 'description' },
      { labelKey: 'clinical.resources.maintenanceRequests.detail.reportedAtLabel', valueKey: 'reported_at', type: 'datetime' },
      { labelKey: 'clinical.resources.maintenanceRequests.detail.resolvedAtLabel', valueKey: 'resolved_at', type: 'datetime' },
      { labelKey: 'clinical.resources.maintenanceRequests.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.maintenanceRequests.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ASSETS]: {
    id: CLINICAL_RESOURCE_IDS.ASSETS,
    routePath: `${HOUSEKEEPING_ROUTE_ROOT}/assets`,
    i18nKey: 'clinical.resources.assets',
    requiresTenant: true,
    supportsFacility: true,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'facility_id',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.assets.form.facilityIdLabel',
        placeholderKey: 'clinical.resources.assets.form.facilityIdPlaceholder',
        hintKey: 'clinical.resources.assets.form.facilityIdHint',
      },
      {
        name: 'name',
        type: 'text',
        required: true,
        maxLength: 255,
        labelKey: 'clinical.resources.assets.form.nameLabel',
        placeholderKey: 'clinical.resources.assets.form.namePlaceholder',
        hintKey: 'clinical.resources.assets.form.nameHint',
      },
      {
        name: 'asset_tag',
        type: 'text',
        required: false,
        maxLength: 80,
        labelKey: 'clinical.resources.assets.form.assetTagLabel',
        placeholderKey: 'clinical.resources.assets.form.assetTagPlaceholder',
        hintKey: 'clinical.resources.assets.form.assetTagHint',
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        labelKey: 'clinical.resources.assets.form.statusLabel',
        placeholderKey: 'clinical.resources.assets.form.statusPlaceholder',
        hintKey: 'clinical.resources.assets.form.statusHint',
        options: MAINTENANCE_STATUS_OPTIONS,
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const statusValue = sanitizeString(item?.status);
      if (!statusValue) return '';
      return `${t('clinical.resources.assets.detail.statusLabel')}: ${statusValue}`;
    },
    getInitialValues: (record, context) => ({
      facility_id: sanitizeString(record?.facility_id || context?.facilityId),
      name: sanitizeString(record?.name || context?.name),
      asset_tag: sanitizeString(record?.asset_tag || context?.assetTag),
      status: sanitizeString(record?.status || context?.status || 'OPEN'),
    }),
    toPayload: (values) => ({
      facility_id: sanitizeString(values.facility_id) || null,
      name: sanitizeString(values.name),
      asset_tag: sanitizeString(values.asset_tag) || null,
      status: sanitizeString(values.status),
    }),
    validate: () => ({}),
    detailRows: [
      { labelKey: 'clinical.resources.assets.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.assets.detail.tenantLabel', valueKey: 'tenant_id' },
      { labelKey: 'clinical.resources.assets.detail.facilityLabel', valueKey: 'facility_id' },
      { labelKey: 'clinical.resources.assets.detail.nameLabel', valueKey: 'name' },
      { labelKey: 'clinical.resources.assets.detail.assetTagLabel', valueKey: 'asset_tag' },
      { labelKey: 'clinical.resources.assets.detail.statusLabel', valueKey: 'status' },
      { labelKey: 'clinical.resources.assets.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.assets.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.ASSET_SERVICE_LOGS]: {
    id: CLINICAL_RESOURCE_IDS.ASSET_SERVICE_LOGS,
    routePath: `${HOUSEKEEPING_ROUTE_ROOT}/asset-service-logs`,
    i18nKey: 'clinical.resources.assetServiceLogs',
    requiresTenant: false,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [
      {
        name: 'asset_id',
        type: 'text',
        required: true,
        maxLength: 64,
        disableOnEdit: true,
        labelKey: 'clinical.resources.assetServiceLogs.form.assetIdLabel',
        placeholderKey: 'clinical.resources.assetServiceLogs.form.assetIdPlaceholder',
        hintKey: 'clinical.resources.assetServiceLogs.form.assetIdHint',
      },
      {
        name: 'serviced_at',
        type: 'text',
        required: false,
        maxLength: 64,
        labelKey: 'clinical.resources.assetServiceLogs.form.servicedAtLabel',
        placeholderKey: 'clinical.resources.assetServiceLogs.form.servicedAtPlaceholder',
        hintKey: 'clinical.resources.assetServiceLogs.form.servicedAtHint',
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        maxLength: 255,
        labelKey: 'clinical.resources.assetServiceLogs.form.notesLabel',
        placeholderKey: 'clinical.resources.assetServiceLogs.form.notesPlaceholder',
        hintKey: 'clinical.resources.assetServiceLogs.form.notesHint',
      },
    ],
    getItemTitle: (item) => sanitizeString(item?.asset_id) || sanitizeString(item?.id),
    getItemSubtitle: (item, t) => {
      const servicedAtValue = sanitizeString(item?.serviced_at);
      if (!servicedAtValue) return '';
      return `${t('clinical.resources.assetServiceLogs.detail.servicedAtLabel')}: ${servicedAtValue}`;
    },
    getInitialValues: (record, context) => ({
      asset_id: sanitizeString(record?.asset_id || context?.assetId),
      serviced_at: sanitizeString(record?.serviced_at),
      notes: sanitizeString(record?.notes),
    }),
    toPayload: (values, { isEdit = false } = {}) => {
      const payload = {
        serviced_at: sanitizeString(values.serviced_at) ? toIsoDateTime(values.serviced_at) : undefined,
        notes: sanitizeString(values.notes) || null,
      };
      if (!isEdit) {
        payload.asset_id = sanitizeString(values.asset_id);
      }
      return payload;
    },
    validate: (values, t) => {
      const errors = {};
      const servicedAtError = buildDateTimeError(values.serviced_at, t);
      if (servicedAtError) errors.serviced_at = servicedAtError;
      return errors;
    },
    detailRows: [
      { labelKey: 'clinical.resources.assetServiceLogs.detail.idLabel', valueKey: 'id' },
      { labelKey: 'clinical.resources.assetServiceLogs.detail.assetLabel', valueKey: 'asset_id' },
      { labelKey: 'clinical.resources.assetServiceLogs.detail.servicedAtLabel', valueKey: 'serviced_at', type: 'datetime' },
      { labelKey: 'clinical.resources.assetServiceLogs.detail.notesLabel', valueKey: 'notes' },
      { labelKey: 'clinical.resources.assetServiceLogs.detail.createdLabel', valueKey: 'created_at', type: 'datetime' },
      { labelKey: 'clinical.resources.assetServiceLogs.detail.updatedLabel', valueKey: 'updated_at', type: 'datetime' },
    ],
  },
  [CLINICAL_RESOURCE_IDS.DASHBOARD_WIDGETS]: {
    id: CLINICAL_RESOURCE_IDS.DASHBOARD_WIDGETS,
    routePath: REPORTS_ROUTE_ROOT,
    i18nKey: 'clinical.resources.dashboardWidgets',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: () => '',
    getInitialValues: () => ({}),
    toPayload: () => ({}),
    validate: () => ({}),
    detailRows: [],
  },
  [CLINICAL_RESOURCE_IDS.NOTIFICATIONS]: {
    id: CLINICAL_RESOURCE_IDS.NOTIFICATIONS,
    routePath: COMMUNICATIONS_ROUTE_ROOT,
    i18nKey: 'clinical.resources.notifications',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [],
    getItemTitle: (item) => sanitizeString(item?.title) || sanitizeString(item?.id),
    getItemSubtitle: () => '',
    getInitialValues: () => ({}),
    toPayload: () => ({}),
    validate: () => ({}),
    detailRows: [],
  },
  [CLINICAL_RESOURCE_IDS.SUBSCRIPTIONS]: {
    id: CLINICAL_RESOURCE_IDS.SUBSCRIPTIONS,
    routePath: SUBSCRIPTIONS_ROUTE_ROOT,
    i18nKey: 'clinical.resources.subscriptions',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [],
    getItemTitle: (item) => sanitizeString(item?.id),
    getItemSubtitle: () => '',
    getInitialValues: () => ({}),
    toPayload: () => ({}),
    validate: () => ({}),
    detailRows: [],
  },
  [CLINICAL_RESOURCE_IDS.INTEGRATIONS]: {
    id: CLINICAL_RESOURCE_IDS.INTEGRATIONS,
    routePath: INTEGRATIONS_ROUTE_ROOT,
    i18nKey: 'clinical.resources.integrations',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [],
    getItemTitle: (item) => sanitizeString(item?.name) || sanitizeString(item?.id),
    getItemSubtitle: () => '',
    getInitialValues: () => ({}),
    toPayload: () => ({}),
    validate: () => ({}),
    detailRows: [],
  },
  [CLINICAL_RESOURCE_IDS.AUDIT_LOGS]: {
    id: CLINICAL_RESOURCE_IDS.AUDIT_LOGS,
    routePath: COMPLIANCE_ROUTE_ROOT,
    i18nKey: 'clinical.resources.auditLogs',
    requiresTenant: true,
    supportsFacility: false,
    listParams: { page: 1, limit: 20 },
    fields: [],
    getItemTitle: (item) => sanitizeString(item?.action) || sanitizeString(item?.id),
    getItemSubtitle: () => '',
    getInitialValues: () => ({}),
    toPayload: () => ({}),
    validate: () => ({}),
    detailRows: [],
  },
};

const getClinicalResourceConfig = (resourceId) => resourceConfigs[resourceId] || null;

export {
  CLINICAL_RESOURCE_IDS,
  CLINICAL_RESOURCE_LIST_ORDER,
  CLINICAL_ROUTE_ROOT,
  IPD_RESOURCE_LIST_ORDER,
  ICU_RESOURCE_LIST_ORDER,
  THEATRE_RESOURCE_LIST_ORDER,
  EMERGENCY_RESOURCE_LIST_ORDER,
  LAB_RESOURCE_LIST_ORDER,
  RADIOLOGY_RESOURCE_LIST_ORDER,
  PHARMACY_RESOURCE_LIST_ORDER,
  INVENTORY_RESOURCE_LIST_ORDER,
  BILLING_RESOURCE_LIST_ORDER,
  HR_RESOURCE_LIST_ORDER,
  HOUSEKEEPING_RESOURCE_LIST_ORDER,
  REPORTS_RESOURCE_LIST_ORDER,
  COMMUNICATIONS_RESOURCE_LIST_ORDER,
  SUBSCRIPTIONS_RESOURCE_LIST_ORDER,
  INTEGRATIONS_RESOURCE_LIST_ORDER,
  COMPLIANCE_RESOURCE_LIST_ORDER,
  IPD_ROUTE_ROOT,
  ICU_ROUTE_ROOT,
  THEATRE_ROUTE_ROOT,
  EMERGENCY_ROUTE_ROOT,
  LAB_ROUTE_ROOT,
  RADIOLOGY_ROUTE_ROOT,
  PHARMACY_ROUTE_ROOT,
  INVENTORY_ROUTE_ROOT,
  BILLING_ROUTE_ROOT,
  HR_ROUTE_ROOT,
  HOUSEKEEPING_ROUTE_ROOT,
  REPORTS_ROUTE_ROOT,
  COMMUNICATIONS_ROUTE_ROOT,
  SUBSCRIPTIONS_ROUTE_ROOT,
  INTEGRATIONS_ROUTE_ROOT,
  COMPLIANCE_ROUTE_ROOT,
  getClinicalResourceConfig,
  getContextFilters,
  normalizeContextId,
  normalizeRouteId,
  normalizeSearchParam,
  sanitizeString,
  toIsoDateTime,
  withClinicalContext,
};
