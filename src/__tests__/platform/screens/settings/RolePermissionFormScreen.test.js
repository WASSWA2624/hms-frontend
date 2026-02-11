/**
 * RolePermissionFormScreen Component Tests
 * Per testing.mdc: render, loading, error, offline, a11y, interactions
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/RolePermissionFormScreen/useRolePermissionFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useRolePermissionFormScreen = require('@platform/screens/settings/RolePermissionFormScreen/useRolePermissionFormScreen').default;
const RolePermissionFormScreenWeb = require('@platform/screens/settings/RolePermissionFormScreen/RolePermissionFormScreen.web').default;
const RolePermissionFormScreenAndroid = require('@platform/screens/settings/RolePermissionFormScreen/RolePermissionFormScreen.android').default;
const RolePermissionFormScreenIOS = require('@platform/screens/settings/RolePermissionFormScreen/RolePermissionFormScreen.ios').default;
const RolePermissionFormScreenIndex = require('@platform/screens/settings/RolePermissionFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'rolePermission.form.createTitle': 'Create Role Permission',
    'rolePermission.form.editTitle': 'Edit Role Permission',
    'rolePermission.form.loadError': 'Failed to load role permission',
    'rolePermission.form.roleLabel': 'Role',
    'rolePermission.form.rolePlaceholder': 'Select role',
    'rolePermission.form.roleHint': 'Required',
    'rolePermission.form.permissionLabel': 'Permission',
    'rolePermission.form.permissionPlaceholder': 'Select permission',
    'rolePermission.form.permissionHint': 'Required',
    'rolePermission.form.roleLoadErrorTitle': 'Unable to load roles',
    'rolePermission.form.roleLoadErrorMessage': 'We could not load roles',
    'rolePermission.form.permissionLoadErrorTitle': 'Unable to load permissions',
    'rolePermission.form.permissionLoadErrorMessage': 'We could not load permissions',
    'rolePermission.form.noRolesMessage': 'No roles available yet.',
    'rolePermission.form.createRoleFirst': 'Create a role before adding permissions.',
    'rolePermission.form.goToRoles': 'Go to Roles',
    'rolePermission.form.goToRolesHint': 'Open roles settings',
    'rolePermission.form.noPermissionsMessage': 'No permissions available yet.',
    'rolePermission.form.createPermissionFirst': 'Create a permission before assigning roles.',
    'rolePermission.form.goToPermissions': 'Go to Permissions',
    'rolePermission.form.goToPermissionsHint': 'Open permissions settings',
    'rolePermission.form.submitCreate': 'Create Role Permission',
    'rolePermission.form.submitEdit': 'Save Changes',
    'rolePermission.form.submitErrorTitle': 'Unable to save role permission',
    'rolePermission.form.cancel': 'Cancel',
    'rolePermission.form.cancelHint': 'Return without saving',
    'rolePermission.form.blockedMessage': 'Add roles and permissions to continue.',
    'common.loading': 'Loading',
    'common.back': 'Back',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  isEdit: false,
  roleId: '',
  setRoleId: jest.fn(),
  permissionId: '',
  setPermissionId: jest.fn(),
  roleOptions: [],
  permissionOptions: [],
  roleListLoading: false,
  roleListError: false,
  roleErrorMessage: null,
  permissionListLoading: false,
  permissionListError: false,
  permissionErrorMessage: null,
  hasRoles: true,
  hasPermissions: true,
  isCreateBlocked: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  rolePermission: null,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToRoles: jest.fn(),
  onGoToPermissions: jest.fn(),
  onRetryRoles: jest.fn(),
  onRetryPermissions: jest.fn(),
  isSubmitDisabled: false,
};

describe('RolePermissionFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useRolePermissionFormScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<RolePermissionFormScreenWeb />);
      expect(getByTestId('role-permission-form-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<RolePermissionFormScreenAndroid />);
      expect(getByTestId('role-permission-form-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<RolePermissionFormScreenIOS />);
      expect(getByTestId('role-permission-form-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useRolePermissionFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        isLoading: true,
        rolePermission: null,
      });
      const { getByTestId } = renderWithTheme(<RolePermissionFormScreenWeb />);
      expect(getByTestId('role-permission-form-loading')).toBeTruthy();
    });
  });

  describe('load error', () => {
    it('shows load error state (Web)', () => {
      useRolePermissionFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        hasError: true,
        rolePermission: null,
      });
      const { getByTestId } = renderWithTheme(<RolePermissionFormScreenWeb />);
      expect(getByTestId('role-permission-form-load-error')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows offline state (Web)', () => {
      useRolePermissionFormScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<RolePermissionFormScreenWeb />);
      expect(getByTestId('role-permission-form-offline')).toBeTruthy();
    });

    it('shows submit error state (Web)', () => {
      useRolePermissionFormScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Submit failed',
      });
      const { getByTestId } = renderWithTheme(<RolePermissionFormScreenWeb />);
      expect(getByTestId('role-permission-form-submit-error')).toBeTruthy();
    });
  });

  describe('role and permission states', () => {
    it('shows role load error (Web)', () => {
      useRolePermissionFormScreen.mockReturnValue({
        ...baseHook,
        roleListError: true,
        roleErrorMessage: 'Unable to load roles',
      });
      const { getByTestId } = renderWithTheme(<RolePermissionFormScreenWeb />);
      expect(getByTestId('role-permission-form-role-error')).toBeTruthy();
    });

    it('shows permission load error (Web)', () => {
      useRolePermissionFormScreen.mockReturnValue({
        ...baseHook,
        permissionListError: true,
        permissionErrorMessage: 'Unable to load permissions',
      });
      const { getByTestId } = renderWithTheme(<RolePermissionFormScreenWeb />);
      expect(getByTestId('role-permission-form-permission-error')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('calls submit and cancel handlers (Web)', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      useRolePermissionFormScreen.mockReturnValue({
        ...baseHook,
        onSubmit,
        onCancel,
      });
      const { getByTestId } = renderWithTheme(<RolePermissionFormScreenWeb />);
      fireEvent.press(getByTestId('role-permission-form-submit'));
      fireEvent.press(getByTestId('role-permission-form-cancel'));
      expect(onSubmit).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(RolePermissionFormScreenIndex.default).toBeDefined();
      expect(RolePermissionFormScreenIndex.useRolePermissionFormScreen).toBeDefined();
    });
  });
});

