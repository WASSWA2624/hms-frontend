/**
 * useTenantDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useTenantDetailScreen = require('@platform/screens/settings/TenantDetailScreen/useTenantDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = { id: 'tenant-1' };

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(),
  useTenant: jest.fn(),
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

const { useTenant, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useTenantDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'tenant-1' };

    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      canEditTenant: true,
      canDeleteTenant: true,
      canAssignTenantAdmins: true,
      tenantId: null,
      isResolved: true,
    });
    useTenant.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'tenant-1', name: 'Acme' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('global admin can fetch target tenant and assign tenant admin', () => {
    const { result } = renderHook(() => useTenantDetailScreen());

    expect(mockGet).toHaveBeenCalledWith('tenant-1');
    expect(typeof result.current.onAssignTenantAdmin).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');

    act(() => {
      result.current.onAssignTenantAdmin();
    });
    expect(mockPush).toHaveBeenCalledWith(
      '/settings/user-roles/create?tenantId=tenant-1&roleName=TENANT_ADMIN'
    );
  });

  it('tenant-scoped admin is locked to own tenant and cannot delete/assign', () => {
    mockParams = { id: 'tenant-other' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      canEditTenant: true,
      canDeleteTenant: false,
      canAssignTenantAdmins: false,
      tenantId: 'tenant-own',
      isResolved: true,
    });

    const { result } = renderHook(() => useTenantDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/tenants/tenant-own');
    expect(mockGet).toHaveBeenCalledWith('tenant-own');
    expect(typeof result.current.onEdit).toBe('function');
    expect(result.current.onDelete).toBeUndefined();
    expect(result.current.onAssignTenantAdmin).toBeUndefined();
  });

  it('redirects unauthorized users to settings', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      canEditTenant: false,
      canDeleteTenant: false,
      canAssignTenantAdmins: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useTenantDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('uses tenant detail fallback message for unknown and network failures', () => {
    useTenant.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
      reset: mockReset,
    });

    const { result } = renderHook(() => useTenantDetailScreen());
    expect(result.current.errorMessage).toBe('tenant.detail.errorMessage');
  });

  it('deletes and redirects with notice for global admins', async () => {
    mockRemove.mockResolvedValue({ id: 'tenant-1' });

    const { result } = renderHook(() => useTenantDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).toHaveBeenCalledWith('tenant-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants?notice=deleted');
  });

  it('delete is cancelled when confirmation is declined', async () => {
    confirmAction.mockReturnValueOnce(false);

    const { result } = renderHook(() => useTenantDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
