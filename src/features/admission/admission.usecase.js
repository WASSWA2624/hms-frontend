/**
 * Admission Use Cases
 * File: admission.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { admissionApi } from './admission.api';
import { normalizeAdmission, normalizeAdmissionList } from './admission.model';
import { parseAdmissionId, parseAdmissionListParams, parseAdmissionPayload } from './admission.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listAdmissions = async (params = {}) =>
  execute(async () => {
    const parsed = parseAdmissionListParams(params);
    const response = await admissionApi.list(parsed);
    return normalizeAdmissionList(response.data);
  });

const getAdmission = async (id) =>
  execute(async () => {
    const parsedId = parseAdmissionId(id);
    const response = await admissionApi.get(parsedId);
    return normalizeAdmission(response.data);
  });

const createAdmission = async (payload) =>
  execute(async () => {
    const parsed = parseAdmissionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ADMISSIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAdmission(parsed);
    }
    const response = await admissionApi.create(parsed);
    return normalizeAdmission(response.data);
  });

const updateAdmission = async (id, payload) =>
  execute(async () => {
    const parsedId = parseAdmissionId(id);
    const parsed = parseAdmissionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ADMISSIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeAdmission({ id: parsedId, ...parsed });
    }
    const response = await admissionApi.update(parsedId, parsed);
    return normalizeAdmission(response.data);
  });

const deleteAdmission = async (id) =>
  execute(async () => {
    const parsedId = parseAdmissionId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.ADMISSIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeAdmission({ id: parsedId });
    }
    const response = await admissionApi.remove(parsedId);
    return normalizeAdmission(response.data);
  });

const dischargeAdmission = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseAdmissionId(id);
    const parsed = parseAdmissionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ADMISSIONS.DISCHARGE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAdmission({ id: parsedId, status: 'DISCHARGED', ...parsed });
    }
    const response = await admissionApi.discharge(parsedId, parsed);
    return normalizeAdmission(response.data);
  });

export {
  listAdmissions,
  getAdmission,
  createAdmission,
  updateAdmission,
  deleteAdmission,
  dischargeAdmission,
};
