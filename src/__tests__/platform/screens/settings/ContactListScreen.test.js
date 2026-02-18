/**
 * ContactListScreen Component Tests
 * Coverage for contact list states, action visibility, and responsive web mode.
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

jest.mock('@platform/screens/settings/ContactListScreen/useContactListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useContactListScreen = require('@platform/screens/settings/ContactListScreen/useContactListScreen').default;
const ContactListScreenWeb = require('@platform/screens/settings/ContactListScreen/ContactListScreen.web').default;
const ContactListScreenAndroid = require('@platform/screens/settings/ContactListScreen/ContactListScreen.android').default;
const ContactListScreenIOS = require('@platform/screens/settings/ContactListScreen/ContactListScreen.ios').default;
const ContactListScreenIndex = require('@platform/screens/settings/ContactListScreen/index.js');
const { STATES } = require('@platform/screens/settings/ContactListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key, values = {}) => {
  const dictionary = {
    'contact.list.accessibilityLabel': 'Contacts list',
    'contact.list.searchPlaceholder': 'Search contacts',
    'contact.list.searchLabel': 'Search contacts',
    'contact.list.searchScopeLabel': 'Search field',
    'contact.list.searchScopeAll': 'All fields',
    'contact.list.emptyTitle': 'No contacts',
    'contact.list.emptyMessage': 'You have no contacts.',
    'contact.list.noResultsTitle': 'No matching contacts',
    'contact.list.noResultsMessage': 'Try changing your search text or filters.',
    'contact.list.clearSearchAndFilters': 'Clear search and filters',
    'contact.list.unnamed': 'Unnamed contact',
    'contact.list.contextValue': `${values.type || '{{type}}'} - ${values.tenant || '{{tenant}}'}`,
    'contact.list.typeValue': `Type: ${values.type || '{{type}}'}`,
    'contact.list.tenantValue': `Tenant: ${values.tenant || '{{tenant}}'}`,
    'contact.list.currentTenant': 'Current tenant',
    'contact.list.primaryLabel': 'Primary status',
    'contact.list.primaryStatePrimary': 'Primary',
    'contact.list.primaryStateSecondary': 'Secondary',
    'contact.list.columnValue': 'Value',
    'contact.list.columnType': 'Type',
    'contact.list.columnTenant': 'Tenant',
    'contact.list.columnPrimary': 'Primary',
    'contact.list.columnActions': 'Actions',
    'contact.list.sortBy': `Sort by ${values.field || 'Value'}`,
    'contact.list.filterLogicLabel': 'Filter logic',
    'contact.list.filterFieldLabel': 'Field',
    'contact.list.filterOperatorLabel': 'Operator',
    'contact.list.filterValueLabel': 'Value',
    'contact.list.filterValuePlaceholder': 'Enter value',
    'contact.list.addFilter': 'Add filter',
    'contact.list.removeFilter': 'Remove filter',
    'contact.list.bulkSelectedCount': `${values.count || 0} selected`,
    'contact.list.bulkDelete': 'Remove selected',
    'contact.list.clearSelection': 'Clear selection',
    'contact.list.selectPage': 'Select page',
    'contact.list.selectContact': `Select ${values.name || 'contact'}`,
    'contact.list.pageSummary': `Page ${values.page || 1} of ${values.totalPages || 1} - ${values.total || 0} contacts`,
    'contact.list.pageSizeLabel': 'Rows',
    'contact.list.densityLabel': 'Density',
    'contact.list.tableSettings': 'Table settings',
    'contact.list.visibleColumns': 'Visible columns and order',
    'contact.list.moveColumnLeft': `Move ${values.column || 'Value'} left`,
    'contact.list.moveColumnRight': `Move ${values.column || 'Value'} right`,
    'contact.list.resetTablePreferences': 'Reset table preferences',
    'contact.list.addLabel': 'Add contact',
    'contact.list.addHint': 'Create a new contact',
    'contact.list.view': 'View',
    'contact.list.viewHint': 'Open contact details',
    'contact.list.edit': 'Edit',
    'contact.list.editHint': 'Open contact editor',
    'contact.list.deleteHint': 'Delete this contact',
    'contact.list.itemLabel': `Contact ${values.name || '{{name}}'}`,
    'contact.list.itemHint': `View details for ${values.name || '{{name}}'}`,
    'listScaffold.errorState.title': 'Error',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.loading': 'Loading',
    'common.remove': 'Remove',
    'common.more': 'More',
    'common.notAvailable': 'Not available',
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
  canViewTechnicalIds: false,
  onDismissNotice: jest.fn(),
  onRetry: jest.fn(),
  onSearch: jest.fn(),
  onSearchScopeChange: jest.fn(),
  onClearSearchAndFilters: jest.fn(),
  onContactPress: jest.fn(),
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
  filters: [{ id: 'f1', field: 'value', operator: 'contains', value: '' }],
  filterFieldOptions: [{ value: 'value', label: 'Value' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  sortField: 'value',
  sortDirection: 'asc',
  columnOrder: ['value', 'type', 'tenant', 'primary'],
  visibleColumns: ['value', 'type', 'tenant', 'primary'],
  selectedContactIds: [],
  allPageSelected: false,
  isTableMode: true,
  isTableSettingsOpen: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  noticeMessage: null,
  canViewTechnicalIds: false,
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
  onToggleContactSelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  onContactPress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('ContactListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useContactListScreen.mockReturnValue({ ...baseHook });
  });

  it('renders without error (Android)', () => {
    const { getByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    expect(getByTestId('contact-list-search')).toBeTruthy();
    expect(getByTestId('contact-list-search-scope')).toBeTruthy();
  });

  it('renders without error (iOS)', () => {
    const { getByTestId } = renderWithTheme(<ContactListScreenIOS />);
    expect(getByTestId('contact-list-search')).toBeTruthy();
    expect(getByTestId('contact-list-search-scope')).toBeTruthy();
  });

  it('shows loading state (Android)', () => {
    useContactListScreen.mockReturnValue({ ...baseHook, isLoading: true });
    const { getByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    expect(getByTestId('contact-list-loading')).toBeTruthy();
  });

  it('shows empty state (Android)', () => {
    const { getByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    expect(getByTestId('contact-list-empty-state')).toBeTruthy();
  });

  it('shows no-results state and clear action (Android)', () => {
    const onClearSearchAndFilters = jest.fn();
    useContactListScreen.mockReturnValue({
      ...baseHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const { getByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    expect(getByTestId('contact-list-no-results')).toBeTruthy();
    fireEvent.press(getByTestId('contact-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('shows error state (Android)', () => {
    useContactListScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'Could not load contacts',
    });
    const { getByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    expect(getByTestId('contact-list-error')).toBeTruthy();
  });

  it('shows offline state (Android)', () => {
    useContactListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
    });
    const { getByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    expect(getByTestId('contact-list-offline')).toBeTruthy();
  });

  it('hides offline state when contact rows are available', () => {
    useContactListScreen.mockReturnValue({
      ...baseHook,
      isOffline: true,
      items: [{ id: 'contact-1', value: 'cached@acme.org', contact_type: 'EMAIL', is_primary: true }],
    });
    const { queryByTestId, getByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    expect(queryByTestId('contact-list-offline')).toBeNull();
    expect(getByTestId('contact-list-offline-banner')).toBeTruthy();
    expect(getByTestId('contact-item-contact-1')).toBeTruthy();
  });

  it('renders DataTable on web for desktop/tablet mode', () => {
    useContactListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'contact-1', value: 'contact@acme.org', contact_type: 'EMAIL', is_primary: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<ContactListScreenWeb />);
    expect(getByTestId('contact-table')).toBeTruthy();
  });

  it('renders list items on web for mobile mode', () => {
    useContactListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'contact-1', value: 'contact@acme.org', contact_type: 'EMAIL', is_primary: true }],
      totalItems: 1,
    });

    const { getByTestId } = renderWithTheme(<ContactListScreenWeb />);
    expect(getByTestId('contact-item-contact-1')).toBeTruthy();
  });

  it('shows notice message (Android)', () => {
    useContactListScreen.mockReturnValue({
      ...baseHook,
      noticeMessage: 'Contact created.',
    });
    const { getByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    expect(getByTestId('contact-list-notice')).toBeTruthy();
  });

  it('calls onAdd when add button is pressed (Android)', () => {
    const onAdd = jest.fn();
    useContactListScreen.mockReturnValue({ ...baseHook, onAdd });
    const { getByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    fireEvent.press(getByTestId('contact-list-add'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('hides delete action when onDelete is undefined', () => {
    useContactListScreen.mockReturnValue({
      ...baseHook,
      onDelete: undefined,
      items: [{ id: 'contact-1', value: 'contact@acme.org', contact_type: 'EMAIL', is_primary: true }],
    });
    const { queryByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    expect(queryByTestId('contact-delete-contact-1')).toBeNull();
  });

  it('shows contact CRUD controls when handlers are available', () => {
    useContactListScreen.mockReturnValue({
      ...baseHook,
      items: [{ id: 'contact-1', value: 'contact@acme.org', contact_type: 'EMAIL', is_primary: true }],
    });
    const { getByTestId } = renderWithTheme(<ContactListScreenAndroid />);
    expect(getByTestId('contact-view-contact-1')).toBeTruthy();
    expect(getByTestId('contact-edit-contact-1')).toBeTruthy();
    expect(getByTestId('contact-delete-contact-1')).toBeTruthy();
  });

  it('exports component and hook from index and keeps states contract', () => {
    expect(ContactListScreenIndex.default).toBeDefined();
    expect(ContactListScreenIndex.useContactListScreen).toBeDefined();
    expect(STATES.SUCCESS).toBe('success');
  });
});