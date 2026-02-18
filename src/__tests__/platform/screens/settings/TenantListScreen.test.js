/**
 * TenantListScreen Component Tests
 * Native-focused coverage for tenant list states and action visibility.
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

jest.mock('@platform/screens/settings/TenantListScreen/useTenantListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useTenantListScreen = require('@platform/screens/settings/TenantListScreen/useTenantListScreen').default;
const TenantListScreenAndroid = require('@platform/screens/settings/TenantListScreen/TenantListScreen.android').default;
const TenantListScreenIOS = require('@platform/screens/settings/TenantListScreen/TenantListScreen.ios').default;
const TenantListScreenIndex = require('@platform/screens/settings/TenantListScreen/index.js');
const { STATES } = require('@platform/screens/settings/TenantListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'tenant.list.accessibilityLabel': 'Tenants list',
    'tenant.list.searchPlaceholder': 'Search tenants',
    'tenant.list.searchLabel': 'Search tenants',
    'tenant.list.searchScopeLabel': 'Search field',
    'tenant.list.searchScopeAll': 'All fields',
    'tenant.list.emptyTitle': 'No tenants',
    'tenant.list.emptyMessage': 'You have no tenants.',
    'tenant.list.noResultsTitle': 'No matching tenants',
    'tenant.list.noResultsMessage': 'Try changing your search text or filters.',
    'tenant.list.clearSearchAndFilters': 'Clear search and filters',
    'tenant.list.idValue': 'ID: {{id}}',
    'tenant.list.slugValue': 'Slug: {{slug}}',
    'tenant.list.statusLabel': 'Status',
    'tenant.list.statusActive': 'Active',
    'tenant.list.statusInactive': 'Inactive',
    'tenant.list.unnamed': 'Unnamed tenant',
    'tenant.list.addLabel': 'Add tenant',
    'tenant.list.addHint': 'Create a new tenant',
    'tenant.list.view': 'View',
    'tenant.list.viewHint': 'Open tenant details',
    'tenant.list.edit': 'Edit',
    'tenant.list.editHint': 'Open tenant editor',
    'tenant.list.deleteHint': 'Delete this tenant',
    'tenant.list.itemLabel': 'Tenant {{name}}',
    'tenant.list.itemHint': 'View details for {{name}}',
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
  onTenantPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('TenantListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useTenantListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<TenantListScreenAndroid />);
    expect(getByTestId('tenant-list-search')).toBeTruthy();
    expect(getByTestId('tenant-list-search-scope')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<TenantListScreenIOS />);
    expect(getByTestId('tenant-list-search')).toBeTruthy();
    expect(getByTestId('tenant-list-search-scope')).toBeTruthy();
  });

  it('shows loading state (Android)', () => {
    useTenantListScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<TenantListScreenAndroid />);
    expect(getByTestId('tenant-list-loading')).toBeTruthy();
  });

  it('shows empty state (Android)', () => {
    const { getByTestId } = renderWithTheme(<TenantListScreenAndroid />);
    expect(getByTestId('tenant-list-empty-state')).toBeTruthy();
  });

  it('shows no-results state and clear action (Android)', () => {
    const onClearSearchAndFilters = jest.fn();
    useTenantListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const { getByTestId } = renderWithTheme(<TenantListScreenAndroid />);
    expect(getByTestId('tenant-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('tenant-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows error state (Android)', () => {
    useTenantListScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Could not load tenants',
    });
    const { getByTestId } = renderWithTheme(<TenantListScreenAndroid />);
    expect(getByTestId('tenant-list-error')).toBeTruthy();
  });

  it('shows offline state (Android)', () => {
    useTenantListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<TenantListScreenAndroid />);
    expect(getByTestId('tenant-list-offline')).toBeTruthy();
  });

  it('shows notice message (Android)', () => {
    useTenantListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'Tenant created.',
    });
    const { getByTestId } = renderWithTheme(<TenantListScreenAndroid />);
    expect(getByTestId('tenant-list-notice')).toBeTruthy();
  });

  it('calls onAdd when add button is pressed (Android)', () => {
    const onAdd = jest.fn();
    useTenantListScreen.mockReturnValue({ ...baseHook, onAdd });
    const { getByTestId } = renderWithTheme(<TenantListScreenAndroid />);
    fireEvent.press(getByTestId('tenant-list-add'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides delete action when onDelete is undefined', () => {
    useTenantListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      items: [{ id: 'tenant-1', name: 'Tenant 1', slug: 'tenant-1', is_active: true }],
    });
    const { queryByTestId } = renderWithTheme(<TenantListScreenAndroid />);
    expect(queryByTestId('tenant-delete-tenant-1')).toBeNull();
  });

  it('shows tenant CRUD controls when handlers are available', () => {
    useTenantListScreen.mockReturnValue({
      ...baseHook,
      items: [{ id: 'tenant-1', name: 'Tenant 1', slug: 'tenant-1', is_active: true }],
    });
    const { getByTestId } = renderWithTheme(<TenantListScreenAndroid />);
    expect(getByTestId('tenant-view-tenant-1')).toBeTruthy();
    expect(getByTestId('tenant-edit-tenant-1')).toBeTruthy();
    expect(getByTestId('tenant-delete-tenant-1')).toBeTruthy();
  });

  it('exports component and hook from index and keeps states contract', () => {
    expect(TenantListScreenIndex.default).toBeDefined();
    expect(TenantListScreenIndex.useTenantListScreen).toBeDefined();
    expect(STATES.READY).toBe('ready');
  });
});
