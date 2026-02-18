/**
 * UnitDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UnitDetailScreen/useUnitDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUnitDetailScreen = require('@platform/screens/settings/UnitDetailScreen/useUnitDetailScreen').default;
const UnitDetailScreenWeb = require('@platform/screens/settings/UnitDetailScreen/UnitDetailScreen.web').default;
const UnitDetailScreenAndroid = require('@platform/screens/settings/UnitDetailScreen/UnitDetailScreen.android').default;
const UnitDetailScreenIOS = require('@platform/screens/settings/UnitDetailScreen/UnitDetailScreen.ios').default;
const UnitDetailScreenIndex = require('@platform/screens/settings/UnitDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/UnitDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'unit.detail.title': 'Unit Details',
    'unit.detail.tenantLabel': 'Tenant',
    'unit.detail.facilityLabel': 'Facility',
    'unit.detail.departmentLabel': 'Department',
    'unit.detail.nameLabel': 'Name',
    'unit.detail.nameFallback': 'Unnamed unit',
    'unit.detail.activeLabel': 'Active',
    'unit.detail.createdLabel': 'Created',
    'unit.detail.updatedLabel': 'Updated',
    'unit.detail.errorTitle': 'Failed to load unit',
    'unit.detail.notFoundTitle': 'Unit not found',
    'unit.detail.notFoundMessage': 'This unit may have been deleted.',
    'unit.detail.backHint': 'Return to units list',
    'unit.detail.delete': 'Delete unit',
    'unit.detail.deleteHint': 'Delete this unit',
    'unit.detail.edit': 'Edit unit',
    'unit.detail.editHint': 'Edit this unit',
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
  unit: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('UnitDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useUnitDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<UnitDetailScreenWeb />);
      expect(getByTestId('unit-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      useUnitDetailScreen.mockReturnValue({ ...baseHook, unit: null });
      const { getByTestId } = renderWithTheme(<UnitDetailScreenAndroid />);
      expect(getByTestId('unit-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      useUnitDetailScreen.mockReturnValue({ ...baseHook, unit: null });
      const { getByTestId } = renderWithTheme(<UnitDetailScreenIOS />);
      expect(getByTestId('unit-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useUnitDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<UnitDetailScreenWeb />);
      expect(getByTestId('unit-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useUnitDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<UnitDetailScreenWeb />);
      expect(getByTestId('unit-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useUnitDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<UnitDetailScreenWeb />);
      expect(getByTestId('unit-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      useUnitDetailScreen.mockReturnValue({
        ...baseHook,
        unit: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<UnitDetailScreenWeb />);
      expect(getByTestId('unit-detail-not-found')).toBeTruthy();
    });
  });

  describe('with unit data', () => {
    it('renders unit details (Web)', () => {
      useUnitDetailScreen.mockReturnValue({
        ...baseHook,
        unit: {
          id: 'unit-1',
          tenant_name: 'Acme Tenant',
          facility_name: 'Main Facility',
          department_name: 'Surgery',
          name: 'Main Unit',
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      });
      const { getByTestId } = renderWithTheme(<UnitDetailScreenWeb />);
      expect(getByTestId('unit-detail-card')).toBeTruthy();
      expect(getByTestId('unit-detail-tenant')).toBeTruthy();
      expect(getByTestId('unit-detail-facility')).toBeTruthy();
      expect(getByTestId('unit-detail-department')).toBeTruthy();
      expect(getByTestId('unit-detail-name')).toBeTruthy();
      expect(getByTestId('unit-detail-active')).toBeTruthy();
      expect(getByTestId('unit-detail-created')).toBeTruthy();
      expect(getByTestId('unit-detail-updated')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows inline error banner when unit exists (Web)', () => {
      useUnitDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Error',
        unit: { id: 'b1', name: 'Unit' },
      });
      const { getByTestId } = renderWithTheme(<UnitDetailScreenWeb />);
      expect(getByTestId('unit-detail-error-banner')).toBeTruthy();
    });

    it('shows inline offline banner when unit exists (Web)', () => {
      useUnitDetailScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        unit: { id: 'b1', name: 'Unit' },
      });
      const { getByTestId } = renderWithTheme(<UnitDetailScreenWeb />);
      expect(getByTestId('unit-detail-offline-banner')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      useUnitDetailScreen.mockReturnValue({
        ...baseHook,
        unit: {
          id: 'b1',
          tenant_id: 't1',
          name: 'Main Unit',
          is_active: true,
        },
      });
      const { getByTestId } = renderWithTheme(<UnitDetailScreenWeb />);
      expect(getByTestId('unit-detail-back')).toBeTruthy();
      expect(getByTestId('unit-detail-edit')).toBeTruthy();
      expect(getByTestId('unit-detail-delete')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(UnitDetailScreenIndex.default).toBeDefined();
      expect(UnitDetailScreenIndex.useUnitDetailScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});
