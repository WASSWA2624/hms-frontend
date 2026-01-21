/**
 * Data Processing Log API Tests
 * File: data-processing-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { dataProcessingLogApi } from '@features/data-processing-log/data-processing-log.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('data-processing-log.api', () => {
  it('creates crud api with data processing log endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.DATA_PROCESSING_LOGS);
    expect(dataProcessingLogApi).toBeDefined();
  });
});
