/**
 * useOauthAccountListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useOauthAccountListScreen = require('@platform/screens/settings/OauthAccountListScreen/useOauthAccountListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useOauthAccount: jest.fn(),
  useTenantAccess: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@utils', () => ({
  confirmAction: jest.fn(() => true),
}));

const { useOauthAccount, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useOauthAccountListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
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
  });

  it('returns items, handlers, and state', () => {
    const { result } = renderHook(() => useOauthAccountListScreen());
    expect(result.current.items).toEqual([]);
    expect(result.current.noticeMessage).toBeNull();
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onItemPress).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
    expect(typeof result.current.onAdd).toBe('function');
  });

  it('calls list on mount', () => {
    renderHook(() => useOauthAccountListScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRetry calls fetchList', () => {
    const { result } = renderHook(() => useOauthAccountListScreen());
    mockReset.mockClear();
    mockList.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onItemPress pushes route with id', () => {
    const { result } = renderHook(() => useOauthAccountListScreen());
    result.current.onItemPress('oauth-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts/oauth-1');
  });

  it('onAdd pushes create route', () => {
    const { result } = renderHook(() => useOauthAccountListScreen());
    result.current.onAdd();
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts/create');
  });

  it('onDelete calls remove then fetches list', async () => {
    mockRemove.mockResolvedValue({ id: 'oauth-1' });
    const { result } = renderHook(() => useOauthAccountListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onDelete('oauth-1');
    });
    expect(confirmAction).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalledWith('oauth-1');
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onDelete calls stopPropagation when event provided', async () => {
    const stopPropagation = jest.fn();
    mockRemove.mockResolvedValue({ id: 'oauth-1' });
    const { result } = renderHook(() => useOauthAccountListScreen());
    await act(async () => {
      await result.current.onDelete('oauth-1', { stopPropagation });
    });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useOauthAccountListScreen());
    await act(async () => {
      await result.current.onDelete('oauth-1');
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('reads notice from params and clears query via replace', () => {
    mockParams = { notice: 'created' };
    const { result } = renderHook(() => useOauthAccountListScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings/oauth-accounts');
    expect(result.current.noticeMessage).toBe('oauthAccount.list.noticeCreated');
  });

  it('uses queued notice on delete when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'oauth-1' });
    const { result } = renderHook(() => useOauthAccountListScreen());
    await act(async () => {
      await result.current.onDelete('oauth-1');
    });
    expect(result.current.noticeMessage).toBe('oauthAccount.list.noticeQueued');
  });
});
