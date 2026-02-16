/**
 * useEquipmentWorkOrder Hook
 * File: useEquipmentWorkOrder.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentWorkOrders,
  getEquipmentWorkOrder,
  createEquipmentWorkOrder,
  updateEquipmentWorkOrder,
  deleteEquipmentWorkOrder
} from '@features/equipment-work-order';

const useEquipmentWorkOrder = () =>
  useCrud({
    list: listEquipmentWorkOrders,
    get: getEquipmentWorkOrder,
    create: createEquipmentWorkOrder,
    update: updateEquipmentWorkOrder,
    remove: deleteEquipmentWorkOrder,
  });

export default useEquipmentWorkOrder;
