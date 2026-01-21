/**
 * User Rules
 * File: user.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseUserId = (value) => parseId(value);
const parseUserPayload = (value) => parsePayload(value);
const parseUserListParams = (value) => parseListParams(value);

export { parseUserId, parseUserPayload, parseUserListParams };
