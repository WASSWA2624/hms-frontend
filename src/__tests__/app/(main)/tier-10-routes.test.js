const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {
  ClinicalOverviewScreen: jest.fn(() => null),
  ClinicalResourceListScreen: jest.fn(() => null),
  ClinicalResourceDetailScreen: jest.fn(() => null),
  ClinicalResourceFormScreen: jest.fn(() => null),
};

jest.mock('@platform/screens', () => ({
  ClinicalOverviewScreen: (...args) => mockScreens.ClinicalOverviewScreen(...args),
  ClinicalResourceListScreen: (...args) => mockScreens.ClinicalResourceListScreen(...args),
  ClinicalResourceDetailScreen: (...args) => mockScreens.ClinicalResourceDetailScreen(...args),
  ClinicalResourceFormScreen: (...args) => mockScreens.ClinicalResourceFormScreen(...args),
}));

const RESOURCES_WITH_EDIT = {
  billing: [
    'invoices',
    'invoice-items',
    'payments',
    'refunds',
    'pricing-rules',
    'coverage-plans',
    'insurance-claims',
    'pre-authorizations',
    'billing-adjustments',
  ],
  hr: [
    'staff-profiles',
    'staff-assignments',
    'staff-leaves',
    'shifts',
    'shift-assignments',
    'shift-swap-requests',
    'nurse-rosters',
    'shift-templates',
    'roster-day-offs',
    'staff-availabilities',
    'payroll-runs',
    'payroll-items',
  ],
  housekeeping: [
    'housekeeping-tasks',
    'housekeeping-schedules',
    'maintenance-requests',
    'assets',
    'asset-service-logs',
  ],
  'housekeeping/biomedical': [
    'equipment-categories',
    'equipment-registries',
    'equipment-location-histories',
    'equipment-disposal-transfers',
    'equipment-maintenance-plans',
    'equipment-work-orders',
    'equipment-calibration-logs',
    'equipment-safety-test-logs',
    'equipment-downtime-logs',
    'equipment-incident-reports',
    'equipment-recall-notices',
    'equipment-spare-parts',
    'equipment-warranty-contracts',
    'equipment-service-providers',
    'equipment-utilization-snapshots',
  ],
  reports: [
    'report-definitions',
    'report-runs',
    'dashboard-widgets',
    'kpi-snapshots',
    'analytics-events',
  ],
  communications: [
    'notifications',
    'notification-deliveries',
    'conversations',
    'messages',
    'templates',
    'template-variables',
  ],
  subscriptions: [
    'subscription-plans',
    'subscriptions',
    'subscription-invoices',
    'modules',
    'module-subscriptions',
    'licenses',
  ],
  integrations: [
    'integrations',
    'integration-logs',
    'webhook-subscriptions',
  ],
  compliance: [
    'audit-logs',
    'phi-access-logs',
    'data-processing-logs',
    'breach-notifications',
    'system-change-logs',
  ],
};

const buildResourceRouteCases = (scopePath, resourceId) => {
  const basePath = `../../../app/(main)/${scopePath}/${resourceId}`;
  return [
    {
      routePath: `${basePath}/index`,
      screenKey: 'ClinicalResourceListScreen',
      expectedProps: { resourceId },
    },
    {
      routePath: `${basePath}/create`,
      screenKey: 'ClinicalResourceFormScreen',
      expectedProps: { resourceId },
    },
    {
      routePath: `${basePath}/[id]`,
      screenKey: 'ClinicalResourceDetailScreen',
      expectedProps: { resourceId },
    },
    {
      routePath: `${basePath}/[id]/edit`,
      screenKey: 'ClinicalResourceFormScreen',
      expectedProps: { resourceId },
    },
  ];
};

const TIER_10_ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/billing/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'billing' },
  },
  {
    routePath: '../../../app/(main)/hr/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'hr' },
  },
  {
    routePath: '../../../app/(main)/housekeeping/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'housekeeping' },
  },
  {
    routePath: '../../../app/(main)/housekeeping/biomedical/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'biomedical' },
  },
  {
    routePath: '../../../app/(main)/reports/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'reports' },
  },
  {
    routePath: '../../../app/(main)/communications/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'communications' },
  },
  {
    routePath: '../../../app/(main)/subscriptions/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'subscriptions' },
  },
  {
    routePath: '../../../app/(main)/integrations/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'integrations' },
  },
  {
    routePath: '../../../app/(main)/compliance/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'compliance' },
  },
  ...Object.entries(RESOURCES_WITH_EDIT).flatMap(([scopePath, resourceIds]) =>
    resourceIds.flatMap((resourceId) => buildResourceRouteCases(scopePath, resourceId))
  ),
];

describe('Tier 10 Billing HR Facilities Reports Communications Subscriptions Integrations Compliance Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(TIER_10_ROUTE_CASES)('$routePath renders $screenKey', ({ routePath, screenKey, expectedProps }) => {
    const routeModule = require(routePath);
    expect(routeModule.default).toBeDefined();
    expect(typeof routeModule.default).toBe('function');

    render(React.createElement(routeModule.default));
    expect(mockScreens[screenKey]).toHaveBeenCalledTimes(1);

    if (expectedProps) {
      const calledProps = mockScreens[screenKey].mock.calls[0]?.[0] || {};
      expect(calledProps).toMatchObject(expectedProps);
    }
  });
});
