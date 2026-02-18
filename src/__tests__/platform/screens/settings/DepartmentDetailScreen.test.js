/**
 * DepartmentDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/DepartmentDetailScreen/useDepartmentDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useDepartmentDetailScreen = require('@platform/screens/settings/DepartmentDetailScreen/useDepartmentDetailScreen').default;
const DepartmentDetailScreenWeb = require('@platform/screens/settings/DepartmentDetailScreen/DepartmentDetailScreen.web').default;
const DepartmentDetailScreenAndroid = require('@platform/screens/settings/DepartmentDetailScreen/DepartmentDetailScreen.android').default;
const DepartmentDetailScreenIOS = require('@platform/screens/settings/DepartmentDetailScreen/DepartmentDetailScreen.ios').default;
const DepartmentDetailScreenIndex = require('@platform/screens/settings/DepartmentDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/DepartmentDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'department.detail.title': 'Department Details',
    'department.detail.idLabel': 'Department ID',
    'department.detail.tenantLabel': 'Tenant',
    'department.detail.nameLabel': 'Name',
    'department.detail.typeLabel': 'Type',
    'department.detail.activeLabel': 'Active',
    'department.detail.createdLabel': 'Created',
    'department.detail.updatedLabel': 'Updated',
    'department.detail.errorTitle': 'Failed to load department',
    'department.detail.notFoundTitle': 'Department not found',
    'department.detail.notFoundMessage': 'This department may have been deleted.',
    'department.detail.backHint': 'Return to departments list',
    'department.detail.delete': 'Delete department',
    'department.detail.deleteHint': 'Delete this department',
    'department.detail.edit': 'Edit department',
    'department.detail.editHint': 'Edit this department',
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
  department: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('DepartmentDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useDepartmentDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenWeb />);
      expect(getByTestId('department-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      useDepartmentDetailScreen.mockReturnValue({ ...baseHook, department: null });
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenAndroid />);
      expect(getByTestId('department-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      useDepartmentDetailScreen.mockReturnValue({ ...baseHook, department: null });
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenIOS />);
      expect(getByTestId('department-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useDepartmentDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenWeb />);
      expect(getByTestId('department-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useDepartmentDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenWeb />);
      expect(getByTestId('department-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useDepartmentDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenWeb />);
      expect(getByTestId('department-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      useDepartmentDetailScreen.mockReturnValue({
        ...baseHook,
        department: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenWeb />);
      expect(getByTestId('department-detail-not-found')).toBeTruthy();
    });
  });

  describe('with department data', () => {
    it('renders department details (Web)', () => {
      useDepartmentDetailScreen.mockReturnValue({
        ...baseHook,
        department: {
          id: 'f1',
          tenant_id: 't1',
          tenant_name: 'Tenant One',
          name: 'Test Department',
          department_type: 'CLINICAL',
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      });
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenWeb />);
      expect(getByTestId('department-detail-card')).toBeTruthy();
      expect(getByTestId('department-detail-tenant')).toBeTruthy();
      expect(getByTestId('department-detail-name')).toBeTruthy();
      expect(getByTestId('department-detail-type')).toBeTruthy();
      expect(getByTestId('department-detail-active')).toBeTruthy();
      expect(getByTestId('department-detail-created')).toBeTruthy();
      expect(getByTestId('department-detail-updated')).toBeTruthy();
    });
  });

  describe('inline states', () => {
    it('shows inline error banner when department exists (Web)', () => {
      useDepartmentDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Error',
        department: { id: 'f1', name: 'Department' },
      });
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenWeb />);
      expect(getByTestId('department-detail-error-banner')).toBeTruthy();
    });

    it('shows inline offline banner when department exists (Web)', () => {
      useDepartmentDetailScreen.mockReturnValue({
        ...baseHook,
        isOffline: true,
        department: { id: 'f1', name: 'Department' },
      });
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenWeb />);
      expect(getByTestId('department-detail-offline-banner')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      useDepartmentDetailScreen.mockReturnValue({
        ...baseHook,
        department: {
          id: 'f1',
          tenant_id: 't1',
          tenant_name: 'Tenant One',
          name: 'Test Department',
          department_type: 'CLINICAL',
          is_active: true,
        },
      });
      const { getByTestId } = renderWithTheme(<DepartmentDetailScreenWeb />);
      expect(getByTestId('department-detail-back')).toBeTruthy();
      expect(getByTestId('department-detail-edit')).toBeTruthy();
      expect(getByTestId('department-detail-delete')).toBeTruthy();
    });

    it('hides edit/delete actions when handlers are unavailable (Web)', () => {
      useDepartmentDetailScreen.mockReturnValue({
        ...baseHook,
        onEdit: undefined,
        onDelete: undefined,
        department: {
          id: 'f1',
          tenant_id: 't1',
          tenant_name: 'Tenant One',
          name: 'Test Department',
          department_type: 'CLINICAL',
          is_active: true,
        },
      });
      const { queryByTestId: queryById, getByTestId } = renderWithTheme(<DepartmentDetailScreenWeb />);
      expect(getByTestId('department-detail-back')).toBeTruthy();
      expect(queryById('department-detail-edit')).toBeNull();
      expect(queryById('department-detail-delete')).toBeNull();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(DepartmentDetailScreenIndex.default).toBeDefined();
      expect(DepartmentDetailScreenIndex.useDepartmentDetailScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.SUCCESS).toBe('success');
    });
  });
});
