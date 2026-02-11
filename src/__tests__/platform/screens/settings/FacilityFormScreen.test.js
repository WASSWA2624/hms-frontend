/**
 * FacilityFormScreen Component Tests
 * Per testing.mdc: render, loading, error, offline, a11y, interactions
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/FacilityFormScreen/useFacilityFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useFacilityFormScreen = require('@platform/screens/settings/FacilityFormScreen/useFacilityFormScreen').default;
const FacilityFormScreenWeb = require('@platform/screens/settings/FacilityFormScreen/FacilityFormScreen.web').default;
const FacilityFormScreenAndroid = require('@platform/screens/settings/FacilityFormScreen/FacilityFormScreen.android').default;
const FacilityFormScreenIOS = require('@platform/screens/settings/FacilityFormScreen/FacilityFormScreen.ios').default;
const FacilityFormScreenIndex = require('@platform/screens/settings/FacilityFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'facility.form.createTitle': 'Add Facility',
    'facility.form.editTitle': 'Edit Facility',
    'facility.form.loadError': 'Failed to load facility for editing',
    'facility.form.nameLabel': 'Name',
    'facility.form.namePlaceholder': 'Enter facility name',
    'facility.form.nameHint': 'Display name for the facility',
    'facility.form.typeLabel': 'Type',
    'facility.form.typePlaceholder': 'Select type',
    'facility.form.typeHint': 'Choose facility category',
    'facility.form.activeLabel': 'Active',
    'facility.form.activeHint': 'Whether the facility is active',
    'facility.form.tenantLabel': 'Tenant',
    'facility.form.tenantPlaceholder': 'Select tenant',
    'facility.form.tenantHint': 'Tenant that owns this facility',
    'facility.form.noTenantsMessage': 'There are no tenants.',
    'facility.form.createTenantFirst': 'Create a tenant first to add a facility.',
    'facility.form.goToTenants': 'Go to Tenants',
    'facility.form.goToTenantsHint': 'Open tenants list to create a tenant',
    'facility.form.submitCreate': 'Create Facility',
    'facility.form.submitEdit': 'Save Changes',
    'facility.form.submitErrorTitle': 'Unable to save facility',
    'facility.form.tenantLoadErrorTitle': 'Unable to load tenants',
    'facility.form.cancel': 'Cancel',
    'facility.form.cancelHint': 'Return without saving',
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
  name: '',
  setName: jest.fn(),
  facilityType: '',
  setFacilityType: jest.fn(),
  isActive: true,
  setIsActive: jest.fn(),
  tenantId: '',
  setTenantId: jest.fn(),
  tenantOptions: [],
  tenantListLoading: false,
  tenantListError: false,
  tenantErrorMessage: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  facility: null,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToTenants: jest.fn(),
  onRetryTenants: jest.fn(),
  typeOptions: [],
  isSubmitDisabled: false,
};

describe('FacilityFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useFacilityFormScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<FacilityFormScreenWeb />);
      expect(getByTestId('facility-form-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<FacilityFormScreenAndroid />);
      expect(getByTestId('facility-form-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<FacilityFormScreenIOS />);
      expect(getByTestId('facility-form-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useFacilityFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        isLoading: true,
        facility: null,
      });
      const { getByTestId } = renderWithTheme(<FacilityFormScreenWeb />);
      expect(getByTestId('facility-form-loading')).toBeTruthy();
    });
  });

  describe('load error', () => {
    it('shows load error state (Web)', () => {
      useFacilityFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        hasError: true,
        facility: null,
      });
      const { getByTestId } = renderWithTheme(<FacilityFormScreenWeb />);
      expect(getByTestId('facility-form-load-error')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows offline state (Web)', () => {
      useFacilityFormScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<FacilityFormScreenWeb />);
      expect(getByTestId('facility-form-offline')).toBeTruthy();
    });

    it('shows submit error state (Web)', () => {
      useFacilityFormScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Submit failed',
      });
      const { getByTestId } = renderWithTheme(<FacilityFormScreenWeb />);
      expect(getByTestId('facility-form-submit-error')).toBeTruthy();
    });
  });

  describe('tenant states', () => {
    it('shows tenant load error (Web)', () => {
      useFacilityFormScreen.mockReturnValue({
        ...baseHook,
        tenantListError: true,
        tenantErrorMessage: 'Unable to load tenants',
      });
      const { getByTestId } = renderWithTheme(<FacilityFormScreenWeb />);
      expect(getByTestId('facility-form-tenant-error')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('calls submit and cancel handlers (Web)', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      useFacilityFormScreen.mockReturnValue({
        ...baseHook,
        onSubmit,
        onCancel,
      });
      const { getByTestId } = renderWithTheme(<FacilityFormScreenWeb />);
      fireEvent.press(getByTestId('facility-form-submit'));
      fireEvent.press(getByTestId('facility-form-cancel'));
      expect(onSubmit).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(FacilityFormScreenIndex.default).toBeDefined();
      expect(FacilityFormScreenIndex.useFacilityFormScreen).toBeDefined();
    });
  });
});
