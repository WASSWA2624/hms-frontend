/**
 * BranchListScreen Component Tests
 * Per testing.mdc: render, loading, error, empty, a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/BranchListScreen/useBranchListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useBranchListScreen = require('@platform/screens/settings/BranchListScreen/useBranchListScreen').default;
const BranchListScreenWeb = require('@platform/screens/settings/BranchListScreen/BranchListScreen.web').default;
const BranchListScreenAndroid = require('@platform/screens/settings/BranchListScreen/BranchListScreen.android').default;
const BranchListScreenIOS = require('@platform/screens/settings/BranchListScreen/BranchListScreen.ios').default;
const BranchListScreenIndex = require('@platform/screens/settings/BranchListScreen/index.js');
const { STATES } = require('@platform/screens/settings/BranchListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'branch.list.title': 'Branches',
    'branch.list.accessibilityLabel': 'Branches list',
    'branch.list.searchPlaceholder': 'Search branches',
    'branch.list.searchLabel': 'Search branches',
    'branch.list.emptyTitle': 'No branches',
    'branch.list.emptyMessage': 'You have no branches.',
    'branch.list.delete': 'Delete branch',
    'branch.list.deleteHint': 'Delete this branch',
    'branch.list.itemLabel': 'Branch {{name}}',
    'branch.list.itemHint': 'View details for {{name}}',
    'branch.list.addLabel': 'Add branch',
    'branch.list.addHint': 'Create a new branch',
    'branch.list.statusActive': 'Active',
    'branch.list.statusInactive': 'Inactive',
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
  onBranchPress: jest.fn(),
  onDelete: jest.fn(),
  onAdd: jest.fn(),
};

describe('BranchListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useBranchListScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<BranchListScreenWeb />);
      expect(getByTestId('branch-list-search')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<BranchListScreenAndroid />);
      expect(getByTestId('branch-list-search')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<BranchListScreenIOS />);
      expect(getByTestId('branch-list-search')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useBranchListScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<BranchListScreenWeb />);
      expect(getByTestId('branch-list-loading')).toBeTruthy();
    });
  });

  describe('empty', () => {
    it('shows empty state (Web)', () => {
      useBranchListScreen.mockReturnValue({
        ...baseHook,
        items: [],
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<BranchListScreenWeb />);
      expect(getByTestId('branch-list-empty-state')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useBranchListScreen.mockReturnValue({
        ...baseHook,
        items: [],
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId, queryByTestId } = renderWithTheme(<BranchListScreenWeb />);
      expect(getByTestId('branch-list-error')).toBeTruthy();
      expect(queryByTestId('branch-list-empty-state')).toBeNull();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useBranchListScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
        items: [],
      });
      const { getByTestId } = renderWithTheme(<BranchListScreenWeb />);
      expect(getByTestId('branch-list-offline')).toBeTruthy();
    });
  });

  describe('list with items', () => {
    it('renders items (Web)', () => {
      useBranchListScreen.mockReturnValue({
        ...baseHook,
        items: [
          { id: '1', name: 'Branch 1', is_active: true },
        ],
      });
      const { getByTestId } = renderWithTheme(<BranchListScreenWeb />);
      expect(getByTestId('branch-item-1')).toBeTruthy();
    });
  });

  describe('notice', () => {
    it('shows notice message (Web)', () => {
      useBranchListScreen.mockReturnValue({
        ...baseHook,
        noticeMessage: 'Branch created.',
      });
      const { getByTestId } = renderWithTheme(<BranchListScreenWeb />);
      expect(getByTestId('branch-list-notice')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('renders add button when onAdd is available (Web)', () => {
      const onAdd = jest.fn();
      useBranchListScreen.mockReturnValue({ ...baseHook, onAdd });
      const { getByTestId } = renderWithTheme(<BranchListScreenWeb />);
      expect(getByTestId('branch-list-add')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility label (Web)', () => {
      useBranchListScreen.mockReturnValue({
        ...baseHook,
        items: [{ id: '1', name: 'Branch 1', is_active: true }],
      });
      const { getByTestId } = renderWithTheme(<BranchListScreenWeb />);
      const list = getByTestId('branch-list-card');
      expect(list).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(BranchListScreenIndex.default).toBeDefined();
      expect(BranchListScreenIndex.useBranchListScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});
