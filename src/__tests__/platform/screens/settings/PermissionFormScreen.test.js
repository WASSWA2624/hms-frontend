/**
 * PermissionFormScreen Component Tests
 * Per testing.mdc: render, loading, error, offline, a11y, interactions
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/PermissionFormScreen/usePermissionFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const usePermissionFormScreen = require('@platform/screens/settings/PermissionFormScreen/usePermissionFormScreen').default;
const PermissionFormScreenWeb = require('@platform/screens/settings/PermissionFormScreen/PermissionFormScreen.web').default;
const PermissionFormScreenAndroid = require('@platform/screens/settings/PermissionFormScreen/PermissionFormScreen.android').default;
const PermissionFormScreenIOS = require('@platform/screens/settings/PermissionFormScreen/PermissionFormScreen.ios').default;
const PermissionFormScreenIndex = require('@platform/screens/settings/PermissionFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'permission.form.createTitle': 'Create Permission',
    'permission.form.editTitle': 'Edit Permission',
    'permission.form.loadError': 'Failed to load permission',
    'permission.form.tenantLabel': 'Tenant',
    'permission.form.tenantPlaceholder': 'Select tenant',
    'permission.form.tenantHint': 'Required for new permissions',
    'permission.form.tenantLockedHint': 'Tenant is fixed after creation',
    'permission.form.tenantLoadErrorTitle': 'Unable to load tenants',
    'permission.form.tenantLoadErrorMessage': 'We could not load tenants',
    'permission.form.noTenantsMessage': 'No tenants available yet.',
    'permission.form.createTenantFirst': 'Create a tenant before adding permissions.',
    'permission.form.goToTenants': 'Go to Tenants',
    'permission.form.goToTenantsHint': 'Open tenant settings',
    'permission.form.nameLabel': 'Permission name',
    'permission.form.namePlaceholder': 'e.g. roles.read',
    'permission.form.nameHint': 'Required',
    'permission.form.descriptionLabel': 'Description',
    'permission.form.descriptionPlaceholder': 'Optional notes',
    'permission.form.descriptionHint': 'Optional',
    'permission.form.submitCreate': 'Create Permission',
    'permission.form.submitEdit': 'Save Changes',
    'permission.form.submitErrorTitle': 'Unable to save permission',
    'permission.form.cancel': 'Cancel',
    'permission.form.cancelHint': 'Return without saving',
    'permission.form.blockedMessage': 'Create a tenant first.',
    'common.loading': 'Loading',
    'common.back': 'Back',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  isEdit: false,
  tenantId: '',
  setTenantId: jest.fn(),
  name: '',
  setName: jest.fn(),
  description: '',
  setDescription: jest.fn(),
  tenantOptions: [],
  tenantListLoading: false,
  tenantListError: false,
  tenantErrorMessage: null,
  hasTenants: true,
  isCreateBlocked: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  permission: null,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToTenants: jest.fn(),
  onRetryTenants: jest.fn(),
  isSubmitDisabled: false,
};

describe('PermissionFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    usePermissionFormScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<PermissionFormScreenWeb />);
      expect(getByTestId('permission-form-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<PermissionFormScreenAndroid />);
      expect(getByTestId('permission-form-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<PermissionFormScreenIOS />);
      expect(getByTestId('permission-form-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      usePermissionFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        isLoading: true,
        permission: null,
      });
      const { getByTestId } = renderWithTheme(<PermissionFormScreenWeb />);
      expect(getByTestId('permission-form-loading')).toBeTruthy();
    });
  });

  describe('load error', () => {
    it('shows load error state (Web)', () => {
      usePermissionFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        hasError: true,
        permission: null,
      });
      const { getByTestId } = renderWithTheme(<PermissionFormScreenWeb />);
      expect(getByTestId('permission-form-load-error')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows offline state (Web)', () => {
      usePermissionFormScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<PermissionFormScreenWeb />);
      expect(getByTestId('permission-form-offline')).toBeTruthy();
    });

    it('shows submit error state (Web)', () => {
      usePermissionFormScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Submit failed',
      });
      const { getByTestId } = renderWithTheme(<PermissionFormScreenWeb />);
      expect(getByTestId('permission-form-submit-error')).toBeTruthy();
    });
  });

  describe('tenant states', () => {
    it('shows tenant load error (Web)', () => {
      usePermissionFormScreen.mockReturnValue({
        ...baseHook,
        tenantListError: true,
        tenantErrorMessage: 'Unable to load tenants',
      });
      const { getByTestId } = renderWithTheme(<PermissionFormScreenWeb />);
      expect(getByTestId('permission-form-tenant-error')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('calls submit and cancel handlers (Web)', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      usePermissionFormScreen.mockReturnValue({
        ...baseHook,
        onSubmit,
        onCancel,
      });
      const { getByTestId } = renderWithTheme(<PermissionFormScreenWeb />);
      fireEvent.press(getByTestId('permission-form-submit'));
      fireEvent.press(getByTestId('permission-form-cancel'));
      expect(onSubmit).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(PermissionFormScreenIndex.default).toBeDefined();
      expect(PermissionFormScreenIndex.usePermissionFormScreen).toBeDefined();
    });
  });
});
