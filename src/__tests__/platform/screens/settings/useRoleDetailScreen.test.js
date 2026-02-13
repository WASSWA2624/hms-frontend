/**
 * useRoleDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useRoleDetailScreen = require('@platform/screens/settings/RoleDetailScreen/useRoleDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = { id: 'role-1' };

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useRole: jest.fn(),
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

const { useRole, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useRoleDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'role-1' };
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useRole.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'role-1', tenant_id: 'tenant-1', name: 'Admin' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns role state and handlers', () => {
    const { result } = renderHook(() => useRoleDetailScreen());

    expect(result.current.role).toEqual({
      id: 'role-1',
      tenant_id: 'tenant-1',
      name: 'Admin',
    });
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
  });

  it('redirects users without role access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useRoleDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('redirects tenant-scoped users without tenant id', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useRoleDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users when role tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRole.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'role-1', tenant_id: 'tenant-2', name: 'Admin' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useRoleDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/roles?notice=accessDenied');
  });

  it('redirects to list with accessDenied when backend returns forbidden', () => {
    useRole.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'FORBIDDEN',
      reset: mockReset,
    });

    renderHook(() => useRoleDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/roles?notice=accessDenied');
  });

  it('calls get on mount with role id', () => {
    renderHook(() => useRoleDetailScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('role-1');
  });

  it('onEdit navigates to edit route', () => {
    const { result } = renderHook(() => useRoleDetailScreen());

    result.current.onEdit();

    expect(mockPush).toHaveBeenCalledWith('/settings/roles/role-1/edit');
  });

  it('onDelete navigates with deleted notice', async () => {
    mockRemove.mockResolvedValue({ id: 'role-1' });
    const { result } = renderHook(() => useRoleDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).toHaveBeenCalledWith('role-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/roles?notice=deleted');
  });

  it('onDelete does not execute when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useRoleDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
