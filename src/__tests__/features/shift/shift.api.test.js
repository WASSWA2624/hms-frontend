/**
 * Shift API Tests
 * File: shift.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { shiftApi } from '@features/shift/shift.api';

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

describe('shift.api', () => {
  it('creates crud api with shift endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.SHIFTS);
    expect(shiftApi).toBeDefined();
  });

  it('posts shift publish action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'PUBLISHED' } });

    await shiftApi.publish('1', { notify_staff: true });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SHIFTS.PUBLISH('1'),
      method: 'POST',
      body: { notify_staff: true },
    });
  });
});
