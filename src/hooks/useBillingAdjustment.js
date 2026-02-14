/**
 * useBillingAdjustment Hook
 * File: useBillingAdjustment.js
 */
import useCrud from '@hooks/useCrud';
import {
  listBillingAdjustments,
  getBillingAdjustment,
  createBillingAdjustment,
  updateBillingAdjustment,
  deleteBillingAdjustment
} from '@features/billing-adjustment';

const useBillingAdjustment = () =>
  useCrud({
    list: listBillingAdjustments,
    get: getBillingAdjustment,
    create: createBillingAdjustment,
    update: updateBillingAdjustment,
    remove: deleteBillingAdjustment,
  });

export default useBillingAdjustment;
