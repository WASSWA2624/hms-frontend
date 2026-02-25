/**
 * Doctor API
 * File: doctor.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const doctorApi = createCrudApi(endpoints.DOCTORS);

export { doctorApi };
