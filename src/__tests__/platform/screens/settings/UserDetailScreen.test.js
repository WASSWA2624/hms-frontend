/**
 * UserDetailScreen Component Tests
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

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const mockT = (key) => {
  const dictionary = {
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
    'user.list.currentTenant': 'Current tenant',
    'user.list.currentFacility': 'Current facility',
    'common.loading': 'Loading',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.back': 'Back',
    'common.remove': 'Remove',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return dictionary[key] || key;
};

const baseHook = {
  id: 'u1',
  user: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('UserDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT, locale: 'en-US' });
    useUserDetailScreen.mockReturnValue({ ...baseHook });
  });

  it('renders base states across platforms', () => {
    expect(renderWithTheme(<UserDetailScreenWeb />).getByTestId('user-detail-not-found')).toBeTruthy();
    expect(renderWithTheme(<UserDetailScreenAndroid />).getByTestId('user-detail-not-found')).toBeTruthy();
    expect(renderWithTheme(<UserDetailScreenIOS />).getByTestId('user-detail-not-found')).toBeTruthy();
  });

  it('shows loading/error/offline states on web', () => {
    useUserDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
    expect(renderWithTheme(<UserDetailScreenWeb />).getByTestId('user-detail-loading')).toBeTruthy();

    useUserDetailScreen.mockReturnValue({ ...baseHook, hasError: true, errorMessage: 'failed' });
    expect(renderWithTheme(<UserDetailScreenWeb />).getByTestId('user-detail-error')).toBeTruthy();

    useUserDetailScreen.mockReturnValue({ ...baseHook, isOffline: true });
    expect(renderWithTheme(<UserDetailScreenWeb />).getByTestId('user-detail-offline')).toBeTruthy();
  });

  it('renders user details with human-readable context by default', () => {
    useUserDetailScreen.mockReturnValue({
      ...baseHook,
      user: {
        id: 'u1',
        tenant_name: 'Acme Tenant',
        facility_name: 'Main Facility',
        email: 'user@acme.org',
        phone: '+15551234567',
        status: 'ACTIVE',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      },
    });
    const { getByTestId, queryByTestId } = renderWithTheme(<UserDetailScreenWeb />);
    expect(getByTestId('user-detail-tenant')).toBeTruthy();
    expect(getByTestId('user-detail-facility')).toBeTruthy();
    expect(getByTestId('user-detail-email')).toBeTruthy();
    expect(getByTestId('user-detail-phone')).toBeTruthy();
    expect(getByTestId('user-detail-status')).toBeTruthy();
    expect(queryByTestId('user-detail-id')).toBeNull();
  });

  it('shows technical id for privileged users', () => {
    useUserDetailScreen.mockReturnValue({
      ...baseHook,
      canViewTechnicalIds: true,
      user: { id: 'u1', email: 'user@acme.org', status: 'ACTIVE' },
    });
    expect(renderWithTheme(<UserDetailScreenWeb />).getByTestId('user-detail-id')).toBeTruthy();
  });

  it('shows inline banners when data exists but state is degraded', () => {
    useUserDetailScreen.mockReturnValue({
      ...baseHook,
      user: { id: 'u1', email: 'user@acme.org', status: 'ACTIVE' },
      hasError: true,
      errorMessage: 'failed',
    });
    expect(renderWithTheme(<UserDetailScreenWeb />).getByTestId('user-detail-error-banner')).toBeTruthy();

    useUserDetailScreen.mockReturnValue({
      ...baseHook,
      user: { id: 'u1', email: 'user@acme.org', status: 'ACTIVE' },
      isOffline: true,
    });
    expect(renderWithTheme(<UserDetailScreenWeb />).getByTestId('user-detail-offline-banner')).toBeTruthy();
  });

  it('exports component, hook, and states contract', () => {
    expect(UserDetailScreenIndex.default).toBeDefined();
    expect(UserDetailScreenIndex.useUserDetailScreen).toBeDefined();
    expect(STATES.READY).toBe('ready');
  });
});
