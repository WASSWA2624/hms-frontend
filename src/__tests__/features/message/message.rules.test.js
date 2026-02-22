/**
 * Message Rules Tests
 * File: message.rules.test.js
 */
import {
  parseMessageId,
  parseMessageListParams,
  parseMessagePayload,
} from '@features/message';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('message.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseMessageId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseMessagePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseMessageListParams);
  });
});
