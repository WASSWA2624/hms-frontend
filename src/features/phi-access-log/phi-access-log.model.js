/**
 * PHI Access Log Model
 * File: phi-access-log.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizePhiAccessLog = (value) => normalize(value);
const normalizePhiAccessLogList = (value) => normalizeList(value);

export { normalizePhiAccessLog, normalizePhiAccessLogList };
