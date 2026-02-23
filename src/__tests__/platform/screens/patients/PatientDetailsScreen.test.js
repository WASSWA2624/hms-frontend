const React = require('react');
const { fireEvent, render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/patients/PatientDetailsScreen/usePatientDetailsScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { useI18n } = require('@hooks');
const usePatientDetailsScreen = require('@platform/screens/patients/PatientDetailsScreen/usePatientDetailsScreen').default;
const PatientDetailsScreen = require('@platform/screens/patients/PatientDetailsScreen/PatientDetailsScreen').default;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

const buildResourceSection = (key) => ({
  key,
  config: {
    fields: [],
    getItemTitle: () => '',
    getItemSubtitle: () => '',
  },
  records: [],
  editor: null,
  isLoading: false,
});

describe('PatientDetailsScreen', () => {
  const mockUuid = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key, locale: 'en-US' });
    usePatientDetailsScreen.mockReturnValue({
      patientId: 'patient-1',
      routePatientId: 'PAT-0101',
      initialTabKey: 'details',
      patient: {
        id: mockUuid,
        first_name: 'Jane',
        last_name: 'Doe',
        human_friendly_id: 'PAT-0101',
        tenant_label: 'Alpha Tenant',
        facility_label: 'Central Facility',
      },
      resourceSections: {
        identifiers: buildResourceSection('identifiers'),
        guardians: buildResourceSection('guardians'),
        contacts: buildResourceSection('contacts'),
        addresses: buildResourceSection('addresses'),
        documents: buildResourceSection('documents'),
      },
      resourceKeys: {
        IDENTIFIERS: 'identifiers',
        GUARDIANS: 'guardians',
        CONTACTS: 'contacts',
        ADDRESSES: 'addresses',
        DOCUMENTS: 'documents',
      },
      isSummaryEditMode: true,
      summaryValues: {
        first_name: 'Jane',
        last_name: 'Doe',
        date_of_birth: '1990-01-01',
        gender: 'FEMALE',
        is_active: true,
      },
      summaryErrors: {},
      genderOptions: [{ value: 'FEMALE', label: 'Female' }],
      isLoading: false,
      isOffline: false,
      hasError: false,
      errorMessage: null,
      isEntitlementBlocked: false,
      isPatientDeleted: false,
      canManagePatientRecords: true,
      canDeletePatientRecords: true,
      canManageAllTenants: false,
      onRetry: jest.fn(),
      onGoToSubscriptions: jest.fn(),
      onDeletePatient: jest.fn(),
      onSummaryFieldChange: jest.fn(),
      onStartSummaryEdit: jest.fn(),
      onCancelSummaryEdit: jest.fn(),
      onSaveSummary: jest.fn(),
      onResourceCreate: jest.fn(),
      onResourceEdit: jest.fn(),
      onResourceDelete: jest.fn(),
      onResourceFieldChange: jest.fn(),
      onResourceSubmit: jest.fn(),
      onResourceCancel: jest.fn(),
    });
  });

  it('renders summary editor with new patient-details test IDs and hides UUID in summary labels', () => {
    const { getByTestId, getByText, queryByText } = renderWithTheme(<PatientDetailsScreen />);

    expect(getByTestId('patient-details-page-tab-details')).toBeTruthy();
    expect(getByTestId('patient-details-summary-editor')).toBeTruthy();
    expect(getByText('patients.resources.patients.form.firstNameLabel')).toBeTruthy();
    expect(queryByText(mockUuid)).toBeNull();
  });

  it('switches top nav tab content locally without route navigation', () => {
    const { getByTestId, queryByTestId } = renderWithTheme(<PatientDetailsScreen />);

    expect(queryByTestId('patient-details-page-content-contacts')).toBeNull();
    fireEvent.press(getByTestId('patient-details-page-tab-contacts'));
    expect(getByTestId('patient-details-page-content-contacts')).toBeTruthy();
  });

  it('falls back to readable tab labels when translations are blank', () => {
    useI18n.mockReturnValue({
      t: () => '',
      locale: 'en-US',
    });

    const { getAllByText, getByText } = renderWithTheme(<PatientDetailsScreen />);
    expect(getAllByText('Summary').length).toBeGreaterThan(0);
    expect(getByText('Identity & Reachability')).toBeTruthy();
  });
});
