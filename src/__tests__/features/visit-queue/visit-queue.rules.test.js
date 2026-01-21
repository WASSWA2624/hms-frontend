/**
 * Visit Queue Rules Tests
 * File: visit-queue.rules.test.js
 */
import { parseVisitQueueId, parseVisitQueueListParams, parseVisitQueuePayload } from '@features/visit-queue';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('visit-queue.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseVisitQueueId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseVisitQueuePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseVisitQueueListParams);
  });
});
