/**
 * useTenantFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useTenantFormScreen = require('@platform/screens/settings/TenantFormScreen/useTenantFormScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useTenant: jest.fn(),
}));

const { useI18n, useNetwork, useTenant } = require('@hooks');

describe('useTenantFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useI18n.mockReturnValue({ t: (k) => k });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenant.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns initial state for create', () => {
    const { result } = renderHook(() => useTenantFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.name).toBe('');
    expect(result.current.slug).toBe('');
    expect(result.current.isActive).toBe(true);
    expect(result.current.tenant).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'tid-1' };
    renderHook(() => useTenantFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('tid-1');
  });

  it('hydrates form state from tenant data', () => {
    mockParams = { id: 'tid-1' };
    useTenant.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: { name: 'Acme', slug: 'acme', is_active: false },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useTenantFormScreen());
    expect(result.current.name).toBe('Acme');
    expect(result.current.slug).toBe('acme');
    expect(result.current.isActive).toBe(false);
  });

  it('uses fallback error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'tenant.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    useTenant.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useTenantFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('uses resolved error message when translation exists', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'errors.codes.TENANT_NOT_FOUND' ? 'Tenant missing' : k),
    });
    useTenant.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'TENANT_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useTenantFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Tenant missing');
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 't1' });
    const { result } = renderHook(() => useTenantFormScreen());
    act(() => {
      result.current.setName('  Acme  ');
      result.current.setSlug('  acme  ');
      result.current.setIsActive(false);
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).toHaveBeenCalledWith({
      name: 'Acme',
      slug: 'acme',
      is_active: false,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/tenants');
  });

  it('omits slug when creating with blank value', async () => {
    mockCreate.mockResolvedValue({ id: 't2' });
    const { result } = renderHook(() => useTenantFormScreen());
    act(() => {
      result.current.setName('Tenant');
      result.current.setSlug('   ');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).toHaveBeenCalledWith({
      name: 'Tenant',
      slug: undefined,
      is_active: true,
    });
  });

  it('does not navigate when create returns undefined', async () => {
    mockCreate.mockResolvedValue(undefined);
    const { result } = renderHook(() => useTenantFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'tid-1' };
    mockUpdate.mockResolvedValue({ id: 'tid-1' });
    const { result } = renderHook(() => useTenantFormScreen());
    act(() => {
      result.current.setName('  Acme  ');
      result.current.setSlug('   ');
      result.current.setIsActive(true);
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockUpdate).toHaveBeenCalledWith('tid-1', {
      name: 'Acme',
      slug: null,
      is_active: true,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/tenants');
  });

  it('keeps slug when updating with value', async () => {
    mockParams = { id: 'tid-1' };
    mockUpdate.mockResolvedValue({ id: 'tid-1' });
    const { result } = renderHook(() => useTenantFormScreen());
    act(() => {
      result.current.setName('Tenant');
      result.current.setSlug(' tenant-slug ');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockUpdate).toHaveBeenCalledWith('tid-1', {
      name: 'Tenant',
      slug: 'tenant-slug',
      is_active: true,
    });
  });

  it('does not navigate when update returns undefined', async () => {
    mockParams = { id: 'tid-1' };
    mockUpdate.mockResolvedValue(undefined);
    const { result } = renderHook(() => useTenantFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('swallows update errors without crashing', async () => {
    mockParams = { id: 'tid-1' };
    mockUpdate.mockRejectedValue(new Error('update failed'));
    const { result } = renderHook(() => useTenantFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useTenantFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('exposes offline state', () => {
    useNetwork.mockReturnValue({ isOffline: true });
    const { result } = renderHook(() => useTenantFormScreen());
    expect(result.current.isOffline).toBe(true);
  });
});
