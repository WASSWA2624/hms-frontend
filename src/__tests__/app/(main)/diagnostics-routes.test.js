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
  lab: [
    'lab-tests',
    'lab-panels',
    'lab-orders',
    'lab-order-items',
    'lab-samples',
    'lab-results',
    'lab-qc-logs',
  ],
  radiology: [
    'radiology-tests',
    'radiology-orders',
    'radiology-results',
    'imaging-studies',
    'imaging-assets',
    'pacs-links',
  ],
};

const buildResourceRouteCases = (scope, resourceId) => {
  const basePath = `../../../app/(main)/diagnostics/${scope}/${resourceId}`;
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

const DIAGNOSTICS_ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/diagnostics/lab/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'lab' },
  },
  {
    routePath: '../../../app/(main)/diagnostics/radiology/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'radiology' },
  },
  ...Object.entries(RESOURCES_WITH_EDIT).flatMap(([scope, resourceIds]) =>
    resourceIds.flatMap((resourceId) => buildResourceRouteCases(scope, resourceId))
  ),
];

describe('Tier 8 Diagnostics Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(DIAGNOSTICS_ROUTE_CASES)('$routePath renders $screenKey', ({ routePath, screenKey, expectedProps }) => {
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
