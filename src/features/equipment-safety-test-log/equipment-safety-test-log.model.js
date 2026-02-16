/**
 * Equipment Safety Test Log Model
 * File: equipment-safety-test-log.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentSafetyTestLog = (value) => normalize(value);
const normalizeEquipmentSafetyTestLogList = (value) => normalizeList(value);

export { normalizeEquipmentSafetyTestLog, normalizeEquipmentSafetyTestLogList };
