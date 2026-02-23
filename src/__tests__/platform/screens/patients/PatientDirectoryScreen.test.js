const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/layouts/RouteLayouts/MainRouteLayout', () => ({
  useMainRouteHeaderActions: jest.fn(),
}));

jest.mock('@platform/screens/patients/PatientDirectoryScreen/usePatientDirectoryScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { useI18n } = require('@hooks');
const { useMainRouteHeaderActions } = require('@platform/layouts/RouteLayouts/MainRouteLayout');
const usePatientDirectoryScreen = require('@platform/screens/patients/PatientDirectoryScreen/usePatientDirectoryScreen').default;
const PatientDirectoryScreen = require('@platform/screens/patients/PatientDirectoryScreen/PatientDirectoryScreen').default;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

const buildHookValue = () => ({
  items: [],
  searchValue: '',
  page: 1,
  pageSize: 20,
  pageSizeOptions: [20, 50, 100],
  sortBy: 'updated_at',
  sortOptions: ['updated_at'],
  order: 'asc',
  orderOptions: ['asc', 'desc'],
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  isLoading: false,
  isOffline: false,
  hasError: false,
  errorMessage: '',
  isEntitlementBlocked: false,
  canCreatePatientRecords: true,
  hasResults: false,
  isFilterPanelOpen: false,
  filters: {
    patient_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    contact: '',
    appointment_status: '',
    created_from: '',
    created_to: '',
    appointment_from: '',
    appointment_to: '',
  },
  dateRangePresets: {
    created: 'CUSTOM',
    appointments: 'CUSTOM',
  },
  hasActiveFilters: false,
  genderFilterValues: ['', 'MALE', 'FEMALE', 'OTHER', 'UNKNOWN'],
  appointmentStatusFilterValues: ['', 'SCHEDULED'],
  datePresetValues: ['CUSTOM', 'TODAY'],
  onSearch: jest.fn(),
  onSortBy: jest.fn(),
  onOrder: jest.fn(),
  onPageSize: jest.fn(),
  onPreviousPage: jest.fn(),
  onNextPage: jest.fn(),
  onOpenPatient: jest.fn(),
  onEditPatient: jest.fn(),
  onDeletePatient: jest.fn(),
  onQuickCreate: jest.fn(),
  onRetry: jest.fn(),
  onGoToSubscriptions: jest.fn(),
  onToggleFilterPanel: jest.fn(),
  onFilterChange: jest.fn(),
  onDateRangePresetChange: jest.fn(),
  onDateRangeValueChange: jest.fn(),
  onClearDateRange: jest.fn(),
  onApplyFilters: jest.fn(),
  onClearFilters: jest.fn(),
});

describe('PatientDirectoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useI18n.mockReturnValue({
      t: (key) => {
        const messages = {
          'patients.directory.refresh': 'Refresh',
          'patients.directory.hideFilters': 'Hide Advanced Filters',
          'patients.directory.showFilters': 'Advanced Filters',
          'patients.directory.createPatient': 'Add New Patient',
          'patients.directory.searchLabel': 'Basic search',
          'patients.directory.searchPlaceholder': 'Search by name, patient ID, contact, tenant, or facility',
          'patients.directory.searchHelpTitle': 'How basic search works',
          'patients.directory.searchHelpTooltip': 'Global search checks all key patient fields with one query.',
          'patients.directory.searchHelpBody': 'Use one global search term to find patients quickly.',
          'patients.directory.searchHelpItems.global': 'Search across patient name and patient ID values.',
          'patients.directory.searchHelpItems.advanced': 'Use Advanced filters for detailed fields.',
          'patients.directory.searchHelpItems.actions': 'Open patient details directly from any matching row.',
          'patients.directory.emptyTitle': 'No patients found',
          'patients.directory.emptyMessage': 'Try adjusting search or filters.',
          'common.loading': 'Loading',
          'common.retry': 'Retry',
        };
        return messages[key] || key;
      },
    });

    useMainRouteHeaderActions.mockReturnValue({
      setBeforeBackActions: jest.fn(),
      clearBeforeBackActions: jest.fn(),
    });

    usePatientDirectoryScreen.mockReturnValue(buildHookValue());
  });

  it('renders without crashing and opens the help modal', () => {
    const { getByTestId, getByText } = renderWithTheme(<PatientDirectoryScreen />);

    expect(getByTestId('patient-directory-search')).toBeTruthy();
    fireEvent.press(getByTestId('patient-directory-search-help'));

    expect(getByTestId('patient-directory-search-help-modal')).toBeTruthy();
    expect(getByText('How basic search works')).toBeTruthy();
  });
});
