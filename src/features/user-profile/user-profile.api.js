/**
 * User Profile API
 * File: user-profile.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const userProfileApi = createCrudApi(endpoints.USER_PROFILES);

export { userProfileApi };
