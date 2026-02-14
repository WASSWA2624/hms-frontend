/**
 * useIcuObservation Hook
 * File: useIcuObservation.js
 */
import useCrud from '@hooks/useCrud';
import {
  createIcuObservation,
  deleteIcuObservation,
  getIcuObservation,
  listIcuObservations,
  updateIcuObservation,
} from '@features/icu-observation';

const useIcuObservation = () =>
  useCrud({
    list: listIcuObservations,
    get: getIcuObservation,
    create: createIcuObservation,
    update: updateIcuObservation,
    remove: deleteIcuObservation,
  });

export default useIcuObservation;
