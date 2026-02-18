/**
 * useRoleFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useRoleFormScreen = require('@platform/screens/settings/RoleFormScreen/useRoleFormScreen').default;

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
  useRole: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useI18n,
  useNetwork,
  useRole,
  useTenant,
  useFacility,
  useTenantAccess,
} = require('@hooks');

describe('useRoleFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useI18n.mockReturnValue({ t: (k) => k });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useRole.mockReturnValue({
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
      data: { items: [{ id: 'tenant-1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'facility-1', name: 'Facility 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
  });

  it('redirects users without role access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useRoleFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('prefills and locks tenant for tenant-scoped admins on create', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useRoleFormScreen());

    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.isTenantLocked).toBe(true);
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'role-1' };

    renderHook(() => useRoleFormScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('role-1');
  });

  it('redirects tenant-scoped admins when editing role from another tenant', () => {
    mockParams = { id: 'role-1' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRole.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: { id: 'role-1', tenant_id: 'tenant-2', name: 'Admin' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useRoleFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/roles?notice=accessDenied');
  });

  it('allows create without facility_id and submits backend-aligned payload', async () => {
    mockCreate.mockResolvedValue({ id: 'role-1' });
    const { result } = renderHook(() => useRoleFormScreen());

    act(() => {
      result.current.setTenantId(' tenant-1 ');
      result.current.setName('  Nurse  ');
      result.current.setDescription('');
      result.current.setFacilityId('');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 'tenant-1',
      name: 'Nurse',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/roles?notice=created');
  });

  it('submits update payload with nullable facility_id when cleared', async () => {
    mockParams = { id: 'role-1' };
    mockUpdate.mockResolvedValue({ id: 'role-1' });
    useRole.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'role-1',
        tenant_id: 'tenant-1',
        facility_id: 'facility-1',
        name: 'Old Role',
        description: 'old',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useRoleFormScreen());

    act(() => {
      result.current.setName(' Updated Role ');
      result.current.setDescription('');
      result.current.setFacilityId('');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('role-1', {
      name: 'Updated Role',
      description: null,
      facility_id: null,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/roles?notice=updated');
  });

  it('flags validation when name exceeds backend max length', () => {
    const { result } = renderHook(() => useRoleFormScreen());

    act(() => {
      result.current.setTenantId('tenant-1');
      result.current.setName('a'.repeat(121));
    });

    expect(result.current.nameError).toBe('role.form.nameTooLong');
    expect(result.current.isSubmitDisabled).toBe(true);
  });

  it('uses capped numeric list limits for tenant and facility lookups', () => {
    const { result } = renderHook(() => useRoleFormScreen());

    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });

    act(() => {
      result.current.setTenantId('tenant-1');
    });

    expect(mockListFacilities).toHaveBeenLastCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 'tenant-1',
    });
  });

  it('retries tenant and facility lookups with capped pagination', () => {
    const { result } = renderHook(() => useRoleFormScreen());

    act(() => {
      result.current.onRetryTenants();
    });

    expect(mockListTenants).toHaveBeenLastCalledWith({ page: 1, limit: 100 });

    act(() => {
      result.current.setTenantId('tenant-1');
    });

    act(() => {
      result.current.onRetryFacilities();
    });

    expect(mockListFacilities).toHaveBeenLastCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 'tenant-1',
    });
  });
});
