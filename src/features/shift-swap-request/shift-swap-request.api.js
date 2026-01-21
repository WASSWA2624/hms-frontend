/**
 * Shift Swap Request API
 * File: shift-swap-request.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const shiftSwapRequestApi = createCrudApi(endpoints.SHIFT_SWAP_REQUESTS);

export { shiftSwapRequestApi };
