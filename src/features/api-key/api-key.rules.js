/**
 * API Key Rules
 * File: api-key.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseApiKeyId = (value) => parseId(value);
const parseApiKeyPayload = (value) => parsePayload(value);
const parseApiKeyListParams = (value) => parseListParams(value);

export { parseApiKeyId, parseApiKeyPayload, parseApiKeyListParams };
