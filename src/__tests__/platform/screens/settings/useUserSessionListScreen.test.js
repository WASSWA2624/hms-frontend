/**
 * useUserSessionListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useUserSessionListScreen = require('@platform/screens/settings/UserSessionListScreen/useUserSessionListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};
jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useUserSession: jest.fn(),
  useTenantAccess: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@utils', () => ({
  confirmAction: jest.fn(() => true),
}));

const { useUserSession, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useUserSessionListScreen', () => {
  const mockList = jest.fn();
  const mockRevoke = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserSession.mockReturnValue({
      list: mockList,
      revoke: mockRevoke,
      data: { items: [], pagination: {} },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns items, handlers, and state', () => {
    const { result } = renderHook(() => useUserSessionListScreen());
    expect(result.current.items).toEqual([]);
    expect(result.current.noticeMessage).toBeNull();
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onSessionPress).toBe('function');
    expect(typeof result.current.onRevoke).toBe('function');
  });

  it('calls list on mount', () => {
    renderHook(() => useUserSessionListScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRetry calls fetchList', () => {
    const { result } = renderHook(() => useUserSessionListScreen());
    mockReset.mockClear();
    mockList.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onSessionPress pushes route with id', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useUserSessionListScreen());
    result.current.onSessionPress('sid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/user-sessions/sid-1');
  });

  it('exposes errorMessage when errorCode set', () => {
    useUserSession.mockReturnValue({
      list: mockList,
      revoke: mockRevoke,
      data: { items: [] },
      isLoading: false,
      errorCode: 'SESSION_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useUserSessionListScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onRevoke calls revoke then fetchList', async () => {
    mockRevoke.mockResolvedValue({ id: 'sid-1' });
    mockReset.mockClear();
    mockList.mockClear();
    const { result } = renderHook(() => useUserSessionListScreen());
    await act(async () => {
      await result.current.onRevoke('sid-1');
    });
    expect(mockRevoke).toHaveBeenCalledWith('sid-1');
    expect(confirmAction).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRevoke calls stopPropagation when event provided', async () => {
    const stopPropagation = jest.fn();
    mockRevoke.mockResolvedValue({ id: 'sid-1' });
    const { result } = renderHook(() => useUserSessionListScreen());
    await act(async () => {
      await result.current.onRevoke('sid-1', { stopPropagation });
    });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onRevoke does not refetch when revoke returns no result', async () => {
    mockRevoke.mockResolvedValue(undefined);
    const { result } = renderHook(() => useUserSessionListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onRevoke('sid-1');
    });
    expect(mockRevoke).toHaveBeenCalledWith('sid-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('onRevoke does not call revoke when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useUserSessionListScreen());
    await act(async () => {
      await result.current.onRevoke('sid-1');
    });
    expect(mockRevoke).not.toHaveBeenCalled();
  });
});
