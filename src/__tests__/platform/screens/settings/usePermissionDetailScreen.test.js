/**
 * usePermissionDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const usePermissionDetailScreen = require('@platform/screens/settings/PermissionDetailScreen/usePermissionDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
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
  useLocalSearchParams: () => ({ id: 'pid-1' }),
}));

const { usePermission, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('usePermissionDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    usePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'pid-1', name: 'Test Permission', tenant_id: 'tenant-1' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('redirects users without permission access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => usePermissionDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('returns permission, handlers, and state', () => {
    const { result } = renderHook(() => usePermissionDetailScreen());

    expect(result.current.permission).toEqual({
      id: 'pid-1',
      name: 'Test Permission',
      tenant_id: 'tenant-1',
    });
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
    expect(result.current.canViewTechnicalIds).toBe(true);
  });

  it('hides technical IDs for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => usePermissionDetailScreen());

    expect(result.current.canViewTechnicalIds).toBe(false);
  });

  it('calls get on mount with id', () => {
    renderHook(() => usePermissionDetailScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('pid-1');
  });

  it('redirects tenant-scoped users when permission tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    usePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'pid-1', tenant_id: 'tenant-2', name: 'Permission' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => usePermissionDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/permissions?notice=accessDenied');
  });

  it('blocks edit and delete handlers for out-of-scope tenant-scoped permissions', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    usePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'pid-1', tenant_id: 'tenant-2', name: 'Permission' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePermissionDetailScreen());

    act(() => {
      result.current.onEdit();
    });

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockPush).not.toHaveBeenCalledWith('/settings/permissions/pid-1/edit');
    expect(mockRemove).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/settings/permissions?notice=accessDenied');
  });

  it('blocks delete handler for tenant-scoped users when permission record is missing', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    usePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePermissionDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/settings/permissions?notice=accessDenied');
  });

  it('redirects to list with accessDenied when backend returns forbidden', () => {
    usePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'FORBIDDEN',
      reset: mockReset,
    });

    renderHook(() => usePermissionDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/permissions?notice=accessDenied');
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => usePermissionDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();

    act(() => {
      result.current.onRetry();
    });

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('pid-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => usePermissionDetailScreen());

    act(() => {
      result.current.onBack();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/permissions');
  });

  it('onEdit pushes edit route when id available', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => usePermissionDetailScreen());

    act(() => {
      result.current.onEdit();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/permissions/pid-1/edit');
  });

  it('onDelete calls remove then navigates with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'pid-1' });
    mockPush.mockClear();
    const { result } = renderHook(() => usePermissionDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).toHaveBeenCalledWith('pid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/permissions?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'pid-1' });
    const { result } = renderHook(() => usePermissionDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/permissions?notice=queued');
  });

  it('onDelete does not navigate when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => usePermissionDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).toHaveBeenCalledWith('pid-1');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => usePermissionDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).toHaveBeenCalledWith('pid-1');
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => usePermissionDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles null permission when data is null', () => {
    usePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => usePermissionDetailScreen());

    expect(result.current.permission).toBeNull();
  });

  it('handles null permission when data is array', () => {
    usePermission.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => usePermissionDetailScreen());

    expect(result.current.permission).toBeNull();
  });
});
