/**
 * BranchDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/BranchDetailScreen/useBranchDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useBranchDetailScreen = require('@platform/screens/settings/BranchDetailScreen/useBranchDetailScreen').default;
const BranchDetailScreenWeb = require('@platform/screens/settings/BranchDetailScreen/BranchDetailScreen.web').default;
const BranchDetailScreenAndroid = require('@platform/screens/settings/BranchDetailScreen/BranchDetailScreen.android').default;
const BranchDetailScreenIOS = require('@platform/screens/settings/BranchDetailScreen/BranchDetailScreen.ios').default;
const BranchDetailScreenIndex = require('@platform/screens/settings/BranchDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/BranchDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'branch.detail.title': 'Branch Details',
    'branch.detail.tenantLabel': 'Tenant',
    'branch.detail.facilityLabel': 'Facility',
    'branch.detail.nameLabel': 'Name',
    'branch.detail.nameFallback': 'Unnamed branch',
    'branch.detail.activeLabel': 'Active',
    'branch.detail.createdLabel': 'Created',
    'branch.detail.updatedLabel': 'Updated',
    'branch.detail.errorTitle': 'Failed to load branch',
    'branch.detail.notFoundTitle': 'Branch not found',
    'branch.detail.notFoundMessage': 'This branch may have been deleted.',
    'branch.detail.backHint': 'Return to branches list',
    'branch.detail.delete': 'Delete branch',
    'branch.detail.deleteHint': 'Delete this branch',
    'branch.detail.edit': 'Edit branch',
    'branch.detail.editHint': 'Edit this branch',
    'common.loading': 'Loading',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.back': 'Back',
    'common.remove': 'Remove',
    'common.on': 'On',
    'common.off': 'Off',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  id: 'b1',
  branch: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('BranchDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useBranchDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<BranchDetailScreenWeb />);
      expect(getByTestId('branch-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      useBranchDetailScreen.mockReturnValue({ ...baseHook, branch: null });
      const { getByTestId } = renderWithTheme(<BranchDetailScreenAndroid />);
      expect(getByTestId('branch-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      useBranchDetailScreen.mockReturnValue({ ...baseHook, branch: null });
      const { getByTestId } = renderWithTheme(<BranchDetailScreenIOS />);
      expect(getByTestId('branch-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useBranchDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<BranchDetailScreenWeb />);
      expect(getByTestId('branch-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useBranchDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<BranchDetailScreenWeb />);
      expect(getByTestId('branch-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useBranchDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<BranchDetailScreenWeb />);
      expect(getByTestId('branch-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      useBranchDetailScreen.mockReturnValue({
        ...baseHook,
        branch: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<BranchDetailScreenWeb />);
      expect(getByTestId('branch-detail-not-found')).toBeTruthy();
    });
  });

  describe('with branch data', () => {
    it('renders branch details (Web)', () => {
      useBranchDetailScreen.mockReturnValue({
        ...baseHook,
        branch: {
          id: 'branch-1',
          tenant_name: 'Acme Tenant',
          facility_name: 'Main Facility',
          name: 'Main Branch',
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      });
      const { getByTestId } = renderWithTheme(<BranchDetailScreenWeb />);
      expect(getByTestId('branch-detail-card')).toBeTruthy();
      expect(getByTestId('branch-detail-tenant')).toBeTruthy();
      expect(getByTestId('branch-detail-facility')).toBeTruthy();
      expect(getByTestId('branch-detail-name')).toBeTruthy();
      expect(getByTestId('branch-detail-active')).toBeTruthy();
      expect(getByTestId('branch-detail-created')).toBeTruthy();
      expect(getByTestId('branch-detail-updated')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows inline error banner when branch exists (Web)', () => {
      useBranchDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Error',
        branch: { id: 'b1', name: 'Branch' },
      });
      const { getByTestId } = renderWithTheme(<BranchDetailScreenWeb />);
      expect(getByTestId('branch-detail-error-banner')).toBeTruthy();
    });

    it('shows inline offline banner when branch exists (Web)', () => {
      useBranchDetailScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        branch: { id: 'b1', name: 'Branch' },
      });
      const { getByTestId } = renderWithTheme(<BranchDetailScreenWeb />);
      expect(getByTestId('branch-detail-offline-banner')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      useBranchDetailScreen.mockReturnValue({
        ...baseHook,
        branch: {
          id: 'b1',
          tenant_id: 't1',
          name: 'Main Branch',
          is_active: true,
        },
      });
      const { getByTestId } = renderWithTheme(<BranchDetailScreenWeb />);
      expect(getByTestId('branch-detail-back')).toBeTruthy();
      expect(getByTestId('branch-detail-edit')).toBeTruthy();
      expect(getByTestId('branch-detail-delete')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(BranchDetailScreenIndex.default).toBeDefined();
      expect(BranchDetailScreenIndex.useBranchDetailScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});
