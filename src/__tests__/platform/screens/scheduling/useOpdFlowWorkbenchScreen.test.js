const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
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

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
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

describe('useOpdFlowWorkbenchScreen', () => {
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
    expect(mockList).toHaveBeenCalledWith({
      page: 1,
      limit: 25,
      sort_by: 'started_at',
      order: 'desc',
      tenant_id: 'tenant-1',
      facility_id: 'facility-1',
    });
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
    expect(mockList).toHaveBeenCalledWith({
      page: 1,
      limit: 25,
      sort_by: 'started_at',
      order: 'desc',
      tenant_id: 'TEN-001',
      facility_id: 'FAC-001',
    });
  });

  it('does not continuously refetch the OPD flow list on stable renders', async () => {
    const { rerender } = renderHook(() => useOpdFlowWorkbenchScreen());

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));
    rerender({});
    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));
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
});
