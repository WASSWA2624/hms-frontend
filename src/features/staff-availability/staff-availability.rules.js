import { createCrudRules } from '@utils/crudRules';
const { parseId, parsePayload, parseListParams } = createCrudRules();
export const parseStaffAvailabilityId = (v) => parseId(v);
export const parseStaffAvailabilityPayload = (v) => parsePayload(v);
export const parseStaffAvailabilityListParams = (v) => parseListParams(v);
