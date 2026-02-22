/**
 * Message API
 * File: message.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const messageApi = createCrudApi(endpoints.MESSAGES);

export { messageApi };
