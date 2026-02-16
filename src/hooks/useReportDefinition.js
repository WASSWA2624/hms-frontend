/**
 * useReportDefinition Hook
 * File: useReportDefinition.js
 */
import useCrud from '@hooks/useCrud';
import {
  listReportDefinitions,
  getReportDefinition,
  createReportDefinition,
  updateReportDefinition,
  deleteReportDefinition
} from '@features/report-definition';

const useReportDefinition = () =>
  useCrud({
    list: listReportDefinitions,
    get: getReportDefinition,
    create: createReportDefinition,
    update: updateReportDefinition,
    remove: deleteReportDefinition,
  });

export default useReportDefinition;
