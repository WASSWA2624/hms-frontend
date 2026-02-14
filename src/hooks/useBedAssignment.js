/**
 * useBedAssignment Hook
 * File: useBedAssignment.js
 */
import useCrud from '@hooks/useCrud';
import {
  createBedAssignment,
  deleteBedAssignment,
  getBedAssignment,
  listBedAssignments,
  updateBedAssignment,
} from '@features/bed-assignment';

const useBedAssignment = () =>
  useCrud({
    list: listBedAssignments,
    get: getBedAssignment,
    create: createBedAssignment,
    update: updateBedAssignment,
    remove: deleteBedAssignment,
  });

export default useBedAssignment;
