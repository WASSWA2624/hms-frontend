/**
 * useOauthAccountListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useOauthAccount: jest.fn(),
  useUser: jest.fn(),
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

const useOauthAccountListScreen = require('@platform/screens/settings/OauthAccountListScreen/useOauthAccountListScreen').default;
const {
  useI18n,
  useAuth,
  useNetwork,
  useOauthAccount,
  useUser,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useOauthAccountListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();

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

    useOauthAccount.mockReturnValue({
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

  const renderUseOauthAccountListScreen = async () => {
    const rendered = renderHook(() => useOauthAccountListScreen());
    await waitFor(() => {
      expect(asyncStorage.getItem).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(asyncStorage.setItem).toHaveBeenCalled();
    });
    return rendered;
  };

  it('loads list and user references with numeric params capped at 100', async () => {
    await renderUseOauthAccountListScreen();

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

  it('applies tenant scope only to user reference lookups', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    await renderUseOauthAccountListScreen();

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('does not fetch list or references while offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });

    await renderUseOauthAccountListScreen();

    expect(mockReset).not.toHaveBeenCalled();
    expect(mockList).not.toHaveBeenCalled();
    expect(mockResetUsers).not.toHaveBeenCalled();
    expect(mockListUsers).not.toHaveBeenCalled();
  });

  it('supports all-field and scoped search', async () => {
    useOauthAccount.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'oac-1', user_id: 'user-1', provider: 'Google', provider_user_id: 'alice-google' },
          { id: 'oac-2', user_id: 'user-2', provider: 'Microsoft', provider_user_id: 'billing-bridge' },
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
          { id: 'user-1', name: 'Alice Carter', tenant_id: 'tenant-1' },
          { id: 'user-2', name: 'Billing Sync User', tenant_id: 'tenant-1' },
        ],
      },
      reset: mockResetUsers,
    });

    const { result } = await renderUseOauthAccountListScreen();

    act(() => {
      result.current.onSearch('billing');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['oac-2']);

    act(() => {
      result.current.onSearchScopeChange('provider');
      result.current.onSearch('google');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['oac-1']);
  });

  it('filters out records outside tenant scope and blocks direct open', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useOauthAccount.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'oac-1', user_id: 'user-1', provider: 'Google', provider_user_id: 'alice-google' },
          { id: 'oac-2', user_id: 'user-2', provider: 'Microsoft', provider_user_id: 'external-user' },
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
          { id: 'user-1', name: 'Scoped User', tenant_id: 'tenant-1' },
          { id: 'user-2', name: 'External User', tenant_id: 'tenant-2' },
        ],
      },
      reset: mockResetUsers,
    });

    const { result } = await renderUseOauthAccountListScreen();
    expect(result.current.items.map((item) => item.id)).toEqual(['oac-1']);

    act(() => {
      result.current.onItemPress('oac-2');
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts?notice=accessDenied');
  });

  it('deletes record and refetches list', async () => {
    useOauthAccount.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{ id: 'oac-1', user_id: 'user-1', provider: 'Google', provider_user_id: 'alice-google' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-1', name: 'Scoped User', tenant_id: 'tenant-1' }] },
      reset: mockResetUsers,
    });
    mockRemove.mockResolvedValue({ id: 'oac-1' });

    const { result } = await renderUseOauthAccountListScreen();

    await act(async () => {
      await result.current.onDelete('oac-1');
    });

    expect(mockRemove).toHaveBeenCalledWith('oac-1');
    expect(mockList).toHaveBeenLastCalledWith({ page: 1, limit: 100 });
    expect(result.current.noticeMessage).toBe('oauthAccount.list.noticeDeleted');
  });

  it('does not delete when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    useOauthAccount.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{ id: 'oac-1', user_id: 'user-1', provider: 'Google', provider_user_id: 'alice-google' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-1', name: 'Scoped User', tenant_id: 'tenant-1' }] },
      reset: mockResetUsers,
    });

    const { result } = await renderUseOauthAccountListScreen();

    await act(async () => {
      await result.current.onDelete('oac-1');
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('maps notice query value and clears the param', async () => {
    mockParams = { notice: 'accessDenied' };

    const { result } = await renderUseOauthAccountListScreen();
    await waitFor(() => {
      expect(result.current.noticeMessage).toBe('oauthAccount.list.noticeAccessDenied');
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts');
  });

  it('redirects unauthorized users and hides write actions', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = await renderUseOauthAccountListScreen();
    expect(mockReplace).toHaveBeenCalledWith('/settings');
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
    useOauthAccount.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{
          id: 'oac-1',
          tenant_id: 'tenant-1',
          user_id: '910f0d1f-66fd-4490-8e4a-cc8ef00a4bf6',
          provider: 'Google',
          provider_user_id: '8f4fd148-2502-4edb-bf1d-c1f5c66182fd',
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

    const { result } = await renderUseOauthAccountListScreen();
    const item = result.current.items[0];

    expect(result.current.resolveUserLabel(item)).toBe('oauthAccount.list.currentUserLabel');
    expect(result.current.resolveProviderUserLabel(item)).toBe('oauthAccount.list.currentProviderUserLabel');
  });
});
