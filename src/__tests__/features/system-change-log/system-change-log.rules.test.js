/**
 * System Change Log Rules Tests
 * File: system-change-log.rules.test.js
 */
import {
  parseSystemChangeLogId,
  parseSystemChangeLogListParams,
  parseSystemChangeLogPayload,
} from '@features/system-change-log';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('system-change-log.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseSystemChangeLogId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseSystemChangeLogPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseSystemChangeLogListParams);
  });
});
