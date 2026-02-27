const React = require('react');
const { render } = require('@testing-library/react-native');

const mockRedirect = jest.fn(() => null);

jest.mock('expo-router', () => ({
  Redirect: (...args) => mockRedirect(...args),
  useLocalSearchParams: jest.fn(() => ({ id: 'PHO0000456' })),
}));

const RESOURCES = {
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

const buildRouteCases = (scope, resource) => {
  const isInventory = scope === 'inventory';
  const basePath = `../../../app/(main)/${scope}/${resource}`;
  const root = isInventory ? '/inventory?panel=inventory' : '/pharmacy';

  return [
    {
      routePath: `${basePath}/index`,
      expectedHref: isInventory
        ? `${root}&resource=${resource}`
        : `${root}?resource=${resource}`,
    },
    {
      routePath: `${basePath}/create`,
      expectedHref: isInventory
        ? `${root}&resource=${resource}&action=create`
        : `${root}?resource=${resource}&action=create`,
    },
    {
      routePath: `${basePath}/[id]`,
      expectedHref: isInventory
        ? `${root}&resource=${resource}&legacyId=PHO0000456`
        : `${root}?resource=${resource}&legacyId=PHO0000456`,
    },
    {
      routePath: `${basePath}/[id]/edit`,
      expectedHref: isInventory
        ? `${root}&resource=${resource}&legacyId=PHO0000456&action=edit`
        : `${root}?resource=${resource}&legacyId=PHO0000456&action=edit`,
    },
  ];
};

const ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/pharmacy/[...missing]',
    expectedHref: '/pharmacy',
  },
  {
    routePath: '../../../app/(main)/inventory/[...missing]',
    expectedHref: '/inventory?panel=inventory',
  },
  ...Object.entries(RESOURCES).flatMap(([scope, resources]) =>
    resources.flatMap((resource) =>
      buildRouteCases(scope, resource)
    )
  ),
];

describe('Pharmacy and Inventory Redirect Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(ROUTE_CASES)(
    '$routePath redirects to workspace route',
    ({ routePath, expectedHref }) => {
      const routeModule = require(routePath);
      expect(routeModule.default).toBeDefined();
      expect(typeof routeModule.default).toBe('function');

      render(React.createElement(routeModule.default));

      expect(mockRedirect).toHaveBeenCalledTimes(1);
      const redirectProps = mockRedirect.mock.calls[0]?.[0] || {};
      expect(redirectProps.href).toBe(expectedHref);
    }
  );
});
