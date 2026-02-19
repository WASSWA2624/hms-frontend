/**
 * usePermissionListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const usePermissionListScreen = require('@platform/screens/settings/PermissionListScreen/usePermissionListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  usePermission: jest.fn(),
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

const { usePermission, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('usePermissionListScreen', () => {
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
    usePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('redirects users without permission access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => usePermissionListScreen());

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

    renderHook(() => usePermissionListScreen());

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

    renderHook(() => usePermissionListScreen());

    expect(mockList).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      tenant_id: 'tenant-1',
    });
  });

  it('returns items, handlers, and state', () => {
    const { result } = renderHook(() => usePermissionListScreen());

    expect(result.current.items).toEqual([]);
    expect(result.current.search).toBe('');
    expect(result.current.searchScope).toBe('all');
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onItemPress).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
    expect(typeof result.current.onSort).toBe('function');
  });

  it('calls list on mount', () => {
    renderHook(() => usePermissionListScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRetry calls fetchList', () => {
    const { result } = renderHook(() => usePermissionListScreen());
    mockReset.mockClear();
    mockList.mockClear();

    act(() => {
      result.current.onRetry();
    });

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onItemPress pushes route with id', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => usePermissionListScreen());

    act(() => {
      result.current.onItemPress('pid-1');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/permissions/pid-1');
  });

  it('onAdd pushes route to create', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => usePermissionListScreen());

    act(() => {
      result.current.onAdd();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/permissions/create');
  });

  it('shows access denied notice when API returns forbidden', () => {
    usePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: 'FORBIDDEN',
      reset: mockReset,
    });

    const { result } = renderHook(() => usePermissionListScreen());

    expect(result.current.noticeMessage).toBe('permission.list.noticeAccessDenied');
  });

  it('applies global and scoped search filters', () => {
    usePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'permission-1', name: 'roles.read', description: 'Read roles', tenant_name: 'Main Tenant' },
          { id: 'permission-2', name: 'billing.create', description: 'Create invoices', tenant_name: 'Branch Tenant' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePermissionListScreen());

    act(() => {
      result.current.onSearch('billing');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('permission-2');

    act(() => {
      result.current.onSearchScopeChange('tenant');
      result.current.onSearch('main');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('permission-1');
  });

  it('reports no-results state and clears search filters', () => {
    usePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'permission-1', name: 'roles.read', description: 'Read roles' },
          { id: 'permission-2', name: 'billing.create', description: 'Create invoices' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePermissionListScreen());

    act(() => {
      result.current.onSearch('missing permission');
    });

    expect(result.current.hasNoResults).toBe(true);
    expect(result.current.items).toHaveLength(0);

    act(() => {
      result.current.onClearSearchAndFilters();
    });

    expect(result.current.search).toBe('');
    expect(result.current.searchScope).toBe('all');
    expect(result.current.items).toHaveLength(2);
  });

  it('sorts by selected field and toggles direction', () => {
    usePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'permission-1', name: 'zeta', description: 'Zed' },
          { id: 'permission-2', name: 'alpha', description: 'Aye' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePermissionListScreen());

    expect(result.current.items.map((item) => item.name)).toEqual(['alpha', 'zeta']);

    act(() => {
      result.current.onSort('name');
    });

    expect(result.current.items.map((item) => item.name)).toEqual(['zeta', 'alpha']);
  });

  it('onDelete calls remove then fetchList', async () => {
    mockRemove.mockResolvedValue({ id: 'pid-1' });
    mockReset.mockClear();
    mockList.mockClear();
    const { result } = renderHook(() => usePermissionListScreen());

    await act(async () => {
      await result.current.onDelete('pid-1');
    });

    expect(mockRemove).toHaveBeenCalledWith('pid-1');
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onDelete sets queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'pid-1' });
    const { result } = renderHook(() => usePermissionListScreen());

    await act(async () => {
      await result.current.onDelete('pid-1');
    });

    expect(result.current.noticeMessage).toBe('permission.list.noticeQueued');
  });

  it('onDelete does not refetch when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => usePermissionListScreen());
    mockList.mockClear();

    await act(async () => {
      await result.current.onDelete('pid-1');
    });

    expect(mockRemove).toHaveBeenCalledWith('pid-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('onDelete calls stopPropagation when event provided', async () => {
    const stopPropagation = jest.fn();
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => usePermissionListScreen());

    await act(async () => {
      await result.current.onDelete('pid-1', { stopPropagation });
    });

    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onDelete does not execute when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => usePermissionListScreen());

    await act(async () => {
      await result.current.onDelete('pid-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles notice param and clears it', () => {
    mockParams = { notice: 'created' };
    const { result } = renderHook(() => usePermissionListScreen());

    expect(result.current.noticeMessage).toBe('permission.list.noticeCreated');
    expect(mockReplace).toHaveBeenCalledWith('/settings/permissions');
  });

  it('maps accessDenied notice and clears query param', () => {
    mockParams = { notice: 'accessDenied' };

    const { result } = renderHook(() => usePermissionListScreen());

    expect(result.current.noticeMessage).toBe('permission.list.noticeAccessDenied');
    expect(mockReplace).toHaveBeenCalledWith('/settings/permissions');
  });
});
