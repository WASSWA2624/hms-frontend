/**
 * Referral API
 * File: referral.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const referralApi = createCrudApi(endpoints.REFERRALS);
referralApi.approve = (id, payload = {}) =>
  apiClient({
    url: endpoints.REFERRALS.APPROVE(id),
    method: 'POST',
    body: payload,
  });
referralApi.start = (id, payload = {}) =>
  apiClient({
    url: endpoints.REFERRALS.START(id),
    method: 'POST',
    body: payload,
  });
referralApi.cancel = (id, payload = {}) =>
  apiClient({
    url: endpoints.REFERRALS.CANCEL(id),
    method: 'POST',
    body: payload,
  });
referralApi.redeem = (id, payload = {}) =>
  apiClient({
    url: endpoints.REFERRALS.REDEEM(id),
    method: 'POST',
    body: payload,
  });

export { referralApi };
