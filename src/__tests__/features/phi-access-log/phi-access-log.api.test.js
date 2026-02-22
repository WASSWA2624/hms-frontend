/**
 * PHI Access Log API Tests
 * File: phi-access-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { phiAccessLogApi } from '@features/phi-access-log/phi-access-log.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => '?page=1'),
}));

describe('phi-access-log.api', () => {
  it('lists phi access logs with query params', async () => {
    apiClient.mockResolvedValue({ data: [] });

    await phiAccessLogApi.list({ page: 1 });

    expect(buildQueryString).toHaveBeenCalledWith({ page: 1 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.PHI_ACCESS_LOGS.LIST}?page=1`,
      method: 'GET',
    });
  });

  it('gets a phi access log by id', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await phiAccessLogApi.get('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHI_ACCESS_LOGS.GET('1'),
      method: 'GET',
    });
  });

  it('creates a phi access log', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await phiAccessLogApi.create({ user_id: 'u1' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHI_ACCESS_LOGS.CREATE,
      method: 'POST',
      body: { user_id: 'u1' },
    });
  });

  it('lists phi access logs by user id', async () => {
    apiClient.mockResolvedValue({ data: [] });

    await phiAccessLogApi.listByUser('user-1', { page: 1 });

    expect(buildQueryString).toHaveBeenCalledWith({ page: 1 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.PHI_ACCESS_LOGS.GET_BY_USER('user-1')}?page=1`,
      method: 'GET',
    });
  });
});
