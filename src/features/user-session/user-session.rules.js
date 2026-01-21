/**
 * User Session Rules
 * File: user-session.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parseListParams } = createCrudRules();

const parseUserSessionId = (value) => parseId(value);
const parseUserSessionListParams = (value) => parseListParams(value);

export { parseUserSessionId, parseUserSessionListParams };
