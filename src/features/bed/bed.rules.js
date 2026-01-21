/**
 * Bed Rules
 * File: bed.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseBedId = (value) => parseId(value);
const parseBedPayload = (value) => parsePayload(value);
const parseBedListParams = (value) => parseListParams(value);

export { parseBedId, parseBedPayload, parseBedListParams };
