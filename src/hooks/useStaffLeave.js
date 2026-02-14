/**
 * useStaffLeave Hook
 * File: useStaffLeave.js
 */
import useCrud from '@hooks/useCrud';
import {
  listStaffLeaves,
  getStaffLeave,
  createStaffLeave,
  updateStaffLeave,
  deleteStaffLeave
} from '@features/staff-leave';

const useStaffLeave = () =>
  useCrud({
    list: listStaffLeaves,
    get: getStaffLeave,
    create: createStaffLeave,
    update: updateStaffLeave,
    remove: deleteStaffLeave,
  });

export default useStaffLeave;
