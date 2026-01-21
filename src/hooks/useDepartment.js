/**
 * useDepartment Hook
 * File: useDepartment.js
 */
import useCrud from '@hooks/useCrud';
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  listDepartmentUnits,
  listDepartments,
  updateDepartment,
} from '@features/department';

const useDepartment = () =>
  useCrud({
    list: listDepartments,
    get: getDepartment,
    create: createDepartment,
    update: updateDepartment,
    remove: deleteDepartment,
    listUnits: listDepartmentUnits,
  });

export default useDepartment;
