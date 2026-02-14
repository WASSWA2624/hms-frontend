/**
 * useIntegrationLog Hook
 * File: useIntegrationLog.js
 */
import useCrud from '@hooks/useCrud';
import { listIntegrationLogs, getIntegrationLog } from '@features/integration-log';

const useIntegrationLog = () =>
  useCrud({
    list: listIntegrationLogs,
    get: getIntegrationLog,
  });

export default useIntegrationLog;
