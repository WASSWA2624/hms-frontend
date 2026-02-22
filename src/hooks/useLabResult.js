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
  releaseLabResult,
  updateLabResult,
} from '@features/lab-result';

const useLabResult = () =>
  useCrud({
    list: listLabResults,
    get: getLabResult,
    create: createLabResult,
    update: updateLabResult,
    remove: deleteLabResult,
    release: releaseLabResult,
  });

export default useLabResult;
