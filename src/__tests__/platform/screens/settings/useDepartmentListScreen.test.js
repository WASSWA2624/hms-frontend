/**
 * useDepartmentListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');
const ReactNative = require('react-native');

const mockUseWindowDimensions = jest.spyOn(ReactNative, 'useWindowDimensions');
const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({
    t: (key, values) => {
      if (key === 'department.list.bulkDeleteConfirm') return `Confirm ${values?.count || 0}`;
      return key;
    },
  })),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useDepartment: jest.fn(),
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

const useDepartmentListScreen = require('@platform/screens/settings/DepartmentListScreen/useDepartmentListScreen').default;
const { useAuth, useNetwork, useDepartment, useTenantAccess } = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useDepartmentListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    mockUseWindowDimensions.mockReturnValue({
      width: 1280,
      height: 900,
      scale: 1,
      fontScale: 1,
    });

    useAuth.mockReturnValue({ user: { id: 'user-1' } });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useDepartment.mockReturnValue({
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

  it('global admin path enables list/create/delete and table mode', async () => {
    const { result } = renderHook(() => useDepartmentListScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(result.current.isTableMode).toBe(true);
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');

    await waitFor(() => {
      expect(asyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('uses compact mobile list mode below table breakpoint', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });

    const { result } = renderHook(() => useDepartmentListScreen());
    expect(result.current.isTableMode).toBe(false);
  });

  it('global all-field search and scoped search behave correctly', () => {
    useDepartment.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          {
            id: 'department-1',
            name: 'Acme Hospital',
            short_name: 'ACM',
            department_type: 'CLINICAL',
            is_active: true,
          },
          {
            id: 'department-2',
            name: 'Beta Diagnostics',
            short_name: 'BDX',
            department_type: 'DIAGNOSTICS',
            is_active: false,
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useDepartmentListScreen());

    act(() => {
      result.current.onSearch('bdx');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('department-2');

    act(() => {
      result.current.onSearchScopeChange('name');
      result.current.onSearch('acme');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('department-1');

    act(() => {
      result.current.onSearchScopeChange('shortName');
      result.current.onSearch('bdx');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('department-2');
  });

  it('advanced filters support multi-condition OR grouping', () => {
    useDepartment.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'department-1', name: 'Acme Hospital', department_type: 'CLINICAL', is_active: true },
          { id: 'department-2', name: 'Beta Clinic', department_type: 'ADMINISTRATIVE', is_active: false },
          { id: 'department-3', name: 'Gamma Lab', department_type: 'DIAGNOSTICS', is_active: false },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useDepartmentListScreen());

    const firstFilterId = result.current.filters[0].id;

    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'name');
      result.current.onFilterOperatorChange(firstFilterId, 'contains');
      result.current.onFilterValueChange(firstFilterId, 'acme');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;
    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'status');
      result.current.onFilterOperatorChange(secondFilterId, 'is');
      result.current.onFilterValueChange(secondFilterId, 'inactive');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((department) => department.id)).toEqual([
      'department-1',
      'department-2',
      'department-3',
    ]);
  });

  it('tenant-scoped admin fetches departments for own tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useDepartmentListScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('persists updated table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      columnOrder: ['status', 'type', 'name'],
      visibleColumns: ['status', 'name'],
      searchScope: 'status',
      filterLogic: 'OR',
      filters: [{ id: 'stored-filter', field: 'status', operator: 'is', value: 'active' }],
    });

    const { result } = renderHook(() => useDepartmentListScreen());

    await waitFor(() => {
      expect(result.current.pageSize).toBe(20);
      expect(result.current.density).toBe('comfortable');
      expect(result.current.searchScope).toBe('status');
    });

    act(() => {
      result.current.onDensityChange('compact');
    });

    await waitFor(() => {
      expect(asyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('redirects unauthorized users to settings after roles resolve', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useDepartmentListScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users without tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useDepartmentListScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('onDelete is blocked when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    mockRemove.mockResolvedValue({ id: 'department-1' });

    const { result } = renderHook(() => useDepartmentListScreen());
    await act(async () => {
      await result.current.onDelete('department-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('uses cached departments when offline and live list data is unavailable', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useDepartment.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
      reset: mockReset,
    });
    asyncStorage.getItem.mockImplementation(async (key) => {
      if (String(key).includes('hms.settings.departments.list.cache')) {
        return [{
          id: 'department-cached-1',
          name: 'Cached Department',
          department_type: 'CLINICAL',
          is_active: true,
        }];
      }
      return null;
    });

    const { result } = renderHook(() => useDepartmentListScreen());

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('department-cached-1');
    });
  });

  it('refreshes department list automatically when connection is restored', async () => {
    const networkState = { isOffline: true };
    useNetwork.mockImplementation(() => networkState);

    const { rerender } = renderHook(() => useDepartmentListScreen());

    expect(mockList).not.toHaveBeenCalled();

    networkState.isOffline = false;
    rerender();

    await waitFor(() => {
      expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    });
  });

  it('prevents tenant-scoped users from opening departments outside tenant scope', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useDepartment.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{
          id: 'department-2',
          tenant_id: 'tenant-2',
          name: 'External Department',
          department_type: 'CLINICAL',
          is_active: true,
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useDepartmentListScreen());

    act(() => {
      result.current.onDepartmentPress('department-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/departments?notice=accessDenied');
  });

  it('bulk delete removes selected departments when confirmed', async () => {
    useDepartment.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'department-1', name: 'One', department_type: 'CLINICAL', is_active: true },
          { id: 'department-2', name: 'Two', department_type: 'DIAGNOSTICS', is_active: false },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    mockRemove.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useDepartmentListScreen());

    act(() => {
      result.current.onToggleDepartmentSelection('department-1');
      result.current.onToggleDepartmentSelection('department-2');
    });

    await act(async () => {
      await result.current.onBulkDelete();
    });

    expect(confirmAction).toHaveBeenCalledWith('Confirm 2');
    expect(mockRemove).toHaveBeenCalledTimes(2);
    expect(mockRemove).toHaveBeenNthCalledWith(1, 'department-1');
    expect(mockRemove).toHaveBeenNthCalledWith(2, 'department-2');
  });
});
