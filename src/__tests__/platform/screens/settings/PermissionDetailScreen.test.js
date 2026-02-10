/**
 * PermissionDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/PermissionDetailScreen/usePermissionDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const usePermissionDetailScreen = require('@platform/screens/settings/PermissionDetailScreen/usePermissionDetailScreen').default;
const PermissionDetailScreenWeb = require('@platform/screens/settings/PermissionDetailScreen/PermissionDetailScreen.web').default;
const PermissionDetailScreenAndroid = require('@platform/screens/settings/PermissionDetailScreen/PermissionDetailScreen.android').default;
const PermissionDetailScreenIOS = require('@platform/screens/settings/PermissionDetailScreen/PermissionDetailScreen.ios').default;
const PermissionDetailScreenIndex = require('@platform/screens/settings/PermissionDetailScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'permission.detail.title': 'Permission Details',
    'permission.detail.idLabel': 'Permission ID',
    'permission.detail.tenantLabel': 'Tenant',
    'permission.detail.nameLabel': 'Name',
    'permission.detail.descriptionLabel': 'Description',
    'permission.detail.createdLabel': 'Created',
    'permission.detail.updatedLabel': 'Updated',
    'permission.detail.errorTitle': 'Failed to load permission',
    'permission.detail.notFoundTitle': 'Permission not found',
    'permission.detail.notFoundMessage': 'This permission may have been removed.',
    'permission.detail.backHint': 'Return to permissions list',
    'permission.detail.delete': 'Delete permission',
    'permission.detail.deleteHint': 'Delete this permission',
    'permission.detail.edit': 'Edit permission',
    'permission.detail.editHint': 'Edit this permission',
    'common.loading': 'Loading',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.back': 'Back',
    'common.remove': 'Remove',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  id: 'p1',
  permission: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('PermissionDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT, locale: 'en' });
    usePermissionDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenWeb />);
      expect(getByTestId('permission-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      usePermissionDetailScreen.mockReturnValue({ ...baseHook, permission: null });
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenAndroid />);
      expect(getByTestId('permission-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      usePermissionDetailScreen.mockReturnValue({ ...baseHook, permission: null });
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenIOS />);
      expect(getByTestId('permission-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      usePermissionDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenWeb />);
      expect(getByTestId('permission-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      usePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenWeb />);
      expect(getByTestId('permission-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      usePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenWeb />);
      expect(getByTestId('permission-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      usePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        permission: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenWeb />);
      expect(getByTestId('permission-detail-not-found')).toBeTruthy();
    });
  });

  describe('with permission data', () => {
    it('renders permission details (Web)', () => {
      usePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        permission: {
          id: 'p1',
          tenant_id: 't1',
          name: 'Permission 1',
          description: 'Desc',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      });
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenWeb />);
      expect(getByTestId('permission-detail-card')).toBeTruthy();
      expect(getByTestId('permission-detail-id')).toBeTruthy();
      expect(getByTestId('permission-detail-tenant')).toBeTruthy();
      expect(getByTestId('permission-detail-name')).toBeTruthy();
      expect(getByTestId('permission-detail-description')).toBeTruthy();
      expect(getByTestId('permission-detail-created')).toBeTruthy();
      expect(getByTestId('permission-detail-updated')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows inline error banner when permission exists (Web)', () => {
      usePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Error',
        permission: { id: 'p1', name: 'Permission' },
      });
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenWeb />);
      expect(getByTestId('permission-detail-error-banner')).toBeTruthy();
    });

    it('shows inline offline banner when permission exists (Web)', () => {
      usePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        permission: { id: 'p1', name: 'Permission' },
      });
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenWeb />);
      expect(getByTestId('permission-detail-offline-banner')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      usePermissionDetailScreen.mockReturnValue({
        ...baseHook,
        permission: {
          id: 'p1',
          tenant_id: 't1',
          name: 'Permission 1',
        },
      });
      const { getByTestId } = renderWithTheme(<PermissionDetailScreenWeb />);
      expect(getByTestId('permission-detail-back')).toBeTruthy();
      expect(getByTestId('permission-detail-edit')).toBeTruthy();
      expect(getByTestId('permission-detail-delete')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(PermissionDetailScreenIndex.default).toBeDefined();
      expect(PermissionDetailScreenIndex.usePermissionDetailScreen).toBeDefined();
    });
  });
});
