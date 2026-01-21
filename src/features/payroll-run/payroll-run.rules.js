/**
 * Payroll Run Rules
 * File: payroll-run.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parsePayrollRunId = (value) => parseId(value);
const parsePayrollRunPayload = (value) => parsePayload(value);
const parsePayrollRunListParams = (value) => parseListParams(value);

export { parsePayrollRunId, parsePayrollRunPayload, parsePayrollRunListParams };
