/**
 * Staff Position Model
 * File: staff-position.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeStaffPosition = (value) => normalize(value);
const normalizeStaffPositionList = (value) => normalizeList(value);

export { normalizeStaffPosition, normalizeStaffPositionList };

