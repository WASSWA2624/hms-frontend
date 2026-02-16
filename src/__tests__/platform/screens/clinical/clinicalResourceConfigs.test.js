import {
  CLINICAL_RESOURCE_IDS,
  CLINICAL_RESOURCE_LIST_ORDER,
  EMERGENCY_RESOURCE_LIST_ORDER,
  INVENTORY_RESOURCE_LIST_ORDER,
  ICU_RESOURCE_LIST_ORDER,
  IPD_RESOURCE_LIST_ORDER,
  LAB_RESOURCE_LIST_ORDER,
  PHARMACY_RESOURCE_LIST_ORDER,
  RADIOLOGY_RESOURCE_LIST_ORDER,
  THEATRE_RESOURCE_LIST_ORDER,
  getClinicalResourceConfig,
  getContextFilters,
} from '@platform/screens/clinical/ClinicalResourceConfigs';

describe('clinicalResourceConfigs', () => {
  it('includes clinical alerts in tier 6 order', () => {
    const carePlansIndex = CLINICAL_RESOURCE_LIST_ORDER.indexOf(CLINICAL_RESOURCE_IDS.CARE_PLANS);
    const clinicalAlertsIndex = CLINICAL_RESOURCE_LIST_ORDER.indexOf(
      CLINICAL_RESOURCE_IDS.CLINICAL_ALERTS
    );
    const referralsIndex = CLINICAL_RESOURCE_LIST_ORDER.indexOf(CLINICAL_RESOURCE_IDS.REFERRALS);

    expect(carePlansIndex).toBeGreaterThan(-1);
    expect(clinicalAlertsIndex).toBeGreaterThan(-1);
    expect(referralsIndex).toBeGreaterThan(-1);
    expect(carePlansIndex).toBeLessThan(clinicalAlertsIndex);
    expect(clinicalAlertsIndex).toBeLessThan(referralsIndex);
  });

  it('maps clinical alert context filters from encounter context', () => {
    const filters = getContextFilters(CLINICAL_RESOURCE_IDS.CLINICAL_ALERTS, {
      encounterId: 'encounter-1',
      severity: 'HIGH',
    });

    expect(filters).toEqual({
      encounter_id: 'encounter-1',
      severity: 'HIGH',
    });
  });

  it('provides clinical alert resource config', () => {
    const config = getClinicalResourceConfig(CLINICAL_RESOURCE_IDS.CLINICAL_ALERTS);

    expect(config).toBeTruthy();
    expect(config?.routePath).toBe('/clinical/clinical-alerts');
    expect(config?.requiresTenant).toBe(false);
    expect(config?.supportsFacility).toBe(false);
    expect(config?.fields?.length).toBe(3);
  });

  it('keeps IPD resources in tier 7 order', () => {
    const admissionsIndex = IPD_RESOURCE_LIST_ORDER.indexOf(CLINICAL_RESOURCE_IDS.ADMISSIONS);
    const bedAssignmentsIndex = IPD_RESOURCE_LIST_ORDER.indexOf(CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS);
    const wardRoundsIndex = IPD_RESOURCE_LIST_ORDER.indexOf(CLINICAL_RESOURCE_IDS.WARD_ROUNDS);
    const nursingNotesIndex = IPD_RESOURCE_LIST_ORDER.indexOf(CLINICAL_RESOURCE_IDS.NURSING_NOTES);
    const medicationAdministrationsIndex = IPD_RESOURCE_LIST_ORDER.indexOf(
      CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS
    );
    const dischargeSummariesIndex = IPD_RESOURCE_LIST_ORDER.indexOf(
      CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES
    );
    const transferRequestsIndex = IPD_RESOURCE_LIST_ORDER.indexOf(
      CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS
    );

    expect(admissionsIndex).toBeGreaterThan(-1);
    expect(bedAssignmentsIndex).toBeGreaterThan(admissionsIndex);
    expect(wardRoundsIndex).toBeGreaterThan(bedAssignmentsIndex);
    expect(nursingNotesIndex).toBeGreaterThan(wardRoundsIndex);
    expect(medicationAdministrationsIndex).toBeGreaterThan(nursingNotesIndex);
    expect(dischargeSummariesIndex).toBeGreaterThan(medicationAdministrationsIndex);
    expect(transferRequestsIndex).toBeGreaterThan(dischargeSummariesIndex);
  });

  it('keeps ICU, theatre, and emergency resources in tier 7 order', () => {
    expect(ICU_RESOURCE_LIST_ORDER).toEqual([
      CLINICAL_RESOURCE_IDS.ICU_STAYS,
      CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS,
      CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS,
    ]);

    expect(THEATRE_RESOURCE_LIST_ORDER).toEqual([
      CLINICAL_RESOURCE_IDS.THEATRE_CASES,
      CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS,
      CLINICAL_RESOURCE_IDS.POST_OP_NOTES,
    ]);

    expect(EMERGENCY_RESOURCE_LIST_ORDER).toEqual([
      CLINICAL_RESOURCE_IDS.EMERGENCY_CASES,
      CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS,
      CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES,
      CLINICAL_RESOURCE_IDS.AMBULANCES,
      CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES,
      CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS,
    ]);
  });

  it('maps tier 7 context filters for transfer requests and critical alerts', () => {
    expect(
      getContextFilters(CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS, {
        admissionId: 'admission-1',
        fromWardId: 'ward-1',
        toWardId: 'ward-2',
        status: 'APPROVED',
        search: 'night transfer',
      })
    ).toEqual({
      admission_id: 'admission-1',
      from_ward_id: 'ward-1',
      to_ward_id: 'ward-2',
      status: 'APPROVED',
      search: 'night transfer',
    });

    expect(
      getContextFilters(CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS, {
        icuStayId: 'icu-stay-1',
        severity: 'HIGH',
        search: 'airway',
      })
    ).toEqual({
      icu_stay_id: 'icu-stay-1',
      severity: 'HIGH',
      search: 'airway',
    });
  });

  it('provides tier 7 primary resource configs', () => {
    const admissionsConfig = getClinicalResourceConfig(CLINICAL_RESOURCE_IDS.ADMISSIONS);
    const icuStaysConfig = getClinicalResourceConfig(CLINICAL_RESOURCE_IDS.ICU_STAYS);
    const theatreCasesConfig = getClinicalResourceConfig(CLINICAL_RESOURCE_IDS.THEATRE_CASES);
    const emergencyCasesConfig = getClinicalResourceConfig(CLINICAL_RESOURCE_IDS.EMERGENCY_CASES);

    expect(admissionsConfig?.routePath).toBe('/ipd/admissions');
    expect(admissionsConfig?.requiresTenant).toBe(true);
    expect(admissionsConfig?.supportsFacility).toBe(true);

    expect(icuStaysConfig?.routePath).toBe('/icu/icu-stays');
    expect(theatreCasesConfig?.routePath).toBe('/theatre/theatre-cases');
    expect(emergencyCasesConfig?.routePath).toBe('/emergency/emergency-cases');
  });

  it('keeps lab and radiology resources in tier 8 order', () => {
    expect(LAB_RESOURCE_LIST_ORDER).toEqual([
      CLINICAL_RESOURCE_IDS.LAB_TESTS,
      CLINICAL_RESOURCE_IDS.LAB_PANELS,
      CLINICAL_RESOURCE_IDS.LAB_ORDERS,
      CLINICAL_RESOURCE_IDS.LAB_ORDER_ITEMS,
      CLINICAL_RESOURCE_IDS.LAB_SAMPLES,
      CLINICAL_RESOURCE_IDS.LAB_RESULTS,
      CLINICAL_RESOURCE_IDS.LAB_QC_LOGS,
    ]);

    expect(RADIOLOGY_RESOURCE_LIST_ORDER).toEqual([
      CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS,
      CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS,
      CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS,
      CLINICAL_RESOURCE_IDS.IMAGING_STUDIES,
      CLINICAL_RESOURCE_IDS.IMAGING_ASSETS,
      CLINICAL_RESOURCE_IDS.PACS_LINKS,
    ]);
  });

  it('maps tier 8 context filters for lab order items and imaging assets', () => {
    expect(
      getContextFilters(CLINICAL_RESOURCE_IDS.LAB_ORDER_ITEMS, {
        labOrderId: 'lab-order-1',
        labTestId: 'lab-test-1',
        status: 'IN_PROCESS',
        search: 'cbc',
      })
    ).toEqual({
      lab_order_id: 'lab-order-1',
      lab_test_id: 'lab-test-1',
      status: 'IN_PROCESS',
      search: 'cbc',
    });

    expect(
      getContextFilters(CLINICAL_RESOURCE_IDS.IMAGING_ASSETS, {
        imagingStudyId: 'study-1',
        contentType: 'image/dicom',
      })
    ).toEqual({
      imaging_study_id: 'study-1',
      content_type: 'image/dicom',
    });
  });

  it('provides tier 8 resource configs for lab order items and imaging assets', () => {
    const labOrderItemsConfig = getClinicalResourceConfig(CLINICAL_RESOURCE_IDS.LAB_ORDER_ITEMS);
    const imagingAssetsConfig = getClinicalResourceConfig(CLINICAL_RESOURCE_IDS.IMAGING_ASSETS);

    expect(labOrderItemsConfig?.routePath).toBe('/diagnostics/lab/lab-order-items');
    expect(labOrderItemsConfig?.fields?.length).toBe(3);
    expect(labOrderItemsConfig?.requiresTenant).toBe(false);

    expect(imagingAssetsConfig?.routePath).toBe('/diagnostics/radiology/imaging-assets');
    expect(imagingAssetsConfig?.fields?.length).toBe(4);
    expect(imagingAssetsConfig?.requiresTenant).toBe(false);
  });

  it('keeps pharmacy and inventory resources in tier 9 order', () => {
    expect(PHARMACY_RESOURCE_LIST_ORDER).toEqual([
      CLINICAL_RESOURCE_IDS.DRUGS,
      CLINICAL_RESOURCE_IDS.DRUG_BATCHES,
      CLINICAL_RESOURCE_IDS.FORMULARY_ITEMS,
      CLINICAL_RESOURCE_IDS.PHARMACY_ORDERS,
      CLINICAL_RESOURCE_IDS.PHARMACY_ORDER_ITEMS,
      CLINICAL_RESOURCE_IDS.DISPENSE_LOGS,
      CLINICAL_RESOURCE_IDS.ADVERSE_EVENTS,
    ]);

    expect(INVENTORY_RESOURCE_LIST_ORDER).toEqual([
      CLINICAL_RESOURCE_IDS.INVENTORY_ITEMS,
      CLINICAL_RESOURCE_IDS.INVENTORY_STOCKS,
      CLINICAL_RESOURCE_IDS.STOCK_MOVEMENTS,
      CLINICAL_RESOURCE_IDS.SUPPLIERS,
      CLINICAL_RESOURCE_IDS.PURCHASE_REQUESTS,
      CLINICAL_RESOURCE_IDS.PURCHASE_ORDERS,
      CLINICAL_RESOURCE_IDS.GOODS_RECEIPTS,
      CLINICAL_RESOURCE_IDS.STOCK_ADJUSTMENTS,
    ]);
  });

  it('maps tier 9 context filters for pharmacy order items and purchase requests', () => {
    expect(
      getContextFilters(CLINICAL_RESOURCE_IDS.PHARMACY_ORDER_ITEMS, {
        pharmacyOrderId: 'pharmacy-order-1',
        drugId: 'drug-1',
        status: 'ACTIVE',
        route: 'ORAL',
        frequency: 'BID',
        search: 'metformin',
      })
    ).toEqual({
      pharmacy_order_id: 'pharmacy-order-1',
      drug_id: 'drug-1',
      status: 'ACTIVE',
      route: 'ORAL',
      frequency: 'BID',
      search: 'metformin',
    });

    expect(
      getContextFilters(CLINICAL_RESOURCE_IDS.PURCHASE_REQUESTS, {
        tenantId: 'tenant-1',
        facilityId: 'facility-1',
        requestedByUserId: 'user-1',
        status: 'PENDING_APPROVAL',
        search: 'urgent supplies',
      })
    ).toEqual({
      tenant_id: 'tenant-1',
      facility_id: 'facility-1',
      requested_by_user_id: 'user-1',
      status: 'PENDING_APPROVAL',
      search: 'urgent supplies',
    });
  });

  it('provides tier 9 resource configs for pharmacy order items and purchase requests', () => {
    const pharmacyOrderItemsConfig = getClinicalResourceConfig(
      CLINICAL_RESOURCE_IDS.PHARMACY_ORDER_ITEMS
    );
    const purchaseRequestsConfig = getClinicalResourceConfig(
      CLINICAL_RESOURCE_IDS.PURCHASE_REQUESTS
    );

    expect(pharmacyOrderItemsConfig?.routePath).toBe('/pharmacy/pharmacy-order-items');
    expect(pharmacyOrderItemsConfig?.fields?.length).toBe(7);
    expect(pharmacyOrderItemsConfig?.requiresTenant).toBe(false);

    expect(purchaseRequestsConfig?.routePath).toBe('/inventory/purchase-requests');
    expect(purchaseRequestsConfig?.fields?.length).toBe(5);
    expect(purchaseRequestsConfig?.requiresTenant).toBe(true);
    expect(purchaseRequestsConfig?.supportsFacility).toBe(true);
  });
});
