const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockSetParams = jest.fn();
const mockList = jest.fn();
const mockGet = jest.fn();
const mockStart = jest.fn();
const mockPayConsultation = jest.fn();
const mockRecordVitals = jest.fn();
const mockAssignDoctor = jest.fn();
const mockDoctorReview = jest.fn();
const mockDisposition = jest.fn();
const mockReset = jest.fn();
const mockGetPatient = jest.fn();
const mockListPatients = jest.fn();
const mockGetAppointment = jest.fn();
const mockListStaffProfiles = jest.fn();
const mockGetFacility = jest.fn();
const mockGetTenant = jest.fn();

jest.mock('@config/feature.flags', () => ({
  IPD_WORKBENCH_V1: false,
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    setParams: mockSetParams,
  }),
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useNetwork: jest.fn(),
  useOpdFlow: jest.fn(),
  useOpdFlowAccess: jest.fn(),
  usePatient: jest.fn(),
  useAppointment: jest.fn(),
  useStaffProfile: jest.fn(),
  useFacility: jest.fn(),
  useTenant: jest.fn(),
  useRealtimeEvent: jest.fn(),
}));

const useOpdFlowWorkbenchScreen =
  require('@platform/screens/scheduling/OpdFlowWorkbenchScreen/useOpdFlowWorkbenchScreen').default;
const {
  useI18n,
  useNetwork,
  useOpdFlow,
  useOpdFlowAccess,
  usePatient,
  useAppointment,
  useStaffProfile,
  useFacility,
  useTenant,
  useRealtimeEvent,
} = require('@hooks');

const buildSnapshot = (id = 'enc-1', stage = 'WAITING_VITALS') => ({
  id,
  encounter: {
    id,
    patient_id: 'patient-1',
    encounter_type: 'OPD',
  },
  flow: {
    encounter_id: id,
    stage,
    next_step: 'NEXT_STEP',
    timeline: [],
  },
  timeline: [],
  linked_record_ids: {
    encounter_id: id,
    lab_order_ids: [],
    radiology_order_ids: [],
  },
});

const createDeferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('useOpdFlowWorkbenchScreen', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    useI18n.mockReturnValue({
      t: (key) => key,
      locale: 'en',
    });
    useNetwork.mockReturnValue({
      isOffline: false,
    });
    useOpdFlowAccess.mockReturnValue({
      canAccessOpdFlow: true,
      canStartFlow: true,
      canPayConsultation: true,
      canRecordVitals: true,
      canAssignDoctor: true,
      canDoctorReview: true,
      canDisposition: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    mockList.mockResolvedValue({
      items: [buildSnapshot('enc-1', 'WAITING_CONSULTATION_PAYMENT')],
      pagination: { page: 1, limit: 25, total: 1 },
    });
    mockGet.mockResolvedValue(buildSnapshot('enc-1', 'WAITING_CONSULTATION_PAYMENT'));
    mockStart.mockResolvedValue(buildSnapshot('enc-2', 'WAITING_VITALS'));
    mockPayConsultation.mockResolvedValue(buildSnapshot('enc-1', 'WAITING_VITALS'));
    mockRecordVitals.mockResolvedValue(buildSnapshot('enc-1', 'WAITING_DOCTOR_ASSIGNMENT'));
    mockAssignDoctor.mockResolvedValue(buildSnapshot('enc-1', 'WAITING_DOCTOR_REVIEW'));
    mockDoctorReview.mockResolvedValue(buildSnapshot('enc-1', 'WAITING_DISPOSITION'));
    mockDisposition.mockResolvedValue(buildSnapshot('enc-1', 'DISCHARGED'));
    mockGetPatient.mockResolvedValue({
      id: 'patient-1',
      first_name: 'Jane',
      last_name: 'Doe',
      human_friendly_id: 'PAT-001',
      date_of_birth: '1990-01-01',
    });
    mockListPatients.mockResolvedValue({ items: [] });
    mockListStaffProfiles.mockResolvedValue({ items: [] });
    mockGetAppointment.mockResolvedValue({
      id: 'appointment-1',
      patient_id: 'patient-1',
      provider_user_id: 'doctor-1',
    });
    mockGetFacility.mockResolvedValue({ id: 'facility-1', extension_json: { currency: 'USD' } });
    mockGetTenant.mockResolvedValue({ id: 'tenant-1', extension_json: { currency: 'USD' } });

    useOpdFlow.mockReturnValue({
      list: mockList,
      get: mockGet,
      start: mockStart,
      payConsultation: mockPayConsultation,
      recordVitals: mockRecordVitals,
      assignDoctor: mockAssignDoctor,
      doctorReview: mockDoctorReview,
      disposition: mockDisposition,
      reset: mockReset,
      isLoading: false,
      errorCode: null,
      data: null,
    });
    usePatient.mockReturnValue({
      get: mockGetPatient,
      list: mockListPatients,
    });
    useAppointment.mockReturnValue({
      get: mockGetAppointment,
    });
    useStaffProfile.mockReturnValue({
      list: mockListStaffProfiles,
    });
    useFacility.mockReturnValue({
      get: mockGetFacility,
    });
    useTenant.mockReturnValue({
      get: mockGetTenant,
    });
    useRealtimeEvent.mockImplementation(() => {});
  });

  it('loads OPD flow list with tenant/facility scope for scoped users', async () => {
    useOpdFlowAccess.mockReturnValue({
      canAccessOpdFlow: true,
      canStartFlow: true,
      canPayConsultation: true,
      canRecordVitals: true,
      canAssignDoctor: true,
      canDoctorReview: true,
      canDisposition: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: 'facility-1',
      isResolved: true,
    });

    renderHook(() => useOpdFlowWorkbenchScreen());

    await waitFor(() => expect(mockList).toHaveBeenCalled());
    const calls = mockList.mock.calls.map((entry) => entry[0]);
    expect(calls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          page: 1,
          limit: 25,
          sort_by: 'started_at',
          order: 'desc',
          tenant_id: 'tenant-1',
          facility_id: 'facility-1',
          queue_scope: 'ASSIGNED',
        }),
        expect.objectContaining({
          page: 1,
          limit: 25,
          sort_by: 'started_at',
          order: 'desc',
          tenant_id: 'tenant-1',
          facility_id: 'facility-1',
          queue_scope: 'WAITING',
        }),
      ])
    );
  });

  it('resolves UUID scope identifiers to friendly IDs before loading OPD flows', async () => {
    useOpdFlowAccess.mockReturnValue({
      canAccessOpdFlow: true,
      canStartFlow: true,
      canPayConsultation: true,
      canRecordVitals: true,
      canAssignDoctor: true,
      canDoctorReview: true,
      canDisposition: true,
      canManageAllTenants: false,
      tenantId: '5ef3d36c-6d6c-4e6e-bf6e-6bc4a1036a21',
      facilityId: '18a4e1e4-2617-4cca-8fb7-f9a2f0d4f0b9',
      isResolved: true,
    });

    mockGetTenant.mockResolvedValue({
      id: '5ef3d36c-6d6c-4e6e-bf6e-6bc4a1036a21',
      human_friendly_id: 'TEN-001',
      extension_json: { currency: 'USD' },
    });
    mockGetFacility.mockResolvedValue({
      id: '18a4e1e4-2617-4cca-8fb7-f9a2f0d4f0b9',
      human_friendly_id: 'FAC-001',
      extension_json: { currency: 'USD' },
    });

    renderHook(() => useOpdFlowWorkbenchScreen());

    await waitFor(() => expect(mockList).toHaveBeenCalled());
    const calls = mockList.mock.calls.map((entry) => entry[0]);
    expect(calls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          page: 1,
          limit: 25,
          sort_by: 'started_at',
          order: 'desc',
          tenant_id: 'TEN-001',
          facility_id: 'FAC-001',
          queue_scope: 'ASSIGNED',
        }),
        expect.objectContaining({
          page: 1,
          limit: 25,
          sort_by: 'started_at',
          order: 'desc',
          tenant_id: 'TEN-001',
          facility_id: 'FAC-001',
          queue_scope: 'WAITING',
        }),
      ])
    );
  });

  it('does not continuously refetch the OPD flow list on stable renders', async () => {
    const { rerender } = renderHook(() => useOpdFlowWorkbenchScreen());

    await waitFor(() => expect(mockList.mock.calls.length).toBeGreaterThanOrEqual(2));
    const initialCalls = mockList.mock.calls.length;
    rerender({});
    await waitFor(() => expect(mockList.mock.calls.length).toBe(initialCalls));
  });

  it('fetches all search result pages for OPD flow list queries', async () => {
    jest.useFakeTimers();
    mockList.mockResolvedValue({
      items: [buildSnapshot('enc-initial', 'WAITING_VITALS')],
      pagination: { page: 1, limit: 25, total: 1, hasNextPage: false, hasPreviousPage: false },
    });

    const { result } = renderHook(() => useOpdFlowWorkbenchScreen());
    await waitFor(() => expect(mockList.mock.calls.length).toBeGreaterThanOrEqual(2));

    mockList.mockClear();
    mockList.mockImplementation(async (params = {}) => {
      if (params.page === 1) {
        return {
          items: [buildSnapshot('enc-search-1', 'WAITING_CONSULTATION_PAYMENT')],
          pagination: { page: 1, limit: 25, total: 2, hasNextPage: true, hasPreviousPage: false },
        };
      }
      return {
        items: [buildSnapshot('enc-search-2', 'WAITING_DOCTOR_REVIEW')],
        pagination: { page: 2, limit: 25, total: 2, hasNextPage: false, hasPreviousPage: true },
      };
    });

    act(() => {
      result.current.onFlowSearchChange('jane');
    });
    await act(async () => {
      jest.advanceTimersByTime(300);
      await Promise.resolve();
    });

    await waitFor(() => {
      const calls = mockList.mock.calls.map((entry) => entry[0]);
      expect(calls).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ page: 1, search: 'jane' }),
          expect.objectContaining({ page: 2, search: 'jane' }),
        ])
      );
      const flowIds = result.current.flowList.map((entry) => entry.id);
      expect(flowIds).toEqual(expect.arrayContaining(['enc-search-1', 'enc-search-2']));
    });

    jest.useRealTimers();
  });

  it('ignores stale flow-list search responses when a newer query completes first', async () => {
    jest.useFakeTimers();
    mockList.mockResolvedValue({
      items: [buildSnapshot('enc-initial', 'WAITING_VITALS')],
      pagination: { page: 1, limit: 25, total: 1, hasNextPage: false, hasPreviousPage: false },
    });

    const { result } = renderHook(() => useOpdFlowWorkbenchScreen());
    await waitFor(() => expect(mockList.mock.calls.length).toBeGreaterThanOrEqual(2));

    const staleSearch = createDeferred();
    mockList.mockClear();
    mockList.mockImplementation((params = {}) => {
      if (params.search === 'old') {
        return staleSearch.promise;
      }
      if (params.search === 'new') {
        return Promise.resolve({
          items: [buildSnapshot('enc-new', 'WAITING_DOCTOR_ASSIGNMENT')],
          pagination: { page: 1, limit: 25, total: 1, hasNextPage: false, hasPreviousPage: false },
        });
      }
      return Promise.resolve({
        items: [],
        pagination: { page: 1, limit: 25, total: 0, hasNextPage: false, hasPreviousPage: false },
      });
    });

    act(() => {
      result.current.onFlowSearchChange('old');
    });
    await act(async () => {
      jest.advanceTimersByTime(300);
      await Promise.resolve();
    });
    await waitFor(() =>
      expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ page: 1, search: 'old' }))
    );

    act(() => {
      result.current.onFlowSearchChange('new');
    });
    await act(async () => {
      jest.advanceTimersByTime(300);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ page: 1, search: 'new' }));
      const flowIds = result.current.flowList.map((entry) => entry.id);
      expect(flowIds).toContain('enc-new');
      expect(flowIds).not.toContain('enc-old');
    });

    await act(async () => {
      staleSearch.resolve({
        items: [buildSnapshot('enc-old', 'WAITING_CONSULTATION_PAYMENT')],
        pagination: { page: 1, limit: 25, total: 1, hasNextPage: false, hasPreviousPage: false },
      });
      await Promise.resolve();
    });

    await waitFor(() => {
      const flowIds = result.current.flowList.map((entry) => entry.id);
      expect(flowIds).toContain('enc-new');
      expect(flowIds).not.toContain('enc-old');
    });

    jest.useRealTimers();
  });

  it('selects an OPD flow in-place and syncs URL params without pushing history', async () => {
    const { result } = renderHook(() => useOpdFlowWorkbenchScreen());

    await waitFor(() => expect(mockList.mock.calls.length).toBeGreaterThanOrEqual(2));
    await waitFor(() => expect(result.current.flowList.length).toBeGreaterThan(0));

    mockPush.mockClear();
    mockReplace.mockClear();
    mockSetParams.mockClear();

    act(() => {
      result.current.onSelectFlow(result.current.flowList[0]);
    });

    expect(result.current.selectedFlowId).toBe('enc-1');
    expect(result.current.selectedFlow).toMatchObject({ id: 'enc-1' });
    expect(mockSetParams).toHaveBeenCalledWith({ id: 'enc-1' });
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('keeps workbench UI non-blocking while selected-flow snapshot refresh is in progress', async () => {
    const deferredSnapshot = createDeferred();
    mockGet.mockImplementation(() => deferredSnapshot.promise);

    const { result } = renderHook(() => useOpdFlowWorkbenchScreen());

    await waitFor(() => expect(mockList.mock.calls.length).toBeGreaterThanOrEqual(2));
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(result.current.isSelectedFlowLoading).toBe(true));

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      deferredSnapshot.resolve(buildSnapshot('enc-1', 'WAITING_VITALS'));
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.isSelectedFlowLoading).toBe(false));
    expect(result.current.isLoading).toBe(false);
  });

  it('refreshes selected flow when receiving realtime OPD updates', async () => {
    renderHook(() => useOpdFlowWorkbenchScreen());

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    expect(useRealtimeEvent).toHaveBeenCalledWith(
      'opd.flow.updated',
      expect.any(Function),
      expect.objectContaining({ enabled: true })
    );

    const latestRealtimeCall = useRealtimeEvent.mock.calls[useRealtimeEvent.mock.calls.length - 1];
    const realtimeHandler = latestRealtimeCall[1];
    await act(async () => {
      realtimeHandler({
        encounter_id: 'enc-1',
      });
    });

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });

  it('redirects to dashboard when OPD route access is denied', async () => {
    useOpdFlowAccess.mockReturnValue({
      canAccessOpdFlow: false,
      canStartFlow: false,
      canPayConsultation: false,
      canRecordVitals: false,
      canAssignDoctor: false,
      canDoctorReview: false,
      canDisposition: false,
      canManageAllTenants: false,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    renderHook(() => useOpdFlowWorkbenchScreen());
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/dashboard'));
  });

  it('marks entitlement blocked state when backend returns MODULE_NOT_ENTITLED', async () => {
    useOpdFlow.mockReturnValue({
      list: mockList,
      get: mockGet,
      start: mockStart,
      payConsultation: mockPayConsultation,
      recordVitals: mockRecordVitals,
      assignDoctor: mockAssignDoctor,
      doctorReview: mockDoctorReview,
      disposition: mockDisposition,
      reset: mockReset,
      isLoading: false,
      errorCode: 'MODULE_NOT_ENTITLED',
      data: null,
    });

    const { result } = renderHook(() => useOpdFlowWorkbenchScreen());
    await waitFor(() => expect(result.current.isEntitlementBlocked).toBe(true));
  });

  it('builds and submits start payload', async () => {
    const { result } = renderHook(() => useOpdFlowWorkbenchScreen());
    await waitFor(() => expect(mockList).toHaveBeenCalled());

    act(() => {
      result.current.onStartDraftChange('arrival_mode', 'ONLINE_APPOINTMENT');
      result.current.onStartDraftChange('appointment_id', 'appointment-1');
      result.current.onStartDraftChange('provider_user_id', 'doctor-1');
    });

    await act(async () => {
      await result.current.onStartFlow();
    });

    expect(mockStart).toHaveBeenCalledWith(
      expect.objectContaining({
        arrival_mode: 'ONLINE_APPOINTMENT',
        appointment_id: 'appointment-1',
        provider_user_id: 'doctor-1',
      })
    );
  });

  it('disables doctor-review action for roles without review access', async () => {
    useOpdFlowAccess.mockReturnValue({
      canAccessOpdFlow: true,
      canStartFlow: true,
      canPayConsultation: true,
      canRecordVitals: true,
      canAssignDoctor: true,
      canDoctorReview: false,
      canDisposition: false,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });
    mockList.mockResolvedValue({
      items: [buildSnapshot('enc-1', 'WAITING_DOCTOR_REVIEW')],
      pagination: { page: 1, limit: 25, total: 1 },
    });
    mockGet.mockResolvedValue(buildSnapshot('enc-1', 'WAITING_DOCTOR_REVIEW'));

    const { result } = renderHook(() => useOpdFlowWorkbenchScreen());
    await waitFor(() => expect(result.current.activeStage).toBe('WAITING_DOCTOR_REVIEW'));
    expect(result.current.stageAction).toBe('DOCTOR_REVIEW');
    expect(result.current.canSubmitCurrentAction).toBe(false);
  });

  it('loads patient context and applies predefined vital unit defaults', async () => {
    const { result } = renderHook(() => useOpdFlowWorkbenchScreen());
    await waitFor(() => expect(mockList).toHaveBeenCalled());

    act(() => {
      result.current.onStartDraftChange('patient_id', 'patient-1');
    });

    await act(async () => {
      await result.current.onResolveStartPatient();
    });

    expect(mockGetPatient).toHaveBeenCalledWith('patient-1');
    expect(result.current.startLinkedPatient).toMatchObject({
      id: 'patient-1',
      human_friendly_id: 'PAT-001',
    });

    act(() => {
      result.current.onVitalRowChange(0, 'vital_type', 'OXYGEN_SATURATION');
    });

    expect(result.current.vitalsDraft.vitals[0]).toEqual(
      expect.objectContaining({
        vital_type: 'OXYGEN_SATURATION',
        unit: '%',
      })
    );
  });

  it('uses legacy IPD admission create route when workbench flag is disabled', async () => {
    const { result } = renderHook(() => useOpdFlowWorkbenchScreen());
    await waitFor(() => expect(result.current.onOpenAdmissionShortcut).toBeDefined());

    act(() => {
      result.current.onOpenAdmissionShortcut();
    });

    expect(mockPush).toHaveBeenCalledWith('/ipd/admissions/create');
  });
});
