/**
 * Ward Model
 * File: ward.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeWard = (value) => normalize(value);
const normalizeWardList = (value) => normalizeList(value);

export { normalizeWard, normalizeWardList };
