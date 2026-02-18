/**
 * DepartmentListScreen Component Tests
 * Coverage for department list states, action visibility, and responsive web mode.
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

jest.mock('@platform/screens/settings/DepartmentListScreen/useDepartmentListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useDepartmentListScreen = require('@platform/screens/settings/DepartmentListScreen/useDepartmentListScreen').default;
const DepartmentListScreenWeb = require('@platform/screens/settings/DepartmentListScreen/DepartmentListScreen.web').default;
const DepartmentListScreenAndroid = require('@platform/screens/settings/DepartmentListScreen/DepartmentListScreen.android').default;
const DepartmentListScreenIOS = require('@platform/screens/settings/DepartmentListScreen/DepartmentListScreen.ios').default;
const DepartmentListScreenIndex = require('@platform/screens/settings/DepartmentListScreen/index.js');
const { STATES } = require('@platform/screens/settings/DepartmentListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'department.list.accessibilityLabel': 'Departments list',
    'department.list.searchPlaceholder': 'Search departments',
    'department.list.searchLabel': 'Search departments',
    'department.list.searchScopeLabel': 'Search field',
    'department.list.searchScopeAll': 'All fields',
    'department.list.emptyTitle': 'No departments',
    'department.list.emptyMessage': 'You have no departments.',
    'department.list.noResultsTitle': 'No matching departments',
    'department.list.noResultsMessage': 'Try changing your search text or filters.',
    'department.list.clearSearchAndFilters': 'Clear search and filters',
    'department.list.statusLabel': 'Status',
    'department.list.statusActive': 'Active',
    'department.list.statusInactive': 'Inactive',
    'department.list.unnamed': 'Unnamed department',
    'department.list.typeValue': 'Type: {{type}}',
    'department.list.addLabel': 'Add department',
    'department.list.addHint': 'Create a new department',
    'department.list.view': 'View',
    'department.list.viewHint': 'Open department details',
    'department.list.edit': 'Edit',
    'department.list.editHint': 'Open department editor',
    'department.list.deleteHint': 'Delete this department',
    'department.list.itemLabel': 'Department {{name}}',
    'department.list.itemHint': 'View details for {{name}}',
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
  onDepartmentPress: jest.fn(),
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
  columnOrder: ['name', 'shortName', 'type', 'status'],
  visibleColumns: ['name', 'shortName', 'type', 'status'],
  selectedDepartmentIds: [],
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
  onToggleDepartmentSelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  onDepartmentPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('DepartmentListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useDepartmentListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    expect(getByTestId('department-list-search')).toBeTruthy();
    expect(getByTestId('department-list-search-scope')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<DepartmentListScreenIOS />);
    expect(getByTestId('department-list-search')).toBeTruthy();
    expect(getByTestId('department-list-search-scope')).toBeTruthy();
  });

  it('shows loading state (Android)', () => {
    useDepartmentListScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    expect(getByTestId('department-list-loading')).toBeTruthy();
  });

  it('shows empty state (Android)', () => {
    const { getByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    expect(getByTestId('department-list-empty-state')).toBeTruthy();
  });

  it('shows no-results state and clear action (Android)', () => {
    const onClearSearchAndFilters = jest.fn();
    useDepartmentListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const { getByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    expect(getByTestId('department-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('department-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows error state (Android)', () => {
    useDepartmentListScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Could not load departments',
    });
    const { getByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    expect(getByTestId('department-list-error')).toBeTruthy();
  });

  it('shows offline state (Android)', () => {
    useDepartmentListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    expect(getByTestId('department-list-offline')).toBeTruthy();
  });

  it('hides offline state when department rows are available', () => {
    useDepartmentListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      items: [{ id: 'department-1', name: 'Cached Department', department_type: 'CLINICAL', is_active: true }],
    });
    const { queryByTestId, getByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    expect(queryByTestId('department-list-offline')).toBeNull();
    expect(getByTestId('department-list-offline-banner')).toBeTruthy();
    expect(getByTestId('department-item-department-1')).toBeTruthy();
  });

  it('renders DataTable on web for desktop/tablet mode', () => {
    useDepartmentListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'department-1', name: 'Department 1', department_type: 'CLINICAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<DepartmentListScreenWeb />);
    expect(getByTestId('department-table')).toBeTruthy();
  });

  it('renders list items on web for mobile mode', () => {
    useDepartmentListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'department-1', name: 'Department 1', department_type: 'CLINICAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<DepartmentListScreenWeb />);
    expect(getByTestId('department-item-department-1')).toBeTruthy();
  });

  it('shows notice message (Android)', () => {
    useDepartmentListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'Department created.',
    });
    const { getByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    expect(getByTestId('department-list-notice')).toBeTruthy();
  });

  it('calls onAdd when add button is pressed (Android)', () => {
    const onAdd = jest.fn();
    useDepartmentListScreen.mockReturnValue({ ...baseHook, onAdd });
    const { getByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    fireEvent.press(getByTestId('department-list-add'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides delete action when onDelete is undefined', () => {
    useDepartmentListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      items: [{ id: 'department-1', name: 'Department 1', department_type: 'CLINICAL', is_active: true }],
    });
    const { queryByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    expect(queryByTestId('department-delete-department-1')).toBeNull();
  });

  it('shows department CRUD controls when handlers are available', () => {
    useDepartmentListScreen.mockReturnValue({
      ...baseHook,
      items: [{ id: 'department-1', name: 'Department 1', department_type: 'CLINICAL', is_active: true }],
    });
    const { getByTestId } = renderWithTheme(<DepartmentListScreenAndroid />);
    expect(getByTestId('department-view-department-1')).toBeTruthy();
    expect(getByTestId('department-edit-department-1')).toBeTruthy();
    expect(getByTestId('department-delete-department-1')).toBeTruthy();
  });

  it('exports component and hook from index and keeps states contract', () => {
    expect(DepartmentListScreenIndex.default).toBeDefined();
    expect(DepartmentListScreenIndex.useDepartmentListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});
