/**
 * usePermissionListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (key) => key })),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  usePermission: jest.fn(),
  useTenantAccess: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
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

const usePermissionListScreen = require('@platform/screens/settings/PermissionListScreen/usePermissionListScreen').default;
const { useAuth, useNetwork, usePermission, useTenantAccess } = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('usePermissionListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  const renderUsePermissionListScreen = async () => {
    const rendered = renderHook(() => usePermissionListScreen());
    await act(async () => {
      await Promise.resolve();
    });
    return rendered;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useAuth.mockReturnValue({ user: { id: 'user-1' } });
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
    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  it('global admin path enables list actions and uses capped numeric pagination', async () => {
    const { result } = await renderUsePermissionListScreen();

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(result.current.canViewTechnicalIds).toBe(true);
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');

    await waitFor(() => {
      expect(asyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('tenant-scoped admins fetch and view only permissions in tenant scope', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    usePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'permission-1', tenant_id: 'tenant-1', name: 'roles.read' },
          { id: 'permission-2', tenant_id: 'tenant-2', name: 'billing.create' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUsePermissionListScreen();

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(result.current.items.map((item) => item.id)).toEqual(['permission-1']);
    expect(result.current.canViewTechnicalIds).toBe(false);
  });

  it('supports advanced filters with OR grouping', async () => {
    usePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'permission-1', tenant_id: 'tenant-1', name: 'roles.read', description: 'Read roles' },
          { id: 'permission-2', tenant_id: 'tenant-1', name: 'billing.create', description: 'Create invoices' },
          { id: 'permission-3', tenant_id: 'tenant-1', name: 'roles.write', description: 'Write roles' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUsePermissionListScreen();

    const firstFilterId = result.current.filters[0].id;

    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'name');
      result.current.onFilterOperatorChange(firstFilterId, 'equals');
      result.current.onFilterValueChange(firstFilterId, 'billing.create');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;

    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'description');
      result.current.onFilterOperatorChange(secondFilterId, 'contains');
      result.current.onFilterValueChange(secondFilterId, 'write');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((item) => item.id)).toEqual(['permission-2', 'permission-3']);
  });

  it('loads and persists table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      columnOrder: ['tenant', 'name', 'description'],
      visibleColumns: ['tenant', 'name'],
      searchScope: 'tenant',
      filterLogic: 'OR',
      filters: [{ id: 'stored-filter', field: 'tenant', operator: 'contains', value: 'acme' }],
      sortField: 'tenant',
      sortDirection: 'desc',
    });

    const { result } = await renderUsePermissionListScreen();

    await waitFor(() => {
      expect(result.current.pageSize).toBe(20);
      expect(result.current.density).toBe('comfortable');
      expect(result.current.searchScope).toBe('tenant');
      expect(result.current.sortField).toBe('tenant');
      expect(result.current.sortDirection).toBe('desc');
    });

    act(() => {
      result.current.onDensityChange('compact');
    });

    await waitFor(() => {
      expect(asyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('redirects unauthorized users to settings', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    await renderUsePermissionListScreen();

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users without tenant context', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    await renderUsePermissionListScreen();

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('maps notice query and clears list query params', async () => {
    mockParams = { notice: 'accessDenied' };

    const { result } = await renderUsePermissionListScreen();

    expect(result.current.noticeMessage).toBe('permission.list.noticeAccessDenied');
    expect(mockReplace).toHaveBeenCalledWith('/settings/permissions');
  });

  it('shows access-denied notice on forbidden API response', async () => {
    usePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: 'FORBIDDEN',
      reset: mockReset,
    });

    const { result } = await renderUsePermissionListScreen();

    expect(result.current.noticeMessage).toBe('permission.list.noticeAccessDenied');
  });

  it('onDelete is blocked when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    mockRemove.mockResolvedValue({ id: 'permission-1' });

    const { result } = await renderUsePermissionListScreen();

    await act(async () => {
      await result.current.onDelete('permission-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('prevents tenant-scoped users from opening or deleting out-of-scope permissions', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    usePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{ id: 'permission-2', tenant_id: 'tenant-2', name: 'External permission' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUsePermissionListScreen();

    act(() => {
      result.current.onItemPress('permission-2');
    });

    await act(async () => {
      await result.current.onDelete('permission-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/permissions?notice=accessDenied');
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('prevents tenant-scoped users from opening or deleting unknown permission IDs', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    usePermission.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{ id: 'permission-1', tenant_id: 'tenant-1', name: 'Scoped permission' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUsePermissionListScreen();

    act(() => {
      result.current.onItemPress('missing-permission-id');
    });

    await act(async () => {
      await result.current.onDelete('missing-permission-id');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/permissions?notice=accessDenied');
    expect(mockRemove).not.toHaveBeenCalled();
  });
});
