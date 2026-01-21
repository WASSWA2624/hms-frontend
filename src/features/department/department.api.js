/**
 * Department API
 * File: department.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const departmentApi = createCrudApi(endpoints.DEPARTMENTS);

const getDepartmentUnitsApi = (id) =>
  apiClient({
    url: endpoints.DEPARTMENTS.GET_UNITS(id),
    method: 'GET',
  });

export { departmentApi, getDepartmentUnitsApi };
