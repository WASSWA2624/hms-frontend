/**
 * useCriticalAlert Hook
 * File: useCriticalAlert.js
 */
import useCrud from '@hooks/useCrud';
import {
  createCriticalAlert,
  deleteCriticalAlert,
  getCriticalAlert,
  listCriticalAlerts,
  updateCriticalAlert,
} from '@features/critical-alert';

const useCriticalAlert = () =>
  useCrud({
    list: listCriticalAlerts,
    get: getCriticalAlert,
    create: createCriticalAlert,
    update: updateCriticalAlert,
    remove: deleteCriticalAlert,
  });

export default useCriticalAlert;
