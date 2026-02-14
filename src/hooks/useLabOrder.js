/**
 * useLabOrder Hook
 * File: useLabOrder.js
 */
import useCrud from '@hooks/useCrud';
import {
  createLabOrder,
  deleteLabOrder,
  getLabOrder,
  listLabOrders,
  updateLabOrder,
} from '@features/lab-order';

const useLabOrder = () =>
  useCrud({
    list: listLabOrders,
    get: getLabOrder,
    create: createLabOrder,
    update: updateLabOrder,
    remove: deleteLabOrder,
  });

export default useLabOrder;
