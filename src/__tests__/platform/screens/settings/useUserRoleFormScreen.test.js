/**
 * useUserRoleFormScreen Hook Tests
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
  useI18n: jest.fn(),
  useNetwork: jest.fn(),
  useTenantAccess: jest.fn(),
  useUserRole: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useUser: jest.fn(),
  useRole: jest.fn(),
}));

const useUserRoleFormScreen = require('@platform/screens/settings/UserRoleFormScreen/useUserRoleFormScreen').default;
const {
  useI18n,
  useNetwork,
  useTenantAccess,
  useUserRole,
  useTenant,
  useFacility,
  useUser,
  useRole,
} = require('@hooks');

describe('useUserRoleFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();

  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();
  const mockListRoles = jest.fn();
  const mockResetRoles = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};

    useI18n.mockReturnValue({
      t: (key, values) => (values?.index ? `${key}.${values.index}` : key),
    });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    useUserRole.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-1', name: 'Tenant One' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'facility-1', name: 'Facility One' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-1', name: 'Alice' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });
    useRole.mockReturnValue({
      list: mockListRoles,
      data: { items: [{ id: 'role-1', name: 'Admin' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRoles,
    });
  });

  it('uses capped numeric limit 100 for list and retry requests', () => {
    const { result } = renderHook(() => useUserRoleFormScreen());

    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });

    act(() => {
      result.current.setTenantId('tenant-1');
    });

    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListRoles).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });

    act(() => {
      result.current.onRetryTenants();
      result.current.onRetryFacilities();
      result.current.onRetryUsers();
      result.current.onRetryRoles();
    });

    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListRoles).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('masks raw ids in option labels for non-super users', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'facility-raw' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-raw' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });
    useRole.mockReturnValue({
      list: mockListRoles,
      data: { items: [{ id: 'role-raw' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRoles,
    });

    const { result } = renderHook(() => useUserRoleFormScreen());

    expect(result.current.tenantOptions[0].label).toBe('userRole.form.tenantOptionFallback.1');
    expect(result.current.userOptions[0].label).toBe('userRole.form.userOptionFallback.1');
    expect(result.current.roleOptions[0].label).toBe('userRole.form.roleOptionFallback.1');
    expect(result.current.facilityOptions[0].label).toBe('userRole.form.facilityOptionFallback.1');
  });

  it('keeps technical id fallback labels for super admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-raw' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'facility-raw' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-raw' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });
    useRole.mockReturnValue({
      list: mockListRoles,
      data: { items: [{ id: 'role-raw' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRoles,
    });

    const { result } = renderHook(() => useUserRoleFormScreen());

    expect(result.current.tenantOptions[0].label).toBe('tenant-raw');
    expect(result.current.userOptions[0].label).toBe('user-raw');
    expect(result.current.roleOptions[0].label).toBe('role-raw');
    expect(result.current.facilityOptions[0].label).toBe('facility-raw');
  });

  it('submits create payload with selected facility', async () => {
    mockCreate.mockResolvedValue({ id: 'ur-1' });

    const { result } = renderHook(() => useUserRoleFormScreen());
    act(() => {
      result.current.setTenantId('tenant-1');
      result.current.setUserId('user-1');
      result.current.setRoleId('role-1');
      result.current.setFacilityId('facility-1');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 'tenant-1',
      user_id: 'user-1',
      role_id: 'role-1',
      facility_id: 'facility-1',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/user-roles?notice=created');
  });

  it('submits edit payload and clears facility with null', async () => {
    mockParams = { id: 'ur-1' };
    useUserRole.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'ur-1',
        tenant_id: 'tenant-1',
        user_id: 'user-1',
        role_id: 'role-1',
        facility_id: 'facility-1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    mockUpdate.mockResolvedValue({ id: 'ur-1' });

    const { result } = renderHook(() => useUserRoleFormScreen());
    act(() => {
      result.current.setFacilityId('');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('ur-1', {
      tenant_id: 'tenant-1',
      user_id: 'user-1',
      role_id: 'role-1',
      facility_id: null,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/user-roles?notice=updated');
  });

  it('redirects unauthorized users out of the form', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useUserRoleFormScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });
});

