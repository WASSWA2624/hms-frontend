/**
 * AddressDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/AddressDetailScreen/useAddressDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useAddressDetailScreen = require('@platform/screens/settings/AddressDetailScreen/useAddressDetailScreen').default;
const AddressDetailScreenWeb = require('@platform/screens/settings/AddressDetailScreen/AddressDetailScreen.web').default;
const AddressDetailScreenAndroid = require('@platform/screens/settings/AddressDetailScreen/AddressDetailScreen.android').default;
const AddressDetailScreenIOS = require('@platform/screens/settings/AddressDetailScreen/AddressDetailScreen.ios').default;
const AddressDetailScreenIndex = require('@platform/screens/settings/AddressDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/AddressDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'address.detail.title': 'Address Details',
    'address.detail.tenantLabel': 'Tenant',
    'address.detail.facilityLabel': 'Facility',
    'address.detail.branchLabel': 'Branch',
    'address.detail.typeLabel': 'Type',
    'address.detail.line1Label': 'Line 1',
    'address.detail.line2Label': 'Line 2',
    'address.detail.cityLabel': 'City',
    'address.detail.stateLabel': 'State',
    'address.detail.postalCodeLabel': 'Postal code',
    'address.detail.countryLabel': 'Country',
    'address.detail.createdLabel': 'Created',
    'address.detail.updatedLabel': 'Updated',
    'address.detail.errorTitle': 'Failed to load address',
    'address.detail.notFoundTitle': 'Address not found',
    'address.detail.notFoundMessage': 'This address may have been deleted.',
    'address.detail.backHint': 'Return to addresses list',
    'address.detail.delete': 'Delete address',
    'address.detail.deleteHint': 'Delete this address',
    'address.detail.edit': 'Edit address',
    'address.detail.editHint': 'Edit this address',
    'common.loading': 'Loading',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.back': 'Back',
    'common.remove': 'Remove',
    'address.types.HOME': 'Home',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  id: 'b1',
  address: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('AddressDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useAddressDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<AddressDetailScreenWeb />);
      expect(getByTestId('address-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      useAddressDetailScreen.mockReturnValue({ ...baseHook, address: null });
      const { getByTestId } = renderWithTheme(<AddressDetailScreenAndroid />);
      expect(getByTestId('address-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      useAddressDetailScreen.mockReturnValue({ ...baseHook, address: null });
      const { getByTestId } = renderWithTheme(<AddressDetailScreenIOS />);
      expect(getByTestId('address-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useAddressDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<AddressDetailScreenWeb />);
      expect(getByTestId('address-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useAddressDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<AddressDetailScreenWeb />);
      expect(getByTestId('address-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useAddressDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<AddressDetailScreenWeb />);
      expect(getByTestId('address-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      useAddressDetailScreen.mockReturnValue({
        ...baseHook,
        address: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<AddressDetailScreenWeb />);
      expect(getByTestId('address-detail-not-found')).toBeTruthy();
    });
  });

  describe('with address data', () => {
    it('renders address details (Web)', () => {
      useAddressDetailScreen.mockReturnValue({
        ...baseHook,
        address: {
          id: 'address-1',
          tenant_name: 'Acme Tenant',
          facility_name: 'Main Facility',
          branch_name: 'Main Branch',
          address_type: 'HOME',
          line1: '123 Main St',
          line2: 'Apt 4',
          city: 'Kampala',
          state: 'Central',
          postal_code: '256',
          country: 'Uganda',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      });
      const { getByTestId, queryByTestId } = renderWithTheme(<AddressDetailScreenWeb />);
      expect(getByTestId('address-detail-card')).toBeTruthy();
      expect(getByTestId('address-detail-tenant')).toBeTruthy();
      expect(getByTestId('address-detail-facility')).toBeTruthy();
      expect(getByTestId('address-detail-branch')).toBeTruthy();
      expect(getByTestId('address-detail-type')).toBeTruthy();
      expect(getByTestId('address-detail-line1')).toBeTruthy();
      expect(getByTestId('address-detail-line2')).toBeTruthy();
      expect(getByTestId('address-detail-city')).toBeTruthy();
      expect(getByTestId('address-detail-state')).toBeTruthy();
      expect(getByTestId('address-detail-postalCode')).toBeTruthy();
      expect(getByTestId('address-detail-country')).toBeTruthy();
      expect(getByTestId('address-detail-created')).toBeTruthy();
      expect(getByTestId('address-detail-updated')).toBeTruthy();
      expect(queryByTestId('address-detail-id')).toBeNull();
    });
  });

  describe('inline states', () => {
    it('shows inline error banner when address exists (Web)', () => {
      useAddressDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Error',
        address: { id: 'b1', name: 'Address' },
      });
      const { getByTestId } = renderWithTheme(<AddressDetailScreenWeb />);
      expect(getByTestId('address-detail-error-banner')).toBeTruthy();
    });

    it('shows inline offline banner when address exists (Web)', () => {
      useAddressDetailScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        address: { id: 'b1', name: 'Address' },
      });
      const { getByTestId } = renderWithTheme(<AddressDetailScreenWeb />);
      expect(getByTestId('address-detail-offline-banner')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      useAddressDetailScreen.mockReturnValue({
        ...baseHook,
        address: {
          id: 'b1',
          tenant_name: 'Tenant A',
          line1: 'Main Address',
        },
      });
      const { getByTestId } = renderWithTheme(<AddressDetailScreenWeb />);
      expect(getByTestId('address-detail-back')).toBeTruthy();
      expect(getByTestId('address-detail-edit')).toBeTruthy();
      expect(getByTestId('address-detail-delete')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(AddressDetailScreenIndex.default).toBeDefined();
      expect(AddressDetailScreenIndex.useAddressDetailScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});
