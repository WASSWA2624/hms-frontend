/**
 * PermissionListScreen Component Tests
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

jest.mock('@platform/screens/settings/PermissionListScreen/usePermissionListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const usePermissionListScreen = require('@platform/screens/settings/PermissionListScreen/usePermissionListScreen').default;
const PermissionListScreenWeb = require('@platform/screens/settings/PermissionListScreen/PermissionListScreen.web').default;
const PermissionListScreenAndroid = require('@platform/screens/settings/PermissionListScreen/PermissionListScreen.android').default;
const PermissionListScreenIOS = require('@platform/screens/settings/PermissionListScreen/PermissionListScreen.ios').default;
const PermissionListScreenIndex = require('@platform/screens/settings/PermissionListScreen/index.js');
const { STATES } = require('@platform/screens/settings/PermissionListScreen/types.js');

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
  filterFieldOptions: [{ value: 'name', label: 'Permission name' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  hasActiveSearchOrFilter: false,
  sortField: 'name',
  sortDirection: 'asc',
  columnOrder: ['name', 'description', 'tenant'],
  visibleColumns: ['name', 'description', 'tenant'],
  isTableSettingsOpen: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: false,
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
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  onItemPress: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('PermissionListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWindowDimensions.mockReturnValue({
      width: 1280,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    useI18n.mockReturnValue({ t: (key) => key });
    usePermissionListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders DataTable on web in desktop/tablet mode', () => {
    usePermissionListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'permission-1', name: 'roles.read', description: 'Read roles' }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
    expect(getByTestId('permission-table')).toBeTruthy();
  });

  it('keeps advanced filters collapsed by default on desktop/tablet mode', () => {
    const { queryByTestId } = renderWithTheme(<PermissionListScreenWeb />);
    expect(queryByTestId('permission-filter-body')).toBeNull();
  });

  it('renders mobile web layout without desktop table', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });

    const { getByTestId, queryByTestId } = renderWithTheme(<PermissionListScreenWeb />);
    expect(getByTestId('permission-list-card')).toBeTruthy();
    expect(queryByTestId('permission-table')).toBeNull();
  });

  it('renders Android and iOS variants with filters and pagination controls', () => {
    const mobileHook = {
      ...baseHook,
      pagedItems: [{ id: 'permission-1', name: 'roles.read', description: 'Read roles' }],
      totalItems: 1,
      totalPages: 1,
    };
    usePermissionListScreen.mockReturnValue(mobileHook);

    const android = renderWithTheme(<PermissionListScreenAndroid />);
    expect(android.getByTestId('permission-list-search')).toBeTruthy();
    expect(android.getByTestId('permission-filter-logic')).toBeTruthy();
    expect(android.getByTestId('permission-page-size')).toBeTruthy();

    const ios = renderWithTheme(<PermissionListScreenIOS />);
    expect(ios.getByTestId('permission-list-search')).toBeTruthy();
    expect(ios.getByTestId('permission-filter-logic')).toBeTruthy();
    expect(ios.getByTestId('permission-page-size')).toBeTruthy();
  });

  it('shows no-results state and clear action on mobile', () => {
    const onClearSearchAndFilters = jest.fn();
    usePermissionListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });

    const { getByTestId } = renderWithTheme(<PermissionListScreenAndroid />);
    expect(getByTestId('permission-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('permission-filter-clear'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('hides delete action when delete handler is unavailable', () => {
    usePermissionListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      pagedItems: [{ id: 'permission-1', name: 'roles.read', description: 'Read roles' }],
      totalItems: 1,
    });

    const { queryByTestId } = renderWithTheme(<PermissionListScreenAndroid />);
    expect(queryByTestId('permission-delete-permission-1')).toBeNull();
  });

  it('exports component, hook, and states contract', () => {
    expect(PermissionListScreenIndex.default).toBeDefined();
    expect(PermissionListScreenIndex.usePermissionListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});
