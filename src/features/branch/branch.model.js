/**
 * Branch Model
 * File: branch.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeBranch = (value) => normalize(value);
const normalizeBranchList = (value) => normalizeList(value);

export { normalizeBranch, normalizeBranchList };
