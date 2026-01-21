/**
 * OAuth Account Use Cases
 * File: oauth-account.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { oauthAccountApi } from './oauth-account.api';
import { normalizeOauthAccount, normalizeOauthAccountList } from './oauth-account.model';
import {
  parseOauthAccountId,
  parseOauthAccountListParams,
  parseOauthAccountPayload,
} from './oauth-account.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listOauthAccounts = async (params = {}) =>
  execute(async () => {
    const parsed = parseOauthAccountListParams(params);
    const response = await oauthAccountApi.list(parsed);
    return normalizeOauthAccountList(response.data);
  });

const getOauthAccount = async (id) =>
  execute(async () => {
    const parsedId = parseOauthAccountId(id);
    const response = await oauthAccountApi.get(parsedId);
    return normalizeOauthAccount(response.data);
  });

const createOauthAccount = async (payload) =>
  execute(async () => {
    const parsed = parseOauthAccountPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.OAUTH_ACCOUNTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeOauthAccount(parsed);
    }
    const response = await oauthAccountApi.create(parsed);
    return normalizeOauthAccount(response.data);
  });

const updateOauthAccount = async (id, payload) =>
  execute(async () => {
    const parsedId = parseOauthAccountId(id);
    const parsed = parseOauthAccountPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.OAUTH_ACCOUNTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeOauthAccount({ id: parsedId, ...parsed });
    }
    const response = await oauthAccountApi.update(parsedId, parsed);
    return normalizeOauthAccount(response.data);
  });

const deleteOauthAccount = async (id) =>
  execute(async () => {
    const parsedId = parseOauthAccountId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.OAUTH_ACCOUNTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeOauthAccount({ id: parsedId });
    }
    const response = await oauthAccountApi.remove(parsedId);
    return normalizeOauthAccount(response.data);
  });

export {
  listOauthAccounts,
  getOauthAccount,
  createOauthAccount,
  updateOauthAccount,
  deleteOauthAccount,
};
