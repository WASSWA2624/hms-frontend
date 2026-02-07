/**
 * Nurse Roster Rules
 * File: nurse-roster.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseNurseRosterId = (value) => parseId(value);
const parseNurseRosterPayload = (value) => parsePayload(value);
const parseNurseRosterListParams = (value) => parseListParams(value);

export { parseNurseRosterId, parseNurseRosterPayload, parseNurseRosterListParams };
