/**
 * UserMfaListScreen Component Tests
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

jest.mock('@platform/screens/settings/UserMfaListScreen/useUserMfaListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserMfaListScreen = require('@platform/screens/settings/UserMfaListScreen/useUserMfaListScreen').default;
const UserMfaListScreenWeb = require('@platform/screens/settings/UserMfaListScreen/UserMfaListScreen.web').default;
const UserMfaListScreenAndroid = require('@platform/screens/settings/UserMfaListScreen/UserMfaListScreen.android').default;
const UserMfaListScreenIOS = require('@platform/screens/settings/UserMfaListScreen/UserMfaListScreen.ios').default;
const UserMfaListScreenIndex = require('@platform/screens/settings/UserMfaListScreen/index.js');
const { STATES } = require('@platform/screens/settings/UserMfaListScreen/types.js');

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
  filters: [{ id: 'f-1', field: 'user', operator: 'contains', value: '' }],
  filterFieldOptions: [{ value: 'user', label: 'User' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  hasActiveSearchOrFilter: false,
  sortField: 'user',
  sortDirection: 'asc',
  columnOrder: ['user', 'channel', 'enabled'],
  visibleColumns: ['user', 'channel', 'enabled'],
  isTableSettingsOpen: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: true,
  noticeMessage: null,
  resolveUserLabel: (item) => item.user_name || 'User',
  resolveChannelLabel: (item) => item.channel || 'Channel',
  resolveEnabledLabel: (item) => (item.is_enabled ? 'On' : 'Off'),
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

describe('UserMfaListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    useUserMfaListScreen.mockReturnValue({ ...baseHook });
    mockUseWindowDimensions.mockReturnValue({
      width: 1280,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
  });

  it('renders DataTable on web in desktop/tablet mode', () => {
    useUserMfaListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'mfa-1', user_name: 'Alice', channel: 'EMAIL', is_enabled: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<UserMfaListScreenWeb />);
    expect(getByTestId('user-mfa-table')).toBeTruthy();
  });

  it('renders mobile filter panel controls in list mode', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    useUserMfaListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'mfa-1', user_name: 'Alice', channel: 'EMAIL', is_enabled: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<UserMfaListScreenWeb />);
    expect(getByTestId('user-mfa-filter-logic')).toBeTruthy();
  });

  it('renders list items on web in mobile mode', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    useUserMfaListScreen.mockReturnValue({
      ...baseHook,
      pagedItems: [{ id: 'mfa-1', user_name: 'Alice', channel: 'EMAIL', is_enabled: true }],
      totalItems: 1,
    });

    const { getByTestId, queryByTestId } = renderWithTheme(<UserMfaListScreenWeb />);
    expect(getByTestId('user-mfa-item-mfa-1')).toBeTruthy();
    expect(queryByTestId('user-mfa-table')).toBeNull();
  });

  it('renders Android and iOS variants', () => {
    const android = renderWithTheme(<UserMfaListScreenAndroid />);
    expect(android.getByTestId('user-mfa-list-search')).toBeTruthy();
    expect(android.getByTestId('user-mfa-list-card')).toBeTruthy();

    const ios = renderWithTheme(<UserMfaListScreenIOS />);
    expect(ios.getByTestId('user-mfa-list-search')).toBeTruthy();
    expect(ios.getByTestId('user-mfa-list-card')).toBeTruthy();
  });

  it('shows no-results state and clear action', () => {
    const onClearSearchAndFilters = jest.fn();
    useUserMfaListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });

    const { getByTestId } = renderWithTheme(<UserMfaListScreenAndroid />);
    expect(getByTestId('user-mfa-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('user-mfa-filter-clear'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('hides delete action when delete handler is unavailable', () => {
    useUserMfaListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      pagedItems: [{ id: 'mfa-1', user_name: 'Alice', channel: 'EMAIL', is_enabled: true }],
      totalItems: 1,
    });

    const { queryByTestId } = renderWithTheme(<UserMfaListScreenAndroid />);
    expect(queryByTestId('user-mfa-delete-mfa-1')).toBeNull();
  });

  it('exports component, hook, and state contract', () => {
    expect(UserMfaListScreenIndex.default).toBeDefined();
    expect(UserMfaListScreenIndex.useUserMfaListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});
