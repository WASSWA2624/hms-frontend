/**
 * useUserMfaListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useTenantAccess: jest.fn(),
  useUserMfa: jest.fn(),
  useUser: jest.fn(),
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

const useUserMfaListScreen = require('@platform/screens/settings/UserMfaListScreen/useUserMfaListScreen').default;
const {
  useI18n,
  useAuth,
  useNetwork,
  useTenantAccess,
  useUserMfa,
  useUser,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useUserMfaListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();

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
    useUserMfa.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [] },
      reset: mockResetUsers,
    });

    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  const renderUseUserMfaListScreen = async () => {
    const rendered = renderHook(() => useUserMfaListScreen());
    await waitFor(() => {
      expect(asyncStorage.getItem).toHaveBeenCalled();
    });
    return rendered;
  };

  it('loads list and users with numeric params capped at 100', async () => {
    await renderUseUserMfaListScreen();

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const [listParams] = mockList.mock.calls[0];
    expect(typeof listParams.page).toBe('number');
    expect(typeof listParams.limit).toBe('number');
    expect(mockResetUsers).toHaveBeenCalled();
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const [userParams] = mockListUsers.mock.calls[0];
    expect(typeof userParams.page).toBe('number');
    expect(typeof userParams.limit).toBe('number');
  });

  it('applies tenant scope to list and user lookups for tenant admins', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    await renderUseUserMfaListScreen();

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('does not fetch list or users while offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });

    await renderUseUserMfaListScreen();

    expect(mockReset).not.toHaveBeenCalled();
    expect(mockList).not.toHaveBeenCalled();
    expect(mockResetUsers).not.toHaveBeenCalled();
    expect(mockListUsers).not.toHaveBeenCalled();
  });

  it('supports all-field and scoped search', async () => {
    useUserMfa.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'mfa-1', user_id: 'user-1', channel: 'EMAIL', is_enabled: true },
          { id: 'mfa-2', user_id: 'user-2', channel: 'SMS', is_enabled: false },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: {
        items: [
          { id: 'user-1', name: 'Alice Johnson', tenant_id: 'tenant-1' },
          { id: 'user-2', name: 'Bob Smith', tenant_id: 'tenant-2' },
        ],
      },
      reset: mockResetUsers,
    });

    const { result } = await renderUseUserMfaListScreen();

    act(() => {
      result.current.onSearch('sms');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['mfa-2']);

    act(() => {
      result.current.onSearchScopeChange('user');
      result.current.onSearch('alice');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['mfa-1']);
  });

  it('supports advanced multi-condition OR filters', async () => {
    useUserMfa.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'mfa-1', user_id: 'user-1', channel: 'EMAIL', is_enabled: true },
          { id: 'mfa-2', user_id: 'user-2', channel: 'SMS', is_enabled: false },
          { id: 'mfa-3', user_id: 'user-3', channel: 'PUSH', is_enabled: true },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: {
        items: [
          { id: 'user-1', name: 'Alice', tenant_id: 'tenant-1' },
          { id: 'user-2', name: 'Bob', tenant_id: 'tenant-1' },
          { id: 'user-3', name: 'Chris', tenant_id: 'tenant-1' },
        ],
      },
      reset: mockResetUsers,
    });

    const { result } = await renderUseUserMfaListScreen();
    const firstFilterId = result.current.filters[0].id;

    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'user');
      result.current.onFilterOperatorChange(firstFilterId, 'contains');
      result.current.onFilterValueChange(firstFilterId, 'alice');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;
    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'channel');
      result.current.onFilterOperatorChange(secondFilterId, 'contains');
      result.current.onFilterValueChange(secondFilterId, 'sms');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((item) => item.id)).toEqual(['mfa-1', 'mfa-2']);
  });

  it('loads and persists table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      searchScope: 'channel',
      filterLogic: 'OR',
      sortField: 'channel',
      sortDirection: 'desc',
      columnOrder: ['channel', 'user', 'enabled'],
      visibleColumns: ['channel', 'user'],
      filters: [{ id: 'stored-filter', field: 'channel', operator: 'contains', value: 'sms' }],
    });

    const { result } = await renderUseUserMfaListScreen();

    await waitFor(() => {
      expect(result.current.pageSize).toBe(20);
      expect(result.current.density).toBe('comfortable');
      expect(result.current.searchScope).toBe('channel');
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

    await renderUseUserMfaListScreen();
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('blocks opening records outside tenant scope', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserMfa.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'mfa-2', user_id: 'user-2', channel: 'EMAIL', is_enabled: true, tenant_id: 'tenant-2' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-2', name: 'External User', tenant_id: 'tenant-2' }] },
      reset: mockResetUsers,
    });

    const { result } = await renderUseUserMfaListScreen();
    act(() => {
      result.current.onItemPress('mfa-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/user-mfas?notice=accessDenied');
  });

  it('does not remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);

    const { result } = await renderUseUserMfaListScreen();
    await act(async () => {
      await result.current.onDelete('mfa-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('masks technical values for standard users', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserMfa.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{
          id: 'mfa-1',
          user_id: 'user-raw',
          channel: 'raw-channel',
          is_enabled: 'raw-status',
          tenant_id: 'tenant-1',
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [] },
      reset: mockResetUsers,
    });

    const { result } = await renderUseUserMfaListScreen();
    const item = result.current.items[0];

    expect(result.current.resolveUserLabel(item)).toBe('userMfa.list.currentUserLabel');
    expect(result.current.resolveChannelLabel(item)).toBe('userMfa.list.currentChannelLabel');
    expect(result.current.resolveEnabledLabel(item)).toBe('userMfa.list.currentStatusLabel');
  });
});
