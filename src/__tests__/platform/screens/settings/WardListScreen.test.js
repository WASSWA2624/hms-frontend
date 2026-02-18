/**
 * WardListScreen Component Tests
 * Coverage for ward list states, action visibility, and responsive web mode.
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

jest.mock('@platform/screens/settings/WardListScreen/useWardListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useWardListScreen = require('@platform/screens/settings/WardListScreen/useWardListScreen').default;
const WardListScreenWeb = require('@platform/screens/settings/WardListScreen/WardListScreen.web').default;
const WardListScreenAndroid = require('@platform/screens/settings/WardListScreen/WardListScreen.android').default;
const WardListScreenIOS = require('@platform/screens/settings/WardListScreen/WardListScreen.ios').default;
const WardListScreenIndex = require('@platform/screens/settings/WardListScreen/index.js');
const { STATES } = require('@platform/screens/settings/WardListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'ward.list.accessibilityLabel': 'Wards list',
    'ward.list.searchPlaceholder': 'Search wards',
    'ward.list.searchLabel': 'Search wards',
    'ward.list.searchScopeLabel': 'Search field',
    'ward.list.searchScopeAll': 'All fields',
    'ward.list.emptyTitle': 'No wards',
    'ward.list.emptyMessage': 'You have no wards.',
    'ward.list.noResultsTitle': 'No matching wards',
    'ward.list.noResultsMessage': 'Try changing your search text or filters.',
    'ward.list.clearSearchAndFilters': 'Clear search and filters',
    'ward.list.activeLabel': 'Active',
    'ward.list.columnType': 'Type',
    'ward.list.columnActive': 'Active',
    'ward.list.unnamed': 'Unnamed ward',
    'ward.list.contextValue': '{{tenant}} - {{facility}} - {{type}}',
    'ward.list.partialContextValue': '{{first}} - {{second}}',
    'ward.list.addLabel': 'Add ward',
    'ward.list.addHint': 'Create a new ward',
    'ward.list.view': 'View',
    'ward.list.viewHint': 'Open ward details',
    'ward.list.edit': 'Edit',
    'ward.list.editHint': 'Open ward editor',
    'ward.list.deleteHint': 'Delete this ward',
    'ward.list.itemLabel': 'Ward {{name}}',
    'ward.list.itemHint': 'View details for {{name}}',
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
  resolveWardNameText: jest.fn((ward) => ward?.name || 'Unnamed ward'),
  resolveWardTenantText: jest.fn((ward) => ward?.tenant_name || 'Tenant'),
  resolveWardFacilityText: jest.fn((ward) => ward?.facility_name || 'Facility'),
  resolveWardTypeText: jest.fn((ward) => ward?.ward_type || 'General'),
  resolveWardActiveText: jest.fn((ward) => (ward?.is_active ? 'active' : 'inactive')),
  onWardPress: jest.fn(),
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
  columnOrder: ['name', 'tenant', 'facility', 'type', 'active'],
  visibleColumns: ['name', 'tenant', 'facility', 'type', 'active'],
  selectedWardIds: [],
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
  onToggleWardSelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  resolveWardNameText: jest.fn((ward) => ward?.name || 'Unnamed ward'),
  resolveWardTenantText: jest.fn(() => 'Tenant'),
  resolveWardFacilityText: jest.fn(() => 'Facility'),
  resolveWardTypeText: jest.fn(() => 'General'),
  resolveWardActiveText: jest.fn((ward) => (ward?.is_active ? 'active' : 'inactive')),
  onWardPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('WardListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useWardListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<WardListScreenAndroid />);
    expect(getByTestId('ward-list-search')).toBeTruthy();
    expect(getByTestId('ward-list-search-scope')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<WardListScreenIOS />);
    expect(getByTestId('ward-list-search')).toBeTruthy();
    expect(getByTestId('ward-list-search-scope')).toBeTruthy();
  });

  it('shows loading state (Android)', () => {
    useWardListScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<WardListScreenAndroid />);
    expect(getByTestId('ward-list-loading')).toBeTruthy();
  });

  it('shows empty state (Android)', () => {
    const { getByTestId } = renderWithTheme(<WardListScreenAndroid />);
    expect(getByTestId('ward-list-empty-state')).toBeTruthy();
  });

  it('shows no-results state and clear action (Android)', () => {
    const onClearSearchAndFilters = jest.fn();
    useWardListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const { getByTestId } = renderWithTheme(<WardListScreenAndroid />);
    expect(getByTestId('ward-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('ward-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows error state (Android)', () => {
    useWardListScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Could not load wards',
    });
    const { getByTestId } = renderWithTheme(<WardListScreenAndroid />);
    expect(getByTestId('ward-list-error')).toBeTruthy();
  });

  it('shows offline state (Android)', () => {
    useWardListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<WardListScreenAndroid />);
    expect(getByTestId('ward-list-offline')).toBeTruthy();
  });

  it('hides offline state when ward rows are available', () => {
    useWardListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      items: [{ id: 'ward-1', name: 'Cached Ward', ward_type: 'GENERAL', is_active: true }],
    });
    const { queryByTestId, getByTestId } = renderWithTheme(<WardListScreenAndroid />);
    expect(queryByTestId('ward-list-offline')).toBeNull();
    expect(getByTestId('ward-list-offline-banner')).toBeTruthy();
    expect(getByTestId('ward-item-ward-1')).toBeTruthy();
  });

  it('renders DataTable on web for desktop/tablet mode', () => {
    useWardListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'ward-1', name: 'Ward 1', ward_type: 'GENERAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<WardListScreenWeb />);
    expect(getByTestId('ward-table')).toBeTruthy();
  });

  it('renders list items on web for mobile mode', () => {
    useWardListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'ward-1', name: 'Ward 1', ward_type: 'GENERAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<WardListScreenWeb />);
    expect(getByTestId('ward-item-ward-1')).toBeTruthy();
  });

  it('shows notice message (Android)', () => {
    useWardListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'Ward created.',
    });
    const { getByTestId } = renderWithTheme(<WardListScreenAndroid />);
    expect(getByTestId('ward-list-notice')).toBeTruthy();
  });

  it('calls onAdd when add button is pressed (Android)', () => {
    const onAdd = jest.fn();
    useWardListScreen.mockReturnValue({ ...baseHook, onAdd });
    const { getByTestId } = renderWithTheme(<WardListScreenAndroid />);
    fireEvent.press(getByTestId('ward-list-add'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides delete action when onDelete is undefined', () => {
    useWardListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      items: [{ id: 'ward-1', name: 'Ward 1', ward_type: 'GENERAL', is_active: true }],
    });
    const { queryByTestId } = renderWithTheme(<WardListScreenAndroid />);
    expect(queryByTestId('ward-delete-ward-1')).toBeNull();
  });

  it('shows ward CRUD controls when handlers are available', () => {
    useWardListScreen.mockReturnValue({
      ...baseHook,
      items: [{ id: 'ward-1', name: 'Ward 1', ward_type: 'GENERAL', is_active: true }],
    });
    const { getByTestId } = renderWithTheme(<WardListScreenAndroid />);
    expect(getByTestId('ward-view-ward-1')).toBeTruthy();
    expect(getByTestId('ward-edit-ward-1')).toBeTruthy();
    expect(getByTestId('ward-delete-ward-1')).toBeTruthy();
  });

  it('exports component and hook from index and keeps states contract', () => {
    expect(WardListScreenIndex.default).toBeDefined();
    expect(WardListScreenIndex.useWardListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});

