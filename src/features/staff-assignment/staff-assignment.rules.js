/**
 * Staff Assignment Rules
 * File: staff-assignment.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseStaffAssignmentId = (value) => parseId(value);
const parseStaffAssignmentPayload = (value) => parsePayload(value);
const parseStaffAssignmentListParams = (value) => parseListParams(value);

export { parseStaffAssignmentId, parseStaffAssignmentPayload, parseStaffAssignmentListParams };
