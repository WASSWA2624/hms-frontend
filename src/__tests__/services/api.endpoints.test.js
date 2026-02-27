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
    expect(endpoints.APPOINTMENT_REMINDERS.MARK_SENT('id')).toMatch(
      /\/appointment-reminders\/id\/mark-sent$/
    );
    expect(endpoints.VISIT_QUEUES.PRIORITIZE('id')).toMatch(
      /\/visit-queues\/id\/prioritize$/
    );
    expect(endpoints.OPD_FLOWS.LIST).toMatch(/\/opd-flows$/);
    expect(endpoints.OPD_FLOWS.GET('id')).toMatch(/\/opd-flows\/id$/);
    expect(
      endpoints.OPD_FLOWS.RESOLVE_LEGACY('emergency-cases', 'id')
    ).toMatch(/\/opd-flows\/resolve-legacy\/emergency-cases\/id$/);
    expect(endpoints.OPD_FLOWS.START).toMatch(/\/opd-flows\/start$/);
    expect(endpoints.OPD_FLOWS.PAY_CONSULTATION('id')).toMatch(
      /\/opd-flows\/id\/pay-consultation$/
    );
    expect(endpoints.OPD_FLOWS.RECORD_VITALS('id')).toMatch(
      /\/opd-flows\/id\/record-vitals$/
    );
    expect(endpoints.OPD_FLOWS.ASSIGN_DOCTOR('id')).toMatch(
      /\/opd-flows\/id\/assign-doctor$/
    );
    expect(endpoints.OPD_FLOWS.DOCTOR_REVIEW('id')).toMatch(
      /\/opd-flows\/id\/doctor-review$/
    );
    expect(endpoints.OPD_FLOWS.DISPOSITION('id')).toMatch(
      /\/opd-flows\/id\/disposition$/
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
    expect(endpoints.LAB_WORKSPACE.WORKBENCH).toMatch(/\/lab\/workbench$/);
    expect(endpoints.LAB_WORKSPACE.RESOLVE_LEGACY('lab-orders', 'id')).toMatch(
      /\/lab\/resolve-legacy\/lab-orders\/id$/
    );
    expect(endpoints.LAB_WORKSPACE.ORDER_WORKFLOW('id')).toMatch(
      /\/lab\/orders\/id\/workflow$/
    );
    expect(endpoints.LAB_WORKSPACE.COLLECT_ORDER('id')).toMatch(
      /\/lab\/orders\/id\/collect$/
    );
    expect(endpoints.LAB_WORKSPACE.RECEIVE_SAMPLE('id')).toMatch(
      /\/lab\/samples\/id\/receive$/
    );
    expect(endpoints.LAB_WORKSPACE.REJECT_SAMPLE('id')).toMatch(
      /\/lab\/samples\/id\/reject$/
    );
    expect(endpoints.LAB_WORKSPACE.RELEASE_ORDER_ITEM('id')).toMatch(
      /\/lab\/order-items\/id\/release$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.WORKBENCH).toMatch(
      /\/radiology\/workbench$/
    );
    expect(
      endpoints.RADIOLOGY_WORKSPACE.RESOLVE_LEGACY('radiology-orders', 'id')
    ).toMatch(/\/radiology\/resolve-legacy\/radiology-orders\/id$/);
    expect(endpoints.RADIOLOGY_WORKSPACE.ORDER_WORKFLOW('id')).toMatch(
      /\/radiology\/orders\/id\/workflow$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.ASSIGN_ORDER('id')).toMatch(
      /\/radiology\/orders\/id\/assign$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.START_ORDER('id')).toMatch(
      /\/radiology\/orders\/id\/start$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.COMPLETE_ORDER('id')).toMatch(
      /\/radiology\/orders\/id\/complete$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.CANCEL_ORDER('id')).toMatch(
      /\/radiology\/orders\/id\/cancel$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.CREATE_STUDY('id')).toMatch(
      /\/radiology\/orders\/id\/studies$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.INIT_ASSET_UPLOAD('id')).toMatch(
      /\/radiology\/studies\/id\/assets\/init-upload$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.COMMIT_ASSET_UPLOAD('id')).toMatch(
      /\/radiology\/studies\/id\/assets\/commit-upload$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.SYNC_STUDY('id')).toMatch(
      /\/radiology\/studies\/id\/pacs-sync$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.DRAFT_RESULT('id')).toMatch(
      /\/radiology\/orders\/id\/results\/draft$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.FINALIZE_RESULT('id')).toMatch(
      /\/radiology\/results\/id\/finalize$/
    );
    expect(endpoints.RADIOLOGY_WORKSPACE.ADDENDUM_RESULT('id')).toMatch(
      /\/radiology\/results\/id\/addendum$/
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

  it('includes reporting and analytics CRUD endpoint groups', () => {
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
    expect(endpoints.DASHBOARD_WIDGETS.SUMMARY).toMatch(/\/dashboard-widgets\/summary$/);
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

  it('includes subscription and licensing action-path endpoints', () => {
    expect(endpoints.SUBSCRIPTION_PLANS.LIST).toMatch(/\/subscription-plans$/);
    expect(endpoints.SUBSCRIPTION_PLANS.ENTITLEMENTS('id')).toMatch(
      /\/subscription-plans\/id\/entitlements$/
    );
    expect(endpoints.SUBSCRIPTION_PLANS.ADD_ON_ELIGIBILITY('id')).toMatch(
      /\/subscription-plans\/id\/add-on-eligibility$/
    );

    expect(endpoints.SUBSCRIPTIONS.LIST).toMatch(/\/subscriptions$/);
    expect(endpoints.SUBSCRIPTIONS.UPGRADE('id')).toMatch(
      /\/subscriptions\/id\/upgrade$/
    );
    expect(endpoints.SUBSCRIPTIONS.DOWNGRADE('id')).toMatch(
      /\/subscriptions\/id\/downgrade$/
    );
    expect(endpoints.SUBSCRIPTIONS.RENEW('id')).toMatch(
      /\/subscriptions\/id\/renew$/
    );
    expect(endpoints.SUBSCRIPTIONS.PRORATION_PREVIEW('id')).toMatch(
      /\/subscriptions\/id\/proration-preview$/
    );
    expect(endpoints.SUBSCRIPTIONS.USAGE_SUMMARY('id')).toMatch(
      /\/subscriptions\/id\/usage-summary$/
    );
    expect(endpoints.SUBSCRIPTIONS.FIT_CHECK('id')).toMatch(
      /\/subscriptions\/id\/fit-check$/
    );
    expect(endpoints.SUBSCRIPTIONS.UPGRADE_RECOMMENDATION('id')).toMatch(
      /\/subscriptions\/id\/upgrade-recommendation$/
    );

    expect(endpoints.SUBSCRIPTION_INVOICES.COLLECT('id')).toMatch(
      /\/subscription-invoices\/id\/collect$/
    );
    expect(endpoints.SUBSCRIPTION_INVOICES.RETRY('id')).toMatch(
      /\/subscription-invoices\/id\/retry$/
    );

    expect(endpoints.MODULE_SUBSCRIPTIONS.ACTIVATE('id')).toMatch(
      /\/module-subscriptions\/id\/activate$/
    );
    expect(endpoints.MODULE_SUBSCRIPTIONS.DEACTIVATE('id')).toMatch(
      /\/module-subscriptions\/id\/deactivate$/
    );
    expect(endpoints.MODULE_SUBSCRIPTIONS.ELIGIBILITY_CHECK('id')).toMatch(
      /\/module-subscriptions\/id\/eligibility-check$/
    );
    expect(endpoints.LICENSES.LIST).toMatch(/\/licenses$/);

    expect(endpoints.SUBSCRIPTIONS.GET_PLANS).toBeUndefined();
    expect(endpoints.SUBSCRIPTIONS.SUBSCRIBE).toBeUndefined();
    expect(endpoints.SUBSCRIPTIONS.GET_CURRENT).toBeUndefined();
    expect(endpoints.SUBSCRIPTIONS.CANCEL).toBeUndefined();
  });

  it('includes compliance endpoints with mounted-only contracts', () => {
    expect(endpoints.AUDIT_LOGS.LIST).toMatch(/\/audit-logs$/);
    expect(endpoints.AUDIT_LOGS.GET('id')).toMatch(/\/audit-logs\/id$/);
    expect(endpoints.AUDIT_LOGS.CREATE).toBeUndefined();
    expect(endpoints.AUDIT_LOGS.UPDATE).toBeUndefined();
    expect(endpoints.AUDIT_LOGS.DELETE).toBeUndefined();

    expect(endpoints.PHI_ACCESS_LOGS.LIST).toMatch(/\/phi-access-logs$/);
    expect(endpoints.PHI_ACCESS_LOGS.CREATE).toMatch(/\/phi-access-logs$/);
    expect(endpoints.PHI_ACCESS_LOGS.GET('id')).toMatch(/\/phi-access-logs\/id$/);
    expect(endpoints.PHI_ACCESS_LOGS.GET_BY_USER('user-1')).toMatch(
      /\/phi-access-logs\/user\/user-1$/
    );
    expect(endpoints.PHI_ACCESS_LOGS.UPDATE).toBeUndefined();
    expect(endpoints.PHI_ACCESS_LOGS.DELETE).toBeUndefined();

    expect(endpoints.DATA_PROCESSING_LOGS.LIST).toMatch(/\/data-processing-logs$/);
    expect(endpoints.DATA_PROCESSING_LOGS.CREATE).toMatch(/\/data-processing-logs$/);
    expect(endpoints.DATA_PROCESSING_LOGS.GET('id')).toMatch(
      /\/data-processing-logs\/id$/
    );
    expect(endpoints.DATA_PROCESSING_LOGS.UPDATE('id')).toMatch(
      /\/data-processing-logs\/id$/
    );
    expect(endpoints.DATA_PROCESSING_LOGS.DELETE('id')).toMatch(
      /\/data-processing-logs\/id$/
    );

    expect(endpoints.BREACH_NOTIFICATIONS.LIST).toMatch(/\/breach-notifications$/);
    expect(endpoints.BREACH_NOTIFICATIONS.CREATE).toMatch(/\/breach-notifications$/);
    expect(endpoints.BREACH_NOTIFICATIONS.GET('id')).toMatch(
      /\/breach-notifications\/id$/
    );
    expect(endpoints.BREACH_NOTIFICATIONS.UPDATE('id')).toMatch(
      /\/breach-notifications\/id$/
    );
    expect(endpoints.BREACH_NOTIFICATIONS.RESOLVE('id')).toMatch(
      /\/breach-notifications\/id\/resolve$/
    );
    expect(endpoints.BREACH_NOTIFICATIONS.DELETE).toBeUndefined();

    expect(endpoints.SYSTEM_CHANGE_LOGS.LIST).toMatch(/\/system-change-logs$/);
    expect(endpoints.SYSTEM_CHANGE_LOGS.CREATE).toMatch(/\/system-change-logs$/);
    expect(endpoints.SYSTEM_CHANGE_LOGS.GET('id')).toMatch(/\/system-change-logs\/id$/);
    expect(endpoints.SYSTEM_CHANGE_LOGS.UPDATE('id')).toMatch(
      /\/system-change-logs\/id$/
    );
    expect(endpoints.SYSTEM_CHANGE_LOGS.APPROVE('id')).toMatch(
      /\/system-change-logs\/id\/approve$/
    );
    expect(endpoints.SYSTEM_CHANGE_LOGS.IMPLEMENT('id')).toMatch(
      /\/system-change-logs\/id\/implement$/
    );
    expect(endpoints.SYSTEM_CHANGE_LOGS.DELETE).toBeUndefined();
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

  it('includes integration and webhook endpoints with mounted-only contracts', () => {
    expect(endpoints.INTEGRATIONS.LIST).toMatch(/\/integrations$/);
    expect(endpoints.INTEGRATIONS.CREATE).toMatch(/\/integrations$/);
    expect(endpoints.INTEGRATIONS.GET('id')).toMatch(/\/integrations\/id$/);
    expect(endpoints.INTEGRATIONS.UPDATE('id')).toMatch(/\/integrations\/id$/);
    expect(endpoints.INTEGRATIONS.DELETE('id')).toMatch(/\/integrations\/id$/);
    expect(endpoints.INTEGRATIONS.TEST_CONNECTION('id')).toMatch(
      /\/integrations\/id\/test-connection$/
    );
    expect(endpoints.INTEGRATIONS.SYNC_NOW('id')).toMatch(
      /\/integrations\/id\/sync-now$/
    );

    expect(endpoints.INTEGRATION_LOGS.LIST).toMatch(/\/integration-logs$/);
    expect(endpoints.INTEGRATION_LOGS.GET('id')).toMatch(/\/integration-logs\/id$/);
    expect(
      endpoints.INTEGRATION_LOGS.GET_BY_INTEGRATION('integration-1')
    ).toMatch(/\/integration-logs\/integration\/integration-1$/);
    expect(endpoints.INTEGRATION_LOGS.REPLAY('id')).toMatch(
      /\/integration-logs\/id\/replay$/
    );
    expect(endpoints.INTEGRATION_LOGS.CREATE).toBeUndefined();
    expect(endpoints.INTEGRATION_LOGS.UPDATE).toBeUndefined();
    expect(endpoints.INTEGRATION_LOGS.DELETE).toBeUndefined();

    expect(endpoints.WEBHOOK_SUBSCRIPTIONS.LIST).toMatch(
      /\/webhook-subscriptions$/
    );
    expect(endpoints.WEBHOOK_SUBSCRIPTIONS.CREATE).toMatch(
      /\/webhook-subscriptions$/
    );
    expect(endpoints.WEBHOOK_SUBSCRIPTIONS.GET('id')).toMatch(
      /\/webhook-subscriptions\/id$/
    );
    expect(endpoints.WEBHOOK_SUBSCRIPTIONS.UPDATE('id')).toMatch(
      /\/webhook-subscriptions\/id$/
    );
    expect(endpoints.WEBHOOK_SUBSCRIPTIONS.DELETE('id')).toMatch(
      /\/webhook-subscriptions\/id$/
    );
    expect(endpoints.WEBHOOK_SUBSCRIPTIONS.REPLAY('id')).toMatch(
      /\/webhook-subscriptions\/id\/replay$/
    );
  });
});
