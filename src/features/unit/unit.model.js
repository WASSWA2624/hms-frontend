/**
 * Unit Model
 * File: unit.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeUnit = (value) => normalize(value);
const normalizeUnitList = (value) => normalizeList(value);

export { normalizeUnit, normalizeUnitList };
