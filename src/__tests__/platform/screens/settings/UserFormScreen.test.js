/**
 * UserFormScreen Component Tests
 * Per testing.mdc: render, loading, error, offline, a11y, interactions
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UserFormScreen/useUserFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserFormScreen = require('@platform/screens/settings/UserFormScreen/useUserFormScreen').default;
const UserFormScreenWeb = require('@platform/screens/settings/UserFormScreen/UserFormScreen.web').default;
const UserFormScreenAndroid = require('@platform/screens/settings/UserFormScreen/UserFormScreen.android').default;
const UserFormScreenIOS = require('@platform/screens/settings/UserFormScreen/UserFormScreen.ios').default;
const UserFormScreenIndex = require('@platform/screens/settings/UserFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'user.form.createTitle': 'Create User',
    'user.form.editTitle': 'Edit User',
    'user.form.loadError': 'Failed to load user for editing',
    'user.form.emailLabel': 'Email',
    'user.form.emailPlaceholder': 'name@example.com',
    'user.form.emailHint': 'Required',
    'user.form.phoneLabel': 'Phone',
    'user.form.phonePlaceholder': 'e.g. +1 555 123 4567',
    'user.form.phoneHint': 'Optional',
    'user.form.passwordLabel': 'Password',
    'user.form.passwordPlaceholder': 'Set a password',
    'user.form.passwordHint': 'Required for new users',
    'user.form.passwordEditHint': 'Leave blank to keep current password',
    'user.form.statusLabel': 'Status',
    'user.form.statusPlaceholder': 'Select status',
    'user.form.statusHint': 'Required',
    'user.form.tenantLabel': 'Tenant',
    'user.form.tenantPlaceholder': 'Select tenant',
    'user.form.tenantHint': 'Required for new users',
    'user.form.tenantLockedHint': 'Tenant is fixed after creation',
    'user.form.noTenantsMessage': 'No tenants available yet.',
    'user.form.createTenantFirst': 'Create a tenant before adding users.',
    'user.form.goToTenants': 'Go to Tenants',
    'user.form.goToTenantsHint': 'Open tenant settings',
    'user.form.facilityLabel': 'Facility',
    'user.form.facilityPlaceholder': 'Select facility (optional)',
    'user.form.facilityHint': 'Optional',
    'user.form.noFacilitiesMessage': 'No facilities available for this tenant.',
    'user.form.createFacilityRequired': 'Create a facility to link this user.',
    'user.form.goToFacilities': 'Go to Facilities',
    'user.form.goToFacilitiesHint': 'Open facility settings',
    'user.form.selectTenantFirst': 'Select a tenant first',
    'user.form.submitCreate': 'Create User',
    'user.form.submitEdit': 'Save Changes',
    'user.form.submitErrorTitle': 'Unable to save user',
    'user.form.tenantLoadErrorTitle': 'Unable to load tenants',
    'user.form.facilityLoadErrorTitle': 'Unable to load facilities',
    'user.form.cancel': 'Cancel',
    'user.form.cancelHint': 'Return without saving',
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
  facilityId: '',
  setFacilityId: jest.fn(),
  email: '',
  setEmail: jest.fn(),
  phone: '',
  setPhone: jest.fn(),
  password: '',
  setPassword: jest.fn(),
  status: 'ACTIVE',
  setStatus: jest.fn(),
  statusOptions: [{ label: 'Active', value: 'ACTIVE' }],
  tenantOptions: [],
  tenantListLoading: false,
  tenantListError: false,
  tenantErrorMessage: null,
  facilityOptions: [],
  facilityListLoading: false,
  facilityListError: false,
  facilityErrorMessage: null,
  hasTenants: true,
  isCreateBlocked: false,
  showFacilityEmpty: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  user: null,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToTenants: jest.fn(),
  onGoToFacilities: jest.fn(),
  onRetryTenants: jest.fn(),
  onRetryFacilities: jest.fn(),
  isSubmitDisabled: false,
};

describe('UserFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useUserFormScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<UserFormScreenWeb />);
      expect(getByTestId('user-form-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<UserFormScreenAndroid />);
      expect(getByTestId('user-form-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<UserFormScreenIOS />);
      expect(getByTestId('user-form-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useUserFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        isLoading: true,
        user: null,
      });
      const { getByTestId } = renderWithTheme(<UserFormScreenWeb />);
      expect(getByTestId('user-form-loading')).toBeTruthy();
    });
  });

  describe('load error', () => {
    it('shows load error state (Web)', () => {
      useUserFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        hasError: true,
        user: null,
      });
      const { getByTestId } = renderWithTheme(<UserFormScreenWeb />);
      expect(getByTestId('user-form-load-error')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows offline state (Web)', () => {
      useUserFormScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<UserFormScreenWeb />);
      expect(getByTestId('user-form-offline')).toBeTruthy();
    });

    it('shows submit error state (Web)', () => {
      useUserFormScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Submit failed',
      });
      const { getByTestId } = renderWithTheme(<UserFormScreenWeb />);
      expect(getByTestId('user-form-submit-error')).toBeTruthy();
    });
  });

  describe('tenant states', () => {
    it('shows tenant load error (Web)', () => {
      useUserFormScreen.mockReturnValue({
        ...baseHook,
        tenantListError: true,
        tenantErrorMessage: 'Unable to load tenants',
      });
      const { getByTestId } = renderWithTheme(<UserFormScreenWeb />);
      expect(getByTestId('user-form-tenant-error')).toBeTruthy();
    });
  });

  describe('facility states', () => {
    it('shows facility load error (Web)', () => {
      useUserFormScreen.mockReturnValue({
        ...baseHook,
        facilityListError: true,
        facilityErrorMessage: 'Unable to load facilities',
      });
      const { getByTestId } = renderWithTheme(<UserFormScreenWeb />);
      expect(getByTestId('user-form-facility-error')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('calls submit and cancel handlers (Web)', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      useUserFormScreen.mockReturnValue({
        ...baseHook,
        onSubmit,
        onCancel,
      });
      const { getByTestId } = renderWithTheme(<UserFormScreenWeb />);
      fireEvent.press(getByTestId('user-form-submit'));
      fireEvent.press(getByTestId('user-form-cancel'));
      expect(onSubmit).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(UserFormScreenIndex.default).toBeDefined();
      expect(UserFormScreenIndex.useUserFormScreen).toBeDefined();
    });
  });
});
