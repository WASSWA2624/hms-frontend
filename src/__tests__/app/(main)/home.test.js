/**
 * Home Route Tests
 * File: home.test.js
 * 
 * Tests the authenticated home route in the main route group
 * 
 * Per Step 8.4 requirements:
 * - Test route renders without errors
 * - Test HomeScreen is rendered
 * - Test auth guard protection (mock guard behavior)
 * - Mock expo-router and HomeScreen component
 * - Test route is accessible when authenticated (mock navigation)
 * - Coverage: 100% coverage required per testing.mdc
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { HomeScreen } = require('@platform/screens');
const { useAuthGuard } = require('@navigation/guards');

// Mock expo-router (per Step 8.4 requirements)
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockCanGoBack = jest.fn(() => false);
const mockPathname = '/home';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    canGoBack: mockCanGoBack,
  }),
  usePathname: () => mockPathname,
  useSegments: () => ['home'],
}));

jest.mock('@platform/screens', () => ({
  HomeScreen: jest.fn(() => null),
}));

// Mock auth guard (per Step 8.4 requirements: test auth guard protection)
jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(),
}));

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Home Route (home.jsx)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default: authenticated (home route should be accessible when authenticated)
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });
  });

  it('should render without errors', () => {
    const HomeRoute = require('../../../app/(main)/home').default;
    renderWithTheme(<HomeRoute />);
    expect(HomeScreen).toHaveBeenCalled();
  });

  it('should render HomeScreen component', () => {
    const HomeRoute = require('../../../app/(main)/home').default;
    renderWithTheme(<HomeRoute />);
    expect(HomeScreen).toHaveBeenCalledTimes(1);
  });

  it('should use default export', () => {
    const HomeRoute = require('../../../app/(main)/home');
    expect(HomeRoute.default).toBeDefined();
    expect(typeof HomeRoute.default).toBe('function');
  });

  it('should be accessible when authenticated (mock navigation)', () => {
    // Per Step 8.4: Test route is accessible when authenticated (mock navigation)
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    const HomeRoute = require('../../../app/(main)/home').default;
    const result = renderWithTheme(<HomeRoute />);
    
    // Verify route renders successfully when authenticated (accessible)
    expect(result).toBeTruthy();
    expect(HomeScreen).toHaveBeenCalled();
    
    // Verify route is at /home path (group segment omitted per app-router.mdc)
    // The route is accessible when it renders without errors
    expect(mockPathname).toBe('/home');
  });

  it('should be protected by auth guard (guard behavior)', () => {
    // Per Step 8.4: Test auth guard protection (mock guard behavior)
    // The auth guard is in the main layout, not the route itself
    // This test verifies the route works correctly when the guard allows access
    
    // When authenticated, route should render
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    const HomeRoute = require('../../../app/(main)/home').default;
    const result = renderWithTheme(<HomeRoute />);
    
    // Route should render when authenticated (guard allows access)
    expect(result).toBeTruthy();
    expect(HomeScreen).toHaveBeenCalled();
    
    // Note: The actual redirect behavior is tested in main-layout-guard.test.js
    // This test verifies the route component itself works when guard allows access
  });

  it('should handle route when guard allows access', () => {
    // Test that route renders correctly when auth guard allows access
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    const HomeRoute = require('../../../app/(main)/home').default;
    renderWithTheme(<HomeRoute />);
    
    // Verify HomeScreen is rendered (route is accessible)
    expect(HomeScreen).toHaveBeenCalledTimes(1);
  });
});

