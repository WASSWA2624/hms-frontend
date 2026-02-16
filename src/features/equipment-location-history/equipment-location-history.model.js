/**
 * Equipment Location History Model
 * File: equipment-location-history.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentLocationHistory = (value) => normalize(value);
const normalizeEquipmentLocationHistoryList = (value) => normalizeList(value);

export { normalizeEquipmentLocationHistory, normalizeEquipmentLocationHistoryList };
