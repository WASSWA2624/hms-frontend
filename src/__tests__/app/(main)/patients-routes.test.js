const fs = require('fs');
const path = require('path');
const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {
  PatientsScreen: jest.fn(() => null),
  PatientsOverviewScreen: jest.fn(() => null),
  PatientResourceListScreen: jest.fn(() => null),
  PatientResourceDetailScreen: jest.fn(() => null),
  PatientResourceFormScreen: jest.fn(() => null),
  NotFoundScreen: jest.fn(() => null),
};
const mockSlot = jest.fn(() => null);
const mockUsePathname = jest.fn(() => '/patients');
const mockReplace = jest.fn();
const mockUsePatientAccess = jest.fn(() => ({
  canAccessPatients: true,
  canManageAllTenants: true,
  tenantId: null,
  isResolved: true,
}));
const mockLoadingSpinner = jest.fn(() => null);

jest.mock('expo-router', () => ({
  Slot: (props) => mockSlot(props),
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({ t: (key) => key }),
  usePatientAccess: (...args) => mockUsePatientAccess(...args),
}));

jest.mock('@platform/components', () => ({
  LoadingSpinner: (...args) => mockLoadingSpinner(...args),
}));

jest.mock('@platform/screens', () => ({
  PatientsScreen: (...args) => mockScreens.PatientsScreen(...args),
  PatientsOverviewScreen: (...args) => mockScreens.PatientsOverviewScreen(...args),
  PatientResourceListScreen: (...args) => mockScreens.PatientResourceListScreen(...args),
  PatientResourceDetailScreen: (...args) => mockScreens.PatientResourceDetailScreen(...args),
  PatientResourceFormScreen: (...args) => mockScreens.PatientResourceFormScreen(...args),
  NotFoundScreen: (...args) => mockScreens.NotFoundScreen(...args),
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
  {
    routePath: '../../../app/(main)/patients/[...missing]',
    screenKey: 'NotFoundScreen',
  },
  ...RESOURCES_WITH_EDIT.flatMap((resourceId) => buildRouteCases(resourceId, true)),
  ...RESOURCES_WITHOUT_EDIT.flatMap((resourceId) => buildRouteCases(resourceId, false)),
];

describe('Tier 4 Patient Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/patients');
    mockUsePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    mockScreens.PatientsScreen.mockImplementation(({ children }) => children || null);
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

  test('patients layout renders PatientsScreen and Slot when access is allowed', () => {
    mockUsePathname.mockReturnValue('/patients');
    mockUsePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const layoutModule = require('../../../app/(main)/patients/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockScreens.PatientsScreen).toHaveBeenCalledTimes(1);
    expect(mockSlot).toHaveBeenCalledTimes(1);
    expect(mockLoadingSpinner).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('patients layout shows loading spinner while access state is resolving', () => {
    mockUsePatientAccess.mockReturnValue({
      canAccessPatients: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: false,
    });

    const layoutModule = require('../../../app/(main)/patients/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockScreens.PatientsScreen).toHaveBeenCalledTimes(1);
    expect(mockLoadingSpinner).toHaveBeenCalledTimes(1);
    expect(mockSlot).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('patients layout redirects to dashboard when user lacks patient access', () => {
    mockUsePatientAccess.mockReturnValue({
      canAccessPatients: false,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });

    const layoutModule = require('../../../app/(main)/patients/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    expect(mockScreens.PatientsScreen).not.toHaveBeenCalled();
    expect(mockSlot).not.toHaveBeenCalled();
  });

  test('patients layout redirects to dashboard for scoped users without tenant context (read-only denied path)', () => {
    mockUsePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const layoutModule = require('../../../app/(main)/patients/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    expect(mockScreens.PatientsScreen).not.toHaveBeenCalled();
    expect(mockSlot).not.toHaveBeenCalled();
  });
});
