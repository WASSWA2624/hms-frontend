/**
 * useRadiologyOrder Hook
 * File: useRadiologyOrder.js
 */
import useCrud from '@hooks/useCrud';
import {
  createRadiologyOrder,
  deleteRadiologyOrder,
  getRadiologyOrder,
  listRadiologyOrders,
  updateRadiologyOrder,
} from '@features/radiology-order';

const useRadiologyOrder = () =>
  useCrud({
    list: listRadiologyOrders,
    get: getRadiologyOrder,
    create: createRadiologyOrder,
    update: updateRadiologyOrder,
    remove: deleteRadiologyOrder,
  });

export default useRadiologyOrder;
