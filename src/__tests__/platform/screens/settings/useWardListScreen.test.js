/**
 * useWardListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');
const ReactNative = require('react-native');

const mockUseWindowDimensions = jest.spyOn(ReactNative, 'useWindowDimensions');
const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useWard: jest.fn(),
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

const useWardListScreen = require('@platform/screens/settings/WardListScreen/useWardListScreen').default;
const {
  useI18n,
  useAuth,
  useNetwork,
  useWard,
  useTenant,
  useFacility,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useWardListScreen', () => {
  const mockTranslate = (key, values) => {
    if (key === 'ward.list.bulkDeleteConfirm') return `Confirm ${values?.count || 0}`;
    return key;
  };
  let consoleErrorSpy;
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useI18n.mockReturnValue({ t: mockTranslate });
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
    useWard.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
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

  it('global admin path enables list/create/delete and table mode', async () => {
    const { result } = renderHook(() => useWardListScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const params = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100 });
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

    const { result } = renderHook(() => useWardListScreen());
    expect(result.current.isTableMode).toBe(false);
  });

  it('global all-field search and scoped search behave correctly', () => {
    useWard.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          {
            id: 'ward-1',
            name: 'General Ward',
            tenant_name: 'Alpha Tenant',
            facility_name: 'Main Campus',
            ward_type: 'GENERAL',
            is_active: true,
          },
          {
            id: 'ward-2',
            name: 'Critical Care',
            tenant_name: 'Beta Tenant',
            facility_name: 'South Clinic',
            ward_type: 'ICU',
            is_active: false,
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useWardListScreen());

    act(() => {
      result.current.onSearch('south');
    });
    expect(result.current.items.some((item) => item.id === 'ward-2')).toBe(true);

    act(() => {
      result.current.onSearchScopeChange('name');
      result.current.onSearch('general');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('ward-1');

    act(() => {
      result.current.onSearchScopeChange('active');
      result.current.onSearch('inactive');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('ward-2');
  });

  it('advanced filters support multi-condition OR grouping', () => {
    useWard.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'ward-1', name: 'A-01', ward_type: 'GENERAL', is_active: true },
          { id: 'ward-2', name: 'B-02', ward_type: 'ICU', is_active: false },
          { id: 'ward-3', name: 'C-03', ward_type: 'MATERNITY', is_active: false },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useWardListScreen());

    const firstFilterId = result.current.filters[0].id;

    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'name');
      result.current.onFilterOperatorChange(firstFilterId, 'contains');
      result.current.onFilterValueChange(firstFilterId, 'A-01');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;
    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'active');
      result.current.onFilterOperatorChange(secondFilterId, 'is');
      result.current.onFilterValueChange(secondFilterId, 'inactive');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((ward) => ward.id)).toEqual(['ward-1', 'ward-2', 'ward-3']);
  });

  it('tenant-scoped admin fetches wards for own tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useWardListScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    const params = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
    expect(mockListTenants).not.toHaveBeenCalled();
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('persists updated table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      columnOrder: ['active', 'facility', 'tenant', 'name'],
      visibleColumns: ['active', 'name'],
      searchScope: 'active',
      filterLogic: 'OR',
      filters: [{ id: 'stored-filter', field: 'active', operator: 'is', value: 'inactive' }],
    });

    const { result } = renderHook(() => useWardListScreen());

    await waitFor(() => {
      expect(result.current.pageSize).toBe(20);
      expect(result.current.density).toBe('comfortable');
      expect(result.current.searchScope).toBe('active');
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

    renderHook(() => useWardListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users without tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useWardListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('onDelete is blocked when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    mockRemove.mockResolvedValue({ id: 'ward-1' });

    const { result } = renderHook(() => useWardListScreen());
    await act(async () => {
      await result.current.onDelete('ward-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('uses cached wards when offline and live list data is unavailable', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useWard.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
      reset: mockReset,
    });
    asyncStorage.getItem.mockImplementation(async (key) => {
      if (String(key).includes('hms.settings.wards.list.cache')) {
        return [
          {
            id: 'ward-cached-1',
            name: 'Cached Ward',
            tenant_name: 'Local Tenant',
            ward_type: 'GENERAL',
            is_active: true,
          },
        ];
      }
      return null;
    });

    const { result } = renderHook(() => useWardListScreen());

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('ward-cached-1');
    });
  });

  it('refreshes ward list automatically when connection is restored', async () => {
    const networkState = { isOffline: true };
    useNetwork.mockImplementation(() => networkState);

    const { rerender } = renderHook(() => useWardListScreen());
    expect(mockList).not.toHaveBeenCalled();

    networkState.isOffline = false;
    rerender();

    await waitFor(() => {
      expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    });
  });

  it('prevents tenant-scoped users from opening wards outside tenant scope', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useWard.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{
          id: 'ward-2',
          tenant_id: 'tenant-2',
          name: 'External Ward',
          ward_type: 'GENERAL',
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useWardListScreen());

    act(() => {
      result.current.onWardPress('ward-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/wards?notice=accessDenied');
  });

  it('blocks edit and delete when tenant-scoped user targets unknown ward id', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useWard.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useWardListScreen());

    act(() => {
      result.current.onEdit('ward-missing');
    });
    await act(async () => {
      await result.current.onDelete('ward-missing');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/wards?notice=accessDenied');
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('bulk delete removes selected wards when confirmed', async () => {
    useWard.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'ward-1', name: 'One', ward_type: 'GENERAL', is_active: true },
          { id: 'ward-2', name: 'Two', ward_type: 'ICU', is_active: false },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    mockRemove.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useWardListScreen());

    act(() => {
      result.current.onToggleWardSelection('ward-1');
      result.current.onToggleWardSelection('ward-2');
    });

    await act(async () => {
      await result.current.onBulkDelete();
    });

    expect(confirmAction).toHaveBeenCalledWith('Confirm 2');
    expect(mockRemove).toHaveBeenCalledTimes(2);
    expect(mockRemove).toHaveBeenNthCalledWith(1, 'ward-1');
    expect(mockRemove).toHaveBeenNthCalledWith(2, 'ward-2');
  });
});

