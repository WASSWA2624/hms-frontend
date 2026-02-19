/**
 * ApiKeyPermissionFormScreen Component Tests
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/ApiKeyPermissionFormScreen/useApiKeyPermissionFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useApiKeyPermissionFormScreen = require('@platform/screens/settings/ApiKeyPermissionFormScreen/useApiKeyPermissionFormScreen').default;
const ApiKeyPermissionFormScreenWeb = require('@platform/screens/settings/ApiKeyPermissionFormScreen/ApiKeyPermissionFormScreen.web').default;
const ApiKeyPermissionFormScreenAndroid = require('@platform/screens/settings/ApiKeyPermissionFormScreen/ApiKeyPermissionFormScreen.android').default;
const ApiKeyPermissionFormScreenIOS = require('@platform/screens/settings/ApiKeyPermissionFormScreen/ApiKeyPermissionFormScreen.ios').default;
const ApiKeyPermissionFormScreenIndex = require('@platform/screens/settings/ApiKeyPermissionFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const baseHook = {
  isEdit: false,
  apiKeyId: '',
  setApiKeyId: jest.fn(),
  permissionId: '',
  setPermissionId: jest.fn(),
  apiKeyOptions: [],
  permissionOptions: [],
  apiKeyListLoading: false,
  apiKeyListError: false,
  apiKeyErrorMessage: null,
  permissionListLoading: false,
  permissionListError: false,
  permissionErrorMessage: null,
  hasApiKeys: true,
  hasPermissions: true,
  isCreateBlocked: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  apiKeyPermission: null,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToApiKeys: jest.fn(),
  onGoToPermissions: jest.fn(),
  onRetryApiKeys: jest.fn(),
  onRetryPermissions: jest.fn(),
  isSubmitDisabled: false,
};

describe('ApiKeyPermissionFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    useApiKeyPermissionFormScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error on all platforms', () => {
    const web = renderWithTheme(<ApiKeyPermissionFormScreenWeb />);
    expect(web.getByTestId('api-key-permission-form-card')).toBeTruthy();

    const android = renderWithTheme(<ApiKeyPermissionFormScreenAndroid />);
    expect(android.getByTestId('api-key-permission-form-card')).toBeTruthy();

    const ios = renderWithTheme(<ApiKeyPermissionFormScreenIOS />);
    expect(ios.getByTestId('api-key-permission-form-card')).toBeTruthy();
  });

  it('shows loading and load-error states for edit mode', () => {
    useApiKeyPermissionFormScreen.mockReturnValue({
      ...baseHook,
      isEdit: true,
      isLoading: true,
      apiKeyPermission: null,
    });
    const loading = renderWithTheme(<ApiKeyPermissionFormScreenWeb />);
    expect(loading.getByTestId('api-key-permission-form-loading')).toBeTruthy();

    useApiKeyPermissionFormScreen.mockReturnValue({
      ...baseHook,
      isEdit: true,
      hasError: true,
      apiKeyPermission: null,
    });
    const loadError = renderWithTheme(<ApiKeyPermissionFormScreenWeb />);
    expect(loadError.getByTestId('api-key-permission-form-load-error')).toBeTruthy();
  });

  it('shows inline offline and submit error states', () => {
    useApiKeyPermissionFormScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      hasError: true,
      errorMessage: 'Submit failed',
    });

    const { getByTestId } = renderWithTheme(<ApiKeyPermissionFormScreenWeb />);
    expect(getByTestId('api-key-permission-form-offline')).toBeTruthy();
    expect(getByTestId('api-key-permission-form-submit-error')).toBeTruthy();
  });

  it('shows API key and permission load errors', () => {
    useApiKeyPermissionFormScreen.mockReturnValue({
      ...baseHook,
      apiKeyListError: true,
      apiKeyErrorMessage: 'API key load failed',
    });
    const apiKeyError = renderWithTheme(<ApiKeyPermissionFormScreenWeb />);
    expect(apiKeyError.getByTestId('api-key-permission-form-api-key-error')).toBeTruthy();

    useApiKeyPermissionFormScreen.mockReturnValue({
      ...baseHook,
      permissionListError: true,
      permissionErrorMessage: 'Permission load failed',
    });
    const permissionError = renderWithTheme(<ApiKeyPermissionFormScreenWeb />);
    expect(permissionError.getByTestId('api-key-permission-form-permission-error')).toBeTruthy();
  });

  it('calls submit and cancel handlers', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    useApiKeyPermissionFormScreen.mockReturnValue({
      ...baseHook,
      onSubmit,
      onCancel,
    });

    const { getByTestId } = renderWithTheme(<ApiKeyPermissionFormScreenWeb />);
    fireEvent.press(getByTestId('api-key-permission-form-submit'));
    fireEvent.press(getByTestId('api-key-permission-form-cancel'));
    expect(onSubmit).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it('exports component and hook from index', () => {
    expect(ApiKeyPermissionFormScreenIndex.default).toBeDefined();
    expect(ApiKeyPermissionFormScreenIndex.useApiKeyPermissionFormScreen).toBeDefined();
  });
});

