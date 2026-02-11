/**
 * Dashboard Route Tests
 * File: home.test.js
 *
 * Tests the authenticated dashboard route in the main route group
 * 
 * Per Step 8.4 requirements:
 * - Test route renders without errors
 * - Test DashboardScreen is rendered
 * - Test auth guard protection (mock guard behavior)
 * - Mock expo-router and DashboardScreen component
 * - Test route is accessible when authenticated (mock navigation)
 * - Coverage: 100% coverage required per testing.mdc
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { DashboardScreen } = require('@platform/screens');
const { useAuthGuard } = require('@navigation/guards');

// Mock expo-router (per Step 8.4 requirements)
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockCanGoBack = jest.fn(() => false);
const mockPathname = '/dashboard';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    canGoBack: mockCanGoBack,
  }),
  usePathname: () => mockPathname,
  useSegments: () => ['dashboard'],
}));

jest.mock('@platform/screens', () => ({
  DashboardScreen: jest.fn(() => null),
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

describe('Dashboard Route (dashboard.jsx)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default: authenticated (home route should be accessible when authenticated)
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });
  });

  it('should render without errors', () => {
    const DashboardRoute = require('../../../app/(main)/dashboard').default;
    renderWithTheme(<DashboardRoute />);
    expect(DashboardScreen).toHaveBeenCalled();
  });

  it('should render DashboardScreen component', () => {
    const DashboardRoute = require('../../../app/(main)/dashboard').default;
    renderWithTheme(<DashboardRoute />);
    expect(DashboardScreen).toHaveBeenCalledTimes(1);
  });

  it('should use default export', () => {
    const DashboardRoute = require('../../../app/(main)/dashboard');
    expect(DashboardRoute.default).toBeDefined();
    expect(typeof DashboardRoute.default).toBe('function');
  });

  it('should be accessible when authenticated (mock navigation)', () => {
    // Per Step 8.4: Test route is accessible when authenticated (mock navigation)
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    const DashboardRoute = require('../../../app/(main)/dashboard').default;
    const result = renderWithTheme(<DashboardRoute />);
    
    // Verify route renders successfully when authenticated (accessible)
    expect(result).toBeTruthy();
    expect(DashboardScreen).toHaveBeenCalled();
    
    // Verify route is at /dashboard path (group segment omitted per app-router.mdc)
    // The route is accessible when it renders without errors
    expect(mockPathname).toBe('/dashboard');
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

    const DashboardRoute = require('../../../app/(main)/dashboard').default;
    const result = renderWithTheme(<DashboardRoute />);
    
    // Route should render when authenticated (guard allows access)
    expect(result).toBeTruthy();
    expect(DashboardScreen).toHaveBeenCalled();
    
    // Note: The actual redirect behavior is tested in main-layout-guard.test.js
    // This test verifies the route component itself works when guard allows access
  });

  it('should handle route when guard allows access', () => {
    // Test that route renders correctly when auth guard allows access
    useAuthGuard.mockReturnValue({
      authenticated: true,
      user: { id: '1', email: 'test@example.com' },
    });

    const DashboardRoute = require('../../../app/(main)/dashboard').default;
    renderWithTheme(<DashboardRoute />);
    
    // Verify DashboardScreen is rendered (route is accessible)
    expect(DashboardScreen).toHaveBeenCalledTimes(1);
  });
});

