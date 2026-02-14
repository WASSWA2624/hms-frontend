/**
 * useDataProcessingLog Hook
 * File: useDataProcessingLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  listDataProcessingLogs,
  getDataProcessingLog,
  createDataProcessingLog,
  updateDataProcessingLog,
  deleteDataProcessingLog
} from '@features/data-processing-log';

const useDataProcessingLog = () =>
  useCrud({
    list: listDataProcessingLogs,
    get: getDataProcessingLog,
    create: createDataProcessingLog,
    update: updateDataProcessingLog,
    remove: deleteDataProcessingLog,
  });

export default useDataProcessingLog;
