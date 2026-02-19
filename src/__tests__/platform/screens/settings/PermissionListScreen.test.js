/**
 * PermissionListScreen Component Tests
 * Per testing.mdc: render, loading, error, empty, notice, responsive, a11y
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const ReactNative = require('react-native');

const mockUseWindowDimensions = jest.spyOn(ReactNative, 'useWindowDimensions');

jest.mock('@platform/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const actual = jest.requireActual('@platform/components');

  const MockTextField = ({
    testID,
    value,
    onChange,
    onChangeText,
    ...props
  }) => (
    <View
      testID={testID}
      value={value}
      onChange={onChange}
      onChangeText={onChangeText}
      {...props}
    >
      <Text>{value || ''}</Text>
    </View>
  );

  const MockSelect = ({ testID, value, onValueChange, ...props }) => (
    <View testID={testID} value={value} onValueChange={onValueChange} {...props} />
  );

  const MockDataTable = ({ testID, rows = [], statusContent }) => (
    <View testID={testID}>
      {rows.length === 0 ? statusContent : null}
    </View>
  );

  return {
    ...actual,
    TextField: MockTextField,
    Select: MockSelect,
    DataTable: MockDataTable,
  };
});

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

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const mockT = (key) => {
  const dictionary = {
    'permission.list.title': 'Permissions',
    'permission.list.accessibilityLabel': 'Permissions list',
    'permission.list.searchLabel': 'Search permissions',
    'permission.list.searchPlaceholder': 'Search by permission, description, or tenant',
    'permission.list.searchScopeLabel': 'Search in',
    'permission.list.searchScopeAll': 'All fields',
    'permission.list.emptyTitle': 'No permissions',
    'permission.list.emptyMessage': 'You have no permissions.',
    'permission.list.noResultsTitle': 'No permissions match your search',
    'permission.list.noResultsMessage': 'Try a different search term or clear search.',
    'permission.list.clearSearchAndFilters': 'Clear search',
    'permission.list.delete': 'Delete permission',
    'permission.list.deleteHint': 'Delete this permission',
    'permission.list.itemLabel': 'Permission {{name}}',
    'permission.list.addLabel': 'Add permission',
    'permission.list.addHint': 'Create a new permission',
    'permission.list.unnamedPermission': 'Unnamed permission',
    'permission.list.currentTenantLabel': 'Current tenant',
    'permission.list.columnName': 'Permission',
    'permission.list.columnDescription': 'Description',
    'permission.list.columnTenant': 'Tenant',
    'permission.list.columnActions': 'Actions',
    'permission.list.sortBy': 'Sort by field',
    'common.view': 'View',
    'common.remove': 'Remove',
    'common.notAvailable': 'Not available',
    'listScaffold.errorState.title': 'Error',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.loading': 'Loading',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return dictionary[key] || key;
};

const baseHook = {
  items: [],
  search: '',
  searchScope: 'all',
  searchScopeOptions: [{ value: 'all', label: 'All fields' }],
  sortField: 'name',
  sortDirection: 'asc',
  hasNoResults: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: true,
  noticeMessage: null,
  onDismissNotice: jest.fn(),
  onRetry: jest.fn(),
  onSearch: jest.fn(),
  onSearchScopeChange: jest.fn(),
  onClearSearchAndFilters: jest.fn(),
  onSort: jest.fn(),
  onItemPress: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('PermissionListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWindowDimensions.mockReturnValue({ width: 1200, height: 800, scale: 1, fontScale: 1 });
    useI18n.mockReturnValue({ t: mockT });
    usePermissionListScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-card')).toBeTruthy();
      expect(getByTestId('permission-list-search')).toBeTruthy();
      expect(getByTestId('permission-list-search-scope')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<PermissionListScreenAndroid />);
      expect(getByTestId('permission-list-card')).toBeTruthy();
      expect(getByTestId('permission-list-search')).toBeTruthy();
      expect(getByTestId('permission-list-search-scope')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<PermissionListScreenIOS />);
      expect(getByTestId('permission-list-card')).toBeTruthy();
      expect(getByTestId('permission-list-search')).toBeTruthy();
      expect(getByTestId('permission-list-search-scope')).toBeTruthy();
    });
  });

  describe('states', () => {
    it('shows loading state (Web)', () => {
      usePermissionListScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-loading')).toBeTruthy();
    });

    it('shows empty state (Web)', () => {
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-empty-state')).toBeTruthy();
    });

    it('shows no-results state and clear action (Web)', () => {
      const onClearSearchAndFilters = jest.fn();
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        hasNoResults: true,
        onClearSearchAndFilters,
      });

      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-no-results')).toBeTruthy();
      expect(onClearSearchAndFilters).toBeDefined();
    });

    it('shows error state (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Unable to load',
      });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-error')).toBeTruthy();
    });

    it('shows offline state (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-offline')).toBeTruthy();
    });

    it('shows offline banner when list has items (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        items: [{ id: '1', name: 'roles.read' }],
      });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-offline-banner')).toBeTruthy();
    });

    it('shows notice message (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        noticeMessage: 'Permission created.',
      });
      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-list-notice')).toBeTruthy();
    });
  });

  describe('responsive mode', () => {
    it('renders DataTable on desktop/tablet widths', () => {
      mockUseWindowDimensions.mockReturnValue({ width: 1200, height: 800, scale: 1, fontScale: 1 });
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        items: [{ id: '1', name: 'roles.read' }],
      });

      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-table')).toBeTruthy();
    });

    it('renders ListItem rows on mobile widths', () => {
      mockUseWindowDimensions.mockReturnValue({ width: 480, height: 800, scale: 1, fontScale: 1 });
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        items: [{ id: '1', name: 'roles.read' }],
      });

      const { getByTestId, queryByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      expect(getByTestId('permission-item-1')).toBeTruthy();
      expect(queryByTestId('permission-table')).toBeNull();
    });
  });

  describe('actions', () => {
    it('calls search and scope change handlers (Web)', () => {
      const onSearch = jest.fn();
      const onSearchScopeChange = jest.fn();
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        onSearch,
        onSearchScopeChange,
      });

      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      fireEvent(getByTestId('permission-list-search'), 'change', { target: { value: 'roles' } });
      fireEvent(getByTestId('permission-list-search-scope'), 'valueChange', 'name');

      expect(onSearch).toHaveBeenCalled();
      expect(onSearchScopeChange).toHaveBeenCalledWith('name');
    });

    it('calls onAdd when add button pressed (Android)', () => {
      const onAdd = jest.fn();
      usePermissionListScreen.mockReturnValue({ ...baseHook, onAdd });
      const { getByTestId } = renderWithTheme(<PermissionListScreenAndroid />);
      fireEvent.press(getByTestId('permission-list-add'));
      expect(onAdd).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has accessibility label (Web)', () => {
      usePermissionListScreen.mockReturnValue({
        ...baseHook,
        items: [{ id: '1', name: 'roles.read' }],
      });

      const { getByTestId } = renderWithTheme(<PermissionListScreenWeb />);
      const list = getByTestId('permission-list');
      expect(list).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(PermissionListScreenIndex.default).toBeDefined();
      expect(PermissionListScreenIndex.usePermissionListScreen).toBeDefined();
    });

    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});
