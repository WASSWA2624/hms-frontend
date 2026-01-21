/**
 * Shift Swap Request Rules
 * File: shift-swap-request.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseShiftSwapRequestId = (value) => parseId(value);
const parseShiftSwapRequestPayload = (value) => parsePayload(value);
const parseShiftSwapRequestListParams = (value) => parseListParams(value);

export { parseShiftSwapRequestId, parseShiftSwapRequestPayload, parseShiftSwapRequestListParams };
