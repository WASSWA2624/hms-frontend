/**
 * DepartmentFormScreen Component Tests
 * Per testing.mdc: render, loading, error, offline, a11y, interactions
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/DepartmentFormScreen/useDepartmentFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useDepartmentFormScreen = require('@platform/screens/settings/DepartmentFormScreen/useDepartmentFormScreen').default;
const DepartmentFormScreenWeb = require('@platform/screens/settings/DepartmentFormScreen/DepartmentFormScreen.web').default;
const DepartmentFormScreenAndroid = require('@platform/screens/settings/DepartmentFormScreen/DepartmentFormScreen.android').default;
const DepartmentFormScreenIOS = require('@platform/screens/settings/DepartmentFormScreen/DepartmentFormScreen.ios').default;
const DepartmentFormScreenIndex = require('@platform/screens/settings/DepartmentFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'department.form.createTitle': 'Add Department',
    'department.form.editTitle': 'Edit Department',
    'department.form.loadError': 'Failed to load department for editing',
    'department.form.nameLabel': 'Name',
    'department.form.namePlaceholder': 'Enter department name',
    'department.form.nameHint': 'Display name for the department',
    'department.form.nameRequired': 'Department name is required.',
    'department.form.nameTooLong': 'Department name must be at most 255 characters.',
    'department.form.shortNameLabel': 'Short name',
    'department.form.shortNamePlaceholder': 'e.g. ICU',
    'department.form.shortNameHint': 'Optional short label for the department',
    'department.form.shortNameTooLong': 'Short name must be at most 50 characters.',
    'department.form.typeLabel': 'Type',
    'department.form.typePlaceholder': 'Select type',
    'department.form.typeHint': 'Choose department category',
    'department.form.typeRequired': 'Department type is required.',
    'department.form.typeInvalid': 'Select a valid department type.',
    'department.form.activeLabel': 'Active',
    'department.form.activeHint': 'Whether the department is active',
    'department.form.tenantLabel': 'Tenant',
    'department.form.tenantLockedLabel': 'Tenant',
    'department.form.tenantLockedHint': 'Tenant is fixed to your assigned tenant.',
    'department.form.tenantPlaceholder': 'Select tenant',
    'department.form.tenantHint': 'Tenant that owns this department',
    'department.form.tenantRequired': 'Tenant is required when creating a department.',
    'department.form.noTenantsMessage': 'There are no tenants.',
    'department.form.createTenantFirst': 'Create a tenant first to add a department.',
    'department.form.goToTenants': 'Go to Tenants',
    'department.form.goToTenantsHint': 'Open tenants list to create a tenant',
    'department.form.submitCreate': 'Create Department',
    'department.form.submitEdit': 'Save Changes',
    'department.form.submitErrorTitle': 'Unable to save department',
    'department.form.tenantLoadErrorTitle': 'Unable to load tenants',
    'department.form.cancel': 'Cancel',
    'department.form.cancelHint': 'Return without saving',
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
  shortName: '',
  setShortName: jest.fn(),
  departmentType: '',
  setDepartmentType: jest.fn(),
  isActive: true,
  setIsActive: jest.fn(),
  tenantId: '',
  setTenantId: jest.fn(),
  tenantOptions: [],
  tenantListLoading: false,
  tenantListError: false,
  tenantErrorMessage: null,
  nameError: null,
  shortNameError: null,
  typeError: null,
  tenantError: null,
  isTenantLocked: false,
  lockedTenantDisplay: '',
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  department: null,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToTenants: jest.fn(),
  onRetryTenants: jest.fn(),
  typeOptions: [],
  isSubmitDisabled: false,
};

describe('DepartmentFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useDepartmentFormScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenWeb />);
      expect(getByTestId('department-form-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenAndroid />);
      expect(getByTestId('department-form-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenIOS />);
      expect(getByTestId('department-form-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useDepartmentFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        isLoading: true,
        department: null,
      });
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenWeb />);
      expect(getByTestId('department-form-loading')).toBeTruthy();
    });
  });

  describe('load error', () => {
    it('shows load error state (Web)', () => {
      useDepartmentFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        hasError: true,
        department: null,
      });
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenWeb />);
      expect(getByTestId('department-form-load-error')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows offline state (Web)', () => {
      useDepartmentFormScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenWeb />);
      expect(getByTestId('department-form-offline')).toBeTruthy();
    });

    it('shows submit error state (Web)', () => {
      useDepartmentFormScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Submit failed',
      });
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenWeb />);
      expect(getByTestId('department-form-submit-error')).toBeTruthy();
    });
  });

  describe('tenant states', () => {
    it('shows tenant load error (Web)', () => {
      useDepartmentFormScreen.mockReturnValue({
        ...baseHook,
        tenantListError: true,
        tenantErrorMessage: 'Unable to load tenants',
      });
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenWeb />);
      expect(getByTestId('department-form-tenant-error')).toBeTruthy();
    });

    it('shows locked tenant field for tenant-scoped create (Web)', () => {
      useDepartmentFormScreen.mockReturnValue({
        ...baseHook,
        isTenantLocked: true,
        lockedTenantDisplay: 'tenant-1',
      });
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenWeb />);
      expect(getByTestId('department-form-tenant-locked')).toBeTruthy();
    });
  });

  describe('validation', () => {
    it('renders inline validation messages (Web)', () => {
      useDepartmentFormScreen.mockReturnValue({
        ...baseHook,
        hasTenants: true,
        tenantOptions: [{ value: 'tenant-1', label: 'Tenant 1' }],
        nameError: 'Department name is required.',
        typeError: 'Department type is required.',
        tenantError: 'Tenant is required when creating a department.',
      });
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenWeb />);
      expect(getByTestId('department-form-name').props.errorMessage).toBe('Department name is required.');
      expect(getByTestId('department-form-type').props.errorMessage).toBe('Department type is required.');
      expect(getByTestId('department-form-tenant').props.errorMessage).toBe('Tenant is required when creating a department.');
    });
  });

  describe('actions', () => {
    it('calls submit and cancel handlers (Web)', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      useDepartmentFormScreen.mockReturnValue({
        ...baseHook,
        onSubmit,
        onCancel,
      });
      const { getByTestId } = renderWithTheme(<DepartmentFormScreenWeb />);
      fireEvent.press(getByTestId('department-form-submit'));
      fireEvent.press(getByTestId('department-form-cancel'));
      expect(onSubmit).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(DepartmentFormScreenIndex.default).toBeDefined();
      expect(DepartmentFormScreenIndex.useDepartmentFormScreen).toBeDefined();
    });
  });
});
