/**
 * useAddressListScreen Hook Tests
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
      if (key === 'address.list.bulkDeleteConfirm') return `Confirm ${values?.count || 0}`;
      return key;
    },
  })),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useAddress: jest.fn(),
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

const useAddressListScreen = require('@platform/screens/settings/AddressListScreen/useAddressListScreen').default;
const { useAuth, useNetwork, useAddress, useTenantAccess } = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useAddressListScreen', () => {
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
    useAddress.mockReturnValue({
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
    const { result } = renderHook(() => useAddressListScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const params = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
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

    const { result } = renderHook(() => useAddressListScreen());
    expect(result.current.isTableMode).toBe(false);
  });

  it('global all-field search and scoped search behave correctly', () => {
    useAddress.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          {
            id: 'address-1',
            name: 'Acme Hospital',
            facility_name: 'Main Campus',
            is_active: true,
          },
          {
            id: 'address-2',
            name: 'Beta Diagnostics',
            facility_name: 'Lab Wing',
            is_active: false,
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useAddressListScreen());

    act(() => {
      result.current.onSearch('lab');
    });
    expect(result.current.items.some((item) => item.id === 'address-2')).toBe(true);

    act(() => {
      result.current.onSearchScopeChange('name');
      result.current.onSearch('acme');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('address-1');
  });

  it('advanced filters support multi-condition OR grouping', () => {
    useAddress.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'address-1', name: 'Acme Hospital', address_type: 'HOSPITAL', is_active: true },
          { id: 'address-2', name: 'Beta Clinic', address_type: 'CLINIC', is_active: false },
          { id: 'address-3', name: 'Gamma Lab', address_type: 'LAB', is_active: false },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useAddressListScreen());

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

    expect(result.current.items.map((address) => address.id)).toEqual([
      'address-1',
      'address-2',
      'address-3',
    ]);
  });

  it('tenant-scoped admin fetches addresses for own tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useAddressListScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    const params = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('persists updated table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      columnOrder: ['status', 'facility', 'tenant', 'name'],
      visibleColumns: ['status', 'name'],
      searchScope: 'status',
      filterLogic: 'OR',
      filters: [{ id: 'stored-filter', field: 'status', operator: 'is', value: 'active' }],
    });

    const { result } = renderHook(() => useAddressListScreen());

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

    renderHook(() => useAddressListScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users without tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useAddressListScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('onDelete is blocked when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    mockRemove.mockResolvedValue({ id: 'address-1' });

    const { result } = renderHook(() => useAddressListScreen());
    await act(async () => {
      await result.current.onDelete('address-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('uses cached addresses when offline and live list data is unavailable', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useAddress.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
      reset: mockReset,
    });
    asyncStorage.getItem.mockImplementation(async (key) => {
      if (String(key).includes('hms.settings.addresses.list.cache')) {
        return [{
          id: 'address-cached-1',
          name: 'Cached Address',
          facility_name: 'Local Facility',
          is_active: true,
        }];
      }
      return null;
    });

    const { result } = renderHook(() => useAddressListScreen());

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('address-cached-1');
    });
  });

  it('refreshes address list automatically when connection is restored', async () => {
    const networkState = { isOffline: true };
    useNetwork.mockImplementation(() => networkState);

    const { rerender } = renderHook(() => useAddressListScreen());

    expect(mockList).not.toHaveBeenCalled();

    networkState.isOffline = false;
    rerender();

    await waitFor(() => {
      expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    });
  });

  it('prevents tenant-scoped users from opening addresses outside tenant scope', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useAddress.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{
          id: 'address-2',
          tenant_id: 'tenant-2',
          name: 'External Address',
          address_type: 'CLINIC',
          is_active: true,
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useAddressListScreen());

    act(() => {
      result.current.onAddressPress('address-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/addresses?notice=accessDenied');
  });

  it('blocks edit and delete when tenant-scoped user targets unknown address id', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useAddress.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useAddressListScreen());

    act(() => {
      result.current.onEdit('address-missing');
    });
    await act(async () => {
      await result.current.onDelete('address-missing');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/addresses?notice=accessDenied');
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('bulk delete removes selected addresses when confirmed', async () => {
    useAddress.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'address-1', name: 'One', address_type: 'CLINIC', is_active: true },
          { id: 'address-2', name: 'Two', address_type: 'LAB', is_active: false },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    mockRemove.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useAddressListScreen());

    act(() => {
      result.current.onToggleAddressSelection('address-1');
      result.current.onToggleAddressSelection('address-2');
    });

    await act(async () => {
      await result.current.onBulkDelete();
    });

    expect(confirmAction).toHaveBeenCalledWith('Confirm 2');
    expect(mockRemove).toHaveBeenCalledTimes(2);
    expect(mockRemove).toHaveBeenNthCalledWith(1, 'address-1');
    expect(mockRemove).toHaveBeenNthCalledWith(2, 'address-2');
  });
});

