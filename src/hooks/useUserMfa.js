/**
 * useUserMfa Hook
 * File: useUserMfa.js
 */
import useCrud from '@hooks/useCrud';
import {
  createUserMfa,
  deleteUserMfa,
  disableUserMfa,
  enableUserMfa,
  getUserMfa,
  listUserMfas,
  updateUserMfa,
  verifyUserMfa,
} from '@features/user-mfa';

const useUserMfa = () =>
  useCrud({
    list: listUserMfas,
    get: getUserMfa,
    create: createUserMfa,
    update: updateUserMfa,
    remove: deleteUserMfa,
    verify: verifyUserMfa,
    enable: enableUserMfa,
    disable: disableUserMfa,
  });

export default useUserMfa;
