/**
 * useOauthAccountListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useOauthAccount: jest.fn(),
  useUser: jest.fn(),
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

const useOauthAccountListScreen = require('@platform/screens/settings/OauthAccountListScreen/useOauthAccountListScreen').default;
const {
  useI18n,
  useAuth,
  useNetwork,
  useOauthAccount,
  useUser,
  usePermission,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useOauthAccountListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();
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

    useOauthAccount.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [] },
      reset: mockResetUsers,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [] },
      reset: mockResetPermissions,
    });

    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  it('loads list and references with numeric params capped at 100', () => {
    renderHook(() => useOauthAccountListScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const [listParams] = mockList.mock.calls[0];
    expect(typeof listParams.page).toBe('number');
    expect(typeof listParams.limit).toBe('number');
    expect(mockResetUsers).toHaveBeenCalled();
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const [apiKeyParams] = mockListUsers.mock.calls[0];
    expect(typeof apiKeyParams.page).toBe('number');
    expect(typeof apiKeyParams.limit).toBe('number');
    expect(mockResetPermissions).toHaveBeenCalled();
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const [permissionParams] = mockListPermissions.mock.calls[0];
    expect(typeof permissionParams.page).toBe('number');
    expect(typeof permissionParams.limit).toBe('number');
  });

  it('applies tenant scope only to reference lookups', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useOauthAccountListScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('does not fetch list or references while offline', () => {
    useNetwork.mockReturnValue({ isOffline: true });

    renderHook(() => useOauthAccountListScreen());

    expect(mockReset).not.toHaveBeenCalled();
    expect(mockList).not.toHaveBeenCalled();
    expect(mockResetUsers).not.toHaveBeenCalled();
    expect(mockListUsers).not.toHaveBeenCalled();
    expect(mockResetPermissions).not.toHaveBeenCalled();
    expect(mockListPermissions).not.toHaveBeenCalled();
  });

  it('supports all-field and scoped search', () => {
    useOauthAccount.mockReturnValue({
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
    useUser.mockReturnValue({
      list: mockListUsers,
      data: {
        items: [
          { id: 'key-1', name: 'Clinical Integration', tenant_id: 'tenant-1' },
          { id: 'key-2', name: 'Billing Bridge', tenant_id: 'tenant-2' },
        ],
      },
      reset: mockResetUsers,
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

    const { result } = renderHook(() => useOauthAccountListScreen());

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
    useOauthAccount.mockReturnValue({
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
    useUser.mockReturnValue({
      list: mockListUsers,
      data: {
        items: [
          { id: 'key-1', name: 'Scoped Key', tenant_id: 'tenant-1' },
          { id: 'key-2', name: 'External Key', tenant_id: 'tenant-2' },
        ],
      },
      reset: mockResetUsers,
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

    const { result } = renderHook(() => useOauthAccountListScreen());
    expect(result.current.items.map((item) => item.id)).toEqual(['akp-1']);

    act(() => {
      result.current.onItemPress('akp-2');
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts?notice=accessDenied');
  });

  it('deletes record and refetches list', async () => {
    useOauthAccount.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{ id: 'akp-1', api_key_id: 'key-1', permission_id: 'perm-1' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'key-1', name: 'Scoped Key', tenant_id: 'tenant-1' }] },
      reset: mockResetUsers,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'perm-1', name: 'Scoped Permission', tenant_id: 'tenant-1' }] },
      reset: mockResetPermissions,
    });
    mockRemove.mockResolvedValue({ id: 'akp-1' });

    const { result } = renderHook(() => useOauthAccountListScreen());

    await act(async () => {
      await result.current.onDelete('akp-1');
    });

    expect(mockRemove).toHaveBeenCalledWith('akp-1');
    expect(mockList).toHaveBeenLastCalledWith({ page: 1, limit: 100 });
    expect(result.current.noticeMessage).toBe('oauthAccount.list.noticeDeleted');
  });

  it('does not delete when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    useOauthAccount.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{ id: 'akp-1', api_key_id: 'key-1', permission_id: 'perm-1' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'key-1', name: 'Scoped Key', tenant_id: 'tenant-1' }] },
      reset: mockResetUsers,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'perm-1', name: 'Scoped Permission', tenant_id: 'tenant-1' }] },
      reset: mockResetPermissions,
    });

    const { result } = renderHook(() => useOauthAccountListScreen());
    await act(async () => {
      await result.current.onDelete('akp-1');
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('maps notice query value and clears the param', async () => {
    mockParams = { notice: 'accessDenied' };

    const { result } = renderHook(() => useOauthAccountListScreen());
    await waitFor(() => {
      expect(result.current.noticeMessage).toBe('oauthAccount.list.noticeAccessDenied');
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts');
  });
});

