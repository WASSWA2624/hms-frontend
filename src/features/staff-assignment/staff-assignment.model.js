/**
 * Staff Assignment Model
 * File: staff-assignment.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeStaffAssignment = (value) => normalize(value);
const normalizeStaffAssignmentList = (value) => normalizeList(value);

export { normalizeStaffAssignment, normalizeStaffAssignmentList };
