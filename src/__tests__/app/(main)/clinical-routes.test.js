const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {
  ClinicalWorkbenchScreen: jest.fn(() => null),
  ClinicalResourceListScreen: jest.fn(() => null),
  ClinicalResourceDetailScreen: jest.fn(() => null),
  ClinicalResourceFormScreen: jest.fn(() => null),
};

jest.mock('@platform/screens', () => ({
  ClinicalWorkbenchScreen: (...args) => mockScreens.ClinicalWorkbenchScreen(...args),
  ClinicalResourceListScreen: (...args) => mockScreens.ClinicalResourceListScreen(...args),
  ClinicalResourceDetailScreen: (...args) => mockScreens.ClinicalResourceDetailScreen(...args),
  ClinicalResourceFormScreen: (...args) => mockScreens.ClinicalResourceFormScreen(...args),
}));

const RESOURCES_WITH_EDIT = [
  'encounters',
  'clinical-notes',
  'diagnoses',
  'procedures',
  'vital-signs',
  'care-plans',
  'clinical-alerts',
  'referrals',
  'follow-ups',
];

const buildRouteCases = (resourceId) => {
  const basePath = `../../../app/(main)/clinical/${resourceId}`;
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

const CLINICAL_ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/clinical/index',
    screenKey: 'ClinicalWorkbenchScreen',
  },
  ...RESOURCES_WITH_EDIT.flatMap((resourceId) => buildRouteCases(resourceId)),
];

describe('Tier 6 Clinical Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(CLINICAL_ROUTE_CASES)('$routePath renders $screenKey', ({ routePath, screenKey, expectedProps }) => {
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
