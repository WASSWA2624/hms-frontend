/**
 * Root Index Route Tests
 * Startup redirect flow:
 * - First launch -> /welcome
 * - Returning + persistent session -> last route (fallback: /dashboard)
 * - Otherwise -> /welcome
 */
const React = require('react');
const { render, waitFor } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn(), back: jest.fn() }),
}));

const mockGetLastRoute = jest.fn();
jest.mock('@navigation/routePersistence', () => ({
  DEFAULT_HOME_ROUTE: '/dashboard',
  getLastRoute: (...args) => mockGetLastRoute(...args),
}));

const mockStorageGetItem = jest.fn();
const mockStorageSetItem = jest.fn();
jest.mock('@services/storage', () => ({
  async: {
    getItem: (...args) => mockStorageGetItem(...args),
    setItem: (...args) => mockStorageSetItem(...args),
  },
}));

const mockGetAccessToken = jest.fn();
const mockGetRefreshToken = jest.fn();
const mockClearTokens = jest.fn();
const mockIsTokenExpired = jest.fn();
jest.mock('@security', () => ({
  tokenManager: {
    getAccessToken: (...args) => mockGetAccessToken(...args),
    getRefreshToken: (...args) => mockGetRefreshToken(...args),
    clearTokens: (...args) => mockClearTokens(...args),
    isTokenExpired: (...args) => mockIsTokenExpired(...args),
  },
}));

const mockLoadCurrentUser = jest.fn();
const mockRefreshSession = jest.fn();
const mockClearAuth = jest.fn();
jest.mock('@store/slices/auth.slice', () => ({
  actions: {
    loadCurrentUser: (...args) => mockLoadCurrentUser(...args),
    refreshSession: (...args) => mockRefreshSession(...args),
    clearAuth: (...args) => mockClearAuth(...args),
  },
}));

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (dispatchImpl) => ({
  getState: () => ({}),
  subscribe: () => () => {},
  dispatch: dispatchImpl || ((action) => action),
});

const renderWithTheme = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('Index Route (index.jsx)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageSetItem.mockResolvedValue(true);
    mockGetAccessToken.mockResolvedValue(null);
    mockGetRefreshToken.mockResolvedValue(null);
    mockClearTokens.mockResolvedValue(true);
    mockIsTokenExpired.mockReturnValue(true);
    mockLoadCurrentUser.mockReturnValue({ type: 'auth/loadCurrentUser/fulfilled', payload: { id: 'u1' } });
    mockRefreshSession.mockReturnValue({ type: 'auth/refresh/fulfilled', payload: { ok: true } });
    mockClearAuth.mockReturnValue({ type: 'auth/clearAuth' });
  });

  it('redirects first-time users to /welcome', async () => {
    mockStorageGetItem.mockResolvedValue(null);

    const IndexRoute = require('../../app/index').default;
    renderWithTheme(<IndexRoute />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/welcome');
    });

    expect(mockStorageSetItem).toHaveBeenCalledWith('hms.app.first_launch_completed', true);
  });

  it('redirects returning users with persistent valid session to last route', async () => {
    mockStorageGetItem.mockResolvedValue(true);
    mockGetAccessToken.mockResolvedValue('valid-access-token');
    mockGetRefreshToken.mockResolvedValue('refresh-token');
    mockIsTokenExpired.mockReturnValue(false);
    mockGetLastRoute.mockResolvedValue('/settings');

    const IndexRoute = require('../../app/index').default;
    renderWithTheme(<IndexRoute />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/settings');
    });

    expect(mockLoadCurrentUser).toHaveBeenCalled();
  });

  it('falls back to /dashboard when last route is missing and session is restored', async () => {
    mockStorageGetItem.mockResolvedValue(true);
    mockGetAccessToken.mockResolvedValue('valid-access-token');
    mockGetRefreshToken.mockResolvedValue('refresh-token');
    mockIsTokenExpired.mockReturnValue(false);
    mockGetLastRoute.mockResolvedValue(null);

    const IndexRoute = require('../../app/index').default;
    renderWithTheme(<IndexRoute />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('redirects returning users without stored tokens to /welcome', async () => {
    mockStorageGetItem.mockResolvedValue(true);
    mockGetAccessToken.mockResolvedValue(null);
    mockGetRefreshToken.mockResolvedValue(null);

    const dispatch = jest.fn((action) => action);
    const store = createMockStore(dispatch);

    const IndexRoute = require('../../app/index').default;
    renderWithTheme(<IndexRoute />, store);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/welcome');
    });

    expect(mockClearAuth).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: 'auth/clearAuth' });
  });

  it('redirects to /welcome when persistent tokens exist but session restore fails', async () => {
    mockStorageGetItem.mockResolvedValue(true);
    mockGetAccessToken.mockResolvedValue('expired-access-token');
    mockGetRefreshToken.mockResolvedValue('refresh-token');
    mockIsTokenExpired.mockReturnValue(true);
    mockRefreshSession.mockReturnValue({ type: 'auth/refresh/rejected', payload: null });

    const dispatch = jest.fn((action) => action);
    const store = createMockStore(dispatch);

    const IndexRoute = require('../../app/index').default;
    renderWithTheme(<IndexRoute />, store);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/welcome');
    });

    expect(mockClearTokens).toHaveBeenCalled();
    expect(mockClearAuth).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: 'auth/clearAuth' });
  });

  it('uses default export', () => {
    const mod = require('../../app/index');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
