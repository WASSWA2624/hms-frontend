/**
 * BedListScreen Component Tests
 * Coverage for bed list states, action visibility, and responsive web mode.
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

jest.mock('@platform/screens/settings/BedListScreen/useBedListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useBedListScreen = require('@platform/screens/settings/BedListScreen/useBedListScreen').default;
const BedListScreenWeb = require('@platform/screens/settings/BedListScreen/BedListScreen.web').default;
const BedListScreenAndroid = require('@platform/screens/settings/BedListScreen/BedListScreen.android').default;
const BedListScreenIOS = require('@platform/screens/settings/BedListScreen/BedListScreen.ios').default;
const BedListScreenIndex = require('@platform/screens/settings/BedListScreen/index.js');
const { STATES } = require('@platform/screens/settings/BedListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'bed.list.accessibilityLabel': 'Beds list',
    'bed.list.searchPlaceholder': 'Search beds',
    'bed.list.searchLabel': 'Search beds',
    'bed.list.searchScopeLabel': 'Search field',
    'bed.list.searchScopeAll': 'All fields',
    'bed.list.emptyTitle': 'No beds',
    'bed.list.emptyMessage': 'You have no beds.',
    'bed.list.noResultsTitle': 'No matching beds',
    'bed.list.noResultsMessage': 'Try changing your search text or filters.',
    'bed.list.clearSearchAndFilters': 'Clear search and filters',
    'bed.list.statusLabel': 'Status',
    'bed.list.statusAvailable': 'Available',
    'bed.list.statusOccupied': 'Occupied',
    'bed.list.statusReserved': 'Reserved',
    'bed.list.statusOutOfService': 'Out of service',
    'bed.list.unnamed': 'Unnamed bed',
    'bed.list.columnWard': 'Ward',
    'bed.list.contextValue': '{{tenant}} - {{facility}} - {{ward}} - {{room}}',
    'bed.list.partialContextValue': '{{tenant}} - {{facility}} - {{ward}}',
    'bed.list.shortContextValue': '{{first}} - {{second}}',
    'bed.list.addLabel': 'Add bed',
    'bed.list.addHint': 'Create a new bed',
    'bed.list.view': 'View',
    'bed.list.viewHint': 'Open bed details',
    'bed.list.edit': 'Edit',
    'bed.list.editHint': 'Open bed editor',
    'bed.list.deleteHint': 'Delete this bed',
    'bed.list.itemLabel': 'Bed {{name}}',
    'bed.list.itemHint': 'View details for {{name}}',
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
  resolveBedLabelText: jest.fn((bed) => bed?.label || 'Unnamed bed'),
  resolveBedTenantText: jest.fn((bed) => bed?.tenant_name || 'Tenant'),
  resolveBedFacilityText: jest.fn((bed) => bed?.facility_name || 'Facility'),
  resolveBedWardText: jest.fn((bed) => bed?.ward_name || 'Ward'),
  resolveBedRoomText: jest.fn((bed) => bed?.room_name || 'Room'),
  resolveBedStatusText: jest.fn((bed) => bed?.status || 'AVAILABLE'),
  onBedPress: jest.fn(),
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
  filters: [{ id: 'f1', field: 'label', operator: 'contains', value: '' }],
  filterFieldOptions: [{ value: 'label', label: 'Label' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  sortField: 'label',
  sortDirection: 'asc',
  columnOrder: ['label', 'tenant', 'facility', 'ward', 'room', 'status'],
  visibleColumns: ['label', 'tenant', 'facility', 'ward', 'room', 'status'],
  selectedBedIds: [],
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
  onToggleBedSelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  resolveBedLabelText: jest.fn((bed) => bed?.label || 'Unnamed bed'),
  resolveBedTenantText: jest.fn(() => 'Tenant'),
  resolveBedFacilityText: jest.fn(() => 'Facility'),
  resolveBedWardText: jest.fn(() => 'Ward'),
  resolveBedRoomText: jest.fn(() => 'Room'),
  resolveBedStatusText: jest.fn((bed) => bed?.status || 'AVAILABLE'),
  onBedPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('BedListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useBedListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<BedListScreenAndroid />);
    expect(getByTestId('bed-list-search')).toBeTruthy();
    expect(getByTestId('bed-list-search-scope')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<BedListScreenIOS />);
    expect(getByTestId('bed-list-search')).toBeTruthy();
    expect(getByTestId('bed-list-search-scope')).toBeTruthy();
  });

  it('shows loading state (Android)', () => {
    useBedListScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<BedListScreenAndroid />);
    expect(getByTestId('bed-list-loading')).toBeTruthy();
  });

  it('shows empty state (Android)', () => {
    const { getByTestId } = renderWithTheme(<BedListScreenAndroid />);
    expect(getByTestId('bed-list-empty-state')).toBeTruthy();
  });

  it('shows no-results state and clear action (Android)', () => {
    const onClearSearchAndFilters = jest.fn();
    useBedListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const { getByTestId } = renderWithTheme(<BedListScreenAndroid />);
    expect(getByTestId('bed-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('bed-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows error state (Android)', () => {
    useBedListScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Could not load beds',
    });
    const { getByTestId } = renderWithTheme(<BedListScreenAndroid />);
    expect(getByTestId('bed-list-error')).toBeTruthy();
  });

  it('shows offline state (Android)', () => {
    useBedListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<BedListScreenAndroid />);
    expect(getByTestId('bed-list-offline')).toBeTruthy();
  });

  it('hides offline state when bed rows are available', () => {
    useBedListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      items: [{ id: 'bed-1', label: 'Cached Bed', status: 'AVAILABLE' }],
    });
    const { queryByTestId, getByTestId } = renderWithTheme(<BedListScreenAndroid />);
    expect(queryByTestId('bed-list-offline')).toBeNull();
    expect(getByTestId('bed-list-offline-banner')).toBeTruthy();
    expect(getByTestId('bed-item-bed-1')).toBeTruthy();
  });

  it('renders DataTable on web for desktop/tablet mode', () => {
    useBedListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'bed-1', label: 'Bed 1', status: 'AVAILABLE' }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<BedListScreenWeb />);
    expect(getByTestId('bed-table')).toBeTruthy();
  });

  it('renders list items on web for mobile mode', () => {
    useBedListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'bed-1', label: 'Bed 1', status: 'AVAILABLE' }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<BedListScreenWeb />);
    expect(getByTestId('bed-item-bed-1')).toBeTruthy();
  });

  it('shows notice message (Android)', () => {
    useBedListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'Bed created.',
    });
    const { getByTestId } = renderWithTheme(<BedListScreenAndroid />);
    expect(getByTestId('bed-list-notice')).toBeTruthy();
  });

  it('calls onAdd when add button is pressed (Android)', () => {
    const onAdd = jest.fn();
    useBedListScreen.mockReturnValue({ ...baseHook, onAdd });
    const { getByTestId } = renderWithTheme(<BedListScreenAndroid />);
    fireEvent.press(getByTestId('bed-list-add'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides delete action when onDelete is undefined', () => {
    useBedListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      items: [{ id: 'bed-1', label: 'Bed 1', status: 'AVAILABLE' }],
    });
    const { queryByTestId } = renderWithTheme(<BedListScreenAndroid />);
    expect(queryByTestId('bed-delete-bed-1')).toBeNull();
  });

  it('shows bed CRUD controls when handlers are available', () => {
    useBedListScreen.mockReturnValue({
      ...baseHook,
      items: [{ id: 'bed-1', label: 'Bed 1', status: 'AVAILABLE' }],
    });
    const { getByTestId } = renderWithTheme(<BedListScreenAndroid />);
    expect(getByTestId('bed-view-bed-1')).toBeTruthy();
    expect(getByTestId('bed-edit-bed-1')).toBeTruthy();
    expect(getByTestId('bed-delete-bed-1')).toBeTruthy();
  });

  it('exports component and hook from index and keeps states contract', () => {
    expect(BedListScreenIndex.default).toBeDefined();
    expect(BedListScreenIndex.useBedListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});
