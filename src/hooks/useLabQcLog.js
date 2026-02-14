/**
 * useLabQcLog Hook
 * File: useLabQcLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  createLabQcLog,
  deleteLabQcLog,
  getLabQcLog,
  listLabQcLogs,
  updateLabQcLog,
} from '@features/lab-qc-log';

const useLabQcLog = () =>
  useCrud({
    list: listLabQcLogs,
    get: getLabQcLog,
    create: createLabQcLog,
    update: updateLabQcLog,
    remove: deleteLabQcLog,
  });

export default useLabQcLog;
