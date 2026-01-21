/**
 * System Change Log API Tests
 * File: system-change-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { systemChangeLogApi } from '@features/system-change-log/system-change-log.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('system-change-log.api', () => {
  it('creates crud api with system change log endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.SYSTEM_CHANGE_LOGS);
    expect(systemChangeLogApi).toBeDefined();
  });
});
