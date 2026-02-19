/**
 * useBranchFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useBranchFormScreen = require('@platform/screens/settings/BranchFormScreen/useBranchFormScreen').default;

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
  useBranch: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const { useI18n, useNetwork, useBranch, useTenant, useFacility, useTenantAccess } = require('@hooks');

describe('useBranchFormScreen', () => {
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
    useBranch.mockReturnValue({
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

  it('redirects users without branch access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useBranchFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('prefills tenant for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useBranchFormScreen());

    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.tenantListLoading).toBe(false);
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('returns initial state for create', () => {
    const { result } = renderHook(() => useBranchFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.name).toBe('');
    expect(result.current.isActive).toBe(true);
    expect(result.current.tenantId).toBe('');
    expect(result.current.facilityId).toBe('');
    expect(result.current.branch).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'bid-1' };
    renderHook(() => useBranchFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('bid-1');
  });

  it('lists tenants on mount when creating', () => {
    renderHook(() => useBranchFormScreen());
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const tenantParams = mockListTenants.mock.calls[mockListTenants.mock.calls.length - 1][0];
    expect(typeof tenantParams.limit).toBe('number');
    expect(tenantParams.limit).toBeLessThanOrEqual(100);
  });

  it('hydrates form state from branch data', () => {
    mockParams = { id: 'bid-1' };
    useBranch.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: { name: 'Main', is_active: false, tenant_id: 't1', facility_id: 'f1' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useBranchFormScreen());
    expect(result.current.name).toBe('Main');
    expect(result.current.isActive).toBe(false);
    expect(result.current.tenantId).toBe('t1');
    expect(result.current.facilityId).toBe('f1');
  });

  it('lists facilities when tenantId is set', () => {
    const { result } = renderHook(() => useBranchFormScreen());
    act(() => {
      result.current.setTenantId('t1');
    });
    expect(mockResetFacilities).toHaveBeenCalled();
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 't1' });
    const facilityParams = mockListFacilities.mock.calls[mockListFacilities.mock.calls.length - 1][0];
    expect(typeof facilityParams.limit).toBe('number');
    expect(facilityParams.limit).toBeLessThanOrEqual(100);
  });

  it('uses fallback error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'branch.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    useBranch.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useBranchFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('uses fallback tenant error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'branch.form.tenantLoadErrorMessage' ? 'Tenant fallback' : k),
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetTenants,
    });
    const { result } = renderHook(() => useBranchFormScreen());
    expect(result.current.tenantListError).toBe(true);
    expect(result.current.tenantErrorMessage).toBe('Tenant fallback');
  });

  it('uses fallback facility error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'branch.form.facilityLoadErrorMessage' ? 'Facility fallback' : k),
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetFacilities,
    });
    const { result } = renderHook(() => useBranchFormScreen());
    expect(result.current.facilityListError).toBe(true);
    expect(result.current.facilityErrorMessage).toBe('Facility fallback');
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'b1' });
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
    const { result } = renderHook(() => useBranchFormScreen());
    act(() => {
      result.current.setTenantId(' t1 ');
      result.current.setFacilityId(' f1 ');
      result.current.setName('  Branch  ');
      result.current.setIsActive(false);
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 't1',
      name: 'Branch',
      is_active: false,
      facility_id: 'f1',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/branches?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'bid-1' };
    mockUpdate.mockResolvedValue({ id: 'bid-1' });
    const { result } = renderHook(() => useBranchFormScreen());
    act(() => {
      result.current.setName('  Main  ');
      result.current.setFacilityId('');
      result.current.setIsActive(true);
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockUpdate).toHaveBeenCalledWith('bid-1', {
      name: 'Main',
      is_active: true,
      facility_id: null,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/branches?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'b1' });
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
    const { result } = renderHook(() => useBranchFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setName('Branch');
      result.current.setFacilityId('f1');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/branches?notice=queued');
  });

  it('does not navigate when create returns undefined', async () => {
    mockCreate.mockResolvedValue(undefined);
    const { result } = renderHook(() => useBranchFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setName('Branch');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useBranchFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useBranchFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/branches');
  });

  it('onGoToTenants navigates to tenants list', () => {
    const { result } = renderHook(() => useBranchFormScreen());
    result.current.onGoToTenants();
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('onGoToFacilities navigates to facilities list', () => {
    const { result } = renderHook(() => useBranchFormScreen());
    result.current.onGoToFacilities();
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities');
  });

  it('onRetryTenants reloads tenant list', () => {
    const { result } = renderHook(() => useBranchFormScreen());
    result.current.onRetryTenants();
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('onRetryFacilities reloads facility list', () => {
    const { result } = renderHook(() => useBranchFormScreen());
    act(() => {
      result.current.setTenantId('t1');
    });
    mockResetFacilities.mockClear();
    mockListFacilities.mockClear();
    result.current.onRetryFacilities();
    expect(mockResetFacilities).toHaveBeenCalled();
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 't1' });
  });

  it('hides out-of-scope branch data for tenant-scoped admins', () => {
    mockParams = { id: 'bid-1' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useBranch.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: { id: 'bid-1', tenant_id: 'tenant-2', name: 'Outside Branch' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useBranchFormScreen());

    expect(result.current.branch).toBeNull();
    expect(result.current.isSubmitDisabled).toBe(true);
    expect(mockReplace).toHaveBeenCalledWith('/settings/branches?notice=accessDenied');
  });
});
