/**
 * useAddressDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useAddressDetailScreen = require('@platform/screens/settings/AddressDetailScreen/useAddressDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useAddress: jest.fn(),
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
  useLocalSearchParams: () => ({ id: 'bid-1' }),
}));

const { useAddress, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useAddressDetailScreen', () => {
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
    useAddress.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'bid-1', name: 'Test Address' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns address, handlers, and state', () => {
    const { result } = renderHook(() => useAddressDetailScreen());
    expect(result.current.address).toEqual({ id: 'bid-1', name: 'Test Address' });
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('redirects users without address access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useAddressDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('redirects tenant-scoped users without tenant id', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useAddressDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users when address tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useAddress.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'bid-1', tenant_id: 'tenant-2', name: 'Test Address' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useAddressDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/addresses?notice=accessDenied');
    expect(result.current.address).toBeNull();
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('calls get on mount with id', () => {
    renderHook(() => useAddressDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('bid-1');
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => useAddressDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('bid-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useAddressDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/addresses');
  });

  it('onEdit pushes edit route when id available', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useAddressDetailScreen());
    result.current.onEdit();
    expect(mockPush).toHaveBeenCalledWith('/settings/addresses/bid-1/edit');
  });

  it('exposes errorMessage when errorCode set', () => {
    useAddress.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'ADDRESS_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useAddressDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then navigates with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'bid-1' });
    mockPush.mockClear();
    const { result } = renderHook(() => useAddressDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/addresses?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'bid-1' });
    const { result } = renderHook(() => useAddressDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/addresses?notice=queued');
  });

  it('onDelete does not navigate when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useAddressDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useAddressDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useAddressDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles null address when data is null', () => {
    useAddress.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useAddressDetailScreen());
    expect(result.current.address).toBeNull();
  });

  it('handles null address when data is array', () => {
    useAddress.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useAddressDetailScreen());
    expect(result.current.address).toBeNull();
  });
});
