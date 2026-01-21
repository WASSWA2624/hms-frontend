/**
 * Provider Schedule Model
 * File: provider-schedule.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeProviderSchedule = (value) => normalize(value);
const normalizeProviderScheduleList = (value) => normalizeList(value);

export { normalizeProviderSchedule, normalizeProviderScheduleList };
