/**
 * Facility Rules
 * File: facility.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseFacilityId = (value) => parseId(value);
const parseFacilityPayload = (value) => parsePayload(value);
const parseFacilityListParams = (value) => parseListParams(value);

export { parseFacilityId, parseFacilityPayload, parseFacilityListParams };
