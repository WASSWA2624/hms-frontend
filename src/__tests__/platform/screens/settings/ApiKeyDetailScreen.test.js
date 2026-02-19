/**
 * ApiKeyDetailScreen Component Tests
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/ApiKeyDetailScreen/useApiKeyDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useApiKeyDetailScreen = require('@platform/screens/settings/ApiKeyDetailScreen/useApiKeyDetailScreen').default;
const ApiKeyDetailScreenWeb = require('@platform/screens/settings/ApiKeyDetailScreen/ApiKeyDetailScreen.web').default;
const ApiKeyDetailScreenAndroid = require('@platform/screens/settings/ApiKeyDetailScreen/ApiKeyDetailScreen.android').default;
const ApiKeyDetailScreenIOS = require('@platform/screens/settings/ApiKeyDetailScreen/ApiKeyDetailScreen.ios').default;
const ApiKeyDetailScreenIndex = require('@platform/screens/settings/ApiKeyDetailScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const baseHook = {
  id: 'key-1',
  apiKey: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: true,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: undefined,
  onDelete: undefined,
};

describe('ApiKeyDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key, locale: 'en' });
    useApiKeyDetailScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Web)', () => {
    const { getByTestId } = renderWithTheme(<ApiKeyDetailScreenWeb />);
    expect(getByTestId('api-key-detail-not-found')).toBeTruthy();
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<ApiKeyDetailScreenAndroid />);
    expect(getByTestId('api-key-detail-not-found')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<ApiKeyDetailScreenIOS />);
    expect(getByTestId('api-key-detail-not-found')).toBeTruthy();
  });

  it('shows loading state (Web)', () => {
    useApiKeyDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<ApiKeyDetailScreenWeb />);
    expect(getByTestId('api-key-detail-loading')).toBeTruthy();
  });

  it('shows error state (Web)', () => {
    useApiKeyDetailScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Unable to load',
    });
    const { getByTestId } = renderWithTheme(<ApiKeyDetailScreenWeb />);
    expect(getByTestId('api-key-detail-error')).toBeTruthy();
  });

  it('shows offline state (Web)', () => {
    useApiKeyDetailScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<ApiKeyDetailScreenWeb />);
    expect(getByTestId('api-key-detail-offline')).toBeTruthy();
  });

  it('renders API key details for privileged users (Web)', () => {
    useApiKeyDetailScreen.mockReturnValue({
      ...baseHook,
      canViewTechnicalIds: true,
      apiKey: {
        id: 'key-1',
        tenant_id: 'tenant-1',
        user_id: 'user-1',
        name: 'Integration Key',
        is_active: true,
        last_used_at: '2025-01-03T00:00:00Z',
        expires_at: '2025-12-31T00:00:00Z',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      },
    });

    const { getByTestId } = renderWithTheme(<ApiKeyDetailScreenWeb />);

    expect(getByTestId('api-key-detail-card')).toBeTruthy();
    expect(getByTestId('api-key-detail-id')).toBeTruthy();
    expect(getByTestId('api-key-detail-name')).toBeTruthy();
    expect(getByTestId('api-key-detail-user')).toBeTruthy();
    expect(getByTestId('api-key-detail-tenant')).toBeTruthy();
    expect(getByTestId('api-key-detail-status')).toBeTruthy();
    expect(getByTestId('api-key-detail-last-used')).toBeTruthy();
    expect(getByTestId('api-key-detail-expires')).toBeTruthy();
    expect(getByTestId('api-key-detail-created')).toBeTruthy();
    expect(getByTestId('api-key-detail-updated')).toBeTruthy();
  });

  it('hides technical ID for standard users (Web)', () => {
    useApiKeyDetailScreen.mockReturnValue({
      ...baseHook,
      canViewTechnicalIds: false,
      apiKey: {
        id: '8f4fd148-2502-4edb-bf1d-c1f5c66182fd',
        tenant_id: '24526426-b527-4cb4-a48b-c3f71ca9f3e7',
        user_id: '910f0d1f-66fd-4490-8e4a-cc8ef00a4bf6',
        is_active: true,
      },
    });

    const { queryByTestId, getByTestId } = renderWithTheme(<ApiKeyDetailScreenWeb />);

    expect(queryByTestId('api-key-detail-id')).toBeNull();
    expect(getByTestId('api-key-detail-user')).toBeTruthy();
    expect(getByTestId('api-key-detail-tenant')).toBeTruthy();
  });

  it('shows inline error banner when record exists (Web)', () => {
    useApiKeyDetailScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Error',
      apiKey: { id: 'key-1', name: 'Integration Key', is_active: true },
    });

    const { getByTestId } = renderWithTheme(<ApiKeyDetailScreenWeb />);
    expect(getByTestId('api-key-detail-error-banner')).toBeTruthy();
  });

  it('shows inline offline banner when record exists (Web)', () => {
    useApiKeyDetailScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      apiKey: { id: 'key-1', name: 'Integration Key', is_active: true },
    });

    const { getByTestId } = renderWithTheme(<ApiKeyDetailScreenWeb />);
    expect(getByTestId('api-key-detail-offline-banner')).toBeTruthy();
  });

  it('keeps read-only actions (back only)', () => {
    useApiKeyDetailScreen.mockReturnValue({
      ...baseHook,
      apiKey: { id: 'key-1', name: 'Integration Key', is_active: true },
    });

    const { getByTestId, queryByTestId } = renderWithTheme(<ApiKeyDetailScreenWeb />);
    expect(getByTestId('api-key-detail-back')).toBeTruthy();
    expect(queryByTestId('api-key-detail-edit')).toBeNull();
    expect(queryByTestId('api-key-detail-delete')).toBeNull();
  });

  it('exports component and hook from index', () => {
    expect(ApiKeyDetailScreenIndex.default).toBeDefined();
    expect(ApiKeyDetailScreenIndex.useApiKeyDetailScreen).toBeDefined();
  });
});
