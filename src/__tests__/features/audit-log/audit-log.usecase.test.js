/**
 * Audit Log Usecase Tests
 * File: audit-log.usecase.test.js
 */
import {
  listAuditLogs,
  getAuditLog,
} from '@features/audit-log';
import { auditLogApi } from '@features/audit-log/audit-log.api';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/audit-log/audit-log.api', () => ({
  auditLogApi: {
    list: jest.fn(),
    get: jest.fn(),
  },
}));
const queueRequestIfOffline = jest.fn();

describe('audit-log.usecase', () => {
  beforeEach(() => {
    queueRequestIfOffline.mockReset();
    auditLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    auditLogApi.get.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listAuditLogs,
      get: getAuditLog,
    },
    { queueRequestIfOffline }
  );
});
