/**
 * useTenantFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useTenantFormScreen = require('@platform/screens/settings/TenantFormScreen/useTenantFormScreen').default;

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
  useTenant: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const { useNetwork, useTenant, useTenantAccess } = require('@hooks');

describe('useTenantFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};

    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      canCreateTenant: true,
      canEditTenant: true,
      tenantId: null,
      isResolved: true,
    });
    useTenant.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('tenant-scoped admin cannot create tenant and is redirected to tenants list', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      canCreateTenant: false,
      canEditTenant: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useTenantFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/tenants');
    act(() => {
      result.current.setName('Acme');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('tenant-scoped admin can edit own tenant only', async () => {
    mockParams = { id: 'tenant-1' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      canCreateTenant: false,
      canEditTenant: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    mockUpdate.mockResolvedValue({ id: 'tenant-1' });

    const { result } = renderHook(() => useTenantFormScreen());

    expect(mockGet).toHaveBeenCalledWith('tenant-1');

    act(() => {
      result.current.setName('Tenant One');
      result.current.setSlug('tenant-one');
    });
    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('tenant-1', {
      name: 'Tenant One',
      slug: 'tenant-one',
      is_active: true,
    });
  });

  it('tenant-scoped admin is redirected when trying to edit another tenant', () => {
    mockParams = { id: 'tenant-2' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      canCreateTenant: false,
      canEditTenant: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useTenantFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/tenants/tenant-1/edit');
  });

  it('redirects unauthorized users to settings', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      canCreateTenant: false,
      canEditTenant: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useTenantFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('global admin create still works', async () => {
    mockCreate.mockResolvedValue({ id: 'tenant-1' });

    const { result } = renderHook(() => useTenantFormScreen());
    act(() => {
      result.current.setName('Acme');
      result.current.setSlug('acme');
    });
    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      name: 'Acme',
      slug: 'acme',
      is_active: true,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/tenants?notice=created');
  });
});
