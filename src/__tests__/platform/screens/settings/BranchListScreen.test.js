/**
 * BranchListScreen Component Tests
 * Coverage for branch list states, action visibility, and responsive web mode.
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

jest.mock('@platform/screens/settings/BranchListScreen/useBranchListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useBranchListScreen = require('@platform/screens/settings/BranchListScreen/useBranchListScreen').default;
const BranchListScreenWeb = require('@platform/screens/settings/BranchListScreen/BranchListScreen.web').default;
const BranchListScreenAndroid = require('@platform/screens/settings/BranchListScreen/BranchListScreen.android').default;
const BranchListScreenIOS = require('@platform/screens/settings/BranchListScreen/BranchListScreen.ios').default;
const BranchListScreenIndex = require('@platform/screens/settings/BranchListScreen/index.js');
const { STATES } = require('@platform/screens/settings/BranchListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'branch.list.accessibilityLabel': 'Branches list',
    'branch.list.searchPlaceholder': 'Search branches',
    'branch.list.searchLabel': 'Search branches',
    'branch.list.searchScopeLabel': 'Search field',
    'branch.list.searchScopeAll': 'All fields',
    'branch.list.emptyTitle': 'No branches',
    'branch.list.emptyMessage': 'You have no branches.',
    'branch.list.noResultsTitle': 'No matching branches',
    'branch.list.noResultsMessage': 'Try changing your search text or filters.',
    'branch.list.clearSearchAndFilters': 'Clear search and filters',
    'branch.list.statusLabel': 'Status',
    'branch.list.statusActive': 'Active',
    'branch.list.statusInactive': 'Inactive',
    'branch.list.unnamed': 'Unnamed branch',
    'branch.list.contextValue': '{{tenant}} - {{facility}}',
    'branch.list.facilityValue': 'Facility: {{facility}}',
    'branch.list.tenantValue': 'Tenant: {{tenant}}',
    'branch.list.addLabel': 'Add branch',
    'branch.list.addHint': 'Create a new branch',
    'branch.list.view': 'View',
    'branch.list.viewHint': 'Open branch details',
    'branch.list.edit': 'Edit',
    'branch.list.editHint': 'Open branch editor',
    'branch.list.deleteHint': 'Delete this branch',
    'branch.list.itemLabel': 'Branch {{name}}',
    'branch.list.itemHint': 'View details for {{name}}',
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
  onBranchPress: jest.fn(),
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
    columnOrder: ['name', 'tenant', 'facility', 'status'],
    visibleColumns: ['name', 'tenant', 'facility', 'status'],
  selectedBranchIds: [],
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
  onToggleBranchSelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  onBranchPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('BranchListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useBranchListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    expect(getByTestId('branch-list-search')).toBeTruthy();
    expect(getByTestId('branch-list-search-scope')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<BranchListScreenIOS />);
    expect(getByTestId('branch-list-search')).toBeTruthy();
    expect(getByTestId('branch-list-search-scope')).toBeTruthy();
  });

  it('shows loading state (Android)', () => {
    useBranchListScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    expect(getByTestId('branch-list-loading')).toBeTruthy();
  });

  it('shows empty state (Android)', () => {
    const { getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    expect(getByTestId('branch-list-empty-state')).toBeTruthy();
  });

  it('shows no-results state and clear action (Android)', () => {
    const onClearSearchAndFilters = jest.fn();
    useBranchListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const { getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    expect(getByTestId('branch-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('branch-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows error state (Android)', () => {
    useBranchListScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Could not load facilities',
    });
    const { getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    expect(getByTestId('branch-list-error')).toBeTruthy();
  });

  it('shows offline state (Android)', () => {
    useBranchListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    expect(getByTestId('branch-list-offline')).toBeTruthy();
  });

  it('hides offline state when branch rows are available', () => {
    useBranchListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      items: [{ id: 'branch-1', name: 'Cached Branch', branch_type: 'CLINIC', is_active: true }],
    });
    const { queryByTestId, getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    expect(queryByTestId('branch-list-offline')).toBeNull();
    expect(getByTestId('branch-list-offline-banner')).toBeTruthy();
    expect(getByTestId('branch-item-branch-1')).toBeTruthy();
  });

  it('renders DataTable on web for desktop/tablet mode', () => {
    useBranchListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'branch-1', name: 'Branch 1', branch_type: 'HOSPITAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<BranchListScreenWeb />);
    expect(getByTestId('branch-table')).toBeTruthy();
  });

  it('renders list items on web for mobile mode', () => {
    useBranchListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'branch-1', name: 'Branch 1', branch_type: 'HOSPITAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<BranchListScreenWeb />);
    expect(getByTestId('branch-item-branch-1')).toBeTruthy();
  });

  it('shows notice message (Android)', () => {
    useBranchListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'Branch created.',
    });
    const { getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    expect(getByTestId('branch-list-notice')).toBeTruthy();
  });

  it('calls onAdd when add button is pressed (Android)', () => {
    const onAdd = jest.fn();
    useBranchListScreen.mockReturnValue({ ...baseHook, onAdd });
    const { getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    fireEvent.press(getByTestId('branch-list-add'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides delete action when onDelete is undefined', () => {
    useBranchListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      items: [{ id: 'branch-1', name: 'Branch 1', branch_type: 'HOSPITAL', is_active: true }],
    });
    const { queryByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    expect(queryByTestId('branch-delete-branch-1')).toBeNull();
  });

  it('shows branch CRUD controls when handlers are available', () => {
    useBranchListScreen.mockReturnValue({
      ...baseHook,
      items: [{ id: 'branch-1', name: 'Branch 1', branch_type: 'HOSPITAL', is_active: true }],
    });
    const { getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
    expect(getByTestId('branch-view-branch-1')).toBeTruthy();
    expect(getByTestId('branch-edit-branch-1')).toBeTruthy();
    expect(getByTestId('branch-delete-branch-1')).toBeTruthy();
  });

  it('exports component and hook from index and keeps states contract', () => {
    expect(BranchListScreenIndex.default).toBeDefined();
    expect(BranchListScreenIndex.useBranchListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});

