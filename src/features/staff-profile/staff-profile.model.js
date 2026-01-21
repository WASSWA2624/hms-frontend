/**
 * Staff Profile Model
 * File: staff-profile.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeStaffProfile = (value) => normalize(value);
const normalizeStaffProfileList = (value) => normalizeList(value);

export { normalizeStaffProfile, normalizeStaffProfileList };
