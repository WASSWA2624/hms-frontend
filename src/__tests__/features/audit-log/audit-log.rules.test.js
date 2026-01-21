/**
 * Audit Log Rules Tests
 * File: audit-log.rules.test.js
 */
import { parseAuditLogId, parseAuditLogListParams, parseAuditLogPayload } from '@features/audit-log';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('audit-log.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseAuditLogId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseAuditLogPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseAuditLogListParams);
  });
});
