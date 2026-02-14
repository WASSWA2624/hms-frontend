/**
 * usePhiAccessLog Hook
 * File: usePhiAccessLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  listPhiAccessLogs,
  getPhiAccessLog,
  createPhiAccessLog,
  updatePhiAccessLog,
  deletePhiAccessLog
} from '@features/phi-access-log';

const usePhiAccessLog = () =>
  useCrud({
    list: listPhiAccessLogs,
    get: getPhiAccessLog,
    create: createPhiAccessLog,
    update: updatePhiAccessLog,
    remove: deletePhiAccessLog,
  });

export default usePhiAccessLog;
