/**
 * ApiKeyListScreen Component Tests
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const ReactNative = require('react-native');
const { useI18n } = require('@hooks');

const mockUseWindowDimensions = jest.spyOn(ReactNative, 'useWindowDimensions');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/components', () => {
  const React = require('react');
  const { View } = require('react-native');
  const actual = jest.requireActual('@platform/components');

  return {
    ...actual,
    DataTable: ({ testID, searchBar, filterBar, statusContent, pagination, tableNavigation }) => (
      <View testID={testID}>
        {searchBar}
        {filterBar}
        {statusContent}
        {pagination}
        {tableNavigation}
      </View>
    ),
  };
});

jest.mock('@platform/screens/settings/ApiKeyListScreen/useApiKeyListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useApiKeyListScreen = require('@platform/screens/settings/ApiKeyListScreen/useApiKeyListScreen').default;
const ApiKeyListScreenWeb = require('@platform/screens/settings/ApiKeyListScreen/ApiKeyListScreen.web').default;
const ApiKeyListScreenAndroid = require('@platform/screens/settings/ApiKeyListScreen/ApiKeyListScreen.android').default;
const ApiKeyListScreenIOS = require('@platform/screens/settings/ApiKeyListScreen/ApiKeyListScreen.ios').default;
const ApiKeyListScreenIndex = require('@platform/screens/settings/ApiKeyListScreen/index.js');
const { STATES } = require('@platform/screens/settings/ApiKeyListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const baseHook = {
  items: [],
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
  filters: [{ id: 'f-1', field: 'name', operator: 'contains', value: '' }],
  filterFieldOptions: [{ value: 'name', label: 'API key' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  hasActiveSearchOrFilter: false,
  sortField: 'name',
  sortDirection: 'asc',
  columnOrder: ['name', 'user', 'tenant', 'status'],
  visibleColumns: ['name', 'user', 'tenant', 'status'],
  isTableSettingsOpen: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  noticeMessage: null,
  resolveApiKeyName: (item) => item.name || 'API Key',
  resolveUserLabel: (item) => item.user_name || 'User',
  resolveTenantLabel: (item) => item.tenant_name || 'Tenant',
  resolveStatusLabel: (item) => (item.is_active ? 'Active' : 'Inactive'),
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
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  onItemPress: jest.fn(),
  onDelete: undefined,
  onAdd: undefined,
};

describe('ApiKeyListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    useApiKeyListScreen.mockReturnValue({ ...baseHook });
    mockUseWindowDimensions.mockReturnValue({
      width: 1280,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
  });

  it('renders DataTable on web in desktop/tablet mode', () => {
    useApiKeyListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'k-1', name: 'Integration Key', user_name: 'Alice', tenant_name: 'North', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<ApiKeyListScreenWeb />);
    expect(getByTestId('api-key-table')).toBeTruthy();
  });

  it('keeps desktop filter panel collapsed by default', () => {
    useApiKeyListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'k-1', name: 'Integration Key', user_name: 'Alice', tenant_name: 'North', is_active: true }],
      totalItems: 1,
    });

    const { queryByText } = renderWithTheme(<ApiKeyListScreenWeb />);
    expect(queryByText('apiKey.list.filterLogicLabel')).toBeNull();
  });

  it('keeps mobile filter panel expanded by default', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    useApiKeyListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'k-1', name: 'Integration Key', user_name: 'Alice', tenant_name: 'North', is_active: true }],
      totalItems: 1,
    });

    const { getByText } = renderWithTheme(<ApiKeyListScreenWeb />);
    expect(getByText('apiKey.list.filterLogicLabel')).toBeTruthy();
  });

  it('renders list items on web in mobile mode', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    useApiKeyListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'k-1', name: 'Integration Key', user_name: 'Alice', tenant_name: 'North', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId, queryByTestId } = renderWithTheme(<ApiKeyListScreenWeb />);
    expect(getByTestId('api-key-item-k-1')).toBeTruthy();
    expect(queryByTestId('api-key-table')).toBeNull();
  });

  it('renders Android and iOS variants', () => {
    const android = renderWithTheme(<ApiKeyListScreenAndroid />);
    expect(android.getByTestId('api-key-list-search')).toBeTruthy();
    expect(android.getByTestId('api-key-list-card')).toBeTruthy();

    const ios = renderWithTheme(<ApiKeyListScreenIOS />);
    expect(ios.getByTestId('api-key-list-search')).toBeTruthy();
    expect(ios.getByTestId('api-key-list-card')).toBeTruthy();
  });

  it('shows no-results state and clear action', () => {
    const onClearSearchAndFilters = jest.fn();
    useApiKeyListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });

    const { getByTestId } = renderWithTheme(<ApiKeyListScreenAndroid />);
    expect(getByTestId('api-key-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('api-key-filter-clear'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('keeps read-only surface (no add/delete controls)', () => {
    useApiKeyListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'k-1', name: 'Integration Key', user_name: 'Alice', tenant_name: 'North', is_active: true }],
      totalItems: 1,
      onAdd: undefined,
      onDelete: undefined,
    });

    const { queryByTestId } = renderWithTheme(<ApiKeyListScreenWeb />);
    expect(queryByTestId('api-key-list-add')).toBeNull();
    expect(queryByTestId('api-key-delete-k-1')).toBeNull();
  });

  it('exports component, hook, and state contract', () => {
    expect(ApiKeyListScreenIndex.default).toBeDefined();
    expect(ApiKeyListScreenIndex.useApiKeyListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});
