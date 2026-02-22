/**
 * Discharge Summary API Tests
 * File: discharge-summary.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { dischargeSummaryApi } from '@features/discharge-summary/discharge-summary.api';

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

describe('discharge-summary.api', () => {
  it('creates crud api with discharge summary endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.DISCHARGE_SUMMARIES);
    expect(dischargeSummaryApi).toBeDefined();
  });

  it('posts discharge summary finalize action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'COMPLETED' } });
    await dischargeSummaryApi.finalize('1', {
      discharged_at: '2026-02-15T12:00:00.000Z',
      notes: 'Finalized',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.DISCHARGE_SUMMARIES.FINALIZE('1'),
      method: 'POST',
      body: {
        discharged_at: '2026-02-15T12:00:00.000Z',
        notes: 'Finalized',
      },
    });
  });

  it('posts discharge summary finalize action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'COMPLETED' } });
    await dischargeSummaryApi.finalize('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.DISCHARGE_SUMMARIES.FINALIZE('1'),
      method: 'POST',
      body: {},
    });
  });
});
