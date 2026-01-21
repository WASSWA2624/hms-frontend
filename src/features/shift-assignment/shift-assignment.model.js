/**
 * Shift Assignment Model
 * File: shift-assignment.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeShiftAssignment = (value) => normalize(value);
const normalizeShiftAssignmentList = (value) => normalizeList(value);

export { normalizeShiftAssignment, normalizeShiftAssignmentList };
