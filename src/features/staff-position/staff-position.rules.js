/**
 * Staff Position Rules
 * File: staff-position.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseStaffPositionId = (value) => parseId(value);
const parseStaffPositionPayload = (value) => parsePayload(value);
const parseStaffPositionListParams = (value) => parseListParams(value);

export { parseStaffPositionId, parseStaffPositionPayload, parseStaffPositionListParams };

