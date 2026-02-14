/**
 * useDischargeSummary Hook
 * File: useDischargeSummary.js
 */
import useCrud from '@hooks/useCrud';
import {
  createDischargeSummary,
  deleteDischargeSummary,
  getDischargeSummary,
  listDischargeSummaries,
  updateDischargeSummary,
} from '@features/discharge-summary';

const useDischargeSummary = () =>
  useCrud({
    list: listDischargeSummaries,
    get: getDischargeSummary,
    create: createDischargeSummary,
    update: updateDischargeSummary,
    remove: deleteDischargeSummary,
  });

export default useDischargeSummary;
