/**
 * useShiftSwapRequest Hook
 * File: useShiftSwapRequest.js
 */
import useCrud from '@hooks/useCrud';
import {
  listShiftSwapRequests,
  getShiftSwapRequest,
  createShiftSwapRequest,
  updateShiftSwapRequest,
  deleteShiftSwapRequest,
} from '@features/shift-swap-request';

const useShiftSwapRequest = () =>
  useCrud({
    list: listShiftSwapRequests,
    get: getShiftSwapRequest,
    create: createShiftSwapRequest,
    update: updateShiftSwapRequest,
    remove: deleteShiftSwapRequest,
  });

export default useShiftSwapRequest;
