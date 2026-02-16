/**
 * useShiftAssignment Hook
 * File: useShiftAssignment.js
 */
import useCrud from '@hooks/useCrud';
import {
  listShiftAssignments,
  getShiftAssignment,
  createShiftAssignment,
  updateShiftAssignment,
  deleteShiftAssignment,
} from '@features/shift-assignment';

const useShiftAssignment = () =>
  useCrud({
    list: listShiftAssignments,
    get: getShiftAssignment,
    create: createShiftAssignment,
    update: updateShiftAssignment,
    remove: deleteShiftAssignment,
  });

export default useShiftAssignment;
