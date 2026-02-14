/**
 * useAuditLog Hook
 * File: useAuditLog.js
 */
import useCrud from '@hooks/useCrud';
import { listAuditLogs, getAuditLog } from '@features/audit-log';

const useAuditLog = () =>
  useCrud({
    list: listAuditLogs,
    get: getAuditLog,
  });

export default useAuditLog;
