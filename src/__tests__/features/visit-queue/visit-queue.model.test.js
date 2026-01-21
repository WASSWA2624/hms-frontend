/**
 * Visit Queue Model Tests
 * File: visit-queue.model.test.js
 */
import { normalizeVisitQueue, normalizeVisitQueueList } from '@features/visit-queue';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('visit-queue.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeVisitQueue, normalizeVisitQueueList);
  });
});
