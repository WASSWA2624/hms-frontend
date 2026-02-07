import { createCrudApi } from '@services/api';
import { endpoints } from '@config/endpoints';

const shiftTemplateApi = createCrudApi(endpoints.SHIFT_TEMPLATES);
export { shiftTemplateApi };
