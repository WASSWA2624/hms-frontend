/**
 * Address API
 * File: address.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const addressApi = createCrudApi(endpoints.ADDRESSES);

export { addressApi };
