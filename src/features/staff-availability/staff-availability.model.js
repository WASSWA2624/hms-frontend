import { createCrudModel } from '@utils/crudModel';
const { normalize, normalizeList } = createCrudModel();
export const normalizeStaffAvailability = (v) => normalize(v);
export const normalizeStaffAvailabilityList = (v) => normalizeList(v);
