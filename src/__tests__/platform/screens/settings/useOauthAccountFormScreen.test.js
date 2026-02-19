/**
 * useOauthAccountFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');

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
  usePermission: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useNetwork,
  useOauthAccount,
  useUser,
  usePermission,
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
  const mockListPermissions = jest.fn();
  const mockResetPermissions = jest.fn();

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
      data: { items: [{ id: 'key-1', name: 'Clinical Key', tenant_id: 'tenant-1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'perm-1', name: 'Read Encounters', tenant_id: 'tenant-1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetPermissions,
    });
  });

  it('returns initial create state', () => {
    const { result } = renderHook(() => useOauthAccountFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.apiKeyId).toBe('key-1');
    expect(result.current.permissionId).toBe('perm-1');
    expect(result.current.oauthAccount).toBeNull();
  });

  it('loads edit detail when route id is provided', () => {
    mockParams = { id: 'akp-1' };
    renderHook(() => useOauthAccountFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('akp-1');
  });

  it('loads references with capped limit 100', () => {
    renderHook(() => useOauthAccountFormScreen());
    expect(mockResetUsers).toHaveBeenCalled();
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockResetPermissions).toHaveBeenCalled();
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100 });
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
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('hydrates form values from edit payload', () => {
    mockParams = { id: 'akp-1' };
    useOauthAccount.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: { api_key_id: 'key-1', permission_id: 'perm-1' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useOauthAccountFormScreen());
    expect(result.current.apiKeyId).toBe('key-1');
    expect(result.current.permissionId).toBe('perm-1');
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'akp-1' });

    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setApiKeyId(' key-1 ');
      result.current.setPermissionId(' perm-1 ');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      api_key_id: 'key-1',
      permission_id: 'perm-1',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'akp-1' };
    mockUpdate.mockResolvedValue({ id: 'akp-1' });

    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setApiKeyId('key-1');
      result.current.setPermissionId('perm-1');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('akp-1', {
      api_key_id: 'key-1',
      permission_id: 'perm-1',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts?notice=updated');
  });

  it('prevents tenant-scoped submission for out-of-scope selections', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'key-2', name: 'External Key', tenant_id: 'tenant-2' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'perm-2', name: 'External Permission', tenant_id: 'tenant-2' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetPermissions,
    });

    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setApiKeyId('key-2');
      result.current.setPermissionId('perm-2');
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
    mockCreate.mockResolvedValue({ id: 'akp-1' });

    const { result } = renderHook(() => useOauthAccountFormScreen());
    act(() => {
      result.current.setApiKeyId('key-1');
      result.current.setPermissionId('perm-1');
    });

    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts?notice=queued');
  });

  it('routes to related modules and retries references', () => {
    const { result } = renderHook(() => useOauthAccountFormScreen());

    act(() => {
      result.current.onGoToApiKeys();
      result.current.onGoToPermissions();
      result.current.onRetryApiKeys();
      result.current.onRetryPermissions();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/api-keys');
    expect(mockPush).toHaveBeenCalledWith('/settings/permissions');
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });
});

