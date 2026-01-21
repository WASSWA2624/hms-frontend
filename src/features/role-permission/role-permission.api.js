/**
 * Role Permission API
 * File: role-permission.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const rolePermissionApi = createCrudApi(endpoints.ROLE_PERMISSIONS);

export { rolePermissionApi };
