import { createCrudRules } from '@utils/crudRules';
const { parseId, parsePayload, parseListParams } = createCrudRules();
export const parseRosterDayOffId = (v) => parseId(v);
export const parseRosterDayOffPayload = (v) => parsePayload(v);
export const parseRosterDayOffListParams = (v) => parseListParams(v);
