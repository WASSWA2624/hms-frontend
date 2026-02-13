/**
 * useRolePermissionDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useRolePermissionDetailScreen = require('@platform/screens/settings/RolePermissionDetailScreen/useRolePermissionDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useRolePermission: jest.fn(),
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
  useLocalSearchParams: () => ({ id: 'rp-1' }),
}));

const { useRolePermission, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useRolePermissionDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRolePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'rp-1', role_id: 'r1', permission_id: 'p1' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns rolePermission, handlers, and state', () => {
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    expect(result.current.rolePermission).toEqual({ id: 'rp-1', role_id: 'r1', permission_id: 'p1' });
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('calls get on mount with id', () => {
    renderHook(() => useRolePermissionDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('rp-1');
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('rp-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/role-permissions');
  });

  it('onEdit pushes edit route when id available', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    result.current.onEdit();
    expect(mockPush).toHaveBeenCalledWith('/settings/role-permissions/rp-1/edit');
  });

  it('exposes errorMessage when errorCode set', () => {
    useRolePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'ROLE_PERMISSION_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then navigates with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'rp-1' });
    mockPush.mockClear();
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('rp-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/role-permissions?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'rp-1' });
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/role-permissions?notice=queued');
  });

  it('onDelete does not navigate when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('rp-1');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('rp-1');
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles null rolePermission when data is null', () => {
    useRolePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    expect(result.current.rolePermission).toBeNull();
  });

  it('handles null rolePermission when data is array', () => {
    useRolePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useRolePermissionDetailScreen());
    expect(result.current.rolePermission).toBeNull();
  });
});

