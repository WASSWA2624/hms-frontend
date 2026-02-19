/**
 * UserMfaDetailScreen Component Tests
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UserMfaDetailScreen/useUserMfaDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserMfaDetailScreen = require('@platform/screens/settings/UserMfaDetailScreen/useUserMfaDetailScreen').default;
const UserMfaDetailScreenWeb = require('@platform/screens/settings/UserMfaDetailScreen/UserMfaDetailScreen.web').default;
const UserMfaDetailScreenAndroid = require('@platform/screens/settings/UserMfaDetailScreen/UserMfaDetailScreen.android').default;
const UserMfaDetailScreenIOS = require('@platform/screens/settings/UserMfaDetailScreen/UserMfaDetailScreen.ios').default;
const UserMfaDetailScreenIndex = require('@platform/screens/settings/UserMfaDetailScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const baseHook = {
  id: 'mfa-1',
  userMfa: null,
  mfaLabel: '',
  userLabel: '',
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: true,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('UserMfaDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key, locale: 'en' });
    useUserMfaDetailScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error on all platforms', () => {
    const web = renderWithTheme(<UserMfaDetailScreenWeb />);
    expect(web.getByTestId('user-mfa-detail-not-found')).toBeTruthy();

    const android = renderWithTheme(<UserMfaDetailScreenAndroid />);
    expect(android.getByTestId('user-mfa-detail-not-found')).toBeTruthy();

    const ios = renderWithTheme(<UserMfaDetailScreenIOS />);
    expect(ios.getByTestId('user-mfa-detail-not-found')).toBeTruthy();
  });

  it('shows loading state', () => {
    useUserMfaDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<UserMfaDetailScreenWeb />);
    expect(getByTestId('user-mfa-detail-loading')).toBeTruthy();
  });

  it('shows error state', () => {
    useUserMfaDetailScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Unable to load',
    });
    const { getByTestId } = renderWithTheme(<UserMfaDetailScreenWeb />);
    expect(getByTestId('user-mfa-detail-error')).toBeTruthy();
  });

  it('shows offline state', () => {
    useUserMfaDetailScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<UserMfaDetailScreenWeb />);
    expect(getByTestId('user-mfa-detail-offline')).toBeTruthy();
  });

  it('renders detail values and action controls', () => {
    useUserMfaDetailScreen.mockReturnValue({
      ...baseHook,
      userMfa: {
        id: 'mfa-1',
        user_id: 'user-1',
        channel: 'EMAIL',
        is_enabled: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      },
      mfaLabel: 'MFA-001',
      userLabel: 'Alice Johnson',
    });

    const { getByTestId } = renderWithTheme(<UserMfaDetailScreenWeb />);
    expect(getByTestId('user-mfa-detail-card')).toBeTruthy();
    expect(getByTestId('user-mfa-detail-id')).toBeTruthy();
    expect(getByTestId('user-mfa-detail-user')).toBeTruthy();
    expect(getByTestId('user-mfa-detail-channel')).toBeTruthy();
    expect(getByTestId('user-mfa-detail-enabled')).toBeTruthy();
    expect(getByTestId('user-mfa-detail-edit')).toBeTruthy();
    expect(getByTestId('user-mfa-detail-delete')).toBeTruthy();
  });

  it('shows inline error/offline banners when record exists', () => {
    useUserMfaDetailScreen.mockReturnValue({
      ...baseHook,
      userMfa: { id: 'mfa-1', user_id: 'user-1', channel: 'EMAIL', is_enabled: true },
      hasError: true,
      isOffline: true,
      errorMessage: 'Failed',
    });

    const { getByTestId } = renderWithTheme(<UserMfaDetailScreenWeb />);
    expect(getByTestId('user-mfa-detail-error-banner')).toBeTruthy();
    expect(getByTestId('user-mfa-detail-offline-banner')).toBeTruthy();
  });

  it('exports component and hook from index', () => {
    expect(UserMfaDetailScreenIndex.default).toBeDefined();
    expect(UserMfaDetailScreenIndex.useUserMfaDetailScreen).toBeDefined();
  });
});
