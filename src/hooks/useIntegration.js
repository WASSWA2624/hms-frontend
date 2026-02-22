/**
 * useIntegration Hook
 * File: useIntegration.js
 */
import useCrud from '@hooks/useCrud';
import {
  listIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  testIntegrationConnection,
  syncIntegrationNow,
} from '@features/integration';

const useIntegration = () =>
  useCrud({
    list: listIntegrations,
    get: getIntegration,
    create: createIntegration,
    update: updateIntegration,
    remove: deleteIntegration,
    testConnection: testIntegrationConnection,
    syncNow: syncIntegrationNow,
  });

export default useIntegration;
