/**
 * useUserRole Hook
 * File: useUserRole.js
 */
import useCrud from '@hooks/useCrud';
import { createUserRole, deleteUserRole, getUserRole, listUserRoles, updateUserRole } from '@features/user-role';

const useUserRole = () =>
  useCrud({
    list: listUserRoles,
    get: getUserRole,
    create: createUserRole,
    update: updateUserRole,
    remove: deleteUserRole,
  });

export default useUserRole;
