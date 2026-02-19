/**
 * useUserSessionDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = { id: 'session-1' };

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (key) => key })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useUserSession: jest.fn(),
  useTenantAccess: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

const useUserSessionDetailScreen = require('@platform/screens/settings/UserSessionDetailScreen/useUserSessionDetailScreen').default;
const { useUserSession, useTenantAccess } = require('@hooks');

describe('useUserSessionDetailScreen', () => {
  const mockGet = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'session-1' };

    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });

    useUserSession.mockReturnValue({
      get: mockGet,
      data: { id: 'session-1', tenant_id: 'tenant-1', session_name: 'Primary Session' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('redirects users without session access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useUserSessionDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('returns session data, handlers, and read-only actions', () => {
    const { result } = renderHook(() => useUserSessionDetailScreen());

    expect(result.current.id).toBe('session-1');
    expect(result.current.session).toEqual({
      id: 'session-1',
      tenant_id: 'tenant-1',
      session_name: 'Primary Session',
    });
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
    expect(result.current.canViewTechnicalIds).toBe(true);
  });

  it('hides technical IDs for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useUserSessionDetailScreen());
    expect(result.current.canViewTechnicalIds).toBe(false);
  });

  it('calls get on mount with id', () => {
    renderHook(() => useUserSessionDetailScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('session-1');
  });

  it('does not fetch detail when id is missing', () => {
    mockParams = {};

    renderHook(() => useUserSessionDetailScreen());

    expect(mockReset).not.toHaveBeenCalled();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch detail when tenant-scoped access has no tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useUserSessionDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(mockReset).not.toHaveBeenCalled();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('redirects tenant-scoped users when record tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserSession.mockReturnValue({
      get: mockGet,
      data: { id: 'session-1', tenant_id: 'tenant-2', session_name: 'External Session' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useUserSessionDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/user-sessions?notice=accessDenied');
  });

  it('redirects to list with accessDenied when backend returns forbidden', () => {
    useUserSession.mockReturnValue({
      get: mockGet,
      data: null,
      isLoading: false,
      errorCode: 'FORBIDDEN',
      reset: mockReset,
    });

    renderHook(() => useUserSessionDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/user-sessions?notice=accessDenied');
  });

  it('onRetry refetches detail', () => {
    const { result } = renderHook(() => useUserSessionDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();

    act(() => {
      result.current.onRetry();
    });

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('session-1');
  });

  it('onBack pushes list route', () => {
    const { result } = renderHook(() => useUserSessionDetailScreen());

    act(() => {
      result.current.onBack();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/user-sessions');
  });

  it('masks technical labels for standard users', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserSession.mockReturnValue({
      get: mockGet,
      data: {
        id: '8f4fd148-2502-4edb-bf1d-c1f5c66182fd',
        user_id: '910f0d1f-66fd-4490-8e4a-cc8ef00a4bf6',
        tenant_id: 'tenant-1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserSessionDetailScreen());

    expect(result.current.sessionLabel).toBe('userSession.detail.currentSessionLabel');
    expect(result.current.userLabel).toBe('userSession.detail.currentUserLabel');
  });
});
