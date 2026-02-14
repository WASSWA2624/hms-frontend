/**
 * useDrug Hook
 * File: useDrug.js
 */
import useCrud from '@hooks/useCrud';
import { createDrug, deleteDrug, getDrug, listDrugs, updateDrug } from '@features/drug';

const useDrug = () =>
  useCrud({
    list: listDrugs,
    get: getDrug,
    create: createDrug,
    update: updateDrug,
    remove: deleteDrug,
  });

export default useDrug;
