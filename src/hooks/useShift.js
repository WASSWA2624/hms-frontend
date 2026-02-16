/**
 * useShift Hook
 * File: useShift.js
 */
import useCrud from '@hooks/useCrud';
import {
  listShifts,
  getShift,
  createShift,
  updateShift,
  deleteShift,
  publishShift,
} from '@features/shift';

const useShift = () =>
  useCrud({
    list: listShifts,
    get: getShift,
    create: createShift,
    update: updateShift,
    remove: deleteShift,
    publish: publishShift,
  });

export default useShift;
