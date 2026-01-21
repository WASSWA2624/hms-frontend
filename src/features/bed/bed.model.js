/**
 * Bed Model
 * File: bed.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeBed = (value) => normalize(value);
const normalizeBedList = (value) => normalizeList(value);

export { normalizeBed, normalizeBedList };
