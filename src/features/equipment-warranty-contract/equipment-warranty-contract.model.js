/**
 * Equipment Warranty Contract Model
 * File: equipment-warranty-contract.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentWarrantyContract = (value) => normalize(value);
const normalizeEquipmentWarrantyContractList = (value) => normalizeList(value);

export { normalizeEquipmentWarrantyContract, normalizeEquipmentWarrantyContractList };
