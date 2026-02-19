const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/scheduling/SchedulingOverviewScreen/useSchedulingOverviewScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { useI18n } = require('@hooks');
const useSchedulingOverviewScreen = require('@platform/screens/scheduling/SchedulingOverviewScreen/useSchedulingOverviewScreen').default;

const SchedulingOverviewScreenWeb = require('@platform/screens/scheduling/SchedulingOverviewScreen/SchedulingOverviewScreen.web').default;
const SchedulingOverviewScreenAndroid = require('@platform/screens/scheduling/SchedulingOverviewScreen/SchedulingOverviewScreen.android').default;
const SchedulingOverviewScreenIOS = require('@platform/screens/scheduling/SchedulingOverviewScreen/SchedulingOverviewScreen.ios').default;

const buildBaseHook = () => ({
  cards: [
    {
      id: 'appointments',
      routePath: '/scheduling/appointments',
      label: 'Appointments',
      description: 'Book and coordinate patient visits.',
    },
  ],
  overviewSummary: {
    scope: 'Scope: current tenant only',
    access: 'Access: read and manage scheduling records',
    recentCount: 'Recent appointments shown: 1',
  },
  helpContent: {
    label: 'Open scheduling guidance',
    tooltip: 'Open guidance',
    title: 'How to use scheduling home',
    body: 'Help body',
    items: ['Scope item', 'Sequence item'],
  },
  recentAppointments: [
    {
      id: 'appointment-1',
      listKey: 'appointment-1',
      displayName: 'Appointment for Jane Doe',
      subtitle: 'CONFIRMED - 2026-02-19T09:00:00.000Z',
    },
  ],
  canCreateSchedulingRecords: true,
  showCreateAppointmentAction: true,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onOpenResource: jest.fn(),
  onOpenAppointment: jest.fn(),
  onCreateAppointment: jest.fn(),
});

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

describe('SchedulingOverviewScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({
      t: (key) => {
        const messages = {
          'scheduling.overview.title': 'Scheduling',
          'scheduling.overview.description': 'Manage appointments and queues.',
          'scheduling.overview.createAppointment': 'Create Appointment',
          'scheduling.overview.createAppointmentHint': 'Open appointment form',
          'scheduling.overview.summaryTitle': 'Scheduling overview summary',
          'scheduling.overview.resourcesTitle': 'Scheduling Resources',
          'scheduling.overview.recentAppointmentsTitle': 'Recent Appointments',
          'scheduling.overview.openResourceButton': 'Open',
          'scheduling.overview.loadErrorTitle': 'Unable to load scheduling overview',
          'shell.banners.offline.title': 'Offline',
          'shell.banners.offline.message': 'Connection unavailable',
          'common.loading': 'Loading',
          'common.retry': 'Retry',
          'common.retryHint': 'Try again',
        };
        return messages[key] || key;
      },
    });
    useSchedulingOverviewScreen.mockReturnValue(buildBaseHook());
  });

  it('renders web overview with help trigger and create action', () => {
    const { getByTestId } = renderWithTheme(<SchedulingOverviewScreenWeb />);

    expect(getByTestId('scheduling-overview-help-trigger')).toBeTruthy();
    expect(getByTestId('scheduling-overview-create-appointment')).toBeTruthy();
    expect(getByTestId('scheduling-overview-item-1').props.title).toBe('Appointment for Jane Doe');
  });

  it('hides create action on web when user is read-only', () => {
    const hookValue = buildBaseHook();
    hookValue.showCreateAppointmentAction = false;
    useSchedulingOverviewScreen.mockReturnValue(hookValue);

    const { queryByTestId } = renderWithTheme(<SchedulingOverviewScreenWeb />);
    expect(queryByTestId('scheduling-overview-create-appointment')).toBeNull();
  });

  it('opens help modal on android', () => {
    const { getByTestId, queryByTestId } = renderWithTheme(<SchedulingOverviewScreenAndroid />);

    expect(queryByTestId('scheduling-overview-help-modal')).toBeNull();
    fireEvent.press(getByTestId('scheduling-overview-help-trigger'));
    expect(getByTestId('scheduling-overview-help-modal')).toBeTruthy();
  });

  it('opens help modal on ios', () => {
    const { getByTestId, queryByTestId } = renderWithTheme(<SchedulingOverviewScreenIOS />);

    expect(queryByTestId('scheduling-overview-help-modal')).toBeNull();
    fireEvent.press(getByTestId('scheduling-overview-help-trigger'));
    expect(getByTestId('scheduling-overview-help-modal')).toBeTruthy();
  });
});
