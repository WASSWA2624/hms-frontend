/**
 * OAuth Account API
 * File: oauth-account.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const oauthAccountApi = createCrudApi(endpoints.OAUTH_ACCOUNTS);

export { oauthAccountApi };
