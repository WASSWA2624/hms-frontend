/**
 * useReferral Hook
 * File: useReferral.js
 */
import useCrud from '@hooks/useCrud';
import {
  approveReferral,
  cancelReferral,
  createReferral,
  deleteReferral,
  getReferral,
  listReferrals,
  redeemReferral,
  startReferral,
  updateReferral,
} from '@features/referral';

const useReferral = () =>
  useCrud({
    list: listReferrals,
    get: getReferral,
    create: createReferral,
    update: updateReferral,
    remove: deleteReferral,
    approve: approveReferral,
    start: startReferral,
    cancel: cancelReferral,
    redeem: redeemReferral,
  });

export default useReferral;
