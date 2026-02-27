const { act, renderHook, waitFor } = require('@testing-library/react-native');

let mockSearchParams = {};
const mockRouter = {
  replace: jest.fn(),
  setParams: jest.fn(),
  push: jest.fn(),
};

const mockListWorkbench = jest.fn();
const mockGetWorkflow = jest.fn();
const mockResolveLegacyRoute = jest.fn();
const mockCollect = jest.fn();
const mockReceive = jest.fn();
const mockReject = jest.fn();
const mockRelease = jest.fn();
const mockReset = jest.fn();

let realtimeHandlers = {};

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => mockSearchParams),
  useRouter: jest.fn(() => mockRouter),
}));

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
  useI18n: jest.fn(),
  useLabWorkspace: jest.fn(),
  useNetwork: jest.fn(),
  useRealtimeEvent: jest.fn(),
  useScopeAccess: jest.fn(),
}));

const useLabWorkbenchScreen =
  require('@platform/screens/lab/LabWorkbenchScreen/useLabWorkbenchScreen').default;
const {
  useAuth,
  useI18n,
  useLabWorkspace,
  useNetwork,
  useRealtimeEvent,
  useScopeAccess,
} = require('@hooks');

const buildOrder = ({
  id = 'LAB-001',
  patientId = 'PAT-001',
  encounterId = 'ENC-001',
  status = 'ORDERED',
} = {}) => ({
  id,
  display_id: id,
  human_friendly_id: id,
  patient_id: patientId,
  encounter_id: encounterId,
  patient_display_name: 'Jane Doe',
  status,
  item_count: 1,
  sample_count: 1,
  pending_item_count: 1,
  in_process_item_count: 0,
  completed_item_count: 0,
  ordered_at: '2026-02-27T10:00:00.000Z',
  samples: [
    {
      id: 'SMP-001',
      display_id: 'SMP-001',
      status: 'PENDING',
    },
  ],
  items: [
    {
      id: 'ITEM-001',
      display_id: 'ITEM-001',
      status: 'ORDERED',
      test_display_name: 'CBC',
    },
  ],
});

const buildWorkflow = ({ orderId = 'LAB-001', patientId, encounterId } = {}) => ({
  order: buildOrder({
    id: orderId,
    patientId: patientId || 'PAT-001',
    encounterId: encounterId || 'ENC-001',
  }),
  results: [
    {
      id: 'RES-001',
      display_id: 'RES-001',
      lab_order_item_id: 'ITEM-001',
      status: 'PENDING',
      result_unit: 'g/dL',
    },
  ],
  timeline: [
    {
      id: 'timeline-1',
      type: 'ORDER_CREATED',
      label: 'Order created',
      at: '2026-02-27T10:00:00.000Z',
    },
  ],
  next_actions: {
    can_collect: true,
    can_receive_sample: true,
    can_release_result: true,
  },
});

describe('useLabWorkbenchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = {};
    realtimeHandlers = {};
    mockRouter.replace.mockReset();
    mockRouter.setParams.mockReset();
    mockRouter.push.mockReset();

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
      isResolved: true,
    });
    useLabWorkspace.mockReturnValue({
      listWorkbench: mockListWorkbench,
      getWorkflow: mockGetWorkflow,
      resolveLegacyRoute: mockResolveLegacyRoute,
      collect: mockCollect,
      receive: mockReceive,
      reject: mockReject,
      release: mockRelease,
      reset: mockReset,
      isLoading: false,
      errorCode: null,
    });
    useRealtimeEvent.mockImplementation((eventName, handler, options = {}) => {
      if (options.enabled) {
        realtimeHandlers[eventName] = handler;
      }
    });

    mockListWorkbench.mockResolvedValue({
      summary: { total_orders: 1 },
      worklist: [buildOrder()],
      pagination: { page: 1, limit: 50, total: 1 },
    });
    mockGetWorkflow.mockResolvedValue(buildWorkflow({ orderId: 'LAB-001' }));
    mockResolveLegacyRoute.mockResolvedValue({
      identifier: 'LAB-001',
      route: '/lab/orders/LAB-001',
    });
    mockCollect.mockResolvedValue({ workflow: buildWorkflow({ orderId: 'LAB-001' }) });
    mockReceive.mockResolvedValue({ workflow: buildWorkflow({ orderId: 'LAB-001' }) });
    mockReject.mockResolvedValue({ workflow: buildWorkflow({ orderId: 'LAB-001' }) });
    mockRelease.mockResolvedValue({ workflow: buildWorkflow({ orderId: 'LAB-001' }) });
  });

  it('prefills create-order query from route context when no selection is loaded', async () => {
    mockSearchParams = {
      patientId: 'PAT-042',
      encounterId: 'ENC-042',
    };
    mockListWorkbench.mockResolvedValue({
      summary: { total_orders: 0 },
      worklist: [],
      pagination: { page: 1, limit: 50, total: 0 },
    });

    const { result } = renderHook(() => useLabWorkbenchScreen());

    await waitFor(() => expect(mockListWorkbench).toHaveBeenCalled());

    act(() => {
      result.current.onOpenCreateOrder();
    });

    expect(mockRouter.push).toHaveBeenCalledWith(
      '/lab/orders/create?patientId=PAT-042&encounterId=ENC-042'
    );
  });

  it('canonicalizes UUID route id to friendly order id after workflow load', async () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    mockSearchParams = { id: uuid };
    mockListWorkbench.mockResolvedValue({
      summary: { total_orders: 0 },
      worklist: [],
      pagination: { page: 1, limit: 50, total: 0 },
    });
    mockGetWorkflow.mockResolvedValue(buildWorkflow({ orderId: 'LAB-777' }));

    const { result } = renderHook(() => useLabWorkbenchScreen());

    await waitFor(() => expect(result.current.selectedOrderId).toBe('LAB-777'));
    expect(mockGetWorkflow).toHaveBeenCalledWith(uuid);
    expect(mockRouter.setParams).toHaveBeenCalledWith({ id: 'LAB-777' });
  });

  it('refreshes selected workflow on matching realtime event without queue reload', async () => {
    renderHook(() => useLabWorkbenchScreen());

    await waitFor(() => expect(mockGetWorkflow).toHaveBeenCalled());
    expect(typeof realtimeHandlers['diagnostic.lab_workflow_updated']).toBe('function');

    mockGetWorkflow.mockClear();
    mockListWorkbench.mockClear();

    await act(async () => {
      realtimeHandlers['diagnostic.lab_workflow_updated']({
        order_public_id: 'LAB-001',
      });
      await Promise.resolve();
    });

    await waitFor(() => expect(mockGetWorkflow).toHaveBeenCalledTimes(1));
    expect(mockListWorkbench).not.toHaveBeenCalled();
  });

  it('refreshes queue on non-matching realtime event', async () => {
    renderHook(() => useLabWorkbenchScreen());

    await waitFor(() => expect(mockGetWorkflow).toHaveBeenCalled());
    expect(typeof realtimeHandlers['diagnostic.lab_workflow_updated']).toBe('function');

    mockGetWorkflow.mockClear();
    mockListWorkbench.mockClear();

    await act(async () => {
      realtimeHandlers['diagnostic.lab_workflow_updated']({
        order_public_id: 'LAB-999',
      });
      await Promise.resolve();
    });

    await waitFor(() => expect(mockListWorkbench).toHaveBeenCalledTimes(1));
    expect(mockGetWorkflow).not.toHaveBeenCalled();
  });

  it('prefills action drafts from selected order workflow context', async () => {
    const { result } = renderHook(() => useLabWorkbenchScreen());

    await waitFor(() => expect(result.current.selectedOrderId).toBe('LAB-001'));
    await waitFor(() => {
      expect(result.current.collectDraft.sample_id).toBe('SMP-001');
      expect(result.current.receiveDraft.sample_id).toBe('SMP-001');
      expect(result.current.rejectDraft.sample_id).toBe('SMP-001');
      expect(result.current.releaseDraft.order_item_id).toBe('ITEM-001');
    });
  });
});
