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
  deleteEquipmentWorkOrder,
  startEquipmentWorkOrder,
  returnToServiceEquipmentWorkOrder,
} from '@features/equipment-work-order';

const useEquipmentWorkOrder = () =>
  useCrud({
    list: listEquipmentWorkOrders,
    get: getEquipmentWorkOrder,
    create: createEquipmentWorkOrder,
    update: updateEquipmentWorkOrder,
    remove: deleteEquipmentWorkOrder,
    start: startEquipmentWorkOrder,
    returnToService: returnToServiceEquipmentWorkOrder,
  });

export default useEquipmentWorkOrder;
