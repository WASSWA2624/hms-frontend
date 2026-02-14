/**
 * useLabResult Hook
 * File: useLabResult.js
 */
import useCrud from '@hooks/useCrud';
import {
  createLabResult,
  deleteLabResult,
  getLabResult,
  listLabResults,
  updateLabResult,
} from '@features/lab-result';

const useLabResult = () =>
  useCrud({
    list: listLabResults,
    get: getLabResult,
    create: createLabResult,
    update: updateLabResult,
    remove: deleteLabResult,
  });

export default useLabResult;
