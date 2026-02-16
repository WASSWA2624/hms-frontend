const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {
  GeneralSettingsPanel: jest.fn(() => null),
  TenantListScreen: jest.fn(() => null),
  FacilityListScreen: jest.fn(() => null),
  BranchListScreen: jest.fn(() => null),
  DepartmentListScreen: jest.fn(() => null),
  UnitListScreen: jest.fn(() => null),
  RoomListScreen: jest.fn(() => null),
  WardListScreen: jest.fn(() => null),
  BedListScreen: jest.fn(() => null),
  AddressListScreen: jest.fn(() => null),
  ContactListScreen: jest.fn(() => null),
  UserListScreen: jest.fn(() => null),
  UserProfileListScreen: jest.fn(() => null),
  RoleListScreen: jest.fn(() => null),
  PermissionListScreen: jest.fn(() => null),
  RolePermissionListScreen: jest.fn(() => null),
  UserRoleListScreen: jest.fn(() => null),
  ApiKeyListScreen: jest.fn(() => null),
  ApiKeyPermissionListScreen: jest.fn(() => null),
  UserMfaListScreen: jest.fn(() => null),
  UserSessionListScreen: jest.fn(() => null),
  OauthAccountListScreen: jest.fn(() => null),
};

jest.mock('@platform/screens', () => ({
  GeneralSettingsPanel: (...args) => mockScreens.GeneralSettingsPanel(...args),
  TenantListScreen: (...args) => mockScreens.TenantListScreen(...args),
  FacilityListScreen: (...args) => mockScreens.FacilityListScreen(...args),
  BranchListScreen: (...args) => mockScreens.BranchListScreen(...args),
  DepartmentListScreen: (...args) => mockScreens.DepartmentListScreen(...args),
  UnitListScreen: (...args) => mockScreens.UnitListScreen(...args),
  RoomListScreen: (...args) => mockScreens.RoomListScreen(...args),
  WardListScreen: (...args) => mockScreens.WardListScreen(...args),
  BedListScreen: (...args) => mockScreens.BedListScreen(...args),
  AddressListScreen: (...args) => mockScreens.AddressListScreen(...args),
  ContactListScreen: (...args) => mockScreens.ContactListScreen(...args),
  UserListScreen: (...args) => mockScreens.UserListScreen(...args),
  UserProfileListScreen: (...args) => mockScreens.UserProfileListScreen(...args),
  RoleListScreen: (...args) => mockScreens.RoleListScreen(...args),
  PermissionListScreen: (...args) => mockScreens.PermissionListScreen(...args),
  RolePermissionListScreen: (...args) => mockScreens.RolePermissionListScreen(...args),
  UserRoleListScreen: (...args) => mockScreens.UserRoleListScreen(...args),
  ApiKeyListScreen: (...args) => mockScreens.ApiKeyListScreen(...args),
  ApiKeyPermissionListScreen: (...args) => mockScreens.ApiKeyPermissionListScreen(...args),
  UserMfaListScreen: (...args) => mockScreens.UserMfaListScreen(...args),
  UserSessionListScreen: (...args) => mockScreens.UserSessionListScreen(...args),
  OauthAccountListScreen: (...args) => mockScreens.OauthAccountListScreen(...args),
}));

const SETTINGS_ROUTE_CASES = [
  { routePath: '../../../app/(main)/settings/index', screenKey: 'GeneralSettingsPanel' },
  { routePath: '../../../app/(main)/settings/tenants/index', screenKey: 'TenantListScreen' },
  { routePath: '../../../app/(main)/settings/facilities/index', screenKey: 'FacilityListScreen' },
  { routePath: '../../../app/(main)/settings/branches/index', screenKey: 'BranchListScreen' },
  { routePath: '../../../app/(main)/settings/departments/index', screenKey: 'DepartmentListScreen' },
  { routePath: '../../../app/(main)/settings/units/index', screenKey: 'UnitListScreen' },
  { routePath: '../../../app/(main)/settings/rooms/index', screenKey: 'RoomListScreen' },
  { routePath: '../../../app/(main)/settings/wards/index', screenKey: 'WardListScreen' },
  { routePath: '../../../app/(main)/settings/beds/index', screenKey: 'BedListScreen' },
  { routePath: '../../../app/(main)/settings/addresses/index', screenKey: 'AddressListScreen' },
  { routePath: '../../../app/(main)/settings/contacts/index', screenKey: 'ContactListScreen' },
  { routePath: '../../../app/(main)/settings/users/index', screenKey: 'UserListScreen' },
  { routePath: '../../../app/(main)/settings/user-profiles/index', screenKey: 'UserProfileListScreen' },
  { routePath: '../../../app/(main)/settings/roles/index', screenKey: 'RoleListScreen' },
  { routePath: '../../../app/(main)/settings/permissions/index', screenKey: 'PermissionListScreen' },
  { routePath: '../../../app/(main)/settings/role-permissions/index', screenKey: 'RolePermissionListScreen' },
  { routePath: '../../../app/(main)/settings/user-roles/index', screenKey: 'UserRoleListScreen' },
  { routePath: '../../../app/(main)/settings/api-keys/index', screenKey: 'ApiKeyListScreen' },
  {
    routePath: '../../../app/(main)/settings/api-key-permissions/index',
    screenKey: 'ApiKeyPermissionListScreen',
  },
  { routePath: '../../../app/(main)/settings/user-mfas/index', screenKey: 'UserMfaListScreen' },
  { routePath: '../../../app/(main)/settings/user-sessions/index', screenKey: 'UserSessionListScreen' },
  { routePath: '../../../app/(main)/settings/oauth-accounts/index', screenKey: 'OauthAccountListScreen' },
];

describe('Tier 3 Settings Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(SETTINGS_ROUTE_CASES)('$routePath renders $screenKey', ({ routePath, screenKey }) => {
    const routeModule = require(routePath);
    expect(routeModule.default).toBeDefined();
    expect(typeof routeModule.default).toBe('function');

    render(React.createElement(routeModule.default));
    expect(mockScreens[screenKey]).toHaveBeenCalledTimes(1);
  });
});
