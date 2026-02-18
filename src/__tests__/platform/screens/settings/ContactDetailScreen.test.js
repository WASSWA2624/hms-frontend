/**
 * ContactDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/ContactDetailScreen/useContactDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useContactDetailScreen = require('@platform/screens/settings/ContactDetailScreen/useContactDetailScreen').default;
const ContactDetailScreenWeb = require('@platform/screens/settings/ContactDetailScreen/ContactDetailScreen.web').default;
const ContactDetailScreenAndroid = require('@platform/screens/settings/ContactDetailScreen/ContactDetailScreen.android').default;
const ContactDetailScreenIOS = require('@platform/screens/settings/ContactDetailScreen/ContactDetailScreen.ios').default;
const ContactDetailScreenIndex = require('@platform/screens/settings/ContactDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/ContactDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'contact.detail.title': 'Contact Details',
    'contact.detail.idLabel': 'Contact ID',
    'contact.detail.tenantLabel': 'Tenant',
    'contact.detail.facilityLabel': 'Facility',
    'contact.detail.branchLabel': 'Branch',
    'contact.detail.patientLabel': 'Patient',
    'contact.detail.userProfileLabel': 'User profile',
    'contact.detail.staffProfileLabel': 'Staff profile',
    'contact.detail.supplierLabel': 'Supplier',
    'contact.detail.valueLabel': 'Value',
    'contact.detail.typeLabel': 'Type',
    'contact.detail.primaryLabel': 'Primary',
    'contact.detail.createdLabel': 'Created',
    'contact.detail.updatedLabel': 'Updated',
    'contact.detail.errorTitle': 'Failed to load contact',
    'contact.detail.notFoundTitle': 'Contact not found',
    'contact.detail.notFoundMessage': 'This contact may have been deleted.',
    'contact.detail.backHint': 'Return to contacts list',
    'contact.detail.delete': 'Delete contact',
    'contact.detail.deleteHint': 'Delete this contact',
    'contact.detail.edit': 'Edit contact',
    'contact.detail.editHint': 'Edit this contact',
    'common.loading': 'Loading',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.back': 'Back',
    'common.remove': 'Remove',
    'common.on': 'On',
    'common.off': 'Off',
    'contact.types.EMAIL': 'Email',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  id: 'c1',
  contact: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('ContactDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT, locale: 'en-US' });
    useContactDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<ContactDetailScreenWeb />);
      expect(getByTestId('contact-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<ContactDetailScreenAndroid />);
      expect(getByTestId('contact-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<ContactDetailScreenIOS />);
      expect(getByTestId('contact-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useContactDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<ContactDetailScreenWeb />);
      expect(getByTestId('contact-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useContactDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<ContactDetailScreenWeb />);
      expect(getByTestId('contact-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useContactDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<ContactDetailScreenWeb />);
      expect(getByTestId('contact-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      useContactDetailScreen.mockReturnValue({
        ...baseHook,
        contact: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<ContactDetailScreenWeb />);
      expect(getByTestId('contact-detail-not-found')).toBeTruthy();
    });
  });

  describe('with contact data', () => {
    it('renders contact details (Web)', () => {
      useContactDetailScreen.mockReturnValue({
        ...baseHook,
        contact: {
          id: 'contact-1',
          tenant_name: 'Acme Tenant',
          facility_name: 'Main Facility',
          branch_name: 'Main Branch',
          value: 'contact@acme.org',
          contact_type: 'EMAIL',
          is_primary: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      });
      const { getByTestId, queryByTestId } = renderWithTheme(<ContactDetailScreenWeb />);
      expect(getByTestId('contact-detail-card')).toBeTruthy();
      expect(getByTestId('contact-detail-tenant')).toBeTruthy();
      expect(getByTestId('contact-detail-facility')).toBeTruthy();
      expect(getByTestId('contact-detail-branch')).toBeTruthy();
      expect(getByTestId('contact-detail-type')).toBeTruthy();
      expect(getByTestId('contact-detail-value')).toBeTruthy();
      expect(getByTestId('contact-detail-primary')).toBeTruthy();
      expect(getByTestId('contact-detail-created')).toBeTruthy();
      expect(getByTestId('contact-detail-updated')).toBeTruthy();
      expect(queryByTestId('contact-detail-id')).toBeNull();
    });

    it('shows id when user can view technical ids', () => {
      useContactDetailScreen.mockReturnValue({
        ...baseHook,
        canViewTechnicalIds: true,
        contact: {
          id: 'contact-1',
          tenant_id: 'tenant-1',
          value: 'contact@acme.org',
          contact_type: 'EMAIL',
          is_primary: false,
        },
      });

      const { getByTestId } = renderWithTheme(<ContactDetailScreenWeb />);
      expect(getByTestId('contact-detail-id')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows inline error banner when contact exists (Web)', () => {
      useContactDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Error',
        contact: { id: 'c1', value: 'contact@acme.org' },
      });
      const { getByTestId } = renderWithTheme(<ContactDetailScreenWeb />);
      expect(getByTestId('contact-detail-error-banner')).toBeTruthy();
    });

    it('shows inline offline banner when contact exists (Web)', () => {
      useContactDetailScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        contact: { id: 'c1', value: 'contact@acme.org' },
      });
      const { getByTestId } = renderWithTheme(<ContactDetailScreenWeb />);
      expect(getByTestId('contact-detail-offline-banner')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      useContactDetailScreen.mockReturnValue({
        ...baseHook,
        contact: {
          id: 'c1',
          tenant_name: 'Tenant A',
          value: 'contact@acme.org',
        },
      });
      const { getByTestId } = renderWithTheme(<ContactDetailScreenWeb />);
      expect(getByTestId('contact-detail-back')).toBeTruthy();
      expect(getByTestId('contact-detail-edit')).toBeTruthy();
      expect(getByTestId('contact-detail-delete')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(ContactDetailScreenIndex.default).toBeDefined();
      expect(ContactDetailScreenIndex.useContactDetailScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});