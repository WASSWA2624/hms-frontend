/**
 * useBedListScreen Hook Tests
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
  useBed: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useWard: jest.fn(),
  useRoom: jest.fn(),
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

const useBedListScreen = require('@platform/screens/settings/BedListScreen/useBedListScreen').default;
const {
  useI18n,
  useAuth,
  useNetwork,
  useBed,
  useTenant,
  useFacility,
  useWard,
  useRoom,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useBedListScreen', () => {
  const mockTranslate = (key, values) => {
    if (key === 'bed.list.bulkDeleteConfirm') return `Confirm ${values?.count || 0}`;
    if (key === 'bed.form.currentTenantLabel') return 'Current tenant';
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
  const mockListWards = jest.fn();
  const mockResetWards = jest.fn();
  const mockListRooms = jest.fn();
  const mockResetRooms = jest.fn();

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
    useBed.mockReturnValue({
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
    useWard.mockReturnValue({
      list: mockListWards,
      data: { items: [] },
      reset: mockResetWards,
    });
    useRoom.mockReturnValue({
      list: mockListRooms,
      data: { items: [] },
      reset: mockResetRooms,
    });
    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  it('global admin path enables list/create/delete and table mode', async () => {
    const { result } = renderHook(() => useBedListScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const params = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListWards).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListRooms).toHaveBeenCalledWith({ page: 1, limit: 100 });
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

    const { result } = renderHook(() => useBedListScreen());
    expect(result.current.isTableMode).toBe(false);
  });

  it('global all-field search and scoped search behave correctly', () => {
    useBed.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          {
            id: 'bed-1',
            label: 'A-01',
            tenant_name: 'Alpha Tenant',
            facility_name: 'Main Campus',
            ward_name: 'North Ward',
            room_name: 'Room 1',
            status: 'AVAILABLE',
          },
          {
            id: 'bed-2',
            label: 'B-22',
            tenant_name: 'Beta Tenant',
            facility_name: 'South Clinic',
            ward_name: 'South Ward',
            room_name: 'Room 8',
            status: 'OCCUPIED',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useBedListScreen());

    act(() => {
      result.current.onSearch('south');
    });
    expect(result.current.items.some((item) => item.id === 'bed-2')).toBe(true);

    act(() => {
      result.current.onSearchScopeChange('label');
      result.current.onSearch('a-01');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('bed-1');

    act(() => {
      result.current.onSearchScopeChange('status');
      result.current.onSearch('occupied');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('bed-2');
  });

  it('advanced filters support multi-condition OR grouping', () => {
    useBed.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'bed-1', label: 'A-01', status: 'AVAILABLE' },
          { id: 'bed-2', label: 'B-02', status: 'OCCUPIED' },
          { id: 'bed-3', label: 'C-03', status: 'OUT_OF_SERVICE' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useBedListScreen());

    const firstFilterId = result.current.filters[0].id;

    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'label');
      result.current.onFilterOperatorChange(firstFilterId, 'contains');
      result.current.onFilterValueChange(firstFilterId, 'A-01');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;
    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'status');
      result.current.onFilterOperatorChange(secondFilterId, 'is');
      result.current.onFilterValueChange(secondFilterId, 'OUT_OF_SERVICE');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((bed) => bed.id)).toEqual(['bed-1', 'bed-3']);
  });

  it('tenant-scoped admin fetches beds for own tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useBedListScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    const params = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
    expect(mockListTenants).not.toHaveBeenCalled();
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListWards).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListRooms).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('persists updated table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      columnOrder: ['status', 'facility', 'tenant', 'label'],
      visibleColumns: ['status', 'label'],
      searchScope: 'status',
      filterLogic: 'OR',
      filters: [{ id: 'stored-filter', field: 'status', operator: 'is', value: 'AVAILABLE' }],
    });

    const { result } = renderHook(() => useBedListScreen());

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

    renderHook(() => useBedListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users without tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useBedListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('onDelete is blocked when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    mockRemove.mockResolvedValue({ id: 'bed-1' });

    const { result } = renderHook(() => useBedListScreen());
    await act(async () => {
      await result.current.onDelete('bed-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('uses cached beds when offline and live list data is unavailable', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useBed.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
      reset: mockReset,
    });
    asyncStorage.getItem.mockImplementation(async (key) => {
      if (String(key).includes('hms.settings.beds.list.cache')) {
        return [
          {
            id: 'bed-cached-1',
            label: 'Cached Bed',
            tenant_name: 'Local Tenant',
            status: 'AVAILABLE',
          },
        ];
      }
      return null;
    });

    const { result } = renderHook(() => useBedListScreen());

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('bed-cached-1');
    });
  });

  it('refreshes bed list automatically when connection is restored', async () => {
    const networkState = { isOffline: true };
    useNetwork.mockImplementation(() => networkState);

    const { rerender } = renderHook(() => useBedListScreen());
    expect(mockList).not.toHaveBeenCalled();

    networkState.isOffline = false;
    rerender();

    await waitFor(() => {
      expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    });
  });

  it('prevents tenant-scoped users from opening beds outside tenant scope', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useBed.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{
          id: 'bed-2',
          tenant_id: 'tenant-2',
          label: 'External Bed',
          status: 'AVAILABLE',
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useBedListScreen());

    act(() => {
      result.current.onBedPress('bed-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/beds?notice=accessDenied');
  });

  it('blocks edit and delete when tenant-scoped user targets unknown bed id', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useBed.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useBedListScreen());

    act(() => {
      result.current.onEdit('bed-missing');
    });
    await act(async () => {
      await result.current.onDelete('bed-missing');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/beds?notice=accessDenied');
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('bulk delete removes selected beds when confirmed', async () => {
    useBed.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'bed-1', label: 'One', status: 'AVAILABLE' },
          { id: 'bed-2', label: 'Two', status: 'OCCUPIED' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    mockRemove.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useBedListScreen());

    act(() => {
      result.current.onToggleBedSelection('bed-1');
      result.current.onToggleBedSelection('bed-2');
    });

    await act(async () => {
      await result.current.onBulkDelete();
    });

    expect(confirmAction).toHaveBeenCalledWith('Confirm 2');
    expect(mockRemove).toHaveBeenCalledTimes(2);
    expect(mockRemove).toHaveBeenNthCalledWith(1, 'bed-1');
    expect(mockRemove).toHaveBeenNthCalledWith(2, 'bed-2');
  });
});
