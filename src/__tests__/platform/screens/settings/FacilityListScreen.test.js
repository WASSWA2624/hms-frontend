/**
 * FacilityListScreen Component Tests
 * Coverage for facility list states, action visibility, and responsive web mode.
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@platform/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const actual = jest.requireActual('@platform/components');

  const MockListItem = ({
    children,
    title,
    subtitle,
    onView,
    onEdit,
    onDelete,
    viewTestID,
    editTestID,
    deleteTestID,
    testID,
    ...rest
  }) => (
    <View testID={testID} {...rest}>
      <Text>{title}</Text>
      {subtitle ? <Text>{subtitle}</Text> : null}
      {children}
      {onView ? (
        <actual.Button testID={viewTestID} onPress={onView}>
          view
        </actual.Button>
      ) : null}
      {onEdit ? (
        <actual.Button testID={editTestID} onPress={onEdit}>
          edit
        </actual.Button>
      ) : null}
      {onDelete ? (
        <actual.Button testID={deleteTestID} onPress={onDelete}>
          delete
        </actual.Button>
      ) : null}
    </View>
  );

  return {
    ...actual,
    ListItem: MockListItem,
  };
});

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/FacilityListScreen/useFacilityListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useFacilityListScreen = require('@platform/screens/settings/FacilityListScreen/useFacilityListScreen').default;
const FacilityListScreenWeb = require('@platform/screens/settings/FacilityListScreen/FacilityListScreen.web').default;
const FacilityListScreenAndroid = require('@platform/screens/settings/FacilityListScreen/FacilityListScreen.android').default;
const FacilityListScreenIOS = require('@platform/screens/settings/FacilityListScreen/FacilityListScreen.ios').default;
const FacilityListScreenIndex = require('@platform/screens/settings/FacilityListScreen/index.js');
const { STATES } = require('@platform/screens/settings/FacilityListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'facility.list.accessibilityLabel': 'Facilities list',
    'facility.list.searchPlaceholder': 'Search facilities',
    'facility.list.searchLabel': 'Search facilities',
    'facility.list.searchScopeLabel': 'Search field',
    'facility.list.searchScopeAll': 'All fields',
    'facility.list.emptyTitle': 'No facilities',
    'facility.list.emptyMessage': 'You have no facilities.',
    'facility.list.noResultsTitle': 'No matching facilities',
    'facility.list.noResultsMessage': 'Try changing your search text or filters.',
    'facility.list.clearSearchAndFilters': 'Clear search and filters',
    'facility.list.statusLabel': 'Status',
    'facility.list.statusActive': 'Active',
    'facility.list.statusInactive': 'Inactive',
    'facility.list.unnamed': 'Unnamed facility',
    'facility.list.typeValue': 'Type: {{type}}',
    'facility.list.addLabel': 'Add facility',
    'facility.list.addHint': 'Create a new facility',
    'facility.list.view': 'View',
    'facility.list.viewHint': 'Open facility details',
    'facility.list.edit': 'Edit',
    'facility.list.editHint': 'Open facility editor',
    'facility.list.deleteHint': 'Delete this facility',
    'facility.list.itemLabel': 'Facility {{name}}',
    'facility.list.itemHint': 'View details for {{name}}',
    'listScaffold.errorState.title': 'Error',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.loading': 'Loading',
    'common.remove': 'Remove',
    'common.more': 'More',
    'shell.banners.offline.title': 'Offline',
    'shell.banners.offline.message': 'No connection',
  };
  return dictionary[key] || key;
};

const baseHook = {
  items: [],
  search: '',
  searchScope: 'all',
  searchScopeOptions: [{ value: 'all', label: 'All fields' }],
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  hasNoResults: false,
  noticeMessage: null,
  onDismissNotice: jest.fn(),
  onRetry: jest.fn(),
  onSearch: jest.fn(),
  onSearchScopeChange: jest.fn(),
  onClearSearchAndFilters: jest.fn(),
  onFacilityPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

const baseWebHook = {
  pagedItems: [],
  totalItems: 0,
  totalPages: 1,
  page: 1,
  pageSize: 10,
  pageSizeOptions: [{ value: '10', label: '10' }],
  density: 'compact',
  densityOptions: [{ value: 'compact', label: 'Compact' }],
  search: '',
  searchScope: 'all',
  searchScopeOptions: [{ value: 'all', label: 'All fields' }],
  filters: [{ id: 'f1', field: 'name', operator: 'contains', value: '' }],
  filterFieldOptions: [{ value: 'name', label: 'Name' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  sortField: 'name',
  sortDirection: 'asc',
  columnOrder: ['name', 'type', 'status'],
  visibleColumns: ['name', 'type', 'status'],
  selectedFacilityIds: [],
  allPageSelected: false,
  isTableMode: true,
  isTableSettingsOpen: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  noticeMessage: null,
  onDismissNotice: jest.fn(),
  onRetry: jest.fn(),
  onSearch: jest.fn(),
  onSearchScopeChange: jest.fn(),
  onFilterLogicChange: jest.fn(),
  onFilterFieldChange: jest.fn(),
  onFilterOperatorChange: jest.fn(),
  onFilterValueChange: jest.fn(),
  onAddFilter: jest.fn(),
  onRemoveFilter: jest.fn(),
  onClearSearchAndFilters: jest.fn(),
  onSort: jest.fn(),
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onDensityChange: jest.fn(),
  onToggleColumnVisibility: jest.fn(),
  onMoveColumnLeft: jest.fn(),
  onMoveColumnRight: jest.fn(),
  onOpenTableSettings: jest.fn(),
  onCloseTableSettings: jest.fn(),
  onResetTablePreferences: jest.fn(),
  onToggleFacilitySelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  onFacilityPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('FacilityListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useFacilityListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    expect(getByTestId('facility-list-search')).toBeTruthy();
    expect(getByTestId('facility-list-search-scope')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<FacilityListScreenIOS />);
    expect(getByTestId('facility-list-search')).toBeTruthy();
    expect(getByTestId('facility-list-search-scope')).toBeTruthy();
  });

  it('shows loading state (Android)', () => {
    useFacilityListScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    expect(getByTestId('facility-list-loading')).toBeTruthy();
  });

  it('shows empty state (Android)', () => {
    const { getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    expect(getByTestId('facility-list-empty-state')).toBeTruthy();
  });

  it('shows no-results state and clear action (Android)', () => {
    const onClearSearchAndFilters = jest.fn();
    useFacilityListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const { getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    expect(getByTestId('facility-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('facility-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows error state (Android)', () => {
    useFacilityListScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Could not load facilities',
    });
    const { getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    expect(getByTestId('facility-list-error')).toBeTruthy();
  });

  it('shows offline state (Android)', () => {
    useFacilityListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    expect(getByTestId('facility-list-offline')).toBeTruthy();
  });

  it('hides offline state when facility rows are available', () => {
    useFacilityListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      items: [{ id: 'facility-1', name: 'Cached Facility', facility_type: 'CLINIC', is_active: true }],
    });
    const { queryByTestId, getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    expect(queryByTestId('facility-list-offline')).toBeNull();
    expect(getByTestId('facility-list-offline-banner')).toBeTruthy();
    expect(getByTestId('facility-item-facility-1')).toBeTruthy();
  });

  it('renders DataTable on web for desktop/tablet mode', () => {
    useFacilityListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'facility-1', name: 'Facility 1', facility_type: 'HOSPITAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
    expect(getByTestId('facility-table')).toBeTruthy();
  });

  it('renders list items on web for mobile mode', () => {
    useFacilityListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'facility-1', name: 'Facility 1', facility_type: 'HOSPITAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
    expect(getByTestId('facility-item-facility-1')).toBeTruthy();
  });

  it('shows notice message (Android)', () => {
    useFacilityListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'Facility created.',
    });
    const { getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    expect(getByTestId('facility-list-notice')).toBeTruthy();
  });

  it('calls onAdd when add button is pressed (Android)', () => {
    const onAdd = jest.fn();
    useFacilityListScreen.mockReturnValue({ ...baseHook, onAdd });
    const { getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    fireEvent.press(getByTestId('facility-list-add'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides delete action when onDelete is undefined', () => {
    useFacilityListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      items: [{ id: 'facility-1', name: 'Facility 1', facility_type: 'HOSPITAL', is_active: true }],
    });
    const { queryByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    expect(queryByTestId('facility-delete-facility-1')).toBeNull();
  });

  it('shows facility CRUD controls when handlers are available', () => {
    useFacilityListScreen.mockReturnValue({
      ...baseHook,
      items: [{ id: 'facility-1', name: 'Facility 1', facility_type: 'HOSPITAL', is_active: true }],
    });
    const { getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
    expect(getByTestId('facility-view-facility-1')).toBeTruthy();
    expect(getByTestId('facility-edit-facility-1')).toBeTruthy();
    expect(getByTestId('facility-delete-facility-1')).toBeTruthy();
  });

  it('exports component and hook from index and keeps states contract', () => {
    expect(FacilityListScreenIndex.default).toBeDefined();
    expect(FacilityListScreenIndex.useFacilityListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});
