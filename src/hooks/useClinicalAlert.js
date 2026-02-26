/**
 * useClinicalAlert Hook
 * File: useClinicalAlert.js
 */
import useCrud from '@hooks/useCrud';
import {
  acknowledgeClinicalAlert,
  createClinicalAlert,
  deleteClinicalAlert,
  getClinicalAlert,
  listClinicalAlerts,
  resolveClinicalAlertAction,
  updateClinicalAlert,
} from '@features/clinical-alert';

const useClinicalAlert = () =>
  useCrud({
    list: listClinicalAlerts,
    get: getClinicalAlert,
    create: createClinicalAlert,
    update: updateClinicalAlert,
    remove: deleteClinicalAlert,
    acknowledge: acknowledgeClinicalAlert,
    resolve: resolveClinicalAlertAction,
  });

export default useClinicalAlert;
