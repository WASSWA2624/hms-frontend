/**
 * Department Rules
 * File: department.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseDepartmentId = (value) => parseId(value);
const parseDepartmentPayload = (value) => parsePayload(value);
const parseDepartmentListParams = (value) => parseListParams(value);

export { parseDepartmentId, parseDepartmentPayload, parseDepartmentListParams };
