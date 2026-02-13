/**
 * useRolePermissionFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useRolePermissionFormScreen = require('@platform/screens/settings/RolePermissionFormScreen/useRolePermissionFormScreen').default;

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
  useRolePermission: jest.fn(),
  useRole: jest.fn(),
  usePermission: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useI18n,
  useNetwork,
  useRolePermission,
  useRole,
  usePermission,
  useTenantAccess,
} = require('@hooks');

describe('useRolePermissionFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListRoles = jest.fn();
  const mockResetRoles = jest.fn();
  const mockListPermissions = jest.fn();
  const mockResetPermissions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useI18n.mockReturnValue({ t: (k) => k });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRolePermission.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useRole.mockReturnValue({
      list: mockListRoles,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRoles,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetPermissions,
    });
  });

  it('returns initial state for create', () => {
    const { result } = renderHook(() => useRolePermissionFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.roleId).toBe('');
    expect(result.current.permissionId).toBe('');
    expect(result.current.rolePermission).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'rp-1' };
    renderHook(() => useRolePermissionFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('rp-1');
  });

  it('lists roles and permissions on mount', () => {
    renderHook(() => useRolePermissionFormScreen());
    expect(mockResetRoles).toHaveBeenCalled();
    expect(mockListRoles).toHaveBeenCalledWith({ page: 1, limit: 200 });
    expect(mockResetPermissions).toHaveBeenCalled();
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 200 });
  });

  it('hydrates form state from role permission data', () => {
    mockParams = { id: 'rp-1' };
    useRolePermission.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: { role_id: 'r1', permission_id: 'p1' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useRolePermissionFormScreen());
    expect(result.current.roleId).toBe('r1');
    expect(result.current.permissionId).toBe('p1');
  });

  it('uses fallback error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'rolePermission.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    useRolePermission.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useRolePermissionFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('uses fallback role error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'rolePermission.form.roleLoadErrorMessage' ? 'Role fallback' : k),
    });
    useRole.mockReturnValue({
      list: mockListRoles,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetRoles,
    });
    const { result } = renderHook(() => useRolePermissionFormScreen());
    expect(result.current.roleListError).toBe(true);
    expect(result.current.roleErrorMessage).toBe('Role fallback');
  });

  it('uses fallback permission error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'rolePermission.form.permissionLoadErrorMessage' ? 'Permission fallback' : k),
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetPermissions,
    });
    const { result } = renderHook(() => useRolePermissionFormScreen());
    expect(result.current.permissionListError).toBe(true);
    expect(result.current.permissionErrorMessage).toBe('Permission fallback');
  });

  it('submits create payload and navigates on success', async () => {
    useRole.mockReturnValue({
      list: mockListRoles,
      data: { items: [{ id: 'r1', name: 'Role 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRoles,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'p1', name: 'Permission 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetPermissions,
    });
    mockCreate.mockResolvedValue({ id: 'rp-1' });
    const { result } = renderHook(() => useRolePermissionFormScreen());
    act(() => {
      result.current.setRoleId(' r1 ');
      result.current.setPermissionId(' p1 ');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).toHaveBeenCalledWith({
      role_id: 'r1',
      permission_id: 'p1',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/role-permissions?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'rp-1' };
    mockUpdate.mockResolvedValue({ id: 'rp-1' });
    const { result } = renderHook(() => useRolePermissionFormScreen());
    act(() => {
      result.current.setRoleId('r2');
      result.current.setPermissionId('p2');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockUpdate).toHaveBeenCalledWith('rp-1', {
      role_id: 'r2',
      permission_id: 'p2',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/role-permissions?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useRole.mockReturnValue({
      list: mockListRoles,
      data: { items: [{ id: 'r1', name: 'Role 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRoles,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'p1', name: 'Permission 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetPermissions,
    });
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'rp-1' });
    const { result } = renderHook(() => useRolePermissionFormScreen());
    act(() => {
      result.current.setRoleId('r1');
      result.current.setPermissionId('p1');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/role-permissions?notice=queued');
  });

  it('does not navigate when create returns undefined', async () => {
    useRole.mockReturnValue({
      list: mockListRoles,
      data: { items: [{ id: 'r1', name: 'Role 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRoles,
    });
    usePermission.mockReturnValue({
      list: mockListPermissions,
      data: { items: [{ id: 'p1', name: 'Permission 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetPermissions,
    });
    mockCreate.mockResolvedValue(undefined);
    const { result } = renderHook(() => useRolePermissionFormScreen());
    act(() => {
      result.current.setRoleId('r1');
      result.current.setPermissionId('p1');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useRolePermissionFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useRolePermissionFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/role-permissions');
  });

  it('onGoToRoles navigates to roles list', () => {
    const { result } = renderHook(() => useRolePermissionFormScreen());
    result.current.onGoToRoles();
    expect(mockPush).toHaveBeenCalledWith('/settings/roles');
  });

  it('onGoToPermissions navigates to permissions list', () => {
    const { result } = renderHook(() => useRolePermissionFormScreen());
    result.current.onGoToPermissions();
    expect(mockPush).toHaveBeenCalledWith('/settings/permissions');
  });

  it('onRetryRoles reloads roles list', () => {
    const { result } = renderHook(() => useRolePermissionFormScreen());
    result.current.onRetryRoles();
    expect(mockResetRoles).toHaveBeenCalled();
    expect(mockListRoles).toHaveBeenCalledWith({ page: 1, limit: 200 });
  });

  it('onRetryPermissions reloads permissions list', () => {
    const { result } = renderHook(() => useRolePermissionFormScreen());
    result.current.onRetryPermissions();
    expect(mockResetPermissions).toHaveBeenCalled();
    expect(mockListPermissions).toHaveBeenCalledWith({ page: 1, limit: 200 });
  });
});

