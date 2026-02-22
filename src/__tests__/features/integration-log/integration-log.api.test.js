/**
 * Integration Log API Tests
 * File: integration-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { integrationLogApi } from '@features/integration-log/integration-log.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => '?page=1'),
}));

describe('integration-log.api', () => {
  it('lists integration logs with query params', async () => {
    apiClient.mockResolvedValue({ data: [] });

    await integrationLogApi.list({ page: 1 });

    expect(buildQueryString).toHaveBeenCalledWith({ page: 1 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.INTEGRATION_LOGS.LIST}?page=1`,
      method: 'GET',
    });
  });

  it('gets an integration log by id', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await integrationLogApi.get('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INTEGRATION_LOGS.GET('1'),
      method: 'GET',
    });
  });

  it('lists integration logs by integration id', async () => {
    apiClient.mockResolvedValue({ data: [] });

    await integrationLogApi.listByIntegration('integration-1', { page: 1 });

    expect(buildQueryString).toHaveBeenCalledWith({ page: 1 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.INTEGRATION_LOGS.GET_BY_INTEGRATION('integration-1')}?page=1`,
      method: 'GET',
    });
  });

  it('posts replay action for an integration log', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await integrationLogApi.replay('1', { reason: 'manual_retry' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INTEGRATION_LOGS.REPLAY('1'),
      method: 'POST',
      body: { reason: 'manual_retry' },
    });
  });

  it('posts replay action for an integration log with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await integrationLogApi.replay('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INTEGRATION_LOGS.REPLAY('1'),
      method: 'POST',
      body: {},
    });
  });
});
