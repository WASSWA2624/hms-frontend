const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/patients/PatientLegalHubScreen/usePatientLegalHubScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { useI18n } = require('@hooks');
const usePatientLegalHubScreen = require('@platform/screens/patients/PatientLegalHubScreen/usePatientLegalHubScreen').default;
const PatientLegalHubScreen = require('@platform/screens/patients/PatientLegalHubScreen/PatientLegalHubScreen').default;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

describe('PatientLegalHubScreen', () => {
  const mockUuid = '2f1f4f6f-7d89-4f92-9707-2bd5f0f0dbf1';

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    usePatientLegalHubScreen.mockReturnValue({
      activeTab: 'consents',
      tabs: ['consents', 'terms'],
      rows: [
        {
          id: mockUuid,
          title: 'TREATMENT (GRANTED)',
          subtitle: 'Jane Doe (PAT-001)',
          humanFriendlyId: 'CNS-0001',
          record: {},
        },
      ],
      editor: {
        tab: 'consents',
        mode: 'create',
        recordId: '',
        values: {
          patient_id: 'patient-1',
          consent_type: 'TREATMENT',
          status: 'GRANTED',
          granted_at: '2026-02-22',
          revoked_at: '',
        },
        errors: {},
      },
      patientOptions: [{ value: 'patient-1', label: 'Jane Doe (PAT-001)' }],
      userOptions: [],
      consentTypeOptions: [{ value: 'TREATMENT', label: 'Treatment' }],
      consentStatusOptions: [{ value: 'GRANTED', label: 'Granted' }],
      isLoading: false,
      isOffline: false,
      hasError: false,
      errorMessage: null,
      isEntitlementBlocked: false,
      canManagePatientRecords: true,
      canDeletePatientRecords: true,
      onSelectTab: jest.fn(),
      onRetry: jest.fn(),
      onStartCreate: jest.fn(),
      onStartEdit: jest.fn(),
      onCloseEditor: jest.fn(),
      onEditorChange: jest.fn(),
      onSubmitEditor: jest.fn(),
      onDeleteRecord: jest.fn(),
      onGoToSubscriptions: jest.fn(),
    });
  });

  it('renders progressive form guidance, smart date fields, and active tab state', () => {
    const { getByTestId, getByText, queryByText } = renderWithTheme(<PatientLegalHubScreen />);

    expect(getByTestId('patient-legal-form-help')).toBeTruthy();
    expect(getByTestId('patient-legal-granted-at')).toBeTruthy();
    expect(getByTestId('patient-legal-revoked-at')).toBeTruthy();
    expect(getByTestId('patient-legal-tab-consents')).toBeTruthy();
    expect(getByTestId('patient-legal-tab-terms')).toBeTruthy();

    expect(getByText('patients.common.form.helpLabel')).toBeTruthy();
    expect(getByText(/CNS-0001/)).toBeTruthy();
    expect(queryByText(mockUuid)).toBeNull();
  });
});
