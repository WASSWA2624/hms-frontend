/**
 * useIcuStay Hook
 * File: useIcuStay.js
 */
import useCrud from '@hooks/useCrud';
import {
  createIcuStay,
  deleteIcuStay,
  getIcuStay,
  listIcuStays,
  updateIcuStay,
} from '@features/icu-stay';

const useIcuStay = () =>
  useCrud({
    list: listIcuStays,
    get: getIcuStay,
    create: createIcuStay,
    update: updateIcuStay,
    remove: deleteIcuStay,
  });

export default useIcuStay;
