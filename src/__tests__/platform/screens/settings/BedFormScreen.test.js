/**
 * BedFormScreen Component Tests
 * Per testing.mdc: render, loading, error, offline, a11y, interactions
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/BedFormScreen/useBedFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useBedFormScreen = require('@platform/screens/settings/BedFormScreen/useBedFormScreen').default;
const BedFormScreenWeb = require('@platform/screens/settings/BedFormScreen/BedFormScreen.web').default;
const BedFormScreenAndroid = require('@platform/screens/settings/BedFormScreen/BedFormScreen.android').default;
const BedFormScreenIOS = require('@platform/screens/settings/BedFormScreen/BedFormScreen.ios').default;
const BedFormScreenIndex = require('@platform/screens/settings/BedFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'bed.form.createTitle': 'Add Bed',
    'bed.form.editTitle': 'Edit Bed',
    'bed.form.loadError': 'Failed to load bed for editing',
    'bed.form.labelLabel': 'Label',
    'bed.form.labelPlaceholder': 'Enter bed label',
    'bed.form.labelHint': 'Bed label (e.g. A1, B2)',
    'bed.form.statusLabel': 'Status',
    'bed.form.statusPlaceholder': 'Select status',
    'bed.form.statusHint': 'Bed status',
    'bed.form.tenantLabel': 'Tenant',
    'bed.form.tenantPlaceholder': 'Select tenant',
    'bed.form.tenantHint': 'Tenant that owns this bed',
    'bed.form.tenantLockedHint': 'Tenant is set when the bed is created.',
    'bed.form.tenantScopedHint': 'Your tenant scope is applied automatically.',
    'bed.form.noTenantsMessage': 'There are no tenants.',
    'bed.form.createTenantFirst': 'Create a tenant first to add a bed.',
    'bed.form.goToTenants': 'Go to Tenants',
    'bed.form.goToTenantsHint': 'Open tenants list to create a tenant',
    'bed.form.facilityLabel': 'Facility',
    'bed.form.facilityPlaceholder': 'Select facility',
    'bed.form.facilityHint': 'Facility for this bed',
    'bed.form.facilityLockedHint': 'Facility is set when the bed is created.',
    'bed.form.noFacilitiesMessage': 'There are no facilities for this tenant.',
    'bed.form.createFacilityRequired': 'Create a facility to continue.',
    'bed.form.goToFacilities': 'Go to Facilities',
    'bed.form.goToFacilitiesHint': 'Open facilities list to create a facility',
    'bed.form.wardLabel': 'Ward',
    'bed.form.wardPlaceholder': 'Select ward',
    'bed.form.wardHint': 'Ward for this bed',
    'bed.form.wardLockedHint': 'Ward is set when the bed is created.',
    'bed.form.noWardsMessage': 'There are no wards for this facility.',
    'bed.form.createWardRequired': 'Create a ward to continue.',
    'bed.form.goToWards': 'Go to Wards',
    'bed.form.goToWardsHint': 'Open wards list to create a ward',
    'bed.form.roomLabel': 'Room',
    'bed.form.roomPlaceholder': 'Select room',
    'bed.form.roomHint': 'Room for this bed (optional)',
    'bed.form.roomNone': 'No room',
    'bed.form.noRoomsMessage': 'There are no rooms for this ward.',
    'bed.form.createRoomOptional': 'Create a room if you want to assign this bed now.',
    'bed.form.goToRooms': 'Go to Rooms',
    'bed.form.goToRoomsHint': 'Open rooms list to create a room',
    'bed.form.selectTenantFirst': 'Select a tenant to see facilities.',
    'bed.form.selectFacilityFirst': 'Select a facility to see wards.',
    'bed.form.selectWardFirst': 'Select a ward to see rooms.',
    'bed.form.submitCreate': 'Create Bed',
    'bed.form.submitEdit': 'Save Changes',
    'bed.form.submitErrorTitle': 'Unable to save bed',
    'bed.form.tenantLoadErrorTitle': 'Unable to load tenants',
    'bed.form.facilityLoadErrorTitle': 'Unable to load facilities',
    'bed.form.wardLoadErrorTitle': 'Unable to load wards',
    'bed.form.roomLoadErrorTitle': 'Unable to load rooms',
    'bed.form.cancel': 'Cancel',
    'bed.form.cancelHint': 'Return without saving',
    'common.loading': 'Loading',
    'common.back': 'Back',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'shell.banners.offline.title': 'You are offline',
    'shell.banners.offline.message': 'Some features may be unavailable.',
  };
  return m[key] || key;
};

const baseHook = {
  isEdit: false,
  label: '',
  setLabel: jest.fn(),
  status: '',
  setStatus: jest.fn(),
  statusOptions: [{ value: 'AVAILABLE', label: 'Available' }],
  tenantId: '',
  setTenantId: jest.fn(),
  facilityId: '',
  setFacilityId: jest.fn(),
  wardId: '',
  setWardId: jest.fn(),
  roomId: '',
  setRoomId: jest.fn(),
  tenantOptions: [],
  tenantListLoading: false,
  tenantListError: false,
  tenantErrorMessage: null,
  facilityOptions: [],
  facilityListLoading: false,
  facilityListError: false,
  facilityErrorMessage: null,
  wardOptions: [],
  wardListLoading: false,
  wardListError: false,
  wardErrorMessage: null,
  roomOptions: [],
  roomListLoading: false,
  roomListError: false,
  roomErrorMessage: null,
  hasTenants: false,
  hasFacilities: false,
  hasWards: false,
  hasRooms: false,
  isCreateBlocked: false,
  isFacilityBlocked: false,
  isWardBlocked: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  bed: null,
  labelError: null,
  statusError: null,
  tenantError: null,
  facilityError: null,
  wardError: null,
  isTenantLocked: false,
  lockedTenantDisplay: '',
  tenantDisplayLabel: '',
  facilityDisplayLabel: '',
  wardDisplayLabel: '',
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToTenants: jest.fn(),
  onGoToFacilities: jest.fn(),
  onGoToWards: jest.fn(),
  onGoToRooms: jest.fn(),
  onRetryTenants: jest.fn(),
  onRetryFacilities: jest.fn(),
  onRetryWards: jest.fn(),
  onRetryRooms: jest.fn(),
  isSubmitDisabled: false,
};

describe('BedFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useBedFormScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<BedFormScreenWeb />);
      expect(getByTestId('bed-form-card')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<BedFormScreenAndroid />);
      expect(getByTestId('bed-form-card')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<BedFormScreenIOS />);
      expect(getByTestId('bed-form-card')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useBedFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        isLoading: true,
        bed: null,
      });
      const { getByTestId } = renderWithTheme(<BedFormScreenWeb />);
      expect(getByTestId('bed-form-loading')).toBeTruthy();
    });
  });

  describe('load error', () => {
    it('shows load error state (Web)', () => {
      useBedFormScreen.mockReturnValue({
        ...baseHook,
        isEdit: true,
        hasError: true,
        bed: null,
      });
      const { getByTestId } = renderWithTheme(<BedFormScreenWeb />);
      expect(getByTestId('bed-form-load-error')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows offline state (Web)', () => {
      useBedFormScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<BedFormScreenWeb />);
      expect(getByTestId('bed-form-offline')).toBeTruthy();
    });

    it('shows submit error state (Web)', () => {
      useBedFormScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Submit failed',
      });
      const { getByTestId } = renderWithTheme(<BedFormScreenWeb />);
      expect(getByTestId('bed-form-submit-error')).toBeTruthy();
    });
  });

  describe('selector states', () => {
    it('shows tenant load error (Web)', () => {
      useBedFormScreen.mockReturnValue({
        ...baseHook,
        tenantListError: true,
        tenantErrorMessage: 'Unable to load tenants',
      });
      const { getByTestId } = renderWithTheme(<BedFormScreenWeb />);
      expect(getByTestId('bed-form-tenant-error')).toBeTruthy();
    });

    it('shows facility load error (Web)', () => {
      useBedFormScreen.mockReturnValue({
        ...baseHook,
        facilityListError: true,
        facilityErrorMessage: 'Unable to load facilities',
      });
      const { getByTestId } = renderWithTheme(<BedFormScreenWeb />);
      expect(getByTestId('bed-form-facility-error')).toBeTruthy();
    });

    it('shows ward load error (Web)', () => {
      useBedFormScreen.mockReturnValue({
        ...baseHook,
        wardListError: true,
        wardErrorMessage: 'Unable to load wards',
      });
      const { getByTestId } = renderWithTheme(<BedFormScreenWeb />);
      expect(getByTestId('bed-form-ward-error')).toBeTruthy();
    });

    it('shows room load error (Web)', () => {
      useBedFormScreen.mockReturnValue({
        ...baseHook,
        roomListError: true,
        roomErrorMessage: 'Unable to load rooms',
      });
      const { getByTestId } = renderWithTheme(<BedFormScreenWeb />);
      expect(getByTestId('bed-form-room-error')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('calls submit and cancel handlers (Web)', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      useBedFormScreen.mockReturnValue({
        ...baseHook,
        onSubmit,
        onCancel,
      });
      const { getByTestId } = renderWithTheme(<BedFormScreenWeb />);
      fireEvent.press(getByTestId('bed-form-submit'));
      fireEvent.press(getByTestId('bed-form-cancel'));
      expect(onSubmit).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(BedFormScreenIndex.default).toBeDefined();
      expect(BedFormScreenIndex.useBedFormScreen).toBeDefined();
    });
  });
});

