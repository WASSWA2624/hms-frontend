/**
 * useBedFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useBedFormScreen = require('@platform/screens/settings/BedFormScreen/useBedFormScreen').default;

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
  useBed: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useWard: jest.fn(),
  useRoom: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useI18n,
  useNetwork,
  useBed,
  useTenant,
  useFacility,
  useWard,
  useRoom,
  useTenantAccess,
} = require('@hooks');

describe('useBedFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();
  const mockListWards = jest.fn();
  const mockResetWards = jest.fn();
  const mockListRooms = jest.fn();
  const mockResetRooms = jest.fn();

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
    useBed.mockReturnValue({
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
    useWard.mockReturnValue({
      list: mockListWards,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetWards,
    });
    useRoom.mockReturnValue({
      list: mockListRooms,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetRooms,
    });
  });

  it('redirects users without bed access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useBedFormScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('prefills tenant for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useBedFormScreen());

    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.tenantListLoading).toBe(false);
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('returns initial state for create', () => {
    const { result } = renderHook(() => useBedFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.label).toBe('');
    expect(result.current.status).toBe('');
    expect(result.current.tenantId).toBe('');
    expect(result.current.facilityId).toBe('');
    expect(result.current.wardId).toBe('');
    expect(result.current.roomId).toBe('');
    expect(result.current.bed).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'bid-1' };
    renderHook(() => useBedFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('bid-1');
  });

  it('lists tenants on mount when creating', () => {
    renderHook(() => useBedFormScreen());
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const params = mockListTenants.mock.calls[mockListTenants.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('hydrates form state from bed data', () => {
    mockParams = { id: 'bid-1' };
    useBed.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        label: 'A-01',
        status: 'available',
        tenant_id: 't1',
        facility_id: 'f1',
        ward_id: 'w1',
        room_id: 'r1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useBedFormScreen());
    expect(result.current.label).toBe('A-01');
    expect(result.current.status).toBe('AVAILABLE');
    expect(result.current.tenantId).toBe('t1');
    expect(result.current.facilityId).toBe('f1');
    expect(result.current.wardId).toBe('w1');
    expect(result.current.roomId).toBe('r1');
  });

  it('lists facilities when tenantId is set', () => {
    const { result } = renderHook(() => useBedFormScreen());
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

  it('lists wards when facilityId is set', () => {
    const { result } = renderHook(() => useBedFormScreen());
    act(() => {
      result.current.setFacilityId('f1');
    });
    expect(mockResetWards).toHaveBeenCalled();
    expect(mockListWards).toHaveBeenCalledWith({ page: 1, limit: 100, facility_id: 'f1' });
    const params = mockListWards.mock.calls[mockListWards.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('lists rooms when tenantId and facilityId are set', () => {
    const { result } = renderHook(() => useBedFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
      result.current.setWardId('w1');
    });
    expect(mockResetRooms).toHaveBeenCalled();
    expect(mockListRooms).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 't1',
      facility_id: 'f1',
      ward_id: 'w1',
    });
    const params = mockListRooms.mock.calls[mockListRooms.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('uses fallback error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'bed.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    useBed.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useBedFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('resolves human-readable display labels for edit mode', () => {
    mockParams = { id: 'bid-1' };
    useBed.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        label: 'A-01',
        status: 'AVAILABLE',
        tenant_id: 't1',
        facility_id: 'f1',
        ward_id: 'w1',
        room_id: 'r1',
        tenant_name: 'Tenant A',
        facility_name: 'Facility A',
        ward_name: 'Ward A',
        room_name: 'Room A',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useBedFormScreen());
    expect(result.current.tenantDisplayLabel).toBe('Tenant A');
    expect(result.current.facilityDisplayLabel).toBe('Facility A');
    expect(result.current.wardDisplayLabel).toBe('Ward A');
  });

  it('masks bed and blocks submit when tenant-scoped user opens out-of-scope bed', async () => {
    mockParams = { id: 'bid-1' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useBed.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'bid-1',
        tenant_id: 'tenant-2',
        facility_id: 'f1',
        ward_id: 'w1',
        label: 'External Bed',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useBedFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/beds?notice=accessDenied');
    expect(result.current.bed).toBeNull();
    expect(result.current.isSubmitDisabled).toBe(true);

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).not.toHaveBeenCalled();
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
    useWard.mockReturnValue({
      list: mockListWards,
      data: { items: [{ id: 'w1', name: 'Ward 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetWards,
    });
    const { result } = renderHook(() => useBedFormScreen());
    act(() => {
      result.current.setTenantId(' t1 ');
      result.current.setFacilityId(' f1 ');
      result.current.setWardId(' w1 ');
      result.current.setRoomId(' r1 ');
      result.current.setLabel('  Bed A  ');
      result.current.setStatus('available');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 't1',
      facility_id: 'f1',
      ward_id: 'w1',
      room_id: 'r1',
      label: 'Bed A',
      status: 'AVAILABLE',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/beds?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'bid-1' };
    mockUpdate.mockResolvedValue({ id: 'bid-1' });
    useBed.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'bid-1',
        label: 'Old Label',
        status: 'AVAILABLE',
        tenant_id: 't1',
        facility_id: 'f1',
        ward_id: 'w1',
        room_id: 'r1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useBedFormScreen());
    act(() => {
      result.current.setLabel('  Main  ');
      result.current.setRoomId('');
      result.current.setStatus('AVAILABLE');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockUpdate).toHaveBeenCalledWith('bid-1', {
      label: 'Main',
      status: 'AVAILABLE',
      room_id: null,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/beds?notice=updated');
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
    useWard.mockReturnValue({
      list: mockListWards,
      data: { items: [{ id: 'w1', name: 'Ward 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetWards,
    });
    const { result } = renderHook(() => useBedFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
      result.current.setWardId('w1');
      result.current.setLabel('Bed');
      result.current.setStatus('AVAILABLE');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/beds?notice=queued');
  });

  it('does not navigate when create returns undefined', async () => {
    mockCreate.mockResolvedValue(undefined);
    const { result } = renderHook(() => useBedFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
      result.current.setWardId('w1');
      result.current.setLabel('Bed');
      result.current.setStatus('AVAILABLE');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useBedFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useBedFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/beds');
  });

  it('onGoToTenants navigates to tenants list', () => {
    const { result } = renderHook(() => useBedFormScreen());
    result.current.onGoToTenants();
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('onGoToFacilities navigates to facilities list', () => {
    const { result } = renderHook(() => useBedFormScreen());
    result.current.onGoToFacilities();
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities');
  });

  it('onGoToWards navigates to wards list', () => {
    const { result } = renderHook(() => useBedFormScreen());
    result.current.onGoToWards();
    expect(mockPush).toHaveBeenCalledWith('/settings/wards');
  });

  it('onGoToRooms navigates to rooms list', () => {
    const { result } = renderHook(() => useBedFormScreen());
    result.current.onGoToRooms();
    expect(mockPush).toHaveBeenCalledWith('/settings/rooms');
  });

  it('onRetryTenants reloads tenant list with capped limit', () => {
    const { result } = renderHook(() => useBedFormScreen());
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

    const { result } = renderHook(() => useBedFormScreen());
    mockResetTenants.mockClear();
    mockListTenants.mockClear();
    result.current.onRetryTenants();
    expect(mockResetTenants).not.toHaveBeenCalled();
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('onRetryFacilities reloads facility list with capped limit', () => {
    const { result } = renderHook(() => useBedFormScreen());
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
    const { result } = renderHook(() => useBedFormScreen());
    mockResetFacilities.mockClear();
    mockListFacilities.mockClear();
    result.current.onRetryFacilities();
    expect(mockResetFacilities).toHaveBeenCalled();
    expect(mockListFacilities).not.toHaveBeenCalled();
  });

  it('onRetryWards reloads ward list with capped limit', () => {
    const { result } = renderHook(() => useBedFormScreen());
    act(() => {
      result.current.setFacilityId('f1');
    });
    mockResetWards.mockClear();
    mockListWards.mockClear();
    result.current.onRetryWards();
    expect(mockResetWards).toHaveBeenCalled();
    expect(mockListWards).toHaveBeenCalledWith({ page: 1, limit: 100, facility_id: 'f1' });
    const params = mockListWards.mock.calls[mockListWards.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('onRetryWards only resets list when facility is missing', () => {
    const { result } = renderHook(() => useBedFormScreen());
    mockResetWards.mockClear();
    mockListWards.mockClear();
    result.current.onRetryWards();
    expect(mockResetWards).toHaveBeenCalled();
    expect(mockListWards).not.toHaveBeenCalled();
  });

  it('onRetryRooms reloads room list with capped limit', () => {
    const { result } = renderHook(() => useBedFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
      result.current.setWardId('w1');
    });
    mockResetRooms.mockClear();
    mockListRooms.mockClear();
    result.current.onRetryRooms();
    expect(mockResetRooms).toHaveBeenCalled();
    expect(mockListRooms).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 't1',
      facility_id: 'f1',
      ward_id: 'w1',
    });
    const params = mockListRooms.mock.calls[mockListRooms.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('onRetryRooms only resets list when tenant or facility is missing', () => {
    const { result } = renderHook(() => useBedFormScreen());
    mockResetRooms.mockClear();
    mockListRooms.mockClear();
    result.current.onRetryRooms();
    expect(mockResetRooms).toHaveBeenCalled();
    expect(mockListRooms).not.toHaveBeenCalled();
  });
});
