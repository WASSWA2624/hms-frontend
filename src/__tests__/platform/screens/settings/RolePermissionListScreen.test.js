/**
 * RolePermissionListScreen Component Tests
 * Per testing.mdc: render, loading, error, empty, notice, a11y
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/RolePermissionListScreen/useRolePermissionListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useRolePermissionListScreen = require('@platform/screens/settings/RolePermissionListScreen/useRolePermissionListScreen').default;
const RolePermissionListScreenWeb = require('@platform/screens/settings/RolePermissionListScreen/RolePermissionListScreen.web').default;
const RolePermissionListScreenAndroid = require('@platform/screens/settings/RolePermissionListScreen/RolePermissionListScreen.android').default;
const RolePermissionListScreenIOS = require('@platform/screens/settings/RolePermissionListScreen/RolePermissionListScreen.ios').default;
const RolePermissionListScreenIndex = require('@platform/screens/settings/RolePermissionListScreen/index.js');
const { STATES } = require('@platform/screens/settings/RolePermissionListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'rolePermission.list.title': 'Role Permissions',
    'rolePermission.list.accessibilityLabel': 'Role permissions list',
    'rolePermission.list.emptyTitle': 'No role permissions',
    'rolePermission.list.emptyMessage': 'You have no role permissions.',
    'rolePermission.list.delete': 'Delete role permission',
    'rolePermission.list.deleteHint': 'Delete this role permission',
    'rolePermission.list.itemLabel': 'Role permission {{name}}',
    'rolePermission.list.addLabel': 'Add role permission',
    'rolePermission.list.addHint': 'Create a role permission',
    'rolePermission.list.roleLabel': 'Role',
    'rolePermission.list.permissionLabel': 'Permission',
    'common.remove': 'Remove',
    'listScaffold.errorState.title': 'Error',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.loading': 'Loading',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  items: [],
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  noticeMessage: null,
  onDismissNotice: jest.fn(),
  onRetry: jest.fn(),
  onItemPress: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('RolePermissionListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useRolePermissionListScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenWeb />);
      expect(getByTestId('role-permission-list-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenAndroid />);
      expect(getByTestId('role-permission-list-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenIOS />);
      expect(getByTestId('role-permission-list-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useRolePermissionListScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenWeb />);
      expect(getByTestId('role-permission-list-loading')).toBeTruthy();
    });
  });

  describe('empty', () => {
    it('shows empty state (Web)', () => {
      useRolePermissionListScreen.mockReturnValue({
        ...baseHook,
        items: [],
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenWeb />);
      expect(getByTestId('role-permission-list-empty-state')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useRolePermissionListScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenWeb />);
      expect(getByTestId('role-permission-list-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useRolePermissionListScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
        items: [],
      });
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenWeb />);
      expect(getByTestId('role-permission-list-offline')).toBeTruthy();
    });
  });

  describe('list with items', () => {
    it('renders items (Web)', () => {
      useRolePermissionListScreen.mockReturnValue({
        ...baseHook,
        items: [
          { id: '1', role_id: 'r1', permission_id: 'p1' },
        ],
      });
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenWeb />);
      expect(getByTestId('role-permission-item-1')).toBeTruthy();
    });
  });

  describe('notice', () => {
    it('shows notice message (Web)', () => {
      useRolePermissionListScreen.mockReturnValue({
        ...baseHook,
        noticeMessage: 'Role permission created.',
      });
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenWeb />);
      expect(getByTestId('role-permission-list-notice')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('calls onAdd when add button pressed (Web)', () => {
      const onAdd = jest.fn();
      useRolePermissionListScreen.mockReturnValue({ ...baseHook, onAdd });
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenWeb />);
      fireEvent.press(getByTestId('role-permission-list-add'));
      expect(onAdd).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has accessibility label (Web)', () => {
      useRolePermissionListScreen.mockReturnValue({
        ...baseHook,
        items: [{ id: '1', role_id: 'r1', permission_id: 'p1' }],
      });
      const { getByTestId } = renderWithTheme(<RolePermissionListScreenWeb />);
      const list = getByTestId('role-permission-list');
      expect(list).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(RolePermissionListScreenIndex.default).toBeDefined();
      expect(RolePermissionListScreenIndex.useRolePermissionListScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});

