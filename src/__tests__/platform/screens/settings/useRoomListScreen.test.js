/**
 * useRoomListScreen Hook Tests
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
  useRoom: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useWard: jest.fn(),
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

const useRoomListScreen = require('@platform/screens/settings/RoomListScreen/useRoomListScreen').default;
const {
  useI18n,
  useAuth,
  useNetwork,
  useRoom,
  useTenant,
  useFacility,
  useWard,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useRoomListScreen', () => {
  const mockTranslate = (key, values) => {
    if (key === 'room.list.bulkDeleteConfirm') return `Confirm ${values?.count || 0}`;
    if (key === 'room.form.currentTenantLabel') return 'Current tenant';
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
    useRoom.mockReturnValue({
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
    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  it('global admin path enables list/create/delete and table mode', async () => {
    const { result } = renderHook(() => useRoomListScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListWards).toHaveBeenCalledWith({ page: 1, limit: 100 });
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

    const { result } = renderHook(() => useRoomListScreen());
    expect(result.current.isTableMode).toBe(false);
  });

  it('global all-field search and scoped search behave correctly', () => {
    useRoom.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          {
            id: 'room-1',
            name: 'Deluxe 1',
            tenant_name: 'Alpha Tenant',
            facility_name: 'Main Campus',
            ward_name: 'North Ward',
            floor: '2',
          },
          {
            id: 'room-2',
            name: 'Economy 2',
            tenant_name: 'Beta Tenant',
            facility_name: 'South Clinic',
            ward_name: 'South Ward',
            floor: '5',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useRoomListScreen());

    act(() => {
      result.current.onSearch('south');
    });
    expect(result.current.items.some((item) => item.id === 'room-2')).toBe(true);

    act(() => {
      result.current.onSearchScopeChange('name');
      result.current.onSearch('deluxe');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('room-1');

    act(() => {
      result.current.onSearchScopeChange('floor');
      result.current.onSearch('5');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('room-2');
  });

  it('advanced filters support multi-condition OR grouping', () => {
    useRoom.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'room-1', name: 'A-01', floor: '1' },
          { id: 'room-2', name: 'B-02', floor: '2' },
          { id: 'room-3', name: 'C-03', floor: '3' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useRoomListScreen());

    const firstFilterId = result.current.filters[0].id;

    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'name');
      result.current.onFilterOperatorChange(firstFilterId, 'contains');
      result.current.onFilterValueChange(firstFilterId, 'A-01');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;
    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'floor');
      result.current.onFilterOperatorChange(secondFilterId, 'contains');
      result.current.onFilterValueChange(secondFilterId, '3');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((room) => room.id)).toEqual(['room-1', 'room-3']);
  });

  it('tenant-scoped admin fetches rooms for own tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useRoomListScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListTenants).not.toHaveBeenCalled();
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListWards).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('persists updated table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      columnOrder: ['floor', 'facility', 'tenant', 'name'],
      visibleColumns: ['floor', 'name'],
      searchScope: 'floor',
      filterLogic: 'OR',
      filters: [{ id: 'stored-filter', field: 'floor', operator: 'contains', value: '2' }],
    });

    const { result } = renderHook(() => useRoomListScreen());

    await waitFor(() => {
      expect(result.current.pageSize).toBe(20);
      expect(result.current.density).toBe('comfortable');
      expect(result.current.searchScope).toBe('floor');
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

    renderHook(() => useRoomListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users without tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useRoomListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('onDelete is blocked when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    mockRemove.mockResolvedValue({ id: 'room-1' });

    const { result } = renderHook(() => useRoomListScreen());
    await act(async () => {
      await result.current.onDelete('room-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('uses cached rooms when offline and live list data is unavailable', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useRoom.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
      reset: mockReset,
    });
    asyncStorage.getItem.mockImplementation(async (key) => {
      if (String(key).includes('hms.settings.rooms.list.cache')) {
        return [
          {
            id: 'room-cached-1',
            name: 'Cached Room',
            tenant_name: 'Local Tenant',
            floor: '1',
          },
        ];
      }
      return null;
    });

    const { result } = renderHook(() => useRoomListScreen());

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('room-cached-1');
    });
  });

  it('refreshes room list automatically when connection is restored', async () => {
    const networkState = { isOffline: true };
    useNetwork.mockImplementation(() => networkState);

    const { rerender } = renderHook(() => useRoomListScreen());
    expect(mockList).not.toHaveBeenCalled();

    networkState.isOffline = false;
    rerender();

    await waitFor(() => {
      expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    });
  });

  it('prevents tenant-scoped users from opening rooms outside tenant scope', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRoom.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{
          id: 'room-2',
          tenant_id: 'tenant-2',
          name: 'External Room',
          floor: '1',
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useRoomListScreen());

    act(() => {
      result.current.onRoomPress('room-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/rooms?notice=accessDenied');
  });

  it('bulk delete removes selected rooms when confirmed', async () => {
    useRoom.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'room-1', name: 'One', floor: '1' },
          { id: 'room-2', name: 'Two', floor: '2' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    mockRemove.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useRoomListScreen());

    act(() => {
      result.current.onToggleRoomSelection('room-1');
      result.current.onToggleRoomSelection('room-2');
    });

    await act(async () => {
      await result.current.onBulkDelete();
    });

    expect(confirmAction).toHaveBeenCalledWith('Confirm 2');
    expect(mockRemove).toHaveBeenCalledTimes(2);
    expect(mockRemove).toHaveBeenNthCalledWith(1, 'room-1');
    expect(mockRemove).toHaveBeenNthCalledWith(2, 'room-2');
  });
});
