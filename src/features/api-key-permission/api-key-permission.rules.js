/**
 * API Key Permission Rules
 * File: api-key-permission.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseApiKeyPermissionId = (value) => parseId(value);
const parseApiKeyPermissionPayload = (value) => parsePayload(value);
const parseApiKeyPermissionListParams = (value) => parseListParams(value);

export { parseApiKeyPermissionId, parseApiKeyPermissionPayload, parseApiKeyPermissionListParams };
