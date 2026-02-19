/**
 * RolePermissionDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/RolePermissionDetailScreen/useRolePermissionDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useRolePermissionDetailScreen = require('@platform/screens/settings/RolePermissionDetailScreen/useRolePermissionDetailScreen').default;
const RolePermissionDetailScreenWeb = require('@platform/screens/settings/RolePermissionDetailScreen/RolePermissionDetailScreen.web').default;
const RolePermissionDetailScreenAndroid = require('@platform/screens/settings/RolePermissionDetailScreen/RolePermissionDetailScreen.android').default;
const RolePermissionDetailScreenIOS = require('@platform/screens/settings/RolePermissionDetailScreen/RolePermissionDetailScreen.ios').default;
const RolePermissionDetailScreenIndex = require('@platform/screens/settings/RolePermissionDetailScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'rolePermission.detail.title': 'Role Permission Details',
    'rolePermission.detail.idLabel': 'Role permission ID',
    'rolePermission.detail.roleLabel': 'Role',
    'rolePermission.detail.permissionLabel': 'Permission',
    'rolePermission.detail.tenantLabel': 'Tenant',
    'rolePermission.detail.createdLabel': 'Created',
    'rolePermission.detail.updatedLabel': 'Updated',
    'rolePermission.detail.errorTitle': 'Failed to load role permission',
    'rolePermission.detail.notFoundTitle': 'Role permission not found',
    'rolePermission.detail.notFoundMessage': 'This role permission may have been removed.',
    'rolePermission.detail.backHint': 'Return to role permissions list',
    'rolePermission.detail.delete': 'Delete role permission',
    'rolePermission.detail.deleteHint': 'Delete this role permission',
    'rolePermission.detail.edit': 'Edit role permission',
    'rolePermission.detail.editHint': 'Edit this role permission',
    'common.loading': 'Loading',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.back': 'Back',
    'common.remove': 'Remove',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  id: 'rp-1',
  rolePermission: null,
  roleLabel: '',
  permissionLabel: '',
  tenantLabel: '',
  canViewTechnicalIds: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('RolePermissionDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT, locale: 'en' });
    useRolePermissionDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenWeb />);
      expect(getByTestId('role-permission-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      useRolePermissionDetailScreen.mockReturnValue({ ...baseHook, rolePermission: null });
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenAndroid />);
      expect(getByTestId('role-permission-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      useRolePermissionDetailScreen.mockReturnValue({ ...baseHook, rolePermission: null });
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenIOS />);
      expect(getByTestId('role-permission-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useRolePermissionDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenWeb />);
      expect(getByTestId('role-permission-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useRolePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenWeb />);
      expect(getByTestId('role-permission-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useRolePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenWeb />);
      expect(getByTestId('role-permission-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      useRolePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        rolePermission: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenWeb />);
      expect(getByTestId('role-permission-detail-not-found')).toBeTruthy();
    });
  });

  describe('with role permission data', () => {
    it('renders role permission details (Web)', () => {
      useRolePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        canViewTechnicalIds: true,
        roleLabel: 'Admin',
        permissionLabel: 'Manage users',
        tenantLabel: 'Main tenant',
        rolePermission: {
          id: 'rp-1',
          role_id: 'r1',
          permission_id: 'p1',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      });
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenWeb />);
      expect(getByTestId('role-permission-detail-card')).toBeTruthy();
      expect(getByTestId('role-permission-detail-id')).toBeTruthy();
      expect(getByTestId('role-permission-detail-role')).toBeTruthy();
      expect(getByTestId('role-permission-detail-permission')).toBeTruthy();
      expect(getByTestId('role-permission-detail-created')).toBeTruthy();
      expect(getByTestId('role-permission-detail-updated')).toBeTruthy();
    });

    it('hides technical ID for non-global users (Web)', () => {
      useRolePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        canViewTechnicalIds: false,
        roleLabel: 'Admin',
        permissionLabel: 'Manage users',
        tenantLabel: 'Main tenant',
        rolePermission: {
          id: 'rp-1',
          role_id: 'r1',
          permission_id: 'p1',
        },
      });
      const { queryByTestId } = renderWithTheme(<RolePermissionDetailScreenWeb />);
      expect(queryByTestId('role-permission-detail-id')).toBeNull();
    });
  });

  describe('inline states', () => {
    it('shows inline error banner when role permission exists (Web)', () => {
      useRolePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Error',
        roleLabel: 'Admin',
        permissionLabel: 'Manage users',
        tenantLabel: 'Main tenant',
        rolePermission: { id: 'rp-1', role_id: 'r1', permission_id: 'p1' },
      });
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenWeb />);
      expect(getByTestId('role-permission-detail-error-banner')).toBeTruthy();
    });

    it('shows inline offline banner when role permission exists (Web)', () => {
      useRolePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        roleLabel: 'Admin',
        permissionLabel: 'Manage users',
        tenantLabel: 'Main tenant',
        rolePermission: { id: 'rp-1', role_id: 'r1', permission_id: 'p1' },
      });
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenWeb />);
      expect(getByTestId('role-permission-detail-offline-banner')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      useRolePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        roleLabel: 'Admin',
        permissionLabel: 'Manage users',
        tenantLabel: 'Main tenant',
        rolePermission: {
          id: 'rp-1',
          role_id: 'r1',
          permission_id: 'p1',
        },
      });
      const { getByTestId } = renderWithTheme(<RolePermissionDetailScreenWeb />);
      expect(getByTestId('role-permission-detail-back')).toBeTruthy();
      expect(getByTestId('role-permission-detail-edit')).toBeTruthy();
      expect(getByTestId('role-permission-detail-delete')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(RolePermissionDetailScreenIndex.default).toBeDefined();
      expect(RolePermissionDetailScreenIndex.useRolePermissionDetailScreen).toBeDefined();
    });
  });
});

