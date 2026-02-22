/**
 * Insurance Claim Use Cases
 * File: insurance-claim.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { insuranceClaimApi } from './insurance-claim.api';
import { normalizeInsuranceClaim, normalizeInsuranceClaimList } from './insurance-claim.model';
import {
  parseInsuranceClaimId,
  parseInsuranceClaimListParams,
  parseInsuranceClaimPayload,
} from './insurance-claim.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listInsuranceClaims = async (params = {}) =>
  execute(async () => {
    const parsed = parseInsuranceClaimListParams(params);
    const response = await insuranceClaimApi.list(parsed);
    return normalizeInsuranceClaimList(response.data);
  });

const getInsuranceClaim = async (id) =>
  execute(async () => {
    const parsedId = parseInsuranceClaimId(id);
    const response = await insuranceClaimApi.get(parsedId);
    return normalizeInsuranceClaim(response.data);
  });

const createInsuranceClaim = async (payload) =>
  execute(async () => {
    const parsed = parseInsuranceClaimPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INSURANCE_CLAIMS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeInsuranceClaim(parsed);
    }
    const response = await insuranceClaimApi.create(parsed);
    return normalizeInsuranceClaim(response.data);
  });

const updateInsuranceClaim = async (id, payload) =>
  execute(async () => {
    const parsedId = parseInsuranceClaimId(id);
    const parsed = parseInsuranceClaimPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INSURANCE_CLAIMS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeInsuranceClaim({ id: parsedId, ...parsed });
    }
    const response = await insuranceClaimApi.update(parsedId, parsed);
    return normalizeInsuranceClaim(response.data);
  });

const deleteInsuranceClaim = async (id) =>
  execute(async () => {
    const parsedId = parseInsuranceClaimId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.INSURANCE_CLAIMS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeInsuranceClaim({ id: parsedId });
    }
    const response = await insuranceClaimApi.remove(parsedId);
    return normalizeInsuranceClaim(response.data);
  });

const submitInsuranceClaim = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseInsuranceClaimId(id);
    const parsed = parseInsuranceClaimPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INSURANCE_CLAIMS.SUBMIT(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeInsuranceClaim({ id: parsedId, ...parsed });
    }
    const response = await insuranceClaimApi.submit(parsedId, parsed);
    return normalizeInsuranceClaim(response.data);
  });

const reconcileInsuranceClaim = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseInsuranceClaimId(id);
    const parsed = parseInsuranceClaimPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INSURANCE_CLAIMS.RECONCILE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeInsuranceClaim({ id: parsedId, ...parsed });
    }
    const response = await insuranceClaimApi.reconcile(parsedId, parsed);
    return normalizeInsuranceClaim(response.data);
  });

export {
  listInsuranceClaims,
  getInsuranceClaim,
  createInsuranceClaim,
  updateInsuranceClaim,
  deleteInsuranceClaim,
  submitInsuranceClaim,
  reconcileInsuranceClaim,
};
