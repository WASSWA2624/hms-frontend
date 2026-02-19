const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {};
const mockSlot = jest.fn(() => null);
const mockUsePathname = jest.fn(() => '/settings');
const mockLoadingSpinner = jest.fn(() => null);
const mockUseRouteAccessGuard = jest.fn(() => ({ hasAccess: true, isPending: false }));

jest.mock('expo-router', () => ({
  Slot: (props) => mockSlot(props),
  usePathname: () => mockUsePathname(),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({ t: (key) => key }),
}));

jest.mock('@navigation/guards', () => ({
  useRouteAccessGuard: (...args) => mockUseRouteAccessGuard(...args),
}));

jest.mock('@platform/components', () => ({
  LoadingSpinner: (...args) => mockLoadingSpinner(...args),
}));

jest.mock('@platform/screens', () =>
  new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (!mockScreens[prop]) {
          mockScreens[prop] = jest.fn(() => null);
        }

        return (...args) => mockScreens[prop](...args);
      },
    }
  )
);

const SETTINGS_RESOURCES = [
  {
    resourcePath: 'tenants',
    listScreen: 'TenantListScreen',
    detailScreen: 'TenantDetailScreen',
    formScreen: 'TenantFormScreen',
  },
  {
    resourcePath: 'facilities',
    listScreen: 'FacilityListScreen',
    detailScreen: 'FacilityDetailScreen',
    formScreen: 'FacilityFormScreen',
  },
  {
    resourcePath: 'branches',
    listScreen: 'BranchListScreen',
    detailScreen: 'BranchDetailScreen',
    formScreen: 'BranchFormScreen',
  },
  {
    resourcePath: 'departments',
    listScreen: 'DepartmentListScreen',
    detailScreen: 'DepartmentDetailScreen',
    formScreen: 'DepartmentFormScreen',
  },
  {
    resourcePath: 'units',
    listScreen: 'UnitListScreen',
    detailScreen: 'UnitDetailScreen',
    formScreen: 'UnitFormScreen',
  },
  {
    resourcePath: 'rooms',
    listScreen: 'RoomListScreen',
    detailScreen: 'RoomDetailScreen',
    formScreen: 'RoomFormScreen',
  },
  {
    resourcePath: 'wards',
    listScreen: 'WardListScreen',
    detailScreen: 'WardDetailScreen',
    formScreen: 'WardFormScreen',
  },
  {
    resourcePath: 'beds',
    listScreen: 'BedListScreen',
    detailScreen: 'BedDetailScreen',
    formScreen: 'BedFormScreen',
  },
  {
    resourcePath: 'addresses',
    listScreen: 'AddressListScreen',
    detailScreen: 'AddressDetailScreen',
    formScreen: 'AddressFormScreen',
  },
  {
    resourcePath: 'contacts',
    listScreen: 'ContactListScreen',
    detailScreen: 'ContactDetailScreen',
    formScreen: 'ContactFormScreen',
  },
  {
    resourcePath: 'users',
    listScreen: 'UserListScreen',
    detailScreen: 'UserDetailScreen',
    formScreen: 'UserFormScreen',
  },
  {
    resourcePath: 'user-profiles',
    listScreen: 'UserProfileListScreen',
    detailScreen: 'UserProfileDetailScreen',
    formScreen: 'UserProfileFormScreen',
  },
  {
    resourcePath: 'roles',
    listScreen: 'RoleListScreen',
    detailScreen: 'RoleDetailScreen',
    formScreen: 'RoleFormScreen',
  },
  {
    resourcePath: 'permissions',
    listScreen: 'PermissionListScreen',
    detailScreen: 'PermissionDetailScreen',
    formScreen: 'PermissionFormScreen',
  },
  {
    resourcePath: 'role-permissions',
    listScreen: 'RolePermissionListScreen',
    detailScreen: 'RolePermissionDetailScreen',
    formScreen: 'RolePermissionFormScreen',
  },
  {
    resourcePath: 'user-roles',
    listScreen: 'UserRoleListScreen',
    detailScreen: 'UserRoleDetailScreen',
    formScreen: 'UserRoleFormScreen',
  },
  {
    resourcePath: 'api-keys',
    listScreen: 'ApiKeyListScreen',
    detailScreen: 'ApiKeyDetailScreen',
    formScreen: null,
  },
  {
    resourcePath: 'api-key-permissions',
    listScreen: 'ApiKeyPermissionListScreen',
    detailScreen: 'ApiKeyPermissionDetailScreen',
    formScreen: 'ApiKeyPermissionFormScreen',
  },
  {
    resourcePath: 'user-mfas',
    listScreen: 'UserMfaListScreen',
    detailScreen: 'UserMfaDetailScreen',
    formScreen: 'UserMfaFormScreen',
  },
  {
    resourcePath: 'user-sessions',
    listScreen: 'UserSessionListScreen',
    detailScreen: 'UserSessionDetailScreen',
    formScreen: null,
  },
  {
    resourcePath: 'oauth-accounts',
    listScreen: 'OauthAccountListScreen',
    detailScreen: 'OauthAccountDetailScreen',
    formScreen: 'OauthAccountFormScreen',
  },
];

const buildRouteCases = ({ resourcePath, listScreen, detailScreen, formScreen }) => {
  const basePath = `../../../app/(main)/settings/${resourcePath}`;
  const routeCases = [
    { routePath: `${basePath}/index`, screenKey: listScreen },
    { routePath: `${basePath}/[id]`, screenKey: detailScreen },
  ];

  if (formScreen) {
    routeCases.push(
      { routePath: `${basePath}/create`, screenKey: formScreen },
      { routePath: `${basePath}/[id]/edit`, screenKey: formScreen }
    );
  }

  return routeCases;
};

const SETTINGS_ROUTE_CASES = [
  { routePath: '../../../app/(main)/settings/index', screenKey: 'GeneralSettingsPanel' },
  ...SETTINGS_RESOURCES.flatMap((resourceConfig) => buildRouteCases(resourceConfig)),
];

const READ_ONLY_ROUTE_CASES = [
  '../../../app/(main)/settings/api-keys/create',
  '../../../app/(main)/settings/api-keys/[id]/edit',
  '../../../app/(main)/settings/user-sessions/create',
  '../../../app/(main)/settings/user-sessions/[id]/edit',
];

describe('Tier 3 Settings Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/settings');
    mockUseRouteAccessGuard.mockReturnValue({ hasAccess: true, isPending: false });
  });

  test.each(SETTINGS_ROUTE_CASES)('$routePath renders $screenKey', ({ routePath, screenKey }) => {
    const routeModule = require(routePath);
    expect(routeModule.default).toBeDefined();
    expect(typeof routeModule.default).toBe('function');

    render(React.createElement(routeModule.default));
    expect(mockScreens[screenKey]).toHaveBeenCalledTimes(1);
  });
});

describe('Tier 3 Settings Layout Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/settings');
    mockUseRouteAccessGuard.mockReturnValue({ hasAccess: true, isPending: false });
  });

  it('settings layout wraps Slot with SettingsScreen and resolves list context', () => {
    mockUsePathname.mockReturnValue('/settings/tenants');
    if (!mockScreens.SettingsScreen) {
      mockScreens.SettingsScreen = jest.fn(() => null);
    }
    mockScreens.SettingsScreen.mockImplementation(({ children }) => children || null);

    const layoutModule = require('../../../app/(main)/settings/_layout');
    expect(layoutModule.default).toBeDefined();
    render(React.createElement(layoutModule.default));

    expect(mockUsePathname).toHaveBeenCalledTimes(1);
    expect(mockUseRouteAccessGuard).toHaveBeenCalledWith({ redirectPath: '/dashboard' });
    expect(mockScreens.SettingsScreen).toHaveBeenCalledTimes(1);
    expect(mockSlot).toHaveBeenCalledTimes(1);

    const settingsProps = mockScreens.SettingsScreen.mock.calls[0][0];
    expect(settingsProps.children).toBeDefined();
    expect(settingsProps.children.key).toBe('/settings/tenants');
    expect(settingsProps.screenKey).toBe('tenant');
    expect(settingsProps.screenMode).toBe('list');
  });

  it('settings layout resolves detail context', () => {
    mockUsePathname.mockReturnValue('/settings/tenants/tenant-123');
    if (!mockScreens.SettingsScreen) {
      mockScreens.SettingsScreen = jest.fn(() => null);
    }
    mockScreens.SettingsScreen.mockImplementation(({ children }) => children || null);

    const layoutModule = require('../../../app/(main)/settings/_layout');
    render(React.createElement(layoutModule.default));

    const settingsProps = mockScreens.SettingsScreen.mock.calls[0][0];
    expect(settingsProps.screenKey).toBe('tenant');
    expect(settingsProps.screenMode).toBe('detail');
  });

  it('settings layout resolves edit context', () => {
    mockUsePathname.mockReturnValue('/settings/tenants/tenant-123/edit');
    if (!mockScreens.SettingsScreen) {
      mockScreens.SettingsScreen = jest.fn(() => null);
    }
    mockScreens.SettingsScreen.mockImplementation(({ children }) => children || null);

    const layoutModule = require('../../../app/(main)/settings/_layout');
    render(React.createElement(layoutModule.default));

    const settingsProps = mockScreens.SettingsScreen.mock.calls[0][0];
    expect(settingsProps.screenKey).toBe('tenant');
    expect(settingsProps.screenMode).toBe('edit');
  });

  it('does not render settings shell when access is denied', () => {
    mockUsePathname.mockReturnValue('/settings/tenants');
    mockUseRouteAccessGuard.mockReturnValue({ hasAccess: false, isPending: false });

    const layoutModule = require('../../../app/(main)/settings/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockScreens.SettingsScreen).not.toHaveBeenCalled();
    expect(mockSlot).not.toHaveBeenCalled();
    expect(mockLoadingSpinner).not.toHaveBeenCalled();
  });

  it('renders loading spinner in settings shell while route access is pending', () => {
    mockUsePathname.mockReturnValue('/settings/tenants');
    mockUseRouteAccessGuard.mockReturnValue({ hasAccess: false, isPending: true });
    if (!mockScreens.SettingsScreen) {
      mockScreens.SettingsScreen = jest.fn(() => null);
    }
    mockScreens.SettingsScreen.mockImplementation(({ children }) => children || null);

    const layoutModule = require('../../../app/(main)/settings/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockScreens.SettingsScreen).toHaveBeenCalledTimes(1);
    expect(mockLoadingSpinner).toHaveBeenCalledTimes(1);
    expect(mockSlot).not.toHaveBeenCalled();
  });
});

describe('Tier 3 Settings Read-only Routes', () => {
  test.each(READ_ONLY_ROUTE_CASES)('$routePath is intentionally not mounted', (routePath) => {
    expect(() => require(routePath)).toThrow();
  });
});
