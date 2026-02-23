const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/patients/PatientWorkspaceScreen/usePatientWorkspaceScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { useI18n } = require('@hooks');
const usePatientWorkspaceScreen = require('@platform/screens/patients/PatientWorkspaceScreen/usePatientWorkspaceScreen').default;
const PatientWorkspaceScreen = require('@platform/screens/patients/PatientWorkspaceScreen/PatientWorkspaceScreen').default;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

describe('PatientWorkspaceScreen', () => {
  const mockUuid = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    usePatientWorkspaceScreen.mockReturnValue({
      patientId: 'patient-1',
      patient: {
        id: mockUuid,
        first_name: 'Jane',
        last_name: 'Doe',
        human_friendly_id: 'PAT-0101',
        tenant_label: 'Alpha Tenant',
        facility_label: 'Central Facility',
      },
      tabs: ['summary', 'identity'],
      activeTab: 'summary',
      panelOptions: ['summary'],
      activePanel: 'summary',
      panelRows: [],
      activePanelConfig: null,
      panelDraft: null,
      mode: 'edit',
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
      canManagePatientRecords: true,
      canDeletePatientRecords: true,
      onSelectTab: jest.fn(),
      onSelectPanel: jest.fn(),
      onRetry: jest.fn(),
      onGoToSubscriptions: jest.fn(),
      onStartCreate: jest.fn(),
      onStartEditRecord: jest.fn(),
      onDeleteRecord: jest.fn(),
      onPanelDraftChange: jest.fn(),
      onPanelSubmit: jest.fn(),
      onClosePanelEditor: jest.fn(),
      onSummaryFieldChange: jest.fn(),
      onStartSummaryEdit: jest.fn(),
      onCancelSummaryEdit: jest.fn(),
      onSaveSummary: jest.fn(),
    });
  });

  it('renders summary field guidance and prefers human-friendly identifiers over UUID display', () => {
    const { getByTestId, getByText, queryByText } = renderWithTheme(<PatientWorkspaceScreen />);

    expect(getByTestId('patient-workspace-summary-help-first-name')).toBeTruthy();
    expect(getByTestId('patient-workspace-summary-help-last-name')).toBeTruthy();
    expect(getByTestId('patient-workspace-summary-help-dob')).toBeTruthy();
    expect(getByTestId('patient-workspace-summary-help-gender')).toBeTruthy();
    expect(getByTestId('patient-workspace-summary-help-active')).toBeTruthy();
    expect(getByTestId('patient-workspace-page-tab-workspace')).toBeTruthy();
    expect(getByText('patients.resources.patients.form.firstNameHint')).toBeTruthy();
    expect(queryByText(mockUuid)).toBeNull();
  });
});
