/**
 * useUserListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useUserListScreen = require('@platform/screens/settings/UserListScreen/useUserListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useUser: jest.fn(),
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

const { useUser, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useUserListScreen', () => {
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
    useUser.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [], pagination: {} },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns items, handlers, and state', () => {
    const { result } = renderHook(() => useUserListScreen());
    expect(result.current.items).toEqual([]);
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onUserPress).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('calls list on mount', () => {
    renderHook(() => useUserListScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRetry calls fetchList', () => {
    const { result } = renderHook(() => useUserListScreen());
    mockReset.mockClear();
    mockList.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onUserPress pushes route with id', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useUserListScreen());
    result.current.onUserPress('uid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/users/uid-1');
  });

  it('onAdd pushes route to create', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useUserListScreen());
    result.current.onAdd();
    expect(mockPush).toHaveBeenCalledWith('/settings/users/create');
  });

  it('exposes errorMessage when errorCode set', () => {
    useUser.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useUserListScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('user.list.loadError');
  });

  it('onDelete calls remove then fetchList', async () => {
    mockRemove.mockResolvedValue({ id: 'uid-1' });
    mockReset.mockClear();
    mockList.mockClear();
    const { result } = renderHook(() => useUserListScreen());
    await act(async () => {
      await result.current.onDelete('uid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('uid-1');
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onDelete sets notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'uid-1' });
    const { result } = renderHook(() => useUserListScreen());
    await act(async () => {
      await result.current.onDelete('uid-1');
    });
    expect(result.current.noticeMessage).toBe('user.list.noticeQueued');
  });

  it('onDelete does not refetch when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => useUserListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onDelete('uid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('uid-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('onDelete calls stopPropagation when event provided', async () => {
    const stopPropagation = jest.fn();
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => useUserListScreen());
    await act(async () => {
      await result.current.onDelete('uid-1', { stopPropagation });
    });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onDelete does not throw or refetch when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useUserListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onDelete('uid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('uid-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useUserListScreen());
    await act(async () => {
      await result.current.onDelete('uid-1');
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles items from data', () => {
    useUser.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [{ id: 'u1', email: 'test@example.com' }] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useUserListScreen());
    expect(result.current.items).toEqual([{ id: 'u1', email: 'test@example.com' }]);
  });

  it('handles items array data', () => {
    useUser.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: [{ id: 'u1', email: 'test@example.com' }],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useUserListScreen());
    expect(result.current.items).toEqual([{ id: 'u1', email: 'test@example.com' }]);
  });

  it('handles notice param and clears it', () => {
    mockParams = { notice: 'created' };
    const { result } = renderHook(() => useUserListScreen());
    expect(result.current.noticeMessage).toBe('user.list.noticeCreated');
    expect(mockReplace).toHaveBeenCalledWith('/settings/users');
  });

  it('returns loading state while tenant access is unresolved', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: false,
    });
    const { result } = renderHook(() => useUserListScreen());
    expect(result.current.isLoading).toBe(true);
  });

  it('hides create/delete actions when tenant access is denied', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });
    const { result } = renderHook(() => useUserListScreen());
    expect(result.current.onAdd).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });
});
