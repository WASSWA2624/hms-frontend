/**
 * User Role Rules
 * File: user-role.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseUserRoleId = (value) => parseId(value);
const parseUserRolePayload = (value) => parsePayload(value);
const parseUserRoleListParams = (value) => parseListParams(value);

export { parseUserRoleId, parseUserRolePayload, parseUserRoleListParams };
