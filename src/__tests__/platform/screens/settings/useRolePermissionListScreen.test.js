/**
 * useRolePermissionListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useRolePermissionListScreen = require('@platform/screens/settings/RolePermissionListScreen/useRolePermissionListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useAuth: jest.fn(() => ({ user: { id: 'user-1', email: 'test@example.com' } })),
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useRolePermission: jest.fn(),
  useRole: jest.fn(),
  usePermission: jest.fn(),
  useTenantAccess: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => null),
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

const {
  useRolePermission,
  useRole,
  usePermission,
  useNetwork,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');
const originalConsoleError = console.error;
let consoleErrorSpy;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
    const [message] = args;
    if (typeof message === 'string' && message.includes('not wrapped in act')) {
      return;
    }
    originalConsoleError(...args);
  });
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

describe('useRolePermissionListScreen', () => {
  const mockListRolePermissions = jest.fn();
  const mockRemoveRolePermission = jest.fn();
  const mockResetRolePermissions = jest.fn();
  const mockListRoles = jest.fn();
  const mockResetRoles = jest.fn();
  const mockListPermissions = jest.fn();
  const mockResetPermissions = jest.fn();

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
    useRolePermission.mockReturnValue({
      list: mockListRolePermissions,
      remove: mockRemoveRolePermission,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRolePermissions,
    });
    useRole.mockReturnValue({
      list: mockListRoles,
      data: { items: [{ id: 'role-1', name: 'Admin' }] },
      reset: mockResetRoles,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'permission-1', name: 'Manage users' }] },
      reset: mockResetPermissions,
    });
  });

  it('returns list state and core handlers', () => {
    const { result } = renderHook(() => useRolePermissionListScreen());

    expect(result.current.items).toEqual([]);
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onItemPress).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.resolveRoleLabel).toBe('function');
  });

  it('fetches role-permissions and reference data with numeric, capped params', () => {
    renderHook(() => useRolePermissionListScreen());

    expect(mockResetRolePermissions).toHaveBeenCalled();
    expect(mockResetRoles).toHaveBeenCalled();
    expect(mockResetPermissions).toHaveBeenCalled();

    expect(mockListRolePermissions).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListRoles).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 100 });

    const [listParams] = mockListRolePermissions.mock.calls[0];
    const [rolesParams] = mockListRoles.mock.calls[0];
    const [permissionsParams] = mockListPermissions.mock.calls[0];
    [listParams, rolesParams, permissionsParams].forEach((params) => {
      expect(typeof params.page).toBe('number');
      expect(typeof params.limit).toBe('number');
      expect(params.limit).toBeLessThanOrEqual(100);
    });
  });

  it('scopes list and references to tenant for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-scoped',
      isResolved: true,
    });

    renderHook(() => useRolePermissionListScreen());

    expect(mockListRolePermissions).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 'tenant-scoped',
    });
    expect(mockListRoles).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 'tenant-scoped',
    });
    expect(mockListPermissions).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 'tenant-scoped',
    });
  });

  it('does not fetch while offline', () => {
    useNetwork.mockReturnValue({ isOffline: true });
    renderHook(() => useRolePermissionListScreen());
    expect(mockListRolePermissions).not.toHaveBeenCalled();
    expect(mockListRoles).not.toHaveBeenCalled();
    expect(mockListPermissions).not.toHaveBeenCalled();
  });

  it('redirects to settings when tenant-scoped admin has no tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: '',
      isResolved: true,
    });

    renderHook(() => useRolePermissionListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('onRetry refreshes list with bounded params', () => {
    const { result } = renderHook(() => useRolePermissionListScreen());
    mockListRolePermissions.mockClear();
    mockResetRolePermissions.mockClear();

    result.current.onRetry();

    expect(mockResetRolePermissions).toHaveBeenCalled();
    expect(mockListRolePermissions).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('onItemPress denies tenant-scoped access when target record is unknown', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRolePermission.mockReturnValue({
      list: mockListRolePermissions,
      remove: mockRemoveRolePermission,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRolePermissions,
    });

    const { result } = renderHook(() => useRolePermissionListScreen());
    result.current.onItemPress('missing-id');
    expect(mockPush).toHaveBeenCalledWith('/settings/role-permissions?notice=accessDenied');
  });

  it('onItemPress navigates to detail when target is allowed', () => {
    useRolePermission.mockReturnValue({
      list: mockListRolePermissions,
      remove: mockRemoveRolePermission,
      data: { items: [{ id: 'rp-1', tenant_id: 'tenant-1', role_id: 'role-1', permission_id: 'permission-1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRolePermissions,
    });

    const { result } = renderHook(() => useRolePermissionListScreen());
    result.current.onItemPress('rp-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/role-permissions/rp-1');
  });

  it('onDelete blocks tenant-scoped deletion when target record is unknown', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useRolePermissionListScreen());
    await act(async () => {
      await result.current.onDelete('missing-id');
    });

    expect(mockRemoveRolePermission).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/settings/role-permissions?notice=accessDenied');
  });

  it('onDelete removes and sets queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useRolePermission.mockReturnValue({
      list: mockListRolePermissions,
      remove: mockRemoveRolePermission,
      data: {
        items: [{ id: 'rp-1', tenant_id: 'tenant-1', role_id: 'role-1', permission_id: 'permission-1' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockResetRolePermissions,
    });
    mockRemoveRolePermission.mockResolvedValue({ id: 'rp-1' });

    const { result } = renderHook(() => useRolePermissionListScreen());
    await act(async () => {
      await result.current.onDelete('rp-1');
    });

    expect(mockRemoveRolePermission).toHaveBeenCalledWith('rp-1');
    expect(result.current.noticeMessage).toBe('rolePermission.list.noticeQueued');
  });

  it('onDelete respects confirmation prompt', async () => {
    confirmAction.mockReturnValueOnce(false);
    useRolePermission.mockReturnValue({
      list: mockListRolePermissions,
      remove: mockRemoveRolePermission,
      data: {
        items: [{ id: 'rp-1', tenant_id: 'tenant-1', role_id: 'role-1', permission_id: 'permission-1' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockResetRolePermissions,
    });

    const { result } = renderHook(() => useRolePermissionListScreen());
    await act(async () => {
      await result.current.onDelete('rp-1');
    });

    expect(mockRemoveRolePermission).not.toHaveBeenCalled();
  });

  it('hides write actions when tenant settings access is denied', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: '',
      isResolved: true,
    });

    const { result } = renderHook(() => useRolePermissionListScreen());
    expect(result.current.onAdd).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('maps unknown errors to localized load error and clears notice query param', () => {
    mockParams = { notice: 'created' };
    useRolePermission.mockReturnValue({
      list: mockListRolePermissions,
      remove: mockRemoveRolePermission,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetRolePermissions,
    });

    const { result } = renderHook(() => useRolePermissionListScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('rolePermission.list.loadError');
    expect(result.current.noticeMessage).toBe('rolePermission.list.noticeCreated');
    expect(mockReplace).toHaveBeenCalledWith('/settings/role-permissions');
  });

  it('persists preferences through async storage contract', async () => {
    renderHook(() => useRolePermissionListScreen());
    expect(asyncStorage.getItem).toHaveBeenCalled();
    await act(async () => Promise.resolve());
    expect(asyncStorage.setItem).toHaveBeenCalled();
  });
});
