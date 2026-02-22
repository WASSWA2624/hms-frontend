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

  it('includes staffing workflow action endpoints', () => {
    expect(endpoints.SHIFTS.PUBLISH('id')).toMatch(/\/shifts\/id\/publish$/);
    expect(endpoints.NURSE_ROSTERS.PUBLISH('id')).toMatch(
      /\/nurse-rosters\/id\/publish$/
    );
    expect(endpoints.NURSE_ROSTERS.GENERATE('id')).toMatch(
      /\/nurse-rosters\/id\/generate$/
    );
  });

  it('includes facilities and biomedical workflow action endpoints', () => {
    expect(endpoints.MAINTENANCE_REQUESTS.TRIAGE('id')).toMatch(
      /\/maintenance-requests\/id\/triage$/
    );
    expect(endpoints.EQUIPMENT_WORK_ORDERS.START('id')).toMatch(
      /\/equipment-work-orders\/id\/start$/
    );
    expect(endpoints.EQUIPMENT_WORK_ORDERS.RETURN_TO_SERVICE('id')).toMatch(
      /\/equipment-work-orders\/id\/return-to-service$/
    );
  });

  it('includes billing and claim workflow action endpoints', () => {
    expect(endpoints.INSURANCE_CLAIMS.SUBMIT('id')).toMatch(
      /\/insurance-claims\/id\/submit$/
    );
    expect(endpoints.INSURANCE_CLAIMS.RECONCILE('id')).toMatch(
      /\/insurance-claims\/id\/reconcile$/
    );
    expect(endpoints.PAYMENTS.RECONCILE('id')).toMatch(
      /\/payments\/id\/reconcile$/
    );
    expect(endpoints.PAYMENTS.CHANNEL_BREAKDOWN('id')).toMatch(
      /\/payments\/id\/channel-breakdown$/
    );
  });

  it('includes communications CRUD endpoints and excludes unmounted extras', () => {
    expect(endpoints.NOTIFICATIONS.LIST).toMatch(/\/notifications$/);
    expect(endpoints.NOTIFICATIONS.CREATE).toMatch(/\/notifications$/);
    expect(endpoints.NOTIFICATIONS.GET('id')).toMatch(/\/notifications\/id$/);
    expect(endpoints.NOTIFICATIONS.UPDATE('id')).toMatch(/\/notifications\/id$/);
    expect(endpoints.NOTIFICATIONS.DELETE('id')).toMatch(/\/notifications\/id$/);
    expect(endpoints.NOTIFICATION_DELIVERIES.LIST).toMatch(
      /\/notification-deliveries$/
    );
    expect(endpoints.CONVERSATIONS.LIST).toMatch(/\/conversations$/);
    expect(endpoints.CONVERSATIONS.CREATE).toMatch(/\/conversations$/);
    expect(endpoints.CONVERSATIONS.GET('id')).toMatch(/\/conversations\/id$/);
    expect(endpoints.CONVERSATIONS.UPDATE('id')).toMatch(/\/conversations\/id$/);
    expect(endpoints.CONVERSATIONS.DELETE('id')).toMatch(/\/conversations\/id$/);
    expect(endpoints.MESSAGES.LIST).toMatch(/\/messages$/);
    expect(endpoints.MESSAGES.CREATE).toMatch(/\/messages$/);
    expect(endpoints.MESSAGES.GET('id')).toMatch(/\/messages\/id$/);
    expect(endpoints.MESSAGES.UPDATE('id')).toMatch(/\/messages\/id$/);
    expect(endpoints.MESSAGES.DELETE('id')).toMatch(/\/messages\/id$/);
    expect(endpoints.TEMPLATES.LIST).toMatch(/\/templates$/);
    expect(endpoints.TEMPLATE_VARIABLES.LIST).toMatch(/\/template-variables$/);

    expect(endpoints.NOTIFICATIONS.MARK_READ).toBeUndefined();
    expect(endpoints.NOTIFICATIONS.MARK_UNREAD).toBeUndefined();
    expect(endpoints.NOTIFICATIONS.GET_TARGETS).toBeUndefined();
    expect(endpoints.NOTIFICATIONS.GET_PREFERENCES).toBeUndefined();
    expect(endpoints.NOTIFICATIONS.UPDATE_PREFERENCES).toBeUndefined();
    expect(endpoints.CONVERSATIONS.GET_PARTICIPANTS).toBeUndefined();
    expect(endpoints.CONVERSATIONS.ADD_PARTICIPANT).toBeUndefined();
    expect(endpoints.CONVERSATIONS.REMOVE_PARTICIPANT).toBeUndefined();
    expect(endpoints.CONVERSATIONS.GET_MESSAGES).toBeUndefined();
    expect(endpoints.CONVERSATIONS.ADD_MESSAGE).toBeUndefined();
    expect(endpoints.MESSAGES.GET_BY_CONVERSATION).toBeUndefined();
    expect(endpoints.MESSAGES.GET_MEDIA).toBeUndefined();
  });

  it('does not expose deprecated unmounted commerce endpoint groups', () => {
    expect(endpoints.PRODUCTS).toBeUndefined();
    expect(endpoints.CARTS).toBeUndefined();
    expect(endpoints.ORDERS).toBeUndefined();
    expect(endpoints.SHOPS).toBeUndefined();
    expect(endpoints.QUOTE_REQUESTS).toBeUndefined();
  });
});
