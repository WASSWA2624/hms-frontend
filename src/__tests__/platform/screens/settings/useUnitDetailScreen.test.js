/**
 * useUnitDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useUnitDetailScreen = require('@platform/screens/settings/UnitDetailScreen/useUnitDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useUnit: jest.fn(),
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

const { useUnit, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useUnitDetailScreen', () => {
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
    useUnit.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'uid-1', name: 'Test Unit' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns unit, handlers, and state', () => {
    const { result } = renderHook(() => useUnitDetailScreen());
    expect(result.current.unit).toEqual({ id: 'uid-1', name: 'Test Unit' });
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('redirects users without unit access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useUnitDetailScreen());

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

    renderHook(() => useUnitDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users when unit tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUnit.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'uid-1', tenant_id: 'tenant-2', name: 'Test Unit' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useUnitDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/units?notice=accessDenied');
  });

  it('calls get on mount with id', () => {
    renderHook(() => useUnitDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('uid-1');
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => useUnitDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('uid-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useUnitDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/units');
  });

  it('onEdit pushes edit route when id available', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useUnitDetailScreen());
    result.current.onEdit();
    expect(mockPush).toHaveBeenCalledWith('/settings/units/uid-1/edit');
  });

  it('exposes errorMessage when errorCode set', () => {
    useUnit.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'UNIT_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useUnitDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then navigates with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'uid-1' });
    mockPush.mockClear();
    const { result } = renderHook(() => useUnitDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('uid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/units?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'uid-1' });
    const { result } = renderHook(() => useUnitDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/units?notice=queued');
  });

  it('onDelete does not navigate when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useUnitDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('uid-1');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useUnitDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('uid-1');
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useUnitDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles null unit when data is null', () => {
    useUnit.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useUnitDetailScreen());
    expect(result.current.unit).toBeNull();
  });

  it('handles null unit when data is array', () => {
    useUnit.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useUnitDetailScreen());
    expect(result.current.unit).toBeNull();
  });
});
