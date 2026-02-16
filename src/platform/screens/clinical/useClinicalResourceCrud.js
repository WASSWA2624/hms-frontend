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
  useBedAssignment,
  useCarePlan,
  useClinicalAlert,
  useCriticalAlert,
  useClinicalNote,
  useDispenseLog,
  useDischargeSummary,
  useDiagnosis,
  useDrug,
  useDrugBatch,
  useEmergencyCase,
  useEmergencyResponse,
  useEncounter,
  useFollowUp,
  useFormularyItem,
  useGoodsReceipt,
  useIcuObservation,
  useIcuStay,
  useImagingStudy,
  useInventoryItem,
  useInventoryStock,
  useInvoice,
  useImagingAsset,
  usePayment,
  useRefund,
  useInsuranceClaim,
  usePreAuthorization,
  useBillingAdjustment,
  useStaffProfile,
  useStaffAssignment,
  useStaffLeave,
  useShift,
  useNurseRoster,
  usePayrollRun,
  useHousekeepingTask,
  useHousekeepingSchedule,
  useMaintenanceRequest,
  useAsset,
  useAssetServiceLog,
  useDashboardWidget,
  useNotification,
  useSubscription,
  useIntegration,
  useAuditLog,
  useLabOrder,
  useLabOrderItem,
  useLabPanel,
  useLabQcLog,
  useLabResult,
  useLabSample,
  useLabTest,
  useMedicationAdministration,
  useNursingNote,
  usePacsLink,
  usePharmacyOrder,
  usePharmacyOrderItem,
  usePostOpNote,
  usePurchaseRequest,
  usePurchaseOrder,
  useProcedure,
  useRadiologyOrder,
  useRadiologyResult,
  useRadiologyTest,
  useReferral,
  useStockAdjustment,
  useStockMovement,
  useSupplier,
  useTheatreCase,
  useTransferRequest,
  useTriageAssessment,
  useVitalSign,
  useWardRound,
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
  const invoice = useInvoice();
  const payment = usePayment();
  const refund = useRefund();
  const insuranceClaim = useInsuranceClaim();
  const preAuthorization = usePreAuthorization();
  const billingAdjustment = useBillingAdjustment();
  const staffProfile = useStaffProfile();
  const staffAssignment = useStaffAssignment();
  const staffLeave = useStaffLeave();
  const shift = useShift();
  const nurseRoster = useNurseRoster();
  const payrollRun = usePayrollRun();
  const housekeepingTask = useHousekeepingTask();
  const housekeepingSchedule = useHousekeepingSchedule();
  const maintenanceRequest = useMaintenanceRequest();
  const asset = useAsset();
  const assetServiceLog = useAssetServiceLog();
  const dashboardWidget = useDashboardWidget();
  const notification = useNotification();
  const subscription = useSubscription();
  const integration = useIntegration();
  const auditLog = useAuditLog();
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
      [CLINICAL_RESOURCE_IDS.PAYMENTS]: payment,
      [CLINICAL_RESOURCE_IDS.REFUNDS]: refund,
      [CLINICAL_RESOURCE_IDS.INSURANCE_CLAIMS]: insuranceClaim,
      [CLINICAL_RESOURCE_IDS.PRE_AUTHORIZATIONS]: preAuthorization,
      [CLINICAL_RESOURCE_IDS.BILLING_ADJUSTMENTS]: billingAdjustment,
      [CLINICAL_RESOURCE_IDS.STAFF_PROFILES]: staffProfile,
      [CLINICAL_RESOURCE_IDS.STAFF_ASSIGNMENTS]: staffAssignment,
      [CLINICAL_RESOURCE_IDS.STAFF_LEAVES]: staffLeave,
      [CLINICAL_RESOURCE_IDS.SHIFTS]: shift,
      [CLINICAL_RESOURCE_IDS.NURSE_ROSTERS]: nurseRoster,
      [CLINICAL_RESOURCE_IDS.PAYROLL_RUNS]: payrollRun,
      [CLINICAL_RESOURCE_IDS.HOUSEKEEPING_TASKS]: housekeepingTask,
      [CLINICAL_RESOURCE_IDS.HOUSEKEEPING_SCHEDULES]: housekeepingSchedule,
      [CLINICAL_RESOURCE_IDS.MAINTENANCE_REQUESTS]: maintenanceRequest,
      [CLINICAL_RESOURCE_IDS.ASSETS]: asset,
      [CLINICAL_RESOURCE_IDS.ASSET_SERVICE_LOGS]: assetServiceLog,
      [CLINICAL_RESOURCE_IDS.DASHBOARD_WIDGETS]: dashboardWidget,
      [CLINICAL_RESOURCE_IDS.NOTIFICATIONS]: notification,
      [CLINICAL_RESOURCE_IDS.SUBSCRIPTIONS]: subscription,
      [CLINICAL_RESOURCE_IDS.INTEGRATIONS]: integration,
      [CLINICAL_RESOURCE_IDS.AUDIT_LOGS]: auditLog,
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
    invoice,
    payment,
    refund,
    insuranceClaim,
    preAuthorization,
    billingAdjustment,
    staffProfile,
    staffAssignment,
    staffLeave,
    shift,
    nurseRoster,
    payrollRun,
    housekeepingTask,
    housekeepingSchedule,
    maintenanceRequest,
    asset,
    assetServiceLog,
    dashboardWidget,
    notification,
    subscription,
    integration,
    auditLog,
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
  ]);
};

export default useClinicalResourceCrud;
