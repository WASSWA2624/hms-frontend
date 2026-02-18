/**
 * UserListScreen Component Tests
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
      {onView ? <actual.Button testID={viewTestID} onPress={onView}>view</actual.Button> : null}
      {onEdit ? <actual.Button testID={editTestID} onPress={onEdit}>edit</actual.Button> : null}
      {onDelete ? <actual.Button testID={deleteTestID} onPress={onDelete}>delete</actual.Button> : null}
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

jest.mock('@platform/screens/settings/UserListScreen/useUserListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserListScreen = require('@platform/screens/settings/UserListScreen/useUserListScreen').default;
const UserListScreenWeb = require('@platform/screens/settings/UserListScreen/UserListScreen.web').default;
const UserListScreenAndroid = require('@platform/screens/settings/UserListScreen/UserListScreen.android').default;
const UserListScreenIOS = require('@platform/screens/settings/UserListScreen/UserListScreen.ios').default;
const UserListScreenIndex = require('@platform/screens/settings/UserListScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key, values = {}) => {
  const dictionary = {
    'user.list.accessibilityLabel': 'Users list',
    'user.list.searchPlaceholder': 'Search users',
    'user.list.searchLabel': 'Search users',
    'user.list.searchScopeLabel': 'Search field',
    'user.list.searchScopeAll': 'All fields',
    'user.list.emptyTitle': 'No users',
    'user.list.emptyMessage': 'You have no users.',
    'user.list.noResultsTitle': 'No matching users',
    'user.list.noResultsMessage': 'Try changing your search text or filters.',
    'user.list.clearSearchAndFilters': 'Clear search and filters',
    'user.list.unnamed': 'Unnamed user',
    'user.list.contextValue': `${values.tenant || '{{tenant}}'} - ${values.facility || '{{facility}}'}`,
    'user.list.tenantValue': `Tenant: ${values.tenant || '{{tenant}}'}`,
    'user.list.facilityValue': `Facility: ${values.facility || '{{facility}}'}`,
    'user.list.currentTenant': 'Current tenant',
    'user.list.currentFacility': 'Current facility',
    'user.list.columnEmail': 'Email',
    'user.list.columnPhone': 'Phone',
    'user.list.columnStatus': 'Status',
    'user.list.columnTenant': 'Tenant',
    'user.list.columnFacility': 'Facility',
    'user.list.columnActions': 'Actions',
    'user.list.sortBy': `Sort by ${values.field || 'Email'}`,
    'user.list.filterLogicLabel': 'Filter logic',
    'user.list.filterFieldLabel': 'Field',
    'user.list.filterOperatorLabel': 'Operator',
    'user.list.filterValueLabel': 'Value',
    'user.list.filterValuePlaceholder': 'Enter value',
    'user.list.addFilter': 'Add filter',
    'user.list.removeFilter': 'Remove filter',
    'user.list.bulkSelectedCount': `${values.count || 0} selected`,
    'user.list.bulkDelete': 'Remove selected',
    'user.list.clearSelection': 'Clear selection',
    'user.list.selectPage': 'Select page',
    'user.list.selectUser': `Select ${values.name || 'user'}`,
    'user.list.pageSummary': `Page ${values.page || 1} of ${values.totalPages || 1} - ${values.total || 0} users`,
    'user.list.pageSizeLabel': 'Rows',
    'user.list.densityLabel': 'Density',
    'user.list.tableSettings': 'Table settings',
    'user.list.visibleColumns': 'Visible columns and order',
    'user.list.moveColumnLeft': `Move ${values.column || 'Email'} left`,
    'user.list.moveColumnRight': `Move ${values.column || 'Email'} right`,
    'user.list.resetTablePreferences': 'Reset table preferences',
    'user.list.addLabel': 'Add user',
    'user.list.addHint': 'Create a new user',
    'user.list.view': 'View',
    'user.list.viewHint': 'Open user details',
    'user.list.edit': 'Edit',
    'user.list.editHint': 'Open user editor',
    'user.list.deleteHint': 'Delete this user',
    'user.list.itemLabel': `User ${values.name || '{{name}}'}`,
    'user.list.itemHint': `View details for ${values.name || '{{name}}'}`,
    'user.list.statusLabel': 'Status',
    'user.status.ACTIVE': 'Active',
    'listScaffold.errorState.title': 'Error',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.loading': 'Loading',
    'common.remove': 'Remove',
    'common.more': 'More',
    'common.notAvailable': 'Not available',
    'shell.banners.offline.title': 'Offline',
    'shell.banners.offline.message': 'No connection',
  };
  return dictionary[key] || key;
};

const baseMobileHook = {
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
  canViewTechnicalIds: false,
  onDismissNotice: jest.fn(),
  onRetry: jest.fn(),
  onSearch: jest.fn(),
  onSearchScopeChange: jest.fn(),
  onClearSearchAndFilters: jest.fn(),
  onUserPress: jest.fn(),
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
  filters: [{ id: 'f1', field: 'email', operator: 'contains', value: '' }],
  filterFieldOptions: [{ value: 'email', label: 'Email' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  sortField: 'email',
  sortDirection: 'asc',
  columnOrder: ['email', 'phone', 'status', 'tenant', 'facility'],
  visibleColumns: ['email', 'phone', 'status', 'tenant', 'facility'],
  selectedUserIds: [],
  allPageSelected: false,
  isTableMode: true,
  isTableSettingsOpen: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  noticeMessage: null,
  canViewTechnicalIds: false,
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
  onToggleUserSelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  onUserPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('UserListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useUserListScreen.mockReturnValue({ ...baseMobileHook });
  });

  it('renders mobile variants (Android/iOS)', () => {
    expect(renderWithTheme(<UserListScreenAndroid />).getByTestId('user-list-search')).toBeTruthy();
    expect(renderWithTheme(<UserListScreenIOS />).getByTestId('user-list-search')).toBeTruthy();
  });

  it('renders desktop table on web in table mode', () => {
    useUserListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'u-1', email: 'user@acme.org', status: 'ACTIVE' }],
      totalItems: 1,
    });
    expect(renderWithTheme(<UserListScreenWeb />).getByTestId('user-table')).toBeTruthy();
  });

  it('renders mobile list on web when not in table mode', () => {
    useUserListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'u-1', email: 'user@acme.org', status: 'ACTIVE' }],
      totalItems: 1,
    });
    expect(renderWithTheme(<UserListScreenWeb />).getByTestId('user-item-u-1')).toBeTruthy();
  });

  it('shows no-results and triggers clear action on Android', () => {
    const onClearSearchAndFilters = jest.fn();
    useUserListScreen.mockReturnValue({
      ...baseMobileHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const screen = renderWithTheme(<UserListScreenAndroid />);
    fireEvent.press(screen.getByTestId('user-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('exports component and hook from index', () => {
    expect(UserListScreenIndex.default).toBeDefined();
    expect(UserListScreenIndex.useUserListScreen).toBeDefined();
  });
});
