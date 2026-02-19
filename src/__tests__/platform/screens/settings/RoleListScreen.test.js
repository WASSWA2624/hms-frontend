/**
 * RoleListScreen Component Tests
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/RoleListScreen/useRoleListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useRoleListScreen = require('@platform/screens/settings/RoleListScreen/useRoleListScreen').default;
const RoleListScreenWeb = require('@platform/screens/settings/RoleListScreen/RoleListScreen.web').default;
const RoleListScreenAndroid = require('@platform/screens/settings/RoleListScreen/RoleListScreen.android').default;
const RoleListScreenIOS = require('@platform/screens/settings/RoleListScreen/RoleListScreen.ios').default;
const RoleListScreenIndex = require('@platform/screens/settings/RoleListScreen/index.js');
const { STATES } = require('@platform/screens/settings/RoleListScreen/types.js');

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
  filterFieldOptions: [{ value: 'name', label: 'Role name' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  hasActiveSearchOrFilter: false,
  sortField: 'name',
  sortDirection: 'asc',
  columnOrder: ['name', 'description', 'tenant', 'facility'],
  visibleColumns: ['name', 'description', 'tenant', 'facility'],
  isTableMode: true,
  isTableSettingsOpen: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: false,
  noticeMessage: null,
  resolveRoleName: (item) => item.name || 'Role',
  resolveRoleDescription: (item) => item.description || 'Description',
  resolveRoleTenant: (item) => item.tenant_name || 'Tenant',
  resolveRoleFacility: (item) => item.facility_name || 'Facility',
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
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('RoleListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    useRoleListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders DataTable on web in desktop/tablet mode', () => {
    useRoleListScreen.mockReturnValue({
      ...baseHook,
      isTableMode: true,
      pagedItems: [{ id: 'role-1', name: 'Nurse', description: 'Clinical' }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<RoleListScreenWeb />);
    expect(getByTestId('role-table')).toBeTruthy();
  });

  it('keeps advanced filters collapsed by default in desktop/tablet mode', () => {
    useRoleListScreen.mockReturnValue({
      ...baseHook,
      isTableMode: true,
      pagedItems: [{ id: 'role-1', name: 'Nurse', description: 'Clinical' }],
      totalItems: 1,
    });

    const { queryByTestId } = renderWithTheme(<RoleListScreenWeb />);
    expect(queryByTestId('role-filter-body')).toBeNull();
  });

  it('renders list items on web in mobile mode', () => {
    useRoleListScreen.mockReturnValue({
      ...baseHook,
      isTableMode: false,
      pagedItems: [{ id: 'role-1', name: 'Nurse', description: 'Clinical' }],
      totalItems: 1,
    });

    const { getByTestId, queryByTestId } = renderWithTheme(<RoleListScreenWeb />);
    expect(getByTestId('role-item-role-1')).toBeTruthy();
    expect(queryByTestId('role-table')).toBeNull();
  });

  it('renders Android and iOS variants', () => {
    const android = renderWithTheme(<RoleListScreenAndroid />);
    expect(android.getByTestId('role-list-search')).toBeTruthy();
    expect(android.getByTestId('role-list-card')).toBeTruthy();

    const ios = renderWithTheme(<RoleListScreenIOS />);
    expect(ios.getByTestId('role-list-search')).toBeTruthy();
    expect(ios.getByTestId('role-list-card')).toBeTruthy();
  });

  it('shows no-results state and clear action', () => {
    const onClearSearchAndFilters = jest.fn();
    useRoleListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });

    const { getByTestId } = renderWithTheme(<RoleListScreenAndroid />);
    expect(getByTestId('role-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('role-filter-clear'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('hides delete action when delete handler is unavailable', () => {
    useRoleListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      pagedItems: [{ id: 'role-1', name: 'Nurse', description: 'Clinical' }],
      totalItems: 1,
    });

    const { queryByTestId } = renderWithTheme(<RoleListScreenAndroid />);
    expect(queryByTestId('role-delete-role-1')).toBeNull();
  });

  it('exports component, hook, and states contract', () => {
    expect(RoleListScreenIndex.default).toBeDefined();
    expect(RoleListScreenIndex.useRoleListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});
