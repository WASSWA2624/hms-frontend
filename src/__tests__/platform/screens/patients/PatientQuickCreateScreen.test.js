const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/patients/PatientQuickCreateScreen/usePatientQuickCreateScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { useI18n } = require('@hooks');
const usePatientQuickCreateScreen = require('@platform/screens/patients/PatientQuickCreateScreen/usePatientQuickCreateScreen').default;
const PatientQuickCreateScreen = require('@platform/screens/patients/PatientQuickCreateScreen/PatientQuickCreateScreen').default;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

const buildHookState = () => ({
  values: {
    tenant_id: 'tenant-1',
    first_name: 'Jane',
    last_name: 'Doe',
    date_of_birth: '1990-01-01',
    gender: 'FEMALE',
    facility_id: 'facility-1',
    is_active: true,
  },
  errors: {},
  genderOptions: [{ value: 'FEMALE', label: 'Female' }],
  tenantOptions: [{ value: 'tenant-1', label: 'Tenant One' }],
  facilityOptions: [{ value: 'facility-1', label: 'Facility One' }],
  isLoading: false,
  isSubmitting: false,
  isOffline: false,
  hasError: false,
  errorMessage: null,
  isEntitlementBlocked: false,
  tenantErrorCode: null,
  tenantErrorMessage: null,
  facilityErrorCode: null,
  facilityErrorMessage: null,
  isTenantLoading: false,
  isFacilityLoading: false,
  requiresTenantSelection: true,
  canCreatePatientRecords: true,
  isSubmitDisabled: false,
  noticeMessage: '',
  noticeVariant: 'info',
  onChange: jest.fn(),
  onCancel: jest.fn(),
  onRetry: jest.fn(),
  onRetryTenants: jest.fn(),
  onRetryFacilities: jest.fn(),
  onSubmit: jest.fn(),
  onDismissNotice: jest.fn(),
  onGoToSubscriptions: jest.fn(),
});

describe('PatientQuickCreateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    usePatientQuickCreateScreen.mockReturnValue(buildHookState());
  });

  it('renders progressive form guidance and smart date field for quick-create', () => {
    const { getByTestId, getByText } = renderWithTheme(<PatientQuickCreateScreen />);

    expect(getByTestId('patient-quick-create-form-help')).toBeTruthy();
    expect(getByTestId('patient-quick-create-date_of_birth')).toBeTruthy();
    expect(getByTestId('patient-quick-create-first_name')).toBeTruthy();
    expect(getByTestId('patient-quick-create-last_name')).toBeTruthy();
    expect(getByText('patients.common.form.helpLabel')).toBeTruthy();
  });

  it('renders notice snackbar when notice message is present', () => {
    usePatientQuickCreateScreen.mockReturnValue({
      ...buildHookState(),
      noticeMessage: 'Saved',
      noticeVariant: 'success',
    });

    const { getByTestId } = renderWithTheme(<PatientQuickCreateScreen />);
    expect(getByTestId('patient-quick-create-notice')).toBeTruthy();
  });
});
