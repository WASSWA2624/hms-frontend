/**
 * UnitFormScreen Component Tests
 * Per testing.mdc: render, loading, error, offline, a11y, interactions
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UnitFormScreen/useUnitFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUnitFormScreen = require('@platform/screens/settings/UnitFormScreen/useUnitFormScreen').default;
const UnitFormScreenWeb = require('@platform/screens/settings/UnitFormScreen/UnitFormScreen.web').default;
const UnitFormScreenAndroid = require('@platform/screens/settings/UnitFormScreen/UnitFormScreen.android').default;
const UnitFormScreenIOS = require('@platform/screens/settings/UnitFormScreen/UnitFormScreen.ios').default;
const UnitFormScreenIndex = require('@platform/screens/settings/UnitFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'unit.form.createTitle': 'Add Unit',
    'unit.form.editTitle': 'Edit Unit',
    'unit.form.loadError': 'Failed to load unit for editing',
    'unit.form.nameLabel': 'Name',
    'unit.form.namePlaceholder': 'Enter unit name',
    'unit.form.nameHint': 'Display name for the unit',
    'unit.form.activeLabel': 'Active',
    'unit.form.activeHint': 'Whether the unit is active',
    'unit.form.tenantLabel': 'Tenant',
    'unit.form.tenantPlaceholder': 'Select tenant',
    'unit.form.tenantHint': 'Tenant that owns this unit',
    'unit.form.noTenantsMessage': 'There are no tenants.',
    'unit.form.createTenantFirst': 'Create a tenant first to add a unit.',
    'unit.form.goToTenants': 'Go to Tenants',
    'unit.form.goToTenantsHint': 'Open tenants list to create a tenant',
    'unit.form.facilityLabel': 'Facility',
    'unit.form.facilityPlaceholder': 'Select facility',
    'unit.form.facilityHint': 'Optional facility for this unit',
    'unit.form.noFacilitiesMessage': 'There are no facilities.',
    'unit.form.createFacilityOptional': 'You can still create a unit without a facility.',
    'unit.form.goToFacilities': 'Go to Facilities',
    'unit.form.goToFacilitiesHint': 'Open facilities list to create a facility',
    'unit.form.departmentLabel': 'Department',
    'unit.form.departmentPlaceholder': 'Select department',
    'unit.form.departmentHint': 'Optional department for this unit',
    'unit.form.noDepartmentsMessage': 'There are no departments.',
    'unit.form.createDepartmentOptional': 'You can still create a unit without a department.',
    'unit.form.goToDepartments': 'Go to Departments',
    'unit.form.goToDepartmentsHint': 'Open departments list to create a department',
    'unit.form.selectTenantFirst': 'Select a tenant to see facilities.',
    'unit.form.submitCreate': 'Create Unit',
    'unit.form.submitEdit': 'Save Changes',
    'unit.form.submitErrorTitle': 'Unable to save unit',
    'unit.form.tenantLoadErrorTitle': 'Unable to load tenants',
    'unit.form.facilityLoadErrorTitle': 'Unable to load facilities',
    'unit.form.cancel': 'Cancel',
    'unit.form.cancelHint': 'Return without saving',
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
  isActive: true,
  setIsActive: jest.fn(),
  tenantId: '',
  setTenantId: jest.fn(),
  facilityId: '',
  setFacilityId: jest.fn(),
  departmentId: '',
  setDepartmentId: jest.fn(),
  tenantOptions: [],
  tenantListLoading: false,
  tenantListError: false,
  tenantErrorMessage: null,
  facilityOptions: [],
  facilityListLoading: false,
  facilityListError: false,
  facilityErrorMessage: null,
  departmentOptions: [],
  departmentListLoading: false,
  departmentListError: false,
  departmentErrorMessage: null,
  hasTenants: false,
  hasFacilities: false,
  hasDepartments: false,
  isCreateBlocked: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  unit: null,
  lockedTenantDisplay: '',
  tenantDisplayLabel: '',
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToTenants: jest.fn(),
  onGoToFacilities: jest.fn(),
  onGoToDepartments: jest.fn(),
  onRetryTenants: jest.fn(),
  onRetryFacilities: jest.fn(),
  onRetryDepartments: jest.fn(),
  isSubmitDisabled: false,
};

describe('UnitFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useUnitFormScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<UnitFormScreenWeb />);
      expect(getByTestId('unit-form-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<UnitFormScreenAndroid />);
      expect(getByTestId('unit-form-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<UnitFormScreenIOS />);
      expect(getByTestId('unit-form-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useUnitFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        isLoading: true,
        unit: null,
      });
      const { getByTestId } = renderWithTheme(<UnitFormScreenWeb />);
      expect(getByTestId('unit-form-loading')).toBeTruthy();
    });
  });

  describe('load error', () => {
    it('shows load error state (Web)', () => {
      useUnitFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        hasError: true,
        unit: null,
      });
      const { getByTestId } = renderWithTheme(<UnitFormScreenWeb />);
      expect(getByTestId('unit-form-load-error')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows offline state (Web)', () => {
      useUnitFormScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<UnitFormScreenWeb />);
      expect(getByTestId('unit-form-offline')).toBeTruthy();
    });

    it('shows submit error state (Web)', () => {
      useUnitFormScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Submit failed',
      });
      const { getByTestId } = renderWithTheme(<UnitFormScreenWeb />);
      expect(getByTestId('unit-form-submit-error')).toBeTruthy();
    });
  });

  describe('tenant states', () => {
    it('shows tenant load error (Web)', () => {
      useUnitFormScreen.mockReturnValue({
        ...baseHook,
        tenantListError: true,
        tenantErrorMessage: 'Unable to load tenants',
      });
      const { getByTestId } = renderWithTheme(<UnitFormScreenWeb />);
      expect(getByTestId('unit-form-tenant-error')).toBeTruthy();
    });
  });

  describe('facility states', () => {
    it('shows facility load error (Web)', () => {
      useUnitFormScreen.mockReturnValue({
        ...baseHook,
        facilityListError: true,
        facilityErrorMessage: 'Unable to load facilities',
      });
      const { getByTestId } = renderWithTheme(<UnitFormScreenWeb />);
      expect(getByTestId('unit-form-facility-error')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('calls submit and cancel handlers (Web)', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      useUnitFormScreen.mockReturnValue({
        ...baseHook,
        onSubmit,
        onCancel,
      });
      const { getByTestId } = renderWithTheme(<UnitFormScreenWeb />);
      fireEvent.press(getByTestId('unit-form-submit'));
      fireEvent.press(getByTestId('unit-form-cancel'));
      expect(onSubmit).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(UnitFormScreenIndex.default).toBeDefined();
      expect(UnitFormScreenIndex.useUnitFormScreen).toBeDefined();
    });
  });
});
