import { createCrudApi } from '@services/api';
import { endpoints } from '@config/endpoints';

const rosterDayOffApi = createCrudApi(endpoints.ROSTER_DAY_OFFS);
export { rosterDayOffApi };
