/**
 * Lab Result API Tests
 * File: lab-result.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { labResultApi } from '@features/lab-result/lab-result.api';

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

describe('lab-result.api', () => {
  it('creates crud api with lab result endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.LAB_RESULTS);
    expect(labResultApi).toBeDefined();
  });

  it('posts lab result release action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'RELEASED' } });
    await labResultApi.release('1', { notes: 'Validated by pathologist' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.LAB_RESULTS.RELEASE('1'),
      method: 'POST',
      body: { notes: 'Validated by pathologist' },
    });
  });

  it('posts lab result release action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'RELEASED' } });
    await labResultApi.release('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.LAB_RESULTS.RELEASE('1'),
      method: 'POST',
      body: {},
    });
  });
});
