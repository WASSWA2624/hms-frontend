/**
 * Data Processing Log Model
 * File: data-processing-log.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeDataProcessingLog = (value) => normalize(value);
const normalizeDataProcessingLogList = (value) => normalizeList(value);

export { normalizeDataProcessingLog, normalizeDataProcessingLogList };
