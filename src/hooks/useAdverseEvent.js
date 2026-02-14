/**
 * useAdverseEvent Hook
 * File: useAdverseEvent.js
 */
import useCrud from '@hooks/useCrud';
import {
  createAdverseEvent,
  deleteAdverseEvent,
  getAdverseEvent,
  listAdverseEvents,
  updateAdverseEvent,
} from '@features/adverse-event';

const useAdverseEvent = () =>
  useCrud({
    list: listAdverseEvents,
    get: getAdverseEvent,
    create: createAdverseEvent,
    update: updateAdverseEvent,
    remove: deleteAdverseEvent,
  });

export default useAdverseEvent;
