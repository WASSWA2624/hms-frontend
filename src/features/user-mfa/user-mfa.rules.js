/**
 * User MFA Rules
 * File: user-mfa.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseUserMfaId = (value) => parseId(value);
const parseUserMfaPayload = (value) => parsePayload(value);
const parseUserMfaListParams = (value) => parseListParams(value);

export { parseUserMfaId, parseUserMfaPayload, parseUserMfaListParams };
