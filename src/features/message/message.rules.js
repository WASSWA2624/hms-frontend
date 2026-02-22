/**
 * Message Rules
 * File: message.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseMessageId = (value) => parseId(value);
const parseMessagePayload = (value) => parsePayload(value);
const parseMessageListParams = (value) => parseListParams(value);

export {
  parseMessageId,
  parseMessagePayload,
  parseMessageListParams,
};
