/**
 * AddressFormScreen Component Tests
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/AddressFormScreen/useAddressFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useAddressFormScreen = require('@platform/screens/settings/AddressFormScreen/useAddressFormScreen').default;
const AddressFormScreenWeb = require('@platform/screens/settings/AddressFormScreen/AddressFormScreen.web').default;
const AddressFormScreenAndroid = require('@platform/screens/settings/AddressFormScreen/AddressFormScreen.android').default;
const AddressFormScreenIOS = require('@platform/screens/settings/AddressFormScreen/AddressFormScreen.ios').default;
const AddressFormScreenIndex = require('@platform/screens/settings/AddressFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const m = {
    'address.form.createTitle': 'Add Address',
    'address.form.editTitle': 'Edit Address',
    'address.form.loadError': 'Failed to load address for editing',
    'address.form.submitErrorTitle': 'Unable to save address',
    'address.form.cancel': 'Cancel',
    'address.form.cancelHint': 'Return without saving',
    'address.form.submitCreate': 'Create Address',
    'address.form.submitEdit': 'Save Changes',
    'address.form.blockedMessage': 'Blocked',
    'address.form.tenantLabel': 'Tenant',
    'address.form.tenantHint': 'Tenant hint',
    'address.form.tenantPlaceholder': 'Select tenant',
    'address.form.tenantLockedHint': 'Tenant is locked',
    'address.form.noTenantsMessage': 'No tenants',
    'address.form.createTenantFirst': 'Create tenant first',
    'address.form.goToTenants': 'Go to Tenants',
    'address.form.goToTenantsHint': 'Open tenants',
    'address.form.tenantLoadErrorTitle': 'Unable to load tenants',
    'address.form.facilityLabel': 'Facility',
    'address.form.facilityHint': 'Facility hint',
    'address.form.facilityPlaceholder': 'Select facility',
    'address.form.noFacilitiesMessage': 'No facilities',
    'address.form.goToFacilities': 'Go to Facilities',
    'address.form.goToFacilitiesHint': 'Open facilities',
    'address.form.facilityLoadErrorTitle': 'Unable to load facilities',
    'address.form.branchLabel': 'Branch',
    'address.form.branchHint': 'Branch hint',
    'address.form.branchPlaceholder': 'Select branch',
    'address.form.noBranchesMessage': 'No branches',
    'address.form.goToBranches': 'Go to Branches',
    'address.form.goToBranchesHint': 'Open branches',
    'address.form.branchLoadErrorTitle': 'Unable to load branches',
    'address.form.selectTenantFirst': 'Select a tenant first',
    'address.form.typeLabel': 'Type',
    'address.form.typeHint': 'Type hint',
    'address.form.typePlaceholder': 'Select type',
    'address.form.line1Label': 'Line 1',
    'address.form.line1Hint': 'Line 1 hint',
    'address.form.line1Placeholder': 'Enter line 1',
    'address.form.line2Label': 'Line 2',
    'address.form.line2Hint': 'Line 2 hint',
    'address.form.line2Placeholder': 'Enter line 2',
    'address.form.cityLabel': 'City',
    'address.form.cityHint': 'City hint',
    'address.form.cityPlaceholder': 'Enter city',
    'address.form.stateLabel': 'State',
    'address.form.stateHint': 'State hint',
    'address.form.statePlaceholder': 'Enter state',
    'address.form.postalCodeLabel': 'Postal code',
    'address.form.postalCodeHint': 'Postal code hint',
    'address.form.postalCodePlaceholder': 'Enter postal code',
    'address.form.countryLabel': 'Country',
    'address.form.countryHint': 'Country hint',
    'address.form.countryPlaceholder': 'Enter country',
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
  addressType: '',
  setAddressType: jest.fn(),
  addressTypeOptions: [{ value: 'HOME', label: 'Home' }],
  line1: '',
  setLine1: jest.fn(),
  line2: '',
  setLine2: jest.fn(),
  city: '',
  setCity: jest.fn(),
  stateValue: '',
  setStateValue: jest.fn(),
  postalCode: '',
  setPostalCode: jest.fn(),
  country: '',
  setCountry: jest.fn(),
  tenantId: 'tenant-1',
  setTenantId: jest.fn(),
  facilityId: '',
  setFacilityId: jest.fn(),
  branchId: '',
  setBranchId: jest.fn(),
  tenantOptions: [{ value: 'tenant-1', label: 'Tenant 1' }],
  facilityOptions: [{ value: 'facility-1', label: 'Facility 1' }],
  branchOptions: [{ value: 'branch-1', label: 'Branch 1' }],
  tenantListLoading: false,
  tenantListError: false,
  tenantErrorMessage: null,
  facilityListLoading: false,
  facilityListError: false,
  facilityErrorMessage: null,
  branchListLoading: false,
  branchListError: false,
  branchErrorMessage: null,
  hasTenants: true,
  hasFacilities: true,
  hasBranches: true,
  isCreateBlocked: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  address: null,
  addressTypeError: null,
  line1Error: null,
  line2Error: null,
  cityError: null,
  stateError: null,
  postalCodeError: null,
  countryError: null,
  tenantError: null,
  isTenantLocked: false,
  lockedTenantDisplay: '',
  tenantDisplayLabel: '',
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToTenants: jest.fn(),
  onGoToFacilities: jest.fn(),
  onGoToBranches: jest.fn(),
  onRetryTenants: jest.fn(),
  onRetryFacilities: jest.fn(),
  onRetryBranches: jest.fn(),
  isSubmitDisabled: false,
};

describe('AddressFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useAddressFormScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Web)', () => {
    const { getByTestId } = renderWithTheme(<AddressFormScreenWeb />);
    expect(getByTestId('address-form-card')).toBeTruthy();
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<AddressFormScreenAndroid />);
    expect(getByTestId('address-form-card')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<AddressFormScreenIOS />);
    expect(getByTestId('address-form-card')).toBeTruthy();
  });

  it('shows loading state (Web)', () => {
    useAddressFormScreen.mockReturnValue({
      ...baseHook,
      isEdit: true,
      isLoading: true,
      address: null,
    });

    const { getByTestId } = renderWithTheme(<AddressFormScreenWeb />);
    expect(getByTestId('address-form-loading')).toBeTruthy();
  });

  it('shows load error state (Web)', () => {
    useAddressFormScreen.mockReturnValue({
      ...baseHook,
      isEdit: true,
      hasError: true,
      address: null,
    });

    const { getByTestId } = renderWithTheme(<AddressFormScreenWeb />);
    expect(getByTestId('address-form-load-error')).toBeTruthy();
  });

  it('shows offline banner (Web)', () => {
    useAddressFormScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });

    const { getByTestId } = renderWithTheme(<AddressFormScreenWeb />);
    expect(getByTestId('address-form-offline')).toBeTruthy();
  });

  it('shows submit error banner (Web)', () => {
    useAddressFormScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Submit failed',
      address: { id: 'a1', line1: 'Main' },
    });

    const { getByTestId } = renderWithTheme(<AddressFormScreenWeb />);
    expect(getByTestId('address-form-submit-error')).toBeTruthy();
  });

  it('shows tenant load error (Web)', () => {
    useAddressFormScreen.mockReturnValue({
      ...baseHook,
      tenantListError: true,
      tenantErrorMessage: 'Unable to load tenants',
    });

    const { getByTestId } = renderWithTheme(<AddressFormScreenWeb />);
    expect(getByTestId('address-form-tenant-error')).toBeTruthy();
  });

  it('shows facility load error (Web)', () => {
    useAddressFormScreen.mockReturnValue({
      ...baseHook,
      facilityListError: true,
      facilityErrorMessage: 'Unable to load facilities',
    });

    const { getByTestId } = renderWithTheme(<AddressFormScreenWeb />);
    expect(getByTestId('address-form-facility-error')).toBeTruthy();
  });

  it('shows branch load error (Web)', () => {
    useAddressFormScreen.mockReturnValue({
      ...baseHook,
      branchListError: true,
      branchErrorMessage: 'Unable to load branches',
    });

    const { getByTestId } = renderWithTheme(<AddressFormScreenWeb />);
    expect(getByTestId('address-form-branch-error')).toBeTruthy();
  });

  it('shows go-to-branches action when tenant is selected and no branches exist', () => {
    const onGoToBranches = jest.fn();
    useAddressFormScreen.mockReturnValue({
      ...baseHook,
      hasBranches: false,
      onGoToBranches,
      branchOptions: [],
    });

    const { getByTestId } = renderWithTheme(<AddressFormScreenWeb />);
    fireEvent.press(getByTestId('address-form-go-to-branches'));
    expect(onGoToBranches).toHaveBeenCalled();
  });

  it('calls submit and cancel handlers (Web)', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    useAddressFormScreen.mockReturnValue({
      ...baseHook,
      onSubmit,
      onCancel,
    });

    const { getByTestId } = renderWithTheme(<AddressFormScreenWeb />);
    fireEvent.press(getByTestId('address-form-submit'));
    fireEvent.press(getByTestId('address-form-cancel'));
    expect(onSubmit).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it('exports component and hook from index', () => {
    expect(AddressFormScreenIndex.default).toBeDefined();
    expect(AddressFormScreenIndex.useAddressFormScreen).toBeDefined();
  });
});
