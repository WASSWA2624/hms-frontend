/**
 * Notifications route tests
 * File: notifications.test.js
 */

const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { NotificationsScreen } = require('@platform/screens');

jest.mock('@platform/screens', () => ({
  NotificationsScreen: jest.fn(() => null),
}));

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('Notifications Route (notifications.jsx)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors', () => {
    const NotificationsRoute = require('../../../app/(main)/notifications').default;
    renderWithTheme(<NotificationsRoute />);
    expect(NotificationsScreen).toHaveBeenCalledTimes(1);
  });

  it('uses a default export function', () => {
    const NotificationsRoute = require('../../../app/(main)/notifications');
    expect(NotificationsRoute.default).toBeDefined();
    expect(typeof NotificationsRoute.default).toBe('function');
  });
});
