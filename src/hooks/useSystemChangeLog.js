/**
 * useSystemChangeLog Hook
 * File: useSystemChangeLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  listSystemChangeLogs,
  getSystemChangeLog,
  createSystemChangeLog,
  updateSystemChangeLog,
  approveSystemChangeLog,
  implementSystemChangeLog,
} from '@features/system-change-log';

const useSystemChangeLog = () =>
  useCrud({
    list: listSystemChangeLogs,
    get: getSystemChangeLog,
    create: createSystemChangeLog,
    update: updateSystemChangeLog,
    approve: approveSystemChangeLog,
    implement: implementSystemChangeLog,
  });

export default useSystemChangeLog;
