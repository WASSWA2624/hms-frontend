/**
 * Clinical Term Rules
 * File: clinical-term.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseClinicalTermFavoriteId = (value) => parseId(value);
const parseClinicalTermPayload = (value) => parsePayload(value);
const parseClinicalTermListParams = (value) => parseListParams(value);

export {
  parseClinicalTermFavoriteId,
  parseClinicalTermPayload,
  parseClinicalTermListParams,
};
