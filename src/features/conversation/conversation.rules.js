/**
 * Conversation Rules
 * File: conversation.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseConversationId = (value) => parseId(value);
const parseConversationPayload = (value) => parsePayload(value);
const parseConversationListParams = (value) => parseListParams(value);

export {
  parseConversationId,
  parseConversationPayload,
  parseConversationListParams,
};
