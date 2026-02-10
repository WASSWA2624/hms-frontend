/**
 * TenantFormScreen Component Tests
 * Per testing.mdc: render, loading, error, offline, a11y, interactions
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/TenantFormScreen/useTenantFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useTenantFormScreen = require('@platform/screens/settings/TenantFormScreen/useTenantFormScreen').default;
const TenantFormScreenWeb = require('@platform/screens/settings/TenantFormScreen/TenantFormScreen.web').default;
const TenantFormScreenAndroid = require('@platform/screens/settings/TenantFormScreen/TenantFormScreen.android').default;
const TenantFormScreenIOS = require('@platform/screens/settings/TenantFormScreen/TenantFormScreen.ios').default;
const TenantFormScreenIndex = require('@platform/screens/settings/TenantFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'tenant.form.createTitle': 'Add Tenant',
    'tenant.form.editTitle': 'Edit Tenant',
    'tenant.form.loadError': 'Failed to load tenant for editing',
    'tenant.form.nameLabel': 'Name',
    'tenant.form.namePlaceholder': 'Enter tenant name',
    'tenant.form.nameHint': 'Display name for the tenant',
    'tenant.form.slugLabel': 'Slug',
    'tenant.form.slugPlaceholder': 'Enter slug (optional)',
    'tenant.form.slugHint': 'URL-friendly identifier',
    'tenant.form.activeLabel': 'Active',
    'tenant.form.activeHint': 'Whether the tenant is active',
    'tenant.form.submitCreate': 'Create Tenant',
    'tenant.form.submitEdit': 'Save Changes',
    'tenant.form.submitErrorTitle': 'Unable to save tenant',
    'tenant.form.cancel': 'Cancel',
    'tenant.form.cancelHint': 'Return without saving',
    'common.loading': 'Loading',
    'common.back': 'Back',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  isEdit: false,
  name: '',
  setName: jest.fn(),
  slug: '',
  setSlug: jest.fn(),
  isActive: true,
  setIsActive: jest.fn(),
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  tenant: null,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
};

describe('TenantFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useTenantFormScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<TenantFormScreenWeb />);
      expect(getByTestId('tenant-form-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<TenantFormScreenAndroid />);
      expect(getByTestId('tenant-form-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<TenantFormScreenIOS />);
      expect(getByTestId('tenant-form-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useTenantFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        isLoading: true,
        tenant: null,
      });
      const { getByTestId } = renderWithTheme(<TenantFormScreenWeb />);
      expect(getByTestId('tenant-form-loading')).toBeTruthy();
    });
  });

  describe('load error', () => {
    it('shows load error state (Web)', () => {
      useTenantFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        hasError: true,
        tenant: null,
      });
      const { getByTestId } = renderWithTheme(<TenantFormScreenWeb />);
      expect(getByTestId('tenant-form-load-error')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows offline state (Web)', () => {
      useTenantFormScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<TenantFormScreenWeb />);
      expect(getByTestId('tenant-form-offline')).toBeTruthy();
    });

    it('shows submit error state (Web)', () => {
      useTenantFormScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Submit failed',
      });
      const { getByTestId } = renderWithTheme(<TenantFormScreenWeb />);
      expect(getByTestId('tenant-form-submit-error')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('calls submit and cancel handlers (Web)', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      useTenantFormScreen.mockReturnValue({
        ...baseHook,
        onSubmit,
        onCancel,
      });
      const { getByTestId } = renderWithTheme(<TenantFormScreenWeb />);
      fireEvent.press(getByTestId('tenant-form-submit'));
      fireEvent.press(getByTestId('tenant-form-cancel'));
      expect(onSubmit).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(TenantFormScreenIndex.default).toBeDefined();
      expect(TenantFormScreenIndex.useTenantFormScreen).toBeDefined();
    });
  });
});
