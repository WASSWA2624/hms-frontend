/**
 * Staff Leave Model
 * File: staff-leave.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeStaffLeave = (value) => normalize(value);
const normalizeStaffLeaveList = (value) => normalizeList(value);

export { normalizeStaffLeave, normalizeStaffLeaveList };
