/**
 * Lab Workspace API Tests
 * File: lab-workspace.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { labWorkspaceApi } from '@features/lab-workspace/lab-workspace.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => ''),
}));

describe('lab-workspace.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiClient.mockResolvedValue({ data: {} });
  });

  it('lists lab workbench payload', async () => {
    buildQueryString.mockReturnValue('?page=1&limit=20');

    await labWorkspaceApi.listWorkbench({ page: 1, limit: 20 });

    expect(buildQueryString).toHaveBeenCalledWith({ page: 1, limit: 20 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.LAB_WORKSPACE.WORKBENCH}?page=1&limit=20`,
      method: 'GET',
    });
  });

  it('gets lab order workflow by id', async () => {
    await labWorkspaceApi.getOrderWorkflow('LAB-001');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.LAB_WORKSPACE.ORDER_WORKFLOW('LAB-001'),
      method: 'GET',
    });
  });

  it('resolves legacy lab routes', async () => {
    await labWorkspaceApi.resolveLegacyRoute('lab-orders', 'LAB-001');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.LAB_WORKSPACE.RESOLVE_LEGACY('lab-orders', 'LAB-001'),
      method: 'GET',
    });
  });

  it('posts collect workflow action', async () => {
    const body = { sample_id: 'SMP-001' };
    await labWorkspaceApi.collectOrder('LAB-001', body);

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.LAB_WORKSPACE.COLLECT_ORDER('LAB-001'),
      method: 'POST',
      body,
    });
  });

  it('posts receive workflow action', async () => {
    const body = { received_at: '2026-02-27T10:00:00.000Z' };
    await labWorkspaceApi.receiveSample('SMP-001', body);

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.LAB_WORKSPACE.RECEIVE_SAMPLE('SMP-001'),
      method: 'POST',
      body,
    });
  });

  it('posts reject workflow action', async () => {
    const body = { reason: 'Hemolysed' };
    await labWorkspaceApi.rejectSample('SMP-001', body);

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.LAB_WORKSPACE.REJECT_SAMPLE('SMP-001'),
      method: 'POST',
      body,
    });
  });

  it('posts release workflow action', async () => {
    const body = { status: 'NORMAL', result_value: '5.5' };
    await labWorkspaceApi.releaseOrderItem('ITEM-001', body);

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.LAB_WORKSPACE.RELEASE_ORDER_ITEM('ITEM-001'),
      method: 'POST',
      body,
    });
  });
});
