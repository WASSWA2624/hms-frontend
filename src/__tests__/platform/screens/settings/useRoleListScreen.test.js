/**
 * useRoleListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useRoleListScreen = require('@platform/screens/settings/RoleListScreen/useRoleListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

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

describe('useRoleListScreen', () => {
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
    useRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns items, handlers, and state', () => {
    const { result } = renderHook(() => useRoleListScreen());

    expect(result.current.items).toEqual([]);
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onItemPress).toBe('function');
  });

  it('redirects users without role access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useRoleListScreen());

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

    renderHook(() => useRoleListScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('calls list with tenant scope for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useRoleListScreen());

    expect(mockList).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      tenant_id: 'tenant-1',
    });
  });

  it('handles accessDenied notice and clears query param', () => {
    mockParams = { notice: 'accessDenied' };

    const { result } = renderHook(() => useRoleListScreen());

    expect(result.current.noticeMessage).toBe('role.list.noticeAccessDenied');
    expect(mockReplace).toHaveBeenCalledWith('/settings/roles');
  });

  it('shows access-denied notice on forbidden API response', () => {
    useRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: 'FORBIDDEN',
      reset: mockReset,
    });

    const { result } = renderHook(() => useRoleListScreen());

    expect(result.current.noticeMessage).toBe('role.list.noticeAccessDenied');
  });

  it('onDelete calls remove then refreshes list', async () => {
    mockRemove.mockResolvedValue({ id: 'role-1' });
    const { result } = renderHook(() => useRoleListScreen());
    mockReset.mockClear();
    mockList.mockClear();

    await act(async () => {
      await result.current.onDelete('role-1');
    });

    expect(mockRemove).toHaveBeenCalledWith('role-1');
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onDelete does not execute when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useRoleListScreen());

    await act(async () => {
      await result.current.onDelete('role-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
