import { createCrudModel } from '@utils/crudModel';
const { normalize, normalizeList } = createCrudModel();
export const normalizeRosterDayOff = (v) => normalize(v);
export const normalizeRosterDayOffList = (v) => normalizeList(v);
