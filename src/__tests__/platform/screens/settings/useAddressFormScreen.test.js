/**
 * useAddressFormScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');
const useAddressFormScreen = require('@platform/screens/settings/AddressFormScreen/useAddressFormScreen').default;

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
  useAddress: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useBranch: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useI18n,
  useNetwork,
  useAddress,
  useTenant,
  useFacility,
  useBranch,
  useTenantAccess,
} = require('@hooks');

describe('useAddressFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();
  const mockListBranches = jest.fn();
  const mockResetBranches = jest.fn();

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
    useAddress.mockReturnValue({
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
    useBranch.mockReturnValue({
      list: mockListBranches,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetBranches,
    });
  });

  it('redirects users without address access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useAddressFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('prefills tenant for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useAddressFormScreen());

    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.tenantListLoading).toBe(false);
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('returns initial state for create', () => {
    const { result } = renderHook(() => useAddressFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.addressType).toBe('');
    expect(result.current.line1).toBe('');
    expect(result.current.line2).toBe('');
    expect(result.current.city).toBe('');
    expect(result.current.stateValue).toBe('');
    expect(result.current.postalCode).toBe('');
    expect(result.current.country).toBe('');
    expect(result.current.tenantId).toBe('');
    expect(result.current.facilityId).toBe('');
    expect(result.current.branchId).toBe('');
    expect(result.current.address).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'aid-1' };
    renderHook(() => useAddressFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('aid-1');
  });

  it('lists tenants on mount when creating with capped limit', () => {
    renderHook(() => useAddressFormScreen());
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const params = mockListTenants.mock.calls[mockListTenants.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('hydrates form state from address data', () => {
    mockParams = { id: 'aid-1' };
    useAddress.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        address_type: 'HOME',
        line1: 'Main St',
        line2: 'Apt 1',
        city: 'Kampala',
        state: 'Central',
        postal_code: '256',
        country: 'Uganda',
        tenant_id: 't1',
        facility_id: 'f1',
        branch_id: 'b1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useAddressFormScreen());
    expect(result.current.addressType).toBe('HOME');
    expect(result.current.line1).toBe('Main St');
    expect(result.current.line2).toBe('Apt 1');
    expect(result.current.city).toBe('Kampala');
    expect(result.current.stateValue).toBe('Central');
    expect(result.current.postalCode).toBe('256');
    expect(result.current.country).toBe('Uganda');
    expect(result.current.tenantId).toBe('t1');
    expect(result.current.facilityId).toBe('f1');
    expect(result.current.branchId).toBe('b1');
  });

  it('lists facilities when tenantId is set using capped limit', async () => {
    const { result } = renderHook(() => useAddressFormScreen());
    act(() => {
      result.current.setTenantId('t1');
    });

    await waitFor(() => {
      expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 't1' });
    });
    const params = mockListFacilities.mock.calls[mockListFacilities.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('lists branches for tenant and facility with capped limit', async () => {
    const { result } = renderHook(() => useAddressFormScreen());

    act(() => {
      result.current.setTenantId('t1');
    });
    await waitFor(() => {
      expect(mockListBranches).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 't1' });
    });
    let params = mockListBranches.mock.calls[mockListBranches.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);

    mockListBranches.mockClear();
    act(() => {
      result.current.setFacilityId('f1');
    });

    await waitFor(() => {
      expect(mockListBranches).toHaveBeenCalledWith({
        page: 1,
        limit: 100,
        tenant_id: 't1',
        facility_id: 'f1',
      });
    });
    params = mockListBranches.mock.calls[mockListBranches.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('uses fallback submit error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'address.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    useAddress.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });

    const { result } = renderHook(() => useAddressFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('uses fallback tenant error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'address.form.tenantLoadErrorMessage' ? 'Tenant fallback' : k),
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetTenants,
    });

    const { result } = renderHook(() => useAddressFormScreen());
    expect(result.current.tenantListError).toBe(true);
    expect(result.current.tenantErrorMessage).toBe('Tenant fallback');
  });

  it('uses fallback facility error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'address.form.facilityLoadErrorMessage' ? 'Facility fallback' : k),
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetFacilities,
    });

    const { result } = renderHook(() => useAddressFormScreen());
    expect(result.current.facilityListError).toBe(true);
    expect(result.current.facilityErrorMessage).toBe('Facility fallback');
  });

  it('uses fallback branch error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'address.form.branchLoadErrorMessage' ? 'Branch fallback' : k),
    });
    useBranch.mockReturnValue({
      list: mockListBranches,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetBranches,
    });

    const { result } = renderHook(() => useAddressFormScreen());
    expect(result.current.branchListError).toBe(true);
    expect(result.current.branchErrorMessage).toBe('Branch fallback');
  });

  it('masks address and blocks submit when tenant-scoped user opens out-of-scope address', async () => {
    mockParams = { id: 'aid-1' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useAddress.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'aid-1',
        tenant_id: 'tenant-2',
        line1: 'External Address',
        address_type: 'HOME',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useAddressFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/addresses?notice=accessDenied');
    expect(result.current.address).toBeNull();
    expect(result.current.isSubmitDisabled).toBe(true);

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'a1' });
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
    useBranch.mockReturnValue({
      list: mockListBranches,
      data: { items: [{ id: 'b1', name: 'Branch 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetBranches,
    });

    const { result } = renderHook(() => useAddressFormScreen());
    act(() => {
      result.current.setTenantId(' t1 ');
      result.current.setFacilityId(' f1 ');
      result.current.setBranchId(' b1 ');
      result.current.setAddressType(' HOME ');
      result.current.setLine1(' 123 Main St ');
      result.current.setLine2(' Apt 2 ');
      result.current.setCity(' Kampala ');
      result.current.setStateValue(' Central ');
      result.current.setPostalCode(' 256 ');
      result.current.setCountry(' Uganda ');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      address_type: 'HOME',
      line1: '123 Main St',
      line2: 'Apt 2',
      city: 'Kampala',
      state: 'Central',
      postal_code: '256',
      country: 'Uganda',
      tenant_id: 't1',
      facility_id: 'f1',
      branch_id: 'b1',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/addresses?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'aid-1' };
    mockUpdate.mockResolvedValue({ id: 'aid-1' });

    const { result } = renderHook(() => useAddressFormScreen());
    act(() => {
      result.current.setAddressType('WORK');
      result.current.setLine1('456 Office Rd');
      result.current.setLine2('');
      result.current.setCity('');
      result.current.setStateValue('');
      result.current.setPostalCode('');
      result.current.setCountry('');
      result.current.setFacilityId('');
      result.current.setBranchId('');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('aid-1', {
      address_type: 'WORK',
      line1: '456 Office Rd',
      line2: null,
      city: null,
      state: null,
      postal_code: null,
      country: null,
      facility_id: null,
      branch_id: null,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/addresses?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'a1' });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });

    const { result } = renderHook(() => useAddressFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setAddressType('HOME');
      result.current.setLine1('Address');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockReplace).toHaveBeenCalledWith('/settings/addresses?notice=queued');
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

    const { result } = renderHook(() => useAddressFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setAddressType('HOME');
      result.current.setLine1('Address');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useAddressFormScreen());

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useAddressFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/addresses');
  });

  it('navigation helpers route to linked modules', () => {
    const { result } = renderHook(() => useAddressFormScreen());
    result.current.onGoToTenants();
    result.current.onGoToFacilities();
    result.current.onGoToBranches();
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities');
    expect(mockPush).toHaveBeenCalledWith('/settings/branches');
  });

  it('onRetryTenants reloads tenant list with capped limit', () => {
    const { result } = renderHook(() => useAddressFormScreen());
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

    const { result } = renderHook(() => useAddressFormScreen());
    mockResetTenants.mockClear();
    mockListTenants.mockClear();
    result.current.onRetryTenants();
    expect(mockResetTenants).not.toHaveBeenCalled();
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('onRetryFacilities reloads facility list with capped limit', async () => {
    const { result } = renderHook(() => useAddressFormScreen());
    act(() => {
      result.current.setTenantId('t1');
    });
    await waitFor(() => {
      expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 't1' });
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
    const { result } = renderHook(() => useAddressFormScreen());
    mockResetFacilities.mockClear();
    mockListFacilities.mockClear();
    result.current.onRetryFacilities();
    expect(mockResetFacilities).toHaveBeenCalled();
    expect(mockListFacilities).not.toHaveBeenCalled();
  });

  it('onRetryBranches reloads branch list with capped limit', async () => {
    const { result } = renderHook(() => useAddressFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
    });

    await waitFor(() => {
      expect(mockListBranches).toHaveBeenCalledWith({
        page: 1,
        limit: 100,
        tenant_id: 't1',
        facility_id: 'f1',
      });
    });

    mockResetBranches.mockClear();
    mockListBranches.mockClear();
    result.current.onRetryBranches();
    expect(mockResetBranches).toHaveBeenCalled();
    expect(mockListBranches).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 't1',
      facility_id: 'f1',
    });
    const params = mockListBranches.mock.calls[mockListBranches.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('onRetryBranches only resets list when tenant is missing', () => {
    const { result } = renderHook(() => useAddressFormScreen());
    mockResetBranches.mockClear();
    mockListBranches.mockClear();
    result.current.onRetryBranches();
    expect(mockResetBranches).toHaveBeenCalled();
    expect(mockListBranches).not.toHaveBeenCalled();
  });
});
