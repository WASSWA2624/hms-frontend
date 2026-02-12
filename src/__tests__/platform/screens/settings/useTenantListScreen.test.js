/**
 * useTenantListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useTenantListScreen = require('@platform/screens/settings/TenantListScreen/useTenantListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

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

describe('useTenantListScreen', () => {
  const mockList = jest.fn();
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      canCreateTenant: true,
      canDeleteTenant: true,
      tenantId: null,
      isResolved: true,
    });
    useTenant.mockReturnValue({
      list: mockList,
      get: mockGet,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('global admin path enables list/create/delete', () => {
    const { result } = renderHook(() => useTenantListScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('tenant-scoped admin path loads own tenant only and hides create/delete actions', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      canCreateTenant: false,
      canDeleteTenant: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useTenant.mockReturnValue({
      list: mockList,
      get: mockGet,
      remove: mockRemove,
      data: { id: 'tenant-1', name: 'Acme' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useTenantListScreen());

    expect(mockGet).toHaveBeenCalledWith('tenant-1');
    expect(mockList).not.toHaveBeenCalled();
    expect(result.current.items).toEqual([{ id: 'tenant-1', name: 'Acme' }]);
    expect(result.current.onAdd).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('tenant-scoped search is local against own tenant', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      canCreateTenant: false,
      canDeleteTenant: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useTenant.mockReturnValue({
      list: mockList,
      get: mockGet,
      remove: mockRemove,
      data: { id: 'tenant-1', name: 'Acme Hospital', slug: 'acme' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useTenantListScreen());

    act(() => {
      result.current.onSearch('zzz');
    });
    expect(result.current.items).toEqual([]);

    act(() => {
      result.current.onSearch('acme');
    });
    expect(result.current.items).toEqual([{ id: 'tenant-1', name: 'Acme Hospital', slug: 'acme' }]);
  });

  it('redirects unauthorized users to settings after roles resolve', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      canCreateTenant: false,
      canDeleteTenant: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useTenantListScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('onDelete is blocked when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    mockRemove.mockResolvedValue({ id: 'tenant-1' });

    const { result } = renderHook(() => useTenantListScreen());
    await act(async () => {
      await result.current.onDelete('tenant-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
