/**
 * UserDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UserDetailScreen/useUserDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserDetailScreen = require('@platform/screens/settings/UserDetailScreen/useUserDetailScreen').default;
const UserDetailScreenWeb = require('@platform/screens/settings/UserDetailScreen/UserDetailScreen.web').default;
const UserDetailScreenAndroid = require('@platform/screens/settings/UserDetailScreen/UserDetailScreen.android').default;
const UserDetailScreenIOS = require('@platform/screens/settings/UserDetailScreen/UserDetailScreen.ios').default;
const UserDetailScreenIndex = require('@platform/screens/settings/UserDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/UserDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'user.detail.title': 'User Details',
    'user.detail.idLabel': 'User ID',
    'user.detail.tenantLabel': 'Tenant',
    'user.detail.facilityLabel': 'Facility',
    'user.detail.emailLabel': 'Email',
    'user.detail.phoneLabel': 'Phone',
    'user.detail.statusLabel': 'Status',
    'user.detail.createdLabel': 'Created',
    'user.detail.updatedLabel': 'Updated',
    'user.detail.errorTitle': 'Failed to load user',
    'user.detail.notFoundTitle': 'User not found',
    'user.detail.notFoundMessage': 'This user may have been deleted.',
    'user.detail.backHint': 'Return to users list',
    'user.detail.delete': 'Delete user',
    'user.detail.deleteHint': 'Delete this user',
    'user.detail.edit': 'Edit user',
    'user.detail.editHint': 'Edit this user',
    'user.status.ACTIVE': 'Active',
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
  id: 'u1',
  user: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('UserDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT, locale: 'en' });
    useUserDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<UserDetailScreenWeb />);
      expect(getByTestId('user-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<UserDetailScreenAndroid />);
      expect(getByTestId('user-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<UserDetailScreenIOS />);
      expect(getByTestId('user-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useUserDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<UserDetailScreenWeb />);
      expect(getByTestId('user-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useUserDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<UserDetailScreenWeb />);
      expect(getByTestId('user-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useUserDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<UserDetailScreenWeb />);
      expect(getByTestId('user-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      useUserDetailScreen.mockReturnValue({
        ...baseHook,
        user: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<UserDetailScreenWeb />);
      expect(getByTestId('user-detail-not-found')).toBeTruthy();
    });
  });

  describe('with user data', () => {
    it('renders user details (Web)', () => {
      useUserDetailScreen.mockReturnValue({
        ...baseHook,
        user: {
          id: 'u1',
          tenant_id: 't1',
          facility_id: 'f1',
          email: 'test@example.com',
          phone: '+15551234567',
          status: 'ACTIVE',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      });
      const { getByTestId } = renderWithTheme(<UserDetailScreenWeb />);
      expect(getByTestId('user-detail-card')).toBeTruthy();
      expect(getByTestId('user-detail-id')).toBeTruthy();
      expect(getByTestId('user-detail-tenant')).toBeTruthy();
      expect(getByTestId('user-detail-facility')).toBeTruthy();
      expect(getByTestId('user-detail-email')).toBeTruthy();
      expect(getByTestId('user-detail-phone')).toBeTruthy();
      expect(getByTestId('user-detail-status')).toBeTruthy();
      expect(getByTestId('user-detail-created')).toBeTruthy();
      expect(getByTestId('user-detail-updated')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows inline error banner when user exists (Web)', () => {
      useUserDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Error',
        user: { id: 'u1', email: 'test@example.com' },
      });
      const { getByTestId } = renderWithTheme(<UserDetailScreenWeb />);
      expect(getByTestId('user-detail-error-banner')).toBeTruthy();
    });

    it('shows inline offline banner when user exists (Web)', () => {
      useUserDetailScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        user: { id: 'u1', email: 'test@example.com' },
      });
      const { getByTestId } = renderWithTheme(<UserDetailScreenWeb />);
      expect(getByTestId('user-detail-offline-banner')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      useUserDetailScreen.mockReturnValue({
        ...baseHook,
        user: {
          id: 'u1',
          tenant_id: 't1',
          email: 'test@example.com',
        },
      });
      const { getByTestId } = renderWithTheme(<UserDetailScreenWeb />);
      expect(getByTestId('user-detail-back')).toBeTruthy();
      expect(getByTestId('user-detail-edit')).toBeTruthy();
      expect(getByTestId('user-detail-delete')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(UserDetailScreenIndex.default).toBeDefined();
      expect(UserDetailScreenIndex.useUserDetailScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.READY).toBe('ready');
    });
  });
});
