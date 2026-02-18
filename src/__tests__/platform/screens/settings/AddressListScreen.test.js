/**
 * AddressListScreen Component Tests
 * Coverage for address list states, action visibility, and responsive web mode.
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

jest.mock('@platform/screens/settings/AddressListScreen/useAddressListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useAddressListScreen = require('@platform/screens/settings/AddressListScreen/useAddressListScreen').default;
const AddressListScreenWeb = require('@platform/screens/settings/AddressListScreen/AddressListScreen.web').default;
const AddressListScreenAndroid = require('@platform/screens/settings/AddressListScreen/AddressListScreen.android').default;
const AddressListScreenIOS = require('@platform/screens/settings/AddressListScreen/AddressListScreen.ios').default;
const AddressListScreenIndex = require('@platform/screens/settings/AddressListScreen/index.js');
const { STATES } = require('@platform/screens/settings/AddressListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'address.list.accessibilityLabel': 'Addresses list',
    'address.list.searchPlaceholder': 'Search addresses',
    'address.list.searchLabel': 'Search addresses',
    'address.list.searchScopeLabel': 'Search field',
    'address.list.searchScopeAll': 'All fields',
    'address.list.emptyTitle': 'No addresses',
    'address.list.emptyMessage': 'You have no addresses.',
    'address.list.noResultsTitle': 'No matching addresses',
    'address.list.noResultsMessage': 'Try changing your search text or filters.',
    'address.list.clearSearchAndFilters': 'Clear search and filters',
    'address.list.statusLabel': 'Status',
    'address.list.statusActive': 'Active',
    'address.list.statusInactive': 'Inactive',
    'address.list.unnamed': 'Unnamed address',
    'address.list.contextValue': '{{tenant}} - {{facility}}',
    'address.list.facilityValue': 'Facility: {{facility}}',
    'address.list.tenantValue': 'Tenant: {{tenant}}',
    'address.list.addLabel': 'Add address',
    'address.list.addHint': 'Create a new address',
    'address.list.view': 'View',
    'address.list.viewHint': 'Open address details',
    'address.list.edit': 'Edit',
    'address.list.editHint': 'Open address editor',
    'address.list.deleteHint': 'Delete this address',
    'address.list.itemLabel': 'Address {{name}}',
    'address.list.itemHint': 'View details for {{name}}',
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
  onAddressPress: jest.fn(),
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
  selectedAddressIds: [],
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
  onToggleAddressSelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  onAddressPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('AddressListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useAddressListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    expect(getByTestId('address-list-search')).toBeTruthy();
    expect(getByTestId('address-list-search-scope')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<AddressListScreenIOS />);
    expect(getByTestId('address-list-search')).toBeTruthy();
    expect(getByTestId('address-list-search-scope')).toBeTruthy();
  });

  it('shows loading state (Android)', () => {
    useAddressListScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    expect(getByTestId('address-list-loading')).toBeTruthy();
  });

  it('shows empty state (Android)', () => {
    const { getByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    expect(getByTestId('address-list-empty-state')).toBeTruthy();
  });

  it('shows no-results state and clear action (Android)', () => {
    const onClearSearchAndFilters = jest.fn();
    useAddressListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const { getByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    expect(getByTestId('address-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('address-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows error state (Android)', () => {
    useAddressListScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Could not load facilities',
    });
    const { getByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    expect(getByTestId('address-list-error')).toBeTruthy();
  });

  it('shows offline state (Android)', () => {
    useAddressListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    expect(getByTestId('address-list-offline')).toBeTruthy();
  });

  it('hides offline state when address rows are available', () => {
    useAddressListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      items: [{ id: 'address-1', name: 'Cached Address', address_type: 'CLINIC', is_active: true }],
    });
    const { queryByTestId, getByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    expect(queryByTestId('address-list-offline')).toBeNull();
    expect(getByTestId('address-list-offline-banner')).toBeTruthy();
    expect(getByTestId('address-item-address-1')).toBeTruthy();
  });

  it('renders DataTable on web for desktop/tablet mode', () => {
    useAddressListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'address-1', name: 'Address 1', address_type: 'HOSPITAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<AddressListScreenWeb />);
    expect(getByTestId('address-table')).toBeTruthy();
  });

  it('renders list items on web for mobile mode', () => {
    useAddressListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'address-1', name: 'Address 1', address_type: 'HOSPITAL', is_active: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<AddressListScreenWeb />);
    expect(getByTestId('address-item-address-1')).toBeTruthy();
  });

  it('shows notice message (Android)', () => {
    useAddressListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'Address created.',
    });
    const { getByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    expect(getByTestId('address-list-notice')).toBeTruthy();
  });

  it('calls onAdd when add button is pressed (Android)', () => {
    const onAdd = jest.fn();
    useAddressListScreen.mockReturnValue({ ...baseHook, onAdd });
    const { getByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    fireEvent.press(getByTestId('address-list-add'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides delete action when onDelete is undefined', () => {
    useAddressListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      items: [{ id: 'address-1', name: 'Address 1', address_type: 'HOSPITAL', is_active: true }],
    });
    const { queryByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    expect(queryByTestId('address-delete-address-1')).toBeNull();
  });

  it('shows address CRUD controls when handlers are available', () => {
    useAddressListScreen.mockReturnValue({
      ...baseHook,
      items: [{ id: 'address-1', name: 'Address 1', address_type: 'HOSPITAL', is_active: true }],
    });
    const { getByTestId } = renderWithTheme(<AddressListScreenAndroid />);
    expect(getByTestId('address-view-address-1')).toBeTruthy();
    expect(getByTestId('address-edit-address-1')).toBeTruthy();
    expect(getByTestId('address-delete-address-1')).toBeTruthy();
  });

  it('exports component and hook from index and keeps states contract', () => {
    expect(AddressListScreenIndex.default).toBeDefined();
    expect(AddressListScreenIndex.useAddressListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});

