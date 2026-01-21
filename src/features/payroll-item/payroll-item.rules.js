/**
 * Payroll Item Rules
 * File: payroll-item.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parsePayrollItemId = (value) => parseId(value);
const parsePayrollItemPayload = (value) => parsePayload(value);
const parsePayrollItemListParams = (value) => parseListParams(value);

export { parsePayrollItemId, parsePayrollItemPayload, parsePayrollItemListParams };
