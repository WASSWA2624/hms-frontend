/**
 * useBedDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useBedDetailScreen = require('@platform/screens/settings/BedDetailScreen/useBedDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useBed: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useWard: jest.fn(),
  useRoom: jest.fn(),
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
  useLocalSearchParams: () => ({ id: 'bid-1' }),
}));

const {
  useBed,
  useTenant,
  useFacility,
  useWard,
  useRoom,
  useNetwork,
  useTenantAccess,
} = require('@hooks');
const { confirmAction } = require('@utils');

describe('useBedDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();
  const mockListWards = jest.fn();
  const mockResetWards = jest.fn();
  const mockListRooms = jest.fn();
  const mockResetRooms = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useBed.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'bid-1',
        label: 'A-01',
        tenant_id: 'tenant-1',
        facility_id: 'facility-1',
        ward_id: 'ward-1',
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
    useWard.mockReturnValue({
      list: mockListWards,
      data: { items: [{ id: 'ward-1', name: 'Ward A' }] },
      reset: mockResetWards,
    });
    useRoom.mockReturnValue({
      list: mockListRooms,
      data: { items: [] },
      reset: mockResetRooms,
    });
  });

  it('returns bed, handlers, and state', () => {
    const { result } = renderHook(() => useBedDetailScreen());
    expect(result.current.bed).toEqual(expect.objectContaining({ id: 'bid-1', label: 'A-01' }));
    expect(result.current.bedLabel).toBe('A-01');
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('redirects users without bed access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useBedDetailScreen());

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

    renderHook(() => useBedDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users when bed tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useBed.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'bid-1', tenant_id: 'tenant-2', label: 'A-01' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useBedDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings/beds?notice=accessDenied');
  });

  it('calls get on mount with id', () => {
    renderHook(() => useBedDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('bid-1');
  });

  it('loads context references with capped limit 100', () => {
    renderHook(() => useBedDetailScreen());

    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListWards).toHaveBeenCalledWith({ page: 1, limit: 100, facility_id: 'facility-1' });
    expect(mockListRooms).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 'tenant-1',
      facility_id: 'facility-1',
      ward_id: 'ward-1',
    });
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => useBedDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('bid-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useBedDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/beds');
  });

  it('onEdit pushes edit route when id available', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useBedDetailScreen());
    result.current.onEdit();
    expect(mockPush).toHaveBeenCalledWith('/settings/beds/bid-1/edit');
  });

  it('exposes errorMessage when errorCode set', () => {
    useBed.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'BED_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useBedDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then navigates with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'bid-1' });
    mockPush.mockClear();
    const { result } = renderHook(() => useBedDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/beds?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'bid-1' });
    const { result } = renderHook(() => useBedDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/beds?notice=queued');
  });

  it('onDelete does not navigate when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useBedDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useBedDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useBedDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles null bed when data is null', () => {
    useBed.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useBedDetailScreen());
    expect(result.current.bed).toBeNull();
  });

  it('handles null bed when data is array', () => {
    useBed.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useBedDetailScreen());
    expect(result.current.bed).toBeNull();
  });
});

