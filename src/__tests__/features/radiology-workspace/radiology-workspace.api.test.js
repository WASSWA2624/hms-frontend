import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { radiologyWorkspaceApi } from '@features/radiology-workspace/radiology-workspace.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => ''),
}));

describe('radiology-workspace.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiClient.mockResolvedValue({ data: {} });
  });

  it('lists workbench payload', async () => {
    buildQueryString.mockReturnValue('?page=1&limit=20');
    await radiologyWorkspaceApi.listWorkbench({ page: 1, limit: 20 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.RADIOLOGY_WORKSPACE.WORKBENCH}?page=1&limit=20`,
      method: 'GET',
    });
  });

  it('loads workflow and resolver payloads', async () => {
    await radiologyWorkspaceApi.getOrderWorkflow('RAD-001');
    await radiologyWorkspaceApi.resolveLegacyRoute('radiology-orders', 'RAD-001');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.ORDER_WORKFLOW('RAD-001'),
      method: 'GET',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.RESOLVE_LEGACY('radiology-orders', 'RAD-001'),
      method: 'GET',
    });
  });

  it('posts workflow actions', async () => {
    const payload = { notes: 'ok' };
    await radiologyWorkspaceApi.assignOrder('RAD-001', payload);
    await radiologyWorkspaceApi.startOrder('RAD-001', payload);
    await radiologyWorkspaceApi.completeOrder('RAD-001', payload);
    await radiologyWorkspaceApi.cancelOrder('RAD-001', { reason: 'patient declined' });
    await radiologyWorkspaceApi.createStudy('RAD-001', payload);

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.ASSIGN_ORDER('RAD-001'),
      method: 'POST',
      body: payload,
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.START_ORDER('RAD-001'),
      method: 'POST',
      body: payload,
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.COMPLETE_ORDER('RAD-001'),
      method: 'POST',
      body: payload,
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.CANCEL_ORDER('RAD-001'),
      method: 'POST',
      body: { reason: 'patient declined' },
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.CREATE_STUDY('RAD-001'),
      method: 'POST',
      body: payload,
    });
  });

  it('posts study upload/sync and reporting actions', async () => {
    await radiologyWorkspaceApi.initAssetUpload('STDY-001', { file_name: 'file.dcm' });
    await radiologyWorkspaceApi.commitAssetUpload('STDY-001', { storage_key: 'x' });
    await radiologyWorkspaceApi.syncStudyToPacs('STDY-001', {});
    await radiologyWorkspaceApi.draftResult('RAD-001', {});
    await radiologyWorkspaceApi.finalizeResult('RSLT-001', {});
    await radiologyWorkspaceApi.addendumResult('RSLT-001', { addendum_text: 'extra' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.INIT_ASSET_UPLOAD('STDY-001'),
      method: 'POST',
      body: { file_name: 'file.dcm' },
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.COMMIT_ASSET_UPLOAD('STDY-001'),
      method: 'POST',
      body: { storage_key: 'x' },
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.SYNC_STUDY('STDY-001'),
      method: 'POST',
      body: {},
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.DRAFT_RESULT('RAD-001'),
      method: 'POST',
      body: {},
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.FINALIZE_RESULT('RSLT-001'),
      method: 'POST',
      body: {},
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_WORKSPACE.ADDENDUM_RESULT('RSLT-001'),
      method: 'POST',
      body: { addendum_text: 'extra' },
    });
  });
});

