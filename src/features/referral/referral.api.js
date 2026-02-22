/**
 * Referral API
 * File: referral.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const referralApi = createCrudApi(endpoints.REFERRALS);
referralApi.redeem = (id, payload = {}) =>
  apiClient({
    url: endpoints.REFERRALS.REDEEM(id),
    method: 'POST',
    body: payload,
  });

export { referralApi };
