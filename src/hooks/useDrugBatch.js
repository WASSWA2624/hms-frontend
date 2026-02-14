/**
 * useDrugBatch Hook
 * File: useDrugBatch.js
 */
import useCrud from '@hooks/useCrud';
import {
  createDrugBatch,
  deleteDrugBatch,
  getDrugBatch,
  listDrugBatches,
  updateDrugBatch,
} from '@features/drug-batch';

const useDrugBatch = () =>
  useCrud({
    list: listDrugBatches,
    get: getDrugBatch,
    create: createDrugBatch,
    update: updateDrugBatch,
    remove: deleteDrugBatch,
  });

export default useDrugBatch;
