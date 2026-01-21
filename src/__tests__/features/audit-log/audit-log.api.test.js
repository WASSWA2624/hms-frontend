/**
 * Audit Log API Tests
 * File: audit-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { auditLogApi } from '@features/audit-log/audit-log.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('audit-log.api', () => {
  it('creates crud api with audit log endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.AUDIT_LOGS);
    expect(auditLogApi).toBeDefined();
  });
});
