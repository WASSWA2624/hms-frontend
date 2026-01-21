/**
 * User MFA API
 * File: user-mfa.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const userMfaApi = createCrudApi(endpoints.USER_MFAS);

const verifyUserMfaApi = (id, payload) =>
  apiClient({
    url: endpoints.USER_MFAS.VERIFY(id),
    method: 'POST',
    body: payload,
  });

const enableUserMfaApi = (id, payload) =>
  apiClient({
    url: endpoints.USER_MFAS.ENABLE(id),
    method: 'POST',
    body: payload,
  });

const disableUserMfaApi = (id, payload) =>
  apiClient({
    url: endpoints.USER_MFAS.DISABLE(id),
    method: 'POST',
    body: payload,
  });

export { userMfaApi, verifyUserMfaApi, enableUserMfaApi, disableUserMfaApi };
