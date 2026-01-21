/**
 * useApiKeyPermission Hook
 * File: useApiKeyPermission.js
 */
import useCrud from '@hooks/useCrud';
import {
  createApiKeyPermission,
  deleteApiKeyPermission,
  getApiKeyPermission,
  listApiKeyPermissions,
  updateApiKeyPermission,
} from '@features/api-key-permission';

const useApiKeyPermission = () =>
  useCrud({
    list: listApiKeyPermissions,
    get: getApiKeyPermission,
    create: createApiKeyPermission,
    update: updateApiKeyPermission,
    remove: deleteApiKeyPermission,
  });

export default useApiKeyPermission;
