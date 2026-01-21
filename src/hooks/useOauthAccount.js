/**
 * useOauthAccount Hook
 * File: useOauthAccount.js
 */
import useCrud from '@hooks/useCrud';
import {
  createOauthAccount,
  deleteOauthAccount,
  getOauthAccount,
  listOauthAccounts,
  updateOauthAccount,
} from '@features/oauth-account';

const useOauthAccount = () =>
  useCrud({
    list: listOauthAccounts,
    get: getOauthAccount,
    create: createOauthAccount,
    update: updateOauthAccount,
    remove: deleteOauthAccount,
  });

export default useOauthAccount;
