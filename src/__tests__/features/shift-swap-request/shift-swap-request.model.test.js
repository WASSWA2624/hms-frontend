/**
 * Shift Swap Request Model Tests
 * File: shift-swap-request.model.test.js
 */
import { normalizeShiftSwapRequest, normalizeShiftSwapRequestList } from '@features/shift-swap-request';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('shift-swap-request.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeShiftSwapRequest, normalizeShiftSwapRequestList);
  });
});
