/**
 * UserMfaFormScreen Component Tests
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UserMfaFormScreen/useUserMfaFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserMfaFormScreen = require('@platform/screens/settings/UserMfaFormScreen/useUserMfaFormScreen').default;
const UserMfaFormScreenWeb = require('@platform/screens/settings/UserMfaFormScreen/UserMfaFormScreen.web').default;
const UserMfaFormScreenAndroid = require('@platform/screens/settings/UserMfaFormScreen/UserMfaFormScreen.android').default;
const UserMfaFormScreenIOS = require('@platform/screens/settings/UserMfaFormScreen/UserMfaFormScreen.ios').default;
const UserMfaFormScreenIndex = require('@platform/screens/settings/UserMfaFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const baseHook = {
  isEdit: false,
  userId: '',
  setUserId: jest.fn(),
  channel: '',
  setChannel: jest.fn(),
  channelOptions: [],
  secret: '',
  setSecret: jest.fn(),
  isEnabled: true,
  setIsEnabled: jest.fn(),
  userOptions: [],
  userListLoading: false,
  userListError: false,
  userErrorMessage: null,
  hasUsers: true,
  isCreateBlocked: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  userMfa: null,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToUsers: jest.fn(),
  onRetryUsers: jest.fn(),
  isSubmitDisabled: false,
};

describe('UserMfaFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    useUserMfaFormScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error on all platforms', () => {
    const web = renderWithTheme(<UserMfaFormScreenWeb />);
    expect(web.getByTestId('user-mfa-form-card')).toBeTruthy();

    const android = renderWithTheme(<UserMfaFormScreenAndroid />);
    expect(android.getByTestId('user-mfa-form-card')).toBeTruthy();

    const ios = renderWithTheme(<UserMfaFormScreenIOS />);
    expect(ios.getByTestId('user-mfa-form-card')).toBeTruthy();
  });

  it('shows loading and load-error states for edit mode', () => {
    useUserMfaFormScreen.mockReturnValue({
      ...baseHook,
      isEdit: true,
      isLoading: true,
      userMfa: null,
    });
    const loading = renderWithTheme(<UserMfaFormScreenWeb />);
    expect(loading.getByTestId('user-mfa-form-loading')).toBeTruthy();

    useUserMfaFormScreen.mockReturnValue({
      ...baseHook,
      isEdit: true,
      hasError: true,
      userMfa: null,
    });
    const loadError = renderWithTheme(<UserMfaFormScreenWeb />);
    expect(loadError.getByTestId('user-mfa-form-load-error')).toBeTruthy();
  });

  it('shows inline offline and submit error states', () => {
    useUserMfaFormScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      hasError: true,
      errorMessage: 'Submit failed',
    });

    const { getByTestId } = renderWithTheme(<UserMfaFormScreenWeb />);
    expect(getByTestId('user-mfa-form-offline')).toBeTruthy();
    expect(getByTestId('user-mfa-form-submit-error')).toBeTruthy();
  });

  it('shows user load error state', () => {
    useUserMfaFormScreen.mockReturnValue({
      ...baseHook,
      userListError: true,
      userErrorMessage: 'User load failed',
    });
    const userError = renderWithTheme(<UserMfaFormScreenWeb />);
    expect(userError.getByTestId('user-mfa-form-user-error')).toBeTruthy();
  });

  it('calls submit and cancel handlers', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    useUserMfaFormScreen.mockReturnValue({
      ...baseHook,
      onSubmit,
      onCancel,
    });

    const { getByTestId } = renderWithTheme(<UserMfaFormScreenWeb />);
    fireEvent.press(getByTestId('user-mfa-form-submit'));
    fireEvent.press(getByTestId('user-mfa-form-cancel'));
    expect(onSubmit).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it('exports component and hook from index', () => {
    expect(UserMfaFormScreenIndex.default).toBeDefined();
    expect(UserMfaFormScreenIndex.useUserMfaFormScreen).toBeDefined();
  });
});
