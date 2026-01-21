/**
 * useUnit Hook
 * File: useUnit.js
 */
import useCrud from '@hooks/useCrud';
import { createUnit, deleteUnit, getUnit, listUnits, updateUnit } from '@features/unit';

const useUnit = () =>
  useCrud({
    list: listUnits,
    get: getUnit,
    create: createUnit,
    update: updateUnit,
    remove: deleteUnit,
  });

export default useUnit;
