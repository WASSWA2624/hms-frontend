/**
 * useUserFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useUserFormScreen = require('@platform/screens/settings/UserFormScreen/useUserFormScreen').default;

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
  useUser: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useI18n,
  useNetwork,
  useUser,
  useTenant,
  useFacility,
  useTenantAccess,
} = require('@hooks');

describe('useUserFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useI18n.mockReturnValue({ t: (k) => k });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUser.mockReturnValue({
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
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
  });

  it('returns initial state for create', () => {
    const { result } = renderHook(() => useUserFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.tenantId).toBe('');
    expect(result.current.facilityId).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.phone).toBe('');
    expect(result.current.status).toBe('ACTIVE');
    expect(result.current.user).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'uid-1' };
    renderHook(() => useUserFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('uid-1');
  });

  it('lists tenants on mount when creating', () => {
    renderHook(() => useUserFormScreen());
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 200 });
  });

  it('hydrates form state from user data', () => {
    mockParams = { id: 'uid-1' };
    useUser.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        email: 'test@example.com',
        phone: '+15551234567',
        status: 'INACTIVE',
        tenant_id: 't1',
        facility_id: 'f1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useUserFormScreen());
    expect(result.current.email).toBe('test@example.com');
    expect(result.current.phone).toBe('+15551234567');
    expect(result.current.status).toBe('INACTIVE');
    expect(result.current.tenantId).toBe('t1');
    expect(result.current.facilityId).toBe('f1');
  });

  it('lists facilities when tenantId is set', () => {
    const { result } = renderHook(() => useUserFormScreen());
    act(() => {
      result.current.setTenantId('t1');
    });
    expect(mockResetFacilities).toHaveBeenCalled();
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 200, tenant_id: 't1' });
  });

  it('uses fallback error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'user.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    useUser.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useUserFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('uses fallback tenant error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'user.form.tenantLoadErrorMessage' ? 'Tenant fallback' : k),
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetTenants,
    });
    const { result } = renderHook(() => useUserFormScreen());
    expect(result.current.tenantListError).toBe(true);
    expect(result.current.tenantErrorMessage).toBe('Tenant fallback');
  });

  it('uses fallback facility error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'user.form.facilityLoadErrorMessage' ? 'Facility fallback' : k),
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetFacilities,
    });
    const { result } = renderHook(() => useUserFormScreen());
    expect(result.current.facilityListError).toBe(true);
    expect(result.current.facilityErrorMessage).toBe('Facility fallback');
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'u1' });
    const { result } = renderHook(() => useUserFormScreen());
    act(() => {
      result.current.setTenantId(' t1 ');
      result.current.setFacilityId(' f1 ');
      result.current.setEmail('  test@example.com  ');
      result.current.setPhone('  +15551234567  ');
      result.current.setPassword('  secret123  ');
      result.current.setStatus('ACTIVE');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 't1',
      facility_id: 'f1',
      email: 'test@example.com',
      phone: '+15551234567',
      status: 'ACTIVE',
      password: 'secret123',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/users?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'uid-1' };
    mockUpdate.mockResolvedValue({ id: 'uid-1' });
    const { result } = renderHook(() => useUserFormScreen());
    act(() => {
      result.current.setEmail('  test@example.com  ');
      result.current.setPhone('');
      result.current.setFacilityId('');
      result.current.setStatus('INACTIVE');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockUpdate).toHaveBeenCalledWith('uid-1', {
      email: 'test@example.com',
      status: 'INACTIVE',
      phone: null,
      facility_id: null,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/users?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'u1' });
    const { result } = renderHook(() => useUserFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setEmail('test@example.com');
      result.current.setPassword('secret123');
      result.current.setStatus('ACTIVE');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/users?notice=queued');
  });

  it('does not navigate when create returns undefined', async () => {
    mockCreate.mockResolvedValue(undefined);
    const { result } = renderHook(() => useUserFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setEmail('test@example.com');
      result.current.setPassword('secret123');
      result.current.setStatus('ACTIVE');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useUserFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useUserFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/users');
  });

  it('onGoToTenants navigates to tenants list', () => {
    const { result } = renderHook(() => useUserFormScreen());
    result.current.onGoToTenants();
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('onGoToFacilities navigates to facilities list', () => {
    const { result } = renderHook(() => useUserFormScreen());
    result.current.onGoToFacilities();
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities');
  });

  it('onRetryTenants reloads tenant list', () => {
    const { result } = renderHook(() => useUserFormScreen());
    result.current.onRetryTenants();
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 200 });
  });

  it('onRetryFacilities reloads facility list', () => {
    const { result } = renderHook(() => useUserFormScreen());
    act(() => {
      result.current.setTenantId('t1');
    });
    mockResetFacilities.mockClear();
    mockListFacilities.mockClear();
    result.current.onRetryFacilities();
    expect(mockResetFacilities).toHaveBeenCalled();
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 200, tenant_id: 't1' });
  });

  it('blocks submit when tenant access is denied', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });
    const { result } = renderHook(() => useUserFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setEmail('test@example.com');
      result.current.setPassword('secret123');
      result.current.setStatus('ACTIVE');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
