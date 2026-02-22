/**
 * Insurance Claim API
 * File: insurance-claim.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const insuranceClaimApi = createCrudApi(endpoints.INSURANCE_CLAIMS);
insuranceClaimApi.submit = (id, payload = {}) =>
  apiClient({
    url: endpoints.INSURANCE_CLAIMS.SUBMIT(id),
    method: 'POST',
    body: payload,
  });
insuranceClaimApi.reconcile = (id, payload = {}) =>
  apiClient({
    url: endpoints.INSURANCE_CLAIMS.RECONCILE(id),
    method: 'POST',
    body: payload,
  });

export { insuranceClaimApi };
