/**
 * Root Index Route Tests
 * Index redirects to /home so the app opens on the home page.
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn(), back: jest.fn() }),
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

  it('should redirect to /home so app opens on home page', () => {
    const IndexRoute = require('../../app/index').default;
    renderWithTheme(<IndexRoute />);
    expect(mockReplace).toHaveBeenCalledWith('/home');
  });

  it('should use default export', () => {
    const mod = require('../../app/index');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
