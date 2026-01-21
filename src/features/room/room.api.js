/**
 * Room API
 * File: room.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const roomApi = createCrudApi(endpoints.ROOMS);

export { roomApi };
