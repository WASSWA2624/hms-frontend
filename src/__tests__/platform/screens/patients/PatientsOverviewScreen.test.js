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
const PatientsOverviewScreenAndroid = require('@platform/screens/patients/PatientsOverviewScreen/PatientsOverviewScreen.android').default;
const PatientsOverviewScreenIOS = require('@platform/screens/patients/PatientsOverviewScreen/PatientsOverviewScreen.ios').default;

const buildBaseHook = () => ({
  cards: [
    {
      id: 'patients',
      routePath: '/patients/patients',
      label: 'Patients',
      description: 'Core patient demographics and activation state.',
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
          'patients.overview.resourcesTitle': 'Patient Resources',
          'patients.overview.recentPatientsTitle': 'Recent Patients',
          'patients.overview.openResourceButton': 'Open',
          'patients.overview.loadErrorTitle': 'Unable to load patient overview',
          'patients.overview.emptyTitle': 'No patients yet',
          'patients.overview.emptyMessage': 'Register your first patient to start using linked records.',
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
    const { getByTestId } = renderWithTheme(<PatientsOverviewScreenWeb />);

    expect(getByTestId('patients-overview-help-trigger')).toBeTruthy();
    expect(getByTestId('patients-overview-register')).toBeTruthy();
    expect(getByTestId('patients-overview-item-1').props.title).toBe('Jane Doe');
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

  it('opens help modal on android', () => {
    const { getByTestId, queryByTestId } = renderWithTheme(<PatientsOverviewScreenAndroid />);

    expect(queryByTestId('patients-overview-help-modal')).toBeNull();
    fireEvent.press(getByTestId('patients-overview-help-trigger'));
    expect(getByTestId('patients-overview-help-modal')).toBeTruthy();
  });

  it('opens help modal on ios', () => {
    const { getByTestId, queryByTestId } = renderWithTheme(<PatientsOverviewScreenIOS />);

    expect(queryByTestId('patients-overview-help-modal')).toBeNull();
    fireEvent.press(getByTestId('patients-overview-help-trigger'));
    expect(getByTestId('patients-overview-help-modal')).toBeTruthy();
  });
});
