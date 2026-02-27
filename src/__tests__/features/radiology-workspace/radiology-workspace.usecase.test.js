import {
  addendumRadiologyResult,
  assignRadiologyOrder,
  commitStudyAssetUpload,
  completeRadiologyOrder,
  createRadiologyStudy,
  draftRadiologyResult,
  finalizeRadiologyResult,
  getRadiologyOrderWorkflow,
  initStudyAssetUpload,
  listRadiologyWorkbench,
  resolveRadiologyLegacyRoute,
  startRadiologyOrder,
  syncRadiologyStudy,
} from '@features/radiology-workspace';
import { radiologyWorkspaceApi } from '@features/radiology-workspace/radiology-workspace.api';
import { apiClient } from '@services/api';

jest.mock('@features/radiology-workspace/radiology-workspace.api', () => ({
  radiologyWorkspaceApi: {
    listWorkbench: jest.fn(),
    getOrderWorkflow: jest.fn(),
    resolveLegacyRoute: jest.fn(),
    assignOrder: jest.fn(),
    startOrder: jest.fn(),
    completeOrder: jest.fn(),
    cancelOrder: jest.fn(),
    createStudy: jest.fn(),
    initAssetUpload: jest.fn(),
    commitAssetUpload: jest.fn(),
    syncStudyToPacs: jest.fn(),
    draftResult: jest.fn(),
    finalizeResult: jest.fn(),
    addendumResult: jest.fn(),
  },
}));

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn((params = {}) => {
    const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null);
    if (!entries.length) return '';
    const qs = new URLSearchParams();
    entries.forEach(([key, value]) => qs.append(key, String(value)));
    return `?${qs.toString()}`;
  }),
}));

const workflow = {
  order: { id: 'RAD-001', display_id: 'RAD-001', status: 'ORDERED' },
  results: [],
  studies: [],
  timeline: [],
  next_actions: {
    can_assign: true,
    can_start: true,
  },
};

describe('radiology-workspace.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiClient.mockResolvedValue({ data: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } });
    radiologyWorkspaceApi.listWorkbench.mockResolvedValue({
      data: { summary: { total_orders: 1 }, worklist: [workflow.order], pagination: { page: 1 } },
    });
    radiologyWorkspaceApi.getOrderWorkflow.mockResolvedValue({ data: workflow });
    radiologyWorkspaceApi.resolveLegacyRoute.mockResolvedValue({
      data: {
        resource: 'orders',
        identifier: 'RAD-001',
        route: '/radiology/orders/RAD-001',
        matched_by: 'human_friendly_id',
      },
    });
    radiologyWorkspaceApi.assignOrder.mockResolvedValue({ data: { workflow, assignment: {} } });
    radiologyWorkspaceApi.startOrder.mockResolvedValue({ data: { workflow } });
    radiologyWorkspaceApi.completeOrder.mockResolvedValue({ data: { workflow } });
    radiologyWorkspaceApi.createStudy.mockResolvedValue({ data: { workflow, study: { id: 'STDY-001' } } });
    radiologyWorkspaceApi.initAssetUpload.mockResolvedValue({ data: { storage_key: 'k1' } });
    radiologyWorkspaceApi.commitAssetUpload.mockResolvedValue({
      data: { workflow, asset: { id: 'AST-001' } },
    });
    radiologyWorkspaceApi.syncStudyToPacs.mockResolvedValue({ data: { workflow, sync_status: 'SUCCESS' } });
    radiologyWorkspaceApi.draftResult.mockResolvedValue({ data: { workflow, result: { id: 'R-1' } } });
    radiologyWorkspaceApi.finalizeResult.mockResolvedValue({
      data: { workflow, result: { id: 'R-1', status: 'FINAL' } },
    });
    radiologyWorkspaceApi.addendumResult.mockResolvedValue({
      data: { workflow, result: { id: 'R-2', status: 'AMENDED' } },
    });
  });

  it('lists and loads workflow payload', async () => {
    const list = await listRadiologyWorkbench({ page: '1', limit: '20' });
    const detail = await getRadiologyOrderWorkflow('RAD-001');

    expect(radiologyWorkspaceApi.listWorkbench).toHaveBeenCalledWith({ page: 1, limit: 20 });
    expect(list.worklist[0].id).toBe('RAD-001');
    expect(radiologyWorkspaceApi.getOrderWorkflow).toHaveBeenCalledWith('RAD-001');
    expect(detail.order?.id).toBe('RAD-001');
  });

  it('resolves legacy routes and runs order/study/report actions', async () => {
    const legacy = await resolveRadiologyLegacyRoute('radiology-orders', 'RAD-001');
    expect(legacy.route).toBe('/radiology/orders/RAD-001');

    await assignRadiologyOrder('RAD-001', {});
    await startRadiologyOrder('RAD-001', {});
    await completeRadiologyOrder('RAD-001', {});
    await createRadiologyStudy('RAD-001', {});
    await initStudyAssetUpload('STDY-001', { file_name: 's.dcm' });
    await commitStudyAssetUpload('STDY-001', { storage_key: 'k1' });
    await syncRadiologyStudy('STDY-001', {});
    await draftRadiologyResult('RAD-001', {});
    await finalizeRadiologyResult('R-1', {});
    await addendumRadiologyResult('R-1', { addendum_text: 'late note' });

    expect(radiologyWorkspaceApi.assignOrder).toHaveBeenCalled();
    expect(radiologyWorkspaceApi.startOrder).toHaveBeenCalled();
    expect(radiologyWorkspaceApi.completeOrder).toHaveBeenCalled();
    expect(radiologyWorkspaceApi.createStudy).toHaveBeenCalled();
    expect(radiologyWorkspaceApi.initAssetUpload).toHaveBeenCalled();
    expect(radiologyWorkspaceApi.commitAssetUpload).toHaveBeenCalled();
    expect(radiologyWorkspaceApi.syncStudyToPacs).toHaveBeenCalled();
    expect(radiologyWorkspaceApi.draftResult).toHaveBeenCalled();
    expect(radiologyWorkspaceApi.finalizeResult).toHaveBeenCalled();
    expect(radiologyWorkspaceApi.addendumResult).toHaveBeenCalled();
  });

  it('falls back to legacy workbench list when workspace endpoint is unavailable', async () => {
    radiologyWorkspaceApi.listWorkbench.mockRejectedValue({
      code: 'UNKNOWN_ERROR',
      message: 'API request failed: Not Found',
    });
    apiClient.mockResolvedValueOnce({
      data: [
        {
          human_friendly_id: 'RAD-001',
          status: 'ORDERED',
          ordered_at: '2026-02-27T12:00:00.000Z',
        },
      ],
      pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
    });

    const list = await listRadiologyWorkbench({ page: 1, limit: 50 });

    expect(apiClient).toHaveBeenCalledTimes(1);
    expect(list.worklist[0].id).toBe('RAD-001');
    expect(list.summary.total_orders).toBe(1);
    expect(list.summary.ordered_queue).toBe(1);
  });

  it('falls back to legacy workflow payload when workspace endpoint is unavailable', async () => {
    radiologyWorkspaceApi.getOrderWorkflow.mockRejectedValue({
      code: 'UNKNOWN_ERROR',
      message: 'API request failed: Not Found',
    });

    apiClient
      .mockResolvedValueOnce({
        data: {
          human_friendly_id: 'RAD-001',
          status: 'IN_PROCESS',
          ordered_at: '2026-02-27T10:00:00.000Z',
        },
      })
      .mockResolvedValueOnce({
        data: [
          {
            human_friendly_id: 'RSL-001',
            status: 'DRAFT',
            report_text: 'Draft report',
            reported_at: '2026-02-27T11:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            human_friendly_id: 'STDY-001',
            modality: 'XRAY',
            performed_at: '2026-02-27T10:30:00.000Z',
          },
        ],
      });

    const detail = await getRadiologyOrderWorkflow('RAD-001');

    expect(apiClient).toHaveBeenCalledTimes(3);
    expect(detail.order?.id).toBe('RAD-001');
    expect(detail.results?.[0]?.id).toBe('RSL-001');
    expect(detail.studies?.[0]?.id).toBe('STDY-001');
    expect(detail.next_actions?.can_complete).toBe(true);
  });
});
