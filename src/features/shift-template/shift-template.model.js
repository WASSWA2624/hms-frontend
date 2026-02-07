import { createCrudModel } from '@utils/crudModel';
const { normalize, normalizeList } = createCrudModel();
export const normalizeShiftTemplate = (v) => normalize(v);
export const normalizeShiftTemplateList = (v) => normalizeList(v);
