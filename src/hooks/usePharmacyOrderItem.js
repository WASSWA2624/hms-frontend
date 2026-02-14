/**
 * usePharmacyOrderItem Hook
 * File: usePharmacyOrderItem.js
 */
import useCrud from '@hooks/useCrud';
import {
  createPharmacyOrderItem,
  deletePharmacyOrderItem,
  getPharmacyOrderItem,
  listPharmacyOrderItems,
  updatePharmacyOrderItem,
} from '@features/pharmacy-order-item';

const usePharmacyOrderItem = () =>
  useCrud({
    list: listPharmacyOrderItems,
    get: getPharmacyOrderItem,
    create: createPharmacyOrderItem,
    update: updatePharmacyOrderItem,
    remove: deletePharmacyOrderItem,
  });

export default usePharmacyOrderItem;
