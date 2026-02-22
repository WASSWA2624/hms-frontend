/**
 * API Endpoints Registry Tests
 * File: endpoints.test.js
 */
import { endpoints } from '@config/endpoints';

describe('endpoints.js', () => {
  test('should export endpoints object', () => {
    expect(endpoints).toBeDefined();
    expect(typeof endpoints).toBe('object');
  });

  test('should have AUTH endpoints', () => {
    expect(endpoints.AUTH).toBeDefined();
    expect(endpoints.AUTH.LOGIN).toBeDefined();
    expect(endpoints.AUTH.REGISTER).toBeDefined();
    expect(endpoints.AUTH.REFRESH).toBeDefined();
    expect(endpoints.AUTH.LOGOUT).toBeDefined();
  });

  test('should construct endpoints with base URL and version', () => {
    expect(endpoints.AUTH.LOGIN).toContain('/api/');
    expect(endpoints.AUTH.LOGIN).toContain('/auth/login');
  });

  test('should normalize base URL (remove trailing slashes)', () => {
    // The base URL normalization should be tested via the endpoint construction
    // If base URL has trailing slash, it should be removed
    expect(endpoints.AUTH.LOGIN).not.toMatch(/\/\/api\//);
  });

  test('should have correct endpoint paths', () => {
    expect(endpoints.AUTH.LOGIN).toMatch(/\/auth\/login$/);
    expect(endpoints.AUTH.REGISTER).toMatch(/\/auth\/register$/);
  });

  test('should keep health endpoint unversioned', () => {
    expect(endpoints.HEALTH).toMatch(/\/health$/);
    expect(endpoints.HEALTH).not.toContain('/api/');
  });

  test('should expose equipment module endpoint groups', () => {
    expect(endpoints.EQUIPMENT_CATEGORIES).toBeDefined();
    expect(endpoints.EQUIPMENT_REGISTRIES).toBeDefined();
    expect(endpoints.EQUIPMENT_WORK_ORDERS).toBeDefined();
    expect(endpoints.EQUIPMENT_DISPOSAL_TRANSFERS).toBeDefined();
  });

  test('should expose staff position endpoint group', () => {
    expect(endpoints.STAFF_POSITIONS).toBeDefined();
    expect(endpoints.STAFF_POSITIONS.LIST).toMatch(/\/staff-positions$/);
    expect(endpoints.STAFF_POSITIONS.GET('id')).toMatch(/\/staff-positions\/id$/);
  });

  test('should expose patient nested resource endpoints', () => {
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

  test('should expose scheduling workflow action endpoints', () => {
    expect(endpoints.APPOINTMENTS.CANCEL('id')).toMatch(
      /\/appointments\/id\/cancel$/
    );
    expect(endpoints.VISIT_QUEUES.PRIORITIZE('id')).toMatch(
      /\/visit-queues\/id\/prioritize$/
    );
  });

  test('should expose referral redeem workflow action endpoint', () => {
    expect(endpoints.REFERRALS.REDEEM('id')).toMatch(
      /\/referrals\/id\/redeem$/
    );
  });

  test('should expose inpatient workflow action endpoints', () => {
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

  test('should expose diagnostics workflow action endpoint', () => {
    expect(endpoints.LAB_RESULTS.RELEASE('id')).toMatch(
      /\/lab-results\/id\/release$/
    );
  });
});
