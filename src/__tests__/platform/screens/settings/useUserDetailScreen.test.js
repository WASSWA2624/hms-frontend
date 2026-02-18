/**
 * useUserDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useUserDetailScreen = require('@platform/screens/settings/UserDetailScreen/useUserDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useUser: jest.fn(),
  useTenantAccess: jest.fn(),
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
  useLocalSearchParams: () => ({ id: 'uid-1' }),
}));

const { useUser, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useUserDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useUser.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'uid-1', email: 'user@acme.org' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns user, handlers, and technical-id visibility for global admins', () => {
    const { result } = renderHook(() => useUserDetailScreen());
    expect(result.current.user).toEqual({ id: 'uid-1', email: 'user@acme.org' });
    expect(result.current.canViewTechnicalIds).toBe(true);
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('calls get on mount with route id', () => {
    renderHook(() => useUserDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('uid-1');
  });

  it('redirects users without user access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useUserDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('redirects tenant-scoped admins when user tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUser.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'uid-1', tenant_id: 'tenant-2', email: 'external@acme.org' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useUserDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/users?notice=accessDenied');
  });

  it('onDelete navigates with deleted notice on success', async () => {
    mockRemove.mockResolvedValue({ id: 'uid-1' });
    const { result } = renderHook(() => useUserDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).toHaveBeenCalledWith('uid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/users?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'uid-1' });
    const { result } = renderHook(() => useUserDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/users?notice=queued');
  });

  it('onDelete is canceled when confirmation is declined', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useUserDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
