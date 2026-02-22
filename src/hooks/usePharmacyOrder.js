/**
 * usePharmacyOrder Hook
 * File: usePharmacyOrder.js
 */
import useCrud from '@hooks/useCrud';
import {
  createPharmacyOrder,
  deletePharmacyOrder,
  dispensePharmacyOrder,
  getPharmacyOrder,
  listPharmacyOrders,
  updatePharmacyOrder,
} from '@features/pharmacy-order';

const usePharmacyOrder = () =>
  useCrud({
    list: listPharmacyOrders,
    get: getPharmacyOrder,
    create: createPharmacyOrder,
    update: updatePharmacyOrder,
    remove: deletePharmacyOrder,
    dispense: dispensePharmacyOrder,
  });

export default usePharmacyOrder;
