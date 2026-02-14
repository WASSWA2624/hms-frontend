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
  deleteShift
} from '@features/shift';

const useShift = () =>
  useCrud({
    list: listShifts,
    get: getShift,
    create: createShift,
    update: updateShift,
    remove: deleteShift,
  });

export default useShift;
