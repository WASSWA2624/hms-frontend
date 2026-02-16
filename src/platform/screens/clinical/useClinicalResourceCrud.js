/**
 * Returns the CRUD hook state for the selected clinical resource.
 */
import { useMemo } from 'react';
import {
  useAdmission,
  useAnesthesiaRecord,
  useAdverseEvent,
  useAmbulance,
  useAmbulanceDispatch,
  useAmbulanceTrip,
  useAnalyticsEvent,
  useAsset,
  useAssetServiceLog,
  useAuditLog,
  useBedAssignment,
  useBillingAdjustment,
  useBreachNotification,
  useCarePlan,
  useClinicalAlert,
  useClinicalNote,
  useConversation,
  useCoveragePlan,
  useCriticalAlert,
  useDashboardWidget,
  useDataProcessingLog,
  useDiagnosis,
  useDischargeSummary,
  useDispenseLog,
  useDrug,
  useDrugBatch,
  useEmergencyCase,
  useEmergencyResponse,
  useEncounter,
  useEquipmentCalibrationLog,
  useEquipmentCategory,
  useEquipmentDisposalTransfer,
  useEquipmentDowntimeLog,
  useEquipmentIncidentReport,
  useEquipmentLocationHistory,
  useEquipmentMaintenancePlan,
  useEquipmentRecallNotice,
  useEquipmentRegistry,
  useEquipmentSafetyTestLog,
  useEquipmentServiceProvider,
  useEquipmentSparePart,
  useEquipmentUtilizationSnapshot,
  useEquipmentWarrantyContract,
  useEquipmentWorkOrder,
  useFollowUp,
  useFormularyItem,
  useGoodsReceipt,
  useHousekeepingSchedule,
  useHousekeepingTask,
  useIcuObservation,
  useIcuStay,
  useImagingAsset,
  useImagingStudy,
  useInsuranceClaim,
  useIntegration,
  useIntegrationLog,
  useInventoryItem,
  useInventoryStock,
  useInvoice,
  useInvoiceItem,
  useKpiSnapshot,
  useLabOrder,
  useLabOrderItem,
  useLabPanel,
  useLabQcLog,
  useLabResult,
  useLabSample,
  useLabTest,
  useLicense,
  useMaintenanceRequest,
  useMedicationAdministration,
  useMessage,
  useModule,
  useModuleSubscription,
  useNotification,
  useNotificationDelivery,
  useNurseRoster,
  useNursingNote,
  usePacsLink,
  usePayrollItem,
  usePayrollRun,
  usePayment,
  usePharmacyOrder,
  usePharmacyOrderItem,
  usePhiAccessLog,
  usePostOpNote,
  usePreAuthorization,
  usePricingRule,
  useProcedure,
  usePurchaseOrder,
  usePurchaseRequest,
  useRadiologyOrder,
  useRadiologyResult,
  useRadiologyTest,
  useReferral,
  useRefund,
  useReportDefinition,
  useReportRun,
  useRosterDayOff,
  useShift,
  useShiftAssignment,
  useShiftSwapRequest,
  useShiftTemplate,
  useStaffAssignment,
  useStaffAvailability,
  useStaffLeave,
  useStaffProfile,
  useStockAdjustment,
  useStockMovement,
  useSubscription,
  useSubscriptionInvoice,
  useSubscriptionPlan,
  useSupplier,
  useSystemChangeLog,
  useTemplate,
  useTemplateVariable,
  useTheatreCase,
  useTransferRequest,
  useTriageAssessment,
  useVitalSign,
  useWardRound,
  useWebhookSubscription,
} from '@hooks';
import { CLINICAL_RESOURCE_IDS } from './ClinicalResourceConfigs';

const useClinicalResourceCrud = (resourceId) => {
  const admission = useAdmission();
  const bedAssignment = useBedAssignment();
  const wardRound = useWardRound();
  const nursingNote = useNursingNote();
  const medicationAdministration = useMedicationAdministration();
  const dischargeSummary = useDischargeSummary();
  const transferRequest = useTransferRequest();
  const icuStay = useIcuStay();
  const icuObservation = useIcuObservation();
  const criticalAlert = useCriticalAlert();
  const theatreCase = useTheatreCase();
  const anesthesiaRecord = useAnesthesiaRecord();
  const postOpNote = usePostOpNote();
  const drug = useDrug();
  const drugBatch = useDrugBatch();
  const formularyItem = useFormularyItem();
  const pharmacyOrder = usePharmacyOrder();
  const pharmacyOrderItem = usePharmacyOrderItem();
  const dispenseLog = useDispenseLog();
  const adverseEvent = useAdverseEvent();
  const inventoryItem = useInventoryItem();
  const inventoryStock = useInventoryStock();
  const stockMovement = useStockMovement();
  const supplier = useSupplier();
  const purchaseRequest = usePurchaseRequest();
  const purchaseOrder = usePurchaseOrder();
  const goodsReceipt = useGoodsReceipt();
  const stockAdjustment = useStockAdjustment();
  const labTest = useLabTest();
  const labPanel = useLabPanel();
  const labOrder = useLabOrder();
  const labOrderItem = useLabOrderItem();
  const labSample = useLabSample();
  const labResult = useLabResult();
  const labQcLog = useLabQcLog();
  const radiologyTest = useRadiologyTest();
  const radiologyOrder = useRadiologyOrder();
  const radiologyResult = useRadiologyResult();
  const imagingStudy = useImagingStudy();
  const imagingAsset = useImagingAsset();
  const pacsLink = usePacsLink();
  const emergencyCase = useEmergencyCase();
  const triageAssessment = useTriageAssessment();
  const emergencyResponse = useEmergencyResponse();
  const ambulance = useAmbulance();
  const ambulanceDispatch = useAmbulanceDispatch();
  const ambulanceTrip = useAmbulanceTrip();
  const encounter = useEncounter();
  const clinicalNote = useClinicalNote();
  const diagnosis = useDiagnosis();
  const procedure = useProcedure();
  const vitalSign = useVitalSign();
  const carePlan = useCarePlan();
  const clinicalAlert = useClinicalAlert();
  const referral = useReferral();
  const followUp = useFollowUp();
  const invoice = useInvoice();
  const invoiceItem = useInvoiceItem();
  const payment = usePayment();
  const refund = useRefund();
  const pricingRule = usePricingRule();
  const coveragePlan = useCoveragePlan();
  const insuranceClaim = useInsuranceClaim();
  const preAuthorization = usePreAuthorization();
  const billingAdjustment = useBillingAdjustment();
  const staffProfile = useStaffProfile();
  const staffAssignment = useStaffAssignment();
  const staffLeave = useStaffLeave();
  const shift = useShift();
  const shiftAssignment = useShiftAssignment();
  const shiftSwapRequest = useShiftSwapRequest();
  const nurseRoster = useNurseRoster();
  const shiftTemplate = useShiftTemplate();
  const rosterDayOff = useRosterDayOff();
  const staffAvailability = useStaffAvailability();
  const payrollRun = usePayrollRun();
  const payrollItem = usePayrollItem();
  const housekeepingTask = useHousekeepingTask();
  const housekeepingSchedule = useHousekeepingSchedule();
  const maintenanceRequest = useMaintenanceRequest();
  const asset = useAsset();
  const assetServiceLog = useAssetServiceLog();
  const equipmentCategory = useEquipmentCategory();
  const equipmentRegistry = useEquipmentRegistry();
  const equipmentLocationHistory = useEquipmentLocationHistory();
  const equipmentDisposalTransfer = useEquipmentDisposalTransfer();
  const equipmentMaintenancePlan = useEquipmentMaintenancePlan();
  const equipmentWorkOrder = useEquipmentWorkOrder();
  const equipmentCalibrationLog = useEquipmentCalibrationLog();
  const equipmentSafetyTestLog = useEquipmentSafetyTestLog();
  const equipmentDowntimeLog = useEquipmentDowntimeLog();
  const equipmentIncidentReport = useEquipmentIncidentReport();
  const equipmentRecallNotice = useEquipmentRecallNotice();
  const equipmentSparePart = useEquipmentSparePart();
  const equipmentWarrantyContract = useEquipmentWarrantyContract();
  const equipmentServiceProvider = useEquipmentServiceProvider();
  const equipmentUtilizationSnapshot = useEquipmentUtilizationSnapshot();
  const reportDefinition = useReportDefinition();
  const reportRun = useReportRun();
  const dashboardWidget = useDashboardWidget();
  const kpiSnapshot = useKpiSnapshot();
  const analyticsEvent = useAnalyticsEvent();
  const notification = useNotification();
  const notificationDelivery = useNotificationDelivery();
  const conversation = useConversation();
  const message = useMessage();
  const template = useTemplate();
  const templateVariable = useTemplateVariable();
  const subscriptionPlan = useSubscriptionPlan();
  const subscription = useSubscription();
  const subscriptionInvoice = useSubscriptionInvoice();
  const module = useModule();
  const moduleSubscription = useModuleSubscription();
  const license = useLicense();
  const integration = useIntegration();
  const integrationLog = useIntegrationLog();
  const webhookSubscription = useWebhookSubscription();
  const auditLog = useAuditLog();
  const phiAccessLog = usePhiAccessLog();
  const dataProcessingLog = useDataProcessingLog();
  const breachNotification = useBreachNotification();
  const systemChangeLog = useSystemChangeLog();

  return useMemo(() => {
    const map = {
      [CLINICAL_RESOURCE_IDS.ADMISSIONS]: admission,
      [CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS]: bedAssignment,
      [CLINICAL_RESOURCE_IDS.WARD_ROUNDS]: wardRound,
      [CLINICAL_RESOURCE_IDS.NURSING_NOTES]: nursingNote,
      [CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS]: medicationAdministration,
      [CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES]: dischargeSummary,
      [CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS]: transferRequest,
      [CLINICAL_RESOURCE_IDS.ICU_STAYS]: icuStay,
      [CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS]: icuObservation,
      [CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS]: criticalAlert,
      [CLINICAL_RESOURCE_IDS.THEATRE_CASES]: theatreCase,
      [CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS]: anesthesiaRecord,
      [CLINICAL_RESOURCE_IDS.POST_OP_NOTES]: postOpNote,
      [CLINICAL_RESOURCE_IDS.DRUGS]: drug,
      [CLINICAL_RESOURCE_IDS.DRUG_BATCHES]: drugBatch,
      [CLINICAL_RESOURCE_IDS.FORMULARY_ITEMS]: formularyItem,
      [CLINICAL_RESOURCE_IDS.PHARMACY_ORDERS]: pharmacyOrder,
      [CLINICAL_RESOURCE_IDS.PHARMACY_ORDER_ITEMS]: pharmacyOrderItem,
      [CLINICAL_RESOURCE_IDS.DISPENSE_LOGS]: dispenseLog,
      [CLINICAL_RESOURCE_IDS.ADVERSE_EVENTS]: adverseEvent,
      [CLINICAL_RESOURCE_IDS.INVENTORY_ITEMS]: inventoryItem,
      [CLINICAL_RESOURCE_IDS.INVENTORY_STOCKS]: inventoryStock,
      [CLINICAL_RESOURCE_IDS.STOCK_MOVEMENTS]: stockMovement,
      [CLINICAL_RESOURCE_IDS.SUPPLIERS]: supplier,
      [CLINICAL_RESOURCE_IDS.PURCHASE_REQUESTS]: purchaseRequest,
      [CLINICAL_RESOURCE_IDS.PURCHASE_ORDERS]: purchaseOrder,
      [CLINICAL_RESOURCE_IDS.GOODS_RECEIPTS]: goodsReceipt,
      [CLINICAL_RESOURCE_IDS.STOCK_ADJUSTMENTS]: stockAdjustment,
      [CLINICAL_RESOURCE_IDS.LAB_TESTS]: labTest,
      [CLINICAL_RESOURCE_IDS.LAB_PANELS]: labPanel,
      [CLINICAL_RESOURCE_IDS.LAB_ORDERS]: labOrder,
      [CLINICAL_RESOURCE_IDS.LAB_ORDER_ITEMS]: labOrderItem,
      [CLINICAL_RESOURCE_IDS.LAB_SAMPLES]: labSample,
      [CLINICAL_RESOURCE_IDS.LAB_RESULTS]: labResult,
      [CLINICAL_RESOURCE_IDS.LAB_QC_LOGS]: labQcLog,
      [CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS]: radiologyTest,
      [CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS]: radiologyOrder,
      [CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS]: radiologyResult,
      [CLINICAL_RESOURCE_IDS.IMAGING_STUDIES]: imagingStudy,
      [CLINICAL_RESOURCE_IDS.IMAGING_ASSETS]: imagingAsset,
      [CLINICAL_RESOURCE_IDS.PACS_LINKS]: pacsLink,
      [CLINICAL_RESOURCE_IDS.EMERGENCY_CASES]: emergencyCase,
      [CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS]: triageAssessment,
      [CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES]: emergencyResponse,
      [CLINICAL_RESOURCE_IDS.AMBULANCES]: ambulance,
      [CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES]: ambulanceDispatch,
      [CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS]: ambulanceTrip,
      [CLINICAL_RESOURCE_IDS.ENCOUNTERS]: encounter,
      [CLINICAL_RESOURCE_IDS.CLINICAL_NOTES]: clinicalNote,
      [CLINICAL_RESOURCE_IDS.DIAGNOSES]: diagnosis,
      [CLINICAL_RESOURCE_IDS.PROCEDURES]: procedure,
      [CLINICAL_RESOURCE_IDS.VITAL_SIGNS]: vitalSign,
      [CLINICAL_RESOURCE_IDS.CARE_PLANS]: carePlan,
      [CLINICAL_RESOURCE_IDS.CLINICAL_ALERTS]: clinicalAlert,
      [CLINICAL_RESOURCE_IDS.REFERRALS]: referral,
      [CLINICAL_RESOURCE_IDS.FOLLOW_UPS]: followUp,
      [CLINICAL_RESOURCE_IDS.INVOICES]: invoice,
      [CLINICAL_RESOURCE_IDS.INVOICE_ITEMS]: invoiceItem,
      [CLINICAL_RESOURCE_IDS.PAYMENTS]: payment,
      [CLINICAL_RESOURCE_IDS.REFUNDS]: refund,
      [CLINICAL_RESOURCE_IDS.PRICING_RULES]: pricingRule,
      [CLINICAL_RESOURCE_IDS.COVERAGE_PLANS]: coveragePlan,
      [CLINICAL_RESOURCE_IDS.INSURANCE_CLAIMS]: insuranceClaim,
      [CLINICAL_RESOURCE_IDS.PRE_AUTHORIZATIONS]: preAuthorization,
      [CLINICAL_RESOURCE_IDS.BILLING_ADJUSTMENTS]: billingAdjustment,
      [CLINICAL_RESOURCE_IDS.STAFF_PROFILES]: staffProfile,
      [CLINICAL_RESOURCE_IDS.STAFF_ASSIGNMENTS]: staffAssignment,
      [CLINICAL_RESOURCE_IDS.STAFF_LEAVES]: staffLeave,
      [CLINICAL_RESOURCE_IDS.SHIFTS]: shift,
      [CLINICAL_RESOURCE_IDS.SHIFT_ASSIGNMENTS]: shiftAssignment,
      [CLINICAL_RESOURCE_IDS.SHIFT_SWAP_REQUESTS]: shiftSwapRequest,
      [CLINICAL_RESOURCE_IDS.NURSE_ROSTERS]: nurseRoster,
      [CLINICAL_RESOURCE_IDS.SHIFT_TEMPLATES]: shiftTemplate,
      [CLINICAL_RESOURCE_IDS.ROSTER_DAY_OFFS]: rosterDayOff,
      [CLINICAL_RESOURCE_IDS.STAFF_AVAILABILITIES]: staffAvailability,
      [CLINICAL_RESOURCE_IDS.PAYROLL_RUNS]: payrollRun,
      [CLINICAL_RESOURCE_IDS.PAYROLL_ITEMS]: payrollItem,
      [CLINICAL_RESOURCE_IDS.HOUSEKEEPING_TASKS]: housekeepingTask,
      [CLINICAL_RESOURCE_IDS.HOUSEKEEPING_SCHEDULES]: housekeepingSchedule,
      [CLINICAL_RESOURCE_IDS.MAINTENANCE_REQUESTS]: maintenanceRequest,
      [CLINICAL_RESOURCE_IDS.ASSETS]: asset,
      [CLINICAL_RESOURCE_IDS.ASSET_SERVICE_LOGS]: assetServiceLog,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_CATEGORIES]: equipmentCategory,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_REGISTRIES]: equipmentRegistry,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_LOCATION_HISTORIES]: equipmentLocationHistory,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_DISPOSAL_TRANSFERS]: equipmentDisposalTransfer,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_MAINTENANCE_PLANS]: equipmentMaintenancePlan,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_WORK_ORDERS]: equipmentWorkOrder,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_CALIBRATION_LOGS]: equipmentCalibrationLog,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_SAFETY_TEST_LOGS]: equipmentSafetyTestLog,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_DOWNTIME_LOGS]: equipmentDowntimeLog,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_INCIDENT_REPORTS]: equipmentIncidentReport,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_RECALL_NOTICES]: equipmentRecallNotice,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_SPARE_PARTS]: equipmentSparePart,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_WARRANTY_CONTRACTS]: equipmentWarrantyContract,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_SERVICE_PROVIDERS]: equipmentServiceProvider,
      [CLINICAL_RESOURCE_IDS.EQUIPMENT_UTILIZATION_SNAPSHOTS]: equipmentUtilizationSnapshot,
      [CLINICAL_RESOURCE_IDS.REPORT_DEFINITIONS]: reportDefinition,
      [CLINICAL_RESOURCE_IDS.REPORT_RUNS]: reportRun,
      [CLINICAL_RESOURCE_IDS.DASHBOARD_WIDGETS]: dashboardWidget,
      [CLINICAL_RESOURCE_IDS.KPI_SNAPSHOTS]: kpiSnapshot,
      [CLINICAL_RESOURCE_IDS.ANALYTICS_EVENTS]: analyticsEvent,
      [CLINICAL_RESOURCE_IDS.NOTIFICATIONS]: notification,
      [CLINICAL_RESOURCE_IDS.NOTIFICATION_DELIVERIES]: notificationDelivery,
      [CLINICAL_RESOURCE_IDS.CONVERSATIONS]: conversation,
      [CLINICAL_RESOURCE_IDS.MESSAGES]: message,
      [CLINICAL_RESOURCE_IDS.TEMPLATES]: template,
      [CLINICAL_RESOURCE_IDS.TEMPLATE_VARIABLES]: templateVariable,
      [CLINICAL_RESOURCE_IDS.SUBSCRIPTION_PLANS]: subscriptionPlan,
      [CLINICAL_RESOURCE_IDS.SUBSCRIPTIONS]: subscription,
      [CLINICAL_RESOURCE_IDS.SUBSCRIPTION_INVOICES]: subscriptionInvoice,
      [CLINICAL_RESOURCE_IDS.MODULES]: module,
      [CLINICAL_RESOURCE_IDS.MODULE_SUBSCRIPTIONS]: moduleSubscription,
      [CLINICAL_RESOURCE_IDS.LICENSES]: license,
      [CLINICAL_RESOURCE_IDS.INTEGRATIONS]: integration,
      [CLINICAL_RESOURCE_IDS.INTEGRATION_LOGS]: integrationLog,
      [CLINICAL_RESOURCE_IDS.WEBHOOK_SUBSCRIPTIONS]: webhookSubscription,
      [CLINICAL_RESOURCE_IDS.AUDIT_LOGS]: auditLog,
      [CLINICAL_RESOURCE_IDS.PHI_ACCESS_LOGS]: phiAccessLog,
      [CLINICAL_RESOURCE_IDS.DATA_PROCESSING_LOGS]: dataProcessingLog,
      [CLINICAL_RESOURCE_IDS.BREACH_NOTIFICATIONS]: breachNotification,
      [CLINICAL_RESOURCE_IDS.SYSTEM_CHANGE_LOGS]: systemChangeLog,
    };
    return map[resourceId] || encounter;
  }, [
    resourceId,
    admission,
    bedAssignment,
    wardRound,
    nursingNote,
    medicationAdministration,
    dischargeSummary,
    transferRequest,
    icuStay,
    icuObservation,
    criticalAlert,
    theatreCase,
    anesthesiaRecord,
    postOpNote,
    drug,
    drugBatch,
    formularyItem,
    pharmacyOrder,
    pharmacyOrderItem,
    dispenseLog,
    adverseEvent,
    inventoryItem,
    inventoryStock,
    stockMovement,
    supplier,
    purchaseRequest,
    purchaseOrder,
    goodsReceipt,
    stockAdjustment,
    labTest,
    labPanel,
    labOrder,
    labOrderItem,
    labSample,
    labResult,
    labQcLog,
    radiologyTest,
    radiologyOrder,
    radiologyResult,
    imagingStudy,
    imagingAsset,
    pacsLink,
    emergencyCase,
    triageAssessment,
    emergencyResponse,
    ambulance,
    ambulanceDispatch,
    ambulanceTrip,
    encounter,
    clinicalNote,
    diagnosis,
    procedure,
    vitalSign,
    carePlan,
    clinicalAlert,
    referral,
    followUp,
    invoice,
    invoiceItem,
    payment,
    refund,
    pricingRule,
    coveragePlan,
    insuranceClaim,
    preAuthorization,
    billingAdjustment,
    staffProfile,
    staffAssignment,
    staffLeave,
    shift,
    shiftAssignment,
    shiftSwapRequest,
    nurseRoster,
    shiftTemplate,
    rosterDayOff,
    staffAvailability,
    payrollRun,
    payrollItem,
    housekeepingTask,
    housekeepingSchedule,
    maintenanceRequest,
    asset,
    assetServiceLog,
    equipmentCategory,
    equipmentRegistry,
    equipmentLocationHistory,
    equipmentDisposalTransfer,
    equipmentMaintenancePlan,
    equipmentWorkOrder,
    equipmentCalibrationLog,
    equipmentSafetyTestLog,
    equipmentDowntimeLog,
    equipmentIncidentReport,
    equipmentRecallNotice,
    equipmentSparePart,
    equipmentWarrantyContract,
    equipmentServiceProvider,
    equipmentUtilizationSnapshot,
    reportDefinition,
    reportRun,
    dashboardWidget,
    kpiSnapshot,
    analyticsEvent,
    notification,
    notificationDelivery,
    conversation,
    message,
    template,
    templateVariable,
    subscriptionPlan,
    subscription,
    subscriptionInvoice,
    module,
    moduleSubscription,
    license,
    integration,
    integrationLog,
    webhookSubscription,
    auditLog,
    phiAccessLog,
    dataProcessingLog,
    breachNotification,
    systemChangeLog,
  ]);
};

export default useClinicalResourceCrud;
