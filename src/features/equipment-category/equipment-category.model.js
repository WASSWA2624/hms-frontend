/**
 * Equipment Category Model
 * File: equipment-category.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentCategory = (value) => normalize(value);
const normalizeEquipmentCategoryList = (value) => normalizeList(value);

export { normalizeEquipmentCategory, normalizeEquipmentCategoryList };
