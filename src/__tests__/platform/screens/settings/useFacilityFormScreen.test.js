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
}));

const { useI18n, useNetwork, useFacility, useTenant } = require('@hooks');

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
    useI18n.mockReturnValue({ t: (k) => k });
    useNetwork.mockReturnValue({ isOffline: false });
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

  it('returns initial state for create', () => {
    const { result } = renderHook(() => useFacilityFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.name).toBe('');
    expect(result.current.facilityType).toBe('');
    expect(result.current.isActive).toBe(true);
    expect(result.current.tenantId).toBe('');
    expect(result.current.facility).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'fid-1' };
    renderHook(() => useFacilityFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('fid-1');
  });

  it('lists tenants on mount when creating', () => {
    renderHook(() => useFacilityFormScreen());
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 200 });
  });

  it('hydrates form state from facility data', () => {
    mockParams = { id: 'fid-1' };
    useFacility.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: { name: 'Clinic', facility_type: 'CLINIC', is_active: false },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useFacilityFormScreen());
    expect(result.current.name).toBe('Clinic');
    expect(result.current.facilityType).toBe('CLINIC');
    expect(result.current.isActive).toBe(false);
  });

  it('uses fallback error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'facility.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    useFacility.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useFacilityFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('uses fallback tenant error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'facility.form.tenantLoadErrorMessage' ? 'Tenant fallback' : k),
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetTenants,
    });
    const { result } = renderHook(() => useFacilityFormScreen());
    expect(result.current.tenantListError).toBe(true);
    expect(result.current.tenantErrorMessage).toBe('Tenant fallback');
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'f1' });
    const { result } = renderHook(() => useFacilityFormScreen());
    act(() => {
      result.current.setTenantId(' t1 ');
      result.current.setName('  Clinic  ');
      result.current.setFacilityType('CLINIC');
      result.current.setIsActive(false);
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 't1',
      name: 'Clinic',
      facility_type: 'CLINIC',
      is_active: false,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/facilities?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'fid-1' };
    mockUpdate.mockResolvedValue({ id: 'fid-1' });
    const { result } = renderHook(() => useFacilityFormScreen());
    act(() => {
      result.current.setName('  Hospital  ');
      result.current.setFacilityType('HOSPITAL');
      result.current.setIsActive(true);
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockUpdate).toHaveBeenCalledWith('fid-1', {
      name: 'Hospital',
      facility_type: 'HOSPITAL',
      is_active: true,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/facilities?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'f1' });
    const { result } = renderHook(() => useFacilityFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setName('Clinic');
      result.current.setFacilityType('CLINIC');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/facilities?notice=queued');
  });

  it('does not navigate when create returns undefined', async () => {
    mockCreate.mockResolvedValue(undefined);
    const { result } = renderHook(() => useFacilityFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setName('Clinic');
      result.current.setFacilityType('CLINIC');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useFacilityFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useFacilityFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities');
  });

  it('onGoToTenants navigates to tenants list', () => {
    const { result } = renderHook(() => useFacilityFormScreen());
    result.current.onGoToTenants();
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('onRetryTenants reloads tenant list', () => {
    const { result } = renderHook(() => useFacilityFormScreen());
    result.current.onRetryTenants();
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 200 });
  });
});
