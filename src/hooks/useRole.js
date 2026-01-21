/**
 * useRole Hook
 * File: useRole.js
 */
import useCrud from '@hooks/useCrud';
import { createRole, deleteRole, getRole, listRoles, updateRole } from '@features/role';

const useRole = () =>
  useCrud({
    list: listRoles,
    get: getRole,
    create: createRole,
    update: updateRole,
    remove: deleteRole,
  });

export default useRole;
