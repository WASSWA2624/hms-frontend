/**
 * useRoomDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useRoomDetailScreen = require('@platform/screens/settings/RoomDetailScreen/useRoomDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useRoom: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useWard: jest.fn(),
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
  useRoom,
  useTenant,
  useFacility,
  useWard,
  useNetwork,
  useTenantAccess,
} = require('@hooks');
const { confirmAction } = require('@utils');

describe('useRoomDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();
  const mockListWards = jest.fn();
  const mockResetWards = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useRoom.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'rid-1',
        name: 'A-01',
        tenant_id: 'tenant-1',
        facility_id: 'facility-1',
        ward_id: 'ward-1',
        floor: '2',
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
  });

  it('returns room, handlers, and state', () => {
    const { result } = renderHook(() => useRoomDetailScreen());
    expect(result.current.room).toEqual(expect.objectContaining({ id: 'rid-1', name: 'A-01' }));
    expect(result.current.roomName).toBe('A-01');
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('redirects users without room access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useRoomDetailScreen());

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

    renderHook(() => useRoomDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users when room tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRoom.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'rid-1', tenant_id: 'tenant-2', name: 'A-01' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useRoomDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings/rooms?notice=accessDenied');
  });

  it('calls get on mount with id', () => {
    renderHook(() => useRoomDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('rid-1');
  });

  it('loads context references with capped limit 100', () => {
    renderHook(() => useRoomDetailScreen());

    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListWards).toHaveBeenCalledWith({ page: 1, limit: 100, facility_id: 'facility-1' });
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => useRoomDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('rid-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useRoomDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/rooms');
  });

  it('onEdit pushes edit route when id available', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useRoomDetailScreen());
    result.current.onEdit();
    expect(mockPush).toHaveBeenCalledWith('/settings/rooms/rid-1/edit');
  });

  it('exposes errorMessage when errorCode set', () => {
    useRoom.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'ROOM_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useRoomDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then navigates with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'rid-1' });
    mockPush.mockClear();
    const { result } = renderHook(() => useRoomDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('rid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/rooms?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'rid-1' });
    const { result } = renderHook(() => useRoomDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/rooms?notice=queued');
  });

  it('onDelete does not navigate when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useRoomDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('rid-1');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useRoomDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('rid-1');
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useRoomDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles null room when data is null', () => {
    useRoom.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useRoomDetailScreen());
    expect(result.current.room).toBeNull();
  });

  it('handles null room when data is array', () => {
    useRoom.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useRoomDetailScreen());
    expect(result.current.room).toBeNull();
  });
});
