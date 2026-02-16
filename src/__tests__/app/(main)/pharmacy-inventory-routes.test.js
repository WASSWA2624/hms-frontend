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
  pharmacy: [
    'drugs',
    'drug-batches',
    'formulary-items',
    'pharmacy-orders',
    'pharmacy-order-items',
    'dispense-logs',
    'adverse-events',
  ],
  inventory: [
    'inventory-items',
    'inventory-stocks',
    'stock-movements',
    'suppliers',
    'purchase-requests',
    'purchase-orders',
    'goods-receipts',
    'stock-adjustments',
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
    routePath: '../../../app/(main)/pharmacy/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'pharmacy' },
  },
  {
    routePath: '../../../app/(main)/inventory/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'inventory' },
  },
];

const RESOURCE_ROUTE_CASES = Object.entries(RESOURCES_WITH_EDIT).flatMap(([scope, resourceIds]) =>
  resourceIds.flatMap((resourceId) => buildResourceRouteCases(scope, resourceId))
);

const TIER_9_ROUTE_CASES = [...OVERVIEW_ROUTE_CASES, ...RESOURCE_ROUTE_CASES];

describe('Tier 9 Pharmacy Inventory Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(TIER_9_ROUTE_CASES)('$routePath renders $screenKey', ({ routePath, screenKey, expectedProps }) => {
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
