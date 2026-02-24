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
}));

const useOpdFlowWorkbenchScreen =
  require('@platform/screens/scheduling/OpdFlowWorkbenchScreen/useOpdFlowWorkbenchScreen').default;
const { useI18n, useNetwork, useOpdFlow, useOpdFlowAccess } = require('@hooks');

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

  it('does not continuously refetch the OPD flow list on stable renders', async () => {
    const { rerender } = renderHook(() => useOpdFlowWorkbenchScreen());

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));
    rerender({});
    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));
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
});
