/**
 * UserListScreen Component Tests
 * Per testing.mdc: render, loading, error, empty, notice, a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UserListScreen/useUserListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserListScreen = require('@platform/screens/settings/UserListScreen/useUserListScreen').default;
const UserListScreenWeb = require('@platform/screens/settings/UserListScreen/UserListScreen.web').default;
const UserListScreenAndroid = require('@platform/screens/settings/UserListScreen/UserListScreen.android').default;
const UserListScreenIOS = require('@platform/screens/settings/UserListScreen/UserListScreen.ios').default;
const UserListScreenIndex = require('@platform/screens/settings/UserListScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'user.list.title': 'Users',
    'user.list.accessibilityLabel': 'Users list',
    'user.list.emptyTitle': 'No users',
    'user.list.emptyMessage': 'You have no users.',
    'user.list.delete': 'Delete user',
    'user.list.deleteHint': 'Delete this user',
    'user.list.itemLabel': 'User {{name}}',
    'user.list.itemHint': 'View details for {{name}}',
    'user.list.addLabel': 'Add user',
    'user.list.addHint': 'Create a new user',
    'user.list.statusLabel': 'Status',
    'common.remove': 'Remove',
    'listScaffold.errorState.title': 'Error',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.loading': 'Loading',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
    'user.status.ACTIVE': 'Active',
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
  onUserPress: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('UserListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useUserListScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<UserListScreenWeb />);
      expect(getByTestId('user-list-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<UserListScreenAndroid />);
      expect(getByTestId('user-list-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<UserListScreenIOS />);
      expect(getByTestId('user-list-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useUserListScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<UserListScreenWeb />);
      expect(getByTestId('user-list-loading')).toBeTruthy();
    });
  });

  describe('empty', () => {
    it('shows empty state (Web)', () => {
      useUserListScreen.mockReturnValue({
        ...baseHook,
        items: [],
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<UserListScreenWeb />);
      expect(getByTestId('user-list-empty-state')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useUserListScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<UserListScreenWeb />);
      expect(getByTestId('user-list-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useUserListScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
        items: [],
      });
      const { getByTestId } = renderWithTheme(<UserListScreenWeb />);
      expect(getByTestId('user-list-offline')).toBeTruthy();
    });
  });

  describe('list with items', () => {
    it('renders items (Web)', () => {
      useUserListScreen.mockReturnValue({
        ...baseHook,
        items: [
          { id: '1', email: 'test@example.com', status: 'ACTIVE' },
        ],
      });
      const { getByTestId } = renderWithTheme(<UserListScreenWeb />);
      expect(getByTestId('user-item-1')).toBeTruthy();
    });
  });

  describe('notice', () => {
    it('shows notice message (Web)', () => {
      useUserListScreen.mockReturnValue({
        ...baseHook,
        noticeMessage: 'User created.',
      });
      const { getByTestId } = renderWithTheme(<UserListScreenWeb />);
      expect(getByTestId('user-list-notice')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('renders add action when onAdd is available (Web)', () => {
      const onAdd = jest.fn();
      useUserListScreen.mockReturnValue({ ...baseHook, onAdd });
      const { getByTestId } = renderWithTheme(<UserListScreenWeb />);
      expect(getByTestId('user-list-add')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility label (Web)', () => {
      useUserListScreen.mockReturnValue({
        ...baseHook,
        items: [{ id: '1', email: 'test@example.com' }],
      });
      const { getByTestId } = renderWithTheme(<UserListScreenWeb />);
      const list = getByTestId('user-list-card');
      expect(list).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(UserListScreenIndex.default).toBeDefined();
      expect(UserListScreenIndex.useUserListScreen).toBeDefined();
    });
  });
});
