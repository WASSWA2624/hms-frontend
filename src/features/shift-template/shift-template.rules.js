import { createCrudRules } from '@utils/crudRules';
const { parseId, parsePayload, parseListParams } = createCrudRules();
export const parseShiftTemplateId = (v) => parseId(v);
export const parseShiftTemplatePayload = (v) => parsePayload(v);
export const parseShiftTemplateListParams = (v) => parseListParams(v);
