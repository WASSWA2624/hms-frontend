/**
 * Visit Queue API Tests
 * File: visit-queue.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { visitQueueApi } from '@features/visit-queue/visit-queue.api';

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

describe('visit-queue.api', () => {
  it('creates crud api with visit queue endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.VISIT_QUEUES);
    expect(visitQueueApi).toBeDefined();
  });

  it('posts visit queue prioritize action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await visitQueueApi.prioritize('1', { reason: 'Urgent triage' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.VISIT_QUEUES.PRIORITIZE('1'),
      method: 'POST',
      body: { reason: 'Urgent triage' },
    });
  });

  it('posts visit queue prioritize action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await visitQueueApi.prioritize('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.VISIT_QUEUES.PRIORITIZE('1'),
      method: 'POST',
      body: {},
    });
  });
});
