/**
 * Data Processing Log Rules Tests
 * File: data-processing-log.rules.test.js
 */
import {
  parseDataProcessingLogId,
  parseDataProcessingLogListParams,
  parseDataProcessingLogPayload,
} from '@features/data-processing-log';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('data-processing-log.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseDataProcessingLogId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseDataProcessingLogPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseDataProcessingLogListParams);
  });
});
