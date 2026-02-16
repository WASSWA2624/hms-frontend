/**
 * Equipment Registry Model
 * File: equipment-registry.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentRegistry = (value) => normalize(value);
const normalizeEquipmentRegistryList = (value) => normalizeList(value);

export { normalizeEquipmentRegistry, normalizeEquipmentRegistryList };
