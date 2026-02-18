/**
 * UnitListScreen Component Tests
 * Coverage for unit list states, action visibility, and responsive web mode.
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

jest.mock('@platform/screens/settings/UnitListScreen/useUnitListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUnitListScreen = require('@platform/screens/settings/UnitListScreen/useUnitListScreen').default;
const UnitListScreenWeb = require('@platform/screens/settings/UnitListScreen/UnitListScreen.web').default;
const UnitListScreenAndroid = require('@platform/screens/settings/UnitListScreen/UnitListScreen.android').default;
const UnitListScreenIOS = require('@platform/screens/settings/UnitListScreen/UnitListScreen.ios').default;
const UnitListScreenIndex = require('@platform/screens/settings/UnitListScreen/index.js');
const { STATES } = require('@platform/screens/settings/UnitListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'unit.list.accessibilityLabel': 'Units list',
    'unit.list.searchPlaceholder': 'Search units',
    'unit.list.searchLabel': 'Search units',
    'unit.list.searchScopeLabel': 'Search field',
    'unit.list.searchScopeAll': 'All fields',
    'unit.list.emptyTitle': 'No units',
    'unit.list.emptyMessage': 'You have no units.',
    'unit.list.noResultsTitle': 'No matching units',
    'unit.list.noResultsMessage': 'Try changing your search text or filters.',
    'unit.list.clearSearchAndFilters': 'Clear search and filters',
    'unit.list.statusLabel': 'Status',
    'unit.list.statusActive': 'Active',
    'unit.list.statusInactive': 'Inactive',
    'unit.list.unnamed': 'Unnamed unit',
    'unit.list.columnDepartment': 'Department',
    'unit.list.contextValue': '{{tenant}} - {{facility}} - {{department}}',
    'unit.list.tenantFacilityValue': '{{tenant}} - {{facility}}',
    'unit.list.facilityDepartmentValue': '{{facility}} - {{department}}',
    'unit.list.tenantDepartmentValue': '{{tenant}} - {{department}}',
    'unit.list.facilityValue': 'Facility: {{facility}}',
    'unit.list.tenantValue': 'Tenant: {{tenant}}',
    'unit.list.departmentValue': 'Department: {{department}}',
    'unit.list.addLabel': 'Add unit',
    'unit.list.addHint': 'Create a new unit',
    'unit.list.view': 'View',
    'unit.list.viewHint': 'Open unit details',
    'unit.list.edit': 'Edit',
    'unit.list.editHint': 'Open unit editor',
    'unit.list.deleteHint': 'Delete this unit',
    'unit.list.itemLabel': 'Unit {{name}}',
    'unit.list.itemHint': 'View details for {{name}}',
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
  onUnitPress: jest.fn(),
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
    columnOrder: ['name', 'tenant', 'facility', 'department', 'status'],
    visibleColumns: ['name', 'tenant', 'facility', 'department', 'status'],
  selectedUnitIds: [],
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
  onToggleUnitSelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  onUnitPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('UnitListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useUnitListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    expect(getByTestId('unit-list-search')).toBeTruthy();
    expect(getByTestId('unit-list-search-scope')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<UnitListScreenIOS />);
    expect(getByTestId('unit-list-search')).toBeTruthy();
    expect(getByTestId('unit-list-search-scope')).toBeTruthy();
  });

  it('shows loading state (Android)', () => {
    useUnitListScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    expect(getByTestId('unit-list-loading')).toBeTruthy();
  });

  it('shows empty state (Android)', () => {
    const { getByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    expect(getByTestId('unit-list-empty-state')).toBeTruthy();
  });

  it('shows no-results state and clear action (Android)', () => {
    const onClearSearchAndFilters = jest.fn();
    useUnitListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const { getByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    expect(getByTestId('unit-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('unit-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows error state (Android)', () => {
    useUnitListScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Could not load facilities',
    });
    const { getByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    expect(getByTestId('unit-list-error')).toBeTruthy();
  });

  it('shows offline state (Android)', () => {
    useUnitListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    expect(getByTestId('unit-list-offline')).toBeTruthy();
  });

  it('hides offline state when unit rows are available', () => {
    useUnitListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      items: [{ id: 'unit-1', name: 'Cached Unit', department_name: 'CLINIC', is_active: true }],
    });
    const { queryByTestId, getByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    expect(queryByTestId('unit-list-offline')).toBeNull();
    expect(getByTestId('unit-list-offline-banner')).toBeTruthy();
    expect(getByTestId('unit-item-unit-1')).toBeTruthy();
  });

  it('renders DataTable on web for desktop/tablet mode', () => {
    useUnitListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'unit-1', name: 'Unit 1', department_name: 'HOSPITAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<UnitListScreenWeb />);
    expect(getByTestId('unit-table')).toBeTruthy();
  });

  it('renders list items on web for mobile mode', () => {
    useUnitListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'unit-1', name: 'Unit 1', department_name: 'HOSPITAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<UnitListScreenWeb />);
    expect(getByTestId('unit-item-unit-1')).toBeTruthy();
  });

  it('shows notice message (Android)', () => {
    useUnitListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'Unit created.',
    });
    const { getByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    expect(getByTestId('unit-list-notice')).toBeTruthy();
  });

  it('calls onAdd when add button is pressed (Android)', () => {
    const onAdd = jest.fn();
    useUnitListScreen.mockReturnValue({ ...baseHook, onAdd });
    const { getByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    fireEvent.press(getByTestId('unit-list-add'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides delete action when onDelete is undefined', () => {
    useUnitListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      items: [{ id: 'unit-1', name: 'Unit 1', department_name: 'HOSPITAL', is_active: true }],
    });
    const { queryByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    expect(queryByTestId('unit-delete-unit-1')).toBeNull();
  });

  it('shows unit CRUD controls when handlers are available', () => {
    useUnitListScreen.mockReturnValue({
      ...baseHook,
      items: [{ id: 'unit-1', name: 'Unit 1', department_name: 'HOSPITAL', is_active: true }],
    });
    const { getByTestId } = renderWithTheme(<UnitListScreenAndroid />);
    expect(getByTestId('unit-view-unit-1')).toBeTruthy();
    expect(getByTestId('unit-edit-unit-1')).toBeTruthy();
    expect(getByTestId('unit-delete-unit-1')).toBeTruthy();
  });

  it('exports component and hook from index and keeps states contract', () => {
    expect(UnitListScreenIndex.default).toBeDefined();
    expect(UnitListScreenIndex.useUnitListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});


