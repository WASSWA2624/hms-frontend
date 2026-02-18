/**
 * useUserFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useUserFormScreen = require('@platform/screens/settings/UserFormScreen/useUserFormScreen').default;

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
  useUser: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useI18n,
  useNetwork,
  useUser,
  useTenant,
  useFacility,
  useTenantAccess,
} = require('@hooks');

describe('useUserFormScreen', () => {
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
    useUser.mockReturnValue({
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
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
  });

  it('returns initial create state', () => {
    const { result } = renderHook(() => useUserFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.email).toBe('');
    expect(result.current.phone).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.status).toBe('ACTIVE');
    expect(result.current.user).toBeNull();
  });

  it('loads tenants and facilities with capped limits', () => {
    const { result } = renderHook(() => useUserFormScreen());
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });

    act(() => {
      result.current.setTenantId('tenant-1');
    });
    expect(mockListFacilities).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 'tenant-1',
    });
  });

  it('hydrates edit mode and fetches detail by id', () => {
    mockParams = { id: 'uid-1' };
    useUser.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'uid-1',
        email: 'user@acme.org',
        phone: '+15551234567',
        status: 'INACTIVE',
        tenant_id: 'tenant-1',
        facility_id: 'facility-1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserFormScreen());
    expect(mockGet).toHaveBeenCalledWith('uid-1');
    expect(result.current.email).toBe('user@acme.org');
    expect(result.current.phone).toBe('+15551234567');
    expect(result.current.status).toBe('INACTIVE');
  });

  it('submits create payload and navigates with created notice', async () => {
    mockCreate.mockResolvedValue({ id: 'uid-1' });
    const { result } = renderHook(() => useUserFormScreen());

    act(() => {
      result.current.setTenantId(' tenant-1 ');
      result.current.setFacilityId(' facility-1 ');
      result.current.setEmail(' user@acme.org ');
      result.current.setPhone(' +15551234567 ');
      result.current.setPassword(' secret123 ');
      result.current.setStatus('ACTIVE');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 'tenant-1',
      facility_id: 'facility-1',
      email: 'user@acme.org',
      phone: '+15551234567',
      status: 'ACTIVE',
      password: 'secret123',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/users?notice=created');
  });

  it('submits edit payload and clears optional values when blank', async () => {
    mockParams = { id: 'uid-1' };
    mockUpdate.mockResolvedValue({ id: 'uid-1' });
    const { result } = renderHook(() => useUserFormScreen());

    act(() => {
      result.current.setEmail('user@acme.org');
      result.current.setPhone('');
      result.current.setFacilityId('');
      result.current.setStatus('SUSPENDED');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('uid-1', {
      email: 'user@acme.org',
      status: 'SUSPENDED',
      phone: null,
      facility_id: null,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/users?notice=updated');
  });

  it('builds readable tenant display labels', () => {
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-1', name: 'Acme Tenant' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });

    const { result } = renderHook(() => useUserFormScreen());
    act(() => {
      result.current.setTenantId('tenant-1');
    });

    expect(result.current.tenantDisplayLabel).toBe('Acme Tenant');
  });
});
