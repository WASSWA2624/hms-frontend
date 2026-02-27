const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {
  ClinicalOverviewScreen: jest.fn(() => null),
  IpdWorkbenchScreen: jest.fn(() => null),
  IcuWorkbenchScreen: jest.fn(() => null),
  ClinicalResourceListScreen: jest.fn(() => null),
  ClinicalResourceDetailScreen: jest.fn(() => null),
  ClinicalResourceFormScreen: jest.fn(() => null),
};

jest.mock('@config/feature.flags', () => ({
  IPD_WORKBENCH_V1: false,
  ICU_WORKBENCH_V1: false,
  EMERGENCY_WORKBENCH_V1: false,
}));

jest.mock('@platform/screens', () => ({
  ClinicalOverviewScreen: (...args) =>
    mockScreens.ClinicalOverviewScreen(...args),
  IpdWorkbenchScreen: (...args) => mockScreens.IpdWorkbenchScreen(...args),
  IcuWorkbenchScreen: (...args) => mockScreens.IcuWorkbenchScreen(...args),
  ClinicalResourceListScreen: (...args) =>
    mockScreens.ClinicalResourceListScreen(...args),
  ClinicalResourceDetailScreen: (...args) =>
    mockScreens.ClinicalResourceDetailScreen(...args),
  ClinicalResourceFormScreen: (...args) =>
    mockScreens.ClinicalResourceFormScreen(...args),
}));

const RESOURCES_WITH_EDIT = {
  ipd: [
    'admissions',
    'bed-assignments',
    'ward-rounds',
    'nursing-notes',
    'medication-administrations',
    'discharge-summaries',
    'transfer-requests',
  ],
  icu: ['icu-stays', 'icu-observations', 'critical-alerts'],
  theatre: ['theatre-cases', 'anesthesia-records', 'post-op-notes'],
  emergency: [
    'emergency-cases',
    'triage-assessments',
    'emergency-responses',
    'ambulances',
    'ambulance-dispatches',
    'ambulance-trips',
  ],
};

const buildResourceRouteCases = (scope, resourceId) => {
  const basePath = `../../../app/(main)/${scope}/${resourceId}`;
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

const OVERVIEW_ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/ipd/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'ipd' },
  },
  {
    routePath: '../../../app/(main)/icu/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'icu' },
  },
  {
    routePath: '../../../app/(main)/theatre/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'theatre' },
  },
  {
    routePath: '../../../app/(main)/emergency/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'emergency' },
  },
];

const RESOURCE_ROUTE_CASES = Object.entries(RESOURCES_WITH_EDIT).flatMap(
  ([scope, resourceIds]) =>
    resourceIds.flatMap((resourceId) =>
      buildResourceRouteCases(scope, resourceId)
    )
);

const TIER_7_ROUTE_CASES = [...OVERVIEW_ROUTE_CASES, ...RESOURCE_ROUTE_CASES];

describe('Tier 7 IPD ICU Theatre Emergency Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(TIER_7_ROUTE_CASES)(
    '$routePath renders $screenKey',
    ({ routePath, screenKey, expectedProps }) => {
      const routeModule = require(routePath);
      expect(routeModule.default).toBeDefined();
      expect(typeof routeModule.default).toBe('function');

      render(React.createElement(routeModule.default));
      expect(mockScreens[screenKey]).toHaveBeenCalledTimes(1);

      if (expectedProps) {
        const calledProps = mockScreens[screenKey].mock.calls[0]?.[0] || {};
        expect(calledProps).toMatchObject(expectedProps);
      }
    }
  );
});
