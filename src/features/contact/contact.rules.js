/**
 * Contact Rules
 * File: contact.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseContactId = (value) => parseId(value);
const parseContactPayload = (value) => parsePayload(value);
const parseContactListParams = (value) => parseListParams(value);

export { parseContactId, parseContactPayload, parseContactListParams };
