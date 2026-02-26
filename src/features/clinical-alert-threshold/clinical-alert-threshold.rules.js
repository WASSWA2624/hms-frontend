/**
 * Clinical Alert Threshold Rules
 * File: clinical-alert-threshold.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parsePayload, parseListParams } = createCrudRules();

const parseClinicalAlertThresholdPayload = (value) => parsePayload(value);
const parseClinicalAlertThresholdParams = (value) => parseListParams(value);

export {
  parseClinicalAlertThresholdPayload,
  parseClinicalAlertThresholdParams,
};
