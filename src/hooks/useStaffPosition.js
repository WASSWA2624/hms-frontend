/**
 * useStaffPosition Hook
 * File: useStaffPosition.js
 */
import useCrud from '@hooks/useCrud';
import {
  listStaffPositions,
  getStaffPosition,
  createStaffPosition,
  updateStaffPosition,
  deleteStaffPosition,
} from '@features/staff-position';

const useStaffPosition = () =>
  useCrud({
    list: listStaffPositions,
    get: getStaffPosition,
    create: createStaffPosition,
    update: updateStaffPosition,
    remove: deleteStaffPosition,
  });

export default useStaffPosition;

