/**
 * useReferral Hook
 * File: useReferral.js
 */
import useCrud from '@hooks/useCrud';
import {
  createReferral,
  deleteReferral,
  getReferral,
  listReferrals,
  redeemReferral,
  updateReferral,
} from '@features/referral';

const useReferral = () =>
  useCrud({
    list: listReferrals,
    get: getReferral,
    create: createReferral,
    update: updateReferral,
    remove: deleteReferral,
    redeem: redeemReferral,
  });

export default useReferral;
