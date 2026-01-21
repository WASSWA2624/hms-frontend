/**
 * Address Rules
 * File: address.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseAddressId = (value) => parseId(value);
const parseAddressPayload = (value) => parsePayload(value);
const parseAddressListParams = (value) => parseListParams(value);

export { parseAddressId, parseAddressPayload, parseAddressListParams };
