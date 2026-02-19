/**
 * ApiKeyPermissionDetailScreen Component Tests
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/ApiKeyPermissionDetailScreen/useApiKeyPermissionDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useApiKeyPermissionDetailScreen = require('@platform/screens/settings/ApiKeyPermissionDetailScreen/useApiKeyPermissionDetailScreen').default;
const ApiKeyPermissionDetailScreenWeb = require('@platform/screens/settings/ApiKeyPermissionDetailScreen/ApiKeyPermissionDetailScreen.web').default;
const ApiKeyPermissionDetailScreenAndroid = require('@platform/screens/settings/ApiKeyPermissionDetailScreen/ApiKeyPermissionDetailScreen.android').default;
const ApiKeyPermissionDetailScreenIOS = require('@platform/screens/settings/ApiKeyPermissionDetailScreen/ApiKeyPermissionDetailScreen.ios').default;
const ApiKeyPermissionDetailScreenIndex = require('@platform/screens/settings/ApiKeyPermissionDetailScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const baseHook = {
  id: 'akp-1',
  apiKeyPermission: null,
  apiKeyLabel: '',
  permissionLabel: '',
  tenantLabel: '',
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: true,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('ApiKeyPermissionDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key, locale: 'en' });
    useApiKeyPermissionDetailScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error on all platforms', () => {
    const web = renderWithTheme(<ApiKeyPermissionDetailScreenWeb />);
    expect(web.getByTestId('api-key-permission-detail-not-found')).toBeTruthy();

    const android = renderWithTheme(<ApiKeyPermissionDetailScreenAndroid />);
    expect(android.getByTestId('api-key-permission-detail-not-found')).toBeTruthy();

    const ios = renderWithTheme(<ApiKeyPermissionDetailScreenIOS />);
    expect(ios.getByTestId('api-key-permission-detail-not-found')).toBeTruthy();
  });

  it('shows loading state', () => {
    useApiKeyPermissionDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<ApiKeyPermissionDetailScreenWeb />);
    expect(getByTestId('api-key-permission-detail-loading')).toBeTruthy();
  });

  it('shows error state', () => {
    useApiKeyPermissionDetailScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Unable to load',
    });
    const { getByTestId } = renderWithTheme(<ApiKeyPermissionDetailScreenWeb />);
    expect(getByTestId('api-key-permission-detail-error')).toBeTruthy();
  });

  it('shows offline state', () => {
    useApiKeyPermissionDetailScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<ApiKeyPermissionDetailScreenWeb />);
    expect(getByTestId('api-key-permission-detail-offline')).toBeTruthy();
  });

  it('renders detail values and action controls', () => {
    useApiKeyPermissionDetailScreen.mockReturnValue({
      ...baseHook,
      apiKeyPermission: {
        id: 'akp-1',
        api_key_id: 'key-1',
        permission_id: 'perm-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      },
      apiKeyLabel: 'Clinical Integration',
      permissionLabel: 'Read Encounters',
      tenantLabel: 'North Tenant',
    });

    const { getByTestId } = renderWithTheme(<ApiKeyPermissionDetailScreenWeb />);
    expect(getByTestId('api-key-permission-detail-card')).toBeTruthy();
    expect(getByTestId('api-key-permission-detail-id')).toBeTruthy();
    expect(getByTestId('api-key-permission-detail-api-key')).toBeTruthy();
    expect(getByTestId('api-key-permission-detail-permission')).toBeTruthy();
    expect(getByTestId('api-key-permission-detail-tenant')).toBeTruthy();
    expect(getByTestId('api-key-permission-detail-edit')).toBeTruthy();
    expect(getByTestId('api-key-permission-detail-delete')).toBeTruthy();
  });

  it('shows inline error/offline banners when record exists', () => {
    useApiKeyPermissionDetailScreen.mockReturnValue({
      ...baseHook,
      apiKeyPermission: { id: 'akp-1', api_key_id: 'key-1', permission_id: 'perm-1' },
      hasError: true,
      isOffline: true,
      errorMessage: 'Failed',
    });

    const { getByTestId } = renderWithTheme(<ApiKeyPermissionDetailScreenWeb />);
    expect(getByTestId('api-key-permission-detail-error-banner')).toBeTruthy();
    expect(getByTestId('api-key-permission-detail-offline-banner')).toBeTruthy();
  });

  it('exports component and hook from index', () => {
    expect(ApiKeyPermissionDetailScreenIndex.default).toBeDefined();
    expect(ApiKeyPermissionDetailScreenIndex.useApiKeyPermissionDetailScreen).toBeDefined();
  });
});

