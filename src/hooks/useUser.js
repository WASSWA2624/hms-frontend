/**
 * useUser Hook
 * File: useUser.js
 */
import useCrud from '@hooks/useCrud';
import { createUser, deleteUser, getUser, listUsers, updateUser } from '@features/user';

const useUser = () =>
  useCrud({
    list: listUsers,
    get: getUser,
    create: createUser,
    update: updateUser,
    remove: deleteUser,
  });

export default useUser;
