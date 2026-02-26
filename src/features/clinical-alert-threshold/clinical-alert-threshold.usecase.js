/**
 * Clinical Alert Threshold Use Cases
 * File: clinical-alert-threshold.usecase.js
 */
import { handleError } from '@errors';
import { clinicalAlertThresholdApi } from './clinical-alert-threshold.api';
import {
  parseClinicalAlertThresholdParams,
  parseClinicalAlertThresholdPayload,
} from './clinical-alert-threshold.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const getClinicalAlertThresholds = async (params = {}) =>
  execute(async () => {
    const parsed = parseClinicalAlertThresholdParams(params);
    const response = await clinicalAlertThresholdApi.get(parsed);
    return response.data || [];
  });

const updateClinicalAlertThresholds = async (payload = {}) =>
  execute(async () => {
    const parsed = parseClinicalAlertThresholdPayload(payload);
    const response = await clinicalAlertThresholdApi.update(parsed);
    return response.data || [];
  });

export { getClinicalAlertThresholds, updateClinicalAlertThresholds };
