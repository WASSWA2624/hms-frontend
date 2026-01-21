/**
 * PHI Access Log Rules Tests
 * File: phi-access-log.rules.test.js
 */
import {
  parsePhiAccessLogId,
  parsePhiAccessLogListParams,
  parsePhiAccessLogPayload,
} from '@features/phi-access-log';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('phi-access-log.rules', () => {
  it('parses ids', () => {
    expectIdParser(parsePhiAccessLogId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parsePhiAccessLogPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parsePhiAccessLogListParams);
  });
});
