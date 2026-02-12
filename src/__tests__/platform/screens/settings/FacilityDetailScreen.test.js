/**
 * FacilityDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/FacilityDetailScreen/useFacilityDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useFacilityDetailScreen = require('@platform/screens/settings/FacilityDetailScreen/useFacilityDetailScreen').default;
const FacilityDetailScreenWeb = require('@platform/screens/settings/FacilityDetailScreen/FacilityDetailScreen.web').default;
const FacilityDetailScreenAndroid = require('@platform/screens/settings/FacilityDetailScreen/FacilityDetailScreen.android').default;
const FacilityDetailScreenIOS = require('@platform/screens/settings/FacilityDetailScreen/FacilityDetailScreen.ios').default;
const FacilityDetailScreenIndex = require('@platform/screens/settings/FacilityDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/FacilityDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'facility.detail.title': 'Facility Details',
    'facility.detail.idLabel': 'Facility ID',
    'facility.detail.tenantLabel': 'Tenant',
    'facility.detail.nameLabel': 'Name',
    'facility.detail.typeLabel': 'Type',
    'facility.detail.activeLabel': 'Active',
    'facility.detail.createdLabel': 'Created',
    'facility.detail.updatedLabel': 'Updated',
    'facility.detail.errorTitle': 'Failed to load facility',
    'facility.detail.notFoundTitle': 'Facility not found',
    'facility.detail.notFoundMessage': 'This facility may have been deleted.',
    'facility.detail.backHint': 'Return to facilities list',
    'facility.detail.delete': 'Delete facility',
    'facility.detail.deleteHint': 'Delete this facility',
    'facility.detail.edit': 'Edit facility',
    'facility.detail.editHint': 'Edit this facility',
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
  id: 'f1',
  facility: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('FacilityDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useFacilityDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenWeb />);
      expect(getByTestId('facility-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      useFacilityDetailScreen.mockReturnValue({ ...baseHook, facility: null });
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenAndroid />);
      expect(getByTestId('facility-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      useFacilityDetailScreen.mockReturnValue({ ...baseHook, facility: null });
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenIOS />);
      expect(getByTestId('facility-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useFacilityDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenWeb />);
      expect(getByTestId('facility-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useFacilityDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenWeb />);
      expect(getByTestId('facility-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useFacilityDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenWeb />);
      expect(getByTestId('facility-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      useFacilityDetailScreen.mockReturnValue({
        ...baseHook,
        facility: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenWeb />);
      expect(getByTestId('facility-detail-not-found')).toBeTruthy();
    });
  });

  describe('with facility data', () => {
    it('renders facility details (Web)', () => {
      useFacilityDetailScreen.mockReturnValue({
        ...baseHook,
        facility: {
          id: 'f1',
          tenant_id: 't1',
          name: 'Test Facility',
          facility_type: 'HOSPITAL',
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      });
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenWeb />);
      expect(getByTestId('facility-detail-card')).toBeTruthy();
      expect(getByTestId('facility-detail-id')).toBeTruthy();
      expect(getByTestId('facility-detail-tenant')).toBeTruthy();
      expect(getByTestId('facility-detail-name')).toBeTruthy();
      expect(getByTestId('facility-detail-type')).toBeTruthy();
      expect(getByTestId('facility-detail-active')).toBeTruthy();
      expect(getByTestId('facility-detail-created')).toBeTruthy();
      expect(getByTestId('facility-detail-updated')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows inline error banner when facility exists (Web)', () => {
      useFacilityDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Error',
        facility: { id: 'f1', name: 'Facility' },
      });
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenWeb />);
      expect(getByTestId('facility-detail-error-banner')).toBeTruthy();
    });

    it('shows inline offline banner when facility exists (Web)', () => {
      useFacilityDetailScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        facility: { id: 'f1', name: 'Facility' },
      });
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenWeb />);
      expect(getByTestId('facility-detail-offline-banner')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      useFacilityDetailScreen.mockReturnValue({
        ...baseHook,
        facility: {
          id: 'f1',
          tenant_id: 't1',
          name: 'Test Facility',
          facility_type: 'HOSPITAL',
          is_active: true,
        },
      });
      const { getByTestId } = renderWithTheme(<FacilityDetailScreenWeb />);
      expect(getByTestId('facility-detail-back')).toBeTruthy();
      expect(getByTestId('facility-detail-edit')).toBeTruthy();
      expect(getByTestId('facility-detail-delete')).toBeTruthy();
    });

    it('hides edit/delete actions when handlers are unavailable (Web)', () => {
      useFacilityDetailScreen.mockReturnValue({
        ...baseHook,
        onEdit: undefined,
        onDelete: undefined,
        facility: {
          id: 'f1',
          tenant_id: 't1',
          name: 'Test Facility',
          facility_type: 'HOSPITAL',
          is_active: true,
        },
      });
      const { queryByTestId: queryById, getByTestId } = renderWithTheme(<FacilityDetailScreenWeb />);
      expect(getByTestId('facility-detail-back')).toBeTruthy();
      expect(queryById('facility-detail-edit')).toBeNull();
      expect(queryById('facility-detail-delete')).toBeNull();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(FacilityDetailScreenIndex.default).toBeDefined();
      expect(FacilityDetailScreenIndex.useFacilityDetailScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});
