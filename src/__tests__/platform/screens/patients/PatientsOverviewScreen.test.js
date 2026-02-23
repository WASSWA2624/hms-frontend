const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/patients/PatientsOverviewScreen/usePatientsOverviewScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { useI18n } = require('@hooks');
const usePatientsOverviewScreen = require('@platform/screens/patients/PatientsOverviewScreen/usePatientsOverviewScreen').default;

const PatientsOverviewScreenWeb = require('@platform/screens/patients/PatientsOverviewScreen/PatientsOverviewScreen.web').default;
const PatientsOverviewScreen = require('@platform/screens/patients/PatientsOverviewScreen/PatientsOverviewScreen').default;

const buildBaseHook = () => ({
  cards: [
    {
      id: 'directory',
      routePath: '/patients/patients',
      label: 'Patient Directory',
      description: 'Search and open patient workspaces.',
    },
    {
      id: 'legal',
      routePath: '/patients/legal',
      label: 'Legal Hub',
      description: 'Manage global consent and terms operations.',
    },
  ],
  overviewSummary: {
    scope: 'Scope: current tenant only',
    access: 'Access: read and register patients',
    recentCount: 'Recent records shown: 1',
  },
  helpContent: {
    label: 'Open patient registry guidance',
    tooltip: 'Open guidance',
    title: 'How to use patient registry home',
    body: 'Help body',
    items: ['Scope item', 'Sequence item'],
  },
  recentPatients: [
    {
      id: 'patient-1',
      listKey: 'patient-1',
      displayName: 'Jane Doe',
      subtitle: 'FEMALE - 1990-01-01',
      humanFriendlyId: 'PAT-0001',
      tenantLabel: 'Main Tenant (TEN0001)',
      facilityLabel: 'Main Facility (FAC0001)',
    },
  ],
  canCreatePatientRecords: true,
  showRegisterPatientAction: true,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onOpenResource: jest.fn(),
  onOpenPatient: jest.fn(),
  onRegisterPatient: jest.fn(),
});

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

describe('PatientsOverviewScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({
      t: (key) => {
        const messages = {
          'patients.overview.title': 'Patient Registry',
          'patients.overview.description': 'Access patient records and manage linked patient resources from one workspace.',
          'patients.overview.registerPatient': 'Register Patient',
          'patients.overview.registerPatientHint': 'Open the patient registration form',
          'patients.overview.summaryTitle': 'Patient overview summary',
          'patients.overview.quickPathsTitle': 'Quick Paths',
          'patients.overview.openDirectory': 'Open directory',
          'patients.overview.openLegalHub': 'Open legal hub',
          'patients.overview.recentPatientsTitle': 'Recent Patients',
          'patients.overview.loadErrorTitle': 'Unable to load patient overview',
          'patients.overview.emptyTitle': 'No patients yet',
          'patients.overview.emptyMessage': 'Register your first patient to start using linked records.',
          'patients.directory.columns.patientId': 'Patient ID',
          'patients.directory.columns.patient': 'Patient',
          'patients.directory.columns.tenant': 'Tenant',
          'patients.directory.columns.facility': 'Facility',
          'patients.common.list.columnActions': 'Actions',
          'patients.directory.openWorkspace': 'Details',
          'shell.banners.offline.title': 'Offline',
          'shell.banners.offline.message': 'Connection unavailable',
          'common.loading': 'Loading',
          'common.retry': 'Retry',
          'common.retryHint': 'Try again',
        };
        return messages[key] || key;
      },
    });
    usePatientsOverviewScreen.mockReturnValue(buildBaseHook());
  });

  it('renders web overview with help trigger and register action', () => {
    const { getByTestId, getByText } = renderWithTheme(<PatientsOverviewScreenWeb />);

    expect(getByTestId('patients-overview-help-trigger')).toBeTruthy();
    expect(getByTestId('patients-overview-register')).toBeTruthy();
    expect(getByTestId('patients-overview-item-1')).toBeTruthy();
    expect(getByText('Jane Doe')).toBeTruthy();
    expect(getByText('PAT-0001')).toBeTruthy();
    expect(getByText('Main Tenant (TEN0001)')).toBeTruthy();
    expect(getByText('Main Facility (FAC0001)')).toBeTruthy();
  });

  it('hides register action on web when user is read-only', () => {
    const hookValue = buildBaseHook();
    hookValue.showRegisterPatientAction = false;
    usePatientsOverviewScreen.mockReturnValue(hookValue);

    const { queryByTestId } = renderWithTheme(<PatientsOverviewScreenWeb />);
    expect(queryByTestId('patients-overview-register')).toBeNull();
  });

  it('renders loading state on web', () => {
    const hookValue = buildBaseHook();
    hookValue.isLoading = true;
    usePatientsOverviewScreen.mockReturnValue(hookValue);

    const { getByTestId } = renderWithTheme(<PatientsOverviewScreenWeb />);
    expect(getByTestId('patients-overview-loading')).toBeTruthy();
  });

  it('renders recoverable error state on web', () => {
    const hookValue = buildBaseHook();
    hookValue.hasError = true;
    hookValue.errorMessage = 'Unable to load patient overview data.';
    usePatientsOverviewScreen.mockReturnValue(hookValue);

    const { getByTestId } = renderWithTheme(<PatientsOverviewScreenWeb />);

    expect(getByTestId('patients-overview-error')).toBeTruthy();
  });

  it('renders offline recovery state on web', () => {
    const hookValue = buildBaseHook();
    hookValue.isOffline = true;
    usePatientsOverviewScreen.mockReturnValue(hookValue);

    const { getByTestId } = renderWithTheme(<PatientsOverviewScreenWeb />);

    expect(getByTestId('patients-overview-offline')).toBeTruthy();
  });

  it('renders empty state on web when no recent patients are available', () => {
    const hookValue = buildBaseHook();
    hookValue.recentPatients = [];
    hookValue.overviewSummary = {
      ...hookValue.overviewSummary,
      recentCount: 'Recent records shown: 0',
    };
    usePatientsOverviewScreen.mockReturnValue(hookValue);

    const { getByTestId } = renderWithTheme(<PatientsOverviewScreenWeb />);
    expect(getByTestId('patients-overview-empty')).toBeTruthy();
  });

  it('opens help modal on native shared overview screen', () => {
    const { getByTestId, queryByTestId } = renderWithTheme(<PatientsOverviewScreen />);

    expect(queryByTestId('patients-overview-help-modal')).toBeNull();
    fireEvent.press(getByTestId('patients-overview-help-trigger'));
    expect(getByTestId('patients-overview-help-modal')).toBeTruthy();
  });
});
