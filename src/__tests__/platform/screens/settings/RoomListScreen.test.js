/**
 * RoomListScreen Component Tests
 * Coverage for room list states, action visibility, and responsive web mode.
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

jest.mock('@platform/screens/settings/RoomListScreen/useRoomListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useRoomListScreen = require('@platform/screens/settings/RoomListScreen/useRoomListScreen').default;
const RoomListScreenWeb = require('@platform/screens/settings/RoomListScreen/RoomListScreen.web').default;
const RoomListScreenAndroid = require('@platform/screens/settings/RoomListScreen/RoomListScreen.android').default;
const RoomListScreenIOS = require('@platform/screens/settings/RoomListScreen/RoomListScreen.ios').default;
const RoomListScreenIndex = require('@platform/screens/settings/RoomListScreen/index.js');
const { STATES } = require('@platform/screens/settings/RoomListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'room.list.accessibilityLabel': 'Rooms list',
    'room.list.searchPlaceholder': 'Search rooms',
    'room.list.searchLabel': 'Search rooms',
    'room.list.searchScopeLabel': 'Search field',
    'room.list.searchScopeAll': 'All fields',
    'room.list.emptyTitle': 'No rooms',
    'room.list.emptyMessage': 'You have no rooms.',
    'room.list.noResultsTitle': 'No matching rooms',
    'room.list.noResultsMessage': 'Try changing your search text or filters.',
    'room.list.clearSearchAndFilters': 'Clear search and filters',
    'room.list.floorLabel': 'Floor',
    'room.list.unnamed': 'Unnamed room',
    'room.list.columnWard': 'Ward',
    'room.list.contextValue': '{{tenant}} • {{facility}} • {{ward}}',
    'room.list.partialContextValue': '{{first}} • {{second}}',
    'room.list.addLabel': 'Add room',
    'room.list.addHint': 'Create a new room',
    'room.list.view': 'View',
    'room.list.viewHint': 'Open room details',
    'room.list.edit': 'Edit',
    'room.list.editHint': 'Open room editor',
    'room.list.deleteHint': 'Delete this room',
    'room.list.itemLabel': 'Room {{name}}',
    'room.list.itemHint': 'View details for {{name}}',
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
  resolveRoomNameText: jest.fn((room) => room?.name || 'Unnamed room'),
  resolveRoomTenantText: jest.fn((room) => room?.tenant_name || 'Tenant'),
  resolveRoomFacilityText: jest.fn((room) => room?.facility_name || 'Facility'),
  resolveRoomWardText: jest.fn((room) => room?.ward_name || 'Ward'),
  resolveRoomFloorText: jest.fn((room) => room?.floor || '1'),
  onRoomPress: jest.fn(),
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
  columnOrder: ['name', 'tenant', 'facility', 'ward', 'floor'],
  visibleColumns: ['name', 'tenant', 'facility', 'ward', 'floor'],
  selectedRoomIds: [],
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
  onToggleRoomSelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  resolveRoomNameText: jest.fn((room) => room?.name || 'Unnamed room'),
  resolveRoomTenantText: jest.fn(() => 'Tenant'),
  resolveRoomFacilityText: jest.fn(() => 'Facility'),
  resolveRoomWardText: jest.fn(() => 'Ward'),
  resolveRoomFloorText: jest.fn((room) => room?.floor || '1'),
  onRoomPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('RoomListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useRoomListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    expect(getByTestId('room-list-search')).toBeTruthy();
    expect(getByTestId('room-list-search-scope')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<RoomListScreenIOS />);
    expect(getByTestId('room-list-search')).toBeTruthy();
    expect(getByTestId('room-list-search-scope')).toBeTruthy();
  });

  it('shows loading state (Android)', () => {
    useRoomListScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    expect(getByTestId('room-list-loading')).toBeTruthy();
  });

  it('shows empty state (Android)', () => {
    const { getByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    expect(getByTestId('room-list-empty-state')).toBeTruthy();
  });

  it('shows no-results state and clear action (Android)', () => {
    const onClearSearchAndFilters = jest.fn();
    useRoomListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const { getByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    expect(getByTestId('room-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('room-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows error state (Android)', () => {
    useRoomListScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Could not load rooms',
    });
    const { getByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    expect(getByTestId('room-list-error')).toBeTruthy();
  });

  it('shows offline state (Android)', () => {
    useRoomListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    expect(getByTestId('room-list-offline')).toBeTruthy();
  });

  it('hides offline state when room rows are available', () => {
    useRoomListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      items: [{ id: 'room-1', name: 'Cached Room', floor: '1' }],
    });
    const { queryByTestId, getByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    expect(queryByTestId('room-list-offline')).toBeNull();
    expect(getByTestId('room-list-offline-banner')).toBeTruthy();
    expect(getByTestId('room-item-room-1')).toBeTruthy();
  });

  it('renders DataTable on web for desktop/tablet mode', () => {
    useRoomListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'room-1', name: 'Room 1', floor: '1' }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<RoomListScreenWeb />);
    expect(getByTestId('room-table')).toBeTruthy();
  });

  it('renders list items on web for mobile mode', () => {
    useRoomListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'room-1', name: 'Room 1', floor: '1' }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<RoomListScreenWeb />);
    expect(getByTestId('room-item-room-1')).toBeTruthy();
  });

  it('shows notice message (Android)', () => {
    useRoomListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'Room created.',
    });
    const { getByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    expect(getByTestId('room-list-notice')).toBeTruthy();
  });

  it('calls onAdd when add button is pressed (Android)', () => {
    const onAdd = jest.fn();
    useRoomListScreen.mockReturnValue({ ...baseHook, onAdd });
    const { getByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    fireEvent.press(getByTestId('room-list-add'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides delete action when onDelete is undefined', () => {
    useRoomListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      items: [{ id: 'room-1', name: 'Room 1', floor: '1' }],
    });
    const { queryByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    expect(queryByTestId('room-delete-room-1')).toBeNull();
  });

  it('shows room CRUD controls when handlers are available', () => {
    useRoomListScreen.mockReturnValue({
      ...baseHook,
      items: [{ id: 'room-1', name: 'Room 1', floor: '1' }],
    });
    const { getByTestId } = renderWithTheme(<RoomListScreenAndroid />);
    expect(getByTestId('room-view-room-1')).toBeTruthy();
    expect(getByTestId('room-edit-room-1')).toBeTruthy();
    expect(getByTestId('room-delete-room-1')).toBeTruthy();
  });

  it('exports component and hook from index and keeps states contract', () => {
    expect(RoomListScreenIndex.default).toBeDefined();
    expect(RoomListScreenIndex.useRoomListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});
