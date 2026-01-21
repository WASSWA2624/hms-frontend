/**
 * Staff Profile Rules
 * File: staff-profile.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseStaffProfileId = (value) => parseId(value);
const parseStaffProfilePayload = (value) => parsePayload(value);
const parseStaffProfileListParams = (value) => parseListParams(value);

export { parseStaffProfileId, parseStaffProfilePayload, parseStaffProfileListParams };
