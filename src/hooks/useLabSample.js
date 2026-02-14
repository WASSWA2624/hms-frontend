/**
 * useLabSample Hook
 * File: useLabSample.js
 */
import useCrud from '@hooks/useCrud';
import {
  createLabSample,
  deleteLabSample,
  getLabSample,
  listLabSamples,
  updateLabSample,
} from '@features/lab-sample';

const useLabSample = () =>
  useCrud({
    list: listLabSamples,
    get: getLabSample,
    create: createLabSample,
    update: updateLabSample,
    remove: deleteLabSample,
  });

export default useLabSample;
