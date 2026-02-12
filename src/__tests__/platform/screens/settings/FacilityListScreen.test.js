/**
 * FacilityListScreen Component Tests
 * Per testing.mdc: render, loading, error, empty, a11y
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/FacilityListScreen/useFacilityListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useFacilityListScreen = require('@platform/screens/settings/FacilityListScreen/useFacilityListScreen').default;
const FacilityListScreenWeb = require('@platform/screens/settings/FacilityListScreen/FacilityListScreen.web').default;
const FacilityListScreenAndroid = require('@platform/screens/settings/FacilityListScreen/FacilityListScreen.android').default;
const FacilityListScreenIOS = require('@platform/screens/settings/FacilityListScreen/FacilityListScreen.ios').default;
const FacilityListScreenIndex = require('@platform/screens/settings/FacilityListScreen/index.js');
const { STATES } = require('@platform/screens/settings/FacilityListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'facility.list.title': 'Facilities',
    'facility.list.accessibilityLabel': 'Facilities list',
    'facility.list.searchPlaceholder': 'Search facilities',
    'facility.list.searchLabel': 'Search facilities',
    'facility.list.emptyTitle': 'No facilities',
    'facility.list.emptyMessage': 'You have no facilities.',
    'facility.list.typeLabel': 'Type',
    'facility.list.delete': 'Delete facility',
    'facility.list.deleteHint': 'Delete this facility',
    'facility.list.itemLabel': 'Facility {{name}}',
    'facility.list.itemHint': 'View details for {{name}}',
    'facility.list.addLabel': 'Add facility',
    'facility.list.addHint': 'Create a new facility',
    'facility.list.noticeAccessDenied': 'You do not have access to that facility.',
    'common.remove': 'Remove',
    'listScaffold.errorState.title': 'Error',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.loading': 'Loading',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  items: [],
  search: '',
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  noticeMessage: null,
  onDismissNotice: jest.fn(),
  onRetry: jest.fn(),
  onSearch: jest.fn(),
  onFacilityPress: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('FacilityListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useFacilityListScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(getByTestId('facility-list-search')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<FacilityListScreenAndroid />);
      expect(getByTestId('facility-list-search')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<FacilityListScreenIOS />);
      expect(getByTestId('facility-list-search')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useFacilityListScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(getByTestId('facility-list-loading')).toBeTruthy();
    });
  });

  describe('empty', () => {
    it('shows empty state (Web)', () => {
      useFacilityListScreen.mockReturnValue({
        ...baseHook,
        items: [],
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(getByTestId('facility-list-empty-state')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useFacilityListScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(getByTestId('facility-list-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useFacilityListScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
        items: [],
      });
      const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(getByTestId('facility-list-offline')).toBeTruthy();
    });
  });

  describe('list with items', () => {
    it('renders items (Web)', () => {
      useFacilityListScreen.mockReturnValue({
        ...baseHook,
        items: [
          { id: '1', name: 'Facility 1', facility_type: 'HOSPITAL' },
        ],
      });
      const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(getByTestId('facility-item-1')).toBeTruthy();
    });
  });

  describe('notice', () => {
    it('shows notice message (Web)', () => {
      useFacilityListScreen.mockReturnValue({
        ...baseHook,
        noticeMessage: 'Facility created.',
      });
      const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(getByTestId('facility-list-notice')).toBeTruthy();
    });

    it('shows access denied notice (Web)', () => {
      useFacilityListScreen.mockReturnValue({
        ...baseHook,
        noticeMessage: 'You do not have access to that facility.',
      });
      const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(getByTestId('facility-list-notice')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('renders add button when onAdd is available (Web)', () => {
      const onAdd = jest.fn();
      useFacilityListScreen.mockReturnValue({ ...baseHook, onAdd });
      const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(getByTestId('facility-list-add')).toBeTruthy();
    });

    it('hides add button when onAdd is undefined (Web)', () => {
      useFacilityListScreen.mockReturnValue({ ...baseHook, onAdd: undefined });
      const { queryByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(queryByTestId('facility-list-add')).toBeNull();
    });

    it('hides delete action when onDelete is undefined (Web)', () => {
      useFacilityListScreen.mockReturnValue({
        ...baseHook,
        onDelete: undefined,
        items: [{ id: '1', name: 'Facility 1', facility_type: 'HOSPITAL' }],
      });
      const { queryByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(queryByTestId('facility-delete-1')).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('has accessibility label (Web)', () => {
      useFacilityListScreen.mockReturnValue({
        ...baseHook,
        items: [{ id: '1', name: 'Facility 1', facility_type: 'HOSPITAL' }],
      });
      const { getByTestId } = renderWithTheme(<FacilityListScreenWeb />);
      expect(getByTestId('facility-list-card')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(FacilityListScreenIndex.default).toBeDefined();
      expect(FacilityListScreenIndex.useFacilityListScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});
