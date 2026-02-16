/**
 * Equipment Work Order Model
 * File: equipment-work-order.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentWorkOrder = (value) => normalize(value);
const normalizeEquipmentWorkOrderList = (value) => normalizeList(value);

export { normalizeEquipmentWorkOrder, normalizeEquipmentWorkOrderList };
