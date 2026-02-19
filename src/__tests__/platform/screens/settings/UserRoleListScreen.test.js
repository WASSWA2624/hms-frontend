/**
 * UserRoleListScreen Component Tests
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

jest.mock('@platform/screens/settings/UserRoleListScreen/useUserRoleListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserRoleListScreen = require('@platform/screens/settings/UserRoleListScreen/useUserRoleListScreen').default;
const UserRoleListScreenWeb = require('@platform/screens/settings/UserRoleListScreen/UserRoleListScreen.web').default;
const UserRoleListScreenAndroid = require('@platform/screens/settings/UserRoleListScreen/UserRoleListScreen.android').default;
const UserRoleListScreenIOS = require('@platform/screens/settings/UserRoleListScreen/UserRoleListScreen.ios').default;
const UserRoleListScreenIndex = require('@platform/screens/settings/UserRoleListScreen/index.js');
const { STATES } = require('@platform/screens/settings/UserRoleListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const baseHook = {
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
  filters: [{ id: 'f-1', field: 'user', operator: 'contains', value: '' }],
  filterFieldOptions: [{ value: 'user', label: 'User' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  sortField: 'user',
  sortDirection: 'asc',
  columnOrder: ['user', 'role', 'tenant', 'facility'],
  visibleColumns: ['user', 'role', 'tenant', 'facility'],
  isTableSettingsOpen: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  noticeMessage: null,
  resolveUserLabel: (item) => item.user_name || 'User',
  resolveRoleLabel: (item) => item.role_name || 'Role',
  resolveTenantLabel: (item) => item.tenant_name || 'Tenant',
  resolveFacilityLabel: (item) => item.facility_name || 'Facility',
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

describe('UserRoleListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    useUserRoleListScreen.mockReturnValue({ ...baseHook });
    mockUseWindowDimensions.mockReturnValue({
      width: 1280,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
  });

  it('renders DataTable on web in desktop/tablet mode', () => {
    useUserRoleListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'ur-1', user_name: 'Alice', role_name: 'Admin' }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<UserRoleListScreenWeb />);
    expect(getByTestId('user-role-table')).toBeTruthy();
  });

  it('keeps desktop filters collapsed by default', () => {
    useUserRoleListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'ur-1', user_name: 'Alice', role_name: 'Admin' }],
      totalItems: 1,
    });

    const { queryByTestId } = renderWithTheme(<UserRoleListScreenWeb />);
    expect(queryByTestId('user-role-filter-body')).toBeNull();
  });

  it('renders list items on web in mobile mode', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    useUserRoleListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'ur-1', user_name: 'Alice', role_name: 'Admin' }],
      totalItems: 1,
    });

    const { getByTestId, queryByTestId } = renderWithTheme(<UserRoleListScreenWeb />);
    expect(getByTestId('user-role-item-ur-1')).toBeTruthy();
    expect(queryByTestId('user-role-table')).toBeNull();
  });

  it('renders Android and iOS variants', () => {
    const android = renderWithTheme(<UserRoleListScreenAndroid />);
    expect(android.getByTestId('user-role-list-search')).toBeTruthy();
    expect(android.getByTestId('user-role-list-card')).toBeTruthy();

    const ios = renderWithTheme(<UserRoleListScreenIOS />);
    expect(ios.getByTestId('user-role-list-search')).toBeTruthy();
    expect(ios.getByTestId('user-role-list-card')).toBeTruthy();
  });

  it('shows no-results state and clear action', () => {
    const onClearSearchAndFilters = jest.fn();
    useUserRoleListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });

    const { getByTestId } = renderWithTheme(<UserRoleListScreenAndroid />);
    expect(getByTestId('user-role-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('user-role-filter-clear'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('hides delete action when delete handler is unavailable', () => {
    useUserRoleListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      pagedItems: [{ id: 'ur-1', user_name: 'Alice', role_name: 'Admin' }],
      totalItems: 1,
    });

    const { queryByTestId } = renderWithTheme(<UserRoleListScreenAndroid />);
    expect(queryByTestId('user-role-delete-ur-1')).toBeNull();
  });

  it('exports component, hook, and state contract', () => {
    expect(UserRoleListScreenIndex.default).toBeDefined();
    expect(UserRoleListScreenIndex.useUserRoleListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});
