/**
 * useUserSessionListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useUserSession: jest.fn(),
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

const useUserSessionListScreen = require('@platform/screens/settings/UserSessionListScreen/useUserSessionListScreen').default;
const {
  useI18n,
  useAuth,
  useNetwork,
  useUserSession,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');

describe('useUserSessionListScreen', () => {
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
    useUserSession.mockReturnValue({
      list: mockList,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  const renderUseUserSessionListScreen = async () => {
    const rendered = renderHook(() => useUserSessionListScreen());
    await waitFor(() => {
      expect(asyncStorage.getItem).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(asyncStorage.setItem).toHaveBeenCalled();
    });
    return rendered;
  };

  it('loads list with numeric pagination params capped at 100', async () => {
    await renderUseUserSessionListScreen();

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const [params] = mockList.mock.calls[0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
  });

  it('applies tenant scope to list request', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    await renderUseUserSessionListScreen();

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('does not request list while offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });

    await renderUseUserSessionListScreen();

    expect(mockReset).not.toHaveBeenCalled();
    expect(mockList).not.toHaveBeenCalled();
  });

  it('supports all-field search and scoped status search', async () => {
    useUserSession.mockReturnValue({
      list: mockList,
      data: {
        items: [
          {
            id: 'session-1',
            session_name: 'Alice Session',
            created_at: '2025-01-01T00:00:00Z',
            expires_at: '2099-01-01T00:00:00Z',
            revoked_at: null,
          },
          {
            id: 'session-2',
            session_name: 'Bob Session',
            created_at: '2025-01-01T00:00:00Z',
            expires_at: '2099-01-01T00:00:00Z',
            revoked_at: '2025-01-02T00:00:00Z',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseUserSessionListScreen();

    act(() => {
      result.current.onSearch('bob');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['session-2']);

    act(() => {
      result.current.onSearchScopeChange('status');
      result.current.onSearch('revoked');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['session-2']);
  });

  it('supports advanced multi-condition OR filters', async () => {
    useUserSession.mockReturnValue({
      list: mockList,
      data: {
        items: [
          {
            id: 'session-1',
            session_name: 'Alpha',
            created_at: '2025-01-01T00:00:00Z',
            expires_at: '2099-01-01T00:00:00Z',
            revoked_at: null,
          },
          {
            id: 'session-2',
            session_name: 'Beta',
            created_at: '2025-01-01T00:00:00Z',
            expires_at: '2099-01-01T00:00:00Z',
            revoked_at: '2025-01-02T00:00:00Z',
          },
          {
            id: 'session-3',
            session_name: 'Gamma',
            created_at: '2025-01-01T00:00:00Z',
            expires_at: '2099-01-01T00:00:00Z',
            revoked_at: null,
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseUserSessionListScreen();
    const firstFilterId = result.current.filters[0].id;

    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'session');
      result.current.onFilterOperatorChange(firstFilterId, 'contains');
      result.current.onFilterValueChange(firstFilterId, 'alpha');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;
    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'status');
      result.current.onFilterOperatorChange(secondFilterId, 'contains');
      result.current.onFilterValueChange(secondFilterId, 'revoked');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((item) => item.id)).toEqual(['session-1', 'session-2']);
  });

  it('loads and persists table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      searchScope: 'status',
      filterLogic: 'OR',
      sortField: 'status',
      sortDirection: 'desc',
      columnOrder: ['status', 'session', 'started', 'expires'],
      visibleColumns: ['status', 'session'],
      filters: [{ id: 'stored-filter', field: 'status', operator: 'contains', value: 'active' }],
    });

    const { result } = await renderUseUserSessionListScreen();

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

  it('redirects unauthorized users to settings', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useUserSessionListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users with no tenant context to settings', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useUserSessionListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('routes to detail for authorized session', async () => {
    useUserSession.mockReturnValue({
      list: mockList,
      data: {
        items: [{
          id: 'session-1',
          session_name: 'Primary Session',
          tenant_id: 'tenant-1',
          created_at: '2025-01-01T00:00:00Z',
          expires_at: '2099-01-01T00:00:00Z',
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = await renderUseUserSessionListScreen();
    act(() => {
      result.current.onItemPress('session-1');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/user-sessions/session-1');
  });

  it('blocks opening sessions outside tenant scope', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserSession.mockReturnValue({
      list: mockList,
      data: {
        items: [{
          id: 'session-2',
          tenant_id: 'tenant-2',
          created_at: '2025-01-01T00:00:00Z',
          expires_at: '2099-01-01T00:00:00Z',
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseUserSessionListScreen();
    act(() => {
      result.current.onItemPress('session-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/user-sessions?notice=accessDenied');
  });

  it('blocks opening unknown sessions for tenant-scoped users', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserSession.mockReturnValue({
      list: mockList,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseUserSessionListScreen();
    act(() => {
      result.current.onItemPress('unknown-session');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/user-sessions?notice=accessDenied');
  });

  it('maps accessDenied notice and clears query params', async () => {
    mockParams = { notice: 'accessDenied' };

    const { result } = await renderUseUserSessionListScreen();

    await waitFor(() => {
      expect(result.current.noticeMessage).toBe('userSession.list.noticeAccessDenied');
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/user-sessions');
  });

  it('keeps list strictly read-only', async () => {
    const { result } = await renderUseUserSessionListScreen();

    expect(result.current.onAdd).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('masks technical ids for standard users', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserSession.mockReturnValue({
      list: mockList,
      data: {
        items: [{
          id: '8f4fd148-2502-4edb-bf1d-c1f5c66182fd',
          user_id: '910f0d1f-66fd-4490-8e4a-cc8ef00a4bf6',
          tenant_id: 'tenant-1',
          created_at: '2025-01-01T00:00:00Z',
          expires_at: '2099-01-01T00:00:00Z',
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseUserSessionListScreen();
    const item = result.current.items[0];

    expect(result.current.resolveSessionLabel(item)).toBe('userSession.list.currentSessionLabel');
  });

  it('sets access-denied notice when backend returns forbidden', async () => {
    useUserSession.mockReturnValue({
      list: mockList,
      data: { items: [] },
      isLoading: false,
      errorCode: 'FORBIDDEN',
      reset: mockReset,
    });

    const { result } = await renderUseUserSessionListScreen();
    await waitFor(() => {
      expect(result.current.noticeMessage).toBe('userSession.list.noticeAccessDenied');
    });
    expect(result.current.hasError).toBe(true);
  });
});
