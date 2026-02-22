/**
 * useNotification Hook
 * File: useNotification.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createNotification,
  deleteNotification,
  getNotification,
  listNotifications,
  markNotificationRead,
  markNotificationUnread,
  updateNotification,
} from '@features/notification';

const useNotification = () => {
  const actions = useMemo(
    () => ({
      list: listNotifications,
      get: getNotification,
      create: createNotification,
      update: updateNotification,
      remove: deleteNotification,
      markRead: markNotificationRead,
      markUnread: markNotificationUnread,
    }),
    []
  );

  return useCrud(actions);
};

export default useNotification;
