const { act, renderHook, waitFor } = require('@testing-library/react-native');

let mockSearchParams = {};
const mockRouter = {
  replace: jest.fn(),
  setParams: jest.fn(),
};

const mockList = jest.fn();
const mockGet = jest.fn();
const mockStart = jest.fn();
const mockAssignBed = jest.fn();
const mockReleaseBed = jest.fn();
const mockRequestTransfer = jest.fn();
const mockUpdateTransfer = jest.fn();
const mockAddWardRound = jest.fn();
const mockAddNursingNote = jest.fn();
const mockAddMedicationAdministration = jest.fn();
const mockPlanDischarge = jest.fn();
const mockFinalizeDischarge = jest.fn();
const mockReset = jest.fn();
const mockWardList = jest.fn();
const mockBedList = jest.fn();
const mockPatientList = jest.fn();

let realtimeHandlers = {};

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => mockSearchParams),
  useRouter: jest.fn(() => mockRouter),
}));

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
  useBed: jest.fn(),
  useI18n: jest.fn(),
  useIpdFlow: jest.fn(),
  useNetwork: jest.fn(),
  usePatient: jest.fn(),
  useRealtimeEvent: jest.fn(),
  useScopeAccess: jest.fn(),
  useWard: jest.fn(),
}));

const useIpdWorkbenchScreen =
  require('@platform/screens/clinical/IpdWorkbenchScreen/useIpdWorkbenchScreen').default;
const {
  useAuth,
  useBed,
  useI18n,
  useIpdFlow,
  useNetwork,
  useRealtimeEvent,
  useScopeAccess,
  useWard,
  usePatient,
} = require('@hooks');

const buildSnapshot = ({
  id = 'admission-1',
  publicId = 'ADM-001',
  stage = 'ADMITTED_PENDING_BED',
  nextStep = 'ASSIGN_BED',
} = {}) => ({
  id,
  human_friendly_id: publicId,
  display_id: publicId,
  stage,
  next_step: nextStep,
  patient_display_name: 'Jane Doe',
  patient_display_id: 'PAT-001',
  ward_display_name: 'Ward A',
  flow: {
    stage,
    next_step: nextStep,
  },
  patient: {
    first_name: 'Jane',
    last_name: 'Doe',
  },
  active_bed_assignment: null,
  open_transfer_request: null,
  latest_discharge_summary: null,
  timeline: [],
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

describe('useIpdWorkbenchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = {};
    realtimeHandlers = {};
    mockRouter.replace.mockReset();
    mockRouter.setParams.mockReset();

    useI18n.mockReturnValue({
      t: (key) => key,
    });
    useNetwork.mockReturnValue({
      isOffline: false,
    });
    useAuth.mockReturnValue({
      user: {
        id: 'user-1',
        human_friendly_id: 'USR-001',
      },
    });
    useScopeAccess.mockReturnValue({
      canRead: true,
      canWrite: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });
    useWard.mockReturnValue({
      list: mockWardList,
    });
    useBed.mockReturnValue({
      list: mockBedList,
    });
    usePatient.mockReturnValue({
      list: mockPatientList,
    });
    useIpdFlow.mockReturnValue({
      list: mockList,
      get: mockGet,
      start: mockStart,
      assignBed: mockAssignBed,
      releaseBed: mockReleaseBed,
      requestTransfer: mockRequestTransfer,
      updateTransfer: mockUpdateTransfer,
      addWardRound: mockAddWardRound,
      addNursingNote: mockAddNursingNote,
      addMedicationAdministration: mockAddMedicationAdministration,
      planDischarge: mockPlanDischarge,
      finalizeDischarge: mockFinalizeDischarge,
      reset: mockReset,
      isLoading: false,
      errorCode: null,
    });
    useRealtimeEvent.mockImplementation((eventName, handler, options = {}) => {
      if (options.enabled) {
        realtimeHandlers[eventName] = handler;
      }
    });

    mockWardList.mockResolvedValue({
      items: [{ id: 'ward-1', human_friendly_id: 'WRD-001', name: 'Ward A' }],
    });
    mockBedList.mockResolvedValue({
      items: [{ id: 'bed-1', human_friendly_id: 'BED-001', label: 'Bed A1', status: 'AVAILABLE' }],
    });
    mockPatientList.mockResolvedValue({
      items: [{ id: 'patient-1', human_friendly_id: 'PAT-001', first_name: 'Jane', last_name: 'Doe' }],
    });
    mockList.mockResolvedValue({
      items: [buildSnapshot()],
      pagination: { page: 1, limit: 40, total: 1 },
    });
    mockGet.mockResolvedValue(buildSnapshot());
    mockStart.mockResolvedValue(buildSnapshot({ id: 'admission-2', publicId: 'ADM-002' }));
    mockAssignBed.mockResolvedValue(buildSnapshot({ stage: 'ADMITTED_IN_BED', nextStep: 'REQUEST_TRANSFER' }));
    mockReleaseBed.mockResolvedValue(buildSnapshot({ stage: 'ADMITTED_PENDING_BED', nextStep: 'ASSIGN_BED' }));
    mockRequestTransfer.mockResolvedValue(buildSnapshot({ stage: 'TRANSFER_REQUESTED', nextStep: 'UPDATE_TRANSFER' }));
    mockUpdateTransfer.mockResolvedValue(buildSnapshot({ stage: 'TRANSFER_IN_PROGRESS', nextStep: 'COMPLETE_TRANSFER' }));
    mockAddWardRound.mockResolvedValue(buildSnapshot());
    mockAddNursingNote.mockResolvedValue(buildSnapshot({ stage: 'ADMITTED_IN_BED' }));
    mockAddMedicationAdministration.mockResolvedValue(buildSnapshot());
    mockPlanDischarge.mockResolvedValue(buildSnapshot({ stage: 'DISCHARGE_PLANNED', nextStep: 'FINALIZE_DISCHARGE' }));
    mockFinalizeDischarge.mockResolvedValue(buildSnapshot({ stage: 'DISCHARGED', nextStep: '' }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('applies debounced search before reloading IPD list', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useIpdWorkbenchScreen());

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));
    mockList.mockClear();

    act(() => {
      result.current.onFlowSearchChange('jane');
    });

    await act(async () => {
      jest.advanceTimersByTime(279);
      await Promise.resolve();
    });

    expect(
      mockList.mock.calls.some(([params]) => String(params?.search || '').toLowerCase() === 'jane')
    ).toBe(false);

    await act(async () => {
      jest.advanceTimersByTime(1);
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ search: 'jane' }))
    );
  });

  it('loads queue with ACTIVE scope by default', async () => {
    renderHook(() => useIpdWorkbenchScreen());
    await waitFor(() => expect(mockList).toHaveBeenCalled());
    expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ queue_scope: 'ACTIVE' }));
  });

  it('prefills start admission form from query params', async () => {
    mockSearchParams = {
      action: 'start_admission',
      patientId: 'PAT-042',
    };

    const { result } = renderHook(() => useIpdWorkbenchScreen());

    await waitFor(() => {
      expect(result.current.isStartFormOpen).toBe(true);
      expect(result.current.startDraft.patient_id).toBe('PAT-042');
    });
  });

  it('canonicalizes UUID route IDs to public admission IDs after snapshot load', async () => {
    mockSearchParams = {
      id: '550e8400-e29b-41d4-a716-446655440000',
    };
    mockList.mockResolvedValue({
      items: [],
      pagination: { page: 1, limit: 40, total: 0 },
    });
    mockGet.mockResolvedValue(buildSnapshot({ id: 'admission-7', publicId: 'ADM-777' }));

    const { result } = renderHook(() => useIpdWorkbenchScreen());

    await waitFor(() => expect(result.current.selectedFlowId).toBe('ADM-777'));
    expect(mockRouter.setParams).toHaveBeenCalledWith({ id: 'ADM-777' });
  });

  it('upserts local snapshot after successful nursing-note action', async () => {
    const updatedSnapshot = buildSnapshot({
      id: 'admission-1',
      publicId: 'ADM-001',
      stage: 'DISCHARGE_PLANNED',
      nextStep: 'FINALIZE_DISCHARGE',
    });
    mockAddNursingNote.mockResolvedValue(updatedSnapshot);

    const { result } = renderHook(() => useIpdWorkbenchScreen());

    await waitFor(() => expect(result.current.selectedFlowId).toBe('ADM-001'));

    act(() => {
      result.current.onNursingDraftChange('note', 'Stable and resting comfortably');
    });

    await act(async () => {
      await result.current.onAddNursingNote();
    });

    await waitFor(() => {
      expect(result.current.selectedFlow?.stage).toBe('DISCHARGE_PLANNED');
      expect(result.current.flowList[0]?.stage).toBe('DISCHARGE_PLANNED');
    });
  });

  it('blocks finalize discharge action until stage allows it', async () => {
    const { result } = renderHook(() => useIpdWorkbenchScreen());
    await waitFor(() => expect(result.current.selectedFlowId).toBe('ADM-001'));

    await act(async () => {
      await result.current.onFinalizeDischarge();
    });

    expect(mockFinalizeDischarge).not.toHaveBeenCalled();
  });

  it('keeps list interactive while selected snapshot is refreshing', async () => {
    const deferredSnapshot = createDeferred();
    mockGet.mockImplementationOnce(() => deferredSnapshot.promise);

    const { result } = renderHook(() => useIpdWorkbenchScreen());

    await waitFor(() => expect(mockList).toHaveBeenCalled());
    await waitFor(() => expect(result.current.isSelectedSnapshotLoading).toBe(true));
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      deferredSnapshot.resolve(buildSnapshot());
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.isSelectedSnapshotLoading).toBe(false));
  });

  it('refreshes selected snapshot on matching realtime event without full list reload', async () => {
    renderHook(() => useIpdWorkbenchScreen());

    await waitFor(() => expect(mockGet).toHaveBeenCalled());
    expect(typeof realtimeHandlers['ipd.flow.updated']).toBe('function');

    mockGet.mockClear();
    mockList.mockClear();

    await act(async () => {
      realtimeHandlers['ipd.flow.updated']({
        admission_public_id: 'ADM-001',
      });
      await Promise.resolve();
    });

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    expect(mockList).not.toHaveBeenCalled();
  });
});
