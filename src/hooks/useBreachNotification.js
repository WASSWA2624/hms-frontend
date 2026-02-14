/**
 * useBreachNotification Hook
 * File: useBreachNotification.js
 */
import useCrud from '@hooks/useCrud';
import {
  listBreachNotifications,
  getBreachNotification,
  createBreachNotification,
  updateBreachNotification,
  deleteBreachNotification
} from '@features/breach-notification';

const useBreachNotification = () =>
  useCrud({
    list: listBreachNotifications,
    get: getBreachNotification,
    create: createBreachNotification,
    update: updateBreachNotification,
    remove: deleteBreachNotification,
  });

export default useBreachNotification;
