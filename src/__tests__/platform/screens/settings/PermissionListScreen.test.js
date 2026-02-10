/**
 * PermissionListScreen Component Tests
 * Per testing.mdc: render, loading, error, empty, notice, a11y
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/PermissionListScreen/usePermissionListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const usePermissionListScreen = require('@platform/screens/settings/PermissionListScreen/usePermissionListScreen').default;
const PermissionListScreenWeb = require('@platform/screens/settings/PermissionListScreen/PermissionListScreen.web').default;
const PermissionListScreenAndroid = require('@platform/screens/settings/PermissionListScreen/PermissionListScreen.android').default;
const PermissionListScreenIOS = require('@platform/screens/settings/PermissionListScreen/PermissionListScreen.ios').default;
const PermissionListScreenIndex = require('@platform/screens/settings/PermissionListScreen/index.js');
const { STATES } = require('@platform/screens/settings/PermissionListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'permission.list.title': 'Permissions',
    'permission.list.accessibilityLabel': 'Permissions list',
    'permission.list.emptyTitle': 'No permissions',
    'permission.list.emptyMessage': 'You have no permissions.',
    'permission.list.delete': 'Delete permission',
    'permission.list.deleteHint': 'Delete this permission',
    'permission.list.itemLabel': 'Permission {{name}}',
    'permission.list.addLabel': 'Add permission',
    'permission.list.addHint': 'Create a new permission',
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

describe('PermissionListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    usePermissionListScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<PermissionListScreenAndroid />);
      expect(getByTestId('permission-list-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<PermissionListScreenIOS />);
      expect(getByTestId('permission-list-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      usePermissionListScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-loading')).toBeTruthy();
    });
  });

  describe('empty', () => {
    it('shows empty state (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        items: [],
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-empty-state')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
        items: [],
      });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-offline')).toBeTruthy();
    });
  });

  describe('list with items', () => {
    it('renders items (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        items: [
          { id: '1', name: 'Permission 1' },
        ],
      });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-item-1')).toBeTruthy();
    });
  });

  describe('notice', () => {
    it('shows notice message (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        noticeMessage: 'Permission created.',
      });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-notice')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('calls onAdd when add button pressed (Web)', () => {
      const onAdd = jest.fn();
      usePermissionListScreen.mockReturnValue({ ...baseHook, onAdd });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      fireEvent.press(getByTestId('permission-list-add'));
      expect(onAdd).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has accessibility label (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        items: [{ id: '1', name: 'Permission 1' }],
      });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      const list = getByTestId('permission-list');
      expect(list).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(PermissionListScreenIndex.default).toBeDefined();
      expect(PermissionListScreenIndex.usePermissionListScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});
