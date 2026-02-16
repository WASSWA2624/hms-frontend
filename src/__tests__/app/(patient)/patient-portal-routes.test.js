const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {
  PatientPortalMainScreen: jest.fn(() => null),
  PatientAppointmentsScreen: jest.fn(() => null),
  PatientResultsScreen: jest.fn(() => null),
  PatientPrescriptionsScreen: jest.fn(() => null),
  PatientBillingScreen: jest.fn(() => null),
};

jest.mock('@platform/screens', () => ({
  PatientPortalMainScreen: (...args) => mockScreens.PatientPortalMainScreen(...args),
  PatientAppointmentsScreen: (...args) => mockScreens.PatientAppointmentsScreen(...args),
  PatientResultsScreen: (...args) => mockScreens.PatientResultsScreen(...args),
  PatientPrescriptionsScreen: (...args) => mockScreens.PatientPrescriptionsScreen(...args),
  PatientBillingScreen: (...args) => mockScreens.PatientBillingScreen(...args),
}));

const PATIENT_PORTAL_ROUTE_CASES = [
  {
    routePath: '../../../app/(patient)/portal/index',
    screenKey: 'PatientPortalMainScreen',
  },
  {
    routePath: '../../../app/(patient)/appointments/index',
    screenKey: 'PatientAppointmentsScreen',
  },
  {
    routePath: '../../../app/(patient)/results/index',
    screenKey: 'PatientResultsScreen',
  },
  {
    routePath: '../../../app/(patient)/prescriptions/index',
    screenKey: 'PatientPrescriptionsScreen',
  },
  {
    routePath: '../../../app/(patient)/billing/index',
    screenKey: 'PatientBillingScreen',
  },
];

describe('Tier 11 Patient Portal Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(PATIENT_PORTAL_ROUTE_CASES)('$routePath renders $screenKey', ({ routePath, screenKey }) => {
    const routeModule = require(routePath);
    expect(routeModule.default).toBeDefined();
    expect(typeof routeModule.default).toBe('function');

    render(React.createElement(routeModule.default));
    expect(mockScreens[screenKey]).toHaveBeenCalledTimes(1);
  });
});
