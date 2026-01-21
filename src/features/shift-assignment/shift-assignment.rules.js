/**
 * Shift Assignment Rules
 * File: shift-assignment.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseShiftAssignmentId = (value) => parseId(value);
const parseShiftAssignmentPayload = (value) => parsePayload(value);
const parseShiftAssignmentListParams = (value) => parseListParams(value);

export { parseShiftAssignmentId, parseShiftAssignmentPayload, parseShiftAssignmentListParams };
