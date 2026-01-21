/**
 * Contact API
 * File: contact.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const contactApi = createCrudApi(endpoints.CONTACTS);

export { contactApi };
