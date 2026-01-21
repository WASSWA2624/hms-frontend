/**
 * PHI Access Log API Tests
 * File: phi-access-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { phiAccessLogApi } from '@features/phi-access-log/phi-access-log.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('phi-access-log.api', () => {
  it('creates crud api with phi access log endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PHI_ACCESS_LOGS);
    expect(phiAccessLogApi).toBeDefined();
  });
});
