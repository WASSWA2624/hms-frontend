/**
 * useAssetServiceLog Hook
 * File: useAssetServiceLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  listAssetServiceLogs,
  getAssetServiceLog,
  createAssetServiceLog,
  updateAssetServiceLog,
  deleteAssetServiceLog
} from '@features/asset-service-log';

const useAssetServiceLog = () =>
  useCrud({
    list: listAssetServiceLogs,
    get: getAssetServiceLog,
    create: createAssetServiceLog,
    update: updateAssetServiceLog,
    remove: deleteAssetServiceLog,
  });

export default useAssetServiceLog;
