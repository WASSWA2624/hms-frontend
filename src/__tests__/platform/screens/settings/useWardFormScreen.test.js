/**
 * useWardFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useWardFormScreen = require('@platform/screens/settings/WardFormScreen/useWardFormScreen').default;

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
  useWard: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useI18n,
  useNetwork,
  useWard,
  useTenant,
  useFacility,
  useTenantAccess,
} = require('@hooks');

describe('useWardFormScreen', () => {
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
      tenantId: null,
      isResolved: true,
    });
    useWard.mockReturnValue({
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

  it('redirects users without ward access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useWardFormScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('prefills tenant for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useWardFormScreen());

    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.tenantListLoading).toBe(false);
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('returns initial state for create', () => {
    const { result } = renderHook(() => useWardFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.name).toBe('');
    expect(result.current.wardType).toBe('');
    expect(result.current.isActive).toBe(true);
    expect(result.current.tenantId).toBe('');
    expect(result.current.facilityId).toBe('');
    expect(result.current.ward).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'rid-1' };
    renderHook(() => useWardFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('rid-1');
  });

  it('lists tenants on mount when creating', () => {
    renderHook(() => useWardFormScreen());
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const params = mockListTenants.mock.calls[mockListTenants.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('hydrates form state from ward data', () => {
    mockParams = { id: 'rid-1' };
    useWard.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        name: 'General Ward',
        ward_type: 'GENERAL',
        is_active: false,
        tenant_id: 't1',
        facility_id: 'f1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useWardFormScreen());
    expect(result.current.name).toBe('General Ward');
    expect(result.current.wardType).toBe('GENERAL');
    expect(result.current.isActive).toBe(false);
    expect(result.current.tenantId).toBe('t1');
    expect(result.current.facilityId).toBe('f1');
  });

  it('lists facilities when tenantId is set', () => {
    const { result } = renderHook(() => useWardFormScreen());
    act(() => {
      result.current.setTenantId('t1');
    });
    expect(mockResetFacilities).toHaveBeenCalled();
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 't1' });
    const params = mockListFacilities.mock.calls[mockListFacilities.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('uses fallback error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'ward.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    useWard.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useWardFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('resolves human-readable display labels for edit mode', () => {
    mockParams = { id: 'rid-1' };
    useWard.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        name: 'General Ward',
        ward_type: 'ICU',
        is_active: true,
        tenant_id: 't1',
        facility_id: 'f1',
        tenant_name: 'Tenant A',
        facility_name: 'Facility A',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useWardFormScreen());
    expect(result.current.tenantDisplayLabel).toBe('Tenant A');
    expect(result.current.facilityDisplayLabel).toBe('Facility A');
  });

  it('masks ward and blocks submit when tenant-scoped user opens out-of-scope ward', async () => {
    mockParams = { id: 'rid-1' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useWard.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'rid-1',
        tenant_id: 'tenant-2',
        facility_id: 'f1',
        name: 'External Ward',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useWardFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/wards?notice=accessDenied');
    expect(result.current.ward).toBeNull();
    expect(result.current.isSubmitDisabled).toBe(true);

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'w1' });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'f1', name: 'Facility 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
    const { result } = renderHook(() => useWardFormScreen());
    act(() => {
      result.current.setTenantId(' t1 ');
      result.current.setFacilityId(' f1 ');
      result.current.setName('  Ward A  ');
      result.current.setWardType(' GENERAL ');
      result.current.setIsActive(false);
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 't1',
      facility_id: 'f1',
      name: 'Ward A',
      ward_type: 'GENERAL',
      is_active: false,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/wards?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'rid-1' };
    mockUpdate.mockResolvedValue({ id: 'rid-1' });
    useWard.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'rid-1',
        name: 'Old Name',
        ward_type: 'GENERAL',
        is_active: true,
        tenant_id: 't1',
        facility_id: 'f1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useWardFormScreen());
    act(() => {
      result.current.setName('  Main  ');
      result.current.setWardType('');
      result.current.setIsActive(false);
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockUpdate).toHaveBeenCalledWith('rid-1', {
      name: 'Main',
      ward_type: null,
      is_active: false,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/wards?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'w1' });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'f1', name: 'Facility 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
    const { result } = renderHook(() => useWardFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
      result.current.setName('Ward');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/wards?notice=queued');
  });

  it('does not navigate when create returns undefined', async () => {
    mockCreate.mockResolvedValue(undefined);
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'f1', name: 'Facility 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
    const { result } = renderHook(() => useWardFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
      result.current.setName('Ward');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useWardFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useWardFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/wards');
  });

  it('onGoToTenants navigates to tenants list', () => {
    const { result } = renderHook(() => useWardFormScreen());
    result.current.onGoToTenants();
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('onGoToFacilities navigates to facilities list', () => {
    const { result } = renderHook(() => useWardFormScreen());
    result.current.onGoToFacilities();
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities');
  });

  it('onRetryTenants reloads tenant list with capped limit', () => {
    const { result } = renderHook(() => useWardFormScreen());
    result.current.onRetryTenants();
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const params = mockListTenants.mock.calls[mockListTenants.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('onRetryTenants is disabled for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useWardFormScreen());
    mockResetTenants.mockClear();
    mockListTenants.mockClear();
    result.current.onRetryTenants();
    expect(mockResetTenants).not.toHaveBeenCalled();
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('onRetryFacilities reloads facility list with capped limit', () => {
    const { result } = renderHook(() => useWardFormScreen());
    act(() => {
      result.current.setTenantId('t1');
    });
    mockResetFacilities.mockClear();
    mockListFacilities.mockClear();
    result.current.onRetryFacilities();
    expect(mockResetFacilities).toHaveBeenCalled();
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 't1' });
    const params = mockListFacilities.mock.calls[mockListFacilities.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('onRetryFacilities only resets list when tenant is missing', () => {
    const { result } = renderHook(() => useWardFormScreen());
    mockResetFacilities.mockClear();
    mockListFacilities.mockClear();
    result.current.onRetryFacilities();
    expect(mockResetFacilities).toHaveBeenCalled();
    expect(mockListFacilities).not.toHaveBeenCalled();
  });

  it('redirects tenant-scoped users when editing ward outside tenant scope', () => {
    mockParams = { id: 'rid-1' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useWard.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'rid-1',
        name: 'General Ward',
        tenant_id: 'tenant-2',
        facility_id: 'f1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useWardFormScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings/wards?notice=accessDenied');
  });
});
