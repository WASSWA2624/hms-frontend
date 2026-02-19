/**
 * useRoomFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useRoomFormScreen = require('@platform/screens/settings/RoomFormScreen/useRoomFormScreen').default;

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
  useRoom: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  useWard: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useI18n,
  useNetwork,
  useRoom,
  useTenant,
  useFacility,
  useWard,
  useTenantAccess,
} = require('@hooks');

describe('useRoomFormScreen', () => {
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
    useRoom.mockReturnValue({
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
  });

  it('redirects users without room access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useRoomFormScreen());
    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('prefills tenant for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useRoomFormScreen());

    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.tenantListLoading).toBe(false);
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('returns initial state for create', () => {
    const { result } = renderHook(() => useRoomFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.name).toBe('');
    expect(result.current.floor).toBe('');
    expect(result.current.tenantId).toBe('');
    expect(result.current.facilityId).toBe('');
    expect(result.current.wardId).toBe('');
    expect(result.current.room).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'rid-1' };
    renderHook(() => useRoomFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('rid-1');
  });

  it('lists tenants on mount when creating', () => {
    renderHook(() => useRoomFormScreen());
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const params = mockListTenants.mock.calls[mockListTenants.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('hydrates form state from room data', () => {
    mockParams = { id: 'rid-1' };
    useRoom.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        name: 'A-01',
        floor: '2',
        tenant_id: 't1',
        facility_id: 'f1',
        ward_id: 'w1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useRoomFormScreen());
    expect(result.current.name).toBe('A-01');
    expect(result.current.floor).toBe('2');
    expect(result.current.tenantId).toBe('t1');
    expect(result.current.facilityId).toBe('f1');
    expect(result.current.wardId).toBe('w1');
  });

  it('lists facilities when tenantId is set', () => {
    const { result } = renderHook(() => useRoomFormScreen());
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
    const { result } = renderHook(() => useRoomFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
    });
    expect(mockResetWards).toHaveBeenCalled();
    expect(mockListWards).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      facility_id: 'f1',
      tenant_id: 't1',
    });
    const params = mockListWards.mock.calls[mockListWards.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('uses fallback error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'room.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    useRoom.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useRoomFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('resolves human-readable display labels for edit mode', () => {
    mockParams = { id: 'rid-1' };
    useRoom.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        name: 'A-01',
        floor: '2',
        tenant_id: 't1',
        facility_id: 'f1',
        ward_id: 'w1',
        tenant_name: 'Tenant A',
        facility_name: 'Facility A',
        ward_name: 'Ward A',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useRoomFormScreen());
    expect(result.current.tenantDisplayLabel).toBe('Tenant A');
    expect(result.current.facilityDisplayLabel).toBe('Facility A');
    expect(result.current.wardDisplayLabel).toBe('Ward A');
  });

  it('masks room and blocks submit when tenant-scoped user opens out-of-scope room', async () => {
    mockParams = { id: 'rid-1' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRoom.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'rid-1',
        tenant_id: 'tenant-2',
        facility_id: 'f1',
        ward_id: 'w1',
        name: 'External Room',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useRoomFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/rooms?notice=accessDenied');
    expect(result.current.room).toBeNull();
    expect(result.current.isSubmitDisabled).toBe(true);

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'r1' });
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
    const { result } = renderHook(() => useRoomFormScreen());
    act(() => {
      result.current.setTenantId(' t1 ');
      result.current.setFacilityId(' f1 ');
      result.current.setWardId(' w1 ');
      result.current.setName('  Room A  ');
      result.current.setFloor(' 2 ');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 't1',
      facility_id: 'f1',
      ward_id: 'w1',
      name: 'Room A',
      floor: '2',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/rooms?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'rid-1' };
    mockUpdate.mockResolvedValue({ id: 'rid-1' });
    useRoom.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'rid-1',
        name: 'Old Name',
        floor: '3',
        tenant_id: 't1',
        facility_id: 'f1',
        ward_id: 'w1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useRoomFormScreen());
    act(() => {
      result.current.setName('  Main  ');
      result.current.setFloor('');
      result.current.setWardId('');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockUpdate).toHaveBeenCalledWith('rid-1', {
      name: 'Main',
      floor: null,
      ward_id: null,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/rooms?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'r1' });
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
    const { result } = renderHook(() => useRoomFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
      result.current.setName('Room');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/rooms?notice=queued');
  });

  it('does not navigate when create returns undefined', async () => {
    mockCreate.mockResolvedValue(undefined);
    const { result } = renderHook(() => useRoomFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
      result.current.setName('Room');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useRoomFormScreen());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useRoomFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/rooms');
  });

  it('onGoToTenants navigates to tenants list', () => {
    const { result } = renderHook(() => useRoomFormScreen());
    result.current.onGoToTenants();
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('onGoToFacilities navigates to facilities list', () => {
    const { result } = renderHook(() => useRoomFormScreen());
    result.current.onGoToFacilities();
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities');
  });

  it('onGoToWards navigates to wards list', () => {
    const { result } = renderHook(() => useRoomFormScreen());
    result.current.onGoToWards();
    expect(mockPush).toHaveBeenCalledWith('/settings/wards');
  });

  it('onRetryTenants reloads tenant list with capped limit', () => {
    const { result } = renderHook(() => useRoomFormScreen());
    result.current.onRetryTenants();
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const params = mockListTenants.mock.calls[mockListTenants.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('onRetryFacilities reloads facility list with capped limit', () => {
    const { result } = renderHook(() => useRoomFormScreen());
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

  it('onRetryWards reloads ward list with capped limit', () => {
    const { result } = renderHook(() => useRoomFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setFacilityId('f1');
    });
    mockResetWards.mockClear();
    mockListWards.mockClear();
    result.current.onRetryWards();
    expect(mockResetWards).toHaveBeenCalled();
    expect(mockListWards).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      facility_id: 'f1',
      tenant_id: 't1',
    });
    const params = mockListWards.mock.calls[mockListWards.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });
});
