/**
 * useVisitQueue Hook
 * File: useVisitQueue.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createVisitQueue,
  deleteVisitQueue,
  getVisitQueue,
  listVisitQueues,
  prioritizeVisitQueue,
  updateVisitQueue,
} from '@features/visit-queue';

const useVisitQueue = () => {
  const actions = useMemo(
    () => ({
      list: listVisitQueues,
      get: getVisitQueue,
      create: createVisitQueue,
      update: updateVisitQueue,
      remove: deleteVisitQueue,
      prioritize: prioritizeVisitQueue,
    }),
    []
  );

  return useCrud(actions);
};

export default useVisitQueue;
