/**
 * useRadiologyResult Hook
 * File: useRadiologyResult.js
 */
import useCrud from '@hooks/useCrud';
import {
  createRadiologyResult,
  deleteRadiologyResult,
  getRadiologyResult,
  listRadiologyResults,
  updateRadiologyResult,
} from '@features/radiology-result';

const useRadiologyResult = () =>
  useCrud({
    list: listRadiologyResults,
    get: getRadiologyResult,
    create: createRadiologyResult,
    update: updateRadiologyResult,
    remove: deleteRadiologyResult,
  });

export default useRadiologyResult;
