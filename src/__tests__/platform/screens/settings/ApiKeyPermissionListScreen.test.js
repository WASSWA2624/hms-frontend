/**
 * ApiKeyPermissionListScreen Component Tests
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

jest.mock('@platform/screens/settings/ApiKeyPermissionListScreen/useApiKeyPermissionListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useApiKeyPermissionListScreen = require('@platform/screens/settings/ApiKeyPermissionListScreen/useApiKeyPermissionListScreen').default;
const ApiKeyPermissionListScreenWeb = require('@platform/screens/settings/ApiKeyPermissionListScreen/ApiKeyPermissionListScreen.web').default;
const ApiKeyPermissionListScreenAndroid = require('@platform/screens/settings/ApiKeyPermissionListScreen/ApiKeyPermissionListScreen.android').default;
const ApiKeyPermissionListScreenIOS = require('@platform/screens/settings/ApiKeyPermissionListScreen/ApiKeyPermissionListScreen.ios').default;
const ApiKeyPermissionListScreenIndex = require('@platform/screens/settings/ApiKeyPermissionListScreen/index.js');
const { STATES } = require('@platform/screens/settings/ApiKeyPermissionListScreen/types.js');

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
  filters: [{ id: 'f-1', field: 'apiKey', operator: 'contains', value: '' }],
  filterFieldOptions: [{ value: 'apiKey', label: 'API key' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  hasActiveSearchOrFilter: false,
  sortField: 'apiKey',
  sortDirection: 'asc',
  columnOrder: ['apiKey', 'permission', 'tenant'],
  visibleColumns: ['apiKey', 'permission', 'tenant'],
  isTableSettingsOpen: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: true,
  noticeMessage: null,
  resolveApiKeyLabel: (item) => item.api_key_name || item.api_key_id || 'API key',
  resolvePermissionLabel: (item) => item.permission_name || item.permission_id || 'Permission',
  resolveTenantLabel: (item) => item.tenant_name || 'Tenant',
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
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('ApiKeyPermissionListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    useApiKeyPermissionListScreen.mockReturnValue({ ...baseHook });
    mockUseWindowDimensions.mockReturnValue({
      width: 1280,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
  });

  it('renders DataTable on web in desktop/tablet mode', () => {
    useApiKeyPermissionListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [
        {
          id: 'akp-1',
          api_key_id: 'key-1',
          permission_id: 'perm-1',
        },
      ],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<ApiKeyPermissionListScreenWeb />);
    expect(getByTestId('api-key-permission-table')).toBeTruthy();
  });

  it('keeps desktop filter panel collapsed by default', () => {
    useApiKeyPermissionListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [
        {
          id: 'akp-1',
          api_key_id: 'key-1',
          permission_id: 'perm-1',
        },
      ],
      totalItems: 1,
    });

    const { queryByText } = renderWithTheme(<ApiKeyPermissionListScreenWeb />);
    expect(queryByText('apiKeyPermission.list.filterLogicLabel')).toBeNull();
  });

  it('keeps mobile filter panel expanded by default', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    useApiKeyPermissionListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [
        {
          id: 'akp-1',
          api_key_id: 'key-1',
          permission_id: 'perm-1',
        },
      ],
      totalItems: 1,
    });

    const { getByText } = renderWithTheme(<ApiKeyPermissionListScreenWeb />);
    expect(getByText('apiKeyPermission.list.filterLogicLabel')).toBeTruthy();
  });

  it('renders list items on web in mobile mode', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    useApiKeyPermissionListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [
        {
          id: 'akp-1',
          api_key_id: 'key-1',
          permission_id: 'perm-1',
        },
      ],
      totalItems: 1,
    });

    const { getByTestId, queryByTestId } = renderWithTheme(<ApiKeyPermissionListScreenWeb />);
    expect(getByTestId('api-key-permission-item-akp-1')).toBeTruthy();
    expect(queryByTestId('api-key-permission-table')).toBeNull();
  });

  it('renders Android and iOS variants', () => {
    const android = renderWithTheme(<ApiKeyPermissionListScreenAndroid />);
    expect(android.getByTestId('api-key-permission-list-search')).toBeTruthy();
    expect(android.getByTestId('api-key-permission-list-card')).toBeTruthy();

    const ios = renderWithTheme(<ApiKeyPermissionListScreenIOS />);
    expect(ios.getByTestId('api-key-permission-list-search')).toBeTruthy();
    expect(ios.getByTestId('api-key-permission-list-card')).toBeTruthy();
  });

  it('shows no-results state and clear action', () => {
    const onClearSearchAndFilters = jest.fn();
    useApiKeyPermissionListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });

    const { getByTestId } = renderWithTheme(<ApiKeyPermissionListScreenAndroid />);
    expect(getByTestId('api-key-permission-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('api-key-permission-filter-clear'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows list notice banner when message exists', () => {
    useApiKeyPermissionListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'apiKeyPermission.list.noticeCreated',
    });

    const { getByTestId } = renderWithTheme(<ApiKeyPermissionListScreenWeb />);
    expect(getByTestId('api-key-permission-list-notice')).toBeTruthy();
  });

  it('exports component, hook, and state contract', () => {
    expect(ApiKeyPermissionListScreenIndex.default).toBeDefined();
    expect(ApiKeyPermissionListScreenIndex.useApiKeyPermissionListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});
