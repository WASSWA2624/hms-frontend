/**
 * useUserRoleDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useNetwork: jest.fn(),
  useUserRole: jest.fn(),
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
  useLocalSearchParams: () => ({ id: 'ur-1' }),
}));

const useUserRoleDetailScreen = require('@platform/screens/settings/UserRoleDetailScreen/useUserRoleDetailScreen').default;
const { useI18n, useNetwork, useUserRole, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useUserRoleDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserRole.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'ur-1',
        user_name: 'Alice',
        role_name: 'Admin',
        tenant_name: 'North',
        facility_name: 'Main',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('loads detail on mount and exposes handlers', () => {
    const { result } = renderHook(() => useUserRoleDetailScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('ur-1');
    expect(result.current.userRole).toBeTruthy();
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('masks technical ids for standard users', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserRole.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'ur-1',
        user_id: 'user-raw',
        role_id: 'role-raw',
        tenant_id: 'tenant-raw',
        facility_id: 'facility-raw',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserRoleDetailScreen());
    expect(result.current.userLabel).toBe('userRole.detail.currentUser');
    expect(result.current.roleLabel).toBe('userRole.detail.currentRole');
    expect(result.current.tenantLabel).toBe('userRole.detail.currentTenant');
    expect(result.current.facilityLabel).toBe('userRole.detail.currentFacility');
  });

  it('shows technical ids for super admins when readable labels are missing', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserRole.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'ur-1',
        user_id: 'user-raw',
        role_id: 'role-raw',
        tenant_id: 'tenant-raw',
        facility_id: 'facility-raw',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserRoleDetailScreen());
    expect(result.current.userLabel).toBe('user-raw');
    expect(result.current.roleLabel).toBe('role-raw');
    expect(result.current.tenantLabel).toBe('tenant-raw');
    expect(result.current.facilityLabel).toBe('facility-raw');
  });

  it('blocks tenant-scoped access to records outside tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserRole.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'ur-1', tenant_id: 'tenant-2' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useUserRoleDetailScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings/user-roles?notice=accessDenied');
  });

  it('navigates with queued notice after delete when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'ur-1' });

    const { result } = renderHook(() => useUserRoleDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).toHaveBeenCalledWith('ur-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/user-roles?notice=queued');
  });

  it('does not remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useUserRoleDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });
});

