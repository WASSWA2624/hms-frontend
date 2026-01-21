/**
 * User Role API
 * File: user-role.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const userRoleApi = createCrudApi(endpoints.USER_ROLES);

export { userRoleApi };
