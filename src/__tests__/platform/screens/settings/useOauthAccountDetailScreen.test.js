/**
 * useOauthAccountDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = { id: 'oac-1' };

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useOauthAccount: jest.fn(),
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

const useOauthAccountDetailScreen = require('@platform/screens/settings/OauthAccountDetailScreen/useOauthAccountDetailScreen').default;
const {
  useOauthAccount,
  useUser,
  useTenantAccess,
  useNetwork,
} = require('@hooks');

describe('useOauthAccountDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'oac-1' };

    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useNetwork.mockReturnValue({ isOffline: false });

    useOauthAccount.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'oac-1',
        user_id: 'user-1',
        provider: 'Google',
        provider_user_id: 'alice-google',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-1', name: 'Alice Carter', tenant_id: 'tenant-1' }] },
      isLoading: false,
      reset: mockResetUsers,
    });
  });

  it('loads detail and user references on mount with capped limit 100', () => {
    renderHook(() => useOauthAccountDetailScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('oac-1');
    expect(mockResetUsers).toHaveBeenCalled();
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('scopes references for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useOauthAccountDetailScreen());
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('redirects users without module access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useOauthAccountDetailScreen());
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
    useOauthAccount.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'oac-1',
        user_id: 'user-2',
        provider: 'Microsoft',
        provider_user_id: 'external-provider-user',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-2', name: 'External User', tenant_id: 'tenant-2' }] },
      isLoading: false,
      reset: mockResetUsers,
    });

    renderHook(() => useOauthAccountDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts?notice=accessDenied');
  });

  it('resolves technical fallback labels for privileged users', () => {
    useOauthAccount.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'oac-1',
        user_id: 'user-raw-id',
        provider: null,
        provider_user_id: 'provider-raw-id',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [] },
      isLoading: false,
      reset: mockResetUsers,
    });

    const { result } = renderHook(() => useOauthAccountDetailScreen());
    expect(result.current.userLabel).toBe('user-raw-id');
    expect(result.current.providerUserLabel).toBe('provider-raw-id');
  });

  it('onRetry refetches detail and references', () => {
    const { result } = renderHook(() => useOauthAccountDetailScreen());
    mockGet.mockClear();
    mockListUsers.mockClear();

    act(() => {
      result.current.onRetry();
    });

    expect(mockGet).toHaveBeenCalledWith('oac-1');
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('onDelete removes record and navigates with deleted/queued notices', async () => {
    mockRemove.mockResolvedValue({ id: 'oac-1' });

    const { result, rerender } = renderHook(() => useOauthAccountDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts?notice=deleted');

    useNetwork.mockReturnValue({ isOffline: true });
    rerender();
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts?notice=queued');
  });

  it('masks technical fallback labels for standard users', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useOauthAccount.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'oac-1',
        tenant_id: 'tenant-1',
        user_id: 'user-raw-id',
        provider: null,
        provider_user_id: '8f4fd148-2502-4edb-bf1d-c1f5c66182fd',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [] },
      isLoading: false,
      reset: mockResetUsers,
    });

    const { result } = renderHook(() => useOauthAccountDetailScreen());
    expect(result.current.userLabel).toBe('oauthAccount.detail.currentUserLabel');
    expect(result.current.providerUserLabel).toBe('oauthAccount.detail.currentProviderUserLabel');
  });
});
