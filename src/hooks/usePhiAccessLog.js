/**
 * usePhiAccessLog Hook
 * File: usePhiAccessLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  listPhiAccessLogs,
  getPhiAccessLog,
  createPhiAccessLog,
  listPhiAccessLogsByUser,
} from '@features/phi-access-log';

const usePhiAccessLog = () =>
  useCrud({
    list: listPhiAccessLogs,
    get: getPhiAccessLog,
    create: createPhiAccessLog,
    listByUser: listPhiAccessLogsByUser,
  });

export default usePhiAccessLog;
