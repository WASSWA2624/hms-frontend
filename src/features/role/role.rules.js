/**
 * Role Rules
 * File: role.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseRoleId = (value) => parseId(value);
const parseRolePayload = (value) => parsePayload(value);
const parseRoleListParams = (value) => parseListParams(value);

export { parseRoleId, parseRolePayload, parseRoleListParams };
