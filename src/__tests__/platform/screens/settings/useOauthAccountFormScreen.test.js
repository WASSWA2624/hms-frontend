/**
 * useOauthAccountFormScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useOauthAccount: jest.fn(),
  useUser: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useNetwork,
  useOauthAccount,
  useUser,
  useTenantAccess,
} = require('@hooks');

const useOauthAccountFormScreen = require('@platform/screens/settings/OauthAccountFormScreen/useOauthAccountFormScreen').default;

describe('useOauthAccountFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};

    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useOauthAccount.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-1', name: 'Alice Carter', tenant_id: 'tenant-1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });
  });

  it('returns initial create state with user prefill', async () => {
    const { result } = renderHook(() => useOauthAccountFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.oauthAccount).toBeNull();
    expect(result.current.provider).toBe('');
    expect(result.current.providerUserId).toBe('');

    await waitFor(() => {
      expect(result.current.userId).toBe('user-1');
    });
  });

  it('loads edit detail when route id is provided', () => {
    mockParams = { id: 'oac-1' };
    renderHook(() => useOauthAccountFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('oac-1');
  });

  it('loads user references with capped limit 100', () => {
    renderHook(() => useOauthAccountFormScreen());
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

    renderHook(() => useOauthAccountFormScreen());
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('hydrates form values from edit payload', async () => {
    mockParams = { id: 'oac-1' };
    useOauthAccount.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        user_id: 'user-1',
        provider: 'Google',
        provider_user_id: 'alice-google',
        expires_at: '2030-02-01T00:00:00.000Z',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useOauthAccountFormScreen());
    await waitFor(() => {
      expect(result.current.userId).toBe('user-1');
      expect(result.current.provider).toBe('Google');
      expect(result.current.providerUserId).toBe('alice-google');
      expect(result.current.expiresAt).toBe('2030-02-01');
    });
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'oac-1' });

    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setUserId(' user-1 ');
      result.current.setProvider(' Google ');
      result.current.setProviderUserId(' alice-google ');
      result.current.setAccessToken(' encrypted-access-token ');
      result.current.setRefreshToken(' encrypted-refresh-token ');
      result.current.setExpiresAt('2030-01-01');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      user_id: 'user-1',
      provider: 'Google',
      provider_user_id: 'alice-google',
      access_token_encrypted: 'encrypted-access-token',
      refresh_token_encrypted: 'encrypted-refresh-token',
      expires_at: '2030-01-01T00:00:00.000Z',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'oac-1' };
    mockUpdate.mockResolvedValue({ id: 'oac-1' });

    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setProvider('Google');
      result.current.setProviderUserId('alice-google');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('oac-1', {
      provider: 'Google',
      provider_user_id: 'alice-google',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts?notice=updated');
  });

  it('prevents tenant-scoped submission for out-of-scope user selection', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-2', name: 'External User', tenant_id: 'tenant-2' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });

    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setUserId('user-2');
      result.current.setProvider('Microsoft');
      result.current.setProviderUserId('external-user');
    });

    expect(result.current.isSubmitDisabled).toBe(true);
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('uses queued notice while offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'oac-1' });

    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setUserId('user-1');
      result.current.setProvider('Google');
      result.current.setProviderUserId('alice-google');
    });

    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts?notice=queued');
  });

  it('routes to users and retries user references', () => {
    const { result } = renderHook(() => useOauthAccountFormScreen());

    act(() => {
      result.current.onGoToUsers();
      result.current.onRetryUsers();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/users');
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('redirects users without module access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useOauthAccountFormScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });
});
