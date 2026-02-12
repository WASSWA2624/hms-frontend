/**
 * useFacilityListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useFacilityListScreen = require('@platform/screens/settings/FacilityListScreen/useFacilityListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useFacility: jest.fn(),
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

const { useFacility, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useFacilityListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useFacility.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns handlers for global admins', () => {
    const { result } = renderHook(() => useFacilityListScreen());
    expect(result.current.items).toEqual([]);
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onSearch).toBe('function');
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('loads facilities on mount for global admins', () => {
    renderHook(() => useFacilityListScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('loads facilities scoped to tenant for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useFacilityListScreen());

    expect(mockList).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      tenant_id: 'tenant-1',
    });
  });

  it('search keeps tenant filter for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    const { result } = renderHook(() => useFacilityListScreen());
    mockReset.mockClear();
    mockList.mockClear();

    act(() => {
      result.current.onSearch('  clinic ');
    });

    expect(mockList).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      search: 'clinic',
      tenant_id: 'tenant-1',
    });
  });

  it('redirects unauthorized users to settings', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useFacilityListScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onAdd).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('redirects tenant-scoped users without tenant id', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useFacilityListScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('maps accessDenied notice and clears query param', () => {
    mockParams = { notice: 'accessDenied' };

    const { result } = renderHook(() => useFacilityListScreen());

    expect(result.current.noticeMessage).toBe('facility.list.noticeAccessDenied');
    expect(mockReplace).toHaveBeenCalledWith('/settings/facilities');
  });

  it('onRetry uses current search term', () => {
    const { result } = renderHook(() => useFacilityListScreen());

    act(() => {
      result.current.onSearch('facility');
    });
    mockReset.mockClear();
    mockList.mockClear();

    result.current.onRetry();

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20, search: 'facility' });
  });

  it('onDelete calls remove then fetches list', async () => {
    mockRemove.mockResolvedValue({ id: 'fid-1' });
    const { result } = renderHook(() => useFacilityListScreen());
    mockReset.mockClear();
    mockList.mockClear();

    await act(async () => {
      await result.current.onDelete('fid-1');
    });

    expect(mockRemove).toHaveBeenCalledWith('fid-1');
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useFacilityListScreen());

    await act(async () => {
      await result.current.onDelete('fid-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('onDelete sets queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'fid-1' });
    const { result } = renderHook(() => useFacilityListScreen());

    await act(async () => {
      await result.current.onDelete('fid-1');
    });

    expect(result.current.noticeMessage).toBe('facility.list.noticeQueued');
  });
});
