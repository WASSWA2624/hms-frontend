/**
 * BranchFormScreen Component Tests
 * Per testing.mdc: render, loading, error, offline, a11y, interactions
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/BranchFormScreen/useBranchFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useBranchFormScreen = require('@platform/screens/settings/BranchFormScreen/useBranchFormScreen').default;
const BranchFormScreenWeb = require('@platform/screens/settings/BranchFormScreen/BranchFormScreen.web').default;
const BranchFormScreenAndroid = require('@platform/screens/settings/BranchFormScreen/BranchFormScreen.android').default;
const BranchFormScreenIOS = require('@platform/screens/settings/BranchFormScreen/BranchFormScreen.ios').default;
const BranchFormScreenIndex = require('@platform/screens/settings/BranchFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'branch.form.createTitle': 'Add Branch',
    'branch.form.editTitle': 'Edit Branch',
    'branch.form.loadError': 'Failed to load branch for editing',
    'branch.form.nameLabel': 'Name',
    'branch.form.namePlaceholder': 'Enter branch name',
    'branch.form.nameHint': 'Display name for the branch',
    'branch.form.activeLabel': 'Active',
    'branch.form.activeHint': 'Whether the branch is active',
    'branch.form.tenantLabel': 'Tenant',
    'branch.form.tenantPlaceholder': 'Select tenant',
    'branch.form.tenantHint': 'Tenant that owns this branch',
    'branch.form.noTenantsMessage': 'There are no tenants.',
    'branch.form.createTenantFirst': 'Create a tenant first to add a branch.',
    'branch.form.goToTenants': 'Go to Tenants',
    'branch.form.goToTenantsHint': 'Open tenants list to create a tenant',
    'branch.form.facilityLabel': 'Facility',
    'branch.form.facilityPlaceholder': 'Select facility',
    'branch.form.facilityHint': 'Optional facility for this branch',
    'branch.form.noFacilitiesMessage': 'There are no facilities.',
    'branch.form.createFacilityOptional': 'You can still create a branch without a facility.',
    'branch.form.goToFacilities': 'Go to Facilities',
    'branch.form.goToFacilitiesHint': 'Open facilities list to create a facility',
    'branch.form.selectTenantFirst': 'Select a tenant to see facilities.',
    'branch.form.submitCreate': 'Create Branch',
    'branch.form.submitEdit': 'Save Changes',
    'branch.form.submitErrorTitle': 'Unable to save branch',
    'branch.form.tenantLoadErrorTitle': 'Unable to load tenants',
    'branch.form.facilityLoadErrorTitle': 'Unable to load facilities',
    'branch.form.cancel': 'Cancel',
    'branch.form.cancelHint': 'Return without saving',
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
  tenantOptions: [],
  tenantListLoading: false,
  tenantListError: false,
  tenantErrorMessage: null,
  facilityOptions: [],
  facilityListLoading: false,
  facilityListError: false,
  facilityErrorMessage: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  branch: null,
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

describe('BranchFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useBranchFormScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<BranchFormScreenWeb />);
      expect(getByTestId('branch-form-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<BranchFormScreenAndroid />);
      expect(getByTestId('branch-form-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<BranchFormScreenIOS />);
      expect(getByTestId('branch-form-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useBranchFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        isLoading: true,
        branch: null,
      });
      const { getByTestId } = renderWithTheme(<BranchFormScreenWeb />);
      expect(getByTestId('branch-form-loading')).toBeTruthy();
    });
  });

  describe('load error', () => {
    it('shows load error state (Web)', () => {
      useBranchFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        hasError: true,
        branch: null,
      });
      const { getByTestId } = renderWithTheme(<BranchFormScreenWeb />);
      expect(getByTestId('branch-form-load-error')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows offline state (Web)', () => {
      useBranchFormScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<BranchFormScreenWeb />);
      expect(getByTestId('branch-form-offline')).toBeTruthy();
    });

    it('shows submit error state (Web)', () => {
      useBranchFormScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Submit failed',
      });
      const { getByTestId } = renderWithTheme(<BranchFormScreenWeb />);
      expect(getByTestId('branch-form-submit-error')).toBeTruthy();
    });
  });

  describe('tenant states', () => {
    it('shows tenant load error (Web)', () => {
      useBranchFormScreen.mockReturnValue({
        ...baseHook,
        tenantListError: true,
        tenantErrorMessage: 'Unable to load tenants',
      });
      const { getByTestId } = renderWithTheme(<BranchFormScreenWeb />);
      expect(getByTestId('branch-form-tenant-error')).toBeTruthy();
    });
  });

  describe('facility states', () => {
    it('shows facility load error (Web)', () => {
      useBranchFormScreen.mockReturnValue({
        ...baseHook,
        facilityListError: true,
        facilityErrorMessage: 'Unable to load facilities',
      });
      const { getByTestId } = renderWithTheme(<BranchFormScreenWeb />);
      expect(getByTestId('branch-form-facility-error')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('calls submit and cancel handlers (Web)', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      useBranchFormScreen.mockReturnValue({
        ...baseHook,
        onSubmit,
        onCancel,
      });
      const { getByTestId } = renderWithTheme(<BranchFormScreenWeb />);
      fireEvent.press(getByTestId('branch-form-submit'));
      fireEvent.press(getByTestId('branch-form-cancel'));
      expect(onSubmit).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(BranchFormScreenIndex.default).toBeDefined();
      expect(BranchFormScreenIndex.useBranchFormScreen).toBeDefined();
    });
  });
});
