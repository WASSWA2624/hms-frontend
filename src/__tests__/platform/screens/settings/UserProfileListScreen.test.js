/**
 * UserProfileListScreen Component Tests
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
      {onView ? <actual.Button testID={viewTestID} onPress={onView}>view</actual.Button> : null}
      {onEdit ? <actual.Button testID={editTestID} onPress={onEdit}>edit</actual.Button> : null}
      {onDelete ? <actual.Button testID={deleteTestID} onPress={onDelete}>delete</actual.Button> : null}
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

jest.mock('@platform/screens/settings/UserProfileListScreen/useUserProfileListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserProfileListScreen = require('@platform/screens/settings/UserProfileListScreen/useUserProfileListScreen').default;
const UserProfileListScreenWeb = require('@platform/screens/settings/UserProfileListScreen/UserProfileListScreen.web').default;
const UserProfileListScreenAndroid = require('@platform/screens/settings/UserProfileListScreen/UserProfileListScreen.android').default;
const UserProfileListScreenIOS = require('@platform/screens/settings/UserProfileListScreen/UserProfileListScreen.ios').default;
const UserProfileListScreenIndex = require('@platform/screens/settings/UserProfileListScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key, values = {}) => {
  const dictionary = {
    'userProfile.list.accessibilityLabel': 'User profiles list',
    'userProfile.list.searchPlaceholder': 'Search user profiles',
    'userProfile.list.searchLabel': 'Search user profiles',
    'userProfile.list.searchScopeLabel': 'Search field',
    'userProfile.list.searchScopeAll': 'All fields',
    'userProfile.list.emptyTitle': 'No user profiles',
    'userProfile.list.emptyMessage': 'You have no user profiles.',
    'userProfile.list.noResultsTitle': 'No matching user profiles',
    'userProfile.list.noResultsMessage': 'Try changing your search text or filters.',
    'userProfile.list.clearSearchAndFilters': 'Clear search and filters',
    'userProfile.list.unnamed': 'Unnamed profile',
    'userProfile.list.currentUser': 'Current user',
    'userProfile.list.currentFacility': 'Current facility',
    'userProfile.list.columnProfile': 'Profile',
    'userProfile.list.columnUser': 'User',
    'userProfile.list.columnFacility': 'Facility',
    'userProfile.list.columnGender': 'Gender',
    'userProfile.list.columnDob': 'Date of birth',
    'userProfile.list.columnActions': 'Actions',
    'userProfile.list.sortBy': `Sort by ${values.field || 'Profile'}`,
    'userProfile.list.filterLogicLabel': 'Filter logic',
    'userProfile.list.filterFieldLabel': 'Field',
    'userProfile.list.filterOperatorLabel': 'Operator',
    'userProfile.list.filterValueLabel': 'Value',
    'userProfile.list.filterValuePlaceholder': 'Enter value',
    'userProfile.list.addFilter': 'Add filter',
    'userProfile.list.removeFilter': 'Remove filter',
    'userProfile.list.bulkSelectedCount': `${values.count || 0} selected`,
    'userProfile.list.bulkDelete': 'Remove selected',
    'userProfile.list.clearSelection': 'Clear selection',
    'userProfile.list.selectPage': 'Select page',
    'userProfile.list.selectProfile': `Select ${values.name || 'profile'}`,
    'userProfile.list.pageSummary': `Page ${values.page || 1} of ${values.totalPages || 1} - ${values.total || 0} user profiles`,
    'userProfile.list.pageSizeLabel': 'Rows',
    'userProfile.list.densityLabel': 'Density',
    'userProfile.list.tableSettings': 'Table settings',
    'userProfile.list.visibleColumns': 'Visible columns and order',
    'userProfile.list.moveColumnLeft': `Move ${values.column || 'Profile'} left`,
    'userProfile.list.moveColumnRight': `Move ${values.column || 'Profile'} right`,
    'userProfile.list.resetTablePreferences': 'Reset table preferences',
    'userProfile.list.addLabel': 'Add user profile',
    'userProfile.list.addHint': 'Create a user profile',
    'userProfile.list.view': 'View',
    'userProfile.list.viewHint': 'Open details',
    'userProfile.list.edit': 'Edit',
    'userProfile.list.editHint': 'Open editor',
    'userProfile.list.deleteHint': 'Delete this user profile',
    'userProfile.list.itemLabel': `User profile ${values.name || '{{name}}'}`,
    'userProfile.list.itemHint': `View details for ${values.name || '{{name}}'}`,
    'userProfile.list.genderLabel': 'Gender',
    'userProfile.list.dobLabel': 'Date of birth',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.loading': 'Loading',
    'common.remove': 'Remove',
    'common.more': 'More',
    'common.previous': 'Previous',
    'common.next': 'Next',
    'common.notAvailable': 'Not available',
    'listScaffold.errorState.title': 'Error',
    'shell.banners.offline.title': 'Offline',
    'shell.banners.offline.message': 'No connection',
  };
  return dictionary[key] || key;
};

const baseMobileHook = {
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
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onDensityChange: jest.fn(),
  onProfilePress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
  resolveProfileDisplayName: jest.fn((profile) => profile?.first_name || 'Profile'),
  resolveProfileUserDisplay: jest.fn(() => 'user@acme.org'),
  resolveProfileFacilityDisplay: jest.fn(() => 'Main Facility'),
  resolveProfileGenderDisplay: jest.fn(() => 'Female'),
  resolveProfileDobDisplay: jest.fn(() => '1990-01-01'),
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
  filters: [{ id: 'f1', field: 'profile', operator: 'contains', value: '' }],
  filterFieldOptions: [{ value: 'profile', label: 'Profile name' }],
  filterLogic: 'AND',
  filterLogicOptions: [{ value: 'AND', label: 'AND' }],
  canAddFilter: true,
  hasNoResults: false,
  sortField: 'profile',
  sortDirection: 'asc',
  columnOrder: ['profile', 'user', 'facility', 'gender', 'dob'],
  visibleColumns: ['profile', 'user', 'facility', 'gender', 'dob'],
  selectedProfileIds: [],
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
  onToggleProfileSelection: jest.fn(),
  onTogglePageSelection: jest.fn(),
  onClearSelection: jest.fn(),
  onBulkDelete: undefined,
  resolveFilterOperatorOptions: jest.fn(() => [{ value: 'contains', label: 'Contains' }]),
  resolveProfileDisplayName: jest.fn((profile) => profile?.first_name || 'Profile'),
  resolveProfileUserDisplay: jest.fn(() => 'user@acme.org'),
  resolveProfileFacilityDisplay: jest.fn(() => 'Main Facility'),
  resolveProfileGenderDisplay: jest.fn(() => 'Female'),
  resolveProfileDobDisplay: jest.fn(() => '1990-01-01'),
  onProfilePress: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('UserProfileListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useUserProfileListScreen.mockReturnValue({ ...baseMobileHook });
  });

  it('renders mobile variants (Android/iOS)', () => {
    expect(renderWithTheme(<UserProfileListScreenAndroid />).getByTestId('user-profile-list-search')).toBeTruthy();
    expect(renderWithTheme(<UserProfileListScreenIOS />).getByTestId('user-profile-list-search')).toBeTruthy();
  });

  it('renders desktop table on web in table mode', () => {
    useUserProfileListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'profile-1', first_name: 'Jane' }],
      totalItems: 1,
    });
    expect(renderWithTheme(<UserProfileListScreenWeb />).getByTestId('user-profile-table')).toBeTruthy();
  });

  it('keeps advanced filters collapsed by default in desktop/tablet mode', () => {
    useUserProfileListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: true,
      pagedItems: [{ id: 'profile-1', first_name: 'Jane' }],
      totalItems: 1,
    });
    expect(renderWithTheme(<UserProfileListScreenWeb />).queryByTestId('user-profile-filter-body')).toBeNull();
  });

  it('renders mobile list on web when not in table mode', () => {
    useUserProfileListScreen.mockReturnValue({
      ...baseWebHook,
      isTableMode: false,
      pagedItems: [{ id: 'profile-1', first_name: 'Jane' }],
      totalItems: 1,
    });
    expect(renderWithTheme(<UserProfileListScreenWeb />).getByTestId('user-profile-item-profile-1')).toBeTruthy();
  });

  it('shows no-results and triggers clear action on Android', () => {
    const onClearSearchAndFilters = jest.fn();
    useUserProfileListScreen.mockReturnValue({
      ...baseMobileHook,
      hasNoResults: true,
      onClearSearchAndFilters,
    });
    const screen = renderWithTheme(<UserProfileListScreenAndroid />);
    fireEvent.press(screen.getByTestId('user-profile-list-clear-search'));
    expect(onClearSearchAndFilters).toHaveBeenCalled();
  });

  it('exports component and hook from index', () => {
    expect(UserProfileListScreenIndex.default).toBeDefined();
    expect(UserProfileListScreenIndex.useUserProfileListScreen).toBeDefined();
  });
});
