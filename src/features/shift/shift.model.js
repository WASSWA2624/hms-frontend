/**
 * Shift Model
 * File: shift.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeShift = (value) => normalize(value);
const normalizeShiftList = (value) => normalizeList(value);

export { normalizeShift, normalizeShiftList };
