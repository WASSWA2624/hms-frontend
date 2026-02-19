/**
 * useApiKeyPermissionDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = { id: 'akp-1' };

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useApiKeyPermission: jest.fn(),
  useApiKey: jest.fn(),
  usePermission: jest.fn(),
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

const useApiKeyPermissionDetailScreen = require('@platform/screens/settings/ApiKeyPermissionDetailScreen/useApiKeyPermissionDetailScreen').default;
const {
  useApiKeyPermission,
  useApiKey,
  usePermission,
  useTenantAccess,
  useNetwork,
} = require('@hooks');

describe('useApiKeyPermissionDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListApiKeys = jest.fn();
  const mockResetApiKeys = jest.fn();
  const mockListPermissions = jest.fn();
  const mockResetPermissions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'akp-1' };

    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useNetwork.mockReturnValue({ isOffline: false });

    useApiKeyPermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'akp-1', api_key_id: 'key-1', permission_id: 'perm-1' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useApiKey.mockReturnValue({
      list: mockListApiKeys,
      data: { items: [{ id: 'key-1', name: 'Clinical Key', tenant_id: 'tenant-1' }] },
      isLoading: false,
      reset: mockResetApiKeys,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'perm-1', name: 'Read Encounters', tenant_id: 'tenant-1' }] },
      isLoading: false,
      reset: mockResetPermissions,
    });
  });

  it('loads detail and references on mount with capped limit 100', () => {
    renderHook(() => useApiKeyPermissionDetailScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('akp-1');
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

    renderHook(() => useApiKeyPermissionDetailScreen());
    expect(mockListApiKeys).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('redirects users without module access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useApiKeyPermissionDetailScreen());
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
    useApiKeyPermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'akp-1', api_key_id: 'key-2', permission_id: 'perm-2' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useApiKey.mockReturnValue({
      list: mockListApiKeys,
      data: { items: [{ id: 'key-2', name: 'External Key', tenant_id: 'tenant-2' }] },
      isLoading: false,
      reset: mockResetApiKeys,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'perm-2', name: 'External Permission', tenant_id: 'tenant-2' }] },
      isLoading: false,
      reset: mockResetPermissions,
    });

    renderHook(() => useApiKeyPermissionDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings/api-key-permissions?notice=accessDenied');
  });

  it('resolves technical fallback labels for privileged users', () => {
    useApiKey.mockReturnValue({
      list: mockListApiKeys,
      data: { items: [] },
      isLoading: false,
      reset: mockResetApiKeys,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [] },
      isLoading: false,
      reset: mockResetPermissions,
    });

    const { result } = renderHook(() => useApiKeyPermissionDetailScreen());
    expect(result.current.apiKeyLabel).toBe('key-1');
    expect(result.current.permissionLabel).toBe('perm-1');
  });

  it('onRetry refetches detail and references', () => {
    const { result } = renderHook(() => useApiKeyPermissionDetailScreen());
    mockGet.mockClear();
    mockListApiKeys.mockClear();
    mockListPermissions.mockClear();

    act(() => {
      result.current.onRetry();
    });

    expect(mockGet).toHaveBeenCalledWith('akp-1');
    expect(mockListApiKeys).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('onDelete removes record and navigates with deleted/queued notices', async () => {
    mockRemove.mockResolvedValue({ id: 'akp-1' });

    const { result, rerender } = renderHook(() => useApiKeyPermissionDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/api-key-permissions?notice=deleted');

    useNetwork.mockReturnValue({ isOffline: true });
    rerender();
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/api-key-permissions?notice=queued');
  });
});

