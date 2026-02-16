/**
 * useReportRun Hook
 * File: useReportRun.js
 */
import useCrud from '@hooks/useCrud';
import {
  listReportRuns,
  getReportRun,
  createReportRun,
  updateReportRun,
  deleteReportRun
} from '@features/report-run';

const useReportRun = () =>
  useCrud({
    list: listReportRuns,
    get: getReportRun,
    create: createReportRun,
    update: updateReportRun,
    remove: deleteReportRun,
  });

export default useReportRun;
