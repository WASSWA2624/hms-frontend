/**
 * Visit Queue API Tests
 * File: visit-queue.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { visitQueueApi } from '@features/visit-queue/visit-queue.api';

jest.mock('@services/api', () => ({
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
});
