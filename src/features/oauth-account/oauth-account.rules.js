/**
 * OAuth Account Rules
 * File: oauth-account.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseOauthAccountId = (value) => parseId(value);
const parseOauthAccountPayload = (value) => parsePayload(value);
const parseOauthAccountListParams = (value) => parseListParams(value);

export { parseOauthAccountId, parseOauthAccountPayload, parseOauthAccountListParams };
