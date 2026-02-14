/**
 * useImagingStudy Hook
 * File: useImagingStudy.js
 */
import useCrud from '@hooks/useCrud';
import {
  createImagingStudy,
  deleteImagingStudy,
  getImagingStudy,
  listImagingStudies,
  updateImagingStudy,
} from '@features/imaging-study';

const useImagingStudy = () =>
  useCrud({
    list: listImagingStudies,
    get: getImagingStudy,
    create: createImagingStudy,
    update: updateImagingStudy,
    remove: deleteImagingStudy,
  });

export default useImagingStudy;
