/**
 * useClinicalAlertThreshold Hook
 * File: useClinicalAlertThreshold.js
 */
import useCrud from '@hooks/useCrud';
import {
  getClinicalAlertThresholds,
  updateClinicalAlertThresholds,
} from '@features/clinical-alert-threshold';

const useClinicalAlertThreshold = () =>
  useCrud({
    get: getClinicalAlertThresholds,
    update: updateClinicalAlertThresholds,
  });

export default useClinicalAlertThreshold;
