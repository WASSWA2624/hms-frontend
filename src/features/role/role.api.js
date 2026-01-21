/**
 * Role API
 * File: role.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const roleApi = createCrudApi(endpoints.ROLES);

export { roleApi };
