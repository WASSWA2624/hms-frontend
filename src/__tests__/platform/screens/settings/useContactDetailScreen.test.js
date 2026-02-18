/**
 * useContactDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useContactDetailScreen = require('@platform/screens/settings/ContactDetailScreen/useContactDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useContact: jest.fn(),
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
  useLocalSearchParams: () => ({ id: 'cid-1' }),
}));

const { useContact, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useContactDetailScreen', () => {
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
    useContact.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'cid-1', value: 'contact@acme.org' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns contact, handlers, and state', () => {
    const { result } = renderHook(() => useContactDetailScreen());
    expect(result.current.contact).toEqual({ id: 'cid-1', value: 'contact@acme.org' });
    expect(result.current.canViewTechnicalIds).toBe(true);
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('redirects users without contact access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useContactDetailScreen());

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

    renderHook(() => useContactDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users when contact tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useContact.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'cid-1', tenant_id: 'tenant-2', value: 'external@acme.org' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useContactDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/contacts?notice=accessDenied');
  });

  it('calls get on mount with id', () => {
    renderHook(() => useContactDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('cid-1');
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => useContactDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('cid-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useContactDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/contacts');
  });

  it('onEdit pushes edit route when id available', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useContactDetailScreen());
    result.current.onEdit();
    expect(mockPush).toHaveBeenCalledWith('/settings/contacts/cid-1/edit');
  });

  it('exposes errorMessage when errorCode set', () => {
    useContact.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'CONTACT_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useContactDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then navigates with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'cid-1' });
    mockPush.mockClear();
    const { result } = renderHook(() => useContactDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('cid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/contacts?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'cid-1' });
    const { result } = renderHook(() => useContactDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/contacts?notice=queued');
  });

  it('onDelete does not navigate when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useContactDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('cid-1');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useContactDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('cid-1');
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useContactDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles null contact when data is null', () => {
    useContact.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useContactDetailScreen());
    expect(result.current.contact).toBeNull();
  });

  it('handles null contact when data is array', () => {
    useContact.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useContactDetailScreen());
    expect(result.current.contact).toBeNull();
  });
});