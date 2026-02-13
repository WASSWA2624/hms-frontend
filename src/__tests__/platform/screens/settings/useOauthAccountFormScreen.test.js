/**
 * useOauthAccountFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useOauthAccountFormScreen = require('@platform/screens/settings/OauthAccountFormScreen/useOauthAccountFormScreen').default;

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

const { useNetwork, useOauthAccount, useUser, useTenantAccess } = require('@hooks');

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
      tenantId: 'tenant-1',
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
      data: { items: [{ id: 'user-1', email: 'user@example.com' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });
  });

  it('returns initial create state', () => {
    const { result } = renderHook(() => useOauthAccountFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.provider).toBe('');
    expect(result.current.providerUserId).toBe('');
    expect(result.current.oauthAccount).toBeNull();
  });

  it('calls user list on mount', () => {
    renderHook(() => useOauthAccountFormScreen());
    expect(mockResetUsers).toHaveBeenCalled();
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 200 });
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'oauth-1' };
    renderHook(() => useOauthAccountFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('oauth-1');
  });

  it('prefills user from query param in create mode', () => {
    mockParams = { userId: 'user-2' };
    const { result } = renderHook(() => useOauthAccountFormScreen());
    expect(result.current.userId).toBe('user-2');
  });

  it('submits create payload and navigates with created notice', async () => {
    mockCreate.mockResolvedValue({ id: 'oauth-1' });
    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setUserId(' user-1 ');
      result.current.setProvider(' Google ');
      result.current.setProviderUserId(' google-uid ');
      result.current.setAccessToken(' token-a ');
      result.current.setRefreshToken(' token-r ');
      result.current.setExpiresAt('2026-12-31');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).toHaveBeenCalledWith({
      user_id: 'user-1',
      provider: 'Google',
      provider_user_id: 'google-uid',
      access_token_encrypted: 'token-a',
      refresh_token_encrypted: 'token-r',
      expires_at: '2026-12-31T00:00:00.000Z',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts?notice=created');
  });

  it('submits update payload and navigates with updated notice', async () => {
    mockParams = { id: 'oauth-1' };
    mockUpdate.mockResolvedValue({ id: 'oauth-1' });
    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setProvider('Github');
      result.current.setProviderUserId('gh-uid');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockUpdate).toHaveBeenCalledWith('oauth-1', {
      provider: 'Github',
      provider_user_id: 'gh-uid',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts?notice=updated');
  });

  it('uses queued notice while offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'oauth-1' });
    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setUserId('user-1');
      result.current.setProvider('Google');
      result.current.setProviderUserId('google-uid');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts?notice=queued');
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useOauthAccountFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useOauthAccountFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts');
  });

  it('onGoToUsers navigates to users list', () => {
    const { result } = renderHook(() => useOauthAccountFormScreen());
    result.current.onGoToUsers();
    expect(mockPush).toHaveBeenCalledWith('/settings/users');
  });
});
