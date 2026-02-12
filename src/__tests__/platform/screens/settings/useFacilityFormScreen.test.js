/**
 * useFacilityFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useFacilityFormScreen = require('@platform/screens/settings/FacilityFormScreen/useFacilityFormScreen').default;

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
  useFacility: jest.fn(),
  useTenant: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const { useNetwork, useFacility, useTenant, useTenantAccess } = require('@hooks');

describe('useFacilityFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useFacility.mockReturnValue({
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

  it('loads tenant options for global create', () => {
    renderHook(() => useFacilityFormScreen());
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 200 });
  });

  it('locks tenant for tenant-scoped create and skips tenant list fetch', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useFacilityFormScreen());

    expect(result.current.isTenantLocked).toBe(true);
    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.lockedTenantDisplay).toBe('tenant-1');
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('redirects unauthorized users to settings', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useFacilityFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users without tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useFacilityFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('loads facility on edit route', () => {
    mockParams = { id: 'fid-1' };
    renderHook(() => useFacilityFormScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('fid-1');
  });

  it('redirects tenant-scoped edit when facility tenant mismatches', () => {
    mockParams = { id: 'fid-2' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useFacility.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'fid-2',
        tenant_id: 'tenant-2',
        name: 'Branch Facility',
        facility_type: 'CLINIC',
        is_active: true,
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useFacilityFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/facilities?notice=accessDenied');
  });

  it('exposes validation errors for required fields', () => {
    const { result } = renderHook(() => useFacilityFormScreen());

    expect(result.current.nameError).toBe('facility.form.nameRequired');
    expect(result.current.typeError).toBe('facility.form.typeRequired');
    expect(result.current.tenantError).toBe('facility.form.tenantRequired');
    expect(result.current.isSubmitDisabled).toBe(true);
  });

  it('validates max name length and facility type enum', () => {
    const { result } = renderHook(() => useFacilityFormScreen());
    const veryLongName = 'a'.repeat(256);

    act(() => {
      result.current.setName(veryLongName);
      result.current.setFacilityType('INVALID_TYPE');
      result.current.setTenantId('tenant-1');
    });

    expect(result.current.nameError).toBe('facility.form.nameTooLong');
    expect(result.current.typeError).toBe('facility.form.typeInvalid');
    expect(result.current.tenantError).toBeNull();
  });

  it('submits create payload with backend-aligned fields', async () => {
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    mockCreate.mockResolvedValue({ id: 'f1' });

    const { result } = renderHook(() => useFacilityFormScreen());
    act(() => {
      result.current.setTenantId(' tenant-1 ');
      result.current.setName(' Main Facility ');
      result.current.setFacilityType('HOSPITAL');
      result.current.setIsActive(false);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 'tenant-1',
      name: 'Main Facility',
      facility_type: 'HOSPITAL',
      is_active: false,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/facilities?notice=created');
  });

  it('submits update payload for edit route', async () => {
    mockParams = { id: 'fid-1' };
    mockUpdate.mockResolvedValue({ id: 'fid-1' });

    const { result } = renderHook(() => useFacilityFormScreen());
    act(() => {
      result.current.setName(' Updated Facility ');
      result.current.setFacilityType('CLINIC');
      result.current.setIsActive(true);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('fid-1', {
      name: 'Updated Facility',
      facility_type: 'CLINIC',
      is_active: true,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/facilities?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    mockCreate.mockResolvedValue({ id: 'f1' });

    const { result } = renderHook(() => useFacilityFormScreen());
    act(() => {
      result.current.setTenantId('tenant-1');
      result.current.setName('Clinic');
      result.current.setFacilityType('CLINIC');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockReplace).toHaveBeenCalledWith('/settings/facilities?notice=queued');
  });

  it('does not submit when validation fails', async () => {
    const { result } = renderHook(() => useFacilityFormScreen());

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).not.toHaveBeenCalled();
  });
});
