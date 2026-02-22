const fs = require('fs');
const path = require('path');
const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {
  PatientsScreen: jest.fn(() => null),
  PatientsOverviewScreen: jest.fn(() => null),
  PatientDirectoryScreen: jest.fn(() => null),
  PatientQuickCreateScreen: jest.fn(() => null),
  PatientWorkspaceScreen: jest.fn(() => null),
  PatientLegalHubScreen: jest.fn(() => null),
  NotFoundScreen: jest.fn(() => null),
};
const mockSlot = jest.fn(() => null);
const mockUsePathname = jest.fn(() => '/patients');
const mockReplace = jest.fn();
let mockSearchParams = {};
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
  useLocalSearchParams: () => mockSearchParams,
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
  PatientDirectoryScreen: (...args) => mockScreens.PatientDirectoryScreen(...args),
  PatientQuickCreateScreen: (...args) => mockScreens.PatientQuickCreateScreen(...args),
  PatientWorkspaceScreen: (...args) => mockScreens.PatientWorkspaceScreen(...args),
  PatientLegalHubScreen: (...args) => mockScreens.PatientLegalHubScreen(...args),
  NotFoundScreen: (...args) => mockScreens.NotFoundScreen(...args),
}));

const DIRECT_ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/patients/index',
    screenKey: 'PatientsOverviewScreen',
  },
  {
    routePath: '../../../app/(main)/patients/patients/index',
    screenKey: 'PatientDirectoryScreen',
  },
  {
    routePath: '../../../app/(main)/patients/patients/create',
    screenKey: 'PatientQuickCreateScreen',
  },
  {
    routePath: '../../../app/(main)/patients/patients/[id]',
    screenKey: 'PatientWorkspaceScreen',
  },
  {
    routePath: '../../../app/(main)/patients/legal/index',
    screenKey: 'PatientLegalHubScreen',
  },
  {
    routePath: '../../../app/(main)/patients/[...missing]',
    screenKey: 'NotFoundScreen',
  },
];

const LEGACY_WORKSPACE_ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/patients/patient-identifiers/index',
    tab: 'identity',
    panel: 'identifiers',
  },
  {
    routePath: '../../../app/(main)/patients/patient-identifiers/create',
    tab: 'identity',
    panel: 'identifiers',
  },
  {
    routePath: '../../../app/(main)/patients/patient-identifiers/[id]',
    tab: 'identity',
    panel: 'identifiers',
  },
  {
    routePath: '../../../app/(main)/patients/patient-identifiers/[id]/edit',
    tab: 'identity',
    panel: 'identifiers',
  },
  {
    routePath: '../../../app/(main)/patients/patient-contacts/index',
    tab: 'identity',
    panel: 'contacts',
  },
  {
    routePath: '../../../app/(main)/patients/patient-contacts/create',
    tab: 'identity',
    panel: 'contacts',
  },
  {
    routePath: '../../../app/(main)/patients/patient-contacts/[id]',
    tab: 'identity',
    panel: 'contacts',
  },
  {
    routePath: '../../../app/(main)/patients/patient-contacts/[id]/edit',
    tab: 'identity',
    panel: 'contacts',
  },
  {
    routePath: '../../../app/(main)/patients/patient-guardians/index',
    tab: 'identity',
    panel: 'guardians',
  },
  {
    routePath: '../../../app/(main)/patients/patient-guardians/create',
    tab: 'identity',
    panel: 'guardians',
  },
  {
    routePath: '../../../app/(main)/patients/patient-guardians/[id]',
    tab: 'identity',
    panel: 'guardians',
  },
  {
    routePath: '../../../app/(main)/patients/patient-guardians/[id]/edit',
    tab: 'identity',
    panel: 'guardians',
  },
  {
    routePath: '../../../app/(main)/patients/patient-allergies/index',
    tab: 'care',
    panel: 'allergies',
  },
  {
    routePath: '../../../app/(main)/patients/patient-allergies/create',
    tab: 'care',
    panel: 'allergies',
  },
  {
    routePath: '../../../app/(main)/patients/patient-allergies/[id]',
    tab: 'care',
    panel: 'allergies',
  },
  {
    routePath: '../../../app/(main)/patients/patient-allergies/[id]/edit',
    tab: 'care',
    panel: 'allergies',
  },
  {
    routePath: '../../../app/(main)/patients/patient-medical-histories/index',
    tab: 'care',
    panel: 'histories',
  },
  {
    routePath: '../../../app/(main)/patients/patient-medical-histories/create',
    tab: 'care',
    panel: 'histories',
  },
  {
    routePath: '../../../app/(main)/patients/patient-medical-histories/[id]',
    tab: 'care',
    panel: 'histories',
  },
  {
    routePath: '../../../app/(main)/patients/patient-medical-histories/[id]/edit',
    tab: 'care',
    panel: 'histories',
  },
  {
    routePath: '../../../app/(main)/patients/patient-documents/index',
    tab: 'documents',
    panel: 'documents',
  },
  {
    routePath: '../../../app/(main)/patients/patient-documents/create',
    tab: 'documents',
    panel: 'documents',
  },
  {
    routePath: '../../../app/(main)/patients/patient-documents/[id]',
    tab: 'documents',
    panel: 'documents',
  },
  {
    routePath: '../../../app/(main)/patients/patient-documents/[id]/edit',
    tab: 'documents',
    panel: 'documents',
  },
];

const LEGACY_LEGAL_ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/patients/consents/index',
    expectedPath: '/patients/legal?tab=consents',
  },
  {
    routePath: '../../../app/(main)/patients/consents/create',
    expectedPath: '/patients/legal?tab=consents',
  },
  {
    routePath: '../../../app/(main)/patients/consents/[id]',
    expectedPath: '/patients/legal?tab=consents',
  },
  {
    routePath: '../../../app/(main)/patients/consents/[id]/edit',
    expectedPath: '/patients/legal?tab=consents',
  },
  {
    routePath: '../../../app/(main)/patients/terms-acceptances/index',
    expectedPath: '/patients/legal?tab=terms',
  },
  {
    routePath: '../../../app/(main)/patients/terms-acceptances/create',
    expectedPath: '/patients/legal?tab=terms',
  },
  {
    routePath: '../../../app/(main)/patients/terms-acceptances/[id]',
    expectedPath: '/patients/legal?tab=terms',
  },
];

describe('Tier 4 Patient Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = {};
    mockUsePathname.mockReturnValue('/patients');
    mockUsePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    mockScreens.PatientsScreen.mockImplementation(({ children }) => children || null);
  });

  test.each(DIRECT_ROUTE_CASES)('$routePath renders $screenKey', ({ routePath, screenKey }) => {
    const routeModule = require(routePath);
    expect(routeModule.default).toBeDefined();
    expect(typeof routeModule.default).toBe('function');

    render(React.createElement(routeModule.default));
    expect(mockScreens[screenKey]).toHaveBeenCalledTimes(1);
  });

  test.each(LEGACY_WORKSPACE_ROUTE_CASES)(
    '$routePath redirects to workspace tab=$tab panel=$panel when patient context exists',
    ({ routePath, tab, panel }) => {
      const routeModule = require(routePath);
      mockSearchParams = { patientId: 'patient-42' };

      render(React.createElement(routeModule.default));
      expect(mockReplace).toHaveBeenCalledWith(
        `/patients/patients/patient-42?tab=${tab}&panel=${panel}`
      );
    }
  );

  test.each(LEGACY_WORKSPACE_ROUTE_CASES)(
    '$routePath redirects to patient directory when patient context is missing',
    ({ routePath }) => {
      const routeModule = require(routePath);
      mockSearchParams = {};

      render(React.createElement(routeModule.default));
      expect(mockReplace).toHaveBeenCalledWith('/patients/patients');
    }
  );

  test.each(LEGACY_LEGAL_ROUTE_CASES)(
    '$routePath redirects to legal hub',
    ({ routePath, expectedPath }) => {
      const routeModule = require(routePath);
      mockSearchParams = {};

      render(React.createElement(routeModule.default));
      expect(mockReplace).toHaveBeenCalledWith(expectedPath);
    }
  );

  test('patient legacy edit route redirects to summary edit mode', () => {
    const routeModule = require('../../../app/(main)/patients/patients/[id]/edit');
    mockSearchParams = { id: 'patient-99' };

    render(React.createElement(routeModule.default));
    expect(mockReplace).toHaveBeenCalledWith('/patients/patients/patient-99?tab=summary&mode=edit');
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
