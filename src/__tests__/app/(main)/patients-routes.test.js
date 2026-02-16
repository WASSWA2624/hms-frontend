const fs = require('fs');
const path = require('path');
const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {
  PatientsOverviewScreen: jest.fn(() => null),
  PatientResourceListScreen: jest.fn(() => null),
  PatientResourceDetailScreen: jest.fn(() => null),
  PatientResourceFormScreen: jest.fn(() => null),
};

jest.mock('@platform/screens', () => ({
  PatientsOverviewScreen: (...args) => mockScreens.PatientsOverviewScreen(...args),
  PatientResourceListScreen: (...args) => mockScreens.PatientResourceListScreen(...args),
  PatientResourceDetailScreen: (...args) => mockScreens.PatientResourceDetailScreen(...args),
  PatientResourceFormScreen: (...args) => mockScreens.PatientResourceFormScreen(...args),
}));

const RESOURCES_WITH_EDIT = [
  'patients',
  'patient-identifiers',
  'patient-contacts',
  'patient-guardians',
  'patient-allergies',
  'patient-medical-histories',
  'patient-documents',
  'consents',
];

const RESOURCES_WITHOUT_EDIT = [
  'terms-acceptances',
];

const buildRouteCases = (resourceId, supportsEdit) => {
  const basePath = `../../../app/(main)/patients/${resourceId}`;
  const cases = [
    {
      routePath: `${basePath}/index`,
      screenKey: 'PatientResourceListScreen',
      expectedProps: { resourceId },
    },
    {
      routePath: `${basePath}/create`,
      screenKey: 'PatientResourceFormScreen',
      expectedProps: { resourceId },
    },
    {
      routePath: `${basePath}/[id]`,
      screenKey: 'PatientResourceDetailScreen',
      expectedProps: { resourceId },
    },
  ];

  if (supportsEdit) {
    cases.push({
      routePath: `${basePath}/[id]/edit`,
      screenKey: 'PatientResourceFormScreen',
      expectedProps: { resourceId },
    });
  }

  return cases;
};

const PATIENT_ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/patients/index',
    screenKey: 'PatientsOverviewScreen',
  },
  ...RESOURCES_WITH_EDIT.flatMap((resourceId) => buildRouteCases(resourceId, true)),
  ...RESOURCES_WITHOUT_EDIT.flatMap((resourceId) => buildRouteCases(resourceId, false)),
];

describe('Tier 4 Patient Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(PATIENT_ROUTE_CASES)('$routePath renders $screenKey', ({ routePath, screenKey, expectedProps }) => {
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

  test('terms-acceptances edit route is absent because update is unsupported', () => {
    const editRoutePath = path.join(
      __dirname,
      '../../../app/(main)/patients/terms-acceptances/[id]/edit.jsx'
    );
    expect(fs.existsSync(editRoutePath)).toBe(false);
  });
});
