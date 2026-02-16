/**
 * Equipment Spare Part Model
 * File: equipment-spare-part.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentSparePart = (value) => normalize(value);
const normalizeEquipmentSparePartList = (value) => normalizeList(value);

export { normalizeEquipmentSparePart, normalizeEquipmentSparePartList };
