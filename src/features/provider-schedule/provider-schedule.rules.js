/**
 * Provider Schedule Rules
 * File: provider-schedule.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseProviderScheduleId = (value) => parseId(value);
const parseProviderSchedulePayload = (value) => parsePayload(value);
const parseProviderScheduleListParams = (value) => parseListParams(value);

export { parseProviderScheduleId, parseProviderSchedulePayload, parseProviderScheduleListParams };
