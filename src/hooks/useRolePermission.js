/**
 * useRolePermission Hook
 * File: useRolePermission.js
 */
import useCrud from '@hooks/useCrud';
import {
  createRolePermission,
  deleteRolePermission,
  getRolePermission,
  listRolePermissions,
  updateRolePermission,
} from '@features/role-permission';

const useRolePermission = () =>
  useCrud({
    list: listRolePermissions,
    get: getRolePermission,
    create: createRolePermission,
    update: updateRolePermission,
    remove: deleteRolePermission,
  });

export default useRolePermission;
