/**
 * useApiKeyPermissionFormScreen Hook Tests
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
  useApiKeyPermission: jest.fn(),
  useApiKey: jest.fn(),
  usePermission: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useNetwork,
  useApiKeyPermission,
  useApiKey,
  usePermission,
  useTenantAccess,
} = require('@hooks');

const useApiKeyPermissionFormScreen = require('@platform/screens/settings/ApiKeyPermissionFormScreen/useApiKeyPermissionFormScreen').default;

describe('useApiKeyPermissionFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListApiKeys = jest.fn();
  const mockResetApiKeys = jest.fn();
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
    useApiKeyPermission.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useApiKey.mockReturnValue({
      list: mockListApiKeys,
      data: { items: [{ id: 'key-1', name: 'Clinical Key', tenant_id: 'tenant-1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetApiKeys,
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
    const { result } = renderHook(() => useApiKeyPermissionFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.apiKeyId).toBe('key-1');
    expect(result.current.permissionId).toBe('perm-1');
    expect(result.current.apiKeyPermission).toBeNull();
  });

  it('loads edit detail when route id is provided', () => {
    mockParams = { id: 'akp-1' };
    renderHook(() => useApiKeyPermissionFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('akp-1');
  });

  it('loads references with capped limit 100', () => {
    renderHook(() => useApiKeyPermissionFormScreen());
    expect(mockResetApiKeys).toHaveBeenCalled();
    expect(mockListApiKeys).toHaveBeenCalledWith({ page: 1, limit: 100 });
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

    renderHook(() => useApiKeyPermissionFormScreen());
    expect(mockListApiKeys).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('hydrates form values from edit payload', () => {
    mockParams = { id: 'akp-1' };
    useApiKeyPermission.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: { api_key_id: 'key-1', permission_id: 'perm-1' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useApiKeyPermissionFormScreen());
    expect(result.current.apiKeyId).toBe('key-1');
    expect(result.current.permissionId).toBe('perm-1');
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'akp-1' });

    const { result } = renderHook(() => useApiKeyPermissionFormScreen());
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
    expect(mockReplace).toHaveBeenCalledWith('/settings/api-key-permissions?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'akp-1' };
    mockUpdate.mockResolvedValue({ id: 'akp-1' });

    const { result } = renderHook(() => useApiKeyPermissionFormScreen());
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
    expect(mockReplace).toHaveBeenCalledWith('/settings/api-key-permissions?notice=updated');
  });

  it('prevents tenant-scoped submission for out-of-scope selections', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useApiKey.mockReturnValue({
      list: mockListApiKeys,
      data: { items: [{ id: 'key-2', name: 'External Key', tenant_id: 'tenant-2' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetApiKeys,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'perm-2', name: 'External Permission', tenant_id: 'tenant-2' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetPermissions,
    });

    const { result } = renderHook(() => useApiKeyPermissionFormScreen());
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

    const { result } = renderHook(() => useApiKeyPermissionFormScreen());
    act(() => {
      result.current.setApiKeyId('key-1');
      result.current.setPermissionId('perm-1');
    });

    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/api-key-permissions?notice=queued');
  });

  it('routes to related modules and retries references', () => {
    const { result } = renderHook(() => useApiKeyPermissionFormScreen());

    act(() => {
      result.current.onGoToApiKeys();
      result.current.onGoToPermissions();
      result.current.onRetryApiKeys();
      result.current.onRetryPermissions();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/api-keys');
    expect(mockPush).toHaveBeenCalledWith('/settings/permissions');
    expect(mockListApiKeys).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });
});
