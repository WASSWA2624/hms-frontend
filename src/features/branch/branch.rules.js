/**
 * Branch Rules
 * File: branch.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseBranchId = (value) => parseId(value);
const parseBranchPayload = (value) => parsePayload(value);
const parseBranchListParams = (value) => parseListParams(value);

export { parseBranchId, parseBranchPayload, parseBranchListParams };
