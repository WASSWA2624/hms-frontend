/**
 * UserSessionListScreen Component Tests
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const ReactNative = require('react-native');
const { useI18n } = require('@hooks');

const mockUseWindowDimensions = jest.spyOn(ReactNative, 'useWindowDimensions');
const mockDataTable = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/components', () => {
  const React = require('react');
  const { View } = require('react-native');
  const actual = jest.requireActual('@platform/components');

  return {
    ...actual,
    DataTable: (props) => {
      mockDataTable(props);
      const {
        testID,
        searchBar,
        filterBar,
        statusContent,
        pagination,
        tableNavigation,
      } = props;

      return (
        <View testID={testID}>
          {searchBar}
          {filterBar}
          {statusContent}
          {pagination}
          {tableNavigation}
        </View>
      );
    },
  };
});

jest.mock('@platform/screens/settings/UserSessionListScreen/useUserSessionListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserSessionListScreen = require('@platform/screens/settings/UserSessionListScreen/useUserSessionListScreen').default;
const UserSessionListScreenWeb = require('@platform/screens/settings/UserSessionListScreen/UserSessionListScreen.web').default;
const UserSessionListScreenAndroid = require('@platform/screens/settings/UserSessionListScreen/UserSessionListScreen.android').default;
const UserSessionListScreenIOS = require('@platform/screens/settings/UserSessionListScreen/UserSessionListScreen.ios').default;
const UserSessionListScreenIndex = require('@platform/screens/settings/UserSessionListScreen/index.js');
const { STATES } = require('@platform/screens/settings/UserSessionListScreen/types.js');

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
  filters: [{ id: 'f-1', field: 'session', operator: 'contains', value: '' }],
  filterFieldOptions: [{ value: 'session', label: 'Session' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  hasActiveSearchOrFilter: false,
  sortField: 'started',
  sortDirection: 'desc',
  columnOrder: ['session', 'status', 'started', 'expires'],
  visibleColumns: ['session', 'status', 'started', 'expires'],
  isTableSettingsOpen: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  noticeMessage: null,
  resolveSessionLabel: (item) => item.session_name || 'Session',
  resolveStatusLabel: (item) => (item.revoked_at ? 'Revoked' : 'Active'),
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

describe('UserSessionListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key, locale: 'en' });
    useUserSessionListScreen.mockReturnValue({ ...baseHook });
    mockUseWindowDimensions.mockReturnValue({
      width: 1280,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
  });

  it('renders DataTable on web in desktop/tablet mode', () => {
    useUserSessionListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{
        id: 'session-1',
        session_name: 'Alice Session',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2099-01-01T00:00:00Z',
      }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<UserSessionListScreenWeb />);
    expect(getByTestId('user-session-table')).toBeTruthy();
  });

  it('keeps desktop filter panel collapsed by default', () => {
    useUserSessionListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{
        id: 'session-1',
        session_name: 'Alice Session',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2099-01-01T00:00:00Z',
      }],
      totalItems: 1,
    });

    const { queryByText } = renderWithTheme(<UserSessionListScreenWeb />);
    expect(queryByText('userSession.list.filterLogicLabel')).toBeNull();
  });

  it('keeps mobile filter panel expanded by default', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    useUserSessionListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{
        id: 'session-1',
        session_name: 'Alice Session',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2099-01-01T00:00:00Z',
      }],
      totalItems: 1,
    });

    const { getByText } = renderWithTheme(<UserSessionListScreenWeb />);
    expect(getByText('userSession.list.filterLogicLabel')).toBeTruthy();
  });

  it('renders list items on web in mobile mode', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    useUserSessionListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{
        id: 'session-1',
        session_name: 'Alice Session',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2099-01-01T00:00:00Z',
      }],
      totalItems: 1,
    });

    const { getByTestId, queryByTestId } = renderWithTheme(<UserSessionListScreenWeb />);
    expect(getByTestId('user-session-item-session-1')).toBeTruthy();
    expect(queryByTestId('user-session-table')).toBeNull();
  });

  it('passes hasActiveFilters signal to DataTable', () => {
    useUserSessionListScreen.mockReturnValue({
      ...baseHook,
      hasActiveSearchOrFilter: true,
      pagedItems: [{
        id: 'session-1',
        session_name: 'Alice Session',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2099-01-01T00:00:00Z',
      }],
      totalItems: 1,
    });

    renderWithTheme(<UserSessionListScreenWeb />);

    expect(mockDataTable).toHaveBeenCalled();
    expect(mockDataTable.mock.calls[0][0].hasActiveFilters).toBe(true);
  });

  it('renders Android and iOS variants', () => {
    const android = renderWithTheme(<UserSessionListScreenAndroid />);
    expect(android.getByTestId('user-session-list-search')).toBeTruthy();
    expect(android.getByTestId('user-session-list-card')).toBeTruthy();

    const ios = renderWithTheme(<UserSessionListScreenIOS />);
    expect(ios.getByTestId('user-session-list-search')).toBeTruthy();
    expect(ios.getByTestId('user-session-list-card')).toBeTruthy();
  });

  it('shows no-results state and clear action', () => {
    const onClearSearchAndFilters = jest.fn();
    useUserSessionListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });

    const { getByTestId } = renderWithTheme(<UserSessionListScreenAndroid />);
    expect(getByTestId('user-session-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('user-session-filter-clear'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('keeps read-only surface (no add/delete controls)', () => {
    useUserSessionListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{
        id: 'session-1',
        session_name: 'Alice Session',
        created_at: '2025-01-01T00:00:00Z',
        expires_at: '2099-01-01T00:00:00Z',
      }],
      totalItems: 1,
      onAdd: undefined,
      onDelete: undefined,
    });

    const { queryByTestId } = renderWithTheme(<UserSessionListScreenWeb />);
    expect(queryByTestId('user-session-list-add')).toBeNull();
    expect(queryByTestId('user-session-delete-session-1')).toBeNull();
  });

  it('exports component, hook, and state contract', () => {
    expect(UserSessionListScreenIndex.default).toBeDefined();
    expect(UserSessionListScreenIndex.useUserSessionListScreen).toBeDefined();
    expect(STATES.READY).toBe('ready');
  });
});
