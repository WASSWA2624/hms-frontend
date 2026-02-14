/**
 * useFormularyItem Hook
 * File: useFormularyItem.js
 */
import useCrud from '@hooks/useCrud';
import {
  createFormularyItem,
  deleteFormularyItem,
  getFormularyItem,
  listFormularyItems,
  updateFormularyItem,
} from '@features/formulary-item';

const useFormularyItem = () =>
  useCrud({
    list: listFormularyItems,
    get: getFormularyItem,
    create: createFormularyItem,
    update: updateFormularyItem,
    remove: deleteFormularyItem,
  });

export default useFormularyItem;
