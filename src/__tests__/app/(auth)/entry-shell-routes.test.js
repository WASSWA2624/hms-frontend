const React = require('react');
const { render } = require('@testing-library/react-native');

const mockLoginScreen = jest.fn(() => null);
const mockForgotPasswordScreen = jest.fn(() => null);
const mockResetPasswordScreen = jest.fn(() => null);
const mockVerifyEmailScreen = jest.fn(() => null);
const mockVerifyPhoneScreen = jest.fn(() => null);
const mockTenantSelectionScreen = jest.fn(() => null);
const mockFacilitySelectionScreen = jest.fn(() => null);

jest.mock('@platform/screens', () => ({
  LoginScreen: (...args) => mockLoginScreen(...args),
  ForgotPasswordScreen: (...args) => mockForgotPasswordScreen(...args),
  ResetPasswordScreen: (...args) => mockResetPasswordScreen(...args),
  VerifyEmailScreen: (...args) => mockVerifyEmailScreen(...args),
  VerifyPhoneScreen: (...args) => mockVerifyPhoneScreen(...args),
  TenantSelectionScreen: (...args) => mockTenantSelectionScreen(...args),
  FacilitySelectionScreen: (...args) => mockFacilitySelectionScreen(...args),
}));

jest.mock('../../../app/shared/withRouteTermsAcceptance', () => (Component) => Component);

const assertRouteRendersScreen = (routePath, screenMock) => {
  const routeModule = require(routePath);
  expect(routeModule.default).toBeDefined();
  expect(typeof routeModule.default).toBe('function');

  render(React.createElement(routeModule.default));
  expect(screenMock).toHaveBeenCalledTimes(1);
};

describe('Auth Entry Shell Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login route renders LoginScreen', () => {
    assertRouteRendersScreen('../../../app/(auth)/login', mockLoginScreen);
  });

  test('forgot-password route renders ForgotPasswordScreen', () => {
    assertRouteRendersScreen('../../../app/(auth)/forgot-password', mockForgotPasswordScreen);
  });

  test('reset-password route renders ResetPasswordScreen', () => {
    assertRouteRendersScreen('../../../app/(auth)/reset-password', mockResetPasswordScreen);
  });

  test('verify-email route renders VerifyEmailScreen', () => {
    assertRouteRendersScreen('../../../app/(auth)/verify-email', mockVerifyEmailScreen);
  });

  test('verify-phone route renders VerifyPhoneScreen', () => {
    assertRouteRendersScreen('../../../app/(auth)/verify-phone', mockVerifyPhoneScreen);
  });

  test('tenant-selection route renders TenantSelectionScreen', () => {
    assertRouteRendersScreen('../../../app/(auth)/tenant-selection', mockTenantSelectionScreen);
  });

  test('facility-selection route renders FacilitySelectionScreen', () => {
    assertRouteRendersScreen('../../../app/(auth)/facility-selection', mockFacilitySelectionScreen);
  });
});
