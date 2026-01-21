/**
 * Visit Queue Rules
 * File: visit-queue.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseVisitQueueId = (value) => parseId(value);
const parseVisitQueuePayload = (value) => parsePayload(value);
const parseVisitQueueListParams = (value) => parseListParams(value);

export { parseVisitQueueId, parseVisitQueuePayload, parseVisitQueueListParams };
