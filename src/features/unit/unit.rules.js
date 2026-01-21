/**
 * Unit Rules
 * File: unit.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseUnitId = (value) => parseId(value);
const parseUnitPayload = (value) => parsePayload(value);
const parseUnitListParams = (value) => parseListParams(value);

export { parseUnitId, parseUnitPayload, parseUnitListParams };
