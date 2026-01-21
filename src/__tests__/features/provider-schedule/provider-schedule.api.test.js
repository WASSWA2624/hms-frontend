/**
 * Provider Schedule API Tests
 * File: provider-schedule.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { providerScheduleApi } from '@features/provider-schedule/provider-schedule.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('provider-schedule.api', () => {
  it('creates crud api with provider schedule endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PROVIDER_SCHEDULES);
    expect(providerScheduleApi).toBeDefined();
  });
});
