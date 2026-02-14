/**
 * useAnesthesiaRecord Hook
 * File: useAnesthesiaRecord.js
 */
import useCrud from '@hooks/useCrud';
import {
  createAnesthesiaRecord,
  deleteAnesthesiaRecord,
  getAnesthesiaRecord,
  listAnesthesiaRecords,
  updateAnesthesiaRecord,
} from '@features/anesthesia-record';

const useAnesthesiaRecord = () =>
  useCrud({
    list: listAnesthesiaRecords,
    get: getAnesthesiaRecord,
    create: createAnesthesiaRecord,
    update: updateAnesthesiaRecord,
    remove: deleteAnesthesiaRecord,
  });

export default useAnesthesiaRecord;
