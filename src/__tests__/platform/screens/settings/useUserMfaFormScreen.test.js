/**
 * useUserMfaFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k, values) => (values?.index ? `${k}.${values.index}` : k) })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useTenantAccess: jest.fn(),
  useUserMfa: jest.fn(),
  useUser: jest.fn(),
}));

const {
  useNetwork,
  useTenantAccess,
  useUserMfa,
  useUser,
} = require('@hooks');
const useUserMfaFormScreen = require('@platform/screens/settings/UserMfaFormScreen/useUserMfaFormScreen').default;

describe('useUserMfaFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();

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
    useUserMfa.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-1', name: 'Alice', tenant_id: 'tenant-1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });
  });

  it('returns create state and loads users with capped limit 100', () => {
    const { result } = renderHook(() => useUserMfaFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(mockResetUsers).toHaveBeenCalled();
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('loads edit detail when route id is provided', () => {
    mockParams = { id: 'mfa-1' };
    renderHook(() => useUserMfaFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('mfa-1');
  });

  it('scopes user lookup for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => useUserMfaFormScreen());
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('masks raw ids in user option labels for non-super users', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-raw', tenant_id: 'tenant-1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });

    const { result } = renderHook(() => useUserMfaFormScreen());
    expect(result.current.userOptions[0].label).toBe('userMfa.form.userOptionFallback.1');
  });

  it('keeps technical fallback labels for super admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-raw' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });

    const { result } = renderHook(() => useUserMfaFormScreen());
    expect(result.current.userOptions[0].label).toBe('user-raw');
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'mfa-1' });

    const { result } = renderHook(() => useUserMfaFormScreen());
    act(() => {
      result.current.setUserId(' user-1 ');
      result.current.setChannel(' EMAIL ');
      result.current.setSecret(' secret ');
      result.current.setIsEnabled(false);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      channel: 'EMAIL',
      is_enabled: false,
      user_id: 'user-1',
      secret_encrypted: 'secret',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/user-mfas?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'mfa-1' };
    useUserMfa.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: { id: 'mfa-1', user_id: 'user-1', channel: 'EMAIL', is_enabled: true },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    mockUpdate.mockResolvedValue({ id: 'mfa-1' });

    const { result } = renderHook(() => useUserMfaFormScreen());
    act(() => {
      result.current.setChannel('SMS');
      result.current.setSecret('');
      result.current.setIsEnabled(true);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('mfa-1', {
      channel: 'SMS',
      is_enabled: true,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/user-mfas?notice=updated');
  });

  it('prevents tenant-scoped submissions for out-of-scope users', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-2', name: 'External', tenant_id: 'tenant-2' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });

    const { result } = renderHook(() => useUserMfaFormScreen());
    act(() => {
      result.current.setUserId('user-2');
      result.current.setChannel('EMAIL');
      result.current.setSecret('secret');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/settings/user-mfas?notice=accessDenied');
  });

  it('uses queued notice while offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'mfa-1' });

    const { result } = renderHook(() => useUserMfaFormScreen());
    act(() => {
      result.current.setUserId('user-1');
      result.current.setChannel('EMAIL');
      result.current.setSecret('secret');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockReplace).toHaveBeenCalledWith('/settings/user-mfas?notice=queued');
  });

  it('routes to users and retries user loading', () => {
    const { result } = renderHook(() => useUserMfaFormScreen());

    act(() => {
      result.current.onGoToUsers();
      result.current.onRetryUsers();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/users');
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('redirects unauthorized users out of the form', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useUserMfaFormScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });
});
