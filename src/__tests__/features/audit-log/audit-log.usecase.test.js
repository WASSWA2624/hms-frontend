/**
 * Audit Log Usecase Tests
 * File: audit-log.usecase.test.js
 */
import {
  listAuditLogs,
  getAuditLog,
  createAuditLog,
  updateAuditLog,
  deleteAuditLog,
} from '@features/audit-log';
import { auditLogApi } from '@features/audit-log/audit-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/audit-log/audit-log.api', () => ({
  auditLogApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('audit-log.usecase', () => {
  beforeEach(() => {
    auditLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    auditLogApi.get.mockResolvedValue({ data: { id: '1' } });
    auditLogApi.create.mockResolvedValue({ data: { id: '1' } });
    auditLogApi.update.mockResolvedValue({ data: { id: '1' } });
    auditLogApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listAuditLogs,
      get: getAuditLog,
      create: createAuditLog,
      update: updateAuditLog,
      remove: deleteAuditLog,
    },
    { queueRequestIfOffline }
  );
});
