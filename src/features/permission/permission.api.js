/**
 * Permission API
 * File: permission.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const permissionApi = createCrudApi(endpoints.PERMISSIONS);

export { permissionApi };
