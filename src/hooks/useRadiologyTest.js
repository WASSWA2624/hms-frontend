/**
 * useRadiologyTest Hook
 * File: useRadiologyTest.js
 */
import useCrud from '@hooks/useCrud';
import {
  createRadiologyTest,
  deleteRadiologyTest,
  getRadiologyTest,
  listRadiologyTests,
  updateRadiologyTest,
} from '@features/radiology-test';

const useRadiologyTest = () =>
  useCrud({
    list: listRadiologyTests,
    get: getRadiologyTest,
    create: createRadiologyTest,
    update: updateRadiologyTest,
    remove: deleteRadiologyTest,
  });

export default useRadiologyTest;
