/**
 * UserFormScreen Component Tests
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

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'user.form.createTitle': 'Create User',
    'user.form.editTitle': 'Edit User',
    'user.form.loadError': 'Failed to load user for editing',
    'user.form.submitErrorTitle': 'Unable to save user',
    'user.form.cancel': 'Cancel',
    'user.form.cancelHint': 'Return without saving',
    'user.form.submitCreate': 'Create User',
    'user.form.submitEdit': 'Save Changes',
    'user.form.blockedMessage': 'Blocked',
    'user.form.tenantLabel': 'Tenant',
    'user.form.tenantHint': 'Tenant hint',
    'user.form.tenantPlaceholder': 'Select tenant',
    'user.form.tenantLockedHint': 'Tenant locked',
    'user.form.tenantScopedHint': 'Tenant scoped',
    'user.form.noTenantsMessage': 'No tenants',
    'user.form.createTenantFirst': 'Create tenant first',
    'user.form.goToTenants': 'Go to Tenants',
    'user.form.goToTenantsHint': 'Open tenants',
    'user.form.tenantLoadErrorTitle': 'Unable to load tenants',
    'user.form.facilityLabel': 'Facility',
    'user.form.facilityHint': 'Facility hint',
    'user.form.facilityPlaceholder': 'Select facility',
    'user.form.facilityLoadErrorTitle': 'Unable to load facilities',
    'user.form.selectTenantFirst': 'Select tenant first',
    'user.form.emailLabel': 'Email',
    'user.form.emailHint': 'Email hint',
    'user.form.emailPlaceholder': 'name@example.com',
    'user.form.phoneLabel': 'Phone',
    'user.form.phoneHint': 'Phone hint',
    'user.form.phonePlaceholder': '+1',
    'user.form.passwordLabel': 'Password',
    'user.form.passwordHint': 'Password hint',
    'user.form.passwordEditHint': 'Leave blank to keep password',
    'user.form.passwordPlaceholder': 'Set password',
    'user.form.statusLabel': 'Status',
    'user.form.statusHint': 'Status hint',
    'user.form.statusPlaceholder': 'Select status',
    'common.loading': 'Loading',
    'common.back': 'Back',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return dictionary[key] || key;
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
  statusOptions: [{ value: 'ACTIVE', label: 'Active' }],
  tenantOptions: [{ value: 'tenant-1', label: 'Tenant 1' }],
  tenantListLoading: false,
  tenantListError: false,
  tenantErrorMessage: null,
  facilityOptions: [{ value: 'facility-1', label: 'Facility 1' }],
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
  emailError: null,
  phoneError: null,
  passwordError: null,
  statusError: null,
  tenantError: null,
  isTenantLocked: false,
  lockedTenantDisplay: '',
  tenantDisplayLabel: '',
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

  it('renders web/android/ios variants', () => {
    expect(renderWithTheme(<UserFormScreenWeb />).getByTestId('user-form-card')).toBeTruthy();
    expect(renderWithTheme(<UserFormScreenAndroid />).getByTestId('user-form-card')).toBeTruthy();
    expect(renderWithTheme(<UserFormScreenIOS />).getByTestId('user-form-card')).toBeTruthy();
  });

  it('shows loading and load-error states in edit mode', () => {
    useUserFormScreen.mockReturnValue({ ...baseHook, isEdit: true, isLoading: true, user: null });
    expect(renderWithTheme(<UserFormScreenWeb />).getByTestId('user-form-loading')).toBeTruthy();

    useUserFormScreen.mockReturnValue({ ...baseHook, isEdit: true, hasError: true, user: null });
    expect(renderWithTheme(<UserFormScreenWeb />).getByTestId('user-form-load-error')).toBeTruthy();
  });

  it('shows inline offline and submit-error states', () => {
    useUserFormScreen.mockReturnValue({ ...baseHook, isOffline: true });
    expect(renderWithTheme(<UserFormScreenWeb />).getByTestId('user-form-offline')).toBeTruthy();

    useUserFormScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'submit failed',
      user: { id: 'u1', email: 'user@acme.org' },
      isEdit: true,
    });
    expect(renderWithTheme(<UserFormScreenWeb />).getByTestId('user-form-submit-error')).toBeTruthy();
  });

  it('shows tenant and facility load errors', () => {
    useUserFormScreen.mockReturnValue({
      ...baseHook,
      tenantListError: true,
      tenantErrorMessage: 'tenant failed',
    });
    expect(renderWithTheme(<UserFormScreenWeb />).getByTestId('user-form-tenant-error')).toBeTruthy();

    useUserFormScreen.mockReturnValue({
      ...baseHook,
      facilityListError: true,
      facilityErrorMessage: 'facility failed',
    });
    expect(renderWithTheme(<UserFormScreenWeb />).getByTestId('user-form-facility-error')).toBeTruthy();
  });

  it('calls submit and cancel handlers', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    useUserFormScreen.mockReturnValue({ ...baseHook, onSubmit, onCancel });

    const screen = renderWithTheme(<UserFormScreenWeb />);
    fireEvent.press(screen.getByTestId('user-form-submit'));
    fireEvent.press(screen.getByTestId('user-form-cancel'));
    expect(onSubmit).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders readonly tenant display for locked/edit paths', () => {
    useUserFormScreen.mockReturnValue({
      ...baseHook,
      isEdit: true,
      isTenantLocked: true,
      lockedTenantDisplay: 'Tenant 1',
      tenantDisplayLabel: 'Tenant 1',
      user: { id: 'u1', email: 'user@acme.org' },
    });
    expect(renderWithTheme(<UserFormScreenWeb />).getByTestId('user-form-tenant-readonly')).toBeTruthy();
  });

  it('exports component and hook from index', () => {
    expect(UserFormScreenIndex.default).toBeDefined();
    expect(UserFormScreenIndex.useUserFormScreen).toBeDefined();
  });
});
