/**
 * Clinical Term Use Cases
 * File: clinical-term.usecase.js
 */
import { handleError } from '@errors';
import { clinicalTermApi } from './clinical-term.api';
import {
  normalizeClinicalTermFavorites,
  normalizeClinicalTermSuggestions,
} from './clinical-term.model';
import {
  parseClinicalTermFavoriteId,
  parseClinicalTermListParams,
  parseClinicalTermPayload,
} from './clinical-term.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const getClinicalTermSuggestions = async (params = {}) =>
  execute(async () => {
    const parsed = parseClinicalTermListParams(params);
    const response = await clinicalTermApi.suggestions(parsed);
    return normalizeClinicalTermSuggestions(response.data);
  });

const listClinicalTermFavorites = async (params = {}) =>
  execute(async () => {
    const parsed = parseClinicalTermListParams(params);
    const response = await clinicalTermApi.listFavorites(parsed);
    return normalizeClinicalTermFavorites(response.data);
  });

const createClinicalTermFavorite = async (payload = {}) =>
  execute(async () => {
    const parsed = parseClinicalTermPayload(payload);
    const response = await clinicalTermApi.createFavorite(parsed);
    return response.data || {};
  });

const deleteClinicalTermFavorite = async (id) =>
  execute(async () => {
    const parsedId = parseClinicalTermFavoriteId(id);
    const response = await clinicalTermApi.deleteFavorite(parsedId);
    return response.data || { id: parsedId };
  });

export {
  getClinicalTermSuggestions,
  listClinicalTermFavorites,
  createClinicalTermFavorite,
  deleteClinicalTermFavorite,
};
