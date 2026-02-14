/**
 * useLabTest Hook
 * File: useLabTest.js
 */
import useCrud from '@hooks/useCrud';
import {
  createLabTest,
  deleteLabTest,
  getLabTest,
  listLabTests,
  updateLabTest,
} from '@features/lab-test';

const useLabTest = () =>
  useCrud({
    list: listLabTests,
    get: getLabTest,
    create: createLabTest,
    update: updateLabTest,
    remove: deleteLabTest,
  });

export default useLabTest;
