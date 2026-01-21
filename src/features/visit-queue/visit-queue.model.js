/**
 * Visit Queue Model
 * File: visit-queue.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeVisitQueue = (value) => normalize(value);
const normalizeVisitQueueList = (value) => normalizeList(value);

export { normalizeVisitQueue, normalizeVisitQueueList };
