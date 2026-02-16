/**
 * Equipment Category Rules
 * File: equipment-category.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentCategoryId = (value) => parseId(value);
const parseEquipmentCategoryPayload = (value) => parsePayload(value);
const parseEquipmentCategoryListParams = (value) => parseListParams(value);

export {
  parseEquipmentCategoryId,
  parseEquipmentCategoryPayload,
  parseEquipmentCategoryListParams,
};
