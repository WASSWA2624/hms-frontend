/**
 * System Change Log Model
 * File: system-change-log.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeSystemChangeLog = (value) => normalize(value);
const normalizeSystemChangeLogList = (value) => normalizeList(value);

export { normalizeSystemChangeLog, normalizeSystemChangeLogList };
