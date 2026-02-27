/**
 * Lab Workspace Usecase Tests
 * File: lab-workspace.usecase.test.js
 */
import {
  collectLabOrder,
  getLabOrderWorkflow,
  listLabWorkbench,
  receiveLabSample,
  rejectLabSample,
  releaseLabOrderItem,
  resolveLabLegacyRoute,
} from '@features/lab-workspace';
import { labWorkspaceApi } from '@features/lab-workspace/lab-workspace.api';

jest.mock('@features/lab-workspace/lab-workspace.api', () => ({
  labWorkspaceApi: {
    listWorkbench: jest.fn(),
    getOrderWorkflow: jest.fn(),
    resolveLegacyRoute: jest.fn(),
    collectOrder: jest.fn(),
    receiveSample: jest.fn(),
    rejectSample: jest.fn(),
    releaseOrderItem: jest.fn(),
  },
}));

const buildWorkflowPayload = (orderId = 'LAB-001') => ({
  order: {
    id: orderId,
    display_id: orderId,
    status: 'ORDERED',
  },
  results: [],
  timeline: [],
  next_actions: {
    can_collect: true,
    can_receive_sample: true,
    can_release_result: true,
  },
});

describe('lab-workspace.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    labWorkspaceApi.listWorkbench.mockResolvedValue({
      data: {
        summary: { total_orders: 1 },
        worklist: [{ id: 'LAB-001', display_id: 'LAB-001' }],
        pagination: { page: 1, limit: 50, total: 1 },
      },
    });
    labWorkspaceApi.getOrderWorkflow.mockResolvedValue({
      data: buildWorkflowPayload('LAB-001'),
    });
    labWorkspaceApi.resolveLegacyRoute.mockResolvedValue({
      data: {
        resource: 'orders',
        identifier: 'LAB-001',
        route: '/lab/orders/LAB-001',
        matched_by: 'human_friendly_id',
      },
    });
    labWorkspaceApi.collectOrder.mockResolvedValue({
      data: { workflow: buildWorkflowPayload('LAB-001') },
    });
    labWorkspaceApi.receiveSample.mockResolvedValue({
      data: { workflow: buildWorkflowPayload('LAB-001') },
    });
    labWorkspaceApi.rejectSample.mockResolvedValue({
      data: { workflow: buildWorkflowPayload('LAB-001') },
    });
    labWorkspaceApi.releaseOrderItem.mockResolvedValue({
      data: {
        workflow: buildWorkflowPayload('LAB-001'),
        released_result: { id: 'RES-001', display_id: 'RES-001' },
      },
    });
  });

  it('lists workbench payload with parsed filters', async () => {
    const result = await listLabWorkbench({ page: '1', limit: '20', stage: 'COLLECTION' });

    expect(labWorkspaceApi.listWorkbench).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      stage: 'COLLECTION',
    });
    expect(result.worklist[0].id).toBe('LAB-001');
  });

  it('loads order workflow by identifier', async () => {
    const result = await getLabOrderWorkflow('LAB-001');

    expect(labWorkspaceApi.getOrderWorkflow).toHaveBeenCalledWith('LAB-001');
    expect(result.order?.id).toBe('LAB-001');
  });

  it('resolves legacy route mapping to canonical payload', async () => {
    const result = await resolveLabLegacyRoute('lab-orders', 'LAB-001');

    expect(labWorkspaceApi.resolveLegacyRoute).toHaveBeenCalledWith('lab-orders', 'LAB-001');
    expect(result).toEqual({
      id: 'LAB-001',
      identifier: 'LAB-001',
      resource: 'orders',
      route: '/lab/orders/LAB-001',
      matched_by: 'human_friendly_id',
    });
  });

  it('submits collect/receive/reject/release actions', async () => {
    const collectResult = await collectLabOrder('LAB-001', {
      sample_id: 'SMP-001',
      collected_at: '2026-02-27T10:00:00.000Z',
    });
    expect(labWorkspaceApi.collectOrder).toHaveBeenCalledWith('LAB-001', {
      sample_id: 'SMP-001',
      collected_at: '2026-02-27T10:00:00.000Z',
    });
    expect(collectResult.workflow.order?.id).toBe('LAB-001');

    const receiveResult = await receiveLabSample('SMP-001', {
      received_at: '2026-02-27T10:10:00.000Z',
    });
    expect(labWorkspaceApi.receiveSample).toHaveBeenCalledWith('SMP-001', {
      received_at: '2026-02-27T10:10:00.000Z',
    });
    expect(receiveResult.workflow.order?.id).toBe('LAB-001');

    const rejectResult = await rejectLabSample('SMP-001', {
      reason: 'Hemolysed specimen',
    });
    expect(labWorkspaceApi.rejectSample).toHaveBeenCalledWith('SMP-001', {
      reason: 'Hemolysed specimen',
    });
    expect(rejectResult.workflow.order?.id).toBe('LAB-001');

    const releaseResult = await releaseLabOrderItem('ITEM-001', {
      result_id: 'RES-001',
      status: 'NORMAL',
    });
    expect(labWorkspaceApi.releaseOrderItem).toHaveBeenCalledWith('ITEM-001', {
      result_id: 'RES-001',
      status: 'NORMAL',
    });
    expect(releaseResult.workflow.order?.id).toBe('LAB-001');
    expect(releaseResult.released_result).toEqual({
      id: 'RES-001',
      display_id: 'RES-001',
    });
  });

  it('rejects invalid identifiers', async () => {
    await expect(getLabOrderWorkflow('!')).rejects.toBeDefined();
  });
});
