/**
 * useLabOrderItem Hook
 * File: useLabOrderItem.js
 */
import useCrud from '@hooks/useCrud';
import {
  createLabOrderItem,
  deleteLabOrderItem,
  getLabOrderItem,
  listLabOrderItems,
  updateLabOrderItem,
} from '@features/lab-order-item';

const useLabOrderItem = () =>
  useCrud({
    list: listLabOrderItems,
    get: getLabOrderItem,
    create: createLabOrderItem,
    update: updateLabOrderItem,
    remove: deleteLabOrderItem,
  });

export default useLabOrderItem;
