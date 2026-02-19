/**
 * useApiKeyListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useApiKey: jest.fn(),
  useTenantAccess: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

const useApiKeyListScreen = require('@platform/screens/settings/ApiKeyListScreen/useApiKeyListScreen').default;
const {
  useI18n,
  useAuth,
  useNetwork,
  useApiKey,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');

describe('useApiKeyListScreen', () => {
  const mockList = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};

    useI18n.mockReturnValue({
      t: (key) => key,
    });
    useAuth.mockReturnValue({ user: { id: 'user-1' } });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });

    useApiKey.mockReturnValue({
      list: mockList,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  it('loads list with capped numeric limit 100', () => {
    renderHook(() => useApiKeyListScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('applies tenant scope to list request', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useApiKeyListScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('supports all-field and scoped search', () => {
    useApiKey.mockReturnValue({
      list: mockList,
      data: {
        items: [
          {
            id: 'k-1',
            name: 'Alpha Integration',
            user_name: 'Alice Johnson',
            tenant_name: 'North Tenant',
            is_active: true,
          },
          {
            id: 'k-2',
            name: 'Billing Sync',
            user_name: 'Bob Smith',
            tenant_name: 'South Tenant',
            is_active: false,
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useApiKeyListScreen());

    act(() => {
      result.current.onSearch('south');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['k-2']);

    act(() => {
      result.current.onSearchScopeChange('name');
      result.current.onSearch('alpha');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['k-1']);
  });

  it('supports advanced multi-condition OR filters', () => {
    useApiKey.mockReturnValue({
      list: mockList,
      data: {
        items: [
          {
            id: 'k-1',
            name: 'Alpha Key',
            user_name: 'Alice',
            tenant_name: 'North',
            is_active: true,
          },
          {
            id: 'k-2',
            name: 'Beta Key',
            user_name: 'Bob',
            tenant_name: 'West Tenant',
            is_active: false,
          },
          {
            id: 'k-3',
            name: 'Gamma Key',
            user_name: 'Chris',
            tenant_name: 'South',
            is_active: true,
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useApiKeyListScreen());

    const firstFilterId = result.current.filters[0].id;
    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'user');
      result.current.onFilterOperatorChange(firstFilterId, 'contains');
      result.current.onFilterValueChange(firstFilterId, 'alice');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;
    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'tenant');
      result.current.onFilterOperatorChange(secondFilterId, 'contains');
      result.current.onFilterValueChange(secondFilterId, 'west');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((item) => item.id)).toEqual(['k-1', 'k-2']);
  });

  it('loads and persists table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      searchScope: 'tenant',
      filterLogic: 'OR',
      sortField: 'tenant',
      sortDirection: 'desc',
      columnOrder: ['tenant', 'name', 'user', 'status'],
      visibleColumns: ['tenant', 'name'],
      filters: [{ id: 'stored-filter', field: 'tenant', operator: 'contains', value: 'north' }],
    });

    const { result } = renderHook(() => useApiKeyListScreen());

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

    renderHook(() => useApiKeyListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('blocks opening records outside tenant scope', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useApiKey.mockReturnValue({
      list: mockList,
      data: {
        items: [
          { id: 'k-2', tenant_id: 'tenant-2', name: 'External Key' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useApiKeyListScreen());
    act(() => {
      result.current.onItemPress('k-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/api-keys?notice=accessDenied');
  });

  it('blocks tenant-scoped navigation when item is not in scoped data', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useApiKey.mockReturnValue({
      list: mockList,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useApiKeyListScreen());
    act(() => {
      result.current.onItemPress('unscoped-key');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/api-keys?notice=accessDenied');
  });

  it('keeps list strictly read-only (no add/delete handlers)', () => {
    const { result } = renderHook(() => useApiKeyListScreen());

    expect(result.current.onAdd).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('masks technical ids for standard users', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useApiKey.mockReturnValue({
      list: mockList,
      data: {
        items: [{
          id: '8f4fd148-2502-4edb-bf1d-c1f5c66182fd',
          user_id: '910f0d1f-66fd-4490-8e4a-cc8ef00a4bf6',
          tenant_id: '24526426-b527-4cb4-a48b-c3f71ca9f3e7',
          is_active: true,
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useApiKeyListScreen());
    const item = result.current.items[0];

    expect(result.current.resolveApiKeyName(item)).toBe('apiKey.list.currentKeyLabel');
    expect(result.current.resolveUserLabel(item)).toBe('apiKey.list.currentUserLabel');
    expect(result.current.resolveTenantLabel(item)).toBe('apiKey.list.currentTenantLabel');
  });

  it('maps accessDenied notice and clears query param', () => {
    mockParams = { notice: 'accessDenied' };

    const { result } = renderHook(() => useApiKeyListScreen());

    expect(result.current.noticeMessage).toBe('apiKey.list.noticeAccessDenied');
    expect(mockReplace).toHaveBeenCalledWith('/settings/api-keys');
  });
});
