/**
 * Root Index Route Tests
 * Index redirects to last route (fallback: /dashboard).
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

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');
const createMockStore = () => ({
  getState: () => ({}),
  subscribe: () => () => {},
  dispatch: () => {},
});

const renderWithTheme = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('Index Route (index.jsx)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should redirect to /dashboard when no last route is stored', async () => {
    mockGetLastRoute.mockResolvedValue(null);
    const IndexRoute = require('../../app/index').default;
    renderWithTheme(<IndexRoute />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should redirect to last stored route when available', async () => {
    mockGetLastRoute.mockResolvedValue('/settings');
    const IndexRoute = require('../../app/index').default;
    renderWithTheme(<IndexRoute />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/settings');
    });
  });

  it('should use default export', () => {
    const mod = require('../../app/index');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
