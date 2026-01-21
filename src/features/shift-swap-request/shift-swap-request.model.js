/**
 * Shift Swap Request Model
 * File: shift-swap-request.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeShiftSwapRequest = (value) => normalize(value);
const normalizeShiftSwapRequestList = (value) => normalizeList(value);

export { normalizeShiftSwapRequest, normalizeShiftSwapRequestList };
