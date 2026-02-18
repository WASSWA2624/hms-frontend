/**
 * useWardDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useWardDetailScreen = require('@platform/screens/settings/WardDetailScreen/useWardDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useWard: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useTenantAccess: jest.fn(),
}));

jest.mock('@utils', () => {
  const actual = jest.requireActual('@utils');
  return {
    ...actual,
    confirmAction: jest.fn(() => true),
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => ({ id: 'rid-1' }),
}));

const {
  useWard,
  useTenant,
  useFacility,
  useNetwork,
  useTenantAccess,
} = require('@hooks');
const { confirmAction } = require('@utils');

describe('useWardDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useWard.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'rid-1',
        name: 'General Ward',
        tenant_id: 'tenant-1',
        facility_id: 'facility-1',
        ward_type: 'GENERAL',
        is_active: true,
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-1', name: 'Tenant A' }] },
      reset: mockResetTenants,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'facility-1', name: 'Facility A' }] },
      reset: mockResetFacilities,
    });
  });

  it('returns ward, labels, handlers, and state', () => {
    const { result } = renderHook(() => useWardDetailScreen());

    expect(result.current.ward).toEqual(expect.objectContaining({ id: 'rid-1', name: 'General Ward' }));
    expect(result.current.wardName).toBe('General Ward');
    expect(result.current.tenantLabel).toBe('Tenant A');
    expect(result.current.facilityLabel).toBe('Facility A');
    expect(result.current.wardTypeLabel).toBe('GENERAL');
    expect(result.current.isActive).toBe(true);
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('redirects users without ward access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useWardDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('redirects tenant-scoped users without tenant id', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useWardDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users when ward tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useWard.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'rid-1', tenant_id: 'tenant-2', name: 'General Ward' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useWardDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings/wards?notice=accessDenied');
  });

  it('calls get on mount with id', () => {
    renderHook(() => useWardDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('rid-1');
  });

  it('loads context references with capped limit 100 for global admins', () => {
    renderHook(() => useWardDetailScreen());

    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('does not load tenant list for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useWardDetailScreen());

    expect(mockListTenants).not.toHaveBeenCalled();
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => useWardDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('rid-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useWardDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/wards');
  });

  it('onEdit pushes edit route when id available', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useWardDetailScreen());
    result.current.onEdit();
    expect(mockPush).toHaveBeenCalledWith('/settings/wards/rid-1/edit');
  });

  it('exposes errorMessage when errorCode set', () => {
    useWard.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'WARD_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useWardDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then navigates with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'rid-1' });
    mockPush.mockClear();
    const { result } = renderHook(() => useWardDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('rid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/wards?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'rid-1' });
    const { result } = renderHook(() => useWardDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/wards?notice=queued');
  });

  it('onDelete does not navigate when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useWardDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('rid-1');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useWardDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('rid-1');
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useWardDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles null ward when data is null', () => {
    useWard.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useWardDetailScreen());
    expect(result.current.ward).toBeNull();
  });

  it('handles null ward when data is array', () => {
    useWard.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useWardDetailScreen());
    expect(result.current.ward).toBeNull();
  });
});
