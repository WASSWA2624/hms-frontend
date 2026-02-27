const React = require('react');
const { render } = require('@testing-library/react-native');

const mockRedirect = jest.fn(() => null);

const mockScreens = {
  LabWorkbenchScreen: jest.fn(() => null),
  ClinicalOverviewScreen: jest.fn(() => null),
  ClinicalResourceListScreen: jest.fn(() => null),
  ClinicalResourceDetailScreen: jest.fn(() => null),
  ClinicalResourceFormScreen: jest.fn(() => null),
};

jest.mock('expo-router', () => ({
  Redirect: (...args) => mockRedirect(...args),
  useLocalSearchParams: jest.fn(() => ({ id: 'LAB0000123' })),
}));

jest.mock('@platform/screens', () => ({
  LabWorkbenchScreen: (...args) => mockScreens.LabWorkbenchScreen(...args),
  ClinicalOverviewScreen: (...args) => mockScreens.ClinicalOverviewScreen(...args),
  ClinicalResourceListScreen: (...args) =>
    mockScreens.ClinicalResourceListScreen(...args),
  ClinicalResourceDetailScreen: (...args) =>
    mockScreens.ClinicalResourceDetailScreen(...args),
  ClinicalResourceFormScreen: (...args) =>
    mockScreens.ClinicalResourceFormScreen(...args),
}));

const LAB_RESOURCE_MAPPINGS = [
  { resourceId: 'lab-orders', canonicalSegment: 'orders', legacySegment: 'lab-orders' },
  { resourceId: 'lab-order-items', canonicalSegment: 'order-items', legacySegment: 'lab-order-items' },
  { resourceId: 'lab-samples', canonicalSegment: 'samples', legacySegment: 'lab-samples' },
  { resourceId: 'lab-results', canonicalSegment: 'results', legacySegment: 'lab-results' },
  { resourceId: 'lab-tests', canonicalSegment: 'tests', legacySegment: 'lab-tests' },
  { resourceId: 'lab-panels', canonicalSegment: 'panels', legacySegment: 'lab-panels' },
  { resourceId: 'lab-qc-logs', canonicalSegment: 'qc-logs', legacySegment: 'lab-qc-logs' },
];

const buildCanonicalCases = ({ resourceId, canonicalSegment }) => {
  const basePath = `../../../app/(main)/lab/${canonicalSegment}`;
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

const buildLegacyRedirectCases = ({ legacySegment, canonicalSegment }) => {
  const basePath = `../../../app/(main)/diagnostics/lab/${legacySegment}`;
  return [
    {
      routePath: `${basePath}/index`,
      screenKey: 'Redirect',
      expectedHref: `/lab/${canonicalSegment}`,
    },
    {
      routePath: `${basePath}/create`,
      screenKey: 'Redirect',
      expectedHref: `/lab/${canonicalSegment}/create`,
    },
    {
      routePath: `${basePath}/[id]`,
      screenKey: 'Redirect',
      expectedHref: `/lab/${canonicalSegment}/LAB0000123`,
    },
    {
      routePath: `${basePath}/[id]/edit`,
      screenKey: 'Redirect',
      expectedHref: `/lab/${canonicalSegment}/LAB0000123/edit`,
    },
  ];
};

const ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/lab/index',
    screenKey: 'LabWorkbenchScreen',
  },
  {
    routePath: '../../../app/(main)/diagnostics/lab/index',
    screenKey: 'Redirect',
    expectedHref: '/lab',
  },
  {
    routePath: '../../../app/(main)/diagnostics/lab/[...missing]',
    screenKey: 'Redirect',
    expectedHref: '/lab',
  },
  {
    routePath: '../../../app/(main)/diagnostics/radiology/index',
    screenKey: 'ClinicalOverviewScreen',
    expectedProps: { scope: 'radiology' },
  },
  ...LAB_RESOURCE_MAPPINGS.flatMap((mapping) => buildCanonicalCases(mapping)),
  ...LAB_RESOURCE_MAPPINGS.flatMap((mapping) => buildLegacyRedirectCases(mapping)),
];

describe('Tier 8 Diagnostics + Lab Canonical Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(ROUTE_CASES)(
    '$routePath renders $screenKey',
    ({ routePath, screenKey, expectedProps, expectedHref }) => {
      const routeModule = require(routePath);
      expect(routeModule.default).toBeDefined();
      expect(typeof routeModule.default).toBe('function');

      render(React.createElement(routeModule.default));

      if (screenKey === 'Redirect') {
        expect(mockRedirect).toHaveBeenCalledTimes(1);
        const redirectProps = mockRedirect.mock.calls[0]?.[0] || {};
        expect(redirectProps.href).toBe(expectedHref);
        return;
      }

      expect(mockScreens[screenKey]).toHaveBeenCalledTimes(1);

      if (expectedProps) {
        const calledProps = mockScreens[screenKey].mock.calls[0]?.[0] || {};
        expect(calledProps).toMatchObject(expectedProps);
      }
    }
  );
});
