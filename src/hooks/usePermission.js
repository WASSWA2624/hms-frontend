/**
 * usePermission Hook
 * File: usePermission.js
 */
import useCrud from '@hooks/useCrud';
import {
  createPermission,
  deletePermission,
  getPermission,
  listPermissions,
  updatePermission,
} from '@features/permission';

const usePermission = () =>
  useCrud({
    list: listPermissions,
    get: getPermission,
    create: createPermission,
    update: updatePermission,
    remove: deletePermission,
  });

export default usePermission;
