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
    expect(endpoints.RADIOLOGY_RESULTS.SIGN_OFF('id')).toMatch(
      /\/radiology-results\/id\/sign-off$/
    );
    expect(endpoints.PHARMACY_ORDERS.DISPENSE('id')).toMatch(
      /\/pharmacy-orders\/id\/dispense$/
    );
  });

  test('should expose staffing workflow action endpoints', () => {
    expect(endpoints.SHIFTS.PUBLISH('id')).toMatch(/\/shifts\/id\/publish$/);
    expect(endpoints.NURSE_ROSTERS.PUBLISH('id')).toMatch(
      /\/nurse-rosters\/id\/publish$/
    );
    expect(endpoints.NURSE_ROSTERS.GENERATE('id')).toMatch(
      /\/nurse-rosters\/id\/generate$/
    );
  });

  test('should expose facilities and biomedical workflow action endpoints', () => {
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

  test('should expose billing and claim workflow action endpoints', () => {
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

  test('should expose reporting and analytics CRUD endpoint groups', () => {
    expect(endpoints.REPORT_DEFINITIONS.LIST).toMatch(/\/report-definitions$/);
    expect(endpoints.REPORT_DEFINITIONS.CREATE).toMatch(/\/report-definitions$/);
    expect(endpoints.REPORT_DEFINITIONS.GET('id')).toMatch(
      /\/report-definitions\/id$/
    );
    expect(endpoints.REPORT_DEFINITIONS.UPDATE('id')).toMatch(
      /\/report-definitions\/id$/
    );
    expect(endpoints.REPORT_DEFINITIONS.DELETE('id')).toMatch(
      /\/report-definitions\/id$/
    );

    expect(endpoints.REPORT_RUNS.LIST).toMatch(/\/report-runs$/);
    expect(endpoints.REPORT_RUNS.CREATE).toMatch(/\/report-runs$/);
    expect(endpoints.REPORT_RUNS.GET('id')).toMatch(/\/report-runs\/id$/);
    expect(endpoints.REPORT_RUNS.UPDATE('id')).toMatch(/\/report-runs\/id$/);
    expect(endpoints.REPORT_RUNS.DELETE('id')).toMatch(/\/report-runs\/id$/);

    expect(endpoints.DASHBOARD_WIDGETS.LIST).toMatch(/\/dashboard-widgets$/);
    expect(endpoints.DASHBOARD_WIDGETS.CREATE).toMatch(/\/dashboard-widgets$/);
    expect(endpoints.DASHBOARD_WIDGETS.GET('id')).toMatch(
      /\/dashboard-widgets\/id$/
    );
    expect(endpoints.DASHBOARD_WIDGETS.UPDATE('id')).toMatch(
      /\/dashboard-widgets\/id$/
    );
    expect(endpoints.DASHBOARD_WIDGETS.DELETE('id')).toMatch(
      /\/dashboard-widgets\/id$/
    );

    expect(endpoints.KPI_SNAPSHOTS.LIST).toMatch(/\/kpi-snapshots$/);
    expect(endpoints.KPI_SNAPSHOTS.CREATE).toMatch(/\/kpi-snapshots$/);
    expect(endpoints.KPI_SNAPSHOTS.GET('id')).toMatch(/\/kpi-snapshots\/id$/);
    expect(endpoints.KPI_SNAPSHOTS.UPDATE('id')).toMatch(
      /\/kpi-snapshots\/id$/
    );
    expect(endpoints.KPI_SNAPSHOTS.DELETE('id')).toMatch(
      /\/kpi-snapshots\/id$/
    );

    expect(endpoints.ANALYTICS_EVENTS.LIST).toMatch(/\/analytics-events$/);
    expect(endpoints.ANALYTICS_EVENTS.CREATE).toMatch(/\/analytics-events$/);
    expect(endpoints.ANALYTICS_EVENTS.GET('id')).toMatch(
      /\/analytics-events\/id$/
    );
    expect(endpoints.ANALYTICS_EVENTS.UPDATE('id')).toMatch(
      /\/analytics-events\/id$/
    );
    expect(endpoints.ANALYTICS_EVENTS.DELETE('id')).toMatch(
      /\/analytics-events\/id$/
    );
  });

  test('should expose communications CRUD endpoints with mounted-only contracts', () => {
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
});
