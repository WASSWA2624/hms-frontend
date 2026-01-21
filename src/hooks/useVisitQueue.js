/**
 * useVisitQueue Hook
 * File: useVisitQueue.js
 */
import useCrud from '@hooks/useCrud';
import {
  createVisitQueue,
  deleteVisitQueue,
  getVisitQueue,
  listVisitQueues,
  updateVisitQueue,
} from '@features/visit-queue';

const useVisitQueue = () =>
  useCrud({
    list: listVisitQueues,
    get: getVisitQueue,
    create: createVisitQueue,
    update: updateVisitQueue,
    remove: deleteVisitQueue,
  });

export default useVisitQueue;
