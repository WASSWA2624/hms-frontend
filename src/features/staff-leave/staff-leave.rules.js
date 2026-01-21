/**
 * Staff Leave Rules
 * File: staff-leave.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseStaffLeaveId = (value) => parseId(value);
const parseStaffLeavePayload = (value) => parsePayload(value);
const parseStaffLeaveListParams = (value) => parseListParams(value);

export { parseStaffLeaveId, parseStaffLeavePayload, parseStaffLeaveListParams };
