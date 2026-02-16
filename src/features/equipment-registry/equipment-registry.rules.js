/**
 * Equipment Registry Rules
 * File: equipment-registry.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentRegistryId = (value) => parseId(value);
const parseEquipmentRegistryPayload = (value) => parsePayload(value);
const parseEquipmentRegistryListParams = (value) => parseListParams(value);

export {
  parseEquipmentRegistryId,
  parseEquipmentRegistryPayload,
  parseEquipmentRegistryListParams,
};
