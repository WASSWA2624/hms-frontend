/**
 * Clinical Alert Use Cases
 * File: clinical-alert.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { clinicalAlertApi } from './clinical-alert.api';
import { normalizeClinicalAlert, normalizeClinicalAlertList } from './clinical-alert.model';
import { parseClinicalAlertId, parseClinicalAlertListParams, parseClinicalAlertPayload } from './clinical-alert.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listClinicalAlerts = async (params = {}) =>
  execute(async () => {
    const parsed = parseClinicalAlertListParams(params);
    const response = await clinicalAlertApi.list(parsed);
    return normalizeClinicalAlertList(response.data);
  });

const getClinicalAlert = async (id) =>
  execute(async () => {
    const parsedId = parseClinicalAlertId(id);
    const response = await clinicalAlertApi.get(parsedId);
    return normalizeClinicalAlert(response.data);
  });

const createClinicalAlert = async (payload) =>
  execute(async () => {
    const parsed = parseClinicalAlertPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.CLINICAL_ALERTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeClinicalAlert(parsed);
    }
    const response = await clinicalAlertApi.create(parsed);
    return normalizeClinicalAlert(response.data);
  });

const updateClinicalAlert = async (id, payload) =>
  execute(async () => {
    const parsedId = parseClinicalAlertId(id);
    const parsed = parseClinicalAlertPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.CLINICAL_ALERTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeClinicalAlert({ id: parsedId, ...parsed });
    }
    const response = await clinicalAlertApi.update(parsedId, parsed);
    return normalizeClinicalAlert(response.data);
  });

const deleteClinicalAlert = async (id) =>
  execute(async () => {
    const parsedId = parseClinicalAlertId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.CLINICAL_ALERTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeClinicalAlert({ id: parsedId });
    }
    const response = await clinicalAlertApi.remove(parsedId);
    return normalizeClinicalAlert(response.data);
  });

const acknowledgeClinicalAlert = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseClinicalAlertId(id);
    const parsed = parseClinicalAlertPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.CLINICAL_ALERTS.ACKNOWLEDGE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeClinicalAlert({ id: parsedId, ...parsed, status: 'ACKNOWLEDGED' });
    }
    const response = await clinicalAlertApi.acknowledge(parsedId, parsed);
    return normalizeClinicalAlert(response.data);
  });

const resolveClinicalAlertAction = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseClinicalAlertId(id);
    const parsed = parseClinicalAlertPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.CLINICAL_ALERTS.RESOLVE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeClinicalAlert({ id: parsedId, ...parsed, status: 'RESOLVED' });
    }
    const response = await clinicalAlertApi.resolve(parsedId, parsed);
    return normalizeClinicalAlert(response.data);
  });

export {
  listClinicalAlerts,
  getClinicalAlert,
  createClinicalAlert,
  updateClinicalAlert,
  deleteClinicalAlert,
  acknowledgeClinicalAlert,
  resolveClinicalAlertAction,
};
