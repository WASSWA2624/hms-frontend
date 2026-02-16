/**
 * Equipment Downtime Log Model
 * File: equipment-downtime-log.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentDowntimeLog = (value) => normalize(value);
const normalizeEquipmentDowntimeLogList = (value) => normalizeList(value);

export { normalizeEquipmentDowntimeLog, normalizeEquipmentDowntimeLogList };
