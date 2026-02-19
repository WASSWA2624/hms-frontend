/**
 * useApiKeyDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = { id: 'key-1' };

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useApiKey: jest.fn(),
  useTenantAccess: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

const useApiKeyDetailScreen = require('@platform/screens/settings/ApiKeyDetailScreen/useApiKeyDetailScreen').default;
const { useApiKey, useTenantAccess } = require('@hooks');

describe('useApiKeyDetailScreen', () => {
  const mockGet = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'key-1' };

    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });

    useApiKey.mockReturnValue({
      get: mockGet,
      data: { id: 'key-1', name: 'Integration Key', tenant_id: 'tenant-1' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('redirects users without API key access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useApiKeyDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('returns API key data, handlers, and read-only actions', () => {
    const { result } = renderHook(() => useApiKeyDetailScreen());

    expect(result.current.apiKey).toEqual({
      id: 'key-1',
      name: 'Integration Key',
      tenant_id: 'tenant-1',
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

    const { result } = renderHook(() => useApiKeyDetailScreen());

    expect(result.current.canViewTechnicalIds).toBe(false);
  });

  it('calls get on mount with id', () => {
    renderHook(() => useApiKeyDetailScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('key-1');
  });

  it('does not fetch detail when tenant-scoped access has no tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useApiKeyDetailScreen());

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
    useApiKey.mockReturnValue({
      get: mockGet,
      data: { id: 'key-1', tenant_id: 'tenant-2', name: 'External Key' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useApiKeyDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/api-keys?notice=accessDenied');
  });

  it('redirects to list with accessDenied when backend returns forbidden', () => {
    useApiKey.mockReturnValue({
      get: mockGet,
      data: null,
      isLoading: false,
      errorCode: 'FORBIDDEN',
      reset: mockReset,
    });

    renderHook(() => useApiKeyDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/api-keys?notice=accessDenied');
  });

  it('onRetry refetches detail', () => {
    const { result } = renderHook(() => useApiKeyDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();

    act(() => {
      result.current.onRetry();
    });

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('key-1');
  });

  it('onBack pushes list route', () => {
    const { result } = renderHook(() => useApiKeyDetailScreen());

    act(() => {
      result.current.onBack();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/api-keys');
  });
});
