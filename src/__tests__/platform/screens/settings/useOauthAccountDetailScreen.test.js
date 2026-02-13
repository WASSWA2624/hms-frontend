/**
 * useOauthAccountDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useOauthAccountDetailScreen = require('@platform/screens/settings/OauthAccountDetailScreen/useOauthAccountDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = { id: 'oauth-1' };

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

describe('useOauthAccountDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'oauth-1' };
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useOauthAccount.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns state and handlers', () => {
    const { result } = renderHook(() => useOauthAccountDetailScreen());
    expect(result.current.id).toBe('oauth-1');
    expect(result.current.oauthAccount).toBeNull();
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('calls get(id) on mount', () => {
    renderHook(() => useOauthAccountDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('oauth-1');
  });

  it('onBack pushes list route', () => {
    const { result } = renderHook(() => useOauthAccountDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts');
  });

  it('onEdit pushes edit route', () => {
    const { result } = renderHook(() => useOauthAccountDetailScreen());
    result.current.onEdit();
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts/oauth-1/edit');
  });

  it('onDelete removes and pushes deleted notice', async () => {
    mockRemove.mockResolvedValue({ id: 'oauth-1' });
    const { result } = renderHook(() => useOauthAccountDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(confirmAction).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalledWith('oauth-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts?notice=deleted');
  });

  it('onDelete uses queued notice while offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'oauth-1' });
    const { result } = renderHook(() => useOauthAccountDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/oauth-accounts?notice=queued');
  });

  it('onDelete does nothing when id is missing', async () => {
    mockParams = {};
    const { result } = renderHook(() => useOauthAccountDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });
});
