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
  signOffRadiologyResult,
  updateRadiologyResult,
} from '@features/radiology-result';

const useRadiologyResult = () =>
  useCrud({
    list: listRadiologyResults,
    get: getRadiologyResult,
    create: createRadiologyResult,
    update: updateRadiologyResult,
    remove: deleteRadiologyResult,
    signOff: signOffRadiologyResult,
  });

export default useRadiologyResult;
