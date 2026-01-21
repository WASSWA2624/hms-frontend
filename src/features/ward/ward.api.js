/**
 * Ward API
 * File: ward.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const wardApi = createCrudApi(endpoints.WARDS);

const getWardBedsApi = (id) =>
  apiClient({
    url: endpoints.WARDS.GET_BEDS(id),
    method: 'GET',
  });

export { wardApi, getWardBedsApi };
