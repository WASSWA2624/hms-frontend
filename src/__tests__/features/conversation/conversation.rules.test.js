/**
 * Conversation Rules Tests
 * File: conversation.rules.test.js
 */
import {
  parseConversationId,
  parseConversationListParams,
  parseConversationPayload,
} from '@features/conversation';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('conversation.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseConversationId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseConversationPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseConversationListParams);
  });
});
