/**
 * usePermissionFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const usePermissionFormScreen = require('@platform/screens/settings/PermissionFormScreen/usePermissionFormScreen').default;

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
  usePermission: jest.fn(),
  useTenant: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const { useI18n, useNetwork, usePermission, useTenant, useTenantAccess } = require('@hooks');

describe('usePermissionFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useI18n.mockReturnValue({ t: (k) => k });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    usePermission.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
  });

  it('redirects users without permission access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => usePermissionFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('prefills tenant for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => usePermissionFormScreen());

    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.tenantDisplayLabel).toBe('permission.form.currentTenantLabel');
    expect(result.current.tenantListLoading).toBe(false);
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('returns initial state for create', () => {
    const { result } = renderHook(() => usePermissionFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.tenantId).toBe('');
    expect(result.current.name).toBe('');
    expect(result.current.description).toBe('');
    expect(result.current.permission).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'pid-1' };
    renderHook(() => usePermissionFormScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('pid-1');
  });

  it('lists tenants on mount with capped numeric limit', () => {
    renderHook(() => usePermissionFormScreen());

    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('hydrates form state from permission data', () => {
    mockParams = { id: 'pid-1' };
    usePermission.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        tenant_id: 't1',
        name: 'Permission 1',
        description: 'Desc',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePermissionFormScreen());

    expect(result.current.tenantId).toBe('t1');
    expect(result.current.name).toBe('Permission 1');
    expect(result.current.description).toBe('Desc');
  });

  it('uses fallback error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'permission.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    usePermission.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });

    const { result } = renderHook(() => usePermissionFormScreen());

    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('uses fallback tenant error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'permission.form.tenantLoadErrorMessage' ? 'Tenant fallback' : k),
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetTenants,
    });

    const { result } = renderHook(() => usePermissionFormScreen());

    expect(result.current.tenantListError).toBe(true);
    expect(result.current.tenantErrorMessage).toBe('Tenant fallback');
  });

  it('submits create payload and navigates on success', async () => {
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    mockCreate.mockResolvedValue({ id: 'p1' });
    const { result } = renderHook(() => usePermissionFormScreen());

    act(() => {
      result.current.setTenantId(' t1 ');
      result.current.setName('  Permission 1  ');
      result.current.setDescription('  ');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 't1',
      name: 'Permission 1',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/permissions?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'pid-1' };
    mockUpdate.mockResolvedValue({ id: 'pid-1' });
    const { result } = renderHook(() => usePermissionFormScreen());

    act(() => {
      result.current.setName('  Permission Updated  ');
      result.current.setDescription('');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('pid-1', {
      name: 'Permission Updated',
      description: null,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/permissions?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'p1' });
    const { result } = renderHook(() => usePermissionFormScreen());

    act(() => {
      result.current.setTenantId('t1');
      result.current.setName('Permission 1');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockReplace).toHaveBeenCalledWith('/settings/permissions?notice=queued');
  });

  it('does not navigate when create returns undefined', async () => {
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    mockCreate.mockResolvedValue(undefined);
    const { result } = renderHook(() => usePermissionFormScreen());

    act(() => {
      result.current.setTenantId('t1');
      result.current.setName('Permission 1');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => usePermissionFormScreen());

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => usePermissionFormScreen());

    act(() => {
      result.current.onCancel();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/permissions');
  });

  it('onGoToTenants navigates to tenants list', () => {
    const { result } = renderHook(() => usePermissionFormScreen());

    act(() => {
      result.current.onGoToTenants();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('onRetryTenants reloads tenant list with capped pagination', () => {
    const { result } = renderHook(() => usePermissionFormScreen());

    act(() => {
      result.current.onRetryTenants();
    });

    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });
});
