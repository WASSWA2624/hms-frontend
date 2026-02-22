/**
 * useIntegrationLog Hook
 * File: useIntegrationLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  listIntegrationLogs,
  getIntegrationLog,
  listIntegrationLogsByIntegration,
  replayIntegrationLog,
} from '@features/integration-log';

const useIntegrationLog = () =>
  useCrud({
    list: listIntegrationLogs,
    get: getIntegrationLog,
    listByIntegration: listIntegrationLogsByIntegration,
    replay: replayIntegrationLog,
  });

export default useIntegrationLog;
