/**
 * Integration API Tests
 * File: integration.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { integrationApi } from '@features/integration/integration.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('integration.api', () => {
  it('creates crud api with integration endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.INTEGRATIONS);
    expect(integrationApi).toBeDefined();
  });

  it('posts integration test connection action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await integrationApi.testConnection('1', { mode: 'ping' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INTEGRATIONS.TEST_CONNECTION('1'),
      method: 'POST',
      body: { mode: 'ping' },
    });
  });

  it('posts integration test connection action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await integrationApi.testConnection('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INTEGRATIONS.TEST_CONNECTION('1'),
      method: 'POST',
      body: {},
    });
  });

  it('posts integration sync now action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await integrationApi.syncNow('1', { scope: 'full' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INTEGRATIONS.SYNC_NOW('1'),
      method: 'POST',
      body: { scope: 'full' },
    });
  });

  it('posts integration sync now action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await integrationApi.syncNow('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INTEGRATIONS.SYNC_NOW('1'),
      method: 'POST',
      body: {},
    });
  });
});
