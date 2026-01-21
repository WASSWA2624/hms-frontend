/**
 * Ward Rules
 * File: ward.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseWardId = (value) => parseId(value);
const parseWardPayload = (value) => parsePayload(value);
const parseWardListParams = (value) => parseListParams(value);

export { parseWardId, parseWardPayload, parseWardListParams };
