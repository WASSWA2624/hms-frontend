/**
 * User API
 * File: user.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const userApi = createCrudApi(endpoints.USERS);

export { userApi };
