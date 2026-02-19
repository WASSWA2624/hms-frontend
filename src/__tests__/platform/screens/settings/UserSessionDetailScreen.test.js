/**
 * UserSessionDetailScreen Component Tests
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UserSessionDetailScreen/useUserSessionDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserSessionDetailScreen = require('@platform/screens/settings/UserSessionDetailScreen/useUserSessionDetailScreen').default;
const UserSessionDetailScreenWeb = require('@platform/screens/settings/UserSessionDetailScreen/UserSessionDetailScreen.web').default;
const UserSessionDetailScreenAndroid = require('@platform/screens/settings/UserSessionDetailScreen/UserSessionDetailScreen.android').default;
const UserSessionDetailScreenIOS = require('@platform/screens/settings/UserSessionDetailScreen/UserSessionDetailScreen.ios').default;
const UserSessionDetailScreenIndex = require('@platform/screens/settings/UserSessionDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/UserSessionDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const baseHook = {
  id: 'session-1',
  session: null,
  sessionLabel: 'Session',
  userLabel: 'User',
  statusLabel: 'Active',
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: true,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: undefined,
  onDelete: undefined,
};

describe('UserSessionDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key, locale: 'en' });
    useUserSessionDetailScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Web)', () => {
    const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
    expect(getByTestId('user-session-detail-not-found')).toBeTruthy();
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<UserSessionDetailScreenAndroid />);
    expect(getByTestId('user-session-detail-not-found')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<UserSessionDetailScreenIOS />);
    expect(getByTestId('user-session-detail-not-found')).toBeTruthy();
  });

  it('shows loading state (Web)', () => {
    useUserSessionDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
    expect(getByTestId('user-session-detail-loading')).toBeTruthy();
  });

  it('shows error state (Web)', () => {
    useUserSessionDetailScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Unable to load',
    });
    const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
    expect(getByTestId('user-session-detail-error')).toBeTruthy();
  });

  it('shows offline state (Web)', () => {
    useUserSessionDetailScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
    expect(getByTestId('user-session-detail-offline')).toBeTruthy();
  });

  it('renders session details for privileged users (Web)', () => {
    useUserSessionDetailScreen.mockReturnValue({
      ...baseHook,
      canViewTechnicalIds: true,
      sessionLabel: 'Primary Session',
      userLabel: 'Alice Johnson',
      statusLabel: 'Active',
      session: {
        id: 'session-1',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2025-12-31T00:00:00Z',
        revoked_at: null,
      },
    });

    const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);

    expect(getByTestId('user-session-detail-card')).toBeTruthy();
    expect(getByTestId('user-session-detail-id')).toBeTruthy();
    expect(getByTestId('user-session-detail-session')).toBeTruthy();
    expect(getByTestId('user-session-detail-user')).toBeTruthy();
    expect(getByTestId('user-session-detail-status')).toBeTruthy();
    expect(getByTestId('user-session-detail-started')).toBeTruthy();
    expect(getByTestId('user-session-detail-expires')).toBeTruthy();
  });

  it('hides technical ID for standard users (Web)', () => {
    useUserSessionDetailScreen.mockReturnValue({
      ...baseHook,
      canViewTechnicalIds: false,
      sessionLabel: 'userSession.detail.currentSessionLabel',
      userLabel: 'userSession.detail.currentUserLabel',
      session: {
        id: '8f4fd148-2502-4edb-bf1d-c1f5c66182fd',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2025-12-31T00:00:00Z',
      },
    });

    const { queryByTestId, getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);

    expect(queryByTestId('user-session-detail-id')).toBeNull();
    expect(getByTestId('user-session-detail-session')).toBeTruthy();
    expect(getByTestId('user-session-detail-user')).toBeTruthy();
  });

  it('shows inline error banner when record exists (Web)', () => {
    useUserSessionDetailScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Error',
      session: {
        id: 'session-1',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2025-12-31T00:00:00Z',
      },
    });

    const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
    expect(getByTestId('user-session-detail-error-banner')).toBeTruthy();
  });

  it('shows inline offline banner when record exists (Web)', () => {
    useUserSessionDetailScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      session: {
        id: 'session-1',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2025-12-31T00:00:00Z',
      },
    });

    const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
    expect(getByTestId('user-session-detail-offline-banner')).toBeTruthy();
  });

  it('keeps read-only actions (back only)', () => {
    useUserSessionDetailScreen.mockReturnValue({
      ...baseHook,
      session: {
        id: 'session-1',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2025-12-31T00:00:00Z',
      },
      onEdit: undefined,
      onDelete: undefined,
    });

    const { getByTestId, queryByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
    expect(getByTestId('user-session-detail-back')).toBeTruthy();
    expect(queryByTestId('user-session-detail-edit')).toBeNull();
    expect(queryByTestId('user-session-detail-delete')).toBeNull();
  });

  it('exports component and hook from index', () => {
    expect(UserSessionDetailScreenIndex.default).toBeDefined();
    expect(UserSessionDetailScreenIndex.useUserSessionDetailScreen).toBeDefined();
    expect(STATES.READY).toBe('ready');
  });
});
