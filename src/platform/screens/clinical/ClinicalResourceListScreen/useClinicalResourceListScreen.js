/**
 * Shared logic for Clinical resource list screens.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, useClinicalAccess } from '@hooks';
import { confirmAction } from '@utils';
import {
  getContextFilters,
  getClinicalResourceConfig,
  normalizeSearchParam,
  sanitizeString,
  CLINICAL_ROUTE_ROOT,
  CLINICAL_RESOURCE_IDS,
  withClinicalContext,
} from '../ClinicalResourceConfigs';
import useClinicalResourceCrud from '../useClinicalResourceCrud';
import {
  buildNoticeMessage,
  isAccessDeniedError,
  normalizeNoticeValue,
  normalizeClinicalContext,
  resolveErrorMessage,
} from '../ClinicalScreenUtils';

const buildItemContext = (resourceId, item, baseContext) => {
  if (!item || typeof item !== 'object') return baseContext;

  if (resourceId === CLINICAL_RESOURCE_IDS.ENCOUNTERS) {
    return {
      ...baseContext,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      encounterId: sanitizeString(item.id) || baseContext.encounterId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      providerUserId: sanitizeString(item.provider_user_id) || baseContext.providerUserId,
      encounterType: sanitizeString(item.encounter_type) || baseContext.encounterType,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CLINICAL_NOTES) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      authorUserId: sanitizeString(item.author_user_id) || baseContext.authorUserId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DIAGNOSES) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      diagnosisType: sanitizeString(item.diagnosis_type) || baseContext.diagnosisType,
      code: sanitizeString(item.code) || baseContext.code,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PROCEDURES) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      code: sanitizeString(item.code) || baseContext.code,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.VITAL_SIGNS) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      vitalType: sanitizeString(item.vital_type) || baseContext.vitalType,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CARE_PLANS) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      startDate: sanitizeString(item.start_date) || baseContext.startDate,
      endDate: sanitizeString(item.end_date) || baseContext.endDate,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CLINICAL_ALERTS) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      severity: sanitizeString(item.severity) || baseContext.severity,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.REFERRALS) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      fromDepartmentId: sanitizeString(item.from_department_id) || baseContext.fromDepartmentId,
      toDepartmentId: sanitizeString(item.to_department_id) || baseContext.toDepartmentId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.FOLLOW_UPS) {
    return {
      ...baseContext,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ADMISSIONS) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.id) || baseContext.admissionId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      bedId: sanitizeString(item.bed_id) || baseContext.bedId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.WARD_ROUNDS) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.NURSING_NOTES) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      nurseUserId: sanitizeString(item.nurse_user_id) || baseContext.nurseUserId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      prescriptionId: sanitizeString(item.prescription_id) || baseContext.prescriptionId,
      route: sanitizeString(item.route) || baseContext.route,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS) {
    return {
      ...baseContext,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      fromWardId: sanitizeString(item.from_ward_id) || baseContext.fromWardId,
      toWardId: sanitizeString(item.to_ward_id) || baseContext.toWardId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ICU_STAYS) {
    return {
      ...baseContext,
      icuStayId: sanitizeString(item.id) || baseContext.icuStayId,
      admissionId: sanitizeString(item.admission_id) || baseContext.admissionId,
      startedAtFrom: sanitizeString(item.started_at) || baseContext.startedAtFrom,
      endedAtTo: sanitizeString(item.ended_at) || baseContext.endedAtTo,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS) {
    return {
      ...baseContext,
      icuStayId: sanitizeString(item.icu_stay_id) || baseContext.icuStayId,
      observedAtFrom: sanitizeString(item.observed_at) || baseContext.observedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS) {
    return {
      ...baseContext,
      icuStayId: sanitizeString(item.icu_stay_id) || baseContext.icuStayId,
      severity: sanitizeString(item.severity) || baseContext.severity,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.THEATRE_CASES) {
    return {
      ...baseContext,
      theatreCaseId: sanitizeString(item.id) || baseContext.theatreCaseId,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      status: sanitizeString(item.status) || baseContext.status,
      scheduledFrom: sanitizeString(item.scheduled_at) || baseContext.scheduledFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS) {
    return {
      ...baseContext,
      theatreCaseId: sanitizeString(item.theatre_case_id) || baseContext.theatreCaseId,
      anesthetistUserId: sanitizeString(item.anesthetist_user_id) || baseContext.anesthetistUserId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.POST_OP_NOTES) {
    return {
      ...baseContext,
      theatreCaseId: sanitizeString(item.theatre_case_id) || baseContext.theatreCaseId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.EMERGENCY_CASES) {
    return {
      ...baseContext,
      emergencyCaseId: sanitizeString(item.id) || baseContext.emergencyCaseId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      severity: sanitizeString(item.severity) || baseContext.severity,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS) {
    return {
      ...baseContext,
      emergencyCaseId: sanitizeString(item.emergency_case_id) || baseContext.emergencyCaseId,
      triageLevel: sanitizeString(item.triage_level) || baseContext.triageLevel,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES) {
    return {
      ...baseContext,
      emergencyCaseId: sanitizeString(item.emergency_case_id) || baseContext.emergencyCaseId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCES) {
    return {
      ...baseContext,
      ambulanceId: sanitizeString(item.id) || baseContext.ambulanceId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES) {
    return {
      ...baseContext,
      ambulanceId: sanitizeString(item.ambulance_id) || baseContext.ambulanceId,
      emergencyCaseId: sanitizeString(item.emergency_case_id) || baseContext.emergencyCaseId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS) {
    return {
      ...baseContext,
      ambulanceId: sanitizeString(item.ambulance_id) || baseContext.ambulanceId,
      emergencyCaseId: sanitizeString(item.emergency_case_id) || baseContext.emergencyCaseId,
      startedAtFrom: sanitizeString(item.started_at) || baseContext.startedAtFrom,
      endedAtTo: sanitizeString(item.ended_at) || baseContext.endedAtTo,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_TESTS) {
    return {
      ...baseContext,
      labTestId: sanitizeString(item.id) || baseContext.labTestId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      code: sanitizeString(item.code) || baseContext.code,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_PANELS) {
    return {
      ...baseContext,
      labPanelId: sanitizeString(item.id) || baseContext.labPanelId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      code: sanitizeString(item.code) || baseContext.code,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_ORDERS) {
    return {
      ...baseContext,
      labOrderId: sanitizeString(item.id) || baseContext.labOrderId,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      status: sanitizeString(item.status) || baseContext.status,
      orderedAtFrom: sanitizeString(item.ordered_at) || baseContext.orderedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_ORDER_ITEMS) {
    return {
      ...baseContext,
      labOrderItemId: sanitizeString(item.id) || baseContext.labOrderItemId,
      labOrderId: sanitizeString(item.lab_order_id) || baseContext.labOrderId,
      labTestId: sanitizeString(item.lab_test_id) || baseContext.labTestId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_SAMPLES) {
    return {
      ...baseContext,
      labOrderId: sanitizeString(item.lab_order_id) || baseContext.labOrderId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_RESULTS) {
    return {
      ...baseContext,
      labOrderItemId: sanitizeString(item.lab_order_item_id) || baseContext.labOrderItemId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_QC_LOGS) {
    return {
      ...baseContext,
      labTestId: sanitizeString(item.lab_test_id) || baseContext.labTestId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_TESTS) {
    return {
      ...baseContext,
      radiologyTestId: sanitizeString(item.id) || baseContext.radiologyTestId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      code: sanitizeString(item.code) || baseContext.code,
      modality: sanitizeString(item.modality) || baseContext.modality,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS) {
    return {
      ...baseContext,
      radiologyOrderId: sanitizeString(item.id) || baseContext.radiologyOrderId,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      radiologyTestId: sanitizeString(item.radiology_test_id) || baseContext.radiologyTestId,
      status: sanitizeString(item.status) || baseContext.status,
      orderedAtFrom: sanitizeString(item.ordered_at) || baseContext.orderedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_RESULTS) {
    return {
      ...baseContext,
      radiologyOrderId: sanitizeString(item.radiology_order_id) || baseContext.radiologyOrderId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.IMAGING_STUDIES) {
    return {
      ...baseContext,
      imagingStudyId: sanitizeString(item.id) || baseContext.imagingStudyId,
      radiologyOrderId: sanitizeString(item.radiology_order_id) || baseContext.radiologyOrderId,
      modality: sanitizeString(item.modality) || baseContext.modality,
      performedAt: sanitizeString(item.performed_at) || baseContext.performedAt,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.IMAGING_ASSETS) {
    return {
      ...baseContext,
      imagingStudyId: sanitizeString(item.imaging_study_id) || baseContext.imagingStudyId,
      contentType: sanitizeString(item.content_type) || baseContext.contentType,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PACS_LINKS) {
    return {
      ...baseContext,
      imagingStudyId: sanitizeString(item.imaging_study_id) || baseContext.imagingStudyId,
      expiresAt: sanitizeString(item.expires_at) || baseContext.expiresAt,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DRUGS) {
    return {
      ...baseContext,
      drugId: sanitizeString(item.id) || baseContext.drugId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      name: sanitizeString(item.name) || baseContext.name,
      code: sanitizeString(item.code) || baseContext.code,
      form: sanitizeString(item.form) || baseContext.form,
      strength: sanitizeString(item.strength) || baseContext.strength,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DRUG_BATCHES) {
    return {
      ...baseContext,
      drugId: sanitizeString(item.drug_id) || baseContext.drugId,
      batchNumber: sanitizeString(item.batch_number) || baseContext.batchNumber,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.FORMULARY_ITEMS) {
    return {
      ...baseContext,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      drugId: sanitizeString(item.drug_id) || baseContext.drugId,
      isActive: typeof item.is_active === 'boolean' ? item.is_active : baseContext.isActive,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PHARMACY_ORDERS) {
    return {
      ...baseContext,
      pharmacyOrderId: sanitizeString(item.id) || baseContext.pharmacyOrderId,
      encounterId: sanitizeString(item.encounter_id) || baseContext.encounterId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      status: sanitizeString(item.status) || baseContext.status,
      orderedAtFrom: sanitizeString(item.ordered_at) || baseContext.orderedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PHARMACY_ORDER_ITEMS) {
    return {
      ...baseContext,
      pharmacyOrderItemId: sanitizeString(item.id) || baseContext.pharmacyOrderItemId,
      pharmacyOrderId: sanitizeString(item.pharmacy_order_id) || baseContext.pharmacyOrderId,
      drugId: sanitizeString(item.drug_id) || baseContext.drugId,
      status: sanitizeString(item.status) || baseContext.status,
      frequency: sanitizeString(item.frequency) || baseContext.frequency,
      route: sanitizeString(item.route) || baseContext.route,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.DISPENSE_LOGS) {
    return {
      ...baseContext,
      pharmacyOrderItemId: sanitizeString(item.pharmacy_order_item_id) || baseContext.pharmacyOrderItemId,
      status: sanitizeString(item.status) || baseContext.status,
      dispensedAtFrom: sanitizeString(item.dispensed_at) || baseContext.dispensedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ADVERSE_EVENTS) {
    return {
      ...baseContext,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      drugId: sanitizeString(item.drug_id) || baseContext.drugId,
      severity: sanitizeString(item.severity) || baseContext.severity,
      reportedAtFrom: sanitizeString(item.reported_at) || baseContext.reportedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.INVENTORY_ITEMS) {
    return {
      ...baseContext,
      inventoryItemId: sanitizeString(item.id) || baseContext.inventoryItemId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      name: sanitizeString(item.name) || baseContext.name,
      category: sanitizeString(item.category) || baseContext.category,
      sku: sanitizeString(item.sku) || baseContext.sku,
      unit: sanitizeString(item.unit) || baseContext.unit,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.INVENTORY_STOCKS) {
    return {
      ...baseContext,
      inventoryItemId: sanitizeString(item.inventory_item_id) || baseContext.inventoryItemId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STOCK_MOVEMENTS) {
    return {
      ...baseContext,
      inventoryItemId: sanitizeString(item.inventory_item_id) || baseContext.inventoryItemId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      movementType: sanitizeString(item.movement_type) || baseContext.movementType,
      reason: sanitizeString(item.reason) || baseContext.reason,
      fromDate: sanitizeString(item.occurred_at) || baseContext.fromDate,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.SUPPLIERS) {
    return {
      ...baseContext,
      supplierId: sanitizeString(item.id) || baseContext.supplierId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      name: sanitizeString(item.name) || baseContext.name,
      contactEmail: sanitizeString(item.contact_email) || baseContext.contactEmail,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PURCHASE_REQUESTS) {
    return {
      ...baseContext,
      purchaseRequestId: sanitizeString(item.id) || baseContext.purchaseRequestId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      requestedByUserId: sanitizeString(item.requested_by_user_id) || baseContext.requestedByUserId,
      status: sanitizeString(item.status) || baseContext.status,
      requestedAtFrom: sanitizeString(item.requested_at) || baseContext.requestedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PURCHASE_ORDERS) {
    return {
      ...baseContext,
      purchaseOrderId: sanitizeString(item.id) || baseContext.purchaseOrderId,
      purchaseRequestId: sanitizeString(item.purchase_request_id) || baseContext.purchaseRequestId,
      supplierId: sanitizeString(item.supplier_id) || baseContext.supplierId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.GOODS_RECEIPTS) {
    return {
      ...baseContext,
      purchaseOrderId: sanitizeString(item.purchase_order_id) || baseContext.purchaseOrderId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STOCK_ADJUSTMENTS) {
    return {
      ...baseContext,
      inventoryItemId: sanitizeString(item.inventory_item_id) || baseContext.inventoryItemId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      reason: sanitizeString(item.reason) || baseContext.reason,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.INVOICES) {
    return {
      ...baseContext,
      invoiceId: sanitizeString(item.id) || baseContext.invoiceId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      status: sanitizeString(item.status) || baseContext.status,
      billingStatus: sanitizeString(item.billing_status) || baseContext.billingStatus,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PAYMENTS) {
    return {
      ...baseContext,
      paymentId: sanitizeString(item.id) || baseContext.paymentId,
      invoiceId: sanitizeString(item.invoice_id) || baseContext.invoiceId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      patientId: sanitizeString(item.patient_id) || baseContext.patientId,
      status: sanitizeString(item.status) || baseContext.status,
      method: sanitizeString(item.method) || baseContext.method,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.REFUNDS) {
    return {
      ...baseContext,
      paymentId: sanitizeString(item.payment_id) || baseContext.paymentId,
      refundedAtFrom: sanitizeString(item.refunded_at) || baseContext.refundedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.INSURANCE_CLAIMS) {
    return {
      ...baseContext,
      coveragePlanId: sanitizeString(item.coverage_plan_id) || baseContext.coveragePlanId,
      invoiceId: sanitizeString(item.invoice_id) || baseContext.invoiceId,
      status: sanitizeString(item.status) || baseContext.status,
      submittedAtFrom: sanitizeString(item.submitted_at) || baseContext.submittedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PRE_AUTHORIZATIONS) {
    return {
      ...baseContext,
      coveragePlanId: sanitizeString(item.coverage_plan_id) || baseContext.coveragePlanId,
      status: sanitizeString(item.status) || baseContext.status,
      requestedAtFrom: sanitizeString(item.requested_at) || baseContext.requestedAtFrom,
      approvedAtFrom: sanitizeString(item.approved_at) || baseContext.approvedAtFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.BILLING_ADJUSTMENTS) {
    return {
      ...baseContext,
      invoiceId: sanitizeString(item.invoice_id) || baseContext.invoiceId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STAFF_POSITIONS) {
    return {
      ...baseContext,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      departmentId: sanitizeString(item.department_id) || baseContext.departmentId,
      name: sanitizeString(item.name) || baseContext.name,
      isActive:
        typeof item?.is_active === 'boolean'
          ? item.is_active
          : baseContext.isActive,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STAFF_PROFILES) {
    return {
      ...baseContext,
      staffProfileId: sanitizeString(item.id) || baseContext.staffProfileId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      userId: sanitizeString(item.user_id) || baseContext.userId,
      departmentId: sanitizeString(item.department_id) || baseContext.departmentId,
      staffNumber: sanitizeString(item.staff_number) || baseContext.staffNumber,
      position: sanitizeString(item.position) || baseContext.position,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STAFF_ASSIGNMENTS) {
    return {
      ...baseContext,
      staffProfileId: sanitizeString(item.staff_profile_id) || baseContext.staffProfileId,
      departmentId: sanitizeString(item.department_id) || baseContext.departmentId,
      unitId: sanitizeString(item.unit_id) || baseContext.unitId,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STAFF_LEAVES) {
    return {
      ...baseContext,
      staffProfileId: sanitizeString(item.staff_profile_id) || baseContext.staffProfileId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.SHIFTS) {
    return {
      ...baseContext,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      shiftType: sanitizeString(item.shift_type) || baseContext.shiftType,
      status: sanitizeString(item.status) || baseContext.status,
      startTimeFrom: sanitizeString(item.start_time) || baseContext.startTimeFrom,
      endTimeFrom: sanitizeString(item.end_time) || baseContext.endTimeFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.NURSE_ROSTERS) {
    return {
      ...baseContext,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      departmentId: sanitizeString(item.department_id) || baseContext.departmentId,
      status: sanitizeString(item.status) || baseContext.status,
      periodStartFrom: sanitizeString(item.period_start) || baseContext.periodStartFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PAYROLL_RUNS) {
    return {
      ...baseContext,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      status: sanitizeString(item.status) || baseContext.status,
      periodStartFrom: sanitizeString(item.period_start) || baseContext.periodStartFrom,
      periodEndFrom: sanitizeString(item.period_end) || baseContext.periodEndFrom,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.HOUSEKEEPING_TASKS) {
    return {
      ...baseContext,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      roomId: sanitizeString(item.room_id) || baseContext.roomId,
      userId: sanitizeString(item.assigned_to_staff_id) || baseContext.userId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.HOUSEKEEPING_SCHEDULES) {
    return {
      ...baseContext,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      roomId: sanitizeString(item.room_id) || baseContext.roomId,
      frequency: sanitizeString(item.frequency) || baseContext.frequency,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.MAINTENANCE_REQUESTS) {
    return {
      ...baseContext,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      assetId: sanitizeString(item.asset_id) || baseContext.assetId,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ASSETS) {
    return {
      ...baseContext,
      assetId: sanitizeString(item.id) || baseContext.assetId,
      tenantId: sanitizeString(item.tenant_id) || baseContext.tenantId,
      facilityId: sanitizeString(item.facility_id) || baseContext.facilityId,
      name: sanitizeString(item.name) || baseContext.name,
      assetTag: sanitizeString(item.asset_tag) || baseContext.assetTag,
      status: sanitizeString(item.status) || baseContext.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ASSET_SERVICE_LOGS) {
    return {
      ...baseContext,
      assetId: sanitizeString(item.asset_id) || baseContext.assetId,
      servicedAtFrom: sanitizeString(item.serviced_at) || baseContext.servicedAtFrom,
    };
  }

  return baseContext;
};

const useClinicalResourceListScreen = (resourceId) => {
  const config = getClinicalResourceConfig(resourceId);
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const noticeValue = useMemo(
    () => normalizeNoticeValue(searchParams?.notice),
    [searchParams]
  );
  const context = useMemo(
    () => normalizeClinicalContext(searchParams),
    [searchParams]
  );
  const { isOffline } = useNetwork();
  const {
    canAccessClinical,
    canCreateClinicalRecords,
    canDeleteClinicalRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useClinicalAccess();

  const { list, remove, data, isLoading, errorCode, reset } = useClinicalResourceCrud(resourceId);
  const [noticeMessage, setNoticeMessage] = useState(null);

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const canList = Boolean(config && canAccessClinical && hasScope);
  const canCreateResource = Boolean(canCreateClinicalRecords && config?.allowCreate !== false);
  const canDeleteResource = Boolean(canDeleteClinicalRecords && config?.allowDelete !== false);
  const resourceLabel = useMemo(() => {
    if (!config) return '';
    const labelKey = `${config.i18nKey}.label`;
    const translated = t(labelKey);
    if (translated !== labelKey) return translated;
    return config.labelFallback || sanitizeString(config.id);
  }, [config, t]);

  const items = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [data]);

  const errorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.list.loadError`);
  }, [config, errorCode, t]);

  const listPath = useMemo(
    () => withClinicalContext(config?.routePath || CLINICAL_ROUTE_ROOT, context),
    [config?.routePath, context]
  );

  const fetchList = useCallback(() => {
    if (!config || !isResolved || !canList) return;
    const params = { ...config.listParams };
    if (config.requiresTenant && !canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    if (config.supportsFacility && !canManageAllTenants && normalizedFacilityId) {
      params.facility_id = normalizedFacilityId;
    }
    const filters = getContextFilters(resourceId, context);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });
    reset();
    list(params);
  }, [
    config,
    isResolved,
    canList,
    canManageAllTenants,
    normalizedTenantId,
    normalizedFacilityId,
    resourceId,
    context,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessClinical || !hasScope || !config) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessClinical, hasScope, config, router]);

  useEffect(() => {
    if (!canList) return;
    fetchList();
  }, [canList, fetchList]);

  useEffect(() => {
    if (!noticeValue || !config) return;
    const message = buildNoticeMessage(t, noticeValue, resourceLabel);
    if (!message) return;
    setNoticeMessage(message);
    router.replace(listPath);
  }, [noticeValue, config, t, resourceLabel, router, listPath]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => setNoticeMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  useEffect(() => {
    if (!isResolved || !config) return;
    if (!isAccessDeniedError(errorCode)) return;
    const message = buildNoticeMessage(t, 'accessDenied', resourceLabel);
    if (message) setNoticeMessage(message);
  }, [isResolved, config, errorCode, t, resourceLabel]);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleItemPress = useCallback(
    (id) => {
      const normalizedId = normalizeSearchParam(id);
      if (!normalizedId || !config) return;
      const item = items.find((candidate) => String(candidate?.id) === String(normalizedId));
      const nextContext = buildItemContext(resourceId, item, context);
      router.push(withClinicalContext(`${config.routePath}/${normalizedId}`, nextContext));
    },
    [config, items, resourceId, context, router]
  );

  const handleAdd = useCallback(() => {
    if (!canCreateResource || !config) return;
    router.push(withClinicalContext(`${config.routePath}/create`, context));
  }, [canCreateResource, config, context, router]);

  const handleDelete = useCallback(
    async (id, event) => {
      if (!canDeleteResource || !config) return;
      if (event?.stopPropagation) event.stopPropagation();
      if (!confirmAction(t('common.confirmDelete'))) return;
      const normalizedId = normalizeSearchParam(id);
      if (!normalizedId) return;
      try {
        const result = await remove(normalizedId);
        if (!result) return;
        fetchList();
        const noticeType = isOffline ? 'queued' : 'deleted';
        const message = buildNoticeMessage(t, noticeType, resourceLabel);
        if (message) setNoticeMessage(message);
      } catch {
        // Hook-level error handling already updates state.
      }
    },
    [canDeleteResource, config, t, remove, fetchList, isOffline, resourceLabel]
  );

  return {
    config,
    context,
    items,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice: () => setNoticeMessage(null),
    onRetry: handleRetry,
    onItemPress: handleItemPress,
    onDelete: handleDelete,
    onAdd: handleAdd,
    canCreate: canCreateResource,
    canDelete: canDeleteResource,
    createBlockedReason: canCreateResource ? '' : t('clinical.access.createDenied'),
    deleteBlockedReason: canDeleteResource ? '' : t('clinical.access.deleteDenied'),
    listPath,
  };
};

export default useClinicalResourceListScreen;
