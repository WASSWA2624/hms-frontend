/**
 * Referral Use Cases
 * File: referral.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { referralApi } from './referral.api';
import { normalizeReferral, normalizeReferralList } from './referral.model';
import { parseReferralId, parseReferralListParams, parseReferralPayload } from './referral.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listReferrals = async (params = {}) =>
  execute(async () => {
    const parsed = parseReferralListParams(params);
    const response = await referralApi.list(parsed);
    return normalizeReferralList(response.data);
  });

const getReferral = async (id) =>
  execute(async () => {
    const parsedId = parseReferralId(id);
    const response = await referralApi.get(parsedId);
    return normalizeReferral(response.data);
  });

const createReferral = async (payload) =>
  execute(async () => {
    const parsed = parseReferralPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.REFERRALS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeReferral(parsed);
    }
    const response = await referralApi.create(parsed);
    return normalizeReferral(response.data);
  });

const updateReferral = async (id, payload) =>
  execute(async () => {
    const parsedId = parseReferralId(id);
    const parsed = parseReferralPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.REFERRALS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeReferral({ id: parsedId, ...parsed });
    }
    const response = await referralApi.update(parsedId, parsed);
    return normalizeReferral(response.data);
  });

const deleteReferral = async (id) =>
  execute(async () => {
    const parsedId = parseReferralId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.REFERRALS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeReferral({ id: parsedId });
    }
    const response = await referralApi.remove(parsedId);
    return normalizeReferral(response.data);
  });

const redeemReferral = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseReferralId(id);
    const parsed = parseReferralPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.REFERRALS.REDEEM(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeReferral({ id: parsedId, ...parsed });
    }
    const response = await referralApi.redeem(parsedId, parsed);
    return normalizeReferral(response.data);
  });

export {
  listReferrals,
  getReferral,
  createReferral,
  updateReferral,
  deleteReferral,
  redeemReferral,
};
