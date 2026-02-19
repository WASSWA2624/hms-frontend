/**
 * useUserMfaDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = { id: 'mfa-1' };

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useTenantAccess: jest.fn(),
  useUserMfa: jest.fn(),
  useUser: jest.fn(),
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

const useUserMfaDetailScreen = require('@platform/screens/settings/UserMfaDetailScreen/useUserMfaDetailScreen').default;
const {
  useUserMfa,
  useUser,
  useTenantAccess,
  useNetwork,
} = require('@hooks');
const { confirmAction } = require('@utils');

describe('useUserMfaDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'mfa-1' };

    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useNetwork.mockReturnValue({ isOffline: false });

    useUserMfa.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'mfa-1', user_id: 'user-1', channel: 'EMAIL', is_enabled: true },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-1', name: 'Alice', tenant_id: 'tenant-1' }] },
      reset: mockResetUsers,
    });
  });

  it('loads detail and users on mount with capped limit 100', () => {
    renderHook(() => useUserMfaDetailScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('mfa-1');
    expect(mockResetUsers).toHaveBeenCalled();
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('scopes users lookup for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useUserMfaDetailScreen());
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('redirects users without module access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useUserMfaDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('blocks tenant-scoped admins from out-of-scope records', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserMfa.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'mfa-1', user_id: 'user-2', tenant_id: 'tenant-2' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-2', name: 'External', tenant_id: 'tenant-2' }] },
      reset: mockResetUsers,
    });

    renderHook(() => useUserMfaDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings/user-mfas?notice=accessDenied');
  });

  it('masks technical ids for standard users', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserMfa.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'mfa-raw', user_id: 'user-raw' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [] },
      reset: mockResetUsers,
    });

    const { result } = renderHook(() => useUserMfaDetailScreen());
    expect(result.current.mfaLabel).toBe('userMfa.detail.currentMfaId');
    expect(result.current.userLabel).toBe('userMfa.detail.currentUser');
  });

  it('shows technical fallbacks for super admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useUserMfa.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'mfa-raw', user_id: 'user-raw' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [] },
      reset: mockResetUsers,
    });

    const { result } = renderHook(() => useUserMfaDetailScreen());
    expect(result.current.mfaLabel).toBe('mfa-raw');
    expect(result.current.userLabel).toBe('user-raw');
  });

  it('onRetry refetches detail and users', () => {
    const { result } = renderHook(() => useUserMfaDetailScreen());
    mockGet.mockClear();
    mockListUsers.mockClear();

    act(() => {
      result.current.onRetry();
    });

    expect(mockGet).toHaveBeenCalledWith('mfa-1');
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('onDelete removes record and navigates with deleted/queued notices', async () => {
    mockRemove.mockResolvedValue({ id: 'mfa-1' });

    const { result, rerender } = renderHook(() => useUserMfaDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/user-mfas?notice=deleted');

    useNetwork.mockReturnValue({ isOffline: true });
    rerender();
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/user-mfas?notice=queued');
  });

  it('does not remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);

    const { result } = renderHook(() => useUserMfaDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
