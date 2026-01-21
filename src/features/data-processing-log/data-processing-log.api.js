/**
 * Data Processing Log API
 * File: data-processing-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const dataProcessingLogApi = createCrudApi(endpoints.DATA_PROCESSING_LOGS);

export { dataProcessingLogApi };
