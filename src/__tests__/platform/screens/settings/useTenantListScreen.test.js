/**
 * useTenantListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');
const ReactNative = require('react-native');
const mockUseWindowDimensions = jest.spyOn(ReactNative, 'useWindowDimensions');
const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k, values) => {
    if (k === 'tenant.list.bulkDeleteConfirm') return `Confirm ${values?.count || 0}`;
    return k;
  } })),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useTenant: jest.fn(),
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

const useTenantListScreen = require('@platform/screens/settings/TenantListScreen/useTenantListScreen').default;
const { useAuth, useTenant, useNetwork, useTenantAccess } = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useTenantListScreen', () => {
  const mockList = jest.fn();
  const mockGet = jest.fn();
  const mockRemove = jest.fn();

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
      canCreateTenant: true,
      canEditTenant: true,
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
    });
    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  it('global admin path enables list/create/delete and table mode', async () => {
    const { result } = renderHook(() => useTenantListScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
    expect(result.current.isTableMode).toBe(true);
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');

    await waitFor(() => {
      expect(asyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('sends numeric and capped pagination params to tenant list API', () => {
    renderHook(() => useTenantListScreen());

    expect(mockList).toHaveBeenCalled();
    const firstCall = mockList.mock.calls[0][0];
    expect(typeof firstCall.page).toBe('number');
    expect(firstCall.page).toBeGreaterThanOrEqual(1);
    expect(typeof firstCall.limit).toBe('number');
    expect(firstCall.limit).toBeGreaterThanOrEqual(1);
    expect(firstCall.limit).toBeLessThanOrEqual(100);
  });

  it('uses compact mobile list mode below table breakpoint', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });

    const { result } = renderHook(() => useTenantListScreen());
    expect(result.current.isTableMode).toBe(false);
  });

  it('global all-field search matches human readable id and scoped search narrows correctly', () => {
    useTenant.mockReturnValue({
      list: mockList,
      get: mockGet,
      remove: mockRemove,
      data: {
        items: [
          {
            id: 'tenant-1',
            name: 'Acme Hospital',
            slug: 'acme-hospital',
            human_friendly_id: 'TEN0000001',
            is_active: true,
          },
          {
            id: 'tenant-2',
            name: 'Beta Clinic',
            slug: 'beta-clinic',
            human_friendly_id: 'TEN0000002',
            is_active: false,
          },
        ],
      },
      isLoading: false,
      errorCode: null,
    });

    const { result } = renderHook(() => useTenantListScreen());

    act(() => {
      result.current.onSearch('TEN0000002');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('tenant-2');

    act(() => {
      result.current.onSearchScopeChange('slug');
      result.current.onSearch('acme');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('tenant-1');
  });

  it('advanced filters support multi-condition OR grouping', () => {
    useTenant.mockReturnValue({
      list: mockList,
      get: mockGet,
      remove: mockRemove,
      data: {
        items: [
          { id: 'tenant-1', name: 'Acme Hospital', slug: 'acme', is_active: true },
          { id: 'tenant-2', name: 'Beta Clinic', slug: 'beta', is_active: false },
          { id: 'tenant-3', name: 'Gamma Lab', slug: 'gamma', is_active: false },
        ],
      },
      isLoading: false,
      errorCode: null,
    });

    const { result } = renderHook(() => useTenantListScreen());

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

    expect(result.current.items.map((tenant) => tenant.id)).toEqual([
      'tenant-1',
      'tenant-2',
      'tenant-3',
    ]);
  });

  it('tenant-scoped admin path loads own tenant only and hides create/delete actions', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      canCreateTenant: false,
      canEditTenant: true,
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
    });

    const { result } = renderHook(() => useTenantListScreen());

    expect(mockGet).toHaveBeenCalledWith('tenant-1');
    expect(mockList).not.toHaveBeenCalled();
    expect(result.current.items).toEqual([{ id: 'tenant-1', name: 'Acme' }]);
    expect(result.current.onAdd).toBeUndefined();
    expect(typeof result.current.onEdit).toBe('function');
    expect(result.current.onDelete).toBeUndefined();
  });

  it('persists updated table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      columnOrder: ['status', 'name', 'slug', 'humanId'],
      visibleColumns: ['status', 'name'],
      searchScope: 'status',
      filterLogic: 'OR',
      filters: [{ id: 'stored-filter', field: 'status', operator: 'is', value: 'active' }],
    });

    const { result } = renderHook(() => useTenantListScreen());

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
      canCreateTenant: false,
      canEditTenant: false,
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

  it('uses cached tenants when offline and list data is unavailable', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useTenant.mockReturnValue({
      list: mockList,
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
    });
    asyncStorage.getItem.mockImplementation(async (key) => {
      if (String(key).includes('hms.settings.tenants.list.cache')) {
        return [{
          id: 'tenant-cached-1',
          name: 'Cached Tenant',
          slug: 'cached-tenant',
          is_active: true,
        }];
      }
      return null;
    });

    const { result } = renderHook(() => useTenantListScreen());

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('tenant-cached-1');
    });
  });

  it('refreshes tenant list automatically when connection is restored', async () => {
    const networkState = { isOffline: true };
    useNetwork.mockImplementation(() => networkState);

    const { rerender } = renderHook(() => useTenantListScreen());

    expect(mockList).not.toHaveBeenCalled();

    networkState.isOffline = false;
    rerender();

    await waitFor(() => {
      expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
    });
  });
});
