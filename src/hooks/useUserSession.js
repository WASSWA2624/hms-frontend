/**
 * useUserSession Hook
 * File: useUserSession.js
 */
import useCrud from '@hooks/useCrud';
import { getUserSession, listUserSessions, revokeUserSession } from '@features/user-session';

const useUserSession = () =>
  useCrud({
    list: listUserSessions,
    get: getUserSession,
    revoke: revokeUserSession,
  });

export default useUserSession;
