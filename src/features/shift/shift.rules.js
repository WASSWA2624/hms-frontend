/**
 * Shift Rules
 * File: shift.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseShiftId = (value) => parseId(value);
const parseShiftPayload = (value) => parsePayload(value);
const parseShiftListParams = (value) => parseListParams(value);

export { parseShiftId, parseShiftPayload, parseShiftListParams };
