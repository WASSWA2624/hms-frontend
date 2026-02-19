/**
 * useUserRoleListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useUserRole: jest.fn(),
  useRole: jest.fn(),
  useUser: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
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

const useUserRoleListScreen = require('@platform/screens/settings/UserRoleListScreen/useUserRoleListScreen').default;
const {
  useI18n,
  useAuth,
  useNetwork,
  useUserRole,
  useRole,
  useUser,
  useTenant,
  useFacility,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useUserRoleListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  const mockListRoles = jest.fn();
  const mockResetRoles = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};

    useI18n.mockReturnValue({
      t: (key, values) => {
        if (values?.index) return `${key}.${values.index}`;
        return key;
      },
    });
    useAuth.mockReturnValue({ user: { id: 'user-1' } });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });

    useUserRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useRole.mockReturnValue({
      list: mockListRoles,
      data: { items: [] },
      reset: mockResetRoles,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [] },
      reset: mockResetUsers,
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [] },
      reset: mockResetTenants,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [] },
      reset: mockResetFacilities,
    });

    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  it('loads list and reference data with capped numeric limit 100', async () => {
    renderHook(() => useUserRoleListScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });

    expect(mockResetRoles).toHaveBeenCalled();
    expect(mockResetUsers).toHaveBeenCalled();
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockResetFacilities).toHaveBeenCalled();
    expect(mockListRoles).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100 });

    await waitFor(() => {
      expect(asyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('applies tenant scope to list and reference requests', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useUserRoleListScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListRoles).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('does not request list or references while offline', () => {
    useNetwork.mockReturnValue({ isOffline: true });

    renderHook(() => useUserRoleListScreen());

    expect(mockList).not.toHaveBeenCalled();
    expect(mockListRoles).not.toHaveBeenCalled();
    expect(mockListUsers).not.toHaveBeenCalled();
    expect(mockListTenants).not.toHaveBeenCalled();
    expect(mockListFacilities).not.toHaveBeenCalled();
  });

  it('supports all-field search and scoped search', () => {
    useUserRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          {
            id: 'ur-1',
            user_name: 'Alice Johnson',
            role_name: 'Admin',
            tenant_name: 'North Tenant',
            facility_name: 'Main Campus',
          },
          {
            id: 'ur-2',
            user_name: 'Bob Smith',
            role_name: 'Nurse',
            tenant_name: 'South Tenant',
            facility_name: 'Annex Lab',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserRoleListScreen());

    act(() => {
      result.current.onSearch('annex');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['ur-2']);

    act(() => {
      result.current.onSearchScopeChange('role');
      result.current.onSearch('admin');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['ur-1']);
  });

  it('supports advanced multi-condition OR filters', () => {
    useUserRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'ur-1', user_name: 'Alice', role_name: 'Admin', tenant_name: 'North', facility_name: 'Main' },
          { id: 'ur-2', user_name: 'Bob', role_name: 'Nurse', tenant_name: 'North', facility_name: 'West Wing' },
          { id: 'ur-3', user_name: 'Chris', role_name: 'Auditor', tenant_name: 'South', facility_name: 'Annex' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserRoleListScreen());

    const firstFilterId = result.current.filters[0].id;
    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'user');
      result.current.onFilterOperatorChange(firstFilterId, 'contains');
      result.current.onFilterValueChange(firstFilterId, 'alice');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;
    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'facility');
      result.current.onFilterOperatorChange(secondFilterId, 'contains');
      result.current.onFilterValueChange(secondFilterId, 'west');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((item) => item.id)).toEqual(['ur-1', 'ur-2']);
  });

  it('loads and persists table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      searchScope: 'tenant',
      filterLogic: 'OR',
      sortField: 'tenant',
      sortDirection: 'desc',
      columnOrder: ['tenant', 'user', 'role', 'facility'],
      visibleColumns: ['tenant', 'user'],
      filters: [{ id: 'stored-filter', field: 'tenant', operator: 'contains', value: 'north' }],
    });

    const { result } = renderHook(() => useUserRoleListScreen());

    await waitFor(() => {
      expect(result.current.pageSize).toBe(20);
      expect(result.current.density).toBe('comfortable');
      expect(result.current.searchScope).toBe('tenant');
    });

    act(() => {
      result.current.onDensityChange('compact');
    });

    await waitFor(() => {
      expect(asyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('redirects unauthorized users to settings', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useUserRoleListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('blocks opening records outside tenant scope', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'ur-2', tenant_id: 'tenant-2', user_name: 'External User' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserRoleListScreen());
    act(() => {
      result.current.onItemPress('ur-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/user-roles?notice=accessDenied');
  });

  it('hides records outside tenant scope from rendered data source', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'ur-1', tenant_id: 'tenant-1', user_name: 'Allowed User' },
          { id: 'ur-2', tenant_id: 'tenant-2', user_name: 'Blocked User' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserRoleListScreen());
    expect(result.current.items.map((item) => item.id)).toEqual(['ur-1']);
  });

  it('blocks deletion when tenant-scoped target record is unknown', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserRoleListScreen());
    await act(async () => {
      await result.current.onDelete('unknown-id');
    });

    expect(mockRemove).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/settings/user-roles?notice=accessDenied');
  });

  it('does not remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);

    const { result } = renderHook(() => useUserRoleListScreen());
    await act(async () => {
      await result.current.onDelete('ur-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('masks technical ids for standard users', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{
          id: 'ur-1',
          user_id: 'user-raw',
          role_id: 'role-raw',
          tenant_id: 'tenant-1',
          facility_id: 'facility-raw',
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserRoleListScreen());
    const item = result.current.items[0];

    expect(result.current.resolveUserLabel(item)).toBe('userRole.list.currentUserLabel');
    expect(result.current.resolveRoleLabel(item)).toBe('userRole.list.currentRoleLabel');
    expect(result.current.resolveTenantLabel(item)).toBe('userRole.list.currentTenantLabel');
    expect(result.current.resolveFacilityLabel(item)).toBe('userRole.list.currentFacilityLabel');
  });
});
