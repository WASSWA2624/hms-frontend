/**
 * useBranchDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useBranchDetailScreen = require('@platform/screens/settings/BranchDetailScreen/useBranchDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useBranch: jest.fn(),
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

const { useBranch, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useBranchDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useBranch.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'bid-1', name: 'Test Branch' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns branch, handlers, and state', () => {
    const { result } = renderHook(() => useBranchDetailScreen());
    expect(result.current.branch).toEqual({ id: 'bid-1', name: 'Test Branch' });
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('redirects users without branch access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useBranchDetailScreen());

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

    renderHook(() => useBranchDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users when branch tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useBranch.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'bid-1', tenant_id: 'tenant-2', name: 'Test Branch' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useBranchDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/branches?notice=accessDenied');
  });

  it('calls get on mount with id', () => {
    renderHook(() => useBranchDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('bid-1');
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => useBranchDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('bid-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useBranchDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/branches');
  });

  it('onEdit pushes edit route when id available', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useBranchDetailScreen());
    result.current.onEdit();
    expect(mockPush).toHaveBeenCalledWith('/settings/branches/bid-1/edit');
  });

  it('exposes errorMessage when errorCode set', () => {
    useBranch.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'BRANCH_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useBranchDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then navigates with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'bid-1' });
    mockPush.mockClear();
    const { result } = renderHook(() => useBranchDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/branches?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'bid-1' });
    const { result } = renderHook(() => useBranchDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/branches?notice=queued');
  });

  it('onDelete does not navigate when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useBranchDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useBranchDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useBranchDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles null branch when data is null', () => {
    useBranch.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useBranchDetailScreen());
    expect(result.current.branch).toBeNull();
  });

  it('handles null branch when data is array', () => {
    useBranch.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useBranchDetailScreen());
    expect(result.current.branch).toBeNull();
  });
});
