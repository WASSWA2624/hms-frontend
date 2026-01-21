/**
 * useApiKey Hook
 * File: useApiKey.js
 */
import useCrud from '@hooks/useCrud';
import { createApiKey, deleteApiKey, getApiKey, listApiKeys, updateApiKey } from '@features/api-key';

const useApiKey = () =>
  useCrud({
    list: listApiKeys,
    get: getApiKey,
    create: createApiKey,
    update: updateApiKey,
    remove: deleteApiKey,
  });

export default useApiKey;
