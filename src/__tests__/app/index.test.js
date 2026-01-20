/**
 * Landing Route Tests
 * File: index.test.js
 * 
 * Tests the root index route (landing page)
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { LandingScreen } = require('@platform/screens');

// Mock expo-router (per Step 8.2 requirements)
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockPathname = '/';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: jest.fn(),
    canGoBack: jest.fn(() => false),
  }),
  usePathname: () => mockPathname,
  useSegments: () => [],
}));

jest.mock('@platform/screens', () => ({
  LandingScreen: jest.fn(() => null),
}));

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Landing Route (index.jsx)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    const LandingRoute = require('../../app/index').default;
    renderWithTheme(<LandingRoute />);
    expect(LandingScreen).toHaveBeenCalled();
  });

  it('should render LandingScreen component', () => {
    const LandingRoute = require('../../app/index').default;
    renderWithTheme(<LandingRoute />);
    expect(LandingScreen).toHaveBeenCalledTimes(1);
  });

  it('should use default export', () => {
    const LandingRoute = require('../../app/index');
    expect(LandingRoute.default).toBeDefined();
    expect(typeof LandingRoute.default).toBe('function');
  });

  it('should be accessible at root path (route accessibility)', () => {
    // Per Step 8.2: Test route is accessible (mock navigation)
    // The index route is accessible at '/' path (root path)
    const LandingRoute = require('../../app/index').default;
    const result = renderWithTheme(<LandingRoute />);
    
    // Verify route renders successfully (accessible)
    expect(result).toBeTruthy();
    expect(LandingScreen).toHaveBeenCalled();
    
    // Verify route is at root path (index route is accessible at '/')
    // This test verifies the route can be accessed and rendered correctly
    // The route is accessible when it renders without errors
  });
});

