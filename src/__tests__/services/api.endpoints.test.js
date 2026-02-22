/**
 * Services API Endpoints Tests
 * File: api.endpoints.test.js
 */
import { endpoints } from '@services/api/endpoints';

describe('services/api/endpoints', () => {
  it('re-exports config endpoints', () => {
    expect(endpoints).toBeDefined();
    expect(endpoints.AUTH).toBeDefined();
  });

  it('uses unversioned health endpoint contract', () => {
    expect(endpoints.HEALTH).toMatch(/\/health$/);
    expect(endpoints.HEALTH).not.toContain('/api/');
  });

  it('includes mounted biomedical equipment endpoints', () => {
    expect(endpoints.EQUIPMENT_CATEGORIES.LIST).toMatch(
      /\/equipment-categories$/
    );
    expect(endpoints.EQUIPMENT_REGISTRIES.LIST).toMatch(
      /\/equipment-registries$/
    );
    expect(endpoints.EQUIPMENT_WORK_ORDERS.LIST).toMatch(
      /\/equipment-work-orders$/
    );
    expect(endpoints.EQUIPMENT_DISPOSAL_TRANSFERS.LIST).toMatch(
      /\/equipment-disposal-transfers$/
    );
  });

  it('includes mounted patient nested resource endpoints', () => {
    expect(endpoints.PATIENTS.GET_IDENTIFIERS('id')).toMatch(
      /\/patients\/id\/identifiers$/
    );
    expect(endpoints.PATIENTS.GET_CONTACTS('id')).toMatch(
      /\/patients\/id\/contacts$/
    );
    expect(endpoints.PATIENTS.GET_GUARDIANS('id')).toMatch(
      /\/patients\/id\/guardians$/
    );
    expect(endpoints.PATIENTS.GET_ALLERGIES('id')).toMatch(
      /\/patients\/id\/allergies$/
    );
    expect(endpoints.PATIENTS.GET_MEDICAL_HISTORIES('id')).toMatch(
      /\/patients\/id\/medical-histories$/
    );
    expect(endpoints.PATIENTS.GET_DOCUMENTS('id')).toMatch(
      /\/patients\/id\/documents$/
    );
  });

  it('includes scheduling workflow action endpoints', () => {
    expect(endpoints.APPOINTMENTS.CANCEL('id')).toMatch(
      /\/appointments\/id\/cancel$/
    );
    expect(endpoints.VISIT_QUEUES.PRIORITIZE('id')).toMatch(
      /\/visit-queues\/id\/prioritize$/
    );
  });

  it('includes referral redeem workflow action endpoint', () => {
    expect(endpoints.REFERRALS.REDEEM('id')).toMatch(
      /\/referrals\/id\/redeem$/
    );
  });

  it('includes inpatient workflow action endpoints', () => {
    expect(endpoints.ADMISSIONS.DISCHARGE('id')).toMatch(
      /\/admissions\/id\/discharge$/
    );
    expect(endpoints.ADMISSIONS.TRANSFER('id')).toMatch(
      /\/admissions\/id\/transfer$/
    );
    expect(endpoints.DISCHARGE_SUMMARIES.FINALIZE('id')).toMatch(
      /\/discharge-summaries\/id\/finalize$/
    );
  });

  it('includes diagnostics workflow action endpoint', () => {
    expect(endpoints.LAB_RESULTS.RELEASE('id')).toMatch(
      /\/lab-results\/id\/release$/
    );
    expect(endpoints.RADIOLOGY_RESULTS.SIGN_OFF('id')).toMatch(
      /\/radiology-results\/id\/sign-off$/
    );
    expect(endpoints.PHARMACY_ORDERS.DISPENSE('id')).toMatch(
      /\/pharmacy-orders\/id\/dispense$/
    );
  });

  it('does not expose deprecated unmounted commerce endpoint groups', () => {
    expect(endpoints.PRODUCTS).toBeUndefined();
    expect(endpoints.CARTS).toBeUndefined();
    expect(endpoints.ORDERS).toBeUndefined();
    expect(endpoints.SHOPS).toBeUndefined();
    expect(endpoints.QUOTE_REQUESTS).toBeUndefined();
  });
});
