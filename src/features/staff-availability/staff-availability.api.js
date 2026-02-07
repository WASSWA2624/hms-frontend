import { createCrudApi } from '@services/api';
import { endpoints } from '@config/endpoints';

const staffAvailabilityApi = createCrudApi(endpoints.STAFF_AVAILABILITIES);
export { staffAvailabilityApi };
