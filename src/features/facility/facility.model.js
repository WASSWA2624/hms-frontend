/**
 * Facility Model
 * File: facility.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeFacility = (value) => normalize(value);
const normalizeFacilityList = (value) => normalizeList(value);

export { normalizeFacility, normalizeFacilityList };
