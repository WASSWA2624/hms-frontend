/**
 * Audit Log Model Tests
 * File: audit-log.model.test.js
 */
import { normalizeAuditLog, normalizeAuditLogList } from '@features/audit-log';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('audit-log.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeAuditLog, normalizeAuditLogList);
  });
});
