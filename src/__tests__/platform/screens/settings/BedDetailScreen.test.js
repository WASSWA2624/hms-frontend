/**
 * BedDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/BedDetailScreen/useBedDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useBedDetailScreen = require('@platform/screens/settings/BedDetailScreen/useBedDetailScreen').default;
const BedDetailScreenWeb = require('@platform/screens/settings/BedDetailScreen/BedDetailScreen.web').default;
const BedDetailScreenAndroid = require('@platform/screens/settings/BedDetailScreen/BedDetailScreen.android').default;
const BedDetailScreenIOS = require('@platform/screens/settings/BedDetailScreen/BedDetailScreen.ios').default;
const BedDetailScreenIndex = require('@platform/screens/settings/BedDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/BedDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'bed.detail.title': 'Bed Details',
    'bed.detail.tenantLabel': 'Tenant',
    'bed.detail.facilityLabel': 'Facility',
    'bed.detail.wardLabel': 'Ward',
    'bed.detail.roomLabel': 'Room',
    'bed.detail.labelLabel': 'Label',
    'bed.detail.labelFallback': 'Unnamed bed',
    'bed.detail.statusLabel': 'Status',
    'bed.detail.createdLabel': 'Created',
    'bed.detail.updatedLabel': 'Updated',
    'bed.detail.errorTitle': 'Failed to load bed',
    'bed.detail.notFoundTitle': 'Bed not found',
    'bed.detail.notFoundMessage': 'This bed may have been deleted.',
    'bed.detail.backHint': 'Return to beds list',
    'bed.detail.delete': 'Delete bed',
    'bed.detail.deleteHint': 'Delete this bed',
    'bed.detail.edit': 'Edit bed',
    'bed.detail.editHint': 'Edit this bed',
    'bed.form.statusOptions.AVAILABLE': 'Available',
    'bed.form.statusOptions.OCCUPIED': 'Occupied',
    'bed.form.statusOptions.RESERVED': 'Reserved',
    'bed.form.statusOptions.OUT_OF_SERVICE': 'Out of service',
    'common.loading': 'Loading',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.back': 'Back',
    'common.remove': 'Remove',
    'common.notAvailable': 'N/A',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  id: 'b1',
  bed: null,
  bedLabel: '',
  tenantLabel: '',
  facilityLabel: '',
  wardLabel: '',
  roomLabel: '',
  statusValue: '',
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('BedDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useBedDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<BedDetailScreenWeb />);
      expect(getByTestId('bed-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      useBedDetailScreen.mockReturnValue({ ...baseHook, bed: null });
      const { getByTestId } = renderWithTheme(<BedDetailScreenAndroid />);
      expect(getByTestId('bed-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      useBedDetailScreen.mockReturnValue({ ...baseHook, bed: null });
      const { getByTestId } = renderWithTheme(<BedDetailScreenIOS />);
      expect(getByTestId('bed-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useBedDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<BedDetailScreenWeb />);
      expect(getByTestId('bed-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useBedDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<BedDetailScreenWeb />);
      expect(getByTestId('bed-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useBedDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<BedDetailScreenWeb />);
      expect(getByTestId('bed-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      useBedDetailScreen.mockReturnValue({
        ...baseHook,
        bed: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<BedDetailScreenWeb />);
      expect(getByTestId('bed-detail-not-found')).toBeTruthy();
    });
  });

  describe('with bed data', () => {
    it('renders bed details (Web)', () => {
      useBedDetailScreen.mockReturnValue({
        ...baseHook,
        bed: {
          id: 'bed-1',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
        bedLabel: 'A-01',
        tenantLabel: 'Acme Tenant',
        facilityLabel: 'Main Facility',
        wardLabel: 'Adult Ward',
        roomLabel: 'Room 9',
        statusValue: 'AVAILABLE',
      });
      const { getByTestId } = renderWithTheme(<BedDetailScreenWeb />);
      expect(getByTestId('bed-detail-card')).toBeTruthy();
      expect(getByTestId('bed-detail-label')).toBeTruthy();
      expect(getByTestId('bed-detail-tenant')).toBeTruthy();
      expect(getByTestId('bed-detail-facility')).toBeTruthy();
      expect(getByTestId('bed-detail-ward')).toBeTruthy();
      expect(getByTestId('bed-detail-room')).toBeTruthy();
      expect(getByTestId('bed-detail-status')).toBeTruthy();
      expect(getByTestId('bed-detail-created')).toBeTruthy();
      expect(getByTestId('bed-detail-updated')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows inline error banner when bed exists (Web)', () => {
      useBedDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Error',
        bed: { id: 'b1' },
      });
      const { getByTestId } = renderWithTheme(<BedDetailScreenWeb />);
      expect(getByTestId('bed-detail-error-banner')).toBeTruthy();
    });

    it('shows inline offline banner when bed exists (Web)', () => {
      useBedDetailScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        bed: { id: 'b1' },
      });
      const { getByTestId } = renderWithTheme(<BedDetailScreenWeb />);
      expect(getByTestId('bed-detail-offline-banner')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      useBedDetailScreen.mockReturnValue({
        ...baseHook,
        bed: {
          id: 'b1',
        },
        bedLabel: 'A-01',
        statusValue: 'AVAILABLE',
      });
      const { getByTestId } = renderWithTheme(<BedDetailScreenWeb />);
      expect(getByTestId('bed-detail-back')).toBeTruthy();
      expect(getByTestId('bed-detail-edit')).toBeTruthy();
      expect(getByTestId('bed-detail-delete')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(BedDetailScreenIndex.default).toBeDefined();
      expect(BedDetailScreenIndex.useBedDetailScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});

