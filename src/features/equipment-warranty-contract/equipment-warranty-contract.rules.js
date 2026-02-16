/**
 * Equipment Warranty Contract Rules
 * File: equipment-warranty-contract.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentWarrantyContractId = (value) => parseId(value);
const parseEquipmentWarrantyContractPayload = (value) => parsePayload(value);
const parseEquipmentWarrantyContractListParams = (value) => parseListParams(value);

export {
  parseEquipmentWarrantyContractId,
  parseEquipmentWarrantyContractPayload,
  parseEquipmentWarrantyContractListParams,
};
