/**
 * useRolePermissionListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useRolePermissionListScreen = require('@platform/screens/settings/RolePermissionListScreen/useRolePermissionListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

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
  useLocalSearchParams: () => mockParams,
}));

const { useRolePermission, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useRolePermissionListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRolePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [], pagination: {} },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns items, handlers, and state', () => {
    const { result } = renderHook(() => useRolePermissionListScreen());
    expect(result.current.items).toEqual([]);
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onItemPress).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('calls list on mount', () => {
    renderHook(() => useRolePermissionListScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRetry calls fetchList', () => {
    const { result } = renderHook(() => useRolePermissionListScreen());
    mockReset.mockClear();
    mockList.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onItemPress pushes route with id', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useRolePermissionListScreen());
    result.current.onItemPress('rp-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/role-permissions/rp-1');
  });

  it('onAdd pushes route to create', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useRolePermissionListScreen());
    result.current.onAdd();
    expect(mockPush).toHaveBeenCalledWith('/settings/role-permissions/create');
  });

  it('exposes errorMessage when errorCode set', () => {
    useRolePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useRolePermissionListScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('rolePermission.list.loadError');
  });

  it('onDelete calls remove then fetchList', async () => {
    mockRemove.mockResolvedValue({ id: 'rp-1' });
    mockReset.mockClear();
    mockList.mockClear();
    const { result } = renderHook(() => useRolePermissionListScreen());
    await act(async () => {
      await result.current.onDelete('rp-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('rp-1');
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onDelete sets notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'rp-1' });
    const { result } = renderHook(() => useRolePermissionListScreen());
    await act(async () => {
      await result.current.onDelete('rp-1');
    });
    expect(result.current.noticeMessage).toBe('rolePermission.list.noticeQueued');
  });

  it('onDelete does not refetch when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => useRolePermissionListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onDelete('rp-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('rp-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('onDelete calls stopPropagation when event provided', async () => {
    const stopPropagation = jest.fn();
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => useRolePermissionListScreen());
    await act(async () => {
      await result.current.onDelete('rp-1', { stopPropagation });
    });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onDelete does not throw or refetch when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useRolePermissionListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onDelete('rp-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('rp-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useRolePermissionListScreen());
    await act(async () => {
      await result.current.onDelete('rp-1');
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles items from data', () => {
    useRolePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [{ id: 'rp-1', role_id: 'r1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useRolePermissionListScreen());
    expect(result.current.items).toEqual([{ id: 'rp-1', role_id: 'r1' }]);
  });

  it('handles items array data', () => {
    useRolePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: [{ id: 'rp-1', role_id: 'r1' }],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useRolePermissionListScreen());
    expect(result.current.items).toEqual([{ id: 'rp-1', role_id: 'r1' }]);
  });

  it('handles notice param and clears it', () => {
    mockParams = { notice: 'created' };
    const { result } = renderHook(() => useRolePermissionListScreen());
    expect(result.current.noticeMessage).toBe('rolePermission.list.noticeCreated');
    expect(mockReplace).toHaveBeenCalledWith('/settings/role-permissions');
  });
});

