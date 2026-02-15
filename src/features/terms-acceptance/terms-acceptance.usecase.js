/**
 * Terms Acceptance Use Cases
 * File: terms-acceptance.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { termsAcceptanceApi } from './terms-acceptance.api';
import {
  normalizeTermsAcceptance,
  normalizeTermsAcceptanceList,
} from './terms-acceptance.model';
import {
  parseTermsAcceptanceId,
  parseTermsAcceptanceListParams,
  parseTermsAcceptancePayload,
} from './terms-acceptance.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listTermsAcceptances = async (params = {}) =>
  execute(async () => {
    const parsed = parseTermsAcceptanceListParams(params);
    const response = await termsAcceptanceApi.list(parsed);
    return normalizeTermsAcceptanceList(response.data);
  });

const getTermsAcceptance = async (id) =>
  execute(async () => {
    const parsedId = parseTermsAcceptanceId(id);
    const response = await termsAcceptanceApi.get(parsedId);
    return normalizeTermsAcceptance(response.data);
  });

const createTermsAcceptance = async (payload) =>
  execute(async () => {
    const parsed = parseTermsAcceptancePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.TERMS_ACCEPTANCES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeTermsAcceptance(parsed);
    }
    const response = await termsAcceptanceApi.create(parsed);
    return normalizeTermsAcceptance(response.data);
  });

const deleteTermsAcceptance = async (id) =>
  execute(async () => {
    const parsedId = parseTermsAcceptanceId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.TERMS_ACCEPTANCES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeTermsAcceptance({ id: parsedId });
    }
    const response = await termsAcceptanceApi.remove(parsedId);
    return normalizeTermsAcceptance(response.data);
  });

export {
  listTermsAcceptances,
  getTermsAcceptance,
  createTermsAcceptance,
  deleteTermsAcceptance,
};
