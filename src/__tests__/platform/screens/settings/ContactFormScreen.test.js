/**
 * ContactFormScreen Component Tests
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/ContactFormScreen/useContactFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useContactFormScreen = require('@platform/screens/settings/ContactFormScreen/useContactFormScreen').default;
const ContactFormScreenWeb = require('@platform/screens/settings/ContactFormScreen/ContactFormScreen.web').default;
const ContactFormScreenAndroid = require('@platform/screens/settings/ContactFormScreen/ContactFormScreen.android').default;
const ContactFormScreenIOS = require('@platform/screens/settings/ContactFormScreen/ContactFormScreen.ios').default;
const ContactFormScreenIndex = require('@platform/screens/settings/ContactFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const m = {
    'contact.form.createTitle': 'Add Contact',
    'contact.form.editTitle': 'Edit Contact',
    'contact.form.loadError': 'Failed to load contact for editing',
    'contact.form.submitErrorTitle': 'Unable to save contact',
    'contact.form.cancel': 'Cancel',
    'contact.form.cancelHint': 'Return without saving',
    'contact.form.submitCreate': 'Create Contact',
    'contact.form.submitEdit': 'Save Changes',
    'contact.form.blockedMessage': 'Blocked',
    'contact.form.tenantLabel': 'Tenant',
    'contact.form.tenantHint': 'Tenant hint',
    'contact.form.tenantPlaceholder': 'Select tenant',
    'contact.form.tenantLockedHint': 'Tenant is locked',
    'contact.form.tenantScopedHint': 'Tenant is scoped',
    'contact.form.noTenantsMessage': 'No tenants',
    'contact.form.createTenantFirst': 'Create tenant first',
    'contact.form.goToTenants': 'Go to Tenants',
    'contact.form.goToTenantsHint': 'Open tenants',
    'contact.form.tenantLoadErrorTitle': 'Unable to load tenants',
    'contact.form.valueLabel': 'Value',
    'contact.form.valueHint': 'Contact value hint',
    'contact.form.valuePlaceholder': 'Email, phone, etc.',
    'contact.form.typeLabel': 'Type',
    'contact.form.typeHint': 'Contact type hint',
    'contact.form.typePlaceholder': 'Select type',
    'contact.form.primaryLabel': 'Primary',
    'contact.form.primaryHint': 'Primary contact',
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
  value: '',
  setValue: jest.fn(),
  contactType: '',
  setContactType: jest.fn(),
  contactTypeOptions: [{ value: 'EMAIL', label: 'Email' }],
  isPrimary: false,
  setIsPrimary: jest.fn(),
  tenantId: 'tenant-1',
  setTenantId: jest.fn(),
  tenantOptions: [{ value: 'tenant-1', label: 'Tenant 1' }],
  tenantListLoading: false,
  tenantListError: false,
  tenantErrorMessage: null,
  hasTenants: true,
  isCreateBlocked: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  contact: null,
  valueError: null,
  contactTypeError: null,
  tenantError: null,
  isTenantLocked: false,
  lockedTenantDisplay: '',
  tenantDisplayLabel: '',
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToTenants: jest.fn(),
  onRetryTenants: jest.fn(),
  isSubmitDisabled: false,
};

describe('ContactFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useContactFormScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Web)', () => {
    const { getByTestId } = renderWithTheme(<ContactFormScreenWeb />);
    expect(getByTestId('contact-form-card')).toBeTruthy();
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<ContactFormScreenAndroid />);
    expect(getByTestId('contact-form-card')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<ContactFormScreenIOS />);
    expect(getByTestId('contact-form-card')).toBeTruthy();
  });

  it('shows loading state (Web)', () => {
    useContactFormScreen.mockReturnValue({
      ...baseHook,
      isEdit: true,
      isLoading: true,
      contact: null,
    });

    const { getByTestId } = renderWithTheme(<ContactFormScreenWeb />);
    expect(getByTestId('contact-form-loading')).toBeTruthy();
  });

  it('shows load error state (Web)', () => {
    useContactFormScreen.mockReturnValue({
      ...baseHook,
      isEdit: true,
      hasError: true,
      contact: null,
    });

    const { getByTestId } = renderWithTheme(<ContactFormScreenWeb />);
    expect(getByTestId('contact-form-load-error')).toBeTruthy();
  });

  it('shows offline banner (Web)', () => {
    useContactFormScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });

    const { getByTestId } = renderWithTheme(<ContactFormScreenWeb />);
    expect(getByTestId('contact-form-offline')).toBeTruthy();
  });

  it('shows submit error banner (Web)', () => {
    useContactFormScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Submit failed',
      contact: { id: 'c1', value: 'contact@acme.org' },
    });

    const { getByTestId } = renderWithTheme(<ContactFormScreenWeb />);
    expect(getByTestId('contact-form-submit-error')).toBeTruthy();
  });

  it('shows tenant load error (Web)', () => {
    useContactFormScreen.mockReturnValue({
      ...baseHook,
      tenantListError: true,
      tenantErrorMessage: 'Unable to load tenants',
    });

    const { getByTestId } = renderWithTheme(<ContactFormScreenWeb />);
    expect(getByTestId('contact-form-tenant-error')).toBeTruthy();
  });

  it('calls submit and cancel handlers (Web)', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    useContactFormScreen.mockReturnValue({
      ...baseHook,
      onSubmit,
      onCancel,
    });

    const { getByTestId } = renderWithTheme(<ContactFormScreenWeb />);
    fireEvent.press(getByTestId('contact-form-submit'));
    fireEvent.press(getByTestId('contact-form-cancel'));
    expect(onSubmit).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows go-to-tenants action when no tenants exist', () => {
    const onGoToTenants = jest.fn();
    useContactFormScreen.mockReturnValue({
      ...baseHook,
      hasTenants: false,
      onGoToTenants,
      tenantOptions: [],
    });

    const { getByTestId } = renderWithTheme(<ContactFormScreenWeb />);
    fireEvent.press(getByTestId('contact-form-go-to-tenants'));
    expect(onGoToTenants).toHaveBeenCalled();
  });

  it('renders readonly tenant field when tenant is locked', () => {
    useContactFormScreen.mockReturnValue({
      ...baseHook,
      isTenantLocked: true,
      lockedTenantDisplay: 'Tenant 1',
      tenantDisplayLabel: 'Tenant 1',
    });

    const { getByTestId } = renderWithTheme(<ContactFormScreenWeb />);
    expect(getByTestId('contact-form-tenant-readonly')).toBeTruthy();
  });

  it('exports component and hook from index', () => {
    expect(ContactFormScreenIndex.default).toBeDefined();
    expect(ContactFormScreenIndex.useContactFormScreen).toBeDefined();
  });
});