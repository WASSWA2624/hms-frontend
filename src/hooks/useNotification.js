/**
 * useNotification Hook
 * File: useNotification.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  getNotification,
  getNotificationPreferences,
  listNotifications,
  listNotificationTargets,
  markNotificationRead,
  markNotificationUnread,
  updateNotificationPreferences,
} from '@features/notification';

const useNotification = () => {
  const actions = useMemo(
    () => ({
      list: listNotifications,
      get: getNotification,
      markRead: markNotificationRead,
      markUnread: markNotificationUnread,
      listTargets: listNotificationTargets,
      getPreferences: getNotificationPreferences,
      updatePreferences: updateNotificationPreferences,
    }),
    []
  );

  return useCrud(actions);
};

export default useNotification;
