/**
 * useApiKeyPermissionListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useApiKeyPermission: jest.fn(),
  useApiKey: jest.fn(),
  usePermission: jest.fn(),
  useTenantAccess: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
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

const useApiKeyPermissionListScreen = require('@platform/screens/settings/ApiKeyPermissionListScreen/useApiKeyPermissionListScreen').default;
const {
  useI18n,
  useAuth,
  useNetwork,
  useApiKeyPermission,
  useApiKey,
  usePermission,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useApiKeyPermissionListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListApiKeys = jest.fn();
  const mockResetApiKeys = jest.fn();
  const mockListPermissions = jest.fn();
  const mockResetPermissions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};

    useI18n.mockReturnValue({
      t: (key) => key,
    });
    useAuth.mockReturnValue({ user: { id: 'user-1' } });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });

    useApiKeyPermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useApiKey.mockReturnValue({
      list: mockListApiKeys,
      data: { items: [] },
      reset: mockResetApiKeys,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [] },
      reset: mockResetPermissions,
    });

    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  it('loads list and references with capped limit 100', () => {
    renderHook(() => useApiKeyPermissionListScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockResetApiKeys).toHaveBeenCalled();
    expect(mockListApiKeys).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockResetPermissions).toHaveBeenCalled();
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('applies tenant scope only to reference lookups', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useApiKeyPermissionListScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListApiKeys).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('supports all-field and scoped search', () => {
    useApiKeyPermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'akp-1', api_key_id: 'key-1', permission_id: 'perm-1' },
          { id: 'akp-2', api_key_id: 'key-2', permission_id: 'perm-2' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useApiKey.mockReturnValue({
      list: mockListApiKeys,
      data: {
        items: [
          { id: 'key-1', name: 'Clinical Integration', tenant_id: 'tenant-1' },
          { id: 'key-2', name: 'Billing Bridge', tenant_id: 'tenant-2' },
        ],
      },
      reset: mockResetApiKeys,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: {
        items: [
          { id: 'perm-1', name: 'Read Encounters', tenant_id: 'tenant-1' },
          { id: 'perm-2', name: 'Sync Billing', tenant_id: 'tenant-2' },
        ],
      },
      reset: mockResetPermissions,
    });

    const { result } = renderHook(() => useApiKeyPermissionListScreen());

    act(() => {
      result.current.onSearch('billing');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['akp-2']);

    act(() => {
      result.current.onSearchScopeChange('permission');
      result.current.onSearch('read');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['akp-1']);
  });

  it('filters out records outside tenant scope and blocks direct open', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useApiKeyPermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'akp-1', api_key_id: 'key-1', permission_id: 'perm-1' },
          { id: 'akp-2', api_key_id: 'key-2', permission_id: 'perm-2' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useApiKey.mockReturnValue({
      list: mockListApiKeys,
      data: {
        items: [
          { id: 'key-1', name: 'Scoped Key', tenant_id: 'tenant-1' },
          { id: 'key-2', name: 'External Key', tenant_id: 'tenant-2' },
        ],
      },
      reset: mockResetApiKeys,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: {
        items: [
          { id: 'perm-1', name: 'Scoped Permission', tenant_id: 'tenant-1' },
          { id: 'perm-2', name: 'External Permission', tenant_id: 'tenant-2' },
        ],
      },
      reset: mockResetPermissions,
    });

    const { result } = renderHook(() => useApiKeyPermissionListScreen());
    expect(result.current.items.map((item) => item.id)).toEqual(['akp-1']);

    act(() => {
      result.current.onItemPress('akp-2');
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/api-key-permissions?notice=accessDenied');
  });

  it('deletes record and refetches list', async () => {
    useApiKeyPermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{ id: 'akp-1', api_key_id: 'key-1', permission_id: 'perm-1' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useApiKey.mockReturnValue({
      list: mockListApiKeys,
      data: { items: [{ id: 'key-1', name: 'Scoped Key', tenant_id: 'tenant-1' }] },
      reset: mockResetApiKeys,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'perm-1', name: 'Scoped Permission', tenant_id: 'tenant-1' }] },
      reset: mockResetPermissions,
    });
    mockRemove.mockResolvedValue({ id: 'akp-1' });

    const { result } = renderHook(() => useApiKeyPermissionListScreen());

    await act(async () => {
      await result.current.onDelete('akp-1');
    });

    expect(mockRemove).toHaveBeenCalledWith('akp-1');
    expect(mockList).toHaveBeenLastCalledWith({ page: 1, limit: 100 });
    expect(result.current.noticeMessage).toBe('apiKeyPermission.list.noticeDeleted');
  });

  it('does not delete when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    useApiKeyPermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{ id: 'akp-1', api_key_id: 'key-1', permission_id: 'perm-1' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useApiKey.mockReturnValue({
      list: mockListApiKeys,
      data: { items: [{ id: 'key-1', name: 'Scoped Key', tenant_id: 'tenant-1' }] },
      reset: mockResetApiKeys,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'perm-1', name: 'Scoped Permission', tenant_id: 'tenant-1' }] },
      reset: mockResetPermissions,
    });

    const { result } = renderHook(() => useApiKeyPermissionListScreen());
    await act(async () => {
      await result.current.onDelete('akp-1');
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('maps notice query value and clears the param', async () => {
    mockParams = { notice: 'accessDenied' };

    const { result } = renderHook(() => useApiKeyPermissionListScreen());
    await waitFor(() => {
      expect(result.current.noticeMessage).toBe('apiKeyPermission.list.noticeAccessDenied');
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/api-key-permissions');
  });
});

