/**
 * useStaffAssignment Hook
 * File: useStaffAssignment.js
 */
import useCrud from '@hooks/useCrud';
import {
  listStaffAssignments,
  getStaffAssignment,
  createStaffAssignment,
  updateStaffAssignment,
  deleteStaffAssignment
} from '@features/staff-assignment';

const useStaffAssignment = () =>
  useCrud({
    list: listStaffAssignments,
    get: getStaffAssignment,
    create: createStaffAssignment,
    update: updateStaffAssignment,
    remove: deleteStaffAssignment,
  });

export default useStaffAssignment;
