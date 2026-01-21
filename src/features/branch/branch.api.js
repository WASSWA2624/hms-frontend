/**
 * Branch API
 * File: branch.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const branchApi = createCrudApi(endpoints.BRANCHES);

export { branchApi };
