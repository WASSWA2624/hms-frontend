/**
 * Facility API
 * File: facility.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const facilityApi = createCrudApi(endpoints.FACILITIES);

const getFacilityBranchesApi = (id) =>
  apiClient({
    url: endpoints.FACILITIES.GET_BRANCHES(id),
    method: 'GET',
  });

export { facilityApi, getFacilityBranchesApi };
